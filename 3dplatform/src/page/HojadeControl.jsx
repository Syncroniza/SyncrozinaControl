import Sidebardb from "../component/dashboard/Sidebardb";
import MaterialSheetsControl from "../component/tables/MaterialSheetsControl";
import IdentificationHeader from "../component/tables/IdentificationHeader";
import CarsInformationSheets from "../component/tables/CarsInformationSheets";
import Invoices from "../component/tables/Invoices";
import PurchaseOrderTable from "../component/tables/PurchaseOrderTable";
import ContractObservationByForm from "../component/tables/ContractObservationByForm";
import IncreaseAndDiscountByForm from "../component/tables/IncreaseAndDiscountByForm";
import AlertInvoicePurchaseOrder from "../component/alert/AlertInvoicePurchaseOrder";

const HojadeControl = () => {
  return (
    <div className="flex bg-gradient-to-r from-blue-700 py-4 w-600 md:w-3/4 xl:w-full">
      <Sidebardb />
      <div>
        <MaterialSheetsControl />
        <IdentificationHeader />
        <div>
        <CarsInformationSheets />
        </div>
        <AlertInvoicePurchaseOrder />
        <div>
          <ContractObservationByForm />
        </div>
          <IncreaseAndDiscountByForm />
        <Invoices />
        <PurchaseOrderTable />
      </div>
    </div>
  );
};

export default HojadeControl;
