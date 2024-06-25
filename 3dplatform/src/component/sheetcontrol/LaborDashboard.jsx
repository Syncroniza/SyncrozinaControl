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
      (item) => item.rol === "publico"
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
      className="bg-blue-500 bg-gradient-to-r from-indigo-600 p-4 shadow-lg rounded-lg mb-4 ml-20"
      style={{ width: "1150px" }}
    >
      <h1 className="bg-white p-2 rounded-lg text-center font-semibold flex flex-col">
        CONTROL MANO DE OBRA
        <Link to={"/informe/informeMO"}>ir a reporte MO</Link>
      </h1>
      <div>
        <h1 className="text-white text-sm mt-4">
          TOTAL MANO DE OBRA (Rol Publico, ggPublico, Privado)
        </h1>
        <div className=" text-sm bg-white rounded-lg text-white text-center p-6">
          <div className="grid grid-cols-3 mx-4 rounded-lg">
            <div className="p-4 bg-blue-500 rounded-lg">
              <h1>Disponible</h1>
              <p>{formatCurrency(totalRealMonthCost)}</p>
            </div>
            <div className="p-4 bg-blue-500 rounded-lg ml-4">
              <h1>Gastado a la Fecha</h1>
              <p>{formatCurrency(calculateTotalRealMonthCost)}</p>
            </div>
            <div className="p-4 bg-blue-500 rounded-lg ml-4">
              <h1>Disponible</h1>
              <p>{formatCurrency(diferenciaTotalLabor)}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-white text-sm mt-4">
          TOTAL MANO DE OBRA (Publico)
        </h1>
        <div className=" text-sm bg-white rounded-lg text-white text-center p-6">
          <div className="grid grid-cols-3 mx-4 rounded-lg">
            <div className="p-4 bg-blue-500 rounded-lg">
              <h1>Disponible</h1>
              <p>{formatCurrency(totalLaborPublico)}</p>
            </div>
            <div className="p-4 bg-blue-500 rounded-lg ml-4">
              <h1>Gastado a la Fecha</h1>
              <p>{formatCurrency(realMonthCostPublico)}</p>
            </div>
            <div className="p-4 bg-blue-500 rounded-lg ml-4">
              <h1>Disponible</h1>
              <p>{formatCurrency(totalLaborDiferenciaPublico)}</p>
            </div>
          </div>
        </div>

        <h1 className="text-white text-sm mt-4">
          TOTAL MANO DE OBRA (ggPublico)
        </h1>
        <div className=" text-sm bg-white rounded-lg text-white text-center p-6">
          <div className="grid grid-cols-3 mx-4 rounded-lg">
            <div className="p-4 bg-blue-500 rounded-lg">
              <h1>Disponible</h1>
              <p>{formatCurrency(totalLaborGgpublico)}</p>
            </div>
            <div className="p-4 bg-blue-500 rounded-lg ml-4">
              <h1>Gastado a la Fecha</h1>
              <p>{formatCurrency(realMonthCostGgpublico)}</p>
            </div>
            <div className="p-4 bg-blue-500 rounded-lg ml-4">
              <h1>Disponible</h1>
              <p>{formatCurrency(totalLaborDiferenciaggPublico)}</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-white text-sm mt-4">
          TOTAL MANO DE OBRA (Privado)
        </h1>
        <div className=" text-sm bg-white rounded-lg text-white text-center p-6">
          <div className="grid grid-cols-3 mx-4 rounded-lg">
            <div className="p-4 bg-blue-500 rounded-lg">
              <h1>Disponible</h1>
              <p>{formatCurrency(totalLaborPrivado)}</p>
            </div>
            <div className="p-4 bg-blue-500 rounded-lg ml-4">
              <h1>Gastado a la Fecha</h1>
              <p>{formatCurrency(realMonthCostPrivado)}</p>
            </div>
            <div className="p-4 bg-blue-500 rounded-lg ml-4">
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
