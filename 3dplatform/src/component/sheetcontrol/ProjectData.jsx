import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { ViewerContext } from "../Context";
import Exceltransform from "../Exceltransform";
import Sidebardb from "../dashboard/Sidebardb";
import FormBudget from "./FormBudget";
import {BASE_URL} from "../../constants.js";

const ProjectData = () => {
  const {
    setProjects,
    setSelectedProject,
    isModalOpenBudget,
    setIsModalOpenBudget,
    setIsEditMode,
    formatCurrency,
    projects,
    openEditForm,
  } = useContext(ViewerContext);

  const [allSheets, setAllSheets] = useState([]);
  console.log("🚀 ~ ProjectData ~ allSheets:", allSheets)
  const openModal = () => {
    setIsModalOpenBudget(true);
    setIsEditMode(false);
  };

  const comparateDates = (date1, date2) => {
    return new Date(date1) - new Date(date2);
  };

  useEffect(() => {
    // Función para obtener proyectos junto con las sheets .. sheets viene anidado en projects
    const fetchProjects = async () => {
      try {
        const response = await axios.get(BASE_URL + "/project/");

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
  }, [setProjects, isModalOpenBudget]);

  const handleDeleteOC = async (sheetid) => {
    const isConfirmed = window.confirm("¿Está seguro de que quiere borrar?");

    if (!isConfirmed) {
      return;
    }
    try {
      const response = await axios.delete(
        `${BASE_URL}/sheet/${sheetid}`
      );
      if (response.status === 200) {
        setSelectedProject((prevSelectedProject) => {
          const updatedProject = { ...prevSelectedProject };

          // Filtrar el array sheets para remover el elemento eliminado
          updatedProject.sheets = updatedProject?.sheets?.filter(
            (sheet) => sheet._id !== sheetid
          );

          return updatedProject;
        });
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  useEffect(() => {
    // Crear un nuevo arreglo para almacenar todas las sheets de todos los proyectos
    let allSheets = [];
    projects.forEach((project) => {
      // Concatenar las sheets de cada proyecto al arreglo allSheets
      allSheets = allSheets.concat(project.sheets);
    });
    allSheets.sort((a, b) => comparateDates(a.date, b.date));
    setAllSheets(allSheets);
  }, [projects]);
  const formatedDate = (isoDate) => {
    if (!isoDate) return "";

    const date = new Date(isoDate);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();

    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(month).padStart(2, "0");

    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  
  return (
    <div className=" shadow-xl rounded-xl flex bg-gradient-to-r from-blue-500">
      <Sidebardb />
      <FormBudget />
      <div className="bg-white rounded-xl ml-4 mt-5 mb-6">
        <h1 className="text-lg ml-8 font-semibold mt-4 text-center ">
          MAESTRO DE ORDENES DE COMPRAS
        </h1>
        <div className="flex grow">
          {/* <div className="ml-10 mt-4 text-lg bg-blue-500 text-white p-1  w-50 rounded-lg ">
            <div>
              <label className="text-xs p-1" htmlFor="filterType">
                Filter Type
                <input
                  placeholder=" Filter by Family"
                  id="filterType"
                  type="text"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                ></input>
              </label>
            </div>
          </div> */}
          <div className="">
            <button
              onClick={openModal}
              className="flex  bg-blue-500 mt-1 ml-4 p-2 text-white rounded-lg text-xs  "
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
              </svg>
              Create new register
            </button>
          </div>
        </div>
        <div
          className=" overflow-y-auto mb-4 mt-4 text-center ml-2 mr-2"
          style={{ height: "800px", width: "1300px" }}
        >
          {/* <Exceltransform UrlEndpoint=BASE_URL + "/sheet/" /> */}
          <table className=" mr-8  w-full sticky ">
            <thead className="sticky top-0 bg-blue-500 text-white">
              <tr className="border border-slate-00  text-xxs  ">
                <th className="border border-slate-500 p-2">ProjectId</th>
                <th className="border border-slate-500">Fecha</th>
                <th className="border border-slate-500">Familia</th>
                <th className="border border-slate-500">subFamilia</th>
                <th className="border border-slate-500 ">O/C</th>
                <th className="border border-slate-500">
                  Subcontrato/Proveedor
                </th>
                <th className="border border-slate-500">Descripcion</th>
                <th className="border border-slate-500">Total</th>
                {/* <th className="border border-slate-500">Borrar</th> */}
                <th className="border border-slate-500">Editar</th>
              </tr>
            </thead>
            <tbody>
              {allSheets.map((item, z) => (
                <tr key={z} className=" text-xxs ">
                  <td className="border border-slate-300 ">{item.projectId}</td>
                  <td className="border border-slate-300">
                    {formatedDate(item.date)}
                  </td>
                  <td className="border border-slate-300">{item.family}</td>
                 <td className="border border-slate-300">
                    {item.rawData && item.rawData.recepcion && item.rawData.recepcion.map((recepcion, index) => (
                      <div key={index}>
                        {recepcion.detalleRecepcion && recepcion.detalleRecepcion.map((detalle, i) => (
                          <div key={i}>
                            {detalle.distribucionCosto && detalle.distribucionCosto.map((distribucion, j) => (
                              <p key={j}>{distribucion.descripcioncentcosto}</p>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </td>
                  <td className="border border-slate-300 ">{item.cod}</td>
                  <td className="border border-slate-300">
                    {item.subcontractorOffers}
                  </td>
                  <td className="border border-slate-300">
                    {item.rawData && item.rawData.recepcion && item.rawData.recepcion.map((recepcion, index) => (
                      <div key={index}>
                        {recepcion.detalleRecepcion && recepcion.detalleRecepcion.map((detalle, i) => (
                          <p key={i}>{detalle.descripcion}</p>
                        ))}
                      </div>
                    ))}
                  </td>
                  <td className="border border-slate-300">
                    {formatCurrency(item.rawData?.subTotal)}
                  </td>
                  {/* <td className=" border border-slate-300">
                    <button
                      className=" bg-red-500  p-1 text-white rounded-lg text-xs"
                      onClick={() => handleDeleteOC(item._id || item.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-3 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </td> */}
                  <td className="border border-slate-300">
                    <button
                      onClick={() => openEditForm(item)}
                      className=" bg-green-500 p-1 text-white rounded-lg  "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectData;
