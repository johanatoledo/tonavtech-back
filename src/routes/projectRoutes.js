import express from "express";
import {
  crearProyecto,
  obtenerProyectos,
} from "../controllers/projectController.js";

const router = express.Router();

router.post("/", crearProyecto);
router.get("/", obtenerProyectos);

export default router;