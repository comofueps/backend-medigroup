import express from "express";
import morgan from "morgan";

import indexRoutes from "./routes/index.routes.js";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api", indexRoutes);

export default app;
