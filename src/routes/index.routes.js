import { Router } from "express";
import userRoutes from "./users.routes.js";
import comidasRoutes from "./comidas.routes.js";
import alimentosRoutes from "./alimentos.routes.js";
import citasRoutes from "./citas.routes.js";
import rutinasRoutes from "./rutinas.routes.js";
import usersrutinasRoutes from "./usersrutinas.routes.js";
import progresoRoutes from "./progreso.routes.js";

const router = Router();

router.use("", userRoutes);
router.use("", comidasRoutes);
router.use("", alimentosRoutes);
router.use("", citasRoutes);
router.use("", rutinasRoutes);
router.use("", usersrutinasRoutes);
router.use("", progresoRoutes);

export default router;
