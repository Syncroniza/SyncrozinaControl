import Sidebardb from "../component/dashboard/Sidebardb";
import ControlSheet from "../component/sheetcontrol/ControlSheet";
import BudgetAvailable from "../component/project/BudgetAvailable";
import ProjectInformation from "../component/project/ProjectInformation";
import DataControlSheet from "../component/sheetcontrol/DataControlSheet";
import KpiByFamily from "../component/project/KpiByFamily";
import InvicesMasterTable from "../component/tables/InvicesMasterTable";
import MonthCostaLaborTable from "../component/tables/MonthCostaLaborTable";
import CostLaborControlTable from "../component/tables/CostLaborControlTable";
import LaborDashboard from "../component/sheetcontrol/LaborDashboard";
import ActualCostTable from "../component/tables/ActualCostTable";
import HojasdeControl from "../page/HojadeControl";
const ControlSheetMain = () => {
  return (
    <div className="flex bg-gradient-to-r from-blue-500 mb-4 ">
      <div className="flex">
        <Sidebardb />
      </div>
      <div>
        <ControlSheet />
        <ProjectInformation />
        <BudgetAvailable />
        <KpiByFamily />
        <div className="mt-4 ml-2"></div>
      </div>
      <DataControlSheet />
      <div style={{ display: "none" }}>
        <InvicesMasterTable />
      </div>
      <div style={{ display: "none" }}>
        <CostLaborControlTable />
        <MonthCostaLaborTable />
        <LaborDashboard />
      </div>
      <div style={{display:"none"}}>
        <ActualCostTable />
        <HojasdeControl />
      </div>
    </div>
  );
};

export default ControlSheetMain;
