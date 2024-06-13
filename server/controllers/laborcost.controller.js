import { Types } from 'mongoose';
import XLSX from 'xlsx';
import { LaborCostModel } from "../models/laborcost.model.js";

const { ObjectId } = Types;

// Helper to convert Excel date format to JavaScript date
const excelSerialDateToJSDate = serialDate => {
  const excelEpoch = new Date(1899, 11, 31);
  const days = serialDate - (serialDate > 60 ? 2 : 1);
  return new Date(excelEpoch.getTime() + days * 86400000).toISOString();
};

// Helper to convert Excel buffer to JSON
const convertExcelToJson = buffer => {
  const workbook = XLSX.read(buffer);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet, { raw: false }).map(row => {
    if (row.deadline) {
      row.deadline = excelSerialDateToJSDate(row.deadline);
    }
    return row;
  });
};

// Get all labor entries
export const getAllLabor = async (req, res) => {
  try {
    const data = await LaborCostModel.find({});
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const createLaborExcel = async (req, res) => {
  console.log("Archivo recibido:", req.file);
  console.log("Datos recibidos:", req.body);

  if (req.file) {
    // Proceso para manejar la carga de un archivo Excel
    try {
      const jsonData = convertExcelToJson(req.file.buffer);
      const createdData = await LaborCostModel.create(jsonData);
      console.log("Datos creados desde Excel:", createdData);
      res.status(201).json({
        message: "Labor data successfully created from Excel.",
        data: createdData
      });
    } catch (error) {
      console.error("Failed to save Excel data:", error);
      res.status(500).json({ error: "Failed to save Excel data." });
    }
  } else {
    // Proceso para manejar datos JSON normales
    try {
      let response = req.body.map(async (dtm) => {
        return await LaborCostModel.findOneAndUpdate(
          {deadline: dtm.deadline},
          dtm,
          {
            new: true,
            upsert: true
          }
        )
      });

      // const createdData = await LaborCostModel.create({
      //   realmonthcost: realDatum.value,
      //   acumulatedrealcost: accumDatum.value
      // });
      console.log("Datos creados desde JSON:", response);
      res.status(201).json({
        message: "Labor data successfully created.",
        data: response
      });
    } catch (error) {
      console.error("Failed to save JSON data:", error);
      res.status(500).json({ error: "Failed to save JSON data." });
    }
  }
};


// Get a single labor entry by ID
export const getOneLabor = async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID doesn't match the expected format." });
  }
  try {
    const data = await LaborCostModel.findById(id);
    if (!data) {
      return res.status(404).json({ message: "Labor not found." });
    }
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Delete a labor entry
export const deleteLabor = async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID." });
  }
  try {
    await LaborCostModel.deleteOne({ _id: id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Update a labor entry
export const editLabor = async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID." });
  }
  try {
    const updatedData = await LaborCostModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedData) {
      return res.status(404).json({ message: "Labor not found." });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error });
  }
};
