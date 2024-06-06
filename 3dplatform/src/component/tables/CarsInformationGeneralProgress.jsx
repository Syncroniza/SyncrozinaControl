import { useContext, useEffect, useState } from "react";
import { ViewerContext } from "../Context";

function CarsInformationGeneralProgress() {
  const { aernValueAccumalated, totalPlanValue, projectDuration, setProjectDuration } = useContext(ViewerContext);
  console.log("🚀 ~ CarsInformationGeneralProgress ~ aernValueAccumalated:", aernValueAccumalated)

  const [selectedWeek, setSelectedWeek] = useState([]);
  console.log("🚀 ~ CarsInformationGeneralProgress ~ selectedWeek:", selectedWeek)
  
  const [filteredData, setFilteredData] = useState([]);
  console.log("🚀 ~ CarsInformationGeneralProgress ~ filteredData:", filteredData)


  useEffect(() => {
    if (!selectedWeek) return;

    const filtered = aernValueAccumalated.filter((data) => {
      return formatedDate(data.finishdate) === selectedWeek; // Usar la misma función de formato
    });

    setFilteredData(filtered);

    // Calcular la duración del proyecto en días corridos
    if (aernValueAccumalated.length > 0) {
      const startDate = new Date(aernValueAccumalated[0].dateStart); // Primera fecha de inicio del proyecto
      const endDate = new Date(aernValueAccumalated[aernValueAccumalated.length - 1].finishdate); // Última fecha de fin del proyecto
      const days = calculateDays(startDate, endDate); // Calcular la duración en días corridos
      setProjectDuration(days);
    }
  }, [selectedWeek, aernValueAccumalated]);

  const calculatePercentage = (value, total) => {
    return total !== 0 ? ((value / total) * 100).toFixed(2) : 0;
  };

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
          <div className="bg-white mt-2 p-1 grid grid-cols-7 rounded-lg shadow-lg">
            <div className="bg-blue-500 bg-gradient-to-r from-indigo-500 m-2 p-1 mt-2 rounded-xl text-center shadow-xl">
            <h1 className="text-sm font-semibold text-white mt-4 mb-4">
                SELECCIONAR FECHA
              </h1>
              {/* <h1 className="text-sm font-semibold text-white mt-4">
                SEMANA DEL PROYECTO
                </h1>
                <h1 className="text-xl font-semibold mt-4 text-white">
                {formatedDate(selectedWeek)}
              </h1> */}
              <select
                className=" text-white text-center "
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
              >
                <option 
                className="" 
                value="">
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

            <div className="bg-blue-500 bg-gradient-to-r from-indigo-500 m-2 p-1 rounded-xl text-center shadow-xl">
              <h1 className="text-sm font-semibold text-white mt-4">
                % AVANCE PLANIFICADO
              </h1>
              <h1 className="text-xl font-semibold text-white mt-4">
                {((currentPlanValue / totalPlanValue) * 100).toFixed(2)} %
              </h1>
            </div>
            <div className="bg-blue-500 bg-gradient-to-r from-indigo-500 m-2 p-1 rounded-xl text-center shadow-xl">
              <h1 className="text-sm font-semibold text-white mt-4">% AVANCE REAL</h1>
              <h1 className="text-xl font-semibold text-white mt-4">
                {calculatePercentage(totalEarnValue, totalPlanValue)} %
              </h1>
            </div>
            <div className="bg-blue-500 bg-gradient-to-r from-indigo-500 m-2 p-1 rounded-xl text-center shadow-xl">
              <h1 className="text-sm font-semibold text-white mt-4">% COSTO ACTUAL</h1>
              <h1 className="text-xl font-semibold text-white mt-4">
                {calculatePercentage(totalActualCost, totalPlanValue)} %
              </h1>
            </div>
            <div className="bg-blue-500 bg-gradient-to-r from-indigo-500 m-2 p-1 rounded-xl text-center shadow-xl">
              <h1 className="text-sm font-semibold text-white mt-4">SPI</h1>
              <h1 className="text-xl font-semibold text-white mt-4">
                {SPI.toFixed(2)} %
              </h1>
            </div>
            <div className="bg-blue-500 bg-gradient-to-r from-indigo-500 m-2 p-1 rounded-xl text-center shadow-xl">
              <h1 className="text-sm font-semobold text-white mt-4">
                Duración del Proyecto
              </h1>
              <h1 className="text-xl font-semibold text-white mt-4">
                {projectDuration} días corridos
              </h1>
            </div>
            <div className="bg-blue-500 bg-gradient-to-r from-indigo-500 ml-2 mr-2 mt-2 mb-2 p-6 rounded-xl text-center shadow-xl">
              <h1 className="text-sm font-light text-white">
                Proyeccion a termino
              </h1>
              <h1 className="text-sm font-semibold text-white mt-4">
                {((projectDuration / SPI).toFixed(0))} días corridos
              </h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarsInformationGeneralProgress;