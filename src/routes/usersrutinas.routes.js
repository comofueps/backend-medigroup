import { Router } from "express";
import {
  actualizarEstado,
  asignarRutina,
  obtenerRutinasDeUsuario,
  obtenerUsuariosRutinas,
} from "../controllers/usersrutina.controller.js";

const router = Router();

router.post("/entrenamiento", asignarRutina);
router.get("/entrenamiento", obtenerUsuariosRutinas);
router.put("/entrenamiento/:id", actualizarEstado);
router.get("/entrenamiento/:id", obtenerRutinasDeUsuario);

export default router;
