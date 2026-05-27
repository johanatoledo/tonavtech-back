import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import leadsRoutes from "./routes/leadsRoutes.js";
import servicesRoutes from "./routes/servicesRoutes.js";
import msjRoutes from "./routes/msjRoutes.js";
import projectsRoutes from "./routes/projectsRoutes.js";
import quotesRoutes from "./routes/quotesRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4003;

// ==========================================
// CONFIGURACIÓN DE ORIGINS PERMITIDOS
// ==========================================

const allowedOrigins = [
  'https://www.tonav-tech.com',
  'http://localhost:4003',
   "http://localhost:3000"
].filter(Boolean);

// ==========================================
// CONFIGURACIÓN DE CORS 
// ==========================================
const corsOptions = {
  origin: function(origin, callback) {
    
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }else{
         callback(new Error(`CORS bloqueado para origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
    'Bypass-Tunnel-Reminder'
  ],
  exposedHeaders: ['Content-Length', 'X-JSON-Response'],
  maxAge: 86400 
};
// Aplicar CORS globalmente
app.use(cors(corsOptions));


app.use(express.json());
// ==========================================
// Verificacion de funcionamiento de rutas 
// ==========================================

app.get("/", (req, res) => {
  res.json({ message: "API TonavTech funcionando correctamente" });
});


// ==========================================
// Verificacion de conexion con base de datos
// ==========================================

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

// ==========================================
// DEFINICIÓN DE ENDPOINTS
// ==========================================

app.use("/leads", leadsRoutes); // Mantener este endpoint sin prefijo para que el formulario de contacto funcione correctamente
app.use("/admin/servicios", servicesRoutes);
app.use("/admin/conversaciones", msjRoutes);
app.use("/admin/proyectos", projectsRoutes);
app.use("/admin/cotizaciones", quotesRoutes);



// ==========================================
// MANEJO DE ERRORES
// ==========================================

 // Error de rutas
app.use((req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada",
  });
});

// Error de CORS
app.use((err, req, res, next) => {
 
  if (err.message === 'CORS no permitido') {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'El origen de tu request no está permitido'
    });
  }
  
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
app.listen(PORT,"0.0.0.0",() => {
  console.log(`Server running on port ${PORT}`);

});