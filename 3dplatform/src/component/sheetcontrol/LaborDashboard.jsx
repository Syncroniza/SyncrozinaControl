import { useContext, useEffect, useState } from "react";
import { ViewerContext } from "../Context";
import { Link } from "react-router-dom";
const LaborDashboard = () => {
  const {
    totalsWithAccumulated,
    totalRealMonthCost,
    calculateTotalRealMonthCost,
    formatCurrency,
    realMonthCostGgpublico,
    setRealMonthCostGgpublico,
    realMonthCostPrivado,
    setRealMonthCostPrivado,
    realMonthCostPublico,
    setRealMonthCostPublico,
  } = useContext(ViewerContext);

  const [diferenciaTotalLabor, setDiferenciaTotalLabor] = useState(0);

  const [totalLaborGgpublico, setTotalLaborGgpublico] = useState(0);
  const [totalLaborDiferenciaggPublico, setTotalLaborDiferenciaggPublico] =
    useState(0);

  const [totalLaborPublico, setTotalLaborPublico] = useState(0);
  const [totalLaborDiferenciaPublico, setTotalLaborDiferenciaPublico] =
    useState(0);

  const [totalLaborPrivado, setTotalLaborPrivado] = useState(0);

  useEffect(() => {
    setDiferenciaTotalLabor(totalRealMonthCost - calculateTotalRealMonthCost);
  }, []);

  useEffect(() => {
    const filteredTotalPublico = totalsWithAccumulated.filter(
      (item) => item.rol === "MODirecta"
    );

    const totalLaborPublico = filteredTotalPublico.reduce(
      (acc, item) => acc + (Number(item.totalLabor) || 0),
      0
    );
    const realMonthCostpublico = filteredTotalPublico.reduce(
      (acc, item) => acc + (Number(item.realmonthcost) || 0),
      0
    );

    setTotalLaborPublico(totalLaborPublico);
    setRealMonthCostPublico(realMonthCostpublico);

    setTotalLaborDiferenciaPublico(totalLaborPublico - realMonthCostpublico);
  }, [totalsWithAccumulated]);

  useEffect(() => {
    const filteredTotalsGgpublico = totalsWithAccumulated.filter(
      (item) => item.rol === "ggpublico "
    );

    const totalLaborGgpublico = filteredTotalsGgpublico.reduce(
      (acc, item) => acc + (Number(item.totalLabor) || 0),
      0
    );
    const realMonthCostGgpublico = filteredTotalsGgpublico.reduce(
      (acc, item) => acc + (Number(item.realmonthcost) || 0),
      0
    );

    setTotalLaborGgpublico(totalLaborGgpublico);
    setRealMonthCostGgpublico(realMonthCostGgpublico);

    setTotalLaborDiferenciaggPublico(
      totalLaborGgpublico - realMonthCostGgpublico
    );
  }, [totalsWithAccumulated]);

  useEffect(() => {
    const filteredTotalsPrivado = totalsWithAccumulated.filter(
      (item) => item.rol === "privado"
    );

    const totalLaborPrivado = filteredTotalsPrivado.reduce(
      (acc, item) => acc + (Number(item.totalLabor) || 0),
      0
    );
    const realMonthCostPrivado = filteredTotalsPrivado.reduce(
      (acc, item) => acc + (Number(item.realmonthcost) || 0),
      0
    );

    setTotalLaborPrivado(totalLaborPrivado);
    setRealMonthCostPrivado(realMonthCostPrivado);
  }, [totalsWithAccumulated]);

  return (
    <div
      className=" bg-white to p-4 shadow-lg rounded-lg mb-4 ml-4"
      style={{ width: "1300px" }}
    >
      <h1 className="bg-white p-2 rounded-lg text-center font-semibold flex flex-col">
        CONTROL MANO DE OBRA
        <Link to={"/informe/informeMO"}>
          <div className="   mt-3 mr-3 ml-2 flex justify-center text-white p-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500">
            A reporte Mano de Obra 
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
              className="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
          </div>
        </Link>
      </h1>
      <div>
        <div className=" text-sm bg-blue-500 rounded-lg text-white text-center p-4">
        <h1 className="text-white text-sm mt-4">
          TOTAL MANO DE OBRA (MO Directa, MO GG,Rol Privado)
        </h1>
          <div className="grid grid-cols-3 mx-4 rounded-lg">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-500 rounded-lg border border-spacing-3 mr-2">
              <h1>Presupuestado</h1>
              <p>{formatCurrency(totalRealMonthCost)}</p>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-500 rounded-lg border border-spacing-3 mr-3">
              <h1>Gastado a la Fecha</h1>
              <p>{formatCurrency(calculateTotalRealMonthCost)}</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-500 rounded-lg border border-spacing-3">
              <h1>Disponible</h1>
              <p>{formatCurrency(diferenciaTotalLabor)}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className=" text-sm bg-blue-500 rounded-lg text-white text-center p-6 mt-3 mb-3 ">
        <h1 className="text-white text-sm ">
          TOTAL MANO DE OBRA DIRECTA
        </h1>
          <div className="grid grid-cols-3 mx-4 rounded-lg">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-500 rounded-lg border border-spacing-3 mr-2">
              <h1>Presupuestado</h1>
              <p>{formatCurrency(totalLaborPublico)}</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-500 rounded-lg border border-spacing-3 mr-3">
              <h1>Gastado a la Fecha</h1>
              <p>{formatCurrency(realMonthCostPublico)}</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-500 rounded-lg border border-spacing-3 mr-2">
              <h1>Disponible</h1>
              <p>{formatCurrency(totalLaborDiferenciaPublico)}</p>
            </div>
          </div>
        </div>

        <div className=" text-sm bg-blue-500 rounded-lg text-white text-center p-6 mb-3">
        <h1 className="text-white text-sm mt-3">
          TOTAL MANO DE OBRA GG
        </h1>
          <div className="grid grid-cols-3 mx-4 rounded-lg">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-500 rounded-lg border border-spacing-3 mr-3">
              <h1>Presupuestado</h1>
              <p>{formatCurrency(totalLaborGgpublico)}</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-500 rounded-lg border border-spacing-3 mr-3">
              <h1>Gastado a la Fecha</h1>
              <p>{formatCurrency(realMonthCostGgpublico)}</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-500 rounded-lg border border-spacing-3">
              <h1>Disponible</h1>
              <p>{formatCurrency(totalLaborDiferenciaggPublico)}</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className=" text-sm bg-blue-500 rounded-lg text-white text-center p-6">
        <h1 className="text-white text-sm mt-4">
          TOTAL MANO DE OBRA ROL PRIVADO
        </h1>
          <div className="grid grid-cols-3 mx-4 rounded-lg">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-500 rounded-lg border border-spacing-3 mr-3">
              <h1>Presupuestado</h1>
              <p>{formatCurrency(totalLaborPrivado)}</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-500 rounded-lg border border-spacing-3 mr-3">
              <h1>Gastado a la Fecha</h1>
              <p>{formatCurrency(realMonthCostPrivado)}</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-500 rounded-lg border border-spacing-3">
              <h1>Disponible</h1>
              <p>{formatCurrency(totalLaborPrivado - realMonthCostPrivado)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaborDashboard;
