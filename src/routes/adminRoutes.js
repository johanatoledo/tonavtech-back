import express from "express";
import {obtenerConversacionPorLead } from "../controllers/msjController.js";
import {crearServicio } from "../controllers/servicesController.js";
import {
    crearProyecto, 
    obtenerProyectos } from "../controllers/projectController.js";
import {
  crearCotizacion,
  obtenerCotizaciones,
} from "../controllers/quotesController.js";


const router = express.Router();
// ==========================================
// DEFINICIÓN DE ENDPOINTS
// ==========================================
// Rutas para servicios
router.post("/servicios", crearServicio); //para el panel administrativo.
// Rutas para conversaciones
router.get("/conversaciones/lead/:leadId", obtenerConversacionPorLead);//para tener acceso a las conversaciones y asi ver el estado de los leads, se expone para el panel administrativo.

// Rutas para proyectos
router.post("/proyectos", crearProyecto); 
router.get("/proyectos", obtenerProyectos); 

// Rutas para cotizaciones
router.post("/cotizaciones", crearCotizacion);
router.get("/cotizaciones", obtenerCotizaciones);


export default router;