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
    setTotalPaidByProjectFamilySubfamily,
    setTotalUnpaidInvoices,
  } = useContext(ViewerContext);

  const [newfilteredInvoices, setNewFilteredInvoices] = useState([]);
  const [totalInvoices, setTotalInvoices] = useState(0);

  const formatedDate = (isoDate) => {
    if (!isoDate) return "Fecha no disponible";
    const date = new Date(isoDate);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(month).padStart(2, "0");
    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  useEffect(() => {
    if (!invoicesdata) return; // Asegúrate de que invoicesdata esté disponible

    const filteredInvoices = invoicesdata.filter(
      (invoice) =>
        (!selectedProjectId || invoice.projectId === selectedProjectId) &&
        (!selectedFamily || invoice.family === selectedFamily) &&
        (!selectedSubfamily || invoice.subfamily === selectedSubfamily)
    );

    filteredInvoices.sort(
      (a, b) => new Date(a.dateInvoices) - new Date(b.dateInvoices)
    );

    let acumulado = 0;
    const invoicesWithAccumulated = filteredInvoices.map((invoice) => {
      acumulado += parseFloat(invoice.totalInvoices) || 0;
      return { ...invoice, totalAcumulado: acumulado };
    });

    const totalPaid = filteredInvoices
      .filter((invoice) => invoice.invoiceStatus === "Pagada")
      .reduce(
        (sum, invoice) => sum + parseFloat(invoice.totalInvoices || 0),
        0
      );

    const totalInvoiced = filteredInvoices.reduce(
      (sum, invoice) => sum + parseFloat(invoice.totalInvoices || 0),
      0
    );

    const totalUnpaid = filteredInvoices
      .filter((invoice) => invoice.invoiceStatus !== "Pagada")
      .reduce(
        (sum, invoice) => sum + parseFloat(invoice.totalInvoices || 0),
        0
      );

    const totalInvoicespaidUnPaid = totalPaid + totalUnpaid;

    

    setTotalInvoices(totalInvoiced);
    setTotalPaidByProjectFamilySubfamily(totalPaid);
    setTotalUnpaidInvoices(totalInvoicespaidUnPaid);
    setNewFilteredInvoices(invoicesWithAccumulated);
    setAccumatedValue(acumulado);
  }, [invoicesdata, selectedProjectId, selectedFamily, selectedSubfamily]);

  return (
    <div
      className="bg-white my-2 ml-3 mr-2 p-2 rounded-lg "
      style={{ width: "1200px" }}
    >
      <h1 className="text-sm font-semibold ml-3 ">FACTURAS</h1>
      <h1 className="bg-blue-500 text-xl text-white p-6 rounded-xl ml-1 mb-4 mt-2">
        {formatCurrency(totalInvoices)}
      </h1>
      <div className="overflow-auto" style={{ height: "400px" }}>
        <table className=" mt-2 border border-slate-500 ml-2 mr-2 ">
          <thead className="sticky top-0 bg-blue-500 text-white ">
            <tr className="border border-slate-300  text-xxs">
              <th className="border border-slate-300px-4   ">ProjectId</th>
              <th className="border border-slate-300 px-4  ">Familias</th>
              <th className="border border-slate-300 px-4  ">SubFamila</th>
              <th className="border border-slate-300 px-4  ">N° Factura</th>
              <th className="border border-slate-300 px-4  ">
                Fecha de emision
              </th>
              <th className="border border-slate-300 px-4 ">Proveedor</th>
              <th className="border border-slate-300 px-4  ">Glosa/EEPP</th>
              <th className="border border-slate-300 px-4  ">$ Factura</th>
              <th className="border border-slate-300 px-4  ">
                $ AcumuladoFactura
              </th>
              <th className="border border-slate-300 px-4  ">Fecha vencimiento</th>
              <th className="border border-slate-300 px-4  ">Estado Factura</th>
            </tr>
          </thead>
          <tbody>
            {newfilteredInvoices.map((invoice) => (
              <tr key={invoice._id} className="text-xxs">
                <td className="border border-slate-300 px-4  ">
                  {invoice.projectId}
                </td>
                <td className="border border-slate-300 px-4  ">
                  {invoice.family}
                </td>
                <td className="border border-slate-300 px-4  ">
                  {invoice.subfamily}
                </td>
                <td className="border border-slate-300 px-4  ">
                  {invoice.invoices}
                </td>
                <td className="border border-slate-300 px-4  ">
                  {formatedDate(invoice.dateInvoices)}
                </td>
                <td className="border border-slate-300 px-4  ">
                  {invoice.subcontractorOffers}
                </td>
                <td className="border border-slate-300 px-4  ">
                  {invoice.description}
                </td>
                <td className="border border-slate-300 px-4  ">
                  {formatCurrency(invoice.totalInvoices)}
                </td>
                <td className="border border-slate-300 px-4  ">
                  {formatCurrency(invoice.totalAcumulado)}
                </td>
                <td className="border border-slate-300 px-4  ">
                  {formatedDate(invoice.dueDate)}
                </td>
                <td className="border border-slate-300 px-4  ">
                  {invoice.invoiceStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Invoices;
