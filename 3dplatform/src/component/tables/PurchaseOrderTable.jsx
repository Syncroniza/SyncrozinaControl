import { ViewerContext } from "../Context";
import { useContext, useEffect, useState } from "react";

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
  const [newfilteredMaterialSheets, setNewFilteredMaterialSheets] = useState(
    []
  );
  const [newAccumulatedPurchaseOrders, setNewAccumulatedPurchaseOrders] =
    useState([]);

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
    newfilteredMaterialSheets.sort((a, b) => new Date(a.date) - new Date(b.date));


    setTotalPurchaseOrders(total);
  }, [newfilteredMaterialSheets]);


// -------------- Formato de Fechas ---------------//
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

  // ----------------------------  JSX -----------------------------------------//
  return (
    <div className="bg-white p-3 flex flex-col rounded-xl my-2 ml-2 mr-2"style={{ width: "1350px" }}>
      <h1 className="text-sm font-semibold ml-6 ">ORDENES DE COMPRA</h1>
      <div className=" justify-end p-4 ">
        <h1 className="bg-blue-500 text-xl text-white p-6 rounded-xl ">
          {formatCurrency(newAccumulatedPurchaseOrders)}
        </h1>
      </div>
      <div
        className=" ml-4 overflow-auto " style={{ height: "200px"}}
      >
        <table className="mt-4 ml-2 mb-2 w-full">
          <thead className="sticky top-0 bg-blue-500 text-white ">
            <tr className="text-xxs">
              <th className="border border-slate-300 p-1">ProjectId</th>
              <th className="border border-slate-300">OC</th>
              <th className="border border-slate-300">Fecha</th>
              {/* <th className="border border-slate-300">Glosa</th> */}
              <th className="border border-slate-300">Descripcion</th>
              <th className="border border-slate-300">Valor ($)</th>
              <th className="border border-slate-300 px-1">Acumulado ($)</th>
              {/* <th className="border border-slate-300 px-1">Hoja Control</th> */}
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
                    {formatedDate(sheet.date)}
                  </td>
                  {/* <td className="border border-slate-300 px-2">
                    {sheet.description}
                  </td> */}
                  <td className="border border-slate-300 px-2">
                    {sheet.subcontractorOffers}
                  </td>
                  <td className="border border-slate-300 px-2">
                    {formatCurrency(sheet.total)}
                  </td>
                  <td className="border border-slate-300 px-2">
                    {formatCurrency(sheet.acumulado)}
                  </td>
                  {/* <td className="border border-slate-300 px-2">
                    {sheet.subfamily}
                  </td> */}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrderTable;
