import { useEffect, useContext } from "react";
import { ViewerContext } from "../Context";
import axios from "axios";
import Exceltransform from "../Exceltransform";

const BudgetAvailable = () => {
  const {
    setGetDataBudget: updateGetDataBudget,
    filters,
    setTotalBudget,
  } = useContext(ViewerContext);

  useEffect(() => {
    const getBudgetData = async () => {
      const getDataResponse = await axios.get("http://localhost:8000/budget");
      console.log("🚀 ~ getBudgetData ~ getDataResponse:", getDataResponse)

      if (
        Array.isArray(getDataResponse.data.data) &&
        getDataResponse.data.data.length > 0
      )
        updateGetDataBudget(getDataResponse.data.data);
      setTotalBudget(getDataResponse.data.aggregateResults);
     
    };

    getBudgetData();
  }, [filters]);

  

  return (
    <div className="bg-white ml-4 mr-2 mt-4 mb-2 shadow-lg  rounded-lg">
      {/* <Exceltransform UrlEndpoint="http://localhost:8000/budget/" /> */}
    </div>
  );
};

export default BudgetAvailable;
