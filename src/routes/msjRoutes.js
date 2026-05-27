import express from "express";
import {
  crearConversacion,
  guardarMensajeIA,
  obtenerConversacionPorLead,
} from "../controllers/msjController.js";

const router = express.Router();

router.post("/", crearConversacion);
router.post("/mensajes", guardarMensajeIA);
router.get("/lead/:leadId", obtenerConversacionPorLead);

export default router;