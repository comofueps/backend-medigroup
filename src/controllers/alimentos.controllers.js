
import { Alimentos } from "../models/alimentos.models.js";

export const crearAlimento = async (req, res) => {
  const { name, category, measurementUnits } = req.body;

  try {
    const alimento = new Alimentos({ name, category, measurementUnits });
    await alimento.save();
    res.status(201).json(alimento);
  } catch (error) {
    res.status(400).json({
      Mensaje: "No se pudo crear el alimento",
      Error: error.message,
      Nombre: error.name,
    });
  }
};

export const obtenerAlimentos = async (req, res) => {
  const alimentos = await Alimentos.find();
  res.json(alimentos);
};

export const obtenerAlimentoPorId = async (req, res) => {
  try {
    const alimento = await Alimentos.findById(req.params.id);
    if (!alimento) {
      res.status(404).json({ Mensaje: "Alimento no encontrado" });
    } else {
      res.send(alimento);
    }
  } catch (error) {
    console.error(error.message);
  }
};

export const buscarAlimentos = async (req, res) => {
  const { nombre } = req.params;

  // Crear expresión regular para búsqueda parcial e insensible a mayúsculas
  const regex = new RegExp(nombre, "i");

  const alimentos = await Alimentos.find({ name: regex });
  res.json(alimentos);
};
