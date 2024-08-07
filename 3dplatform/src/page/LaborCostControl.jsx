import Sidebardb from "../component/dashboard/Sidebardb";
import CostLaborControlTable from "../component/tables/CostLaborControlTable";
import MonthCostaLaborTable from "../component/tables/MonthCostaLaborTable";
import LaborDashboard from "../component/sheetcontrol/LaborDashboard";

const LaborCostControl = () => {
  return (
    <div>
      <div className="flex bg-gradient-to-r from-blue-500 ">
        <Sidebardb />
        <LaborDashboard />
        {/* MOnthCostlaborTable depende Costlaborcontroltable ya que tiene el post y get si se borra no renderiza MonthscostLabor ... channn */}
        <CostLaborControlTable />
      </div>
      <div style={{ display:"none"}}>
        <MonthCostaLaborTable />
      </div>
    </div>
  );
};

export default LaborCostControl;
