import { useContext, useState, useEffect } from "react";
import { ViewerContext } from "../Context";

const CarInformationSheetControlReport = () => {
  const { summaryData, formatCurrency } = useContext(ViewerContext);

  const [totals, setTotals] = useState({
    montoPropuesta: 0,
    montoContrato: 0,
    recuperable: 0,
    totalConExtras: 0,
    ahorro: 0,
  });

  useEffect(() => {
    console.log("🚀 ~ CarInformationSheetControlReport ~ totals:", totals);
    const totalPropuesta = summaryData.reduce(
      (sum, item) => sum + item.montoPropuesta,
      0
    );
    const totalContrato = summaryData.reduce(
      (sum, item) => sum + item.montoContrato,
      0
    );
    const totalRecuperable = summaryData.reduce(
      (sum, item) => sum + item.recuperable,
      0
    );
  
    const totalAhorro = summaryData.reduce((sum, item) => sum + item.ahorro, 0);

    setTotals({
      montoPropuesta: totalPropuesta,
      montoContrato: totalContrato,
      recuperable: totalRecuperable,
      totalConExtras: totalPropuesta + totalRecuperable,
      ahorro: totalAhorro,
    });
  }, [summaryData]);

  return (
    <div >
      <div className="ml-3 mt-3 bg-gradient-to-r from-indigo-500">
        {summaryData.map((item, index) => (
          <h1 key={index}></h1>
        ))}
      </div>
      <div className="grid grid-cols-5 bg-white shadow-xl rounded-xl mr-3">
        <div className="bg-blue-500 ml-8 mr-8 mt-4 mb-4 p-6 rounded-xl text-center shadow-xl bg-gradient-to-r from-indigo-500">
          <h1 className="text-sm font-light text-white">
            TOTAL MONTO PROPUESTA
          </h1>
          <h1 className="text-lg font-semibold text-white mt-4">
            {formatCurrency(totals.montoPropuesta)}
          </h1>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 bg-blue-500 ml-8 mr-8 mt-4 mb-4 p-6 rounded-xl text-center shadow-xl">
          <h1 className="text-sm font-light text-white">
            TOTAL MONTO CONTRATO
          </h1>
          <h1 className="text-lg font-semibold text-white mt-4">
            {formatCurrency(totals.montoContrato)}
          </h1>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 bg-blue-500 ml-8 mr-8 mt-4 mb-4 p-6 rounded-xl text-center shadow-xl">
          <h1 className="text-sm font-light text-white">
            TOTAL RECUPERABLE
          </h1>
          <h1 className="text-lg font-semibold text-white mt-4">
            {formatCurrency(totals.recuperable)}
          </h1>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 bg-blue-500 ml-8 mr-8 mt-4 mb-4 p-6 rounded-xl text-center shadow-xl">
          <h1 className="text-sm font-light text-white">
            TOTAL MONTO CON EXTRAS
          </h1>
          <h1 className="text-lg font-semibold text-white mt-4">
            {formatCurrency(totals.totalConExtras)}
          </h1>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 bg-blue-500 ml-8 mr-8 mt-4 mb-4 p-6 rounded-xl text-center shadow-xl">
          <h1 className="text-sm font-light text-white">
            AHORRO/PERDIDA
          </h1>
          <h1 className="text-lg font-semibold text-white mt-4">
            {formatCurrency(totals.ahorro)}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default CarInformationSheetControlReport;
