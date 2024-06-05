import { Citas } from "../models/citas.models.js";
import { User } from "../models/users.models.js";

export const crearCita = async (req, res) => {
  const { user_id, fecha, tipo } = req.body;

  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ mensaje: "User no encontrado" });
    }

    let campoCitas;
    switch (tipo) {
      case "Medicina general":
        campoCitas = "citas.medicina_general";
        break;
      case "Psicologia":
        campoCitas = "citas.psicologia";
        break;
      case "Especialista":
        campoCitas = "citas.especialista";
        break;
      default:
        return res.status(400).json({ mensaje: "Tipo de cita no válido" });
    }

    if (user.citas[tipo.toLowerCase().replace(" ", "_")] > 0) {
      const cita = new Citas({
        user_id,
        fecha: new Date(fecha),
        tipo,
        estado: "Programada",
      });
      await User.findByIdAndUpdate(user_id, {
        $inc: { [campoCitas]: -1 },
      });
      await cita.save();
      res.status(201).json(cita);
    } else {
      res.status(400).json({
        mensaje: `El usuario no tiene citas disponibles para ${tipo}`,
      });
    }
  } catch (error) {
    console.error(error.message);
    if (error.name === "CastError") {
      res.status(404).json({ mensaje: "Error. Ingrese un ID válido." });
    } else {
      res.status(400).json({ mensaje: "Error para crear la cita." });
    }
  }
};

export const obtenerCitas = async (req, res) => {
  try {
    const citas = await Citas.find().populate(
      {path:"user_id",select:"nombre apellido citas.medicina_general citas.psicologia citas.especialista"}
    );
    res.status(201).json(citas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const obtenerCitaPorUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id);
    if (!user) {
      return res.status(404).json({ mensaje: "Usario no encontrado" });
    }

    const citas = await Citas.find({ user_id: req.params.user_id });
    res.status(201).json(citas);
  } catch (error) {
    if (error.name === "CastError") {
      res.status(404).json({ mensaje: "Ingrese un ID válido" });
    } else {
      res.status(400).json(error.mensaje);
    }
  }
};

export const cancelarCita = async (req, res) => {
  try {
    const cita = await Citas.findByIdAndUpdate(
      req.params.id,
      {
        estado: "Cancelada",
      },
      { new: true }
    );

    let campoCitas;
    switch (cita.tipo) {
      case "Medicina general":
        campoCitas = "citas.medicina_general";
        break;
      case "Psicologia":
        campoCitas = "citas.psicologia";
        break;
      case "Especialista":
        campoCitas = "citas.especialista";
        break;
      default:
        return res.status(400).json({ mensaje: "Tipo de cita no válido" });
    }

    //WARNING: una vez se defina el número de citas, se debe validar que
    // el incremento del numero de citas no supere el limite.
    await User.findByIdAndUpdate(cita.user_id, {
      $inc: { [campoCitas]: +1 },
    });

    res.json(cita);
  } catch (error) {
    if (error.name === "CastError") {
      res.status(404).json({ mensaje: "Error. Ingrese un ID válido." });
    } else {
      res.status(400).json({ mensaje: "No se pudo cancelar la cita." });
    }
  }
};

export const eliminarCita = async (req, res) => {
  try {
    const cita = await Citas.findByIdAndDelete(req.params.id);

    //obtenemos el tipo de cita que se va a eliminar
    let campoCitas;
    switch (cita.tipo) {
      case "Medicina general":
        campoCitas = "citas.medicina_general";
        break;
      case "Psicologia":
        campoCitas = "citas.psicologia";
        break;
      case "Especialista":
        campoCitas = "citas.especialista";
        break;
      default:
        return res.status(400).json({ mensaje: "Tipo de cita no válido" });
    }

    //Una vez eliminada la cita debemos incrementar la cantidad de citas
    //del usuario que tenia agendada.
    const user = await User.findByIdAndUpdate(cita.user_id, {
      $inc: { [campoCitas]: +1 },
    });
    res.json({ mensaje: "Cita eliminada con éxito" });
  } catch (error) {
    if (error.name === "CastError") {
      res.status(400).json("Error. Ingrese un ID válido");
    } else {
    }
  }
};

export const reprogramarCita = async (req, res) => {
  console.log("Entrando acá?");
  console.log(req.params.id + " " + req.params.nueva_fecha);
  try {
    const { id, nueva_fecha } = req.params;
    const cita = await Citas.findById(id);
    if (cita.estado === "Cancelada") {
      return res.json({
        mensaje: "No es posible reprogramar una cita previamente cancelada.",
      });
    }

    const citaActualizada = await Citas.findByIdAndUpdate(
      id,
      { fecha: nueva_fecha },
      { new: true }
    );
    //const cita = await Citas.findByIdAndUpdate(req.params.id, {fecha:req.params.nueva_fecha}, {new:true} );
    res.json(citaActualizada);
  } catch (error) {
    if (error.name === "CastError") {
      res.status(404).json({ mensaje: "Error. Ingrese un ID válido." });
    } else {
      res.status(400).json({
        test: "No se pudo reprogramar la cita.",
        mensaje: error.message,
      });
    }
  }
};

