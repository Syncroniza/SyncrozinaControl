import Sidebardb from "../component/dashboard/Sidebardb.jsx";
import FormInvoices from "../component/sheetcontrol/FormInvoices.jsx";
import {useContext, useEffect, useState} from "react";
import {ViewerContext} from "../component/Context.jsx";
import axios from "axios";
import {BASE_URL} from "../constants.js";

const NNCCPage = () => {

    const {
        invoicesdata,
        setInvoicesData,
        formatCurrency,
    } = useContext(ViewerContext);

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "ascending",
    });

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

    const fetchInvoices = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/invoices/`);

            if (Array.isArray(response.data.data) && response.data.data.length > 0) {
                setInvoicesData(response.data.data);
            } else {
                console.error("Empty array of projects", response);
            }
        } catch (error) {
            console.error("Error fetching projects", error);
        }
    };

    const requestSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    useEffect(() => {
        fetchInvoices();
    }, [setInvoicesData]);

    console.log(invoicesdata.filter((invoice) => invoice.nnccTotal > 0).map((invoice) => (invoice.nncc)));

    return (
        <div className="flex bg-gradient-to-r from-blue-500 ">
            <Sidebardb />
            <FormInvoices />
            <div className="b-4 bg-white mt-4 ml-3 mb-6 p-4 rounded-lg">
                <h1 className="text-lg text-center font-semibold">
                    MAESTRO DE NOTAS DE CRÉDITO
                </h1>


                <table className="w-full">
                    <thead className="sticky top-0 bg-blue-500 text-white">
                    <tr className="border border-slate-300 text-xxs">
                        <th
                            className="border border-slate-300 px-2 cursor-pointer"
                            onClick={() => requestSort("family")}
                        >
                            Familia
                        </th>
                        <th
                            className="border border-slate-300 px-2 cursor-pointer"
                            onClick={() => requestSort("subfamily")}
                        >
                            SubFamilia
                        </th>
                        <th
                            className="border border-slate-300 px-2 cursor-pointer"
                            onClick={() => requestSort("invoices")}
                        >
                            N° Factura
                        </th>
                        <th
                            className="border border-slate-300 px-2 cursor-pointer"
                            onClick={() => requestSort("invoices")}
                        >
                            Folio Nota de Crédito
                        </th>
                        <th
                            className="border border-slate-300 px-2 cursor-pointer"
                            onClick={() => requestSort("dateInvoices")}
                        >
                            Fecha de emision
                        </th>
                        <th
                            className="border border-slate-300 px-2 cursor-pointer"
                            onClick={() => requestSort("rawData.rutProveedor")}
                        >
                            RUT Proveedor
                        </th>
                        <th
                            className="border border-slate-300 px-4 cursor-pointer"
                            onClick={() => requestSort("description")}
                        >
                            Proveedor
                        </th>
                        <th
                            className="border border-slate-300 px-2 cursor-pointer"
                            onClick={() => requestSort("totalInvoices")}
                        >
                            $ NN. CC
                        </th>
                        <th
                            className="border border-slate-300 px-2 cursor-pointer"
                            onClick={() => requestSort("rawData.estadoDoc")}
                        >
                            Estado
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {invoicesdata.filter((invoice) => invoice.nnccTotal > 0).map((invoice, y) => (
                        invoice.nncc.map((nncc, x) => (

                            <tr key={`${y}-${x}`} className="text-xxs">
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
                                    {nncc.folioDoc}
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
                                    {formatCurrency(invoice.nnccTotal)}
                                </td>
                                <td className="border border-slate-300 px-2">
                                    {nncc.estadoDoc}
                                </td>
                            </tr>
                        ))
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default NNCCPage;