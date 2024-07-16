import { useContext, useState, useEffect } from "react";
import { ViewerContext } from "../Context";

const KpiByFamily = () => {
  const {
    getDataBudget,
    selectedProjectId,
    setGrandTotal,
    invoicesdata,
    formatCurrency,
    realMonthCostGgpublico,
    realMonthCostPrivado,
    realMonthCostPublico,
  } = useContext(ViewerContext);

  const [totalsByFamily, setTotalsByFamily] = useState({});
  const [totalsInvoicesByFamily, setTotalsInvoicesByFamily] = useState({});
  const [totalPublicoggPrivado, setTotalPublicoggPrivado] = useState(0);

  // Calcula el presupuesto total por familia
  useEffect(() => {
    const totals = {};
    const filteredData = getDataBudget.filter(
      (proid) => proid.projectId === selectedProjectId
    );

    filteredData.forEach((item) => {
      const { family, totalPrice } = item;
      if (totals[family]) {
        totals[family] += Number(totalPrice);
      } else {
        totals[family] = Number(totalPrice);
      }
    });

    setTotalsByFamily(totals);
  }, [getDataBudget, selectedProjectId]);

  // Calcula lo facturado por familia, lo que no incluye la mano de obra
  useEffect(() => {
    const totals = {};
    const filteredData = invoicesdata.filter(
      (proid) => proid.projectId === selectedProjectId
    );

    filteredData.forEach((item) => {
      const { family, totalInvoices } = item;
      if (totals[family]) {
        totals[family] += Number(totalInvoices);
      } else {
        totals[family] = Number(totalInvoices);
      }
    });

    setTotalsInvoicesByFamily(totals);
  }, [invoicesdata, selectedProjectId]);

  // Calcula el total general del Proyecto
  useEffect(() => {
    const total = Object.values(totalsByFamily).reduce(
      (acc, curr) => acc + curr,
      0
    );
    setGrandTotal(total);
  }, [totalsByFamily]);

  useEffect(() => {
    setTotalPublicoggPrivado(realMonthCostGgpublico + realMonthCostPrivado);
  }, []);

  const Disponible = {};
  Object.keys(totalsByFamily).forEach((family) => {
    Disponible[family] =
      totalsByFamily[family] - (totalsInvoicesByFamily[family] || 0);
  });

  const renderFamilyCard = (family, total, actual, disponible) => (
    <div
      key={family}
      className="bg-blue-500 bg-gradient-to-r from-indigo-500  ml-2 rounded-lg text-white shadow-lg"
    >
      <p className="text-center text-sm shadow-xl">{family}</p>
      <div className="text-center text-sm mt-2">
        Total: {formatCurrency(total)}
      </div>
      <div className="text-center mt-2 text-sm">
        Actual: {formatCurrency(actual)}
      </div>
      <div className="text-center mt-2 text-sm">
        Disponible: {formatCurrency(disponible)}
      </div>
      <div className="mt-4 p-1  rounded-lg"></div>
    </div>
  );

  const undefinedTotal = totalsInvoicesByFamily.undefined || 0;

  return (
    <div
      className="ml-4 mt-4 bg-white p-2 rounded-lg mr-2 shadow-lg"
      style={{ width: "1250px" }}
    >
      <h1 className="text-sm ml-2 font-semibold">VALORES POR FAMILIA</h1>
      <div className="grid grid-cols-5 gap-4 mr-2">
        {Object.entries(totalsByFamily).map(([family, total]) => {
          if (family === undefined) return null; // Skip undefined family here

          const displayedFamily = family;
          let actual =
            displayedFamily === "Mano_Obra"
              ? realMonthCostPublico
              : totalsInvoicesByFamily[family] || 0;

          if (displayedFamily === "GG") {
            actual += realMonthCostGgpublico + realMonthCostPrivado;
          }

          const disponible = total - actual;

          return renderFamilyCard(displayedFamily, total, actual, disponible);
        })}
        {renderFamilyCard("Sin Familia", undefinedTotal, 0, undefinedTotal)}
      </div>
    </div>
  );
};

export default KpiByFamily;
