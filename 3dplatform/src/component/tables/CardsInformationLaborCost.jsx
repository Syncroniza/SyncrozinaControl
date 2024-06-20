import { useContext, useState, useEffect } from "react";
import { ViewerContext } from "../Context";
import Select from "react-select";

const CardsInformationLaborCost = () => {
  const {
    disponible,
    totalRealMonthCost,
    calculateTotalRealMonthCost,
    selectedByProjectId,
    setSelectedByProjectId,
    totalsWithAccumulated,
    selectedRol,
    setSelectedRol,
    projects,
    formatCurrency,
    porcentajeGastado,
    
  } = useContext(ViewerContext);

  const familyrols = totalsWithAccumulated
    .map((items) => ({ value: items.rol, label: items.rol }))
    .filter(
      (option, index, self) =>
        index === self.findIndex((t) => t.value === option.value)
    );

  const projectIds = projects.map((project) => project.projectId);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      boxShadow: state.isFocused ? "0 0 0 2px rgba(56, 189, 248, 0.5)" : 0,
      borderColor: state.isFocused ? "#38bdf8" : "#d1d5db",
      "&:hover": {
        borderColor: state.isFocused ? "#38bdf8" : "#d1d5db",
      },
      className: "rounded-md",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 0,
      hyphens: "auto",
      marginTop: 0,
      textAlign: "left",
      wordWrap: "break-word",
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#bfdbfe" : "#ffffff",
      color: "#1f2937",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#38bdf8",
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#e0f2fe",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#0369a1",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#0369a1",
      ":hover": {
        backgroundColor: "#0369a1",
        color: "#ffffff",
      },
    }),
  };

  return (
    <div>
      <div className="bg-white text-lg mb-4 font-semibold rounded-lg text-center p-2">
        <h1>CONTROL DE MANO DE OBRA (Proyectado vs Real)</h1>
        <select
          className=" bg-blue-500 p-2 rounded-lg text-xs text-white mt-4 mb-2 shadow-lg"
          value={selectedByProjectId}
          name="selectedByProjectId"
          onChange={(e) => setSelectedByProjectId(e.target.value)}
        >
          <option className="text-xs" value="">
            Selecciona un Proyecto
          </option>
          {projectIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
        <div className="p-5">
          <Select
            isMulti
            options={familyrols}
            value={selectedRol}
            onChange={(selectedOptions) => setSelectedRol(selectedOptions)}
            styles={customStyles}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Seleccione Rol..."
            noOptionsMessage={() => "No hay opciones disponibles"}
          />
        </div>
      </div>

      <div className=" text-sm bg-white rounded-lg text-white text-center py-6">
        <div className="bg-blue-500 grid grid-cols-4 mx-4 rounde rounded-lg">
          <h1>Disponible</h1>
          <h1>Gastado a la Fecha</h1>
          <h1>Disponible</h1>
          <h1>% Gastado</h1>
          <p>{formatCurrency(totalRealMonthCost)}</p>
          <p>{formatCurrency(calculateTotalRealMonthCost)}</p>
          <p>{formatCurrency(disponible)}</p>
          <p>{porcentajeGastado.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
};

export default CardsInformationLaborCost;
