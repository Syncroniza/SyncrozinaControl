import { useContext, useState, useEffect } from "react";
import { ViewerContext } from "../Context";

const CarInformationSheetControlReport = () => {
  const { summaryData, formatCurrency } = useContext(ViewerContext);
  console.log("🚀 ~ CarInformationSheetControlReport ~ summaryData:", summaryData)

  const [totals, setTotals] = useState({
    montoPropuesta: 0,
    montoContrato: 0,
    recuperable: 0,
    totalConExtras: 0,
    ahorro: 0,
  });

  useEffect(() => {
    // Filtrar datos para eliminar duplicados
    const uniqueData = Array.from(new Set(summaryData.map(item => JSON.stringify(item))))
      .map(item => JSON.parse(item));

    console.log("Unique Data:", uniqueData);

    const totalPropuesta = uniqueData.reduce((sum, item) => {
      const value = Number(item.montoPropuesta);
      console.log(`Adding montoPropuesta: ${value}`);
      return sum + value;
    }, 0);

    const totalContrato = uniqueData.reduce((sum, item) => {
      const value = Number(item.montoContrato);
      console.log(`Adding montoContrato: ${value}`);
      return sum + value;
    }, 0);

    const totalRecuperable = uniqueData.reduce((sum, item) => {
      const value = Number(item.recuperable);
      console.log(`Adding recuperable: ${value}`);
      return sum + value;
    }, 0);

    const totalAhorro = uniqueData.reduce((sum, item) => {
      const value = Number(item.ahorro);
      console.log(`Adding ahorro: ${value}`);
      return sum + value;
    }, 0);

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
        <div className="bg-blue-500 grid grid-rows-2 ml-8 mr-8 mt-4 mb-4 p-2 rounded-xl text-center shadow-xl bg-gradient-to-r from-indigo-500">
          <h1 className="text-sm font-light text-white">
            TOTAL MONTO PROPUESTA
          </h1>
          <h1 className="text-lg font-semibold text-white ">
            {formatCurrency(totals.montoPropuesta)}
          </h1>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 bg-blue-500 grid grid-rows-2 ml-8 mr-8 mt-4 mb-4 p-2 rounded-xl text-center shadow-xl">
          <h1 className="text-sm font-light text-white">
            TOTAL MONTO CONTRATO
          </h1>
          <h1 className="text-lg font-semibold text-white ">
            {formatCurrency(totals.montoContrato)}
          </h1>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 bg-blue-500  grid grid-rows-2 ml-8 mr-8 mt-4 mb-4 p-2 rounded-xl text-center shadow-xl">
          <h1 className="text-sm font-light text-white">
            TOTAL RECUPERABLE
          </h1>
          <h1 className="text-lg font-semibold text-white ">
            {formatCurrency(totals.recuperable)}
          </h1>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 bg-blue-500 grid grid-rows-2 ml-8 mr-8 mt-4 mb-4 p-2 rounded-xl text-center shadow-xl">
          <h1 className="text-sm font-light text-white">
            TOTAL MONTO CON EXTRAS
          </h1>
          <h1 className="text-lg font-semibold text-white ">
            {formatCurrency(totals.totalConExtras)}
          </h1>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 bg-blue-500 grid grid-rows-2 ml-8 mr-8 mt-4 mb-4 p-2 rounded-xl text-center shadow-xl">
          <h1 className="text-sm font-light text-white">
            AHORRO/PERDIDA
          </h1>
          <h1 className="text-lg font-semibold text-white">
            {formatCurrency(totals.ahorro)}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default CarInformationSheetControlReport;
