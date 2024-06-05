import mongoose from "mongoose";

const rutinasSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      enum: ["Cardiovascular", "Fuerza", "Aerobicos"],
      required: true,
    },
    ejercicio: { type: String, required: true },
    calorias_quemadas: { type: Number, required: true },
    video: { type: String },
    duracion: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const Rutinas = mongoose.model("Rutinas", rutinasSchema);
