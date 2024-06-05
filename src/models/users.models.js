import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    edad: { type: Number, required: true },
    altura: { type: Number, required: true },
    peso_inicial: { type: Number, required: true },
    genero: {
      type: String,
      required: true,
      enum: ["Masculino", "Femenino"],
    },
    objetivos: {
      type: String,
      required: true,
      enum: ["Perder peso", "Ganar masa muscular"],
    },
    citas: {
      medicina_general: { type: Number, required: true },
      psicologia: { type: Number, required: true },
      especialista: { type: Number, required: true },
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
