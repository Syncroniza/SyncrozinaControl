import { useContext, useEffect, useState } from "react";
import { ViewerContext } from "../Context";

const CarsInformationSheets = () => {
  const {
    selectedFamily,
    selectedSubfamily,
    formatCurrency,
    getDataBudget,
    selectedProjectId,
    dataIncreaseDiscount,
    data,
    totalPaidByProjectFamilySubfamily,
    newtotalbySubFamily,
    setNewTottalBySubFamily,
  } = useContext(ViewerContext);
  

  // se genero una nueva forma de calcular el total por subfamily
  const [totalTodosContratos, setTotalTodosContratos] = useState(0);
  console.log("🚀 ~ CarsInformationSheets ~ totalTodosContratos:", totalTodosContratos);
 

  useEffect(() => {
    const filteredData = getDataBudget.filter((item) => {
      const matchesProject =
        !selectedProjectId || item.projectId === selectedProjectId;
      const matchesFamily = !selectedFamily || item.family === selectedFamily;
      const matchesSubfamily =
        !selectedSubfamily || item.subfamily === selectedSubfamily;
      return matchesProject && matchesFamily && matchesSubfamily;
    });

    const newTotalBySubFamily = filteredData.reduce((acc, item) => {
      const key = item.subfamily;
      if (!acc[key]) acc[key] = 0;
      acc[key] += item.totalPrice; // Asume que totalPrice es el campo relevante
      return acc;
    }, {});

    setNewTottalBySubFamily(newTotalBySubFamily);
  }, [getDataBudget, selectedProjectId, selectedFamily, selectedSubfamily]); // Incluye selectedProjectId aquí

  const newGetTotalRecuperableFiltered = () => {
    return dataIncreaseDiscount.reduce((total, item) => {
      const matchesProject =
        !selectedProjectId || item.projectId === selectedProjectId;
      const matchesFamily = !selectedFamily || item.family === selectedFamily;
      const matchesSubfamily =
        !selectedSubfamily || item.subfamily === selectedSubfamily;

      if (matchesProject && matchesFamily && matchesSubfamily) {
        return total + (Number(item.Recuperable) || 0);
      }
      return total;
    }, 0);
  };
  

  const getTotalMontoContrato = () => {
    // Realizar el cálculo del total de los montos de contrato
    return data.reduce((total, item) => {
      console.log("🚀 ~ returndata.reduce ~ data:", data);
      const matchesProject = !selectedProjectId || item.projectId === selectedProjectId;
      const matchesFamily = !selectedFamily || item.family === selectedFamily;
      const matchesSubFamily = !selectedSubfamily || item.subfamily === selectedSubfamily;
      if (matchesProject && matchesFamily && matchesSubFamily) {
        return total + (Number(item.Proyectado) || 0);
      }
      return total;
    }, 0);
  };
  useEffect(() => {
    // Realizar el cálculo del total de los montos de contrato
    const total = data.reduce((total, item) => {
      return total + (Number(item.Proyectado) || 0);
    }, 0);
    setTotalTodosContratos(total);
  }, [data]); // Se actualiza cada vez que cambia 'data'



  const cardStylePositive = {
    backgroundColor: "green", // Fondo verde para valores positivos o cero
    color: "white", // Texto blanco para mejorar la legibilidad
  };

  const cardStyleNegative = {
    backgroundColor: "red", // Fondo rojo para valores negativos
    color: "white", // Texto blanco para mejorar la legibilidad
  };

  // calcula los valores de las distintas tarjetas
  const montoPropuesta = Object.values(newtotalbySubFamily).reduce(
    (total, current) => total + current,
    0
  );
  const recuperable = newGetTotalRecuperableFiltered();
  const montoContrato = getTotalMontoContrato();
 
  

  const totalconextras = montoPropuesta + newGetTotalRecuperableFiltered();
  const ahorro = totalconextras - montoContrato;
  const porpagar = montoContrato - totalPaidByProjectFamilySubfamily;

  const baseStyle = {
    margintop: "0px",
    marginright:"0px",
    marginBottom:"0px",
    padding: "30px",
    color: "white",
    fontSize:"0px",
    borderRadius: "15px",
  };

  return (
    <div>
      <div className="bg-white mt-2 ml-3 mr-2 grid grid-cols-7 rounded-lg shadow-lg py-5 px-10">
        <div className="bg-blue-500  bg-gradient-to-r from-indigo-500 rounded-xl text-white text-center shadow-xl mx-2 p-2">
          <h1 className="text-sm font-light  text-white m-2 ">MONTO PROPUESTA</h1>
          <div>
            {Object.entries(newtotalbySubFamily).map(
              ([subfamily, totalProyectado]) => (
                <div key={subfamily}>
                  <h2 className="text-lg font-semibold">
                    $
                    {totalProyectado.toLocaleString("es-CL", {
                      minimumFractionDigits: 0,

                      maximumFractionDigits: 0,
                    })}
                  </h2>
                </div>
              )
            )}
          </div>
        </div>
        <div className="bg-blue-500  bg-gradient-to-r from-indigo-500 rounded-xl text-center shadow-xl mx-2 py-2 ">
          <h1 className="text-sm font-light text-white mt-1">MONTO CONTRATO</h1>
          <h1 className="text-lg font-semibold  text-white mt-4">
            {formatCurrency(montoContrato)}{" "}
          </h1>
        </div>

        <div className="bg-blue-500  bg-gradient-to-r from-indigo-500 rounded-xl text-center shadow-xl mx-2 p-2">
          <h1 className="text-sm font-light text-white mt-1">RECUPERABLE</h1>
          <h1 className="text-lg font-semibold  text-white mt-4">
            {formatCurrency(recuperable)}
          </h1>
        </div>
        <div className="bg-blue-500  bg-gradient-to-r from-indigo-500 rounded-xl text-center shadow-xl mx-2 p-2">
          <h1 className="text-sm font-light text-white mt-1">TOTAL CON EXTRAS</h1>
          <h1 className="text-lg font-semibold  text-white mt-4">
            {formatCurrency(totalconextras)}
          </h1>
        </div>

        <div className=" shadow-xl">
          <div className="">
            <div
              style={{
                ...baseStyle, // Aplicamos primero el estilo base
                ...(ahorro >= 0 ? cardStylePositive : cardStyleNegative), // Luego sobreescribimos con el estilo condicional
              }}>
              <h1 className="text-lg text-center font-semibold  text-white">
                {ahorro >= 0 ? "AHORRO" : "PERDIDA"}
              </h1>
              <h2 className="text-lg text-center font-semibold  ">
                $
                {ahorro.toLocaleString("es-CL", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-blue-500  bg-gradient-to-r from-indigo-500 rounded-xl text-center shadow-xl mx-2 p-2">
          <div className="text-lg font-semibold ">
            <h1 className="text-sm font-light text-white mt-1">FACTURAS PAGADAS</h1>
            <h1 className="text-lg font-semibold  text-white mt-4">
              {formatCurrency(totalPaidByProjectFamilySubfamily)}
            </h1>
          </div>
        </div>
        <div className="bg-blue-500  bg-gradient-to-r from-indigo-500 rounded-xl text-center shadow-xl mx-2 p-2">
          <div className="text-lg font-semibold text-white">
            <h1 className="text-sm font-light text-white mt-1">SALDO POR PAGAR</h1>
            <h1 className="text-lg font-semibold  text-white mt-4 ">
              {formatCurrency(porpagar)}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarsInformationSheets;
