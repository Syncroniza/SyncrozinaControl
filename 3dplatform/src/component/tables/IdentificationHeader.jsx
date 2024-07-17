import { useContext, useEffect, useState } from "react";
import { ViewerContext } from "../Context";

const IdentificationHeader = () => {
  const {
    selectedFamily,
    selectedSubfamily,
    materialSheets,
    selectedProjectId,
  } = useContext(ViewerContext);
    console.log("🚀 ~ IdentificationHeader ~ materialSheets:", materialSheets)

  const [aggregatedSheets, setAggregatedSheets] = useState([]);
  console.log("🚀 ~ IdentificationHeader ~ aggregatedSheets:", aggregatedSheets)
 const [selectdCod, setSelectedCod]= useState ("")
  console.log("🚀 ~ IdentificationHeader ~ selectdCod:", selectdCod)
  useEffect(() => {
    if (!materialSheets) return;

    const aggregateData = (sheets) => {
      const groupedData = {};

      sheets = sheets.filter(
        (sheet) => !selectedProjectId || sheet.projectId === selectedProjectId
      );

      sheets.forEach((sheet) => {
        if (
          (selectedFamily === "" || sheet.family === selectedFamily) &&
          (selectedSubfamily === "" || sheet.subfamily === selectedSubfamily) &&
          (selectdCod === "" || sheet.cod === selectdCod)
        ) {
          if (!groupedData[sheet.projectId]) {
            groupedData[sheet.projectId] = {
              projectId: sheet.projectId,
              families: {},
            };
          }

          const familyKey = `${sheet.family}-${sheet.subfamily}`;
          if (!groupedData[sheet.projectId].families[familyKey]) {
            groupedData[sheet.projectId].families[familyKey] = {
              family: sheet.family,
              subfamily: sheet.subfamily,
              cod:sheet.cod,
              subcontractorOffers: new Set(),
              total: 0,
            };
          }

          groupedData[sheet.projectId].families[
            familyKey
          ].subcontractorOffers.add(sheet.subcontractorOffers);
          groupedData[sheet.projectId].families[familyKey].total += sheet.total;
        }
      });

      return Object.values(groupedData);
    };

    setAggregatedSheets(aggregateData(materialSheets));
  }, [materialSheets, selectedFamily, selectedSubfamily, selectedProjectId]);

  let totalGastado = 0;
  aggregatedSheets.forEach((project) => {
    Object.values(project.families)
      .filter(
        (family) =>
          selectedSubfamily === "" || family.subfamily === selectedSubfamily
      )
      .forEach((family) => {
        totalGastado += family.total;
      });
  });

  return (
    <div className="ml-4 mr-2">
      <div className="mt-4">
        {aggregatedSheets.map((project) => (
          <div
            key={project.projectId}
            className="bg-white shadow-lg px-6 py-2 rounded-lg mb-4"
            style={{ width: "1350px" }}
          >
            {Object.values(project.families)
              .filter(
                (family) =>
                  selectedSubfamily === "" ||
                  family.subfamily === selectedSubfamily
              )
              .map((family, index) => (
                <div key={index}>
                  <div className="flex text-sm font-semibold mt-2">
                    <p>Proveedores:</p>
                    <p className="text-xs font-light ml-2 mt-1">
                      {[...family.subcontractorOffers].join(",")}
                    </p>
                  </div>

                  <div className="flex text-sm font-semibold mt-2">
                    <h1>Familia:</h1>
                    <h1 className="text-xs font-light ml-2 mt-1">
                      {family.family}
                    </h1>
                  </div>
                  <div className="flex text-sm font-semibold mt-2">
                    <h1>Codigo :</h1>
                    <h1 className="text-xs font-light ml-2 mt-1">
                      {family.cod}
                    </h1>
                  </div>

                  <div className="flex text-sm font-semibold mt-2">
                    <h1 className="">Subfamilia:</h1>
                    <h1 className="text-xs font-light ml-2 mt-1">
                      {family.subfamily}
                    </h1>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdentificationHeader;
