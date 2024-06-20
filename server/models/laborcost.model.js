import mongoose from "mongoose";

const LaborCostSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
    },
    rol: {
      type: String,
    },
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    MonthsProj: {
      type: Number,
    },
    Monthscost: {
      type: Number,
    },
    compensation: {
      type: Number,
    },
    deadline: {
      type: Date,
    },
    total: {
      type: Number,
    },
    realmonthcost: {
      type: Number,
    },
    acumulatedrealcost: {
      type: Number,
    },
    period: {
      type: String, // Agregar el campo period aquí
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

LaborCostSchema.index({ projectId: 1, rol: 1, period: 1 }, { unique: true });

export const LaborCostModel = mongoose.model("laborcostsplit", LaborCostSchema);
