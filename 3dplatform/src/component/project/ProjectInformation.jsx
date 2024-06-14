import { useEffect, useContext, useState } from "react";
import { ViewerContext } from "../Context";
import axios from "axios";

const ProjectInformation = () => {
  const {
    projects,
    setProjects,
    setSelectedProject,
    selectedProject,
    selectedProjectId,
    setSelectedProjectId,
    setIsMoldalOpen,
    totalBudget,
    formatCurrency,
    grandTotal,
    aernValueAccumalated,
    accumulatedRealMonthCost,
    totalAvanceReal,
  } = useContext(ViewerContext);

  const openModal = () => setIsMoldalOpen(true);
  const [totalActualCost, setTotalActualCost] = useState("");

  useEffect(() => {
    // Función para obtener proyectos junto con las sheets .. sheets viene anodado en projects
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:8000/project/");

        if (
          Array.isArray(response.data.data) &&
          response.data.data.length > 0
        ) {
          setProjects(response.data.data); // Actualiza el estado de proyectos
        } else {
          console.error("Empty array of projects", response);
        }
      } catch (error) {
        console.error("Error fetching projects", error);
      }
    };

    fetchProjects();
  }, []);

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
    <div className="" style={{ width: "1250px" }}>
      <h1 className=" text-lg text-center font-semibold p-2 mb-2 ml-4 bg-white  mr-2 mt-6 shadow-xl rounded-lg ">
        INFORMACION GENERAL DEL PROYECTO
      </h1>
      <div className="flex bg-white ml-4 mr-2 mt-6 shadow-xl rounded-lg ">
        <div className="col-span-4 mr-2">
          {/* --------------------  NO BORRRAR SE OCULTO AL USUARIO ------------------ */}
           <button
            onClick={openModal}
            type="button"
            className="flex bg-blue-500 bg-gradient-to-r from-indigo-500 p-2 text-white rounded-lg text-xs gap-2 mt-4 ml-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              dataslot="icon"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>{" "}
            Crear Nuevo Proyecto
          </button> 

          <h1 className="text-xs font-semibold ml-4 mt-2 ">
            SELECCIONAR PROYECTO
          </h1>
          <select
            className="bg-blue-500 bg-gradient-to-r from-indigo-500 p-2 ml-4 rounded-lg text-white text-xs"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="">Select a Project</option>
            {projects.map((project) => (
              <option key={project._id} value={project.projectId}>
                {project.projectName}/{project.projectId}
              </option>
            ))}
          </select>
          <table className=" mt-4 mb-6 border border-slate-300 ml-4 rounded-lg">
            <thead>
              <tr className="  px-4 text-xs bg-blue-500 bg-gradient-to-r from-indigo-500 text-white font-normal ">
                <th className="border border-slate-300 px-4 ">ProjectId</th>
                <th className="border border-slate-300 px-4 ">
                  Nombre Proyecto
                </th>
                <th className="border border-slate-300 px-4">Fecha Inicio</th>
                <th className="border border-slate-300 px-4">Fecha Termino</th>
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
        <div className="grid grid-cols-5 ">
          <div className=" flex flex-grow-0 ml-4">
            {filteredDataProject && (
              <div className="  text-center bg-blue-500 bg-gradient-to-r from-indigo-500 px-1 grid grid-rows-2 rounded-xl shadow-xl mt-4 mb-4 mr-3 ">
                <div className="text-lg mt-2 text-white">Presupuesto: </div>
                <div className=" text-lg text-white  ">
                  {formatCurrency(grandTotal)}
                </div>
              </div>
            )}
          </div>
          <div className=" text-center bg-blue-500 bg-gradient-to-r from-indigo-500  grid grid-rows-2 px-1  rounded-xl shadow-xl mt-4 mb-4 mr-3">
            <h1 className="text-lg mt-2 text-white px-2">
              Gastado (Facturas ) :
            </h1>
            <div className="text-lg text-white ">
              {formatCurrency(totalActualCost)}
            </div>
          </div>
          <div className=" text-center bg-blue-500 bg-gradient-to-r from-indigo-500  grid grid-rows-2 px-1  rounded-xl shadow-xl mt-4 mb-4 mr-3">
            <h1 className="text-lg mt-2 text-white px-2">Mano de Obra :</h1>
            <div className="text-lg text-white ">
              {formatCurrency(accumulatedRealMonthCost)}
            </div>
          </div>
          <div className=" text-center bg-blue-500 bg-gradient-to-r from-indigo-500  grid grid-rows-2 px-1  rounded-xl shadow-xl mt-4 mb-4 mr-3 ">
            <h1 className=" text-lg mt-2 text-white px-2">Disponible:</h1>
            <div className="text-lg text-white ">
              {formatCurrency(grandTotal - totalActualCost-accumulatedRealMonthCost)}
            </div>
          </div>
          <div className=" text-center bg-blue-500 bg-gradient-to-r from-indigo-500  grid grid-rows-2 px-1  rounded-xl shadow-xl mt-4 mb-4 mr-3">
            <h1 className="text-lg mt-2 text-white px-2">% Avance Obra</h1>
            <div className="text-lg text-white ">
              {totalAvanceReal}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInformation;
