import { useEffect, useContext, useState } from "react";
import { ViewerContext } from "../Context";

const ProjectInformation = () => {
  const {
    projects,
    setSelectedProject,
    selectedProject,
    selectedProjectId,
    setSelectedProjectId,
    setIsMoldalOpen,
    totalBudget,
    formatCurrency,
    grandTotal,
    aernValueAccumalated,
  } = useContext(ViewerContext);
    
  const openModal = () => setIsMoldalOpen(true);
  const [totalActualCost, setTotalActualCost] = useState("");
  
  useEffect(() => {
    const project = projects.find((p) => p.projectId === selectedProjectId);
    setSelectedProject(project);
  }, [selectedProjectId, projects]);

  // filtro del total presupuestado de cada proyecto
  const filteredDataProject = totalBudget.filter((item) => {
    const passesProjectId =
      !selectedProjectId || item.projectId === selectedProjectId;

    return passesProjectId;
  });
 
  useEffect(() => {
    const filteredData = aernValueAccumalated.filter(
      (item) => item.projectId === selectedProjectId
    );
    const totalActualCost = filteredData.reduce(
      (acc, item) => acc + (item.totalByWeekValue || 0),
      0
    );

    setTotalActualCost(totalActualCost); // Actualiza el contexto
  }, [aernValueAccumalated, selectedProjectId, setTotalActualCost]);

  return (
    <div className="">
        <h1 className=" text-sm text-center font-semibold p-2 mb-2 ml-4 bg-white  mr-2 mt-6 shadow-xl rounded-lg  ">
          INFORMACION GENERAL DEL PROYECTO
        </h1>
      <div className="flex bg-white ml-4 mr-2 mt-6 shadow-xl rounded-lg ">

        <div className="col-span-4 mr-2">
          <button
            onClick={openModal}
            type="button"
            className="flex bg-blue-500 p-2 text-white rounded-lg text-sm gap-2 mt-4 ml-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              dataslot="icon"
              className="w-4 h-4">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>{" "}
            Crear Nuevo Proyecto
          </button>

          <h1 className="text-sm font-semibold ml-4 mt-2 ">
            SELECCIONAR PROYECTO
          </h1>
          <select
            className="bg-blue-500 p-2 ml-4 rounded-xs text-white text-sm"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}>
            <option value="">Select a Project</option>
            {projects.map((project) => (
              <option key={project._id} value={project.projectId}>
                {project.projectName}/{project.projectId}
              </option>
            ))}
          </select>
          <table className="table-auto mt-4 mb-6 border-collapse border border-slate-300 ml-4 rounded-xs">
            <thead>
              <tr className=" text-gray-600  px-4 text-xs ">
                <th className="border border-slate-300 px-4 text-xs bg-blue-500 text-white font-normal">
                  ProjectId
                </th>
                <th className="border border-slate-300 px-4 text-xs  bg-blue-500 text-white  font-normal ">
                  Nombre Proyecto
                </th>
                <th className="border border-slate-300 px-4 text-xs bg-blue-500 text-white font-normal ">
                  Fecha Inicio
                </th>
                <th className="border border-slate-300 px-4 text-xs bg-blue-500 text-white font-normal ">
                  Fecha Termino
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border text-gray-00 border-slate-300 px-4 text-xs ">
                  {selectedProject?.projectId || "N/A"}
                </td>
                <td className="border border-slate-300 px-4 text-xs text-gray-500">
                  {selectedProject?.projectName || "N/A"}
                </td>
                <td className="border border-slate-300 px-4 text-xs text-gray-500 ">
                  {selectedProject?.startDate || "N/A"}
                </td>
                <td className="border border-slate-300 px-4 text-xs text-gray-500 ">
                  {selectedProject?.endDate || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-3 ">
          <div className=" ">
            {filteredDataProject && (
              <div className="  text-center bg-blue-500 px-10  rounded-xl shadow-xl mt-4 mb-4 mr-3 ">
                <div className="text-sm mt-14 text-white ">Presupuesto: </div>
                <div className="text-lg text-white mt-4">
                  {formatCurrency(grandTotal)}
                </div>
              </div>
            )}
          </div>
          <div className=" text-center bg-blue-500 px-10  rounded-xl shadow-xl mt-4 mb-4 mr-3">
            <h1 className="text-sm mt-14 text-white">
              Gastado (Facturas) :
            </h1>
            <div className="text-lg text-white mt-4">
              {formatCurrency(totalActualCost)}
            </div>
          </div>
          <div className=" text-center bg-blue-500 px-10  rounded-xl shadow-xl mt-4 mb-4 mr-3 ">
            <h1 className=" text-sm mt-14 text-white">Disponible:</h1>
            <div className="text-lg text-white mt-4">
              {formatCurrency(grandTotal - totalActualCost)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInformation;
