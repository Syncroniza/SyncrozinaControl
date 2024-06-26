import { useEffect, useContext } from "react";
import axios from "axios";
import { ViewerContext } from "../Context";

const DataControlSheet = () => {
  const {  updategetDataSheet } = useContext(ViewerContext);

  useEffect(() => {
    const getDataSheetControl = async () => {
      try {
        const response = await axios.get("http://localhost:8000/sheet");
        console.log("🚀 ~ getDataSheetControl ~ response:", response)

        if (
          Array.isArray(response.data.result) &&
          response.data.result.length > 0
        ) {
          updategetDataSheet(response.data.result);
        } else {
          console.error("it is not a array or is emphty", response);
        }
      } catch (error) {
        console.error("Error fetching Data ", error);
      }
    };
    getDataSheetControl();
  }, []);

  return (
    <div>
      
     
    </div>
  );
};

export default DataControlSheet;
