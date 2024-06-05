import mongoose from "mongoose";

const citasSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fecha: { type: Date, required: true },
    tipo: {
      type: String,
      enum: ["Medicina general", "Psicologia", "Especialista"],
      required: true,
    },
    estado: {
      type: String,
      enum: ["Programada", "Cancelada", "Completada", "No asistio"],
    },
  },
  {
    timestamps: true,
  }
);

export const Citas = mongoose.model("Citas", citasSchema);
