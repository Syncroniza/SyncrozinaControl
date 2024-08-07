import React, { useEffect, useState, useContext } from "react";
import { ViewerContext } from "../Context";

const InvoicesStatusChart = () => {
  const { invoicesdata, formatCurrency } = useContext(ViewerContext);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    const processData = () => {
      const statusMap = {};

      invoicesdata.forEach((invoice) => {
        const status = invoice.invoiceStatus;
        const subStatus = invoice?.rawData?.estadoDoc;
        const amount = invoice?.rawData?.montoTotal / 1.19;

        if (!statusMap[status]) {
          statusMap[status] = { count: 0, total: 0, subStatuses: {} };
        }

        statusMap[status].count += 1;
        statusMap[status].total += amount;

        if (!statusMap[status].subStatuses[subStatus]) {
          statusMap[status].subStatuses[subStatus] = { count: 0, total: 0 };
        }

        statusMap[status].subStatuses[subStatus].count += 1;
        statusMap[status].subStatuses[subStatus].total += amount;
      });

      setStatusData(Object.entries(statusMap));
    };

    processData();
  }, [invoicesdata]);

  return (
    <div>
      <h2 className="mt-4 ml-2">Detalle Estados de Facturas</h2>
      <table className="ml-20 mt-6">
        <thead className="sticky top-0 bg-blue-500 text-white">
          <tr className="text-sm border border-3">
            <th>Estado</th>
            <th>Sub-Estado</th>
            <th>Numero de Documentos</th>
            <th>Total $</th>
          </tr>
        </thead>
        <tbody>
          {statusData.map(([status, data]) => (
            <>
              <tr
                key={status}
                className="text-xs border border-slate-500 bg-slate-300"
              >
                <td className="border border-slate-500 bg-slate-300">
                  {status}
                </td>
                <td></td>
                <td className="border border-slate-500 text-center">
                  {data.count}
                </td>
                <td className="border border-slate-500">
                  {formatCurrency(data.total)}
                </td>
              </tr>
              {Object.entries(data.subStatuses).map(([subStatus, subData]) => (
                <tr
                  key={subStatus}
                  className="text-xs border border-slate-500 "
                >
                  <td></td>
                  <td className="borde border-slate-500">{subStatus}</td>
                  <td className="borde border-slate-500 text-center">
                    {subData.count}
                  </td>
                  <td className="borde border-slate-500">
                    {formatCurrency(subData.total)}
                  </td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoicesStatusChart;
