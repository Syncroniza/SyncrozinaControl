import { useContext, useEffect, useState } from "react";
import { ViewerContext } from "../Context";
import Sidebardb from "../dashboard/Sidebardb";
import FormInvoices from "../sheetcontrol/FormInvoices";
import axios from "axios";
import {BASE_URL} from "../../constants.js";

import Select from "react-select"
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
  console.log("🚀 ~ InvicesMasterTable ~ invoicesdata:", invoicesdata);

  const [paidInvoices, setPaidInvoices] = useState([]);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [totalInvoicedAmount, setTotalInvoicedAmount] = useState(0);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedDocStates, setSelectedDocStates] = useState([]);
  const [selectedPagoStates, setSelectedPagoStates] = useState([]);
  const [totalsByState, setTotalsByState] = useState({});

  const openModal = () => setIsModalOpenBudget(true);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/invoices/`);
      const sortedInvoices = response.data.data.sort(
        (a, b) => new Date(a.dateInvoices) - new Date(b.dateInvoices)
      );
      console.log("🚀 ~ fetchInvoices ~ response:", response);
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
      "Esta seguro que quiere borrar la factura ?"
    );
    if (!isConfirmed) {
      return;
    }
    try {
      const response = await axios.delete(
        `${BASE_URL}/invoices/${invoicesid}`
      );
      console.log("🚀 ~ handleDeleteInvoice ~ response:", response);

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

  useEffect(() => {
    const selectedDocStatesValues = selectedDocStates.map(
      (option) => option.value
    );
    const selectedPagoStatesValues = selectedPagoStates.map(
      (option) => option.value
    );

    if (
      selectedDocStatesValues.length === 0 &&
      selectedPagoStatesValues.length === 0
    ) {
      setFilteredInvoices(invoicesdata);
      setTotalsByState({});
    } else {
      const filtered = invoicesdata.filter(
        (invoice) =>
          (selectedDocStatesValues.length === 0 ||
            selectedDocStatesValues.includes(invoice.rawData.estadoDoc)) &&
          (selectedPagoStatesValues.length === 0 ||
            selectedPagoStatesValues.includes(invoice.rawData.estadoPago))
      );
      setFilteredInvoices(filtered);

      // Calcular los totales por combinación de estados
      const combinations = [];
      if (selectedDocStatesValues.length === 0) {
        combinations.push(
          ...selectedPagoStatesValues.map((state) => ["", state])
        );
      } else if (selectedPagoStatesValues.length === 0) {
        combinations.push(
          ...selectedDocStatesValues.map((state) => [state, ""])
        );
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
              (docState === "" || invoice.rawData.estadoDoc === docState) &&
              (pagoState === "" || invoice.rawData.estadoPago === pagoState)
          )
          .reduce((sum, invoice) => sum + (invoice.totalInvoices || 0), 0);
        const key = `${docState}${
          docState && pagoState ? " y " : ""
        }${pagoState}`;
        acc[key] = total;
        return acc;
      }, {});
      setTotalsByState(totals);
    }
  }, [selectedDocStates, selectedPagoStates, invoicesdata]);

  // Obtener las opciones para el Select de los estados de los documentos y estados de pago
  const getEstadoDocOptions = () => {
    const estados = invoicesdata.map((invoice) => invoice.rawData.estadoDoc);
    const uniqueEstados = [...new Set(estados)];
    return uniqueEstados.map((estado) => ({ value: estado, label: estado }));
  };

  const getEstadoPagoOptions = () => {
    const estados = invoicesdata.map((invoice) => invoice.rawData.estadoPago);
    const uniqueEstados = [...new Set(estados)];
    return uniqueEstados.map((estado) => ({ value: estado, label: estado }));
  };

  return (
    <div className="flex bg-gradient-to-r from-blue-500 ">
      <Sidebardb />
      <FormInvoices />
      <div className="  b-4 bg-white mt-4 ml-3 mb-6 p-4 rounded-lg">
        <h1 className="text-lg  text-center font-semibold">
          MAESTRO DE FACTURAS
        </h1>
        <div className="grid grid-cols-3">
          <div className=" text-center p-2 bg-gradient-to-r from-indigo-500 to-blue-500  grid grid-rows-2   rounded-xl shadow-xl mt-4 mb-4 mr-3">
            <h2 className="text-white">Total Facturado:</h2>
            <h1 className="text-white">
              {formatCurrency(totalInvoicedAmount)}
            </h1>
          </div>

          <div className=" text-center bg-gradient-to-r from-indigo-500 to-blue-500  grid grid-rows-2  rounded-xl shadow-xl mt-4 mb-4 mr-3">
            <h2 className="text-white">Total Pagado:</h2>
            <h1 className="text-white">{formatCurrency(totalPaidAmount)}</h1>
          </div>

          <div className=" text-center bg-gradient-to-r from-indigo-500 to-blue-500  grid grid-rows-2   rounded-xl shadow-xl mt-4 mb-4 mr-3">
            <h2 className="text-white">Total Por Pagar:</h2>
            <h1 className="text-white">
              {formatCurrency(totalInvoicedAmount - totalPaidAmount)}
            </h1>
          </div>
        </div>
        <div className="p-5 grid grid-cols-2">
          <Select
            isMulti
            options={getEstadoPagoOptions()}
            value={selectedPagoStates}
            onChange={handlePagoStateChange}
            styles={customStyles}
            className="basic-multi-select"
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
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Seleccione Estado de Factura"
            noOptionsMessage={() => "No hay opciones disponibles"}
          />
        </div>
        <div className="grid grid-cols-3">
          {Object.entries(totalsByState).map(([state, total]) => (
            <div
              key={state}
              className=" text-center bg-gradient-to-r from-indigo-500 to-blue-500  grid grid-rows-2   rounded-xl shadow-xl mt-4 mb-4 mr-3"
            >
              <h2 className="text-white">Total {state}:</h2>
              <h1 className="text-white">{formatCurrency(total)}</h1>
            </div>
          ))}
        </div>
        <div
          className="overflow-auto text-center "
          style={{ width: "1200px", height: "1000px" }}
        >
          <table className="w-full">
            <thead className="sticky top-0 bg-blue-500 text-white ">
              <tr className="border border-slate-300  text-xxs ">
                <th className="border border-slate-300 p-2  ">ProjectId</th>
                <th className="border border-slate-300 px-2  ">Familia</th>
                <th className="border border-slate-300 px-2  ">SubFamila</th>
                <th className="border border-slate-300 px-2  ">N° Factura</th>
                <th className="border border-slate-300 px-2  ">
                  Fecha de emision
                </th>
                <th className="border border-slate-300 px-4  ">Proveedor</th>
                <th className="border border-slate-300 px-2  ">$ Factura</th>
                <th className="border border-slate-300 px-2  ">Estado</th>
                <th className="border border-slate-300 px-2  ">
                  Estado Factura
                </th>
                <th className="border border-slate-300 px-2  ">
                  Fecha Vencimiento
                </th>
                <th className="border border-slate-300 px-2">Borrar</th>
                <th className="border border-slate-300 px-2   ">Editar</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoices, y) => (
                <tr key={y} className="text-xxs ">
                  <td className="border border-slate-300  px-2   ">
                    {invoices.projectId}
                  </td>
                  <td className="border border-slate-300 px-2   ">
                    {invoices.family}
                  </td>
                  <td className="border border-slate-300  px-2  ">
                    {invoices.subfamily}
                  </td>
                  <td className="border border-slate-300  px-2  ">
                    {invoices.invoices}
                  </td>
                  <td className="border border-slate-300  px-2  ">
                    {formatedDate(invoices.dateInvoices)}
                  </td>
                  <td className="border border-slate-300  px-2  ">
                    {invoices.description}
                  </td>
                  <td className="border border-slate-300  px-2  ">
                    {formatCurrency(invoices.totalInvoices)}
                  </td>
                  <td className="border border-slate-300 px-2   ">
                    {invoices.rawData.estadoDoc}
                  </td>
                  <td className="border border-slate-300 px-2   ">
                    {invoices.rawData.estadoPago}
                  </td>
                  <td className="border border-slate-300  px-2  ">
                    {formatedDate(invoices.dueDate)}
                  </td>
                  <td className="border border-slate-300 px-2">
                    <button
                      className=" bg-red-500  p-1 text-white rounded-lg text-xs "
                      onClick={() =>
                        handleDeleteInvoice(invoices._id || invoices.id)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-3 h-3 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </td>
                  <td className="border border-slate-300 ">
                    <button
                      className="flex justify-end bg-green-500 p-1 text-white rounded-lg text-xs"
                      onClick={() =>
                        openFormAndCurrentInvloiceId(
                          invoices._id || invoices.id
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
