import { Comidas } from "../models/comidas.models.js";
import { Alimentos } from "../models/alimentos.models.js";
import { User } from "../models/users.models.js";
import { Progreso } from "../models/progreso.model.js";

export const crearComida = async (req, res) => {
  try {
    const { alimentos_id, user_id, fecha, tipo, cantidad, unidadMedida } =
      req.body;

    // verificar que el alimento existe
    const alimento = await Alimentos.findById(alimentos_id);
    if (!alimento || alimento.length === 0) {
      return res.status(404).json({ mensaje: "Alimento no encontrado." });
    }
    // Verificar que la unidad de medida es válida
    if (
      !alimento.measurementUnits ||
      !alimento.measurementUnits.has(unidadMedida)
    ) {
      return res
        .status(400)
        .json({ mensaje: "Unidad de medida no válida para este alimento" });
    }
    const user = await User.findById(user_id);
    if (!user || user.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Crear la comida
    const nuevaComida = new Comidas({
      alimentos_id,
      user_id,
      fecha: new Date(fecha),
      tipo,
      cantidad,
      unidadMedida,
    });

    // Guardar la comida en la base de datos
    await nuevaComida.save();

    await actualizarProgreso(user_id, fecha);

    res.status(201).json(nuevaComida);
  } catch (error) {
    //si el ID no es valido,
    if (error.name === "CastError") {
      res.status(404).json({
        Mensaje: "Error. ID no válido.",
        error: error.message,
      });
    } else {
      res.status(400).json({
        Mensaje: "Error al crear la comida",
        error: error.message,
        nombre: error.name,
      });
    }
  }
};

export const actualizarProgreso = async (user_id, fecha) => {
  const valores = await Progreso.findOne({ user_id });
  let progreso = await Progreso.findOne({
    user_id: user_id,
    fecha: fecha,
  });
  if (!progreso) {
    progreso = new Progreso({
      user_id,
      fecha,
      imc: valores.imc,
      peso_actual: valores.peso_actual,
      nivel_peso: valores.nivel_peso,
      calorias_consumidas: 0,
    });
  }
  const { totalCaloriasC } = await obtenerCaloriasConsumidas(user_id, fecha);
  console.log(totalCaloriasC);
  progreso.calorias_consumidas = totalCaloriasC;
  await progreso.save();
  console.log(progreso);
};

export const obtenerCaloriasConsumidas = async (user_id, fecha) => {
  const comidas = await Comidas.find(
    {
      user_id: user_id,
      fecha: fecha,
    },
    "tipo unidadMedida cantidad "
  ).populate({
    path: "alimentos_id",
    select: "name category measurementUnits",
  });
  console.log("Comidas encontradas /n" + comidas);

  let totalCaloriasC = 0;

  comidas.forEach((comida) => {
    const alimento = comida.alimentos_id;
    const measurementUnit = alimento.measurementUnits.get(comida.unidadMedida);
    const cantidad = comida.cantidad;
    if (measurementUnit) {
      totalCaloriasC += measurementUnit.calorie * cantidad;
    } else {
      console.error(
        `Unidad de medida "${comida.unidadMedida}" no encontrada para el alimento "${alimento.name}"`
      );
    }
  });
  return { totalCaloriasC };
};

export const obtenerComidas = async (req, res) => {
  const comida = await Comidas.find().populate("alimentos_id");
  res.json(comida);
};

export const obtenerComida = async (req, res) => {
  try {
    const comida = await Comidas.findById(
      req.params.id,
      "tipo cantidad unidadMedida"
    ).populate({
      path: "alimentos_id",
      select: "name measurementUnits",
    });
    res.status(201).json(comida);
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(404)
        .json({ mensaje: "Ingrese un ID válido.", error: error.message });
    }
  }
};

export const obtenerComidaPorUsuario = async (req, res) => {
  try {
    const comidas = await Comidas.find(
      {
        user_id: req.params.id,
        fecha: req.params.fecha,
      },
      "tipo unidadMedida cantidad "
    ).populate({
      path: "alimentos_id",
      select: "name category measurementUnits",
    });

    if (!comidas || comidas.length === 0) {
      res.status(404).json({
        Mensaje: "No se encontraron comidas para el usuario y fecha ingresado",
      });
    } else {
      res.json(comidas);
    }
  } catch (error) {
    //si el ID no es valido,
    if (error.name === "CastError") {
      return res.status(404).json({
        Mensaje: "Ingrese un ID válido.",
      });
    }
    res.status(400).json({
      Mensaje: "Error al obtener las comidas",
      error: error.message,
    });
  }
};

export const actualizarComida = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, tipo, cantidad, unidadMedida } = req.body;

    // Verificar que la comida existe
    const comida = await Comidas.findById(id);
    if (!comida) {
      return res.status(404).json({ mensaje: "Comida no encontrada" });
    }

    // Si se proporciona una nueva fecha, actualizarla
    if (fecha) {
      comida.fecha = new Date(fecha);
    }

    // Si se proporciona un nuevo tipo, actualizarlo
    if (tipo) {
      comida.tipo = tipo;
    }

    // Si se proporciona una nueva cantidad, actualizarla
    if (cantidad) {
      comida.cantidad = cantidad;
    }

    // Si se proporciona una nueva unidad de medida, verificar que es válida y actualizarla
    if (unidadMedida) {
      const alimento = await Alimentos.findById(comida.alimentos_id);
      if (
        !alimento.measurementUnits ||
        !alimento.measurementUnits.has(unidadMedida)
      ) {
        return res
          .status(400)
          .json({ mensaje: "Unidad de medida no válida para este alimento" });
      }
      comida.unidadMedida = unidadMedida;
    }

    // Guardar los cambios en la base de datos
    await comida.save();

    // Actualizar el progreso del usuario
    await actualizarProgreso(comida.user_id, comida.fecha);

    res.status(200).json(comida);
  } catch (error) {
    // Si el ID no es válido
    if (error.name === "CastError") {
      res.status(404).json({
        Mensaje: "Error. ID no válido.",
        error: error.message,
      });
    } else {
      res.status(400).json({
        Mensaje: "Error al actualizar la comida",
        error: error.message,
        nombre: error.name,
      });
    }
  }
};

export const eliminarComida = async (req, res) => {
  const comida = await Comidas.findByIdAndDelete(req.params.id);
  await actualizarProgreso(comida.user_id, comida.fecha);
  if (!comida) {
    res.status(404).json({
      Mensaje: "Comida no encontrada",
    });
  } else {
    res.status(201).json(comida);
  }
};
