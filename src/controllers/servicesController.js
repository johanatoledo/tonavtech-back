import { pool } from "../config/db.js";

export const crearServicio = async (req, res) => {
  try {
    const { nombre, slug, descripcion } = req.body;

    if (!nombre || !slug) {
      return res.status(400).json({ message: "Nombre y slug son obligatorios" });
    }

    const [result] = await pool.query(
      `INSERT INTO servicios (nombre, slug, descripcion)
       VALUES (?, ?, ?)`,
      [nombre, slug, descripcion]
    );

    res.status(201).json({
      message: "Servicio creado correctamente",
      servicioId: result.insertId,
    });
  } catch (error) {
    console.error("Error al crear servicio:", error);
    res.status(500).json({ message: "Error al crear servicio" });
  }
};

export const obtenerServicios = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM servicios WHERE activo = TRUE ORDER BY nombre ASC`
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    res.status(500).json({ message: "Error al obtener servicios" });
  }
};