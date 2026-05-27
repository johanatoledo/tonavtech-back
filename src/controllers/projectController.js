//Para guardar y obtener informacion de los proyectos 
import { pool } from "../config/db.js";

export const crearProyecto = async (req, res) => {
  try {
    const {
      lead_id,
      nombre_proyecto,
      tipo_proyecto,
      descripcion,
      fecha_inicio,
      fecha_entrega_estimada,
    } = req.body;

    if (!lead_id || !nombre_proyecto) {
      return res.status(400).json({ message: "Lead y nombre del proyecto son obligatorios" });
    }

    const [result] = await pool.query(
      `INSERT INTO proyectos 
      (lead_id, nombre_proyecto, tipo_proyecto, descripcion, fecha_inicio, fecha_entrega_estimada)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [lead_id, nombre_proyecto, tipo_proyecto, descripcion, fecha_inicio, fecha_entrega_estimada]
    );

    res.status(201).json({
      message: "Proyecto creado correctamente",
      proyectoId: result.insertId,
    });
  } catch (error) {
    console.error("Error al crear proyecto:", error);
    res.status(500).json({ message: "Error al crear proyecto" });
  }
};

export const obtenerProyectos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, l.nombre AS cliente_nombre, l.empresa
      FROM proyectos p
      INNER JOIN leads l ON p.lead_id = l.id
      ORDER BY p.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    res.status(500).json({ message: "Error al obtener proyectos" });
  }
};