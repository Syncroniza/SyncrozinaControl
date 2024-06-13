// import { useContext, useEffect, useState } from "react";
// import { ViewerContext } from "../Context";
// import FormLaborCost from "../sheetcontrol/FormLaborCost";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";

// import Exceltransform from "../Exceltransform";

// const MonthCostaLaborTable = () => {
//   const {
//     dataNode,
//     projects,
//     formatCurrency,
//     isModalOpen,
//     setIsMoldalOpen,
//     currentPeriodId,
//     setCurrentPeriodId,
//   } = useContext(ViewerContext);
//   const [totalsWithAccumulated, setTotalsWithAccumulated] = useState([]);
//   console.log("🚀 ~ MonthCostaLaborTable ~ totalsWithAccumulated:", totalsWithAccumulated)

//   const [monthlyCosts, setMonthlyCosts] = useState([]);
//   const [selectedByProjectId, setSelectedByProjectId] = useState("");
//   const [combinedData, setCombinedData] = useState("");

//   const [realMonthCost, setRealMonthCost] = useState("");
//   console.log("🚀 ~ MonthCostaLaborTable ~ realMonthCost:", realMonthCost)

//   // filtra la mano de obra proyectada por mes
//   useEffect(() => {
//     let filteredSheets = projects
//       .flatMap((project) => project.sheets)
//       .filter(
//         (sheet) =>
//           sheet.family === "Mano_Obra" &&
//           (!selectedByProjectId || sheet.projectId === selectedByProjectId)
//       );
//     const manoobraData = filteredSheets.sort(
//       (a, b) => new Date(a.date) - new Date(b.date)
//     );
//     const groupedByMonth = manoobraData.reduce((acc, sheet) => {
//       const monthYear = `${new Date(sheet.date).getMonth() + 1}-${new Date(
//         sheet.date
//       ).getFullYear()}`;
//       if (!acc[monthYear]) {
//         acc[monthYear] = {
//           realCost: 0,
//           plannedCost: 0,
//           accumulatedReal: 0,
//         };
//       }
//       acc[monthYear].realCost += sheet.total;
//       return acc;
//     }, {});

//     // Reinicia acumuladoReal para cada proyecto
//     let acumuladoReal = 0;
//     const monthlyData = Object.entries(groupedByMonth).map(
//       ([monthYear, data]) => {
//         acumuladoReal += data.realCost;
//         return {
//           monthYear,
//           realCost: data.realCost,
//           plannedCost: data.plannedCost,
//           accumulatedReal: acumuladoReal,
//         };
//       }
//     );

//     setMonthlyCosts(monthlyData);
//   }, [projects, selectedByProjectId]);

//   // Filtra los acumulados por proyecto separadamente

//   useEffect(() => {
//     const groupedByProject = dataNode.nodes.reduce((acc, item) => {
//       const projectId = item.projectId;
//       if (!acc[projectId]) {
//         acc[projectId] = [];
//       }
//       acc[projectId].push(item);
//       return acc;
//     }, {});

//     const totalsByProject = Object.entries(groupedByProject)
//       .map(([projectId, items]) => {
//         let accumulated = 0;
//         const results = items.reduce((acc, item) => {
//           const monthYear = `${
//             new Date(item.deadline).getMonth() + 1
//           }-${new Date(item.deadline).getFullYear()}`;
//           if (!acc[monthYear]) {
//             acc[monthYear] = {
//               totalLabor: 0,
//               items: [],
//               uniqueId: `${projectId}-${monthYear}`,
//               period: monthYear // Guardar el periodo como mes-año
//             };
//           }
//           acc[monthYear].totalLabor += Number(item.total || 0);
//           acc[monthYear].items.push(item);
//           return acc;
//         }, {});

//         // Convertir a array y calcular valores acumulados
//         return Object.values(results).map((data) => {
//           accumulated += data.totalLabor;
//           return {
//             period: data.period,
//             totalLabor: data.totalLabor,
//             realMonthCost:data.realMonthCost,
//             projectId,
//             accumulated,
//             uniqueId: data.uniqueId,
//           };
//         });
//       })
//       .flat();

//     setTotalsWithAccumulated(totalsByProject);
// }, [dataNode, selectedByProjectId]);

//   //combinacion de Data para que el grafico muestre el correspondiente projectId
//   useEffect(() => {
//     const filteredTotalsWithAccumulated = totalsWithAccumulated.filter(
//       (item) => item.projectId === selectedByProjectId
//     );

