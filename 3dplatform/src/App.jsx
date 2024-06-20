

import ControlSheet from "./page/ControlSheet";
import LaborCostControl from "./page/LaborCostControl";
import ViewerProvider from "./component/Context";
import HojadeControl from "./page/HojadeControl";
import InvicesMasterTable from "./component/tables/InvicesMasterTable";
import MainPurchaseOrdes from "./page/MainPurchaseOrdes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PayApplication from "./page/PayApplication";
import Informegerencial from "./page/Informegerencial";
import MainAreaChart from "./component/charts/AreaChart";
import ReportControlSheet from "./component/sheetcontrol/ReportControlSheet";
import MonthCostaLaborTable from "./component/tables/MonthCostaLaborTable";
import EarnValeuManagementTable from "./component/tables/EarnValeuManagementTable";

function App() {
  return (
    <BrowserRouter>
      <ViewerProvider>
        <Routes>
          <Route
            path="/ifcviewer"
            element={
              <div className="flex h-min-screen">
               
              
              </div>
            }
          />

          <Route path="/" element={<ControlSheet />} />
          <Route path="/Manodeobra" element={<LaborCostControl />} />
          <Route path="/hojadecontrol" element={<HojadeControl />} />
          <Route path="/masterfacturas" element={<InvicesMasterTable />} />
          <Route path="/oc" element={<MainPurchaseOrdes />} />
          <Route path="/eepp" element={<PayApplication />} />
          <Route path="/informe" element={<Informegerencial />} />
          <Route path="/informe/informeHC" element={<ReportControlSheet />} />
          <Route path="/informe/informeMO" element={<MonthCostaLaborTable />} />
          <Route path="/informe/EV" element={<EarnValeuManagementTable />} />
          <Route path="/progress" element={<MainAreaChart />} />
        </Routes>
      </ViewerProvider>
    </BrowserRouter>
  );
}

export default App;
