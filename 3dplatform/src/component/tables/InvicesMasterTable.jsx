import { useContext, useEffect, useState } from "react";
import { ViewerContext } from "../Context";
import Sidebardb from "../dashboard/Sidebardb";
import FormInvoices from "../sheetcontrol/FormInvoices";
import axios from "axios";
import { BASE_URL } from "../../constants.js";
import InvoicesStatusChart from "./InvoicesStatusTable.jsx";
import InvoicePieCharts from "../charts/InvoicePieCharts.jsx";
import { Link } from "react-router-dom";

const InvicesMasterTable = () => {
  const {
    setIsModalOpenBudget,
    invoicesdata,
    setInvoicesData,
    selectedSubfamily,
    formatCurrency,
    isModalOpenBudget,
    setFilteredInvoices,
  } = useContext(ViewerContext);

  const [paidInvoices, setPaidInvoices] = useState([]);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [totalInvoicedAmount, setTotalInvoicedAmount] = useState(0);
  const [selectedDocStates, setSelectedDocStates] = useState([]);
  const [selectedPagoStates, setSelectedPagoStates] = useState([]);
  const [totalsByState, setTotalsByState] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchProvider, setSearchProvider] = useState("");
  const [selectedFamilies, setSelectedFamilies] = useState([]);
  const [countsByCategory, setCountsByCategory] = useState({});

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
        calculateCountsByCategory(response.data.data); // Calcular cantidades por categoría
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

  const calculateCountsByCategory = (data) => {
    const counts = {
      total: data.length,
      paid: data.filter((invoice) => invoice.invoiceStatus === "Pagada").length,
      unpaid: data.filter((invoice) => invoice.invoiceStatus === "Sin Pagos")
        .length,
      pendingApproval: data.filter(
        (invoice) => invoice.invoiceStatus === "En Espera de Aprobacion"
      ).length,
      // Agrega más categorías según sea necesario
    };
    setCountsByCategory(counts);
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
          calculateCountsByCategory(updatedData); // Actualizar cantidades por categoría
          return updatedData;
        });
      }
    } catch (err) {
      console.error("Error deleting invoice:", err);
    }
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

  return (
    <div className="flex bg-gradient-to-r from-blue-500 ">
      <Sidebardb />
      <FormInvoices />
      <div className="b-4 bg-white mt-4 ml-3 mb-6 p-4 rounded-lg">
        <h1 className="text-lg text-center font-semibold">
          MAESTRO DE FACTURAS
        </h1>
        <Link to={"/informe/InvoicesReport/listadofacturas"}>
          <div className="mt-3 mr-3 ml-2 shadow-xl flex justify-center text-white p-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500">
            Ir a maestro de facturas
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
              className="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
          </div>
        </Link>
        <div className="grid grid-cols-3" style={{ width: "1350px" }}>
          <div className="text-center p-2 bg-gradient-to-r from-indigo-500 to-blue-500 grid grid-rows-2 rounded-xl shadow-xl mt-4 mb-4 mr-3">
            <h2 className="text-white">
              Total Facturado ({countsByCategory.total}):
            </h2>
            <h1 className="text-white">
              {formatCurrency(totalInvoicedAmount)}
            </h1>
          </div>
          <div className="text-center bg-gradient-to-r from-indigo-500 to-blue-500 grid grid-rows-2 rounded-xl shadow-xl mt-4 mb-4 mr-3">
            <h2 className="text-white">
              Total Pagado ({countsByCategory.paid}):
            </h2>
            <h1 className="text-white">{formatCurrency(totalPaidAmount)}</h1>
          </div>
          <div className="text-center bg-gradient-to-r from-indigo-500 to-blue-500 grid grid-rows-2 rounded-xl shadow-xl mt-4 mb-4 mr-3">
            <h2 className="text-white">
              Total Por Pagar ({countsByCategory.unpaid}):
            </h2>
            <h1 className="text-white">
              {formatCurrency(totalInvoicedAmount - totalPaidAmount)}
            </h1>
          </div>
        </div>
        {/* <CardsTotalInvoicesInformation /> */}
        <InvoicesStatusChart />
        <InvoicePieCharts invoicesdata={invoicesdata} />
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
      </div>
    </div>
  );
};

export default InvicesMasterTable;
