import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ControlSheet from "./page/ControlSheet";
import LaborCostControl from "./page/LaborCostControl";
import ViewerProvider from "./component/Context";
import HojadeControl from "./page/HojadeControl";
import InvicesMasterTable from "./component/tables/InvicesMasterTable";
import MainPurchaseOrdes from "./page/MainPurchaseOrdes";
import Informegerencial from "./page/Informegerencial";
import ReportControlSheet from "./component/sheetcontrol/ReportControlSheet";
import MonthCostaLaborTable from "./component/tables/MonthCostaLaborTable";
import EarnValeuManagementTable from "./component/tables/EarnValeuManagementTable";

function App() {
  return (
      <BrowserRouter>
        <ViewerProvider>
          <Routes>
            <Route path="/ifcviewer" element={<div className="flex h-min-screen"></div>} />
            <Route path="/" element={<ControlSheet />} />
            <Route path="/Manodeobra" element={<LaborCostControl />} />
            <Route path="/hojadecontrol" element={<HojadeControl />} />
            <Route path="/masterfacturas" element={<InvicesMasterTable />} />
            <Route path="/oc" element={<MainPurchaseOrdes />} />
            <Route path="/informe" element={<Informegerencial />} />
            <Route path="/informe/informeHC" element={<ReportControlSheet />} />
            <Route path="/informe/informeMO" element={<MonthCostaLaborTable />} />
            <Route path="/informe/EV" element={<EarnValeuManagementTable />} />
          </Routes>
        </ViewerProvider>
      </BrowserRouter>
  );
}

export default App;