//     const newCombinedData = filteredTotalsWithAccumulated.map((twaItem) => {
//       const monthlyCostItem = monthlyCosts.find(
//         (mcItem) => mcItem.monthYear === twaItem.period
//       );
//       return {
//         month: twaItem.period,
//         projectedAccumulated: twaItem.accumulated,
//         realAccumulated: monthlyCostItem ? monthlyCostItem.accumulatedReal : 0,
//       };
//     });

//     setCombinedData(newCombinedData);
//   }, [totalsWithAccumulated, monthlyCosts, selectedByProjectId]);

//   // generar lsita con Ids unicos para filtrado por projectId
//   const projectIds = projects.map((project) => project.projectId);

//   //---------------------Open and  Update Form ----------------------//
//   const openFormAndCurrentLaborId = (uniqueId) => {
//     const entry = totalsWithAccumulated.find(
//       (item) => item.uniqueId === uniqueId
//     );
//     if (entry) {
//       setIsMoldalOpen(true);
//       setCurrentPeriodId(uniqueId); // Asumiendo que tienes una función para esto
//       setRealMonthCost(entry.realMonthCost || 0); // Configura el costo actual si existe
//     }
//   };

//   return (
//     <div className="  mt-4 p-1 rounded-lg bg-gradient-to-r from-indigo-500">
//       <div className="p-2">
//         <FormLaborCost />
//         <div className="bg-white p-1 text-lg font-semibold rounded-lg text-center ">
//           <h1>Control Mano de Obra (Proyectado vs Real)</h1>
//           <select
//             className="ml-2 bg-blue-500 text-white p-2 text-sm fonr-semibold rounded-lg  mt-1 mb-1 shadow-xl"
//             value={selectedByProjectId}
//             name="selectedByProjectId"
//             onChange={(e) => setSelectedByProjectId(e.target.value)}
//           >
//             <option value="">Selecciona un Proyecto</option>
//             {projectIds.map((id) => (
//               <option key={id} value={id}>
//                 {id}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className=" bg-white p-4 mt-2 rounded-lg ">
//           <div className="flex flex-row justify-between grow text-lg bg-blue-500 p-6 rounded-xl text-white ">
//             <h1 className=" mr-2 gap">Disponible</h1>
//             <h1 className="">Gastado a la Fecha</h1>
//             <h1 className="">Por Gastar</h1>
//             <h1 className="">% Gastado</h1>
//           </div>
//         </div>
//       </div>
//       <Exceltransform UrlEndpoint="http://localhost:8000/labor/" />
//       <div className=" mt-2 p-1"></div>
//       {/* ---------------------- React Table --------------------------- */}

//       <div
//         className="bg-white mb-4 mt-4  mr-3 shadow-lg rounded-lg  overflow-y-auto "
//         style={{ height: "400px" }}
//       >
//         <table className="w-full ">
//           <thead className="bg-blue-500 sticky top-0 ">
//             <tr className="text-white text-xs pb-2 border-slate-500">
//               <th className=" border-slate-700 p-3 ml-4 text-xs ">ProjectId</th>
//               <th>Periodo</th>
//               <th>Mensual Planificado</th>
//               <th>Acumulado Planificado</th>
//               <th>Mensual Real</th>
//               <th>Editar</th>
//               <th>Acumulado Real</th>
//               <th>Diferencia</th>
//               <th>Diferencia Acumulada</th>
//             </tr>
//           </thead>
//           <tbody className="">
//             {totalsWithAccumulated.map((item, index) => (
//               <tr
//                 key={index}
//                 className="border border-slate-500 text-center text-xs"
//               >
//                 <td className="p-1">{item.projectId}</td>
//                 <td className="  ">{item.period}</td>
//                 <td className="">{formatCurrency(item.totalLabor)}</td>
//                 <td className=" ">{formatCurrency(item.accumulated)}</td>
//                 <td className=" ">{formatCurrency(item.realmonthcost)}</td>
//                 <td>
//                   <button
//                     className=" text-black rounded-lg text-xs bg-green-400 p-1"
//                     onClick={() => openFormAndCurrentLaborId(item.uniqueId)}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth={1.5}
//                       stroke="currentColor"
//                       className="w-4 h-4 "
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
//                       />
//                     </svg>
//                   </button>
//                 </td>
//                 <td className="">{formatCurrency(item.realMonthCost)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/*------------------------ Grafico -----------------------  */}
//       <div className="mt-4 ml-4 bg-white">
//         <LineChart
//           width={1200}
//           height={500}
//           data={combinedData}
//           margin={{
//             top: 5,
//             right: 30,
//             left: 20,
//             bottom: 5,
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="projectedAccumulated"
//             stroke="#8884d8"
//           />
//           <Line type="monotone" dataKey="realAccumulated" stroke="#82ca9d" />
//         </LineChart>
//       </div>
//       {/* ------------------------Tabla mano de obra ------------------- */}
//     </div>
//   );
// };

