import { useContext, useEffect, useState } from "react";
import { ViewerContext } from "../Context";
import { Tooltip as ReactTooltip } from "react-tooltip";

function CarsInformationGeneralProgress() {
  const {
    aernValueAccumalated,
    totalPlanValue,
    projectDuration,
    setProjectDuration,
    avanceRealTotal,
    setAvanceRealTotal,
  } = useContext(ViewerContext);

  const [selectedWeek, setSelectedWeek] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (!selectedWeek) return;

    const filtered = aernValueAccumalated.filter((data) => {
      return formatedDate(data.finishdate) === selectedWeek; // Usar la misma función de formato
    });

    setFilteredData(filtered);

    // Calcular la duración del proyecto en días corridos
    if (aernValueAccumalated.length > 0) {
      const startDate = new Date(aernValueAccumalated[0].dateStart); // Primera fecha de inicio del proyecto
      const endDate = new Date(
        aernValueAccumalated[aernValueAccumalated.length - 1].finishdate
      ); // Última fecha de fin del proyecto
      const days = calculateDays(startDate, endDate); // Calcular la duración en días corridos

      setProjectDuration(days);
    }
  }, [selectedWeek, aernValueAccumalated]);

  useEffect(() => {
    const now = new Date();
    let currentWeek = aernValueAccumalated.filter((data) => {
      return (
          now >= new Date(data.dateStart) && now <= new Date(data.finishdate)
      );
    });
    if (currentWeek.length > 0) {
      setSelectedWeek(formatedDate(currentWeek[0].finishdate));
    }
  }, []);
  const calculatePercentage = (value, total) => {
    return total !== 0 ? ((value / total) * 100).toFixed(2) : 0;
  };

  useEffect(() => {
    const totalEarnValue =
      filteredData.length > 0 ? filteredData[0].acumuladoEarn : 0;

    const avanceRealTotal =
      totalPlanValue > 0 ? (totalEarnValue / totalPlanValue) * 100 : 0;
    setAvanceRealTotal(avanceRealTotal);
  }, [aernValueAccumalated]);

  const currentPlanValue =
    filteredData.length > 0 ? filteredData[0].acumuladoPlanValue : 0;

  const totalEarnValue =
    filteredData.length > 0 ? filteredData[0].acumuladoEarn : 0;

  const totalActualCost =
    filteredData.length > 0 ? filteredData[0].acumuladoActualCost : 0;

  const SPI = totalEarnValue / currentPlanValue;

  // -------------Función para calcular la duración en días corridos---------------//
  function calculateDays(startDate, endDate) {
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== "" && dayOfWeek !== "") {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
  }
  // ---------------- Formato de Fecha ----------------------------//
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
    <div>
      <div className="mt-3 ml-4 mr-2">
        {selectedWeek && (
            <div className="bg-white  grid grid-cols-7 rounded-lg shadow-lg ">
              <div
                  className="bg-blue-500 bg-gradient-to-r from-indigo-500 grid grid-rows-2 rounded-lg text-center shadow-xl m-2">
                <h1 className="text-sm font-semibold text-white mr-4 mt-3 ">
                  VALOR GANADO A:
                </h1>
                {/* <h1 className="text-sm font-semibold text-white mt-4">
                SEMANA DEL PROYECTO
                </h1>
                <h1 className="text-xl font-semibold mt-4 text-white">
                {formatedDate(selectedWeek)}
              </h1> */}
                <select
                    className=" text-white text-center text-xs "
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(e.target.value)}
                >
                  <option className="" value="">
                    Seleccione una semana
                  </option>
                  {aernValueAccumalated.map((data, index) => (
                      <option
                          className=""
                          key={index}
                          value={formatedDate(data.finishdate)}
                      >
                        {formatedDate(data.finishdate)}
                      </option>
                  ))}
                </select>
              </div>

              <div
                  className="bg-blue-500 bg-gradient-to-r from-indigo-500 m-2 p-1 grid grid-rows-2 rounded-xl text-center shadow-xl">
                <h1 className="text-sm mt-2 font-semibold text-white">
                  % AVANCE PLANIFICADO
                </h1>
                <h1 className="text-sm font-semibold text-white mt-2">
                  {((currentPlanValue / totalPlanValue) * 100).toFixed(2)} %
                </h1>
              </div>
              <div
                  className="bg-blue-500 bg-gradient-to-r from-indigo-500 grid grid-rows-2 m-2 p-1 rounded-xl text-center shadow-xl">
                <h1 className="text-sm font-semibold text-white mt-2">
                  % AVANCE REAL
                </h1>
                <h1 className="text-sm font-semibold text-white mt-2">
                  {calculatePercentage(totalEarnValue, totalPlanValue)} %
                </h1>
              </div>
              <div
                  className="bg-blue-500 bg-gradient-to-r from-indigo-500 grid grid-rows-2 m-2 p-1 rounded-xl text-center shadow-xl">
                <h1 className="text-sm font-semibold text-white mt-2">
                  % COSTO ACTUAL
                </h1>
                <h1 className="text-sm font-semibold text-white mt-2">
                  {calculatePercentage(totalActualCost, totalPlanValue)} %
                </h1>
              </div>
              <div
                  className="bg-blue-500 bg-gradient-to-r from-indigo-500 grid grid-rows-2 m-2 p-1 rounded-xl text-center shadow-xl">
                <h1 data-tooltip-id="tooltip-spi">
                  <h1 className="text-sm font-semibold text-white mt-2">SPI</h1>
                </h1>
                <h1 className="text-sm font-semibold text-white mt-2">
                  {SPI.toFixed(2)} %
                </h1>
              </div>
              <div
                  className="bg-blue-500 bg-gradient-to-r from-indigo-500  grid grid-rows-2 m-2 p-1 rounded-xl text-center shadow-xl">
                <h1 className="text-sm font-semobold text-white mt-2">
                  Duración del Proyecto
                </h1>
                <h1 className="text-sm font-semibold text-white mt-2">
                  {projectDuration} días corridos
                </h1>
              </div>
              <div
                  className="bg-blue-500 bg-gradient-to-r from-indigo-500 grid grid-rows-2 ml-2 mr-2 mt-2 mb-2 p-1 rounded-xl text-center shadow-xl">
                <h1 className="text-sm font-light text-white">
                  Proyeccion a termino
                </h1>
                <h1 className="text-sm font-semibold text-white mt-2">
                  {(projectDuration / SPI).toFixed(0)} días corridos
                </h1>
              </div>

              <div
                  className="bg-blue-500 bg-gradient-to-r from-indigo-500 grid grid-rows-2 ml-2 mr-2 mt-2 mb-2 p-1 rounded-xl text-center shadow-xl">
                <h1 className="text-sm font-light text-white">
                  Utilidad esperada
                </h1>
                <h1 className="text-sm font-semibold text-white mt-2">
                  18.349 UF
                </h1>
              </div>
              <div
                  className="bg-blue-500 bg-gradient-to-r from-indigo-500 grid grid-rows-2 ml-2 mr-2 mt-2 mb-2 p-1 rounded-xl text-center shadow-xl">
                <h1 className="text-sm font-light text-white">
                  Sobre Utilidad
                </h1>
                <span className="font-light text-white text-xxs" >
                  EAC = BAC/(CPI * SPI)</span>
                <h1 className="text-sm font-semibold text-white mt-2">
                  12.271 UD
                </h1>
              </div>
              <div
                  className="bg-blue-500 bg-gradient-to-r from-indigo-500 grid grid-rows-2 ml-2 mr-2 mt-2 mb-2 p-1 rounded-xl text-center shadow-xl">
                <h1 className="text-sm font-light text-white">
                  Utilidad Total
                </h1>
                <h1 className="text-sm font-semibold text-white mt-2">
                    30.620 UF
                </h1>
              </div>

            </div>
        )}
      </div>
      <ReactTooltip
          id="tooltip-spi"
          place="top"
          content="Avance Real/Avance planificado"
          className="!bg-black !text-white !text-xxs !rounded-lg !p-2"
      />
    </div>
  );
}

export default CarsInformationGeneralProgress;
