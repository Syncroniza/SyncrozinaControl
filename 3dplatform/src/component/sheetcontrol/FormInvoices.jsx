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
  const [dni,setDni]=useState("")
  const forceReRender = () => {
    setForceUpdate((prev) => prev + 1); // Si estás usando un contador
  };

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
                  onChange={(e) => setFamily(e.target.value)}>
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
              <select
                className=" bg-slate-700 text-xs rounded-lg mb-1 mt-2 flex mr-2 p-1 text-white border-solid border-4 border-gray-500 w-full"
                type="text"
                name="SubcontractorOffers "
                value={subfamily}
                onChange={(e) => setSubfamily(e.target.value)}>
                <option value="">Selecionar una HC</option>

                 <option value="INSTALACIÓN DE FAENA">
                  INSTALACIÓN DE FAENA
                </option>
                <option value="SOCALZADO">SOCALZADO</option>
                <option value="MOVIMIENTO DE TIERRA">
                  MOVIMIENTO DE TIERRA
                </option>
                <option value="GRUA">GRUA</option>
                <option value="TOPOGRAFO">TOPOGRAFO</option>
                <option value="ARRIENDO DE MOLDAJE">ARRIENDO DE MOLDAJE</option>
                <option value="INSTALACIÓN ELECTRICA">
                  INSTALACIÓN ELECTRICA
                </option>
                <option value="INSTALACIÓN SANITARIA">
                  INSTALACIÓN SANITARIA
                </option>
                <option value="BOMBA DE HORMIGÓN">BOMBA DE HORMIGÓN</option>
                <option value="ENFIERRADOR">ENFIERRADOR</option>
                <option value="MANO DE OBRA MOLDAJE">
                  MANO DE OBRA MOLDAJE
                </option>
                <option value="PERFILADO EXCAVACIÓN">
                  PERFILADO EXCAVACIÓN
                </option>
                <option value="BASURA">BASURA</option>
                <option value="CCDD Y TELECOM">CCDD Y TELECOM</option>
                <option value="AFINADO DE LOSA">AFINADO DE LOSA</option>
                <option value="CLIMA">CLIMA</option>
                <option value="CERRAJERÍA">CERRAJERÍA</option>
                <option value="PISCINA">PISCINA</option>
                <option value="HOJALATERIA">HOJALATERIA</option>
                <option value="PINTURA">PINTURA</option>
                <option value="PAPEL MURAL">PAPEL MURAL</option>
                <option value="FAENAS HUMEDAS - ESTUCOS">
                  FAENAS HUMEDAS - ESTUCOS
                </option>
                <option value="FAENAS HUMEDAS - YESOS">
                  FAENAS HUMEDAS - YESOS
                </option>
                <option value="MUEBLES Y CUBIERTAS">MUEBLES Y CUBIERTAS</option>
                <option value="MUEBLES Y CUBIERTAS AACC">
                  MUEBLES Y CUBIERTAS AACC
                </option>
                <option value="MO. PORCELANATO">MO. PORCELANATO</option>
                <option value="TABIQUERIA">TABIQUERIA</option>
                <option value="CARPINTERÍA">CARPINTERÍA</option>
                <option value="ANDAMIOS">ANDAMIOS</option>
                <option value="ESTRUCTURA DE CUBIERTA">
                  ESTRUCTURA DE CUBIERTA
                </option>
                <option value="QUIEBRAVISTA">QUIEBRAVISTA</option>
                <option value="CIERRES EXTERIORES">CIERRES EXTERIORES</option>
                <option value="SEÑALETICA">SEÑALETICA</option>
                <option value="PISO FOTOLAMINADO">PISO FOTOLAMINADO</option>
                <option value="ASCENSORES">ASCENSORES</option>
                <option value="VENTANAS">VENTANAS</option>
                <option value="INSTALACION DE ACCESORIOS">
                  INSTALACION DE ACCESORIOS
                </option>
                <option value="IMPERMEABILIZACIÓN">IMPERMEABILIZACIÓN</option>
                <option value="OTROS">OTROS</option>
                <option value="ARRIENDOS">ARRIENDOS</option>
                <option value="AISLACIÓN TERMICA">AISLACIÓN TERMICA</option>
                <option value="LUMINARIA"> LUMINARIA</option>
                <option value="ADHESIVO CERAMICO & PORCELANATO ">
                  ADHESIVO CERAMICO & PORCELANATO
                </option>
                <option value="QUINCALLERIA">QUINCALLERIA</option>
                <option value="PUERTAS">PUERTAS</option>
                <option value="LAVAPLATOS & ACCESORIOS">
                  LAVAPLATOS & ACCESORIOS
                </option>
                <option value="KIT DE COCINA">KIT DE COCINA</option>
                <option value="CORNISA">CORNISA</option>
                <option value="GRUPO ELECTROGENO">GRUPO ELECTROGENO</option>
                <option value="PAPEL MURAL">PAPEL MURAL-MATERIAL</option>
                <option value="YESO PUENTE ADHERENTE">
                  YESO PUENTE ADHERENTE
                </option>
                <option value="MORTEROS EN GENERAL">MORTEROS EN GENERAL</option>
                <option value="MITIGACION DE RUIDOS">
                  MITIGACION DE RUIDOS
                </option>
                <option value="RADIADORES">RADIADORES</option>
                <option value="MAMPARAS">MAMPARAS</option>
                <option value="ARIDOS">ARIDOS</option>
                <option value="RETIRO DE ESCOMBROS">RETIRO DE ESCOMBROS</option>
                <option value="TABIQUERÍA">TABIQUERÍA</option>
                <option value="OBRA GRUESA">OBRA GRUESA</option>
                <option value="MADERAS">MADERAS</option>
                <option value="MATERIALES PILAS">MATERIALES PILAS</option>
                <option value="ARTEFACTOS, TINAS Y RECEPTÁCULOS">
                  ARTEFACTOS, TINAS Y RECEPTÁCULOS
                </option>
                <option value="ESPEJOS Y ACCESORIOS">
                  ESPEJOS Y ACCESORIOS
                </option>
                <option value="GRIFERÍA Y ARTEFACTOS SANITARIOS">
                  GRIFERÍA Y ARTEFACTOS SANITARIOS
                </option>
                <option value="VANITORIO & LAVARROPA">
                  VANITORIO & LAVARROPA
                </option>
                <option value="PISO FOTOLAMINADO Y OTROS">
                  PISO FOTOLAMINADO Y OTROS
                </option>
                <option value="PORCELANATO Y CERAMICA">
                  PORCELANATO Y CERAMICA
                </option>
                <option value="HORMIGONES">HORMIGONES</option>
                <option value="INSTALACIONES PROVISORIAS">
                  INSTALACIONES PROVISORIAS
                </option>
                <option value="FIERRO Y ALAMBRE">FIERRO Y ALAMBRE</option>
                <option value="RED PANTALLA ANTICAIDA">
                  RED PANTALLA ANTICAIDA
                </option>
                <option value="ELEMENTOS DE PVC">ELEMENTOS DE PVC</option>
                <option value="MATERIALES TERMINACIONES">
                  MATERIALES TERMINACIONES
                </option>
              </select>
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
                  onChange={(e) => setInvoiceStatus(e.target.value)}>
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
              type="submit">
              Grabar
            </button>
            <button
              onClick={closeModalInvoices}
              className="bg-red-500 rounded-xl text-white text-xs font-semibold p-3 mt-2  mb-1">
              Cerrar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FormInvoices;
