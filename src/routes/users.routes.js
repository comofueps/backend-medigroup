import { Router } from "express";
import {
  actualizarUsuario,
  crearUsuario,
  eliminarUsuario,
  obtenerUsuarios,
  obtenerUsuario,
  // obtenerCaloriasConsumidas,
  // obtenerCaloriasQuemdas,
  //actualizarProgreso,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/users", crearUsuario);
router.get("/users", obtenerUsuarios);
router.get("/users/:id", obtenerUsuario);
router.put("/users/:id", actualizarUsuario);
router.delete("/users/:id", eliminarUsuario);
//router.get("/users/:id/:fecha", actualizarProgreso);
//router.get("/actualizar-progreso", actualizarProgreso);
//router.get("/progreso/user/:id/:fecha", obtenerCaloriasQuemdas);

export default router;
