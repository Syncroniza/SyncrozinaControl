import { useContext, useEffect, useState } from "react";
import { ViewerContext } from "../Context";
import {
  Table,
  Header,
  HeaderRow,
  HeaderCell,
  Row,
  Body,
  Cell,
} from "@table-library/react-table-library/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { useTheme } from "@table-library/react-table-library/theme";
import Exceltransform from "../Exceltransform";

const MonthCostaLaborTable = () => {
  const { dataNode, projects, formatCurrency } = useContext(ViewerContext);
  const [totalsWithAccumulated, setTotalsWithAccumulated] = useState([]);
  const [monthlyCosts, setMonthlyCosts] = useState([]);
  const [selectedByProjectId, setSelectedByProjectId] = useState("");
  const [combinedData, setCombinedData] = useState("");
  // filtra la mano de obra proyectada por mes
  useEffect(() => {
    let filteredSheets = projects
      .flatMap((project) => project.sheets)
      .filter(
        (sheet) =>
          sheet.family === "Mano_Obra" &&
          (!selectedByProjectId || sheet.projectId === selectedByProjectId)
      );
    const manoobraData = filteredSheets.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const groupedByMonth = manoobraData.reduce((acc, sheet) => {
      const monthYear = `${new Date(sheet.date).getMonth() + 1}-${new Date(
        sheet.date
      ).getFullYear()}`;
      if (!acc[monthYear]) {
        acc[monthYear] = {
          realCost: 0,
          plannedCost: 0,
          accumulatedReal: 0,
        };
      }
      acc[monthYear].realCost += sheet.total;
      return acc;
    }, {});

    // Reinicia acumuladoReal para cada proyecto
    let acumuladoReal = 0;
    const monthlyData = Object.entries(groupedByMonth).map(
      ([monthYear, data]) => {
        acumuladoReal += data.realCost;
        return {
          monthYear,
          realCost: data.realCost,
          plannedCost: data.plannedCost, // Asume este valor ya está calculado o agregado
          accumulatedReal: acumuladoReal,
        };
      }
    );

    setMonthlyCosts(monthlyData);
  }, [projects, selectedByProjectId]);

  // Filtra los acumulados por proyecto separadamente

  useEffect(() => {
    // Agrupar dataNode.nodes por projectId
    const groupedByProject = dataNode.nodes.reduce((acc, item) => {
      const { projectId } = item;
      if (!acc[projectId]) {
        acc[projectId] = [];
      }
      acc[projectId].push(item);
      return acc;
    }, {});

    // Aquí, cada 'items' es un arreglo de nodos para un projectId específico
    const totalsByProject = Object.entries(groupedByProject)
      .map(([projectId, items]) => {
        // Ahora agrupa y calcula por monthYear dentro de cada proyecto
        const groupedByMonth = items.reduce((acc, item) => {
          const monthYear = `${
            new Date(item.deadline).getMonth() + 1
          }-${new Date(item.deadline).getFullYear()}`;
          if (!acc[monthYear]) {
            acc[monthYear] = { totalLabor: 0, items: [] };
          }
          acc[monthYear].totalLabor += Number(item.total || 0);
          acc[monthYear].items.push(item);
          return acc;
        }, {});
        // Ordenar las entradas de groupedByMonth por fecha (monthYear)
        const sortedEntries = Object.entries(groupedByMonth).sort((a, b) => {
          const dateA = new Date(a[0].split("-")[1], a[0].split("-")[0] - 1); // Convierte 'monthYear' a Date
          const dateB = new Date(b[0].split("-")[1], b[0].split("-")[0] - 1);
          return dateA - dateB;
        });
        // Calcula acumulados para cada proyecto de manera independiente
        let accumulated = 0;
        return sortedEntries.map(([period, data]) => {
          accumulated += data.totalLabor;
          return {
            period,
            totalLabor: data.totalLabor,
            projectId,
            accumulated,
          };
        });
      })
      .flat(); // Aplanar el arreglo resultante para no tener un arreglo de arreglos

    setTotalsWithAccumulated(totalsByProject);
  }, [dataNode, selectedByProjectId]);

  //combinacion de Data para que el grafico muestre el correspondiente projectId
  useEffect(() => {
    const filteredTotalsWithAccumulated = totalsWithAccumulated.filter(
      (item) => item.projectId === selectedByProjectId
    );

    const newCombinedData = filteredTotalsWithAccumulated.map((twaItem) => {
      const monthlyCostItem = monthlyCosts.find(
        (mcItem) => mcItem.monthYear === twaItem.period
      );
      return {
        month: twaItem.period,
        projectedAccumulated: twaItem.accumulated,
        realAccumulated: monthlyCostItem ? monthlyCostItem.accumulatedReal : 0,
      };
    });

    setCombinedData(newCombinedData);
  }, [totalsWithAccumulated, monthlyCosts, selectedByProjectId]);

  // generar lsita con Ids unicos para filtrado por projectId
  const projectIds = projects.map((project) => project.projectId);

  const theme = useTheme({
    HeaderRow: `
        background-color: #eaf5fd;
      `,
    Row: `
        &:nth-of-type(odd) {
          background-color: #d2e9fb;
        }

        &:nth-of-type(even) {
          background-color: #eaf5fd;
        }
      `,
  });

  return (
    <div className="  mt-4 p-1 rounded-lg ">
      <div className="p-2">
        <div className="bg-white p-1 text-lg font-semibold rounded-lg text-center ">
          <h1>Control Mano de Obra (Proyectado vs Real)</h1>
          <select
            className="ml-2 bg-blue-500 text-white p-2 text-sm fonr-semibold rounded-lg  mt-1 mb-1 shadow-xl"
            value={selectedByProjectId}
            name="selectedByProjectId"
            onChange={(e) => setSelectedByProjectId(e.target.value)}
          >
            <option value="">Selecciona un Proyecto</option>
            {projectIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>
        <div className=" bg-white p-4 mt-2 rounded-lg ">
          <div className="flex flex-row grow text-lg bg-blue-500 p-6 rounded-xl">
            <h1 className=" mr-2">Disponible</h1>
            <h1 className="">Gastado a la Fecha</h1>
            <h1 className="">Por Gastar</h1>
            <h1 className="">% Gastado</h1>
          </div>
        </div>
      </div>

      <Exceltransform UrlEndpoint="http://localhost:8000/labor/" />
      <div className=" mt-2 p-1"></div>
      {/* ---------------------- React Table --------------------------- */}
      {/* <div>
        <Table
          data={dataNode}
          theme={theme}
          layout={{
            custom: false,
            horizontalScroll: false,
            fixedHeader: false,
          }}>
          {() => (
            <>
              <Header>
                <HeaderRow className="text-xs">
                  <HeaderCell>ProjectId</HeaderCell>
                  <HeaderCell>Item</HeaderCell>
                  <HeaderCell>Periodo</HeaderCell>
                  <HeaderCell>Mensual</HeaderCell>
                  <HeaderCell>Acumulado </HeaderCell>
                  <HeaderCell>Mensual Real</HeaderCell>
                  <HeaderCell>Acumulado Real </HeaderCell>
                </HeaderRow>
              </Header>
              <Body>
                {totalsWithAccumulated
                  .filter((total) => total.projectId === selectedByProjectId)
                  .map((total, y) => {
                    const monthlyCost = monthlyCosts.find(
                      (cost) => cost.monthYear === total.period
                    );

                    return (
                      <Row key={y} className="text-xs">
                        <Cell className="">{total.projectId}</Cell>
                        <Cell className="">{y + 1}</Cell>
                        <Cell className="">{total.period}</Cell>
                        <Cell>{formatCurrency(total.totalLabor)}</Cell>
                        <Cell>{formatCurrency(total.accumulated)}</Cell>
                        <Cell>
                          {monthlyCost
                            ? formatCurrency(monthlyCost.realCost)
                            : "No disponible"}
                        </Cell>
                        <Cell>
                          {monthlyCost
                            ? formatCurrency(monthlyCost.accumulatedReal)
                            : "No disponible"}
                        </Cell>
                      </Row>
                    );
                  })}
              </Body>
            </>
          )}
        </Table>
      </div> */}
      {/* ------------------------Tabla de Mano de Obra--------------- */}
      <div
        className="bg-white mb-4 mt-4 mr-3 shadow-lg rounded-lg  overflow-y-auto "
        style={{ height: "400px" }}
      >
        <table className="w-full ">
          <thead className="bg-white sticky top-0 ">
            <tr className="text-black text-sm pb-2 border-slate-500">
              <th className=" border-slate-700 p-3 ml-4 text-sm ">ProjectId</th>
              <th>Item</th>
              <th>Periodo</th>
              <th>Mensual Planificado</th>
              <th>Acumulado Planificado</th>
              <th>Mensual Real</th>
              <th>Acumulado Real</th>
            </tr>
          </thead>
          <tbody className="">
            {totalsWithAccumulated.map((item, index) => (
              <tr
                key={index}
                className="border border-slate-500 text-center text-xs"
              >
                <td className="p-1">{item.projectId}</td>
                <td className=" "></td>
                <td className="  ">{item.period}</td>
                <td className="">{formatCurrency(item.totalLabor)}</td>
                <td className=" ">{formatCurrency(item.montoContrato)}</td>
                <td className=" ">{formatCurrency(item.recuperable)}</td>
                <td className="">{formatCurrency(item.totalconextras)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*------------------------ Grafico -----------------------  */}
      <div className="mt-4 ml-4 bg-white">
        <LineChart
          width={1200}
          height={500}
          data={combinedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="projectedAccumulated"
            stroke="#8884d8"
          />
          <Line type="monotone" dataKey="realAccumulated" stroke="#82ca9d" />
        </LineChart>
      </div>
      {/* ------------------------Tabla mano de obra ------------------- */}
    </div>
  );
};

export default MonthCostaLaborTable;
