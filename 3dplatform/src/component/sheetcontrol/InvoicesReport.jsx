import { useContext, useEffect, useState } from "react";
import { ViewerContext } from "../Context";
import Sidebardb from "../dashboard/Sidebardb";

const InvoicesReport = () => {
  const { invoicesdata, formatCurrency } =
    useContext(ViewerContext);
  console.log("🚀 ~ InvoicesReport ~ invoicesdata:", invoicesdata);
  const [reportData, setReportData] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    if (invoicesdata) {
      // Agrupar datos por proveedor
      const groupedData = invoicesdata.reduce((acc, invoice) => {
        const { rawData } = invoice;
        const { nomProveedor, montoTotal, estadoPago, rutProveedor } = rawData;

        if (!acc[nomProveedor]) {
          acc[nomProveedor] = {
            nomProveedor,
            rutProveedor,
            totalComprado: 0,
            totalPagado: 0,
            totalSinPagar: 0,
          };
        }
        acc[nomProveedor].totalComprado += montoTotal;
        if (estadoPago === "Pagada") {
          acc[nomProveedor].totalPagado += montoTotal;
        } else if (estadoPago === "Sin Pagos") {
          acc[nomProveedor].totalSinPagar += montoTotal;
        }
        return acc;
      }, {});

      // Convertir el objeto agrupado en un array
      const reportArray = Object.values(groupedData);
      setReportData(reportArray);
    }
  }, [invoicesdata]);

  const handleProviderChange = (e) => {
    setSelectedProvider(e.target.value);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...reportData].sort((a, b) => {
    if (sortConfig.key) {
      const order = sortConfig.direction === "asc" ? 1 : -1;
      if (a[sortConfig.key] < b[sortConfig.key]) return -order;
      if (a[sortConfig.key] > b[sortConfig.key]) return order;
      return 0;
    }
    return 0;
  });

  const filteredData = selectedProvider
    ? sortedData.filter((item) => item.nomProveedor === selectedProvider)
    : sortedData;

  const sortedProviders = [...reportData].sort((a, b) =>
    a.nomProveedor.localeCompare(b.nomProveedor)
  );

  return (
    <div className="flex bg-gradient-to-r from-blue-500 min-h-screen">
      <Sidebardb />
      <div className="b-4 bg-white mt-4 ml-3 mb-6 p-4 rounded-lg">
        <h1 className="text-lg text-center font-semibold">
          INFORME FACTURAS POR PROVEEDOR
        </h1>
        <div className="mb-4">
          <label htmlFor="providerFilter" className="mr-2">
            Filtrar por Proveedor:
          </label>
          <select
            id="providerFilter"
            value={selectedProvider}
            onChange={handleProviderChange}
            className="border border-gray-300 rounded p-1"
          >
            <option value="">Todos</option>
            {sortedProviders.map((item, index) => (
              <option key={index} value={item.nomProveedor}>
                {item.nomProveedor}
              </option>
            ))}
          </select>
        </div>
        <div
          className="overflow-auto text-center"
          style={{ width: "1300px", height: "1400px" }}
        >
          <table className="w-full">
            <thead className="sticky top-0 bg-blue-500 text-white">
              <tr>
                <th
                  className="border border-slate-300 px-2"
                  onClick={() => handleSort("nomProveedor")}
                >
                  Proveedor
                </th>
                <th
                  className="border border-slate-300 px-2"
                  onClick={() => handleSort("rutProveedor")}
                >
                  RUT Proveedor
                </th>
                <th
                  className="border border-slate-300 px-2 cursor-pointer"
                  onClick={() => handleSort("totalComprado")}
                >
                  Total Facturado
                </th>
                <th
                  className="border border-slate-300 px-2 cursor-pointer"
                  onClick={() => handleSort("totalPagado")}
                >
                  Total Pagado
                </th>
                <th
                  className="border border-slate-300 px-2 cursor-pointer"
                  onClick={() => handleSort("totalSinPagar")}
                >
                  Total Por Pagar
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="text-xxs">
                  <td className="border border-slate-300 px-2">
                    {item.nomProveedor}
                  </td>
                  <td className="border border-slate-300 px-2">
                    {item.rutProveedor}
                  </td>
                  <td className="border border-slate-300 px-2">
                    {formatCurrency(item.totalComprado)}
                  </td>
                  <td className="border border-slate-300 px-2">
                    {formatCurrency(item.totalPagado)}
                  </td>
                  <td className="border border-slate-300 px-2">
                    {formatCurrency(item.totalSinPagar)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoicesReport;
