import { Progreso } from "../models/progreso.model.js";
import { User } from "../models/users.models.js";

export const obtenerCaloriasConsumida = async (req, res) => {};

export const obtenerCaloriasQuemdas = async (req, res) => {};

export const calcularImc = async (req, res) => {};

export const obtenerProgresoUsuarioFecha = async (req, res) => {
  try {
    const { id, fecha } = req.params;

    const progreso = await Progreso.find(
      { user_id: id, fecha: fecha },
       "calorias_consumidas calorias_quemadas balance_calorico fecha imc nivel_peso"
    ).populate({
      path:"user_id",select: "nombre apellido objetivos peso_inicial"
    });

    if (!progreso || progreso.length === 0) {
      return res.status(404).json("Progreso del usuario no encontrado.");
    }
    res.status(201).json(progreso);
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(404)
        .json({ mensaje: "Ingrese un ID válido.", error: error.message });
    }
    res.status(400).json({
      mensaje: "No se pudo obtener el progreso del usuario.",
      error: error.message,
    });
  }
};
