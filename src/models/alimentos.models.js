import mongoose from "mongoose";

// Definimos el esquema para las propiedades de measurementUnits
const measurementUnitSchema = new mongoose.Schema(
  {
    calorie: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
  },
  { _id: false }
); // Desactivamos la creación automática de _id para los subdocumentos

const alimentosSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    measurementUnits: { type: Map, of: measurementUnitSchema },
  },
  {
    timestamps: true,
  }
);

export const Alimentos = mongoose.model("Alimentos", alimentosSchema);
