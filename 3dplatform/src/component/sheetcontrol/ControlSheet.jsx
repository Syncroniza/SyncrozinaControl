import { useState, useContext } from "react";
import axios from "axios";
import Modal from "../Modal";
import { ViewerContext } from "../Context";
import {BASE_URL} from "../../constants.js";

const ControlSheet = () => {
  const { isModalOpen, setIsMoldalOpen: updateModalOpen } =
    useContext(ViewerContext);

  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // const [isModalOpen, setIsMoldalOpen] = useState(false);

  // const openModal = () => setIsMoldalOpen(true);
  const closeModal = () => updateModalOpen(false);

  const handleUpdateProject = (e) => {
    e.preventDefault();

    axios.post(BASE_URL + "/project", {
      projectId: projectId,
      projectName: projectName,
      startDate: startDate,
      endDate: endDate,
    });
  };

  return (
    <div className="">
      <div className="">
        <div className=""></div>
        <Modal isOpen={isModalOpen}>
          <form onSubmit={handleUpdateProject}>
            <div className="   ">
              <h1 className="text-white text-lg">Crear Nuevo Projecto</h1>
              <div className=" ">
                <div className="">
                  <label className="text-sm font-semibolt ml-4 text-white">
                    ProjectId
                    <input
                      className="mt-1 border border-solid bg-blue-500 rounded-lg p-2 mb-2 flex  mr-2 ml-2 text-white"
                      placeholder="ProjectId"
                      type="text"
                      name="projectId"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                    />
                  </label>
                </div>
                <div className="">
                  <label className="text-sm font-semibolt ml-4 text-white">
                    Nombre del Projecto
                    <input
                      className="mt-1 border border-solid bg-blue-500 rounded-lg p-2 mb-2 flex  mr-2 ml-2 text-white"
                      placeholder="Project name"
                      type="text"
                      name="projectname"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </label>
                </div>
                <div>
                  <label className="text-sm text-white font-semibolt mr-4 ml-4">
                    Fecha de Inicio 
                  <input
                    className="mt-1 border border-solid bg-blue-500 text-white rounded-lg p-2 mb-2 flex  ml-2"
                    placeholder="Project name"
                    type="date"
                    name="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    />
                    </label>

                  <div>
                    <label className="text-sm text-white font-semibolt mr-4 ml-4">
                      Fecha de Termino
                    <input
                      className="mt-1 border border-solid bg-blue-500 text-white rounded-lg p-2 mb-2 flex  ml-2"
                      placeholder="End name"
                      type="date"
                      name="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      />
                      </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                className="bg-green-500 rounded-lg text-white text-sm p-2 mt-2  mb-2"
                type="submit">
                Enviar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeModal();
                }}
                className="bg-red-500 rounded-lg text-white text-sm p-2 mt-2  mb-2">
                Cerrar
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default ControlSheet;
