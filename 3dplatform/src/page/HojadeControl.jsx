import React, { useState } from "react";
import Sidebardb from "../component/dashboard/Sidebardb";
import MaterialSheetsControl from "../component/tables/MaterialSheetsControl";
import IdentificationHeader from "../component/tables/IdentificationHeader";
import CarsInformationSheets from "../component/tables/CarsInformationSheets";
import Invoices from "../component/tables/Invoices";
import PurchaseOrderTable from "../component/tables/PurchaseOrderTable";
import ContractObservationByForm from "../component/tables/ContractObservationByForm";
import IncreaseAndDiscountByForm from "../component/tables/IncreaseAndDiscountByForm";
import NNCC from "../component/tables/TableNNCC.jsx";

const HojadeControl = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <div>
      <div className="flex bg-gradient-to-r from-blue-500 top-0 left-1 right-0 z-10 shadow-md">
        <Sidebardb />
        <div key={refreshKey}>
          <button
            onClick={handleRefresh}
            className="bg-blue-500 text-white p-2 ml-4 rounded mt-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="size-4"
              className="h-4 w-4"
            >
              <path
                fill-rule="evenodd"
                d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.932.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-1.242l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.241l-.84-.84v1.371a.75.75 0 0 1-1.5 0V9.591a.75.75 0 0 1 .75-.75H5.35a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.932.75.75 0 0 1 1.025-.273Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <MaterialSheetsControl />
          <IdentificationHeader />
          <CarsInformationSheets />
          <ContractObservationByForm />
          <IncreaseAndDiscountByForm />
          <Invoices />
          <NNCC />
          <PurchaseOrderTable />
        </div>
      </div>
    </div>
  );
};

export default HojadeControl;
