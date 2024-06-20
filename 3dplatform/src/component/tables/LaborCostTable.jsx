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

import { useTheme } from "@table-library/react-table-library/theme";
import axios from "axios";

const LaborCostTable = () => {
  const {
    totalsWithAccumulated,
    selectedRol,
    formatCurrency,
    setTotalsWithAccumulated,
    dataNode,
    setDataNode,
  } = useContext(ViewerContext);
  const [editables, setEditables] = useState({});

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
    updateMyData,
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
  const handleSave = async () => {
    try {
      const formattedData = Object.entries(editables).map(([key, value]) => {
        const [index, property] = key.split("-");
        return { index, property, value };
      });

      if (formattedData.length === 0) return;

      const requestData = formattedData.map((dtm) => {
        let total = totalsWithAccumulated[dtm.index];
        const [month, year] = total.period.split("-");
        return {
          projectId: total.projectId,
          rol: total.rol,
          deadline: new Date(year, month - 1, 1),
          period: total.period,
          [dtm.property]: dtm.value,
        };
      });

      const response = await axios.post(
        "http://localhost:8000/labor/",
        requestData
      );

      let newNodes = [...dataNode.nodes];

      response.data.data.forEach((node) => {
        let index = newNodes.findIndex((n) => n._id === node._id);
        if (index > -1) {
          newNodes[index] = { ...newNodes[index], ...node };
        } else {
          newNodes.push(node);
        }
      });

      setDataNode({ ...dataNode, nodes: newNodes });
      setEditables({});
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleInputChange = (event, index, columnId) => {
    const { value } = event.target;

    setTotalsWithAccumulated((prevTotals) =>
      prevTotals.map((item, idx) => {
        if (idx === index) {
          return { ...item, [columnId]: value };
        }
        return item;
      })
    );

    setEditables((prev) => ({
      ...prev,
      [`${index}-${columnId}`]: value,
    }));
  };

  return (
    <div>
      <div className="mt-4 "></div>
      <Table data={{ nodes: totalsWithAccumulated }} theme={theme} className="">
        {() => (
          <>
            <Header>
              <HeaderRow className="text-xxs">
                {/* <HeaderCell>Project ID</HeaderCell> */}
                <HeaderCell>Rol</HeaderCell>
                <HeaderCell>Periodo</HeaderCell>
                <HeaderCell>Mensual Planificado</HeaderCell>
                <HeaderCell>Acumulado Planificado</HeaderCell>
                <HeaderCell>Mensual Real</HeaderCell>
                <HeaderCell>Acumulado Real</HeaderCell>
                <HeaderCell>Resultado</HeaderCell>
                {/* <HeaderCell>Acumulado Resultado</HeaderCell> */}
                <HeaderCell>Grabar</HeaderCell>
              </HeaderRow>
            </Header>
            <Body>
              {totalsWithAccumulated
                .filter((item) =>
                  selectedRol.length
                    ? selectedRol.some((rol) => rol.value === item.rol)
                    : true
                )
                .map((item, index) => (
                  <Row className="text-xxs" key={index}>
                    {/* <Cell>{item.projectId}</Cell> */}
                    <Cell>{item.rol}</Cell>
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
                      {formatCurrency(item.totalLabor - item.realmonthcost)}
                    </Cell>
                    {/* <Cell>{formatCurrency(item.realAccumulated)}</Cell> */}
                    <Cell>
                      <button onClick={() => handleSave(index)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          class="size-5"
                          className="h-3 w-3 ml-2"
                        >
                          <path d="M10 2a.75.75 0 0 1 .75.75v5.59l1.95-2.1a.75.75 0 1 1 1.1 1.02l-3.25 3.5a.75.75 0 0 1-1.1 0L6.2 7.26a.75.75 0 1 1 1.1-1.02l1.95 2.1V2.75A.75.75 0 0 1 10 2Z" />
                          <path d="M5.273 4.5a1.25 1.25 0 0 0-1.205.918l-1.523 5.52c-.006.02-.01.041-.015.062H6a1 1 0 0 1 .894.553l.448.894a1 1 0 0 0 .894.553h3.438a1 1 0 0 0 .86-.49l.606-1.02A1 1 0 0 1 14 11h3.47a1.318 1.318 0 0 0-.015-.062l-1.523-5.52a1.25 1.25 0 0 0-1.205-.918h-.977a.75.75 0 0 1 0-1.5h.977a2.75 2.75 0 0 1 2.651 2.019l1.523 5.52c.066.239.099.485.099.732V15a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3.73c0-.246.033-.492.099-.73l1.523-5.521A2.75 2.75 0 0 1 5.273 3h.977a.75.75 0 0 1 0 1.5h-.977Z" />
                        </svg>
                        
                      </button>
                    </Cell>
                  </Row>
                ))}
            </Body>
          </>
        )}
      </Table>
    </div>
  );
};

export default LaborCostTable;