import { useContext, useState } from "react";
import Modal from "../Modal";
import axios from "axios";
import { ViewerContext } from "../Context";
import { BASE_URL } from "../../constants.js";

function FormIncreaseAndDiscount() {
  const {
    projectId,
    setProjectId,
    family,
    setFamily,
    subfamily,
    setSubfamily,
    isModalOpenBudget,
    isEditMode,
    setIsModalOpenBudget,
    setIsEditMode,
    currentIdIncreaseDiscount,
  } = useContext(ViewerContext);

  const [dataFamily, setDataFamily] = useState(family);
  const [dataSubfamily, setDataSubfamily] = useState("");
  const [dataProjectId, setDataProjectId] = useState(projectId);
  const [detalle, setDetalle] = useState("");
  const [aumentodisminucion, setAumentoDisminucion] = useState("");
  const [real, setReal] = useState("");
  const [recuperable, setRecuperable] = useState("");
  const [observaciones, setObservaciones] = useState("");

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


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Subfamily:", subfamily);  
    const increaseAndDiscountData = {
      projectId: dataProjectId || undefined,
      family: dataFamily || undefined,
      subfamily: dataSubfamily || undefined,
      Detalle: detalle || undefined,
      Aumentodisminucion: aumentodisminucion || undefined,
      Real: real || undefined,
      Recuperable: recuperable || undefined,
      Observaciones: observaciones || undefined,
    };


    try {
      if (isEditMode) {
        resetForm();
        await axios.patch(
          `${BASE_URL}/increasediscount/${currentIdIncreaseDiscount}`,
          increaseAndDiscountData
        );
      } else {
        await axios.post(
          BASE_URL + "/increasediscount",
          increaseAndDiscountData
        );
      }
      closeModelBudget();
    } catch (err) {
      console.error("Error submit Observation Contract", err);
    }
  };
  const resetForm = () => {
    setProjectId("");
    setFamily("");
    setSubfamily("");
  };

  const closeModelBudget = () => {
    setIsModalOpenBudget(false);
    if (isEditMode) {
      resetForm();
      setIsEditMode(false);
    }
  };

  return (
    <div>
      <Modal isOpen={isModalOpenBudget}>
        <h1 className="text-sm font-blod mb-2 text-white">
          {isEditMode ? "Modo Editar" : "Modo Crear"}
        </h1>
        <div className="bg-slate-900 ">
          <form onSubmit={handleSubmit}>
            <div className="flex">
              <div>
                <label className="text-xs text-white font-bolt mb-2 p-1">
                  ProjectId
                  <select
                    className="bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2 p-1 text-white border-solid border-4 border-gray-500"
                    placeholder="ProjectId"
                    type="text"
                    value={dataProjectId}
                    onChange={(e) => setDataProjectId(e.target.value)}
                  >
                    <option value="Proyecto">Proyecto</option>
                    <option value="PT-101">PT-101</option>
                    <option value="TR-222">TR-222</option>
                  </select>
                </label>
              </div>
              <div>
                <label className="text-xs text-white font-bolt mb-2 ">
                  family
                  <select
                    className="bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2 p-1 text-white border-solid border-4 border-gray-500"
                    placeholder="familia"
                    type="text"
                    value={dataFamily}
                    onChange={(e) => setDataFamily(e.target.value)}
                  >
                    <option value="Elegir Familia">Elegir Familia</option>
                    <option value="Subcontrato">Subcontrato</option>
                    <option value="Material">Material</option>
                    <option value="Arriendos">Arriendos</option>
                    <option value="Mano_Obra">Mano_Obra</option>
                    <option value="Otros">Otros</option>
                    <option value="GG">GG</option>
                  </select>
                </label>
              </div>
            </div>
            <label className="text-xs text-white font-bold mb-2">
              Subfamilia
              <select
                  className="bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2 p-1 text-white border-solid border-4 border-gray-500"
                  name="subfamily"
                  value={dataSubfamily}
                  onChange={(e) => setDataSubfamily(e.target.value)}
              >
                <option value="">Elegir Subfamilia</option>
                {subFamilies.map((subFamily) => (
                    <option key={subFamily} value={subFamily}>
                      {subFamily}
                    </option>
                ))}
              </select>
            </label>

            <label className="text-xs text-white font-bolt mb-2 p-1">
              Detalle
              <input
                className="bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2 p-2 text-white border-solid border-4 border-gray-500"
                placeholder="Detalle"
                type="text"
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
              />
            </label>

            <label className="text-xs text-white font-bolt mb-2 ">
              Aumento/Disminucion
              <select
                className="bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2 p-1 text-white border-solid border-4 border-gray-500"
                placeholder="aumentodisminucion"
                type="text"
                name="aumentodisminucion"
                value={aumentodisminucion}
                onChange={(e) => setAumentoDisminucion(e.target.value)}
              >
                <option value="Elegir Opcion">Elegir Opcion</option>
                <option value="Aumento">Aumento</option>
                <option value="Disminucion">Disminucion</option>
              </select>
              <label className="text-xs text-white font-bolt mb-2 p-1 ">
                Real
              </label>
              <input
                className="bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2 p-1 text-white border-solid border-4 border-gray-500"
                placeholder="Real"
                type="text"
                value={real}
                onChange={(e) => setReal(e.target.value)}
              />
            </label>
            <label className="text-xs text-white font-bolt mb-2 p-1 ">
              Recuperable
              <input
                className="bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2 p-1  text-white border-solid border-4 border-gray-500"
                placeholder="Recuperable"
                type="text"
                name="recuperable"
                value={recuperable}
                onChange={(e) => setRecuperable(e.target.value)}
              />
            </label>
            <label className="text-xs text-white font-bolt mb-2 ">
              Observaciones
              <input
                className="bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2 p-1 text-white border-solid border-4 border-gray-500"
                placeholder="Observaciones"
                name="observaciones"
                type="text"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />
            </label>
            <div className="flex justify-between">
              <button
                className="bg-green-500 text-xs font-semibold rounded-xl text-white p-3 mt-2  mb-2"
                type="submit"
              >
                Submit Tasks
              </button>
              <button
                onClick={closeModelBudget}
                className="bg-red-500 text-xs rounded-xl text-white font-semibold p-3 mt-2  mb-2"
              >
                Close Form
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default FormIncreaseAndDiscount;
