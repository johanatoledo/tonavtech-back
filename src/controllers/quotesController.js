import { pool } from "../config/db.js";

export const crearCotizacion = async (req, res) => {
  try {
    const {
      proyecto_id,
      monto,
      moneda = "PEN",
      descripcion,
    } = req.body;

    if (!proyecto_id || !monto) {
      return res.status(400).json({ message: "Proyecto y monto son obligatorios" });
    }

    const [result] = await pool.query(
      `INSERT INTO cotizaciones 
      (proyecto_id, monto, moneda, descripcion)
      VALUES (?, ?, ?, ?)`,
      [proyecto_id, monto, moneda, descripcion]
    );

    res.status(201).json({
      message: "Cotización creada correctamente",
      cotizacionId: result.insertId,
    });
  } catch (error) {
    console.error("Error al crear cotización:", error);
    res.status(500).json({ message: "Error al crear cotización" });
  }
};

export const obtenerCotizaciones = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, p.nombre_proyecto
      FROM cotizaciones c
      INNER JOIN proyectos p ON c.proyecto_id = p.id
      ORDER BY c.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener cotizaciones:", error);
    res.status(500).json({ message: "Error al obtener cotizaciones" });
  }
};