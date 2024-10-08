import { useContext, useEffect } from "react";
import Modal from "../Modal";
import axios from "axios";
import { ViewerContext } from "../Context";
import {BASE_URL} from "../../constants.js";

const FormBudget = () => {
  const {
    isModalOpenBudget,
    setIsModalOpenBudget,
    projectId,
    setProjectId,
    date,
    setDate,
    isEditMode,
    currentSheetId,
    family,
    setFamily,
    cod,
    setCod,
    description,
    setDescription,
    unit,
    setUnit,
    subcontractorOffers,
    setSubcontractorsOffers,
    qty,
    setQty,
    unitPrice,
    setUnitPrice,
    total,
    setTotal,
    subfamily,
    setSubfamily,
  } = useContext(ViewerContext);

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



  const handleSubmitSheet = async (e) => {
    e.preventDefault();

    const sheetData = {
      projectId: projectId,
      date: date,
      family: family,
      cod: cod,
      description: description,
      qty: qty,
      unit: unit,
      unitPrice: unitPrice,
      subcontractorOffers: subcontractorOffers,
      total: total,
      subfamily: subfamily,
    };

    try {
      if (isEditMode) {
        resetForm();
        await axios.patch(
          `${BASE_URL}/sheet/${currentSheetId}`,
          sheetData
        );
      } else {
        await axios.post(BASE_URL + "/sheet/", sheetData);
      }

      closeModelBudget(); // Cierra el modal y limpia el formulario después de una operación exitosa
    } catch (err) {
      console.error("Error submitting sheet:", err);
    }
  };

  // limpia formulario
  const resetForm = () => {
    setProjectId("");
    setDate("");
    setFamily("");
    setCod("");
    setDescription("");
    setUnit("");
    setSubcontractorsOffers("");
    setQty(1);
    setUnitPrice(0);
    setTotal(0);
    setSubfamily("");
  };

  const closeModelBudget = () => {
    setIsModalOpenBudget(false);
    if (isEditMode) {
      resetForm();
    }
  };

  useEffect(() => {
    const numQuantity = Number(qty);
    const numUnitPrice = Number(unitPrice);

    if (!isNaN(numQuantity) && numUnitPrice) {
      setTotal(qty * unitPrice);
    }
  }, [qty, unitPrice, setTotal]);

  return (
    <div className=" ">
      <Modal className="" isOpen={isModalOpenBudget}>
        <h1 className="text-lg font-blod mb-2 text-white">
          {isEditMode ? "Modo Editar" : "Modo Crear"}
        </h1>
        <form className="" onSubmit={handleSubmitSheet}>
          <div className="bg-slate-900 ">
            <div className="flex gap-2 ">
              <div className="">
                <label className="text-sm text-white font-bolt mb-2 ">
                  ProjectId
                  <input
                    className="  bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2 p-2 text-white border-solid border-4 border-gray-500  "
                    placeholder="ProjectId"
                    type="text"
                    name="ProjectId"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                  />
                </label>
              </div>
              <div className="">
                <label className="text-sm text-white font-bolt mb-2  ">
                  Fecha
                  <input
                    className="  bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2 p-2 text-white border-solid border-4 border-gray-500"
                    placeholder="Fecha"
                    type="date"
                    name="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </label>
              </div>
            </div>
            <div className="flex gap-2 ">
              <div className="">
                <label className="text-sm text-white font-bolt mb-2  ">
                  Familia
                  <select
                    className="text-sm  font-bolt   bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2 p-2 text-white border-solid border-4 border-gray-500"
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
                <label className="text-sm text-white font-bolt mb-2 ">
                  OC
                  <input
                    className=" bg-slate-700 rounded-lg mb-2 mt-2 flex  mr-2 p-2 text-white border-solid border-4 border-gray-500 w-full"
                    placeholder="OC"
                    type="text"
                    name="cod"
                    value={cod}
                    onChange={(e) => setCod(e.target.value)}
                  />
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm text-white font-bolt mb-2 ">
                Descripcion
                <input
                  className=" bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2 p-2 text-white border-solid border-4 border-gray-500 w-full"
                  placeholder="Description"
                  type="text"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
            </div>
            <div className="">
              <div className="flex">
                <div className="">
                  <label className="text-sm text-white font-bolt mb-2 ">
                    Cantidad
                    <input
                      className=" bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2 p-2 text-white border-solid border-4 border-gray-500  w-full"
                      placeholder="Qty"
                      type="text"
                      name="qty"
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                    />
                  </label>
                </div>
                <div className="">
                  <div>
                    Unidad
                    <label className="text-sm text-white font-bolt mb-2 ">
                      <input
                        className=" bg-slate-700 rounded-lg mb-2 mt-2 flex  mr-2 p-2 text-white border-solid border-4 border-gray-500 w-full "
                        placeholder="Unit"
                        type="text"
                        name="unit"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="">
                <label className="text-sm text-white font-bolt mb-2 ">
                  Precio unitario
                  <input
                    className=" bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2  text-white border-solid border-4 border-gray-500 p-2"
                    placeholder="Unit Price"
                    type="number"
                    name="unitprice "
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                  />
                </label>
              </div>

              <div className="">
                <label className="text-sm text-white font-bolt mb-2 ">
                  Subcontrato/Proveedor
                  <input
                    className=" bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2 p-2 text-white border-solid border-4 border-gray-500 w-full"
                    placeholder="subcontractorOffers"
                    type="text"
                    name="SubcontractorOffers "
                    value={subcontractorOffers}
                    onChange={(e) => setSubcontractorsOffers(e.target.value)}
                  />
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
              <div className="">
                <label className="text-sm text-white font-bolt mb-2 ">
                  Total
                  <input
                    className=" bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2 p-2 text-white border-solid border-4 border-gray-500"
                    placeholder="Total"
                    type="number"
                    name="total"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              className="bg-green-500 text-sm font-semibold rounded-xl text-white p-3 mt-2  mb-2"
              type="submit">
              Submit Tasks
            </button>
            <button
              onClick={closeModelBudget}
              className="bg-red-500 text-sm rounded-xl text-white font-semibold p-3 mt-2  mb-2">
              Close Form
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FormBudget;
