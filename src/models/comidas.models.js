import mongoose from "mongoose";

const comidasSchema = new mongoose.Schema(
  {
    alimentos_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alimentos",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fecha: { type: Date, required: true },
    cantidad: { type: Number, required: true },
    unidadMedida: { type: String, required: true },

    tipo: {
      type: String,
      required: true,
      enum: ["Desayuno", "Media mañana", "Almuerzo", "Merienda", "Cena"],
    },
  },
  {
    timestamps: true,
  }
);

export const Comidas = mongoose.model("Comidas", comidasSchema);
