import { useContext, useState } from "react";
import Modal from "../Modal";
import axios from "axios";
import { ViewerContext } from "../Context";

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
  const [detalle, setDetalle] = useState("");
  const [aumentodisminucion, setAumentoDisminucion] = useState("");
  const [real, setReal] = useState("");
  const [recuperable, setRecuperable] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const increaseAndDiscountData = {
      projectId: projectId || undefined,
      family: family || undefined,
      subfamily: subfamily || undefined,
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
          `http://localhost:8000/increasediscount/${currentIdIncreaseDiscount}`,
          increaseAndDiscountData
        );
      } else {
        await axios.post(
          "http://localhost:8000/increasediscount",
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
                <label className="text-xs text-white font-bolt mb-2 p-2">
                  ProjectId
                  <select
                    className="bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2 p-1 text-white border-solid border-4 border-gray-500"
                    placeholder="ProjectId"
                    type="text"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}>
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
                    value={family}
                    onChange={(e) => setFamily(e.target.value)}>
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

            <label className="text-xs text-white font-bolt  p-1">
              Subfamily
              <select
                className="bg-slate-700 text-xs rounded-lg  flex mr-2 p-1 text-white border-solid border-4 border-gray-500"
                placeholder="subfamilia"
                type="text"
                value={subfamily}
                onChange={(e) => setSubfamily(e.target.value)}>
                
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
                <option value="GG">GG</option>
              </select>
            </label>
            <label className="text-xs text-white font-bolt mb-2 p-1">
              Detalle
              <input
                className="bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2  text-white border-solid border-4 border-gray-500"
                placeholder="Detalle"
                type="text"
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
              />
            </label>

            <label className="text-xs text-white font-bolt mb-2 p-1">
              Aumento/Disminucion
              <select
                className="bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2  text-white border-solid border-4 border-gray-500"
                placeholder="aumentodisminucion"
                type="text"
                name="aumentodisminucion"
                value={aumentodisminucion}
                onChange={(e) => setAumentoDisminucion(e.target.value)}>
                <option value="Elegir Opcion">Elegir Opcion</option>
                <option value="Aumento">Aumento</option>
                <option value="Disminucion">Disminucion</option>
              </select>
              <label className="text-xs text-white font-bolt mb-2 p-1 ">Real</label>
              <input
                className="bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2  text-white border-solid border-4 border-gray-500"
                placeholder="Real"
                type="text"
                value={real}
                onChange={(e) => setReal(e.target.value)}
              />s
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
                className="bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2  text-white border-solid border-4 border-gray-500"
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
                type="submit">
                Submit Tasks
              </button>
              <button
                onClick={closeModelBudget}
                className="bg-red-500 text-xs rounded-xl text-white font-semibold p-3 mt-2  mb-2">
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
