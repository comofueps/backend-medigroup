import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/users.routes.js";
import comidasRoutes from "./routes/comidas.routes.js";
import alimentosRoutes from "./routes/alimentos.routes.js";
import citasRoutes from "./routes/citas.routes.js";
import rutinasRoutes from "./routes/rutinas.routes.js";
import usersrutinasRoutes from "./routes/usersrutinas.routes.js";
import progresoRoutes from "./routes/progreso.routes.js";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/api", userRoutes);
app.use("/api", comidasRoutes);
app.use("/api", alimentosRoutes);
app.use("/api", citasRoutes);
app.use("/api", rutinasRoutes);
app.use("/api", usersrutinasRoutes);
app.use("/api", progresoRoutes);

export default app;
