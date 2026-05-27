//Rutas de servicios, para el panel administrativo y para el frontend, se expone para mostrar los servicios activos
import express from "express";
import {
  crearServicio,
  obtenerServicios,
} from "../controllers/servicesController.js";

const router = express.Router();

router.post("/", crearServicio); //para el panel administrativo, no se expone en el frontend
router.get("/", obtenerServicios);//para el frontend y para el agente IA, se expone para mostrar los servicios activos

export default router;