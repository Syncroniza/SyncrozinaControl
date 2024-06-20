import { useContext, useEffect, useState } from "react";
import { ViewerContext } from "../Context";

// Función para generar semanas dinámicamente
const generateWeeksData = (startDate, totalWeeks) => {
  const weeksData = [];
  let currentDate = new Date(startDate);

  for (let i = 1; i <= totalWeeks; i++) {
    const weekStartDate = new Date(currentDate);
    const weekEndDate = new Date(currentDate);
    weekEndDate.setDate(weekEndDate.getDate() + 4); // Una semana laboral de 5 días (lunes a viernes)

    const week = {
      week: i,
      dateStart: formatDate(weekStartDate),
      finishDate: formatDate(weekEndDate),
    };

    weeksData.push(week);

    // Avanzar a la próxima semana (lunes siguiente)
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return weeksData;
};

// Formatear fecha en "dd-mm-yyyy"
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Mapear fechas a meses
const getMonthYearFromDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${parseInt(month)}-${year}`;
};

const mapLaborCostsToWeeks = (laborCosts, weeksData) => {
  const weeklyCosts = {};

  // Determinar la última semana de cada mes
  const lastWeekOfMonth = {};
  weeksData.forEach(({ week, finishDate }) => {
    const monthYear = getMonthYearFromDate(finishDate);
    lastWeekOfMonth[monthYear] = week;
  });

  // Asignar los costos de mano de obra a la última semana del mes
  for (const monthYear in laborCosts) {
    const week = lastWeekOfMonth[monthYear];
    if (week) {
      if (!weeklyCosts[week]) {
        weeklyCosts[week] = 0;
      }
      weeklyCosts[week] += laborCosts[monthYear];
    } else {
      console.log(`No se encontró una semana para el mes ${monthYear}`);
    }
  }

  return weeklyCosts;
};

function ActualCostTable() {
  const {
    invoicesdata,
    setTotalByWeek,
    formatCurrency,
    totalsWithAccumulated,
    totalActualCost,
    setTotalActualCost,
    totalActualCostByWeek,
    setTotalActualCostByWeek,
  } = useContext(ViewerContext);

  const [totalByWeek, setTotalByWeekState] = useState({});
  const [weeklyLaborCosts, setWeeklyLaborCosts] = useState({});
  

  // Calcular la suma total de las facturas por semana
  const calculateTotalByWeek = () => {
    const invoicesByWeek = {};

    invoicesdata.forEach((invoice) => {
      const invoiceDate = new Date(invoice.dateInvoices);
      if (!isNaN(invoiceDate)) {
        const projectWeekNumber = getProjectWeekNumber(invoiceDate);

        if (!invoicesByWeek[projectWeekNumber]) {
          invoicesByWeek[projectWeekNumber] = 0;
        }

        invoicesByWeek[projectWeekNumber] += invoice.totalInvoices;
      } else {
        console.error("Fecha inválida en factura:", invoice.dateInvoices);
      }
    });

    return invoicesByWeek;
  };

  // Obtener el número de semana del proyecto a partir de una fecha
  const getProjectWeekNumber = (date) => {
    const projectStartDate = new Date("2023-06-06"); // Fecha de inicio del proyecto
    const diffInTime = date - projectStartDate;
    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffInDays / 7) + 1;
  };

  // Calcular los costos mensuales acumulados de la mano de obra
  const calculateMonthlyLaborCosts = () => {
    const monthlyCosts = {};

    totalsWithAccumulated
      .filter((item) => item.projectId === "PT-101")
      .forEach((item) => {
        const [month, year] = item.period.split("-");
        const periodKey = `${parseInt(month)}-${year}`;
        if (!monthlyCosts[periodKey]) {
          monthlyCosts[periodKey] = 0;
        }
        monthlyCosts[periodKey] += item.realmonthcost;
      });

    return monthlyCosts;
  };

  // Calcular el costo total actual por semana
  const calculateTotalActualCostByWeek = (totalByWeek, weeklyLaborCosts) => {
    const totalCostByWeek = { ...totalByWeek };

    for (const week in weeklyLaborCosts) {
      if (!totalCostByWeek[week]) {
        totalCostByWeek[week] = 0;
      }
      totalCostByWeek[week] += weeklyLaborCosts[week];
    }

    return totalCostByWeek;
  };

  // Calcular el total de totalActualCostByWeek
  const calculateTotalCost = (totalActualCostByWeek) => {
    return Object.values(totalActualCostByWeek).reduce(
      (acc, cost) => acc + cost,
      0
    );
  };

  // Actualizar el estado totalWeekly con la suma por semana y agregar el costo de la mano de obra mensual
  useEffect(() => {
    const weeksData = generateWeeksData("2023-06-06", 84); // Generar 84 semanas a partir de la fecha de inicio del proyecto
    console.log("Datos de semanas generados:", weeksData);

    const totalByWeek = calculateTotalByWeek();
    setTotalByWeek(totalByWeek);
    setTotalByWeekState(totalByWeek);
    console.log("Total por semana:", totalByWeek);

    const monthlyLaborCosts = calculateMonthlyLaborCosts();
    console.log("Costos mensuales de mano de obra:", monthlyLaborCosts);
    const weeklyLaborCosts = mapLaborCostsToWeeks(monthlyLaborCosts, weeksData);
    setWeeklyLaborCosts(weeklyLaborCosts);
    console.log("Costos semanales de mano de obra:", weeklyLaborCosts);

    const totalActualCostByWeek = calculateTotalActualCostByWeek(
      totalByWeek,
      weeklyLaborCosts
    );
    setTotalActualCostByWeek(totalActualCostByWeek);
    console.log("Costo total actual por semana:", totalActualCostByWeek);

    const totalCost = calculateTotalCost(totalActualCostByWeek);
    setTotalActualCost(totalCost);
    console.log("Costo total actual:", totalCost);
  }, [invoicesdata, totalsWithAccumulated]);

  return (
    <div className="ml-5 mt-10">
      {/* <div>
        <h1>Total Facturado por Semana:</h1>
        <ul>
          {Object.keys(totalByWeek).map((weekNumber, index) => (
            <li key={index}>
              Semana {weekNumber}: {formatCurrency(totalByWeek[weekNumber])}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h1>Costo Total Actual por Semana:</h1>
        <ul>
          {Object.keys(totalActualCostByWeek).map((weekNumber, index) => (
            <li key={index}>
              Semana {weekNumber}:{" "}
              {formatCurrency(totalActualCostByWeek[weekNumber])}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-5">
        <h1>Total Costo Actual:</h1>
        <div className="bg-gray-200 p-4 rounded-lg shadow-md">
          {formatCurrency(totalActualCost)}
        </div>
      </div> */}
    </div>
  );
}

export default ActualCostTable;
