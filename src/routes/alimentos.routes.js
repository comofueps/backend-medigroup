import { Router } from "express";
import {
  buscarAlimentos,
  crearAlimento,
  obtenerAlimentos,
  obtenerAlimentoPorId,
} from "../controllers/alimentos.controllers.js";

const router = Router();

router.post("/alimentos", crearAlimento);
router.get("/alimentos", obtenerAlimentos);
router.get("/alimentos_nombre/:nombre", buscarAlimentos);
router.get("/alimentos/:id", obtenerAlimentoPorId);

export default router;
