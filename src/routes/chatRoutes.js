import express from "express";
import {
  crearLead,
  obtenerLeads,
  obtenerLeadPorId,
  actualizarEstadoLead,
} from "../controllers/leadsController.js";
import {
  crearConversacion,
  guardarMensajeIA,
  obtenerConversacionPorLead,
} from "../controllers/msjController.js";
import {obtenerServicios } from "../controllers/servicesController.js";

const router = express.Router();
// Leads
router.post("/leads", crearLead);
router.get("/leads", obtenerLeads);
router.get("/leads/:id", obtenerLeadPorId);
router.patch("/leads/:id/estado", actualizarEstadoLead);

// Conversaciones
router.post("/nuevomsj", crearConversacion);
router.post("/msjIA", guardarMensajeIA);
router.get("/msj/lead/:leadId", obtenerConversacionPorLead);

// Servicios
router.get("/servicios", obtenerServicios);

export default router;