import { Router } from "express";
import {
  actualizarRutina,
  crearRutina,
  eliminarRutina,
  obtenerRutinas,
  obtenerRutinasPorTipo,
} from "../controllers/rutinas.controller.js";

const router = Router();

router.get("/rutinas", obtenerRutinas);
router.post("/rutinas", crearRutina);
router.get("/rutinas/:tipo_entrenamiento", obtenerRutinasPorTipo);
router.put("/rutinas/:id", actualizarRutina);
router.delete("/rutinas/:id", eliminarRutina);

export default router;
