import { useContext } from "react";
import { ViewerContext } from "../Context";
import FormAreaChart from "../sheetcontrol/FormAreaChart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const MainAreaChart = () => {
  const { aernValueAccumalated } = useContext(ViewerContext);
  console.log("🚀 ~ MainAreaChart ~ aernValueAccumalated:", aernValueAccumalated)

  // Función para formatear la fecha
  const formatedDate = (isoDate) => {
    if (!isoDate) return "";

    const date = new Date(isoDate);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();

    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(month).padStart(2, "0");

    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  return (
    <div className="mt-10 ml-10">
      <FormAreaChart />
      <h2 className="text-indigo-800 font-bold text-2xl">
        Planned Value vs Earn Value
      </h2>
      <LineChart
        width={1200}
        height={500}
        data={aernValueAccumalated}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
        <XAxis
          dataKey="finishdate"
          tick={{ fontSize: "12px" }}
          stroke="#8884d8"
          tickFormatter={formatedDate} // Usar formatedDate para formatear las fechas en el eje X
        />
        <YAxis
          tick={{ fontSize: "10px" }}
          stroke="#8884d8"
          tickCount={10}
          tickFormatter={(value) =>
            value.toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            })
          }
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
          }}
          labelFormatter={formatedDate} // Usar formatedDate para formatear las fechas en el tooltip
          formatter={(value, name) => [
            `${name}: ${value.toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            })}`,
          ]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="acumuladoPlanValue"
          stroke="#8884d8"
          name="PlanValue"
        />
        <Line
          type="monotone"
          dataKey="acumuladoActualCost"
          stroke="#e4122e"
          name="ActualCost"
        />
        <Line
          type="monotone"
          dataKey="acumuladoEarn"
          stroke="#82ca9d"
          name="EarnValue"
        />
        <Line
          type="monotone"
          dataKey="eepp"
          stroke="#82ca9d"
          name="EarnValue"
        />
      </LineChart>
    </div>
  );
};

export default MainAreaChart;
