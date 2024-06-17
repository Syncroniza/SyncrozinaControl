import { useContext, useState } from "react";
import Modal from "../Modal";
import axios from "axios";
import { ViewerContext } from "../Context";

const FormInvoices = () => {
  const {
    isModalOpenBudget,
    setIsModalOpenBudget,
    projectId,
    setProjectId,
    isEditMode,
    setIsEditMode,
    curentIdInvoices,
    invoices,
    setInvoices,
    dateInvoices,
    setDateInvoices,
    totalInvoices,
    setTotalInvoices,
    invoiceStatus,
    setInvoiceStatus,
    dueDate,
    setDueDate,
    observations,
    setObservations,
    family,
    setFamily,
    subfamily,
    setSubfamily,
    subcontractorOffers,
    description,
    setSubcontractorsOffers,
    setDescription,
    setInvoicesData,
  } = useContext(ViewerContext);
  // const closeModelInvoices = () => setIsModalOpenBudget(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [dni, setDni] = useState("");
  const forceReRender = () => {
    setForceUpdate((prev) => prev + 1); // Si estás usando un contador
  };
  const subFamilies = [
    "INSTALACIÓN DE FAENA",
    "SOCALZADO",
    "MOVIMIENTO DE TIERRA",
    "GRUA",
    "TOPOGRAFO",
    "ARRIENDO DE MOLDAJE",
    "INSTALACIÓN ELECTRICA",
    "INSTALACIÓN SANITARIA",
    "BOMBA DE HORMIGÓN",
    "ENFIERRADOR",
    "MANO DE OBRA MOLDAJE",
    "PERFILADO EXCAVACIÓN",
    "BASURA",
    "CCDD Y TELECOM",
    "AFINADO DE LOSA",
    "CLIMA",
    "CERRAJERÍA",
    "PISCINA",
    "HOJALATERIA",
    "PINTURA",
    "PAPEL MURAL",
    "FAENAS HUMEDAS - ESTUCOS",
    "FAENAS HUMEDAS - YESOS",
    "MUEBLES Y CUBIERTAS",
    "MUEBLES Y CUBIERTAS AACC",
    "MO. PORCELANATO",
    "TABIQUERIA",
    "CARPINTERÍA",
    "ANDAMIOS",
    "ESTRUCTURA DE CUBIERTA",
    "QUIEBRAVISTA",
    "CIERRES EXTERIORES",
    "SEÑALETICA",
    "PISO FOTOLAMINADO",
    "ASCENSORES",
    "VENTANAS",
    "INSTALACION DE ACCESORIOS",
    "IMPERMEABILIZACIÓN",
    "OTROS",
    "ARRIENDOS",
    "AISLACIÓN TERMICA",
    "LUMINARIA",
    "ADHESIVO CERAMICO & PORCELANATO",
    "QUINCALLERIA",
    "PUERTAS",
    "LAVAPLATOS & ACCESORIOS",
    "KIT DE COCINA",
    "CORNISA",
    "GRUPO ELECTROGENO",
    "PAPEL MURAL",
    "PAPEL MURAL SUBCONTRATO",
    "YESO PUENTE ADHERENTE",
    "MORTEROS EN GENERAL",
    "MITIGACION DE RUIDOS",
    "RADIADORES",
    "MAMPARAS",
    "ARIDOS",
    "RETIRO DE ESCOMBROS",
    "TABIQUERÍA",
    "OBRA GRUESA",
    "MADERAS",
    "MATERIALES PILAS",
    "ARTEFACTOS, TINAS Y RECEPTÁCULOS",
    "ESPEJOS Y ACCESORIOS",
    "GRIFERÍA Y ARTEFACTOS SANITARIOS",
    "VANITORIO & LAVARROPA",
    "PISO FOTOLAMINADO Y OTROS",
    "PORCELANATO Y CERAMICA",
    "HORMIGONES",
    "INSTALACIONES PROVISORIAS",
    "FIERRO Y ALAMBRE",
    "RED PANTALLA ANTICAIDA",
    "ELEMENTOS DE PVC",
    "MATERIALES TERMINACIONES",
    "PERSONAL ADMINISTRATIVO",
    "POST VENTA Y MARCHA BLANCA",
    "HERRAMIENTAS Y OTROS",
    "ELEMENTOS PROTECCION PERSONAL",
    "MAQ. MENOR (COMPRA O ARRIENDO) Y OTROS",
    "MAQUINARIA ARRIENDO",
    "FLETES",
    "GASTOS DE OBRA",
    "FOTOCOPIAS",
    "GASTOS FINANCIEROS",
    "SEGUROS Y OTROS",
  ].sort();

  const handleSubmitInvoices = async (e) => {
    e.preventDefault();
    const invoiceData = {
      projectId: projectId || undefined,
      family: family || undefined,
      subfamily: subfamily || undefined,
      invoices: invoices || undefined,
      dateInvoices: dateInvoices || undefined,
      subcontractorOffers: subcontractorOffers,
      description: description || undefined,
      totalInvoices: totalInvoices || undefined,
      invoiceStatus: invoiceStatus || undefined,
      dueDate: dueDate || undefined,
      observations: observations || undefined,
      dni: dni || undefined,
    };
    try {
      if (isEditMode) {
        // Asegúrate de que currentIdInvoices tiene el valor correcto
        const response = await axios.patch(
          `http://localhost:8000/invoices/${curentIdInvoices}`,
          invoiceData
        );
        const invoice = response.data;
        setInvoicesData((prevData) =>
          prevData.map((items) =>
            items._id === invoice._id ? { ...items, ...invoice } : items
          )
        );

        // Aquí, después de una operación PATCH exitosa, también puedes establecer isEditMode en false si es necesario
        setIsEditMode(false); // Esto reinicia el modo a no edición
      } else {
        const response = await axios.post(
          "http://localhost:8000/invoices/",
          invoiceData
        );
        const invoice = response.data;
        setInvoicesData((prevData) => [...prevData, invoice]);
        // No es necesario cambiar isEditMode aquí, ya que se asume que ya está en false para operaciones POST
      }
      resetForm();
    } catch (err) {
      console.error("Error submitting invoice:", err);
    }
  };

  // limpia formulario
  const resetForm = () => {
    setProjectId("");
    setFamily("");
    setSubfamily("");
    setInvoices("");
    setDateInvoices("");
    setSubcontractorsOffers(1);
    setDescription("");
    setTotalInvoices("");
    setInvoiceStatus("");
    setDueDate("");
    setObservations("");
  };

  const closeModalInvoices = () => {
    setIsModalOpenBudget(false);
    setIsEditMode(false); // Restablece isEditMode a false aquí
    resetForm();
    forceReRender();
    // Asume que esta función restablece el resto del formulario
  };

  return (
    <div className=" ">
      <Modal className="" isOpen={isModalOpenBudget}>
        <h1 className="text-sm font-blod mb-2 text-white">
          Ingreso de Facturas
        </h1>
        <form className="" onSubmit={handleSubmitInvoices}>
          <div className="bg-slate-900 ">
            <div className="flex gap-1 ">
              <div className="">
                <label className="text-xs text-white font-bolt mb-2 ">
                  ProjectId
                </label>
                <input
                  className="  bg-slate-700 text-xs rounded-lg mb-1 mt-2 flex mr-2 p-1 text-white border-solid border-4 border-gray-500  "
                  placeholder="ProjectId"
                  type="text"
                  name="ProjectId"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                />
              </div>
            </div>

            <div className="">
              <label className="text-xs text-white font-bolt mb-1  ">
                Familia
                <select
                  className="text-xs  font-bolt  bg-slate-700 rounded-lg mb-1 mt-2 flex mr-2 p-1 text-white border-solid border-4 border-gray-500"
                  name="family"
                  value={family}
                  onChange={(e) => setFamily(e.target.value)}
                >
                  <option value="">Selecionar una Familia</option>
                  <option value="Subcontrato">Subcontrato</option>
                  <option value="Material">Material</option>
                  <option value="Arriendos">Arriendos</option>
                  <option value="Mano_Obra">Mano_Obra</option>
                  <option value="Otros">Otros</option>
                  <option value="GG">GG</option>
                </select>
              </label>
            </div>
            <div className="">
              <label className="text-xs text-white font-bolt mb-1 ">
                Subfamilia
                <select
                  className=" bg-slate-700 text-xs rounded-lg mb-1 mt-2 flex mr-2 p-1 text-white border-solid border-4 border-gray-500 w-full"
                  type="text"
                  name="Subfamily"
                  value={subfamily}
                  onChange={(e) => setSubfamily(e.target.value)}
                >
                  <option value="">Seleccionar Subfamilia</option>
                  {subFamilies.map((subFamily) => (
                    <option key={subFamily} value={subFamily}>
                      {subFamily}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div className="">
            <label className="text-xs text-white font-bolt mb-1 ">
              N° Factura
              <input
                className=" bg-slate-700 rounded-lg mb-1 mt-2 flex  mr-2 p-1 text-white border-solid border-4 border-gray-500 w-full"
                placeholder="factura"
                type="text"
                name="invoice"
                value={invoices}
                onChange={(e) => setInvoices(e.target.value)}
              />
            </label>
          </div>

          <div>
            <label className="text-xs text-white font-bolt mb-1 ">
              Proveedor
              <input
                className=" bg-slate-700 rounded-lg mb-1 mt-2 flex mr-2 p-1 text-white border-solid border-4 border-gray-500 w-full"
                placeholder="Proveedor"
                type="text"
                name="subcontractorOffers"
                value={subcontractorOffers}
                onChange={(e) => setSubcontractorsOffers(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label className="text-xs text-white font-bolt mb-1 ">
              RUT
              <input
                className=" bg-slate-700 rounded-lg mb-1 mt-2 flex mr-2 p-1 text-white border-solid border-4 border-gray-500 w-full"
                placeholder="RUT"
                type="text"
                name="dni"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
              />
            </label>
          </div>
          <div className="">
            <div className="flex">
              <div className="">
                <label className="text-xs text-white font-bolt mb-1 ">
                  Glosa
                  <input
                    className=" bg-slate-700 rounded-lg mb-1 mt-2 flex mr-2 p-1 text-white border-solid border-4 border-gray-500  w-full"
                    placeholder="Glosa"
                    type="text"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </label>
              </div>

              <div className="">
                <label className="text-xs text-white font-bolt mb-1 ">
                  Neto Factura
                  <input
                    className=" bg-slate-700 rounded-lg mb-1 mt-2 flex mr-2 p-1 text-white border-solid border-4 border-gray-500  w-full"
                    placeholder="Neto Factura"
                    type="number"
                    name="totalInvoices"
                    value={totalInvoices}
                    onChange={(e) => setTotalInvoices(e.target.value)}
                  />
                </label>
              </div>
              <div className="">
                <label className="text-xs text-white font-bolt mb-1 ">
                  Fecha emision
                  <input
                    className=" bg-slate-700 rounded-lg mb-1 mt-2 flex mr-2 p-1 text-white border-solid border-4 border-gray-500  w-full"
                    placeholder="Fecha emision"
                    type="date"
                    name="dataInvoices"
                    value={dateInvoices}
                    onChange={(e) => setDateInvoices(e.target.value)}
                  />
                </label>
              </div>
              <div className="">
                <label className="text-xs text-white font-bolt mb-1 ">
                  Fecha Pago
                  <input
                    className=" bg-slate-700 rounded-lg mb-1 mt-2 flex mr-2 p-1 text-white border-solid border-4 border-gray-500  w-full"
                    placeholder="Neto Factura"
                    type="date"
                    name="invoiceStatus"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </label>
              </div>
            </div>

            <div className="">
              <label className="text-xs text-white font-bolt mb-1 ">
                estado factura
                <select
                  className=" bg-slate-700 rounded-lg mb-1 mt-2 flex mr-2 p-1 text-white border-solid border-4 border-gray-500  w-full"
                  placeholder="Neto Factura"
                  type="checkbox"
                  name="invoiceStatus"
                  value={invoiceStatus}
                  onChange={(e) => setInvoiceStatus(e.target.value)}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Pagado">Pagado</option>
                </select>
              </label>
            </div>

            <div className="">
              <label className="text-xs text-white font-bolt mb-1 ">
                Observaciones
                <input
                  className=" bg-slate-700 rounded-lg mb-1 mt-2 flex mr-2 p-1 text-white border-solid border-4 border-gray-500"
                  placeholder="Observaciones"
                  type="text"
                  name="observations"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              className="bg-green-500 font-semibold rounded-xl text-xs text-white p-3 mt-2  mb-1"
              type="submit"
            >
              Grabar
            </button>
            <button
              onClick={closeModalInvoices}
              className="bg-red-500 rounded-xl text-white text-xs font-semibold p-3 mt-2  mb-1"
            >
              Cerrar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FormInvoices;
