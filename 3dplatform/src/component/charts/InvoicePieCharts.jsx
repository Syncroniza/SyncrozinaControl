import React, { useEffect, useState, useContext } from "react";
import { ViewerContext } from "../Context";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const renderTooltipContent = (value) => `$${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

const InvoicePieCharts = () => {
  const { invoicesdata } = useContext(ViewerContext);

  const [paidData, setPaidData] = useState([]);
  const [unpaidData, setUnpaidData] = useState([]);

  useEffect(() => {
    const processData = () => {
      const paidMap = {};
      const unpaidMap = {};

      invoicesdata.forEach((invoice) => {
        const amount = invoice.rawData.montoTotal / 1.19; // Quitar IVA
        const subStatus = invoice.rawData.estadoDoc;

        if (invoice.invoiceStatus === "Pagada") {
          if (!paidMap[subStatus]) {
            paidMap[subStatus] = { name: subStatus, value: 0 };
          }
          paidMap[subStatus].value += amount;
        } else if (invoice.invoiceStatus === "Sin Pagos" || invoice.invoiceStatus === "Sin pagos") {
          if (!unpaidMap[subStatus]) {
            unpaidMap[subStatus] = { name: subStatus, value: 0 };
          }
          unpaidMap[subStatus].value += amount;
        }
      });

      setPaidData(Object.values(paidMap));
      setUnpaidData(Object.values(unpaidMap));
    };

    processData();
  }, [invoicesdata]);

  return (
    <div>
      <h2 className="mt-4 ml-2  mb-4 text-lg">Gráfica Facturas según Estado</h2>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div className="bg-gray-200 rounded-lg shadow-xl">
          <h3 className="text-center">Pagada</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={paidData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120} // Reducir el radio externo
              fill="#8884d8"
              dataKey="value"
            >
              {paidData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={renderTooltipContent} />
            <Legend formatter={(value, entry) => `${entry.payload.name}: ${renderTooltipContent(entry.payload.value)}`} />
          </PieChart>
        </div>
        <div className="bg-gray-200 rounded-lg shadow-xl">
          <h3 className="text-center">Sin pagos</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={unpaidData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120} // Reducir el radio externo
              fill="#82ca9d"
              dataKey="value"
            >
              {unpaidData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={renderTooltipContent} />
            <Legend formatter={(value, entry) => `${entry.payload.name}: ${renderTooltipContent(entry.payload.value)}`} />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default InvoicePieCharts;
