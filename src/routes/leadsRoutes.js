import express from "express";
import {
  crearLead,
  obtenerLeads,
  obtenerLeadPorId,
  actualizarEstadoLead,
} from "../controllers/leadsController.js";

const router = express.Router();

router.post("/", crearLead);
router.get("/", obtenerLeads);
router.get("/:id", obtenerLeadPorId);
router.patch("/:id/estado", actualizarEstadoLead);

export default router;