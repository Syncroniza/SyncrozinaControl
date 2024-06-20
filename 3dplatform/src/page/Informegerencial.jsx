import Sidebardb from "../component/dashboard/Sidebardb";
import CarsInformationGeneralProgress from "../component/tables/CarsInformationGeneralProgress";
import EarnValeuManagementTable from "../component/tables/EarnValeuManagementTable";
import { Link, Outlet } from "react-router-dom";
import MainAreaChart from "../component/charts/AreaChart";

function Informegerencial() {
  return (
    <div className="flex justify-around bg-gradient-to-r from-blue-500 py-4">
      <Sidebardb />
      <div>
        <div className="flex justify-around">
          <Link to={"/informe/informeHC"}>
            <h1 className="justify-center ml-6 mt-6 bg-blue-500 bg-gradient-to-r from-indigo-500 rounded-lg p-4 text-white text-sm ">
              INFORME HOJAS DE CONTROL
            </h1>
          </Link>
          <Link to={"/informe/informeMO"}>
            <h1 className="flex justify-center ml-6 mt-6 bg-blue-500 bg-gradient-to-r from-indigo-500 rounded-lg p-4 text-white text-sm">
              INFORME MANO DE OBRA
            </h1>
          </Link>
          <Link to={"/informe/EV"}>
            <h1 className="flex justify-center ml-6 mt-6 bg-blue-500  bg-gradient-to-r from-indigo-500 rounded-lg p-4 text-white text-sm">
              VALOR GANADO
            </h1>
          </Link>
          {/* <Link to={"/informe/estadoResultado"}>
            <h1 className="flex justify-center ml-6 mt-6 bg-blue-500  bg-gradient-to-r from-indigo-500 rounded-lg p-2 text-white text-sm">
              ESTADO RESULTADO
            </h1>
          </Link>
          <Link to={"/informe/dispobible"}>
            <h1 className="flex justify-center ml-6 mt-6 mr-2 bg-blue-500 bg-gradient-to-r from-indigo-500 rounded-lg p-2 text-white text-sm">
              DISPONIBLE
            </h1>
          </Link> */}
        </div>
        <Outlet />

        <CarsInformationGeneralProgress />
        <MainAreaChart />

        
      </div>
    </div>
  );
}

export default Informegerencial;
