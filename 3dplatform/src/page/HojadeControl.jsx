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
    <div>
      <div>
        <div className=" flex bg-blue-500  top-0 left-1 right-0 z-10 shadow-md">
          <Sidebardb />
          <div>
              <MaterialSheetsControl />
              <IdentificationHeader />
              <CarsInformationSheets />
              <ContractObservationByForm />
              <IncreaseAndDiscountByForm />
              <Invoices />
              <PurchaseOrderTable />
          </div>
        </div>
          <div className="mt-30 overflow-auto">
            <div className="pt-40">
            </div>
            <AlertInvoicePurchaseOrder />
          </div>
        </div>
      </div>
  );
};

export default HojadeControl;