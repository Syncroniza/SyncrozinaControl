import { useState, useContext } from "react";
import { ViewerContext } from "../Context";
import axios from "axios";
import Modal from "../Modal";
import {BASE_URL} from "../../constants.js";


const FormAreaChart = () => {
  const {
    projectId,
    setProjectId,
    isModalOpenProgress,
    setIsModalOpenProgress,
    currentProgressId,
    isEditMode,
  } = useContext(ViewerContext);
  const [dateStart, setDateStart] = useState("");
  const [finishdate, setFinishDate] = useState("");
  const [planValue, setPlanValue] = useState("");
  const [earnValue, setEarnValue] = useState("");
  const [actualCost, setActualCost] = useState("");
  const [week, setWeek] = useState("");

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const progressData = {
      projectId: projectId || undefined,
      week: week || undefined,
      dateStart: dateStart || undefined,
      finishdate: finishdate || undefined,
      planValue: planValue || undefined,
      earnValue: earnValue || undefined,
      actualCost: actualCost || undefined,
    };

    try {
      if (isEditMode) {
        resetForm();
        await axios.patch(
          `${BASE_URL}/progress/${currentProgressId}`,
          progressData
        );
      } else {
        await axios.post(BASE_URL + "/progress/", progressData);
      }
      closeModal();
    } catch (err) {
      console.error("Error submit Observation Contract", err);
    }
  };
  const resetForm = () => {
    setProjectId("");
  };
  const closeModal = () => {
    setProjectId("");
    setWeek("");
    setDateStart("");
    setFinishDate("");
    setPlanValue("");
    setEarnValue(""); 
    setActualCost("");
    setIsModalOpenProgress(false);
  };

  return (
    <div className="flex">
      
      <div className="mt-4 ml-4 ">
        <Modal isOpen={isModalOpenProgress}>
          <h1 className="text-xs font-blod mb-2 text-white">
            {isEditMode ? "Modo Editar" : "Modo Crear"}
          </h1>
          <form
            className="mt-4 flex flex-col rounded-lg text-xs"
            onSubmit={handleOnSubmit}>
            <h2 className="text-center   text-white font-light text-xs">
              Add new Data
            </h2>
            <div>
              <div>
                <label className="text-white text-xs">
                  ProjectId
                  <input
                    className="mt-1 border border-solid  rounded-lg p-1 w-full mb-2 text-xs"
                    placeholder="ProjectId"
                    type="text"
                    name="ProjectId"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    disabled 
                  />
                </label>
                <label className="text-white text-xs">
                  Week number
                  <input
                    className="mt-1 border border-solid rounded-lg p-1 w-full mb-2"
                    placeholder="week number"
                    type="number"
                    name="week"
                    value={week}
                    onChange={(e) => setWeek(e.target.value)}
                    disabled 
                  />
                </label>
              </div>{" "}
              <label className="text-white text-xs">
                DateStart
                <input
                  className="mt-1 border  border-solid rounded-lg p-1 w-full mb-2"
                  placeholder="dateStart"
                  type="date"
                  name="dateStart"
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                  disabled 
                />
              </label>
              <label className="text-white text-xs">
                FinishDate
                <input
                  className="mt-1 border border-solid rounded-lg p-1 w-full mb-2"
                  type="date"
                  name="date"
                  value={finishdate}
                  onChange={(e) => setFinishDate(e.target.value)}
                  disabled 
                />
              </label>
            </div>
            <div>
              <label className="text-white text-xs">
                Valor Planificado
                <input
                  className="mt-1 border border-solid  rounded-lg p-1 w-full mb-2"
                  placeholder="planValue"
                  type="text"
                  name="planValue"
                  value={planValue}
                  onChange={(e) => setPlanValue(e.target.value)}
                  disabled 
                />
              </label>
            </div>
            <div>
              <label className="text-white text-xs">
                Valor Ganado
                <input
                  className="mt-1 border bg-blue-500 border-solid rounded-lg p-1 w-full mb-2"
                  placeholder="EarnValue"
                  type="text"
                  name="earnValue"
                  value={earnValue}
                  onChange={(e) => setEarnValue(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label className="text-white text-xs">
                Valor Actual
                <input
                  className="mt-1 border border-solid rounded-lg p-1 w-full mb-2"
                  placeholder="valor Actual"
                  type="text"
                  name="actualCost"
                  value={actualCost}
                  onChange={(e) => setActualCost(e.target.value)}
                  disabled 
                />
              </label>
            </div>{" "}
            <button
              className="bg-green-500 rounded-lg text-white p-1 mt-2"
              type="submit">
              Submit
            </button>
            <button
              onClick={closeModal}
              className="bg-red-500 p-1 rounded-lg text-white mt-2">
              Close Form
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default FormAreaChart;