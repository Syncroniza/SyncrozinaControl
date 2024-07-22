import { useContext, useState, useEffect } from "react";
import { ViewerContext } from "../Context";
import Select from "react-select";
import Sidebardb from "../dashboard/Sidebardb";
import CarInformationSheetControlReport from "../tables/CarInformationSheetControlReport";

function ReportControlSheet() {
  const {
    formatCurrency,
    getDataBudget,
    selectedProjectId,
    dataincreaseDisccountwthitoutfilter,
    contracObservationWhitOutFilter,
    projects,
    setSelectedProjectId,
    summaryData,
    setSummaryData,
    totalUnpaidInvoices,
    invoicesdata,
  } = useContext(ViewerContext);

  const [selectedFamilies, setSelectedFamilies] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const familyOptions = getDataBudget
    .map((item) => ({ value: item.family, label: item.family }))
    .filter(
      (option, index, self) =>
        index ===
        self.findIndex(
          (t) => t.place === option.place && t.label === option.label
        )
    );

  const customStyles = {
    control: (base, state) => ({
      ...base,
      boxShadow: state.isFocused ? "0 0 0 2px rgba(56, 189, 248, 0.5)" : 0,
      borderColor: state.isFocused ? "#38bdf8" : "#d1d5db",
      "&:hover": {
        borderColor: state.isFocused ? "#38bdf8" : "#d1d5db",
      },
      className: "rounded-md",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 0,
      hyphens: "auto",
      marginTop: 0,
      textAlign: "left",
      wordWrap: "break-word",
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#bfdbfe" : "#ffffff",
      color: "#1f2937",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#38bdf8",
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#e0f2fe",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#0369a1",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#0369a1",
      ":hover": {
        backgroundColor: "#0369a1",
        color: "#ffffff",
      },
    }),
  };

  const getMontoContrato = (subfamily) => {
    return contracObservationWhitOutFilter.data?.data?.reduce((total, item) => {
      const matchesProject =
        !selectedProjectId || item.projectId === selectedProjectId;
      const matchesSubfamily = item.subfamily === subfamily;
      if (matchesProject && matchesSubfamily) {
        return total + (Number(item.Proyectado) || 0);
      }
      return total;
    }, 0);
  };

  const getRecuperable = (subfamily) => {
    return dataincreaseDisccountwthitoutfilter?.data?.data?.reduce(
      (total, item) => {
        const matchesProject =
          !selectedProjectId || item.projectId === selectedProjectId;
        const matchesSubfamily = item.subfamily === subfamily;
        if (matchesProject && matchesSubfamily) {
          return total + (Number(item.Recuperable) || 0);
        }
        return total;
      },
      0
    );
  };

  useEffect(() => {
    const filteredData = getDataBudget.filter(
      (item) =>
        selectedFamilies.length === 0 ||
        selectedFamilies.some((family) => family.value === item.family)
    );

    const subfamilies = [
      ...new Set(filteredData.map((item) => item.subfamily)),
    ];

    const newSummaryData = subfamilies.map((subfamily) => {
      const subfamilyData = filteredData.filter(
        (item) => item.subfamily === subfamily
      );

      const montoPropuesta = subfamilyData.reduce(
        (total, current) => total + current.totalPrice,
        0
      );
      const montoContrato = getMontoContrato(subfamily);
      const getrecuperable = getRecuperable(subfamily);
      const totalconextras = montoPropuesta + getrecuperable;
      const ahorro = montoContrato === 0 ? 0 : totalconextras - montoContrato;

      // Filtrar facturas pagadas y pertenecientes a la subfamilia
      const paidInvoices = invoicesdata.filter(
        (invoice) =>
          invoice.invoiceStatus === "Pagada" && invoice.subfamily === subfamily
      );

      const totalPaidInvoices = paidInvoices.reduce(
        (total, invoice) => total + (Number(invoice.totalInvoices) || 0),
        0
      );
      // Filtrar facturas emitidas y pertenecientes a la subfamilia
      const issuedInvoices = invoicesdata.filter(
        (invoice) => invoice.rawData && invoice.subfamily === subfamily
      );

      const totalIssuedInvoices = issuedInvoices.reduce(
        (total, invoice) =>
          total + (Number(invoice.rawData.montoTotal) / 1.19 || 0),
        0
      );

      const totalDifferenceInvoices = totalIssuedInvoices - totalPaidInvoices;

      return {
        family: subfamilyData[0]?.family || "No Especificada",
        subfamily,
        projectId: selectedProjectId,
        montoPropuesta,
        montoContrato,
        recuperable: getrecuperable,
        totalconextras,
        ahorro,
        contrato: montoPropuesta,
        totalUnpaidInvoices: totalUnpaidInvoices,
        totalPaidInvoices,
        totalIssuedInvoices,
        totalDifferenceInvoices,
      };
    });
    // Ordenar newSummaryData alfabéticamente por subfamily
    newSummaryData.sort((a, b) => a.subfamily.localeCompare(b.subfamily));

    setSummaryData(newSummaryData);
  }, [
    getDataBudget,
    selectedFamilies,
    selectedProjectId,
    invoicesdata,
    totalUnpaidInvoices,
  ]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...summaryData].sort((a, b) => {
    if (sortConfig.key) {
      const order = sortConfig.direction === "asc" ? 1 : -1;
      if (a[sortConfig.key] < b[sortConfig.key]) return -order;
      if (a[sortConfig.key] > b[sortConfig.key]) return order;
      return 0;
    }
    return 0;
  });

  return (
    <div className="flex bg-gradient-to-r from-blue-500 ">
      <Sidebardb />
      <div className="ml-3 mt-6">
        <div className="grid grid-rows-2 justify-center align-middle bg-white shadow-xl rounded-xl mr-3">
          <h1 className="text-lg font-semibold">INFORME HOJAS DE CONTROL</h1>
          <div className="flex justify-between mb-1">
            <h1 className="">Elegir Proyecto</h1>
            <select
              className=" bg-blue-500  p-2 text-xs rounded-lg text-white  shadow-lg"
              name="newProjectId"
              value={selectedProjectId}
              onChange={(e) => {
                const newProjectId = e.target.value;
                setSelectedProjectId(newProjectId);
              }}
            >
              <option value="">Todos los Proyectos</option>
              {projects.map((project) => (
                <option key={project._id} value={project.id}>
                  {project.projectId}
                </option>
              ))}
            </select>
          </div>
          <div className="p-5">
            <Select
              isMulti
              options={familyOptions}
              value={selectedFamilies}
              onChange={(selectedOptions) =>
                setSelectedFamilies(selectedOptions)
              }
              styles={customStyles}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Seleccione Familias..."
              noOptionsMessage={() => "No hay opciones disponibles"}
            />
          </div>
        </div>
        <CarInformationSheetControlReport selectedFamilies={selectedFamilies.map(family => family.value)} />
        <div
          className="bg-white mt-4 mb-4 shadow-lg rounded-lg  mr-3 overflow-y-auto "
          style={{ height: "650px" }}
        >
          <table className="w-full">
            <thead className="bg-blue-500 sticky top-0 ">
              <tr className=" text-sm text-white ">
                <th
                  className="border-slate-500 cursor-pointer"
                  onClick={() => handleSort("subfamily")}
                >
                  Hoja de Control
                </th>
                <th className=" border-slate-500    "
                onClick={() => handleSort("montoPropuesta")}
                >Monto Propuesta</th>
                <th className=" border-slate-500  "
                 onClick={() => handleSort("montoContrato")}
                >Monto Contrato</th>
                <th className=" border-slate-500  "
                 onClick={() => handleSort("recuperable")}
                >Recuperable</th>
                <th className=" border-slate-500  ">Total con Extras</th>
                <th
                  className=" border-slate-500 cursor-pointer"
                  onClick={() => handleSort("ahorro")}
                >
                  Ahorro/Perdida
                </th>
                <th className=" border-slate-500 "
                onClick={() => handleSort("totalconextras")}
                >Facturado</th>
                <th className=" border-slate-500 ">Pagado</th>
                <th
                  className=" border-slate-500 cursor-pointer"
                  onClick={() => handleSort("totalDifferenceInvoices")}
                >
                  Por pagar
                </th>
              </tr>
            </thead>
            <tbody className="">
              {sortedData.map((item, i) => (
                <tr key={i} className="text-center text-xs">
                  <td className="border border-slate-500   ">
                    {item.subfamily}
                  </td>
                  <td className="border border-slate-500 ">
                    {formatCurrency(item.montoPropuesta)}
                  </td>
                  <td className="border border-slate-500  ">
                    {formatCurrency(item.montoContrato)}
                  </td>
                  <td className="border border-slate-500  ">
                    {formatCurrency(item.recuperable)}
                  </td>
                  <td className="border border-slate-500  ">
                    {formatCurrency(item.totalconextras)}
                  </td>
                  <td
                    className={`border border-slate-500 text-center text-xs ${
                      item.montoContrato === 0
                        ? "text-black"
                        : item.ahorro > 0
                        ? "text-green-500"
                        : item.ahorro < 0
                        ? "text-red-500"
                        : "text-black"
                    }`}
                  >
                    {item.montoContrato === 0
                      ? "S/C"
                      : formatCurrency(item.ahorro)}
                  </td>
                  <td className="border border-slate-500  ">
                    {formatCurrency(item.totalIssuedInvoices)}
                  </td>
                  <td className="border border-slate-500  ">
                    {formatCurrency(item.totalPaidInvoices)}
                  </td>
                  <td className="border border-slate-500  ">
                    {formatCurrency(item.totalDifferenceInvoices)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReportControlSheet;
