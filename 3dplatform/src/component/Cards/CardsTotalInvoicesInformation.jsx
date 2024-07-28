import { useEffect, useState, useContext } from "react";
import { ViewerContext } from "../Context";
import Select from "react-select";

function CardsTotalInvoicesInformation() {
  const { invoicesdata, setFilteredInvoices } = useContext(ViewerContext);
  console.log("🚀 ~ CardsTotalInvoicesInformation ~ invoicesdata:", invoicesdata)
  const [selectedDocStates, setSelectedDocStates] = useState([]);
  const [selectedPagoStates, setSelectedPagoStates] = useState([]);
  const [selectedFamilies, setSelectedFamilies] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda de número de factura
  const [searchProvider, setSearchProvider] = useState(""); // Estado para el término de búsqueda de proveedor
  const [totalsByState, setTotalsByState] = useState({});

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
      const selectedFamilyValues = selectedFamilies.map(
        (option) => option.value
      );
      filtered = filtered.filter(
        (invoice) =>
          selectedFamilyValues.includes(invoice.family) ||
          (selectedFamilyValues.includes("empty") &&
            (!invoice.family || invoice.family.trim() === ""))
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
    <div>
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
    </div>
  );
}

export default CardsTotalInvoicesInformation;
