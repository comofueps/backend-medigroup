import mongoose from "mongoose";

const userRutinaSchema = new mongoose.Schema(
  {
    rutina_id: {
      type: mongoose.Types.ObjectId,
      ref: "Rutinas",
      required: true,
    },
    user_id: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    fecha: { type: Date, required: true },
    estado: { type: String, enum: ["Asignada", "Completada"] },
  },
  {
    timestamps: true,
  }
);


export const UsersRutina = mongoose.model("UsersRutina", userRutinaSchema);
