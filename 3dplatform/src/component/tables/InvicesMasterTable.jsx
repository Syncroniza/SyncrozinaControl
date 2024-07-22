import { useContext, useEffect, useState } from "react";
import { ViewerContext } from "../Context";
import Sidebardb from "../dashboard/Sidebardb";
import FormInvoices from "../sheetcontrol/FormInvoices";
import axios from "axios";
import { BASE_URL } from "../../constants.js";
import Select from "react-select";

const InvicesMasterTable = () => {
  const {
    setIsModalOpenBudget,
    invoicesdata,
    setInvoicesData,
    selectedSubfamily,
    openFormAndCurrentInvloiceId,
    formatCurrency,
    isModalOpenBudget,
  } = useContext(ViewerContext);

  const [paidInvoices, setPaidInvoices] = useState([]);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [totalInvoicedAmount, setTotalInvoicedAmount] = useState(0);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedDocStates, setSelectedDocStates] = useState([]);
  const [selectedPagoStates, setSelectedPagoStates] = useState([]);
  const [totalsByState, setTotalsByState] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda de número de factura
  const [searchProvider, setSearchProvider] = useState(""); // Estado para el término de búsqueda de proveedor
  const [selectedFamilies, setSelectedFamilies] = useState([]); // Estado para la familia seleccionada

  const openModal = () => setIsModalOpenBudget(true);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/invoices/`);
      const sortedInvoices = response.data.data.sort(
        (a, b) => new Date(a.dateInvoices) - new Date(b.dateInvoices)
      );

      if (Array.isArray(response.data.data) && response.data.data.length > 0) {
        setInvoicesData(response.data.data);
        filterPaidInvoices(response.data.data);
        calculateTotalInvoicedAmount(response.data.data);
        setFilteredInvoices(response.data.data); // Inicialmente mostrar todas las facturas
      } else {
        console.error("Empty array of projects", response);
      }
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  const filterPaidInvoices = (data) => {
    const paid = data.filter((invoice) => {
      return invoice.invoiceStatus === "Pagada";
    });
    setPaidInvoices(paid);
    const total = paid.reduce((sum, invoice) => sum + invoice.totalInvoices, 0);
    setTotalPaidAmount(total);
  };

  const calculateTotalInvoicedAmount = (data) => {
    const total = data.reduce(
      (sum, invoice) => sum + (invoice.totalInvoices || 0),
      0
    );
    setTotalInvoicedAmount(total);
  };

  useEffect(() => {
    fetchInvoices();
  }, [selectedSubfamily, isModalOpenBudget, setInvoicesData]);

  const handleDeleteInvoice = async (invoicesid) => {
    const isConfirmed = window.confirm(
      "¿Está seguro que quiere borrar la factura?"
    );
    if (!isConfirmed) {
      return;
    }
    try {
      const response = await axios.delete(`${BASE_URL}/invoices/${invoicesid}`);

      if (response.status === 200) {
        setInvoicesData((prevInvoiceData) => {
          const updatedData = prevInvoiceData.filter(
            (invoices) => invoices._id !== invoicesid
          );
          filterPaidInvoices(updatedData);
          return updatedData;
        });
      }
    } catch (err) {
      console.error("Error deleting invoice:", err);
    }
  };

  const formatedDate = (isoDate) => {
    if (!isoDate) return "";

    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return ""; // Validar si la fecha es válida

    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();

    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(month).padStart(2, "0");

    return `${formattedDay}/${formattedMonth}/${year}`;
  };

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

  const handleDocStateChange = (selectedOptions) => {
    setSelectedDocStates(selectedOptions);
  };

  const handlePagoStateChange = (selectedOptions) => {
    setSelectedPagoStates(selectedOptions);
  };

  const handleFamilyChange = (selectedOptions) => {
    setSelectedFamilies(selectedOptions);
  };

  useEffect(() => {
    const selectedDocStatesValues = selectedDocStates.map(
      (option) => option.value
    );
    const selectedPagoStatesValues = selectedPagoStates.map(
      (option) => option.value
    );

    let filtered = invoicesdata;

    if (
      selectedDocStatesValues.length > 0 ||
      selectedPagoStatesValues.length > 0
    ) {
      filtered = filtered.filter(
        (invoice) =>
          (selectedDocStatesValues.length === 0 ||
            selectedDocStatesValues.includes(invoice.rawData?.estadoDoc)) &&
          (selectedPagoStatesValues.length === 0 ||
            selectedPagoStatesValues.includes(invoice.rawData?.estadoPago))
      );
    }

    if (selectedFamilies && selectedFamilies.length > 0) {
      const selectedFamilyValues = selectedFamilies.map((option) => option.value);
      filtered = filtered.filter((invoice) => 
        (selectedFamilyValues.includes(invoice.family)) || 
        (selectedFamilyValues.includes("empty") && (!invoice.family || invoice.family.trim() === ""))
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((invoice) => invoice.invoices === searchTerm);
    }

    if (searchProvider) {
      filtered = filtered.filter((invoice) =>
        invoice.description.toLowerCase().includes(searchProvider.toLowerCase())
      );
    }

    setFilteredInvoices(filtered);

    // Calcular los totales por combinación de estados
    const combinations = [];
    if (selectedDocStatesValues.length === 0) {
      combinations.push(
        ...selectedPagoStatesValues.map((state) => ["", state])
      );
    } else if (selectedPagoStatesValues.length === 0) {
      combinations.push(...selectedDocStatesValues.map((state) => [state, ""]));
    } else {
      selectedDocStatesValues.forEach((docState) => {
        selectedPagoStatesValues.forEach((pagoState) => {
          combinations.push([docState, pagoState]);
        });
      });
    }

    const totals = combinations.reduce((acc, [docState, pagoState]) => {
      const total = filtered
        .filter(
          (invoice) =>
            (docState === "" || invoice.rawData?.estadoDoc === docState) &&
            (pagoState === "" || invoice.rawData?.estadoPago === pagoState)
        )
        .reduce((sum, invoice) => sum + (invoice.totalInvoices || 0), 0);
      const key = `${docState}${
        docState && pagoState ? " y " : ""
      }${pagoState}`;
      acc[key] = total;
      return acc;
    }, {});
    setTotalsByState(totals);
  }, [
    selectedDocStates,
    selectedPagoStates,
    selectedFamilies,
    searchTerm,
    searchProvider,
    invoicesdata,
  ]);

  const getEstadoDocOptions = () => {
    const estados = invoicesdata.map((invoice) => invoice.rawData?.estadoDoc);
    const uniqueEstados = [...new Set(estados)];
    return uniqueEstados.map((estado) => ({ value: estado, label: estado }));
  };

  const getEstadoPagoOptions = () => {
    const estados = invoicesdata.map((invoice) => invoice.rawData?.estadoPago);
    const uniqueEstados = [...new Set(estados)];
    return uniqueEstados.map((estado) => ({ value: estado, label: estado }));
  };

  const getFamilyOptions = () => {
    const families = invoicesdata.map((invoice) => invoice.family);
    const uniqueFamilies = [...new Set(families)];
    const options = uniqueFamilies.map((family) => ({
      value: family,
      label: family,
    }));
    options.push({ value: "empty", label: "Sin Familia" });
    return options;
  };

  return (
    <div className="flex bg-gradient-to-r from-blue-500 ">
      <Sidebardb />
      <FormInvoices />
      <div className="b-4 bg-white mt-4 ml-3 mb-6 p-4 rounded-lg">
        <h1 className="text-lg text-center font-semibold">
          MAESTRO DE FACTURAS
        </h1>
        <div className="grid grid-cols-3">
          <div className="text-center p-2 bg-gradient-to-r from-indigo-500 to-blue-500 grid grid-rows-2 rounded-xl shadow-xl mt-4 mb-4 mr-3">
            <h2 className="text-white">Total Facturado:</h2>
            <h1 className="text-white">
              {formatCurrency(totalInvoicedAmount)}
            </h1>
          </div>
          <div className="text-center bg-gradient-to-r from-indigo-500 to-blue-500 grid grid-rows-2 rounded-xl shadow-xl mt-4 mb-4 mr-3">
            <h2 className="text-white">Total Pagado:</h2>
            <h1 className="text-white">{formatCurrency(totalPaidAmount)}</h1>
          </div>
          <div className="text-center bg-gradient-to-r from-indigo-500 to-blue-500 grid grid-rows-2 rounded-xl shadow-xl mt-4 mb-4 mr-3">
            <h2 className="text-white">Total Por Pagar:</h2>
            <h1 className="text-white">
              {formatCurrency(totalInvoicedAmount - totalPaidAmount)}
            </h1>
          </div>
        </div>
        <div className=" p-5 grid grid-cols-5 gap-4">
          <Select
            isMulti
            options={getEstadoPagoOptions()}
            value={selectedPagoStates}
            onChange={handlePagoStateChange}
            styles={customStyles}
            className="basic-multi-select text-xs "
            classNamePrefix="select"
            placeholder="Pagado / Sin Pagar"
            noOptionsMessage={() => "No hay opciones disponibles"}
          />
          <Select
            isMulti
            options={getEstadoDocOptions()}
            value={selectedDocStates}
            onChange={handleDocStateChange}
            styles={customStyles}
            className="basic-multi-select text-xs "
            classNamePrefix="select"
            placeholder="Seleccione Estado de Factura"
            noOptionsMessage={() => "No hay opciones disponibles"}
          />
          <Select
            isMulti
            options={getFamilyOptions()}
            value={selectedFamilies}
            onChange={handleFamilyChange}
            styles={customStyles}
            className="basic-multi-select text-xs "
            classNamePrefix="select"
            placeholder="Seleccione Familia"
            noOptionsMessage={() => "No hay opciones disponibles"}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por N° de Factura"
            className="border p-2 rounded-md text-xs "
          />
          <input
            type="text"
            value={searchProvider}
            onChange={(e) => setSearchProvider(e.target.value)}
            placeholder="Buscar por Proveedor"
            className="border p-2 rounded-md text-xs "
          />
        </div>
        <div className="grid grid-cols-3">
          {Object.entries(totalsByState).map(([state, total]) => (
            <div
              key={state}
              className="text-center bg-gradient-to-r from-indigo-500 to-blue-500 grid grid-rows-2 rounded-xl shadow-xl mt-4 mb-4 mr-3"
            >
              <h2 className="text-white">Total {state}:</h2>
              <h1 className="text-white">{formatCurrency(total)}</h1>
            </div>
          ))}
        </div>
        <div
          className="overflow-auto text-center"
          style={{ width: "1300px", height: "1000px" }}
        >
          <table className="w-full">
            <thead className="sticky top-0 bg-blue-500 text-white">
              <tr className="border border-slate-300 text-xxs">
                <th className="border border-slate-300 px-2">Familia</th>
                <th className="border border-slate-300 px-2">N° Factura</th>
                <th className="border border-slate-300 px-2">SubFamila</th>
                <th className="border border-slate-300 px-2">
                  Fecha de emision
                </th>
                <th className="border border-slate-300 px-2">RUT Proveedor</th>
                 <th className="border border-slate-300 px-4">Proveedor</th>
                <th className="border border-slate-300 px-2">$ Factura</th>
                <th className="border border-slate-300 px-2">Estado</th>
                <th className="border border-slate-300 px-2">Estado Factura</th>
                <th className="border border-slate-300 px-2">
                  Fecha Vencimiento
                </th>
                <th className="border border-slate-300 px-2">Editar</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice, y) => (
                <tr key={y} className="text-xxs">
                  <td className="border border-slate-300 px-2">
                    {invoice.family || "Sin Familia"}
                  </td>
                  <td className="border border-slate-300 px-2">
                    {invoice.subfamily}
                  </td>
                  <td className="border border-slate-300 px-2">
                    {invoice.invoices}
                  </td>
                  <td className="border border-slate-300 px-2">
                    {formatedDate(invoice.dateInvoices)}
                  </td>
                  <td className="border border-slate-300 px-2">
                    {invoice.rawData?.rutProveedor}
                  </td>
                  <td className="border border-slate-300 px-2">
                    {invoice.description}
                  </td>
                  <td className="border border-slate-300 px-2">
                    {formatCurrency(invoice.totalInvoices)}
                  </td>
                  <td className="border border-slate-300 px-2">
                    {invoice.rawData?.estadoDoc}
                  </td>
                  <td className="border border-slate-300 px-2">
                    {invoice.rawData?.estadoPago}
                  </td>
                  <td className="border border-slate-300 px-2">
                    {formatedDate(invoice.dueDate)}
                  </td>
                  <td className="border border-slate-300">
                    <button
                      className="bg-green-500 p-1 text-white rounded-lg text-xs"
                      onClick={() =>
                        openFormAndCurrentInvloiceId(
                          invoice._id || invoice.id
                        )
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                        />
                      </svg>
                    </button>
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

export default InvicesMasterTable;
