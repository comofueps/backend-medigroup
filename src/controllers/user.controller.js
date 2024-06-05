import { User } from "../models/users.models.js";
import { Comidas } from "../models/comidas.models.js";
import { UsersRutina } from "../models/usersrutinas.models.js";
import { Progreso } from "../models/progreso.model.js";

export const calcularImc = async (peso, altura) => {
  const alturaMetros = altura / 100;
  const imc = (peso / alturaMetros ** 2).toFixed(2);

  let nivel_peso = "";
  switch (true) {
    case imc < 18.5:
      nivel_peso = "Bajo peso";
      break;
    case imc < 24.9:
      nivel_peso = "Peso normal";
      break;
    case imc < 29.9:
      nivel_peso = "Sobrepeso";
      break;
    case imc < 34.9:
      nivel_peso = "Obesidad tipo I";
      break;
    case imc < 39.9:
      nivel_peso = "Obesidad tipo II";
      break;
    default:
      nivel_peso = "Obesidad tipo III";
  }
  return { imc, nivel_peso };
};

export const crearProgreso = async (peso, altura, userId, fecha) => {
  const { imc, nivel_peso } = await calcularImc(peso, altura);
  console.log("Imprimiendo desde la función crear progreso");
  console.log(imc);
  console.log(nivel_peso);
  const progreso = new Progreso({
    user_id: userId,
    imc,
    nivel_peso,
    peso_actual: peso,
    fecha: new Date(fecha),
  });
  await progreso.save();
};

export const actualizarProgreso = async (userId, peso, altura) => {
  const { imc, nivel_peso } = await calcularImc(peso, altura);

  let progreso = await Progreso.findOne({ user_id: userId });
  progreso.peso_actual = peso;
  progreso.imc = imc;
  progreso.nivel_peso = nivel_peso;
  await progreso.save();
  console.log(progreso);
};

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find();
    res.status(201).send(usuarios);
  } catch (error) {
    res.status(400).json("No se pudo obtener los usuarios.");
  }
};

export const obtenerUsuario = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ Mensaje: "Usuario no encontrado" });
    }
    res.status(201).json(user);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json("Ingrese un ID válido.");
    }

    res.status(400).json("No se pudo obtener el usuario.");
  }
};

export const crearUsuario = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      edad,
      altura,
      peso_inicial,
      genero,
      objetivos,
      citas = {},
    } = req.body;

    const { medicina_general = 10, psicologia = 10, especialista = 10 } = citas;

    const usuario = new User({
      nombre,
      apellido,
      edad,
      altura,
      peso_inicial,
      genero,
      objetivos,
      citas: {
        medicina_general,
        psicologia,
        especialista,
      },
    });

    // Obtener la fecha actual
    const currentDate = new Date(Date.now());

    // Establecer las horas, minutos, segundos y milisegundos a 00:00:00.000
    currentDate.setUTCHours(0, 0, 0, 0);

    // Convertir la fecha al formato ISO
    const formattedDate = currentDate.toISOString();

    await usuario.save();
    crearProgreso(
      usuario.peso_inicial,
      usuario.altura,
      usuario.id,
      formattedDate
    );

    res.status(201).json(usuario);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Error al registrar el usuario", error: error.message });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ Mensaje: "Usuario no encontrado" });
    }

    await actualizarProgreso(user.id, user.peso_inicial, user.altura);
    //console.log(user.peso_inicial), console.log(user.altura);

    res.status(201).json(user);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json("Ingrese un ID válido.");
    }
    res.status(400).json("No se pudo actualizar el usuario.");
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ Mensaje: "Usuario no encontrado." });
    }
    const progreso = await Progreso.findOne({ user_id: user.id });
    await progreso.deleteOne();
    res.status(201).json(user);
  } catch (error) {
    if (error.name === "CastError") {
      return res.stats(404).json("Usuario no encontrado.");
    }
    res.status(400).json({
      mensaje: "No se pudo eliminar el usuario.",
      error: error.message,
    });
  }
};
