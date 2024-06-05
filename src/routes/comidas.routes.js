import { Router } from "express";
import {
  actualizarComida,
  crearComida,
  eliminarComida,
  obtenerComida,
  obtenerComidaPorUsuario,
  obtenerComidas,
} from "../controllers/comidas.controller.js";

const router = Router();

router.get("/comidas", obtenerComidas);
router.get("/comidas/:id/:fecha", obtenerComidaPorUsuario);
router.get("/comidas/:id", obtenerComida);
router.post("/comidas", crearComida);
router.put("/comidas/:id", actualizarComida);
router.delete("/comidas/:id", eliminarComida);

export default router;
