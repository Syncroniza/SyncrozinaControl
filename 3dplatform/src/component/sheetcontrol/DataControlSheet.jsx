import { useEffect, useContext } from "react";
import axios from "axios";
import { ViewerContext } from "../Context";
import {BASE_URL} from "../../constants.js";

const DataControlSheet = () => {
  const {  getDataSheet, setGetDataSheet } = useContext(ViewerContext);

  useEffect(() => {
    const getDataSheetControl = async () => {
      try {
        const response = await axios.get(BASE_URL + "/sheet");

        if (
          Array.isArray(response.data.result) &&
          response.data.result.length > 0
        ) {
          setGetDataSheet(response.data.result);
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
