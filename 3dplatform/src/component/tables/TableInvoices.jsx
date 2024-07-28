import React, { useState, useContext } from 'react';
import { ViewerContext } from "../Context";

function TableInvoices() {
  const { filteredInvoices, formatCurrency } = useContext(ViewerContext);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const formatedDate = (isoDate) => {
    if (!isoDate) return "";

    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return ""; // Validar si la fecha es válida

    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();

    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(month).padStart(2, "0");

    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  const sortedInvoices = React.useMemo(() => {
    let sortableInvoices = [...filteredInvoices];
    if (sortConfig.key !== null) {
      sortableInvoices.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties
        if (sortConfig.key.includes('.')) {
          const keys = sortConfig.key.split('.');
          aValue = keys.reduce((obj, key) => obj[key], a);
          bValue = keys.reduce((obj, key) => obj[key], b);
        }

        if (typeof aValue === 'string') {
          aValue = aValue?.toLowerCase();
          bValue = bValue?.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableInvoices;
  }, [filteredInvoices, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div>
      <div
        className="overflow-auto text-center"
        style={{ width: "1300px", height: "1000px" }}
      >
        <table className="w-full">
          <thead className="sticky top-0 bg-blue-500 text-white">
            <tr className="border border-slate-300 text-xxs">
              <th className="border border-slate-300 px-2 cursor-pointer" onClick={() => requestSort('family')}>Familia</th>
              <th className="border border-slate-300 px-2 cursor-pointer" onClick={() => requestSort('subfamily')}>SubFamilia</th>
              <th className="border border-slate-300 px-2 cursor-pointer" onClick={() => requestSort('invoices')}>N° Factura</th>
              <th className="border border-slate-300 px-2 cursor-pointer" onClick={() => requestSort('dateInvoices')}>Fecha de emision</th>
              <th className="border border-slate-300 px-2 cursor-pointer" onClick={() => requestSort('rawData.rutProveedor')}>RUT Proveedor</th>
              <th className="border border-slate-300 px-4 cursor-pointer" onClick={() => requestSort('description')}>Proveedor</th>
              <th className="border border-slate-300 px-2 cursor-pointer" onClick={() => requestSort('totalInvoices')}>$ Factura</th>
              <th className="border border-slate-300 px-2 cursor-pointer" onClick={() => requestSort('rawData.estadoDoc')}>Estado</th>
              <th className="border border-slate-300 px-2 cursor-pointer" onClick={() => requestSort('rawData.estadoPago')}>Estado Factura</th>
              <th className="border border-slate-300 px-2 cursor-pointer" onClick={() => requestSort('dueDate')}>Fecha Vencimiento</th>
              <th className="border border-slate-300">
                <button
                  className="bg-green-500 p-1 text-white rounded-lg text-xs"
                  onClick={() => openFormAndCurrentInvloiceId(invoice._id || invoice.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-3 h-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedInvoices.map((invoice, y) => (
              <tr key={y} className="text-xxs">
                <td className="border border-slate-300 px-2">
                  {invoice.family || "Sin Familia"}
                </td>
                <td className="border border-slate-300 px-2">
                  {invoice.subfamily}
                </td>
                <td className="border border-slate-300 px-2">
                  {invoice.invoices}
                </td>
                <td className="border border-slate-300 px-2">
                  {formatedDate(invoice.dateInvoices)}
                </td>
                <td className="border border-slate-300 px-2">
                  {invoice.rawData?.rutProveedor}
                </td>
                <td className="border border-slate-300 px-2">
                  {invoice.description}
                </td>
                <td className="border border-slate-300 px-2">
                  {formatCurrency(invoice.totalInvoices)}
                </td>
                <td className="border border-slate-300 px-2">
                  {invoice.rawData?.estadoDoc}
                </td>
                <td className="border border-slate-300 px-2">
                  {invoice.rawData?.estadoPago}
                </td>
                <td className="border border-slate-300 px-2">
                  {formatedDate(invoice.dueDate)}
                </td>
                <td className="border border-slate-300">
                  <button
                    className="bg-green-500 p-1 text-white rounded-lg text-xs"
                    onClick={() =>
                      openFormAndCurrentInvloiceId(invoice._id || invoice.id)
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-3 h-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableInvoices;
