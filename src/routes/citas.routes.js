import { Router } from "express";
import {
  cancelarCita,
  crearCita,
  eliminarCita,
  obtenerCitaPorUser,
  obtenerCitas,
  reprogramarCita,
} from "../controllers/citas.controllers.js";

const router = Router();

router.post("/citas", crearCita);
router.get("/citas", obtenerCitas);
router.get("/citas/:user_id", obtenerCitaPorUser);
router.put("/cancelar_cita/:id", cancelarCita);
router.put("/citas/:id/:nueva_fecha", reprogramarCita);
router.delete("/citas/:id", eliminarCita);

export default router;
