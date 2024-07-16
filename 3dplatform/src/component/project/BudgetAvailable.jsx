import { useEffect, useContext } from "react";
import { ViewerContext } from "../Context";
import axios from "axios";
import Exceltransform from "../Exceltransform";
import {BASE_URL} from "../../constants.js";

const BudgetAvailable = () => {
  const {
    setGetDataBudget,
    filters,
    setTotalBudget,
  } = useContext(ViewerContext);

  useEffect(() => {
    const getBudgetData = async () => {
      const getDataResponse = await axios.get(BASE_URL + "/budget");

      if (
        Array.isArray(getDataResponse.data.data) &&
        getDataResponse.data.data.length > 0
      )
        setGetDataBudget(getDataResponse.data.data);
      setTotalBudget(getDataResponse.data.aggregateResults);
    };

    getBudgetData();
  }, [filters]);

  return (
    <div className="bg-white ml-4 mr-2 mt-4 mb-2 shadow-lg  rounded-lg">
      <Exceltransform UrlEndpoint={BASE_URL + "/budget/"} />
    </div>
  );
};

export default BudgetAvailable;
