import { useContext, useEffect, useState } from "react";
import CardsInformationLaborCost from "./CardsInformationLaborCost";
import { ViewerContext } from "../Context";
import LaborCostTable from "./LaborCostTable";
import LaborCostChart from "../charts/LaborCostChart";
import Sidebardb from "../dashboard/Sidebardb";
import Exceltransform from "../Exceltransform";

const MonthCostaLaborTable = () => {
  const {
    dataNode,
    projects,
    totalsWithAccumulated,
    setTotalsWithAccumulated,
    setDisponible,
    setTotalRealMonthCost,
    setCalculateRealMonthCost,
    selectedByProjectId,
    selectedRol,
    setPorcentajeGastado,
    monthlyCosts,
    setMonthlyCosts,
  } = useContext(ViewerContext);

  const [combinedData, setCombinedData] = useState([]);
  const [filteredTotals, setFilteredTotals] = useState([]);

  useEffect(() => {
    let filteredSheets = projects
      .flatMap((project) => project.sheets)
      .filter(
        (sheet) =>
          sheet.family === "Mano_Obra" &&
          (!selectedByProjectId || sheet.projectId === selectedByProjectId)
      );

    const manoobraData = filteredSheets.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const groupedByMonth = manoobraData.reduce((acc, sheet) => {
      const monthYear = `${new Date(sheet.date).getMonth() + 1}-${new Date(sheet.date).getFullYear()}`;
      if (!acc[monthYear]) {
        acc[monthYear] = {
          realCost: 0,
          plannedCost: 0,
          accumulatedReal: 0,
          difference: 0
        };
      }
      acc[monthYear].realCost += sheet.total;
      acc[monthYear].plannedCost += sheet.plannedCost;
      acc[monthYear].difference = acc[monthYear].plannedCost - acc[monthYear].realCost;
      return acc;
    }, {});

    let acumuladoDiferencia = 0;
    const monthlyData = Object.entries(groupedByMonth)
      .sort((a, b) => new Date(`01-${a[0]}`) - new Date(`01-${b[0]}`))
      .map(([monthYear, data]) => {
        acumuladoDiferencia += data.difference || 0;
        return {
          monthYear,
          realCost: data.realCost,
          plannedCost: data.plannedCost,
          difference: data.difference,
          accumulatedDifference: acumuladoDiferencia
        };
      });

    setMonthlyCosts(monthlyData);
  }, [projects, selectedByProjectId]);

  useEffect(() => {
    const filteredTotals = totalsWithAccumulated.filter((item) =>
      selectedRol.length ? selectedRol.some((rol) => rol.value === item.rol) : true
    );

    let acumuladoReal = 0;
    filteredTotals.forEach((item) => {
      acumuladoReal += item.realmonthcost || 0;
      item.realAccumulated = acumuladoReal;
    });

    let acumuladoPlanificado = 0;
    filteredTotals.forEach((item) => {
      acumuladoPlanificado += item.totalLabor || 0;
      item.accumulated = acumuladoPlanificado;
    });

    setFilteredTotals(filteredTotals);
  }, [totalsWithAccumulated, selectedRol]);

  useEffect(() => {
    const filteredTotals = totalsWithAccumulated.filter((item) =>
      selectedRol.length ? selectedRol.some((rol) => rol.value === item.rol) : true
    );

    const totalRealCost = filteredTotals.reduce(
      (acc, item) => acc + (Number(item.totalLabor) || 0),
      0
    );

    const calculateTotalRealMonthCost = filteredTotals.reduce(
      (acc, item) => acc + (Number(item.realmonthcost) || 0),
      0
    );

    setCalculateRealMonthCost(calculateTotalRealMonthCost);

    const disponible = totalRealCost - calculateTotalRealMonthCost;
    setDisponible(disponible);

    const porcentajeGastado = totalRealCost > 0 ? (calculateTotalRealMonthCost / totalRealCost) * 100 : 0;
    setPorcentajeGastado(porcentajeGastado);

    setTotalRealMonthCost(totalRealCost);
  }, [totalsWithAccumulated, selectedRol]);

  useEffect(() => {
    const groupedData = dataNode.nodes.reduce((acc, item) => {
      const { projectId, rol } = item;
      const period = `${new Date(item.deadline).getMonth() + 1}-${new Date(item.deadline).getFullYear()}`;

      if (!acc[projectId]) {
        acc[projectId] = {};
      }
      if (!acc[projectId][period]) {
        acc[projectId][period] = {};
      }
      if (!acc[projectId][period][rol]) {
        acc[projectId][period][rol] = {
          totalLabor: 0,
          realmonthcost: 0,
          items: [],
        };
      }

      acc[projectId][period][rol].totalLabor += Number(item.total || 0);
      acc[projectId][period][rol].realmonthcost += Number(item.realmonthcost || 0);
      acc[projectId][period][rol].items.push(item);

      return acc;
    }, {});

    const totalsWithAccumulated = [];

    Object.keys(groupedData).forEach((projectId) => {
      Object.keys(groupedData[projectId]).forEach((period) => {
        Object.keys(groupedData[projectId][period]).forEach((rol) => {
          const data = groupedData[projectId][period][rol];
          totalsWithAccumulated.push({
            projectId,
            period,
            rol,
            totalLabor: data.totalLabor,
            realmonthcost: data.realmonthcost,
            items: data.items,
          });
        });
      });
    });

    totalsWithAccumulated.sort((a, b) => new Date(`01-${a.period}`) - new Date(`01-${b.period}`));

    let acumuladoReal = 0;
    totalsWithAccumulated.forEach((item) => {
      acumuladoReal += item.realmonthcost || 0;
      item.realAccumulated = acumuladoReal;
    });

    let acumuladoPlaificado = 0;
    totalsWithAccumulated.forEach((item) => {
      acumuladoPlaificado += item.totalLabor || 0;
      item.accumulated = acumuladoPlaificado;
    });

    setTotalsWithAccumulated(totalsWithAccumulated);
  }, [dataNode, selectedByProjectId]);

  useEffect(() => {
    const filteredTotalsWithAccumulated = totalsWithAccumulated.filter(
      (item) => item.projectId === selectedByProjectId
    );

    const newCombinedData = filteredTotalsWithAccumulated.map((twaItem) => {
      const monthlyCostItem = monthlyCosts.find(
        (mcItem) => mcItem.monthYear === twaItem.period
      );
      return {
        month: twaItem.period,
        projectedAccumulated: twaItem.accumulated,
        realAccumulated: monthlyCostItem ? monthlyCostItem.accumulatedDifference : 0,
      };
    });

    setCombinedData(newCombinedData);
  }, [totalsWithAccumulated, monthlyCosts, selectedByProjectId]);

  const projectIds = projects.map((project) => project.projectId);

  return (
    <div className="p-2 py-2 flex bg-blue-500 ">
      <Sidebardb /> 
      <div className="ml-20">
        <CardsInformationLaborCost />
        <LaborCostTable totals={filteredTotals} />
        {/* <LaborCostChart /> */}
      </div>
      <div className="p-4">
        <div className="mt-4 ml-4"></div>
      </div>
    </div>
  );
};

export default MonthCostaLaborTable;
