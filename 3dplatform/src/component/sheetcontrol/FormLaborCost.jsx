import { useState, useContext } from "react";
import axios from "axios";
import Modal from "../Modal";
import { ViewerContext } from "../Context";
import {BASE_URL} from "../../constants.js";

const FormLaborCost = () => {
  // Asumiendo que periodId se pasa como prop
  const { isModalOpen, setIsMoldalOpen, currentPeriodId, setCurrentPeriodId } =

    useContext(ViewerContext);
  const [realMonthCost, setRealMonthCost] = useState("");

  const closeModal = () => setIsMoldalOpen(false);

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(BASE_URL + "/labor/", {
        currentPeriodId,
        realMonthCost,
      });
      console.log("Respuesta completa del servidor:", response);
  
      // Verificar si realMonthCost está disponible en la respuesta
      if(response.data && response.data.realMonthCost) {
        updateTotalsWithAccumulated({
          currentPeriodId,
          realMonthCost: response.data.realMonthCost,
        });
      } else {
        console.log("realMonthCost no está definido en la respuesta:", response.data);
      }
  
      closeModal();
    } catch (error) {
      console.error("Error al enviar datos:", error);
    }
  };
  

  return (
    <Modal isOpen={isModalOpen}>
      <form onSubmit={handleUpdateProject}>
        <h1 className="text-white text-lg">Ingresar Nuevo Valor</h1>
        <div>
          <label className="text-sm font-semibolt ml-4">
            Valor mensual
            <input
              className="mt-1 border border-solid bg-blue-500 rounded-xl p-2 mb-2 flex mr-2 ml-2 text-white"
              placeholder="realmonthcost"
              type="text"
              name="realmonthcost"
              value={realMonthCost}
              onChange={(e) => setRealMonthCost(e.target.value)}
            />
          </label>
        </div>
        <div className="flex justify-between">
          <button
            className="bg-green-500 rounded-lg text-white text-sm p-2 mt-2 mb-2"
            type="submit"
          >
            Enviar
          </button>
          <button
            onClick={closeModal}
            className="bg-red-500 rounded-lg text-white text-sm p-2 mt-2 mb-2"
          >
            Cerrar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FormLaborCost;
