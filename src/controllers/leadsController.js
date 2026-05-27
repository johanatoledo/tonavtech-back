import { pool } from "../config/db.js";

export const crearLead = async (req, res) => {
  try {
    const {
      nombre,
      dni_ruc,
      email,
      telefono,
      empresa,
      rubro,
      ciudad,
      mensaje,
      origen = "agente_ia",
      servicios = [],
    } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const [result] = await pool.query(
      `INSERT INTO leads 
      (nombre, dni_ruc, email, telefono, empresa, rubro, ciudad, mensaje, origen)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, dni_ruc, email, telefono, empresa, rubro, ciudad, mensaje, origen]
    );

    const leadId = result.insertId;

    if (Array.isArray(servicios) && servicios.length > 0) {
      const values = servicios.map((servicioId) => [leadId, servicioId]);

      await pool.query(
        `INSERT INTO lead_servicios (lead_id, servicio_id) VALUES ?`,
        [values]
      );
    }

    res.status(201).json({
      message: "Lead creado correctamente",
      leadId,
    });
  } catch (error) {
    console.error("Error al crear lead:", error);
    res.status(500).json({ message: "Error interno al crear lead" });
  }
};

export const obtenerLeads = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM leads
      ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener leads:", error);
    res.status(500).json({ message: "Error al obtener leads" });
  }
};

export const obtenerLeadPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const [leadRows] = await pool.query(
      `SELECT * FROM leads WHERE id = ?`,
      [id]
    );

    if (leadRows.length === 0) {
      return res.status(404).json({ message: "Lead no encontrado" });
    }

    const [serviciosRows] = await pool.query(
      `SELECT s.*
       FROM servicios s
       INNER JOIN lead_servicios ls ON s.id = ls.servicio_id
       WHERE ls.lead_id = ?`,
      [id]
    );

    res.json({
      ...leadRows[0],
      servicios: serviciosRows,
    });
  } catch (error) {
    console.error("Error al obtener lead:", error);
    res.status(500).json({ message: "Error al obtener lead" });
  }
};

export const actualizarEstadoLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    await pool.query(
      `UPDATE leads SET estado = ? WHERE id = ?`,
      [estado, id]
    );

    res.json({ message: "Estado del lead actualizado" });
  } catch (error) {
    console.error("Error al actualizar lead:", error);
    res.status(500).json({ message: "Error al actualizar lead" });
  }
};