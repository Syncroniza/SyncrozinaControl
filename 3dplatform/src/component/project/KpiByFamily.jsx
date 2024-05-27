import { useContext, useState, useEffect } from "react";
import { ViewerContext } from "../Context";

const KpiByFamily = () => {
  const {
    getDataBudget,
    projects,
    selectedProjectId,
    grandTotal,
    setGrandTotal,
    invoicesdata
  } = useContext(ViewerContext);

  const [totalsByFamily, setTotalsByFamily] = useState({});
  const [totalsInvoicesByFamily,setTotalsInvoicesByFamily]=useState("")
  

  // calcula el presupuesto  total por familia
  useEffect(() => {
    const totals = {};
    // Filtrar los elementos por el projectId seleccionado
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


  useEffect(() => {
    const totals = {};
    // Filtrar los elementos por el projectId seleccionado
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


  useEffect(() => {
    const total = Object.values(totalsByFamily).reduce(
      (acc, curr) => acc + curr,
      0
    );
    setGrandTotal(total);
  }, [totalsByFamily]);

  return (
    <div className="ml-4 mt-4 bg-white p-2 rounded-lg mr-2 shadow-lg ">
      <h1 className="text-xl ml-2 font-semibold">VALORES POR FAMILIA</h1>
      <div className="grid grid-cols-4 gap-4 mr-2">
        {Object.entries(totalsByFamily).map(([family, total]) => {
        

          return (
            <div
              key={family}
              className="bg-blue-500 p-2 ml-2 rounded-lg text-white shadow-lg">
              <p className="text-center text-sm shadow-xl">{family}</p>
              <div className="text-center text-sm mt-2">
                Total: ${total.toLocaleString()}
              </div>
              <div className="text-center mt-2 text-sm">
                Actual: $
                {totalsInvoicesByFamily[family]
                  ? totalsInvoicesByFamily[family].toLocaleString()
                  : "Sin Valores "}
              </div>
              <div className="mt-4 p-1 bg-gray-200 rounded-lg">
               
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KpiByFamily;