// export default MonthCostaLaborTable;
import { useContext, useEffect, useState, useMemo } from "react";
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
import axios from "axios";

const MonthCostaLaborTable = () => {
  const {
    dataNode,
    projects,
    formatCurrency,
    accumulatedRealMonthCost,
    setAccumulatedRealMonthCost,
  } = useContext(ViewerContext);
    console.log("🚀 ~ MonthCostaLaborTable ~ accumulatedRealMonthCost:", accumulatedRealMonthCost)
  const [totalsWithAccumulated, setTotalsWithAccumulated] = useState([]);

  const [monthlyCosts, setMonthlyCosts] = useState([]);
  const [selectedByProjectId, setSelectedByProjectId] = useState("");
  const [combinedData, setCombinedData] = useState("");
  const [totalRealMonthCost, setTotalRealMonthCost] = useState(0);

  const [disponible, setDisponible] = useState(0);
  const [porcentajeGastado, setPorcentajeGastado] = useState(0);
  const [editables, setEditables] = useState({});

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
          plannedCost: data.plannedCost,
          accumulatedReal: acumuladoReal,
        };
      }
    );

    setMonthlyCosts(monthlyData);
  }, [projects, selectedByProjectId]);

  // Filtra los acumulados por proyecto separadamente
  useEffect(() => {
    const totalRealCost = totalsWithAccumulated.reduce(
      (acc, item) => acc + item.totalLabor,
      0
    );
    if (totalsWithAccumulated.length > 0) {
      const accumulatedRealMonthCost =
        totalsWithAccumulated[totalsWithAccumulated.length - 1].realAccumulated;
      setAccumulatedRealMonthCost(accumulatedRealMonthCost);
    }

    const disponible = totalRealCost - accumulatedRealMonthCost;
    setDisponible(disponible);

    const porcentajeGastado =
      totalRealCost > 0 ? (accumulatedRealMonthCost / totalRealCost) * 100 : 0;
    setPorcentajeGastado(porcentajeGastado);

    setTotalRealMonthCost(totalRealCost);
  }, [totalsWithAccumulated]);

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
            acc[monthYear] = { totalLabor: 0, realmonthcost: 0, items: [] };
          }
          acc[monthYear].totalLabor += Number(item.total || 0);
          acc[monthYear].realmonthcost += Number(item.realmonthcost || 0);
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
        let realAccumulated = 0;
        return sortedEntries.map(([period, data]) => {
          accumulated += data.totalLabor;
          realAccumulated += data.realmonthcost;
          return {
            period,
            totalLabor: data.totalLabor,
            projectId,
            accumulated,
            realmonthcost: data.realmonthcost,
            realAccumulated,
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
  const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateMyData, // Esta función se usa para actualizar los datos en el estado global
  }) => {
    const [value, setValue] = useState(initialValue);

    const onChange = (e) => {
      setValue(e.target.value);
      setEditables((prev) => ({
        ...prev,
        [`${index}-${id}`]: e.target.value,
      }));
    };

    const onBlur = () => {
      updateMyData(index, id, value);
    };

    return <input value={value} onChange={onChange} onBlur={onBlur} />;
  };

  const columns = useMemo(
    () => [
      {
        Header: "Real Cost",
        accessor: "realCost",
        Cell: EditableCell,
      },
    ],
    []
  );

  // Envia datos al back end//
  const handleSave = async () => {
    try {
      // Preparar los datos para enviar
      const formattedData = Object.entries(editables).map(([key, value]) => {
        const [index, property] = key.split("-");
        return { index, property, value };
      });

      console.log(editables);

      if (formattedData.length === 0) return; // Si no hay cambios, no hacer nada

      // Enviar los datos al servidor
      const response = await axios.post(
        "http://localhost:8000/labor/",
        formattedData.map((dtm) => {
          let total = totalsWithAccumulated[dtm.index];
          console.log(total);
          const [month, year] = total.period.split("-");
          return {
            projectId: "PT-101",
            deadline: new Date(year, month, 0),
            [dtm.property]: dtm.value,
          };
        })
      );
      console.log("Response Data:", response.data); // Verificar la estructura de la respuesta

      // Actualizar el estado con los nuevos datos
      setTotalsWithAccumulated((prev) =>
        prev.map((item, index) => {
          console.log("uI", updatedItems);
          const changes = updatedItems.find(
            (change) => parseInt(change.index, 10) === index
          );
          return changes ? { ...item, ...changes.updates } : item;
        })
      );

      // Limpiar editables después de guardar
      setEditables({});
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleInputChange = (event, index, columnId) => {
    const { value } = event.target;

    // Actualizar el estado que maneja los datos mostrados en la tabla
    setTotalsWithAccumulated((prevTotals) =>
      prevTotals.map((item, idx) => {
        if (idx === index) {
          return { ...item, [columnId]: value };
        }
        return item;
      })
    );

    // Actualizar el estado que mantiene los datos editables para ser enviados
    setEditables((prev) => ({
      ...prev,
      [`${index}-${columnId}`]: value,
    }));
  };

  return (
    <div className=" mt-4 p-2 py-2  ">
      <div className="p-4">
        <div className="bg-white text-lg mb-4 font-semibold rounded-lg text-center">
          <h1>Control Mano de Obra (Proyectado vs Real)</h1>
        </div>

        <div className=" text-sm bg-white rounded-lg text-white text-center py-6">
          <div className="bg-blue-500 grid grid-cols-4 mx-4 rounde rounded-lg">
            <h1>Disponible</h1>

            <h1>Gastado a la Fecha</h1>

            <h1>Por Gastar</h1>
            <h1>% Gastado</h1>

            <p>{formatCurrency(totalRealMonthCost)}</p>
            <p>{formatCurrency(accumulatedRealMonthCost)}</p>
            <p>{formatCurrency(disponible)}</p>
            <p>{porcentajeGastado.toFixed}%</p>
          </div>
        </div>
        <select
          className=" bg-blue-500 p-2 rounded-lg text-xs text-white mt-4 mb-2 shadow-lg"
          value={selectedByProjectId}
          name="selectedByProjectId"
          onChange={(e) => setSelectedByProjectId(e.target.value)}
        >
          <option className="text-xs" value="">
            Selecciona un Proyecto
          </option>
          {projectIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
        <Exceltransform UrlEndpoint="http://localhost:8000/labor/" />

        {/* -------------------  Table ----------------------------- */}
        <div className="mt-4 ml-4"></div>
        <Table data={{ nodes: totalsWithAccumulated }} theme={theme}>
          {() => (
            <>
              <Header>
                <HeaderRow className="text-xs">
                  <HeaderCell>Project ID</HeaderCell>
                  <HeaderCell>Periodo</HeaderCell>
                  <HeaderCell>Mensual Planificado</HeaderCell>
                  <HeaderCell>Acumulado Planificado</HeaderCell>
                  <HeaderCell>Mensual Real</HeaderCell>
                  <HeaderCell>Acumulado Real</HeaderCell>
                  <HeaderCell>Edit</HeaderCell>
                </HeaderRow>
              </Header>
              <Body>
                {totalsWithAccumulated.map((item, index) => (
                  <Row className="text-xs" key={item.uniqueId}>
                    <Cell>{item.projectId}</Cell>
                    <Cell>{item.period}</Cell>
                    <Cell>{formatCurrency(item.totalLabor)}</Cell>
                    <Cell>{formatCurrency(item.accumulated)}</Cell>
                    <Cell>
                      <input
                        type="text"
                        value={item.realmonthcost}
                        onChange={(e) =>
                          handleInputChange(e, index, "realmonthcost")
                        }
                      />
                    </Cell>
                    <Cell>{formatCurrency(item.realAccumulated)}</Cell>
                    <Cell>
                      <button onClick={() => handleSave(index)}>Grabar</button>
                    </Cell>
                  </Row>
                ))}
              </Body>
            </>
          )}
        </Table>
      </div>

      {/* -----------------------  Grafico ------------------------- */}
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
    </div>
  );
};

export default MonthCostaLaborTable;
