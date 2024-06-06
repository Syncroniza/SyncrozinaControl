import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { ViewerContext } from "../Context";
import FormIncreaseAndDiscount from "../sheetcontrol/FormIncreaseAndDiscount";

const IncreaseAndDiscountByForm = () => {
  const {
    selectedProjectId,
    selectedSubfamily,
    setData,
    data,
    setIsModalOpenBudget,
    setProjectId,
    setFamily,
    setSubfamily,
    setIsEditMode,
    setDescription,
    setCurrentIdIncreaseDiscount,
    currentIdIncreaseDiscount,
    formatCurrency,
    dataIncreaseDiscount,
    setDataIncreaseDiscount,
    dataincreaseDisccountwthitoutfilter,
    setDataincreaseDisccountwhithoutfilter,
  } = useContext(ViewerContext);
  
  const openModal = () => setIsModalOpenBudget(true);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/increasediscount/"
        );

        if (
          Array.isArray(response.data.data) &&
          response.data.data.length > 0
        ) {
          const filteredData = response.data.data.filter(
            (item) =>
              (!selectedProjectId || item.projectId === selectedProjectId) &&
              (!selectedSubfamily === "" ||
                item.subfamily === selectedSubfamily)
          );

          setDataIncreaseDiscount(filteredData);
          setDataincreaseDisccountwhithoutfilter(response);
        } else {
          console.error("No se encontraron datos", response);
        }
      } catch (error) {
        console.error("Error al obtener los datos del backend", error);
      }
    };

    fetchContract();
  }, [selectedSubfamily, selectedProjectId, setData]);

  //---------------------------- Delete----------------------------//
  const handleDeleIncreaseAndDiscount = async (increasediscountId) => {
    const isConfirmed = window.confirm(
      "Esta seguro que quiere borrar el Registro ?"
    );
    if (!isConfirmed) {
      return;
    }
    try {
      const response = await axios.delete(
        `http://localhost:8000/increasediscount/${increasediscountId}`
      );

      if (response.status === 200) {
        setData((prevContractData) => {
          // Filtrar el array para remover el elemento eliminado
          return prevContractData.filter(
            (increasediscount) =>
              increasediscount._id.toString() !== increasediscountId.toString()
          );
        });
      }
    } catch (err) {
      console.error("Error deleting invoice:", err);
    }
  };

  //--------------------- Update Form ----------------------//
  const openFormAndCurrentIncreaseDiscountId = (increasediscountid) => {
    // Encuentra el contract específica por su ID
    const increasediscountToEdit = dataIncreaseDiscount.find(
      (increasediscount) => increasediscount._id === increasediscountid
    );

    if (increasediscountToEdit) {
      // setEditingContract(contractToEdit);
      setProjectId(increasediscountToEdit.projectId);
      setFamily(increasediscountToEdit.family);
      setSubfamily(increasediscountToEdit.subfamily);
      setDescription(increasediscountToEdit.Descripcion);
      setCurrentIdIncreaseDiscount(increasediscountToEdit._id);
      setIsEditMode(true);
      setIsModalOpenBudget(true);
    }
  };
  return (
    <div className="bg-white my-2 ml-3 mr-2 p-3 rounded-xl">
      <FormIncreaseAndDiscount />
      <h1 className="text-sm font-semibold ml-3 ">
        AUMENTO / DISMINUCIONES AL CONTRATO
      </h1>
      <button
        onClick={openModal}
        className="flex bg-blue-500 mt-2 ml-2 p-1 text-white rounded-lg text-xs gap-2 "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          dataslot="icon"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>{" "}
        Nuevo Registro
      </button>
      <div
        className="mt-4 overflow-auto ml-2 mr-2  "
        style={{ height: "150px" }}
      >
        <table>
          <thead className="sticky top-0 bg-blue-500 text-white ">
            <tr className="border border-slate-500 px-4 text-xxs ">
              <th className="border border-slate-500 p-1   ">ProjectId</th>
              <th className="border border-slate-500 p-1   ">Familia</th>
              <th className="border border-slate-500 p-1   ">SubFamila</th>
              <th className="border border-slate-500 p-1   ">Detalle</th>
              <th className="border border-slate-500 p-1   ">
                AumentoDisminucion
              </th>
              <th className="border border-slate-500 p-1  ">Real</th>
              <th className="border border-slate-500 p-1  ">Recuperable</th>
              <th className="border border-slate-500 p-1  ">Observacion</th>
              <th className="border border-slate-500 p-1  ">Borrar</th>
              <th className="border border-slate-500 p-1  ">Editar </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data)
              ? dataIncreaseDiscount.map((increasediscount) => (
                  <tr className="border border-slate-300 text-xxs text-center " key={increasediscount._id}>
                    <td className="border border-slate-300 px-1  ">
                      {increasediscount.projectId}
                    </td>
                    <td className="border border-slate-300 px-1  ">
                      {increasediscount.family}
                    </td>
                    <td className="border border-slate-300 px-1  ">
                      {increasediscount.subfamily}
                    </td>
                    <td className="border border-slate-300 px-1  ">
                      {increasediscount.Detalle}
                    </td>
                    <td className="border border-slate-300 px-1  ">
                      {increasediscount.Aumentodisminuciones}
                    </td>
                    <td className="border border-slate-300 px-1  ">
                      {formatCurrency(increasediscount.Real)}
                    </td>
                    <td className="border border-slate-300 px-1  ">
                      {formatCurrency(increasediscount.Recuperable)}
                    </td>
                    <td className="border border-slate-300 px-1  ">
                      {increasediscount.Observaciones}
                    </td>

                    <td className="border border-slate-300"> 
                      <button
                        className=" bg-red-500  px-1 text-white rounded-lg  "
                        onClick={() =>
                          handleDeleIncreaseAndDiscount(increasediscount._id)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-3 "
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </td>
                    <td className="border border-slate-300">
                      <button
                        className="bg-green-500 px-1 text-white rounded-lg "
                        onClick={() =>
                          openFormAndCurrentIncreaseDiscountId(
                            increasediscount._id
                          )
                        }
                      >
                        {/* Icono de edición */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncreaseAndDiscountByForm;
