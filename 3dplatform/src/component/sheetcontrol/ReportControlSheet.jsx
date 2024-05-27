import { useContext, useState, useEffect } from "react";
import { ViewerContext } from "../Context";
import Sidebardb from "../dashboard/Sidebardb";
import CarInformationSheetControlReport from"../tables/CarInformationSheetControlReport"

function ReportControlSheet() {
  const {
    selectedFamily,
    selectedSubfamily,
    formatCurrency,
    getDataBudget,
    selectedProjectId,
    dataIncreaseDiscount,
    dataincreaseDisccountwthitoutfilter,
    contracObservationWhitOutFilter,
    projects,
    setSelectedProjectId,
    summaryData,
    setSummaryData,
  } = useContext(ViewerContext);
    console.log("🚀 ~ ReportControlSheet ~ summaryData:", summaryData)
  console.log("🚀 ~ ReportControlSheet ~ summaryData:", summaryData);

  const getMontoContrato = (subfamily) => {
    return contracObservationWhitOutFilter.data.data.reduce((total, item) => {
      const matchesProject =
        !selectedProjectId || item.projectId === selectedProjectId;
      const matchesFamily = !selectedFamily || item.family === selectedFamily;
      const matchesSubfamily = item.subfamily === subfamily;
      if (matchesProject && matchesFamily && matchesSubfamily) {
        return total + (Number(item.Proyectado) || 0);
      }
      return total;
    }, 0);
  };
  const getRecuperable = (subfamily) => {
    return dataincreaseDisccountwthitoutfilter.data.data.reduce(
      (total, item) => {
        const matchesProject =
          !selectedProjectId || item.projectId === selectedProjectId;
        const matchesFamily = !selectedFamily || item.family === selectedFamily;
        const matchesSubfamily = item.subfamily === subfamily;
        if (matchesProject && matchesFamily && matchesSubfamily) {
          return total + (Number(item.Recuperable) || 0);
        }
        return total;
      },
      0
    );
  };

  useEffect(() => {
    const subfamilies = [
      ...new Set(getDataBudget.map((item) => item.subfamily)),
    ];
    const newSummaryData = subfamilies.map((subfamily) => {
      const filteredData = getDataBudget.filter((item) => {
        const matchesProject =
          !selectedProjectId || item.projectId === selectedProjectId;
        const matchesFamily = !selectedFamily || item.family === selectedFamily;
        const matchesSubfamily = item.subfamily === subfamily;
        return matchesProject && matchesFamily && matchesSubfamily;
      });

      const montoPropuesta = filteredData.reduce(
        (total, current) => total + current.totalPrice,
        0
      );

      const montoContrato = getMontoContrato(subfamily);
      const getrecuperable = getRecuperable(subfamily);
      const totalconextras = montoContrato + getrecuperable;
      const ahorro = montoPropuesta - totalconextras;

      return {
        subfamily,
        projectId: selectedProjectId,
        montoPropuesta,
        montoContrato: montoContrato,
        recuperable: getrecuperable,
        totalconextras,
        ahorro,
        contrato: montoPropuesta,
      };
    });

    setSummaryData(newSummaryData);
  }, [
    getDataBudget,
    dataIncreaseDiscount,
    selectedProjectId,
    selectedFamily,
    selectedSubfamily,
    contracObservationWhitOutFilter,
    dataincreaseDisccountwthitoutfilter,
  ]);

  return (
    <div className="flex bg-gradient-to-r from-blue-500">
      <Sidebardb />
      <div className="ml-3 mt-6">
        <div className="grid grid-rows-2 justify-center align-middle bg-white shadow-xl rounded-xl">
          <h1 className="text-lg font-bold">INFORME HOJAS DE CONTROL</h1>
          <div className="flex justify-between mb-1">
            <h1 className="">Elegir Proyecto</h1>
            <select
              className=" bg-blue-500  text-xs rounded-lg text-white  shadow-lg"
              name="newProjectId"
              value={selectedProjectId} // Cambia esto para usar selectedProjectId
              onChange={(e) => {
                const newProjectId = e.target.value;
                setSelectedProjectId(newProjectId); // Actualiza el projectId en el contexto o estado
                // Aquí podrías resetear otros estados dependientes si es necesario
              }}>
              <option 
              value="">Todos los Proyectos</option>
              {projects.map((project) => (
                <option key={project._id} value={project.id}>
                  {project.projectId}
                </option>
              ))}
            </select>
          </div>
        </div>
        <CarInformationSheetControlReport />
        <div className="bg-white mt-2 mb-4 shadow-lg rounded-lg   overflow-y-scroll max-h-[1000px] p-1 ">
          <table className="sticky ">
            <thead>
              <tr className="sticky">
                <th className="sticky border border-slate-500 px-4 text-xs text-black ">
                  ProjectId
                </th>
                <th className="sticky border border-slate-500 px-4 text-xs text-black ">
                  Hoja de Control
                </th>
                <th className="sticky border border-slate-500 px-4 text-xs text-black ">
                  Monto Propuesta
                </th>
                <th className="sticky border border-slate-500 px-4 text-xs text-black ">
                  Monto Contrato
                </th>
                <th className="sticky border border-slate-500 px-4 text-xs text-black ">
                  Recuperable
                </th>
                <th className="sticky border border-slate-500 px-4 text-xs text-black ">
                  Total con Extras
                </th>
                <th className="sticky border border-slate-500 px-4 text-xs">
                  Ahorro/Perdida
                </th>
              </tr>
            </thead>
            <tbody>
              {summaryData.map((item, index) => (
                <tr key={index}>
                  <td className="border border-slate-500 text-center text-xs ">
                    {item.projectId}
                  </td>
                  <td className="border border-slate-500 text-center text-xs ">
                    {item.subfamily}
                  </td>
                  <td className="border border-slate-500 text-center text-xs ">
                    {formatCurrency(item.montoPropuesta)}
                  </td>
                  <td className="border border-slate-500 text-center text-xs ">
                    {formatCurrency(item.montoContrato)}
                  </td>
                  <td className="border border-slate-500 text-center text-xs ">
                    {formatCurrency(item.recuperable)}
                  </td>
                  <td className="border border-slate-500 text-center text-xs ">
                    {formatCurrency(item.totalconextras)}
                  </td>
                  <td
                    className={`border border-slate-500 text-center text-xs ${
                      item.ahorro > 0 ? "text-green-500" : item.ahorro < 0 ? "text-red-500" : "text-black"
                    }`}
                  >
                    {formatCurrency(item.ahorro)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReportControlSheet;
