import "dotenv/config";
import mongoConnect from "./config/mongo.config.js";
import axios from "axios";
import {BudgetModel} from "./models/budget.moldel.js";
import {ControlSheetModel} from "./models/controlsheet.model.js";
import {InvoicesModel} from "./models/invoices.model.js";

// https://api.iconstruye.com/ordencompra/api/ConectorConsultarCentroGestion?activo=-1&info=302870&api-version=1.0
// https://api.iconstruye.com/ordencompra/api/ConectorBuscarOrdenCompra?IdOrgcOC=66002&FechaCreacionDesde=2023-05-24 00:00:00&FechaCreacionHasta=2023-06-24 00:00:00&IdEstadoOc=-1&IdTipoOc=-1
// https://api.iconstruye.com/cvbf/api/Factura/Buscar?IdOrgc=66002&FechaRecepDesde=2023-06-24 00:00:00&FechaRecepHasta=2023-07-24 00:00:00&api-version=1.0


let UFS_memo = {
}

let controlsheetsNames = {}
let controlsheetsCods = {}


const dateToString = (date) => {
    // from date to string with format 2023-05-24 00:00:00
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let monthString = month < 10 ? `0${month}` : `${month}`;
    let dayString = day < 10 ? `0${day}` : `${day}`;
    let hoursString = hours < 10 ? `0${hours}` : `${hours}`;
    let minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;
    let secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${year}-${monthString}-${dayString} ${hoursString}:${minutesString}:${secondsString}`;
}

// const getUFPrice = async (date) => {
//     let uf = UFS_memo[date];
//     if (uf){
//         return uf;
//     } else {
//         let response = await getRemoteUFPrice(date);
//         if (response && response.data && response.data.UFs && response.data.UFs.length > 0){
//             let ufs = response.data.UFs;
//             ufs.map((uf) => {
//                 UFS_memo[uf.fecha] = uf.Valor;
//             });
//             return UFS_memo[date];
//         } else {
//             return -1;
//         }
//     }
// }
//
// const getRemoteUFPrice = async (date) => {
//     const APIKEY = "a0dd0d102eeace0260ca2c49143e947e362b7271";
//     let url = `https://api.sbif.cl/api-sbifv3/recursos_api/uf/${date.getFullYear()}/${date.getMonth() + 1}?apikey=${APIKEY}&formato=json`;
//
//     let response = await axios.get(
//         url
//     );
//
//     return response;
// }

const getOC = async () => {
    let axiosClient = axios.create({
        baseURL: "https://api.iconstruye.com",
        headers: {
            "Ocp-Apim-Subscription-Key": "05a4707486cc4b29b07831f5f4fe8bc6"
        }
    })

    let startDate = new Date("2023-04-24 00:00:00");
    let endDate = new Date("2023-05-24 23:59:59");

    while (startDate <= new Date()){
        console.log(startDate, endDate);

        let url = `/ordencompra/api/ConectorBuscarOrdenCompra?FechaCreacionDesde=${dateToString(startDate)}&FechaCreacionHasta=${dateToString(endDate)}`;
        url = `${url}&IdOrgcOC=66002&IdEstadoOc=-1&IdTipoOc=-1`;

        let response = await axiosClient.get(
            url
        );

        console.log(response.data.length);
        if (response.data.length > 0){

            for (let i = 0; i < response.data.length; i++){
                let datum = response.data[i];

                let url = `/ordencompra/api/ConectorOrdenCompraCreada?IdDoc=${datum.idDocumento}&api-version=1,0`;

                let rsp = await axiosClient.get(
                    url
                );

                let oc = rsp.data[0];

                let ocData = {
                    projectId: "PT-101",
                    date: new Date(oc.cabecera.documento.fechaCreacion),
                    description: oc.cabecera.receptor.razonSocialReceptor,
                    subcontractorOffers: oc.cabecera.receptor.razonSocialReceptor,
                    cod: oc.cabecera.documento.idOc,
                    qty: 1,
                    unit: "OC",
                    unitPrice: oc.cabecera.totales.montoTotal,
                    total: oc.cabecera.totales.montoTotal,
                    rawData: oc
                }

                let rc = oc.detalle.lineas;
                if (!rc || rc.length > 0) {
                    oc.detalle.lineas.map((linea) => {
                        linea.distribucionCosto.map(async (cost) => {
                            let budget = controlsheetsCods[cost.idCentroCosto] || controlsheetsNames[cost.descripcionCentCosto];
                            if (!budget) {
                                console.log("No control sheet found for", cost.idCentroCosto, cost.descripcionCentCosto);
                                budget = await BudgetModel.create({
                                    projectId: "PT-101",
                                    cod: cost.idCentroCosto,
                                    taskName: cost.descripcionCentCosto,
                                    unit: "",
                                    qty: 1,
                                    unitPrice: 0,
                                    totalPrice: 0,
                                    family: "",
                                    subfamily: cost.descripcionCentCosto,
                                })
                                controlsheetsCods[cost.idCentroCosto] = budget;
                                controlsheetsNames[cost.descripcioncentcosto] = budget;
                            }
                            ocData.family = budget.family;
                            ocData.subfamily = budget.subfamily;
                        })
                    })
                }

                await ControlSheetModel.findOneAndUpdate(
                    {cod: ocData.cod},
                    ocData,
                    {upsert: true}
                    );
            }
        }
        startDate = endDate;
        endDate = new Date(endDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
}

const getInvoices = async () => {
    let axiosClient = axios.create({
        baseURL: "https://api.iconstruye.com",
        timeout: 30000,
        headers: {
            "Ocp-Apim-Subscription-Key": "155bcbb40e44403e90a03b9d03457a87"
        }
    })

    let startDate = new Date("2023-04-24 00:00:00");
    let endDate = new Date("2023-05-24 23:59:59");

    while (startDate <= new Date()) {
        console.log(startDate, endDate);

        let url = `/cvbf/api/Factura/Buscar?IdOrgc=66002&FechaRecepDesde=${dateToString(startDate)}&FechaRecepHasta=${dateToString(endDate)}&api-version=1.0`;

        let res = await axiosClient.get(
            url
        );

        console.log(res.data.length);
        if (res.data.length > 0) {
            for (let i = 0; i < res.data.length; i++) {

                // add waiting time to avoid 429 error
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, 400)
                });

                let datum = res.data[i];

                let invoiceData = {
                    projectId: "PT-101",
                    invoices: datum.numDoc,
                    dateInvoices: new Date(datum.fechaEmision),
                    subcontractorOffers: datum.nomProveedor,
                    description: datum.nomProveedor,
                    totalInvoices: datum.montoTotal,
                    invoiceStatus: datum.estadoPago,
                }

                let url = `/cvbf/api/Factura/PorId?IdDoc=${datum.idDocumento}&api-version=1.0`;

                // let strDate = "2023-12-21T00:00:00"
                // let date = new Date(strDate);

                let response = await axiosClient.get(
                    url
                );

                let dtm = response.data[0];

                if (dtm.cabecera.fecha.fechaPago)
                    invoiceData.dueDate = new Date(dtm.cabecera.fecha.fechaPago)

                let ocs = dtm.detalle.documentosRelacionados.ordenCompra;



                if (ocs && ocs.length > 0){
                    console.log(ocs.length);
                    ocs.map(async (oc) => {
                        let ocData = {
                            projectId: "PT-101",
                            date: new Date(oc.fechaCreacion),
                            description: datum.nomProveedor,
                            subcontractorOffers: datum.nomProveedor,
                            cod: oc.numOC,
                            qty: 1,
                            unit: "OC",
                            unitPrice: oc.montoTotal,
                            total: oc.montoTotal,
                            rawData: oc
                        }
                        let rc = oc.recepcion;
                        if (!rc || rc.length > 0) {
                            oc.recepcion.map((recep) => {
                                recep.detalleRecepcion.map((det) => {
                                    det.distribucionCosto.map(async (cost) => {
                                        let budget = controlsheetsCods[cost.idCentroCosto] || controlsheetsNames[cost.descripcioncentcosto];
                                        if (!budget) {
                                            console.log("No control sheet found for", cost.idCentroCosto, cost.descripcioncentcosto);
                                            budget = await BudgetModel.create({
                                                projectId: "PT-101",
                                                cod: cost.idCentroCosto,
                                                taskName: cost.descripcioncentcosto,
                                                unit: "",
                                                qty: 1,
                                                unitPrice: 0,
                                                totalPrice: 0,
                                                family: "",
                                                subfamily: cost.descripcioncentcosto,
                                            })
                                            controlsheetsCods[cost.idCentroCosto] = budget;
                                            controlsheetsNames[cost.descripcioncentcosto] = budget;
                                        }
                                        ocData.family = budget.family;
                                        ocData.subfamily = budget.subfamily;
                                        invoiceData.family = budget.family;
                                        invoiceData.subfamily = budget.subfamily;
                                    })
                                })
                            })
                        }
                        await ControlSheetModel.findOneAndUpdate(
                            {cod: ocData.cod},
                            ocData,
                            {upsert: true}
                        );
                    })
                }
                await InvoicesModel.findOneAndUpdate(
                    {invoices: invoiceData.invoices},
                    invoiceData,
                    {upsert: true}
                );
            }
        }

        startDate = endDate;
        endDate = new Date(endDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
}

mongoConnect().then(async () => {
    let controlsheets = await BudgetModel.find({})
    controlsheets.map((cs) => {
        controlsheetsNames[cs.taskName] = cs;
        controlsheetsCods[cs.cod] = cs;
    })
    // await getOC()
    await getInvoices();
    console.log("Se fini")
});