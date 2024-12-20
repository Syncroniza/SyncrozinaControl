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
import InvoicesReport from "./component/sheetcontrol/InvoicesReport";
import MasterInvoicesListsTable from "./component/tables/MasterInvoicesListsTable";
import LoginPage from "./page/Login.jsx";
import NNCCPage from "./page/NNCC.jsx";

function App() {
  return (
    <BrowserRouter>
      <ViewerProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<ControlSheet />} />
          <Route
            path="/ifcviewer"
            element={<div className="flex h-min-screen"></div>}
          />
          <Route path="/masternncc" element={<NNCCPage />} />
          <Route path="/Manodeobra" element={<LaborCostControl />} />
          <Route path="/hojadecontrol" element={<HojadeControl />} />
          <Route path="/masterfacturas" element={<InvicesMasterTable />} />
          <Route path="/oc" element={<MainPurchaseOrdes />} />
          <Route path="/informe" element={<Informegerencial />} />
          <Route path="/informe/informeHC" element={<ReportControlSheet />} />
          <Route path="/informe/informeMO" element={<MonthCostaLaborTable />} />
          <Route path="/informe/EV" element={<EarnValeuManagementTable />} />
          <Route
            path="/informe/Facturas"
            element={<InvoicesReport />}
          />
          <Route
            path="/informe/InvoicesReport/listadofacturas"
            element={<MasterInvoicesListsTable />}
          />
        </Routes>
      </ViewerProvider>
    </BrowserRouter>
  );
}

export default App;
