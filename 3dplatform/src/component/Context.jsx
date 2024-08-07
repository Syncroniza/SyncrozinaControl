import { createContext, useState, useEffect } from "react";
import axios from "axios";
export const ViewerContext = createContext();

const ViewerProvider = ({ children }) => {
  const [totalSum, setTotalSum] = useState(0);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [filterType, setFilterType] = useState("");
  const [getDataBudget, setGetDataBudget] = useState([]);
  const [totalBudget, setTotalBudget] = useState([]);
  const [filteredProjectId, setFilteredProjectId] = useState("");
  const [isModalOpen, setIsMoldalOpen] = useState(false);
  const [isModalOpenBudget, setIsModalOpenBudget] = useState(false);
  const [getDataSheet, setGetDataSheet] = useState([]);
  const [dataNode, setDataNode] = useState({ nodes: [] });
  const [selectedSubfamily, setSelectedSubfamily] = useState(
    "Elegir Hoja de Control"
  );
  const [data, setData] = useState([]);
  const [acumuladoTotal, setAcumuladoTotal] = useState(0);
  const [selectedFamily, setSelectedFamily] = useState("");
  const [materialSheets, setMaterialSheets] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [date, setDate] = useState("");
  const [acumuladoActualTotal, setAcumuladoActualTotal] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSheetId, setCurrentSheetId] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState({});
  const [invoicesdata, setInvoicesData] = useState([]);
  const [accumatedValue, setAccumatedValue] = useState(0);
  const [family, setFamily] = useState("");
  const [cod, setCod] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [subcontractorOffers, setSubcontractorsOffers] = useState("");
  const [qty, setQty] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [total, setTotal] = useState("");
  const [subfamily, setSubfamily] = useState("");
  const [curentIdInvoices, setCurentIdInvoices] = useState("");
  const [invoices, setInvoices] = useState("");
  const [dateInvoices, setDateInvoices] = useState("");
  const [totalInvoices, setTotalInvoices] = useState("");
  const [invoiceStatus, setInvoiceStatus] = useState("Pendiente");
  const [dueDate, setDueDate] = useState("");
  const [observations, setObservations] = useState("");
  const [totalBySubFamily, setTotalBySubFamily] = useState({});
  const [proyectado, setProyectado] = useState("");
  const [glosa, setGlosa] = useState("");
  const [currentContractId, setCurrentIdContract] = useState("");
  const [
    totalPaidByProjectFamilySubfamily,
    setTotalPaidByProjectFamilySubfamily,
  ] = useState(0);

  const [dataIncreaseDiscount, setDataIncreaseDiscount] = useState([]);
  const [currentIdIncreaseDiscount, setCurrentIdIncreaseDiscount] =
    useState("");
  const [isModalOpenContract, setIsModalOpenContract] = useState("");
  const [totalPurchaseOrders, setTotalPurchaseOrders] = useState(0);
  const [totalByWeek, setTotalByWeek] = useState({});
  const [isModalOpenProgress, setIsModalOpenProgress] = useState(false);
  const [currentProgressId, setCurrentIdProgress] = useState("");
  const [combinedData, setCombinedData] = useState([]);
  const [aernValueAccumalated, setEarnValueAccumulated] = useState([]);
  const [totalPlanValue, setTotalPlanValue] = useState(0);
  const [projectDuration, setProjectDuration] = useState(0);
  const [newtotalbySubFamily, setNewTottalBySubFamily] = useState("");
  const [
    dataincreaseDisccountwthitoutfilter,
    setDataincreaseDisccountwhithoutfilter,
  ] = useState();
  const [contracObservationWhitOutFilter, setContracObservationWhitOutFilter] =
    useState("");
  const [summaryData, setSummaryData] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [totalActualCost, setTotalActualCost] = useState(0);
  const [currentPeriodId, setCurrentPeriodId] = useState("");
  const [accumulatedRealMonthCost, setAccumulatedRealMonthCost] = useState(0);
  const [avanceRealTotal, setAvanceRealTotal] = useState("");
  const [totalUnpaidInvoices, setTotalUnpaidInvoices] = useState(0);
  const [totalsWithAccumulated, setTotalsWithAccumulated] = useState([]);
  const [totalActualCostByWeek, setTotalActualCostByWeek] = useState({});
  const [totalRealMonthCost, setTotalRealMonthCost] = useState(0);
  const [calculateTotalRealMonthCost, setCalculateRealMonthCost] = useState(0);
  const [disponible, setDisponible] = useState(0);
  const [selectedByProjectId, setSelectedByProjectId] = useState("");
  const [selectedRol, setSelectedRol] = useState([]);
  const [porcentajeGastado, setPorcentajeGastado] = useState(0);
  const [monthlyCosts, setMonthlyCosts] = useState([]);
  const [realMonthCostGgpublico, setRealMonthCostGgpublico] = useState(0);
  const [realMonthCostPrivado, setRealMonthCostPrivado] = useState(0);
  const [realMonthCostPublico, setRealMonthCostPublico] = useState(0);
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  const [filters, setFilters] = useState({
    projectId: "",
    cod: "",
    taskName: "",
    unit: "",
    Qty: "",
    unitPrice: "",
    totalPrice: "",
    family: "",
  });

  const updateTotalSum = (newTotal) => {
    if (typeof newTotal === "number" && newTotal >= 0) {
      setTotalSum(newTotal);
    } else {
      console.error("Invalid totalSum: ", newTotal);
    }
  };

  const updateDataProject = (newDataProject) => {
    setProjects(newDataProject);
  };

  const updatefilterType = (newFilterType) => {
    setFilterType(newFilterType);
  };

  const updateOpenModal = (newUpdateOpenModal) => {
    setIsMoldalOpen(newUpdateOpenModal);
  };

  const updateFilters = (newUpdateFilters) => {
    setFilters(newUpdateFilters);
  };

  const updatefilteredProjectId = (newUpdatefilteredProjectId) => {
    setFilteredProjectId(newUpdatefilteredProjectId);
  };

  const updateDataNode = (newUpdaDataNode) => {
    setDataNode(newUpdaDataNode);
  };

  const getTotalProyectado = () => {
    return data.nodes.reduce((total, node) => {
      return total + (Number(node.Proyectado) || 0);
    }, 0);
  };

  const getTotalRecuperable = () => {
    return dataIncreaseDiscount.nodes.reduce((total, node) => {
      return total + (Number(node.Recuperable) || 0);
    }, 0);
  };
  // formato de fecha
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return ""; // Retorna una cadena vacía si no hay fecha
    return isoDate.split("T")[0]; // Extrae y retorna solo la parte de la fecha (YYYY-MM-DD)
  };

  const handleInvoiceSelect = (invoiceId) => {
    setCurentIdInvoices(invoiceId);
  };

  const formatCurrency = (value) => {
    // Formatea el valor como CLP
    const formattedValue = Number(value).toLocaleString("es-Cl", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    });

    // Reemplaza el símbolo de $ por UF
    return formattedValue.replace("$", "$ ");
  };

  const formatedDate = (isoDate) => {
    if (!isoDate) return "Fecha no disponible";
    const date = new Date(isoDate);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // getUTCMonth() devuelve un índice basado en cero (0-11)
    const year = date.getUTCFullYear();
    // Formatea el día y el mes para asegurar que tengan dos dígitos
    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(month).padStart(2, "0");
    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  const openEditForm = (sheet) => {
    console.log("🚀 ~ openEditForm ~ sheet:", sheet);
    // Cargar los datos del registro en los campos del formulario
    setSelectedFamily(sheet.family);
    setProjectId(sheet.projectId);
    setDate(formatDateForInput(sheet.date));
    setCod(sheet.cod);
    setFamily(sheet.family);
    setDescription(sheet.description);
    setUnit(sheet.unit);
    setSubcontractorsOffers(sheet.subcontractorOffers);
    setQty(sheet.qty);
    setUnitPrice(sheet.unitPrice);
    setTotal(sheet.total);
    setSubfamily(sheet.subfamily);
    setIsEditMode(true);
    setCurrentSheetId(sheet._id);
    setIsModalOpenBudget(true);
  };

  const openFormAndCurrentInvloiceId = (invoiceId) => {
    // Encuentra la factura específica por su ID
    const invoiceToEdit = invoicesdata.find(
      (invoice) => invoice._id === invoiceId
    );

    if (invoiceToEdit) {
      setProjectId(invoiceToEdit.projectId);
      setFamily(invoiceToEdit.family);
      setSubfamily(invoiceToEdit.subfamily);
      setInvoices(invoiceToEdit.invoices);
      setDateInvoices(invoiceToEdit.dateInvoices);
      setTotalInvoices(invoiceToEdit.totalInvoices);
      setSubcontractorsOffers(invoiceToEdit.subcontractorOffers);
      setDescription(invoiceToEdit.description);
      setDueDate(formatDateForInput(invoiceToEdit.dueDate));
      setObservations(invoiceToEdit.observations);
      setInvoiceStatus(invoiceToEdit.invoiceStatus);
      setDateInvoices(formatDateForInput(invoiceToEdit.dateInvoices));
      setIsEditMode(true); // Indica que el formulario se abre en modo edición
      setCurentIdInvoices(invoiceToEdit._id); // Guarda la ID actual de la factura que se está editando
      setIsModalOpenBudget(true); // Abre el modal del formulario
    }
  };

  return (
    <ViewerContext.Provider
      value={{
        updateTotalSum,
        totalSum,
        setTotalSum,
        projects,
        setProjects,
        updateDataProject,
        selectedProject,
        setSelectedProject,
        selectedProjectId,
        setSelectedProjectId,
        formatedDate,
        filterType,
        setFilterType,
        updatefilterType,
        isModalOpen,
        setIsMoldalOpen,
        updateOpenModal,
        setGetDataBudget,
        getDataBudget,
        filters,
        updateFilters,
        setFilters,
        setTotalBudget,
        totalBudget,
        updatefilteredProjectId,
        setFilteredProjectId,
        filteredProjectId,
        setIsModalOpenBudget,
        isModalOpenBudget,
        getDataSheet,
        dataNode,
        setDataNode,
        updateDataNode,
        selectedSubfamily,
        setSelectedSubfamily,
        getTotalProyectado,
        data,
        setData,
        getTotalRecuperable,
        dataIncreaseDiscount,
        setDataIncreaseDiscount,
        acumuladoTotal,
        setAcumuladoTotal,
        selectedFamily,
        setSelectedFamily,
        materialSheets,
        setMaterialSheets,
        acumuladoActualTotal,
        setAcumuladoActualTotal,
        projectId,
        setProjectId,
        date,
        setDate,
        isEditMode,
        setIsEditMode,
        currentSheetId,
        setCurrentSheetId,
        formSubmitted,
        setFormSubmitted,
        invoicesdata,
        setInvoicesData,
        accumatedValue,
        setAccumatedValue,
        openEditForm,
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
        curentIdInvoices,
        setCurentIdInvoices,
        handleInvoiceSelect,
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
        openFormAndCurrentInvloiceId,
        formatCurrency,
        totalBySubFamily,
        setTotalBySubFamily,
        glosa,
        setGlosa,
        proyectado,
        setProyectado,
        currentContractId,
        setCurrentIdContract,
        totalPaidByProjectFamilySubfamily,
        setTotalPaidByProjectFamilySubfamily,
        currentIdIncreaseDiscount,
        setCurrentIdIncreaseDiscount,
        isModalOpenContract,
        setIsModalOpenContract,
        totalPurchaseOrders,
        setTotalPurchaseOrders,
        totalByWeek,
        setTotalByWeek,
        isModalOpenProgress,
        setIsModalOpenProgress,
        currentProgressId,
        setCurrentIdProgress,
        combinedData,
        setCombinedData,
        aernValueAccumalated,
        setEarnValueAccumulated,
        totalPlanValue,
        setTotalPlanValue,
        projectDuration,
        setProjectDuration,
        newtotalbySubFamily,
        setNewTottalBySubFamily,
        dataincreaseDisccountwthitoutfilter,
        setDataincreaseDisccountwhithoutfilter,
        contracObservationWhitOutFilter,
        setContracObservationWhitOutFilter,
        summaryData,
        setSummaryData,
        grandTotal,
        setGrandTotal,
        currentPeriodId,
        setCurrentPeriodId,
        accumulatedRealMonthCost,
        setAccumulatedRealMonthCost,
        avanceRealTotal,
        setAvanceRealTotal,
        totalUnpaidInvoices,
        setTotalUnpaidInvoices,
        totalsWithAccumulated,
        setTotalsWithAccumulated,
        totalActualCostByWeek,
        setTotalActualCostByWeek,
        totalActualCost,
        setTotalActualCost,
        totalRealMonthCost,
        setTotalRealMonthCost,
        calculateTotalRealMonthCost,
        setCalculateRealMonthCost,
        disponible,
        setDisponible,
        selectedByProjectId,
        setSelectedByProjectId,
        selectedRol,
        setSelectedRol,
        porcentajeGastado,
        setPorcentajeGastado,
        monthlyCosts,
        setMonthlyCosts,
        realMonthCostGgpublico,
        setRealMonthCostGgpublico,
        realMonthCostPrivado,
        setRealMonthCostPrivado,
        realMonthCostPublico,
        setRealMonthCostPublico,
        filteredInvoices,
        setFilteredInvoices,
      }}
    >
      {children}
    </ViewerContext.Provider>
  );
};

export default ViewerProvider;
