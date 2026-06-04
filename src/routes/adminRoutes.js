import express from "express";
import { obtenerConversacionPorLead } from "../controllers/msjController.js";
import { crearServicio, obtenerServicios, actualizarEstadoServicio } from "../controllers/servicesController.js";
import { crearProyecto, obtenerProyectos } from "../controllers/projectController.js";
import { crearCotizacion, obtenerCotizaciones } from "../controllers/quotesController.js";
// Importamos también el controlador de leads para que la agenda de tu panel cargue los datos reales
import { obtenerLeads } from "../controllers/leadsController.js";

const router = express.Router();

// ==========================================
// DEFINICIÓN DE ENDPOINTS PARA EL PANEL ADMIN
// ==========================================

// 👥 Rutas para la Agenda de Leads
router.get("/leads", obtenerLeads); 

// 🛠️ Rutas para el CRUD de Servicios (Catálogo)
router.post("/servicios", crearServicio); 
router.get("/servicios", obtenerServicios); // Expuesto para que el panel dibuje el catálogo actual
router.patch("/servicios/:id", actualizarEstadoServicio);
// 📊 Rutas para Conversaciones e Hilos de la IA
router.get("/conversaciones/lead/:leadId", obtenerConversacionPorLead);

// 🚀 Rutas para Proyectos
router.post("/proyectos", crearProyecto); 
router.get("/proyectos", obtenerProyectos); 

// 💰 Rutas para Cotizaciones
router.post("/cotizaciones", crearCotizacion);
router.get("/cotizaciones", obtenerCotizaciones);

export default router;