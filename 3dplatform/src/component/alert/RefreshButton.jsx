import React, { useContext } from "react";
import { ViewerContext } from "../Context";

const RefreshButton = () => {
  const { fetchData } = useContext(ViewerContext);

  const handleRefresh = () => {
    fetchData(); // Llamar a la función que obtiene los datos actualizados
  };

  return (
    <button onClick={handleRefresh} className="bg-blue-500 text-white p-2 rounded-lg">
      Load
    </button>
  );
};

export default RefreshButton;
