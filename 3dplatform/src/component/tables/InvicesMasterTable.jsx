import { useContext, useEffect, useState } from "react";
import { ViewerContext } from "../Context";
import Sidebardb from "../dashboard/Sidebardb";
import FormInvoices from "../sheetcontrol/FormInvoices";
import axios from "axios";

const InvicesMasterTable = () => {
  const {
    setIsModalOpenBudget,
    invoicesdata,
    setInvoicesData,
    selectedSubfamily,
    openFormAndCurrentInvloiceId,
    formatCurrency,
    isModalOpenBudget,
    totalByWeek,
  } = useContext(ViewerContext);

  const openModal = () => setIsModalOpenBudget(true);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/invoices/`);
      const sortedInvoices = response.data.data.sort((a, b) => new Date(a.dateInvoices) - new Date(b.dateInvoices));
      if (Array.isArray(response.data.data) && response.data.data.length > 0) {
        setInvoicesData(response.data.data); // Actualiza el estado de proyectos
      } else {
        console.error("Empty array of projects", response);
      }
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [selectedSubfamily, isModalOpenBudget, setInvoicesData]); // Se ejecuta solo e
  //--------------------Delete____________________________
  const handleDeleteInvoice = async (invoicesid) => {
    const isConfirmed = window.confirm(
      "Esta seguro que quiere borrar la factura ?"
    );
    if (!isConfirmed) {
      return;
    }
    try {
      const response = await axios.delete(
        `http://localhost:8000/invoices/${invoicesid}`
      );
      console.log("🚀 ~ handleDeleteInvoice ~ response:", response)

      if (response.status === 200) {
        setInvoicesData((prevInvoiceData) => {
          // Filtrar el array para remover el elemento eliminado
          return prevInvoiceData.filter(
            (invoices) => invoices._id !== invoicesid
          );
        });
      }
    } catch (err) {
      console.error("Error deleting invoice:", err);
    }
  };

  // ---------------------------------------------------------------------------------------------------------//

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

  return (
    <div className="flex bg-gradient-to-r from-blue-700 ">
      <Sidebardb />
      <FormInvoices />
      <div className="  b-4 bg-white mt-4 ml-3 mb-6 p-4 rounded-lg">
        <h1 className="text-lg mb-4 text-center font-semibold">
          MAESTRO DE FACTURAS
        </h1>
        {/* --------------------- Nuevo Registro ----------------- */}
        <div className="flex mb-4">
          <button
            onClick={openModal}
            className="flex  bg-blue-500 mt-2 ml-2 p-1 text-white rounded-lg text-xs  "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              dataslot="icon"
              className="w-2 h-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>{" "}
            Nuevo Registro
          </button>
        </div> 
        <div className="overflow-auto text-center " style={{ width: "1200px",height:"1000px" }}>
          <table className="w-full">
            <thead className="sticky top-0 bg-blue-500 text-white ">
              <tr className="border border-slate-300  text-xxs ">
                <th className="border border-slate-300 p-2  ">ProjectId</th>
                <th className="border border-slate-300 px-2  ">Familia</th>
                <th className="border border-slate-300 px-2  ">SubFamila</th>
                <th className="border border-slate-300 px-2  ">N° Factura</th>
                <th className="border border-slate-300 px-2  ">Fecha de emision</th>
                <th className="border border-slate-300 px-4  ">Proveedor</th>
                <th className="border border-slate-300 px-2   ">Glosa/EEPP</th>
                <th className="border border-slate-300 px-2  ">$ Factura</th>
                <th className="border border-slate-300 px-2  ">Estado Factura</th>
                <th className="border border-slate-300 px-2  ">Fecha Vencimiento</th>
                <th className="border border-slate-300 px-2  ">Borrar</th>
                <th className="border border-slate-300 px-2   ">Editar</th> 
              </tr>
            </thead>
            <tbody>
              {invoicesdata.map((invoices, y) => (
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
                    {invoices.subcontractorOffers}
                  </td>
                  <td className="border border-slate-300  px-2  ">
                    {invoices.description}
                  </td>
                  <td className="border border-slate-300  px-2  ">
                    {formatCurrency(invoices.totalInvoices)}
                  </td>
                  <td className="border border-slate-300 px-2   ">
                    {invoices.invoiceStatus}
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
