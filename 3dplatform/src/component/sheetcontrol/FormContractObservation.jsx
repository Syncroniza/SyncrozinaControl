import { useContext, useEffect } from "react";
import Modal from "../Modal";
import axios from "axios";
import { ViewerContext } from "../Context";
import {BASE_URL} from "../../constants.js";

const FormContractObservation = () => {
  const {
    projectId,
    setProjectId,
    family,
    setFamily,
    subfamily,
    setSubfamily,
    setDescription,
    description,
    isModalOpenContract,
    isEditMode,
    setIsEditMode,
    setIsModalOpenContract,
    glosa,
    setGlosa,
    proyectado,
    setProyectado,
    data,
    currentContractId,
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
    "SEGUROS Y OTROS"

  ].sort(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const contractObservationData = {
      projectId: projectId || undefined,
      family: family || undefined,
      subfamily: subfamily || undefined,
      Descripcion: description || undefined,
      Proyectado: proyectado || undefined,
      Glosa: glosa || undefined,
    };

    try {
      if (isEditMode) {
        resetForm();
        await axios.patch(
          `${BASE_URL}/contract/${currentContractId}`,
          contractObservationData
        );
      } else {
        await axios.post(
          BASE_URL + "/contract",
          contractObservationData
        );
      }
      closeModelContrat();
    } catch (err) {
      console.error("Error submit Observation Contract", err);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      setGlosa(data.Glosa || "");
      setDescription(data.Descripcion || "");
      setProyectado(data.Proyectado || "");
    }
  }, [isEditMode, data]);

  const resetForm = () => {
    setProjectId("");
    setFamily("");
    setSubfamily("");
    setDescription("");
    setGlosa("");
    setProyectado("");
  };

  const closeModelContrat = () => {
    setIsModalOpenContract(false);
    if (isEditMode) {
      resetForm();
      setIsEditMode(false);
    }
  };

  return (
    <div>
      <Modal isOpen={isModalOpenContract}>
        <h1 className="text-sm font-blod mb-2 text-white">
          {isEditMode ? "Modo Editar" : "Modo Crear"}
        </h1>
        <div className="bg-slate-900 ">
          <form onSubmit={handleSubmit}>
            <div className="flex">
              <div>
                <label className="text-xs text-white font-bolt mb-2 ">
                  ProjectId
                  <select
                    className="bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2 p-2 text-white border-solid border-4 border-gray-500"
                    placeholder="ProjectId"
                    type="text"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
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
                    className="bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2 p-2 text-white border-solid border-4 border-gray-500"
                    placeholder="familia"
                    name="family"
                    type="text"
                    value={family}
                    onChange={(e) => setFamily(e.target.value)}
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
                className="bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2 p-2 text-white border-solid border-4 border-gray-500"
                name="subfamily"
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

            <div className="flex flex-grow">
              <label className="text-xs text-white font-bolt mb-2  ">
                Glosa
                <div>
                  <input
                    className="bg-slate-700 rounded-lg mb-2 mt-2 flex flex-grow-0 mr-2 p-2 text-white border-solid border-4 border-gray-500"
                    placeholder="glosa"
                    type="text"
                    name="glosa"
                    value={glosa}
                    onChange={(e) => setGlosa(e.target.value)}
                  />
                </div>
              </label>
            </div>
            <label className="text-xs text-white font-bolt mb-2 ">
              Descripcion
              <input
                className="bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2 p-2 text-white border-solid border-4 border-gray-500"
                placeholder="description"
                name="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <label className="text-xs text-white font-bolt mb-2 ">
              Proyectado
              <input
                className="bg-slate-700 rounded-lg mb-2 mt-2 flex mr-2 p-2 text-white border-solid border-4 border-gray-500"
                placeholder="proyectado"
                type="text"
                name="proyectado"
                value={proyectado}
                onChange={(e) => setProyectado(e.target.value)}
              />
            </label>
            <div className="flex justify-between">
              <button
                className="bg-green-500 font-semibold text-xs rounded-lg text-white p-3 mt-2  mb-2"
                type="submit"
              >
                Submit Tasks
              </button>
              <button
                onClick={closeModelContrat}
                className="bg-red-500 rounded-lg text-white text-xs font-semibold p-3 mt-2  mb-2"
              >
                Close Form
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default FormContractObservation;
