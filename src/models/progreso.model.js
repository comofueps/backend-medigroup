import mongoose from "mongoose";

const progresoSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    fecha: { type: Date, default: Date.now(), required: true },
    peso_actual: { type: Number },
    calorias_consumidas: { type: Number },
    calorias_quemadas: { type: Number },
    balance_calorico: { type: Number },
    horas_sueno: { type: Number },
    imc: { type: Number },
    nivel_peso: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Progreso = mongoose.model("Progreso", progresoSchema);
