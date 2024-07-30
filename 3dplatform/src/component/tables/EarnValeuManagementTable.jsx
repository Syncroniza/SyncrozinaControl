import { ViewerContext } from "../Context";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import ActualCostTable from "../tables/ActualCostTable";
import { Link } from "react-router-dom";
import FormAreaChart from "../sheetcontrol/FormAreaChart";
import { BASE_URL } from "../../constants.js";

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
  const [refreshKey, setRefreshKey] = useState(0); // Estado para forzar renderizado

  const handleRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  const openFormAndCurrentProgressId = (progressId) => {
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
  }, [refreshKey]); // Dependencia de refreshKey para forzar recarga

  useEffect(() => {
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

  useEffect(() => {
    let acumuladoEarn = 0;
    let acumuladoActualCost = 0;
    let acumuladoPlanValue = 0;
    let acumuladoEEPP = 0;

    const totalEarnValue = combinedData.reduce(
      (acc, item) => acc + (item.earnValue || 0),
      0
    );
    setTotalEarnValue(totalEarnValue);

    const totalPlanValue = combinedData.reduce(
      (acc, item) => acc + (item.planValue || 0),
      0
    );
    setTotalPlanValue(totalPlanValue);

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
    <div className="bg-white ml-4 mt-4 mr-4">
      <button
        onClick={handleRefresh}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="size-4"
          className="h-6 w-6"
        >
          <path
            fill-rule="evenodd"
            d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.932.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-1.242l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.241l-.84-.84v1.371a.75.75 0 0 1-1.5 0V9.591a.75.75 0 0 1 .75-.75H5.35a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.932.75.75 0 0 1 1.025-.273Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <FormAreaChart />
      <div className="ml-5 overflow-auto" style={{ height: "850px" }}>
        <div className="">
          <Link to={"/"} className="text-2xl text-blue-800 font-bold mt-4 flex">
            Control de Avance
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-9 h-9 mb-2 ml-4 mt-1 bg-gradient-to-r p-1 rounded-lg from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500"
            >
              <path
                fillRule="evenodd"
                d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
        <table className="mr-2 w-full">
          <thead className="bg-blue-500 sticky top-0 ">
            <tr className="text-xs text-white">
              <th className=" border border-slate-300">Id Projecto</th>
              <th className=" border border-slate-300">week</th>
              <th className=" border border-slate-300 p-1">Fecha Inicio</th>
              <th className=" border border-slate-300 p-1">Fecha Termino</th>
              <th className=" border border-slate-300 p-1">
                Valor Planificado $
              </th>
              <th className=" border border-slate-300">
                Valor Planificado Acumulado
              </th>
              <th className=" border border-slate-300">
                % Valor Planificado $
              </th>
              <th className="">Valor Ganado $</th>
              <th className=""></th>
              <th className=" border border-slate-300">
                Valor Ganado Acumulado
              </th>
              <th className="">% Valor Ganado</th>
              <th className=" border border-slate-300">Costo Actual $</th>
              <th className=" border border-slate-300">
                Costo Actual Acumulado
              </th>
              <th className=" border border-slate-300">
                % Costo Actual Acumulado
              </th>
              <th className=" border border-slate-300">SPI (EV/PV)</th>
              <th className=" border border-slate-300 px-1">
                EAC (Estimacion a termino)días
              </th>
              <th className=" border border-slate-300 px-1">EEPP</th>
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
                <td className="border border-slate-300">
                  {formatedDate(progress.finishdate)}
                </td>
                <td className="border border-slate-300 p-1 ">
                  {formatCurrency(progress.planValue)}
                </td>
                <td className="border border-slate-300">
                  {formatCurrency(progress.acumuladoPlanValue)}
                </td>
                <td className="border border-slate-300">
                  {(
                    (progress.acumuladoPlanValue / totalPlanValue) *
                    100
                  ).toFixed(2)}
                  %
                </td>
                <td className="flex flex-row">
                  {formatCurrency(progress.earnValue)}
                </td>
                <td>
                  <button
                    className="text-black rounded-lg text-xs bg-green-400 p-1"
                    onClick={() => openFormAndCurrentProgressId(progress._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                </td>
                <td className="border border-slate-300">
                  {formatCurrency(progress.acumuladoEarn)}
                </td>
                <td className="border border-slate-300">
                  {((progress.acumuladoEarn / totalPlanValue) * 100).toFixed(2)}
                  %
                </td>
                <td className="border border-slate-300">
                  {formatCurrency(progress.totalActualCostByWeek)}
                </td>
                <td className="border border-slate-300">
                  {formatCurrency(progress.acumuladoActualCost)}
                </td>
                <td className="border border-slate-300">
                  {(
                    (progress.acumuladoActualCost / totalPlanValue) *
                    100
                  ).toFixed(2)}
                  %
                </td>
                <td className="border border-slate-300">
                  {(
                    progress.acumuladoEarn / progress.acumuladoPlanValue
                  ).toFixed(2)}
                </td>
                <td className="border border-slate-300">
                  {(
                    projectDuration /
                    (progress.acumuladoEarn / progress.acumuladoPlanValue)
                  ).toFixed(2)}
                </td>
                <td className="">{formatCurrency(progress.eepp)}</td>
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
