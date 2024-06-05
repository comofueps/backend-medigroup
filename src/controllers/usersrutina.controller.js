import { UsersRutina } from "../models/usersrutinas.models.js";
import { User } from "../models/users.models.js";
import { Rutinas } from "../models/rutinas.models.js";
import { Progreso } from "../models/progreso.model.js";

export const asignarRutina = async (req, res) => {
  try {
    const { user_id, rutina_id, fecha } = req.body;

    // verificar que el usuario existe
    const user = await User.findById(user_id);
    if (!user) {
      return res.json({ mensaje: "Usuario no encontrado." });
    }

    //verificar que la rutina existe
    const rutina = await Rutinas.findById(rutina_id);
    if (!rutina) {
      return res.json({ mensaje: "Rutina no encontrada." });
    }

    const entrenamiento = new UsersRutina({
      user_id,
      rutina_id,
      fecha: new Date(fecha),
      estado: "Asignada",
    });
    await entrenamiento.save();
    res.status(201).json(entrenamiento);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json("Ingrese un ID válido.");
    }
    res.status(400).json({
      mensaje: "No se pudo registrar el entrenamiento.",
      error: error.message,
    });
  }
};

export const obtenerUsuariosRutinas = async (req, res) => {
  const usersRutinas = await UsersRutina.find()
    .populate("user_id")
    .populate("rutina_id");
  if (!usersRutinas) {
    return res.json("No hay usuarios con rutinas registradas.");
  }
  res.json(usersRutinas);
};

export const actualizarEstado = async (req, res) => {
  const { id } = req.params;
  try {
    const usersRutina = await UsersRutina.findByIdAndUpdate(
      id,
      { estado: "Completada" },
      { new: true }
    );

    if (!usersRutina) {
      return res.status(404).json("No se encontro usuario para dicha rutina.");
    }

    //console.log(usersRutina.fecha);

    //Obtener el progreso del usuario en una fecha
    let progreso = await Progreso.findOne({
      user_id: usersRutina.user_id,
      fecha: usersRutina.fecha,
    });

    const { totalCaloriasQ } = await obtenerCaloriasQuemdas(
      usersRutina.user_id,
      usersRutina.fecha
    );
    //console.log(totalCaloriasQ)
    progreso.calorias_quemadas = totalCaloriasQ;
    progreso.balance_calorico =
      progreso.calorias_consumidas - progreso.calorias_quemadas;
    //console.log(progreso);
    await progreso.save();

    res.status(201).json(usersRutina);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({
        texto: "Ingrese un ID válido.",
        mensaje: error.message,
      });
    }
    res.status(400).json({
      mensaje: "No se puede actualizar la rutina del usuario.",
      error: error.message,
    });
  }
};

export const obtenerCaloriasQuemdas = async (userId, fecha) => {
  const usersRutina = await UsersRutina.find(
    {
      user_id: userId,
      fecha: fecha,
      estado: "Completada",
    },
    "fecha estado user_id"
  ).populate({
    path: "rutina_id",
    select: "ejercicio calorias_quemadas",
  });

  console.log(usersRutina);

  let totalCaloriasQ = 0;

  usersRutina.forEach((element) => {
    const rutina = element.rutina_id;
    totalCaloriasQ += rutina.calorias_quemadas;
    console.log("total de calorias quemadas: " + totalCaloriasQ);
  });
  return { totalCaloriasQ };
};

export const obtenerRutinasDeUsuario = async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    const usersRutina = await UsersRutina.find(
      { user_id: req.params.id },
      "fecha estado"
    )
      //.populate({ path: "user_id", select: "nombre apellido edad altura peso_inicial genero" })
      .populate({ path: "user_id", select: "nombre edad altura objetivos" })
      .populate({
        path: "rutina_id",
        select: "ejercicio calorias_quemadas duracion",
      });

    res.status(201).json(usersRutina);
    if (!usersRutina || usersRutina.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No se encontraron rutinas para el usuario." });
    }
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({
        texto: "Ingrese un ID válido.",
      });
    }
    res.status(400).json({
      mensajito: "No se pudo obtener las rutinas del usuario.",
      error: error.message,
    });
  }
};
