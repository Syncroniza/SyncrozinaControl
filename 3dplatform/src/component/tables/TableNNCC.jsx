import { useContext, useEffect, useState } from "react";
import { ViewerContext } from "../Context";

const NNCC = () => {
    const {
        invoicesdata,
        selectedSubfamily,
        selectedProjectId,
        formatCurrency,
        selectedFamily,
    } = useContext(ViewerContext);

    const [newfilteredNCC, setNewFilteredNCC] = useState([]);
    const [totalNCC, setTotalNCC] = useState(0);

    const formatedDate = (isoDate) => {
        if (!isoDate) return "Fecha no disponible";
        const date = new Date(isoDate);
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1;
        const year = date.getUTCFullYear();
        const formattedDay = String(day).padStart(2, "0");
        const formattedMonth = String(month).padStart(2, "0");
        return `${formattedDay}/${formattedMonth}/${year}`;
    };

    useEffect(() => {
        if (!invoicesdata) return; // Asegúrate de que invoicesdata esté disponible

        const filteredInvoices = invoicesdata.filter(
            (invoice) =>
                (!selectedProjectId || invoice.projectId === selectedProjectId) &&
                (!selectedFamily || invoice.family === selectedFamily) &&
                (!selectedSubfamily || invoice.subfamily === selectedSubfamily)
        );

        const nnccData = filteredInvoices
            .filter((invoice) => invoice.nncc)
            .map((invoice) => {
                return invoice.nncc.map((nncc) => {
                    return { ...nncc, projectId: invoice.projectId, family: invoice.family, subfamily: invoice.subfamily };
            })
        }).flat();

        nnccData.sort(
            (a, b) => new Date(a.fechaEmision) - new Date(b.fechaEmision)
        );

        let totatNNCC = nnccData.reduce(
            (sum, nncc) => sum + parseFloat(nncc.montoTotal || 0),
            0
        );


        setTotalNCC(totatNNCC);
        setNewFilteredNCC(nnccData);
    }, [invoicesdata, selectedProjectId, selectedFamily, selectedSubfamily]);

    return (
        <div
            className="bg-white my-2 ml-3 mr-2 p-2 rounded-lg "
            style={{ width: "1350px" }}
        >
            <h1 className="text-sm font-semibold ml-3 ">NOTAS DE CRÉDITO</h1>
            <h1 className="bg-blue-500 text-xl text-white p-6 rounded-xl ml-1 mb-4 mt-2">
                {formatCurrency(totalNCC)}
            </h1>
            <div className="overflow-auto" style={{ height: "200px" }}>
                <table className=" mt-2 border border-slate-500 ml-2 mr-2 ">
                    <thead className="sticky top-0 bg-blue-500 text-white ">
                    <tr className="border border-slate-300  text-xxs">
                        <th className="border border-slate-300px-4   ">ProjectId</th>
                        <th className="border border-slate-300 px-4  ">Familias</th>
                        <th className="border border-slate-300 px-4  ">SubFamila</th>
                        <th className="border border-slate-300 px-4  ">N° Nota</th>
                        <th className="border border-slate-300 px-4  ">
                            Fecha de emision
                        </th>
                        <th className="border border-slate-300 px-4 ">Proveedor</th>
                        <th className="border border-slate-300 px-4  ">$ NNCC</th>
                    </tr>
                    </thead>
                    <tbody>
                    {newfilteredNCC.map((invoice) => (
                        <tr key={invoice._id} className="text-xxs">
                            <td className="border border-slate-300 px-4  ">
                                {invoice.projectId}
                            </td>
                            <td className="border border-slate-300 px-4  ">
                                {invoice.family}
                            </td>
                            <td className="border border-slate-300 px-4  ">
                                {invoice.subfamily}
                            </td>
                            <td className="border border-slate-300 px-4  ">
                                {invoice.folioDoc}
                            </td>
                            <td className="border border-slate-300 px-4  ">
                                {formatedDate(invoice.fechaEmision)}
                            </td>
                            <td className="border border-slate-300 px-4  ">
                                {invoice.nombreProveedor}
                            </td>
                            <td className="border border-slate-300 px-4  ">
                                {formatCurrency(invoice.montoTotal)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default NNCC;
