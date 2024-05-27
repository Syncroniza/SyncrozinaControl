import { useContext, useEffect, useState } from "react";
import { ViewerContext } from "../Context";

const Invoices = () => {
  const {
    invoicesdata,
    selectedSubfamily,
    setAccumatedValue,
    selectedProjectId,
    formatCurrency,
    selectedFamily,
    totalPaidByProjectFamilySubfamily,
    setTotalPaidByProjectFamilySubfamily,
    accumatedValue,
  } = useContext(ViewerContext);
  console.log("🚀 ~ Invoices ~ invoicesdata:", invoicesdata);
  const [newfilteredInvoices, setNewFilteredInvoices] = useState([]);

  console.log(
    "🚀 ~ Invoices ~ totalPaidByProjectFamilySubfamily:",
    totalPaidByProjectFamilySubfamily
  );
  const [percentagePaid, setPercentagePaid] = useState([]);

  const formatedDate = (isoDate) => {
    if (!isoDate) return "Fecha no disponible";

    // Crear la fecha en base al isoDate
    const date = new Date(isoDate);

    // Usar getUTC* en lugar de get* para obtener la fecha en UTC
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // getUTCMonth() devuelve un índice basado en cero (0-11)
    const year = date.getUTCFullYear();

    // Formatea el día y el mes para asegurar que tengan dos dígitos
    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(month).padStart(2, "0");

    // Retorna la fecha formateada como "día/mes/año"
    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  // filtro por projectId familia y subfamilia y ademas el calculo acumulado
  useEffect(() => {
    const filteredInvoices = invoicesdata.filter(
      (invoice) =>
        (!selectedProjectId || invoice.projectId === selectedProjectId) &&
        (!selectedFamily || invoice.family === selectedFamily) &&
        (!selectedSubfamily || invoice.subfamily === selectedSubfamily)
    );
    let acumulado = 0;
    const invoicesWithAccumulated = filteredInvoices.map((invoice) => {
      acumulado += parseFloat(invoice.totalInvoices) || 0;
      return { ...invoice, totalAcumulado: acumulado };
    });
    const totalPaid = filteredInvoices
      .filter((invoice) => invoice.invoiceStatus === "Pagado")
      .reduce(
        (sum, invoice) => sum + parseFloat(invoice.totalInvoices || 0),
        0
      );
    // Calculamos el porcentaje pagado.
    // Calculamos el total facturado de las facturas filtradas.
    const totalInvoiced = filteredInvoices.reduce(
      (sum, invoice) => sum + parseFloat(invoice.totalInvoices || 0),
      0
    );

    const percentagePaid =
      totalInvoiced > 0
        ? Number(((totalPaid / totalInvoiced) * 100).toFixed(2))
        : 0;
    setPercentagePaid(percentagePaid);

    setTotalPaidByProjectFamilySubfamily(totalPaid);

    setNewFilteredInvoices(invoicesWithAccumulated);
    setAccumatedValue(acumulado);
  }, [
    selectedSubfamily,
    invoicesdata,
    selectedProjectId,
    selectedFamily,
    setPercentagePaid,
    setTotalPaidByProjectFamilySubfamily,
    setNewFilteredInvoices,
    setAccumatedValue,
  ]);

  return (
    <div className="bg-white mt-3 mb-3 p-2 rounded-xl ml-3 ">
      <h1 className="text-sm font-semibold ml-3 ">FACTURAS</h1>
      <div className="grid grid-cols-[3fr_1fr] overflow-y-visible">
        <table className="table-auto mt-4 border-collapse border border-slate-500 ml-2 mr-2  ">
          <thead className="sticky top-0 bg-blue-500 text-white -z-3">
            <tr className="border border-slate-500 px-4 text-xl ">
              <th className="border border-slate-500 px-4 text-xs  ">
                ProjectId
              </th>
              <th className="border border-slate-500 px-4 text-xs  ">
                Familia
              </th>
              <th className="border border-slate-500 px-4 text-xs  ">
                SubFamila
              </th>
              <th className="border border-slate-500 px-4  text-xs ">
                N° Factura
              </th>
              <th className="border border-slate-500 px-4 text-xs  ">
                Fecha de emision
              </th>
              <th className="border border-slate-500 px-4  text-xs">
                Proveedor
              </th>
              <th className="border border-slate-500 px-4  text-xs ">
                Glosa/EEPP
              </th>
              <th className="border border-slate-500 px-4 text-xs  ">
                $ Factura
              </th>
              <th className="border border-slate-500 px-4 text-xs  ">
                $ AcumuladoFactura
              </th>
              <th className="border border-slate-500 px-4  text-xs ">
                Fecha Pago
              </th>
              <th className="border border-slate-500 px-4  text-xs ">
                Estado Factura
              </th>

              <th className="border border-slate-500 px-4  text-xs ">
                Observaciones
              </th>
            </tr>
          </thead>
          <tbody>
            {newfilteredInvoices.map((invoice) => (
              <tr key={invoice._id}>
                <td className="border border-slate-500 px-4 text-xs ">
                  {invoice.projectId}
                </td>
                <td className="border border-slate-500 px-4 text-xs ">
                  {invoice.family}
                </td>
                <td className="border border-slate-500 px-4 text-xs ">
                  {invoice.subfamily}
                </td>
                <td className="border border-slate-500 px-4 text-xs ">
                  {invoice.invoices}
                </td>
                <td className="border border-slate-500 px-4 text-xs ">
                  {formatedDate(invoice.dateInvoices)}
                </td>
                <td className="border border-slate-500 px-4 text-xs ">
                  {invoice.subcontractorOffers}
                </td>
                <td className="border border-slate-500 px-4 text-xs ">
                  {invoice.description}
                </td>
                <td className="border border-slate-500 px-4 text-xs ">
                  {formatCurrency(invoice.totalInvoices)}
                </td>
                <td className="border border-slate-500 px-4 text-xs ">
                  {formatCurrency(invoice.totalAcumulado)}
                </td>
                <td className="border border-slate-500 px-4 text-xs ">
                  {formatedDate(invoice.dueDate)}
                </td>
                <td className="border border-slate-500 px-4 text-xs ">
                  {invoice.invoiceStatus}
                </td>
                <td className="border border-slate-500 px-4 text-xs ">
                  {invoice.observations}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <div className=" ml-4 mr-8 mt-4 p-6 rounded-xl text-xs text-white text-center shadow-lg  grid grid-cols-2 ">
          <div className=" flex flex-col justify-center mr-2 gap-2 bg-blue-500 rounded-xl font-light">
            <h1>TOTAL FACTURADO</h1>
            <h1 className="text-xs text-white text-center font-semibold  ">
              {formatCurrency(accumatedValue)}
            </h1>
          </div>
          <div className="flex flex-col justify-center text-xs font-light mr-2 gap-2 bg-blue-500 rounded-lg ml-1">
            <h1>% PAGADO DE LO FACTURADO</h1>
            <h1 className="text-xs font-light ">{percentagePaid}%</h1>
          </div>
        </div> */}
      </div>
    </div>
  );
};
export default Invoices;
