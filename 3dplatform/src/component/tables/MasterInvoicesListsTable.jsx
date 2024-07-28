import React from "react";
import Sidebardb from "../dashboard/Sidebardb";
import TableInvoices from "./TableInvoices";
import CardsTotalInvoicesInformation from "../Cards/CardsTotalInvoicesInformation";

function MasterInvoicesListsTable() {
  return (
    <div className="flex bg-gradient-to-r from-blue-500  ">
      <Sidebardb />
      <div className="bg-white mt-6 rounded-lg">
      <h1 className="text-lg text-center font-semibold mt-2">
          MAESTRO DE FACTURAS
        </h1>
        <CardsTotalInvoicesInformation />
        <TableInvoices />
      </div>
    </div>
  );
}

export default MasterInvoicesListsTable;
