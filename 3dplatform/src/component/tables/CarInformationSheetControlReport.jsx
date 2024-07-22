import { useContext, useState, useEffect } from "react";
import { ViewerContext } from "../Context";

const CarInformationSheetControlReport = ({ selectedFamilies }) => {
  const { summaryData, formatCurrency } = useContext(ViewerContext);
  console.log("🚀 ~ CarInformationSheetControlReport ~ summaryData:", summaryData)
  const [totals, setTotals] = useState({
    montoPropuesta: 0,
    montoContrato: 0,
    recuperable: 0,
    totalConExtras: 0,
    ahorro: 0,
    totalUnpaidInvoices: 0,
    totalPaidInvoices: 0,
    totalIssuedInvoices: 0,
  });

  useEffect(() => {
    if (selectedFamilies.length > 0) {
      // Filtrar datos por familias seleccionadas
      const filteredData = summaryData.filter(item =>
        selectedFamilies.includes(item.family)
      );

      const totalPropuesta = filteredData.reduce((sum, item) => sum + Number(item.montoPropuesta), 0);
      const totalContrato = filteredData.reduce((sum, item) => sum + Number(item.montoContrato), 0);
      const totalRecuperable = filteredData.reduce((sum, item) => sum + Number(item.recuperable), 0);
      const totalAhorro = filteredData.reduce((sum, item) => sum + Number(item.ahorro), 0);
      const totalPaidInvoices = filteredData.reduce((sum, item) => sum + Number(item.totalPaidInvoices), 0);
      const totalIssuedInvoices = filteredData.reduce((sum, item) => sum + Number(item.totalIssuedInvoices), 0);
      const totalUnpaidInvoices = totalIssuedInvoices - totalPaidInvoices;

      setTotals({
        montoPropuesta: totalPropuesta,
        montoContrato: totalContrato,
        recuperable: totalRecuperable,
        totalConExtras: totalPropuesta + totalRecuperable,
        ahorro: totalAhorro,
        totalUnpaidInvoices: totalUnpaidInvoices,
        totalPaidInvoices: totalPaidInvoices,
        totalIssuedInvoices: totalIssuedInvoices,
      });
    }
  }, [summaryData, selectedFamilies]);

  return (
    <div>
      <div className="grid grid-cols-5 bg-white shadow-xl rounded-xl mr-3 mt-3">
        <div className="bg-blue-500 grid grid-rows-2 ml-8 mr-8 mt-4 mb-4 p-2 rounded-xl text-center shadow-xl bg-gradient-to-r from-indigo-500 ">
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
          <h1 className="text-sm font-light text-white">TOTAL RECUPERABLE</h1>
          <h1 className="text-lg font-semibold text-white ">
            {formatCurrency(totals.recuperable)}
          </h1>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 to bg-blue-500 grid grid-rows-2 ml-8 mr-8 mt-4 mb-4 p-2 rounded-xl text-center shadow-xl">
          <h1 className="text-sm font-light text-white">
            TOTAL MONTO CON EXTRAS
          </h1>
          <h1 className="text-lg font-semibold text-white ">
            {formatCurrency(totals.totalConExtras)}
          </h1>
        </div>
        <div className={`bg-gradient-to-r ${totals.ahorro < 0 ? 'from-red-400 bg-red-700' : 'from-indigo-500 bg-blue-500'} grid grid-rows-2 ml-8 mr-8 mt-4 mb-4 p-2 rounded-xl text-center font-semibold shadow-xl`}>
          <h1 className="text-sm font-light text-white">AHORRO/PERDIDA</h1>
          <h1 className="text-white">
            {formatCurrency(totals.ahorro)}
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-3 bg-white shadow-xl rounded-xl mt-4 mr-3">
        <div className="bg-blue-500 grid grid-rows-2 ml-8 mr-8 mt-4 mb-4 p-2 rounded-xl text-center shadow-xl bg-gradient-to-r from-indigo-500 ">
          <h1 className="text-sm font-light text-white">
            TOTAL FACTURADO
          </h1>
          <h1 className="text-lg font-semibold text-white ">
            {formatCurrency(totals.totalIssuedInvoices)}
          </h1>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 bg-blue-500 grid grid-rows-2 ml-8 mr-8 mt-4 mb-4 p-2 rounded-xl text-center shadow-xl">
          <h1 className="text-sm font-light text-white">
            TOTAL PAGADO
          </h1>
          <h1 className="text-lg font-semibold text-white ">
            {formatCurrency(totals.totalPaidInvoices)}
          </h1>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 bg-blue-500 grid grid-rows-2 ml-8 mr-8 mt-4 mb-4 p-2 rounded-xl text-center shadow-xl">
          <h1 className="text-sm font-light text-white">
            TOTAL POR PAGAR
          </h1>
          <h1 className="text-lg font-semibold text-white ">
            {formatCurrency(totals.totalUnpaidInvoices)}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default CarInformationSheetControlReport;
