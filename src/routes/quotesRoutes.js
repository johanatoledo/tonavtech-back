import express from "express";
import {
  crearCotizacion,
  obtenerCotizaciones,
} from "../controllers/quotesController.js";

const router = express.Router();

router.post("/", crearCotizacion);
router.get("/", obtenerCotizaciones);

export default router;