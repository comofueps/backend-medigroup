import { Rutinas } from "../models/rutinas.models.js";

export const crearRutina = async (req, res) => {
  try {
    const { fecha, tipo, ejercicio, calorias_quemadas, duracion } = req.body;

    const rutina = new Rutinas({
      fecha,
      tipo,
      ejercicio,
      calorias_quemadas,
      duracion,
    });
    await rutina.save();
    res.json(rutina);
  } catch (error) {
    res.status(400).json("No se pudo crear la rutina.");
  }
};

export const obtenerRutinas = async (req, res) => {
  const rutinas = await Rutinas.find();
  res.json(rutinas);
};

export const obtenerRutinasPorTipo = async (req, res) => {
  const { tipo_entrenamiento } = req.params;

  // Crear expresión regular para búsqueda parcial e insensible a mayúsculas
  const regex = new RegExp(tipo_entrenamiento, "i");

  const rutinas = await Rutinas.find({ tipo: regex });
  if (!rutinas || rutinas.length === 0) {
    return res.json({ mensaje: "No se encontraron rutinas." });
  }
  res.json(rutinas);
};

export const actualizarRutina = async (req, res) => {
  try {
    const rutina = await Rutinas.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!rutina) {
      return res.json({ mensaje: "Rutina no encontrada" });
    }

    res.json(rutina);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ mensaje: "Ingrese un ID válido." });
    }
    res.status(400).json({ mensaje: "No se pudo actualizar la rutina." });
  }
};

export const eliminarRutina = async (req, res) => {
  try {
    const rutina = await Rutinas.findByIdAndDelete(req.params.id);
    if (!rutina) {
      return res.status(404).json({ mensaje: "Rutina no encontrada" });
    }
    res.status(201).json("Rutina eliminada");
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ mensaje: "Ingrese un ID válido." });
    }
    res.status(400).json({ mensaje: "No se pudo eliminar la rutina." });
  }
};
