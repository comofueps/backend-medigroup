import { Router } from "express";
import { obtenerProgresoUsuarioFecha } from "../controllers/progreso.controller.js";
//import { crearProgreso } from "../controllers/progreso.controller.js";

const router = Router();

//router.post("/progreso", crearProgreso);

router.get("/progreso/:id/:fecha", obtenerProgresoUsuarioFecha);

export default router;
