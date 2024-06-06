import { ViewerContext } from "../Context";
import { useContext, useEffect, useState } from "react";
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

const PurchaseOrderTable = () => {
  const {
    dataNode,
    materialSheets,
    selectedSubfamily,
    selectedProjectId,
    selectedFamily,
    formatCurrency,
    setTotalPurchaseOrders,
  } = useContext(ViewerContext);
  console.log("🚀 ~ PurchaseOrderTable ~ materialSheets:", materialSheets);
  const [newfilteredMaterialSheets, setNewFilteredMaterialSheets] = useState(
    []
  );
  const [newAccumulatedPurchaseOrders, setNewAccumulatedPurchaseOrders] =
    useState([]);

  console.log(
    "🚀 ~ PurchaseOrderTable ~ newfilteredMaterialSheets:",
    newfilteredMaterialSheets
  );
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

  // Filtrar materialSheets según el proyecto, familia y subfamilia seleccionados
  useEffect(() => {
    const filteredMaterialSheet = materialSheets.filter((sheet) => {
      const projectMatch =
        !selectedProjectId || sheet.projectId === selectedProjectId;
      const familyMatch = !selectedFamily || sheet.family === selectedFamily;
      const subfamilyMatch =
        !selectedSubfamily || sheet.subfamily === selectedSubfamily;
      return projectMatch && familyMatch && subfamilyMatch;
    });
    let acumulado = 0;
    const MaterialSheetAccumulated = filteredMaterialSheet.map((sheet) => {
      acumulado += parseFloat(sheet.total) || 0;
      return { ...sheet, acumulado };
    });

    setNewFilteredMaterialSheets(MaterialSheetAccumulated);
    setNewAccumulatedPurchaseOrders(acumulado);
  }, [materialSheets, selectedProjectId, selectedFamily, selectedSubfamily]);

  useEffect(() => {
    let total = 0;

    newfilteredMaterialSheets.forEach((sheet) => {
      total += parseFloat(sheet.total) || 0;
    });

    setTotalPurchaseOrders(total);
  }, [newfilteredMaterialSheets]);


  // ----------------------------  JSX -----------------------------------------//
  return (
    <div className="bg-white p-3 flex flex-col rounded-xl my-2 ml-3 mr-2">
      <h1 className="text-sm font-semibold ">ORDENES DE COMPRA</h1>
      <div className=" justify-end p-4 ">
        <h1 className="bg-blue-500 text-sm text-white p-6 rounded-xl ">
          {formatCurrency(newAccumulatedPurchaseOrders)}
        </h1>
      </div>
     
     
      {/* -------------------------- Table ------------------------------------ */}
      <div
        className=" ml-4 overflow-auto"
        style={{ height: "250px", width:"1450px"}}
      >
        <table className="mt-4 ml-2 mb-2 w-full">
          <thead className="sticky top-0 bg-blue-500 text-white ">
            <tr className="text-xxs">
              <th className="border border-slate-300 p-1">ProjectId</th>
              <th className="border border-slate-300">OC</th>
              <th className="border border-slate-300">SubFamilia</th>
              <th className="border border-slate-300">Glosa</th>
              <th className="border border-slate-300">Descripcion</th>
              <th className="border border-slate-300">Proyectado</th>
              <th className="border border-slate-300 px-1">Borrar</th>
              <th className="border border-slate-300 px-1">Editar</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(newfilteredMaterialSheets) &&
              newfilteredMaterialSheets.map((sheet) => (
                <tr
                  key={sheet._id}
                  className="border border-slate-300 text-xxs text-center"
                >
                  <td className="border border-slate-300">{sheet.projectId}</td>
                  <td className="border border-slate-300 px-2">{sheet.cod}</td>
                  <td className="border border-slate-300 px-2">
                    {new Date(sheet.date).toLocaleDateString()}
                  </td>
                  <td className="border border-slate-300 px-2">
                    {sheet.description}
                  </td>
                  <td className="border border-slate-300 px-2">
                    {sheet.subcontractorOffers}
                  </td>
                  <td className="border border-slate-300 px-2">
                    {formatCurrency(sheet.total)}
                  </td>
                  <td className="border border-slate-300 px-2">
                    {formatCurrency(sheet.acumulado)}
                  </td>
                  <td className="border border-slate-300 px-2">
                    {sheet.subfamily}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrderTable;
