import { ViewerContext } from "../Context";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import ActualCostTable from "../tables/ActualCostTable";
import { Link } from "react-router-dom";
import FormAreaChart from "../sheetcontrol/FormAreaChart";
import {BASE_URL} from "../../constants.js";
function EarnValeuManagementTable() {
  const {
    totalByWeek,
    formatCurrency,
    setProjectId,
    setIsEditMode,
    setIsModalOpenProgress,
    setCurrentIdProgress,
    combinedData,
    setCombinedData,
    aernValueAccumalated,
    setEarnValueAccumulated,
    totalPlanValue,
    setTotalPlanValue,
    projectDuration,
    totalActualCostByWeek,
  } = useContext(ViewerContext);

  const [dataProgress, setDataProgress] = useState([]);
  const [totalEarnValue, setTotalEarnValue] = useState("");

  // const openModal = () => setIsModalOpenProgress(true);

  //---------------------Open and  Update Form ----------------------//
  const openFormAndCurrentProgressId = (progressId) => {
    // Encuentra el contrato específico por su ID
    const progressToEdit = dataProgress.find(
      (progress) => progress._id === progressId
    );
    if (progressToEdit) {
      setProjectId(progressToEdit.projectId);
      setCurrentIdProgress(progressToEdit._id);
      setIsEditMode(true);
      setIsModalOpenProgress(true);
    }
  };
  //---------------------------------------------------------------------------//

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(BASE_URL + "/progress/");

        if (
          Array.isArray(response.data.data) &&
          response.data.data.length > 0
        ) {
          const formatData = response.data.data.map((item) => ({
            _id: item._id,
            projectId: item.projectId,
            week: item.week,
            dateStart: new Date(item.dateStart),
            finishdate: new Date(item.finishdate),
            planValue: item.planValue,
            earnValue: item.earnValue,
            actualCost: item.actualCost,
            eepp: item.eepp,
          }));

          // Ordenar las fechas por dateStart de manera ascendente
          formatData.sort((a, b) => a.dateStart - b.dateStart);
          setDataProgress(formatData);
        } else {
          console.error(
            "Respuesta no es un arreglo o está vacío",
            response.data
          );
        }
      } catch (error) {
        console.error("Error en la carga de datos", error);
      }
    };
    fetchProgress();
  }, []);
  //------------------------------Combine Data --------------------------------//
  useEffect(() => {
    // Combinar los datos de dataProgress y totalByWeek en la estructura necesaria
    const combinedData = dataProgress.map((item) => ({
      _id: item._id,
      projectId: item.projectId,
      dateStart: item.dateStart,
      finishdate: item.finishdate,
      week: item.week,
      planValue: item.planValue,
      totalActualCostByWeek: totalActualCostByWeek[item.week] || 0,
      earnValue: item.earnValue,
      eepp: item.eepp,
    }));

    setCombinedData(combinedData);
  }, [dataProgress, totalByWeek]);

  //--------------------- Calculo de Acumulados  --------------------------------------/

  useEffect(() => {
    let acumuladoEarn = 0;
    let acumuladoActualCost = 0;
    let acumuladoPlanValue = 0;
    let acumuladoEEPP = 0;

    // Calcula el total de EarnValue
    const totalEarnValue = combinedData.reduce(
      (acc, item) => acc + (item.earnValue || 0),
      0
    );
    setTotalEarnValue(totalEarnValue);

    // Calcula el total de planValue
    const totalPlanValue = combinedData.reduce(
      (acc, item) => acc + (item.planValue || 0),
      0
    );
    setTotalPlanValue(totalPlanValue);

    // Calcula el total de planValue
    const totalEEPP = combinedData.reduce(
      (acc, item) => acc + (item.eepp || 0),
      0
    );

    const newArray = combinedData.map((item) => {
      acumuladoEarn += item.earnValue || 0;
      acumuladoActualCost += totalActualCostByWeek[item.week] || 0;
      acumuladoPlanValue += item.planValue || 0;
      acumuladoEEPP += item.eepp || 0;

      return {
        ...item,
        acumuladoEarn,
        acumuladoActualCost,
        acumuladoPlanValue,
        acumuladoEEPP,
      };
    });

    setEarnValueAccumulated(newArray);
  }, [combinedData, totalByWeek]);
  //--------------------- Date transformation format ------------------------------//

  const newArray = dataProgress.map((item) => {
    // Obtenemos la fecha dateStart del objeto actual
    const dateStart = new Date(item.dateStart);

    // Obtenemos el número de semana del año
    const weekOfYear = getWeekNumber(dateStart);

    // Creamos un nuevo objeto con la semana del año y el planValue
    return {
      semana: weekOfYear,
      planValue: item.planValue,
    };
  });

  // Función para obtener el número de semana del año
  function getWeekNumber(date) {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const timeDiff = date - oneJan;
    const dayOfYear = Math.ceil(timeDiff / 86400000);
    return Math.ceil(dayOfYear / 7);
  }

  // El nuevo arreglo con la información requerida

  // --------------------------------Formato de Fecha -----------------------------------------------------//

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
  //---------------------------------------SPI----------------------------------------------------------//

  return (
    <div className="bg-white ml-4 mt-4 mr-4">
      {/* <div>
        <Exceltransform UrlEndpoint=BASE_URL + "/progress/" /> 
      </div> */}
      <FormAreaChart />
      <div className="ml-5 overflow-auto " style={{ height: "850px" }}>
        <Link to={"/"} className="text-2xl text-blue-800 font-bold mt-4 flex  ">
          Control de Avance
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="size-5"
            className="w-7 h-7 ml-4 mt-1"
          >
            <path
              fill-rule="evenodd"
              d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
              clip-rule="evenodd"
            />
          </svg>
        </Link>
        <table className="mr-2 w-full">
          <thead className="bg-blue-500 sticky top-0 ">
            <tr className="text-xs text-white">
              <th className=" border border-slate-300   ">Id Projecto</th>
              <th className=" border border-slate-300   ">week</th>
              <th className=" border border-slate-300  p-1 ">Fecha Inicio</th>
              <th className=" border border-slate-300  p-1 ">Fecha Termino</th>
              <th className=" border border-slate-300  p-1">
                Valor Planificado $
              </th>
              <th className=" border border-slate-300  ">
                Valor Planificado Acumulado
              </th>
              <th className=" border border-slate-300  ">
                % Valor Planificado $
              </th>
              <th className="   ">Valor Ganado $</th>
              <th className="   "></th>
              <th className=" border border-slate-300  ">
                Valor Ganado Acumulado
              </th>
              <th className="   ">% Valor Ganado </th>
              <th className=" border border-slate-300  ">Costo Actual $</th>
              <th className=" border border-slate-300  ">
                Coato Actual Acumulado
              </th>
              <th className=" border border-slate-300  ">
                % Costo Actual Acumulado
              </th>
              <th className=" border border-slate-300  ">SPI (EV/PV)</th>
              <th className=" border border-slate-300 px-1 ">
                EAC (Estimacion a termino)días
              </th>
              <th className=" border border-slate-300 px-1 ">EEPP</th>
            </tr>
          </thead>
          <tbody>
            {aernValueAccumalated.map((progress) => (
              <tr
                key={progress._id}
                className="border border-slate-300 text-center text-xxs"
              >
                <td className="border border-slate-300 p-1 ">
                  {progress.projectId}
                </td>
                <td className="border border-slate-300 p-1 ">
                  {progress.week}
                </td>
                <td className="border border-slate-300 p-1 ">
                  {formatedDate(progress.dateStart)}
                </td>
                <td className="border border-slate-300  ">
                  {formatedDate(progress.finishdate)}
                </td>
                <td className="border border-slate-300 p-1 ">
                  {formatCurrency(progress.planValue)}
                </td>
                <td className="border border-slate-300  ">
                  {formatCurrency(progress.acumuladoPlanValue)}
                </td>
                <td className="border border-slate-300  ">
                  {(
                    (progress.acumuladoPlanValue / totalPlanValue) *
                    100
                  ).toFixed(2)}
                  %
                </td>
                <td className=" flex flex-row ">
                  {formatCurrency(progress.earnValue)}
                </td>
                <td>
                  <button
                    className=" text-black rounded-lg text-xs bg-green-400 p-1"
                    onClick={() => openFormAndCurrentProgressId(progress._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                </td>
                <td className="border border-slate-300 ">
                  {formatCurrency(progress.acumuladoEarn)}
                </td>
                <td className="border border-slate-300 ">
                  {((progress.acumuladoEarn / totalPlanValue) * 100).toFixed(2)}{" "}
                  %
                </td>
                <td className="border border-slate-300 ">
                  {formatCurrency(progress.totalActualCostByWeek)}
                </td>
                <td className="border border-slate-300 ">
                  {formatCurrency(progress.acumuladoActualCost)}
                </td>
                <td className="border border-slate-300 ">
                  {(
                    (progress.acumuladoActualCost / totalPlanValue) *
                    100
                  ).toFixed(2)}
                  %
                </td>
                <td className="border border-slate-300 ">
                  {(
                    progress.acumuladoEarn / progress.acumuladoPlanValue
                  ).toFixed(2)}
                </td>
                <td className="border border-slate-300 ">
                  {(
                    projectDuration /
                    (progress.acumuladoEarn / progress.acumuladoPlanValue)
                  ).toFixed(2)}
                </td>

                <td className=" ">{formatCurrency(progress.eepp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ActualCostTable />
    </div>
  );
}

export default EarnValeuManagementTable;
