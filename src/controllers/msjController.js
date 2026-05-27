import { pool } from "../config/db.js";

export const crearConversacion = async (req, res) => {
  try {
    const {
      lead_id,
      resumen,
      intencion,
      presupuesto_estimado,
      urgencia = "media",
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO conversaciones_ia 
      (lead_id, resumen, intencion, presupuesto_estimado, urgencia)
      VALUES (?, ?, ?, ?, ?)`,
      [lead_id, resumen, intencion, presupuesto_estimado, urgencia]
    );

    res.status(201).json({
      message: "Conversación registrada",
      conversacionId: result.insertId,
    });
  } catch (error) {
    console.error("Error al crear conversación:", error);
    res.status(500).json({ message: "Error al crear conversación" });
  }
};

export const guardarMensajeIA = async (req, res) => {
  try {
    const { conversacion_id, rol, contenido } = req.body;

    if (!conversacion_id || !rol || !contenido) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const [result] = await pool.query(
      `INSERT INTO mensajes_ia (conversacion_id, rol, contenido)
       VALUES (?, ?, ?)`,
      [conversacion_id, rol, contenido]
    );

    res.status(201).json({
      message: "Mensaje guardado",
      mensajeId: result.insertId,
    });
  } catch (error) {
    console.error("Error al guardar mensaje:", error);
    res.status(500).json({ message: "Error al guardar mensaje" });
  }
};

export const obtenerConversacionPorLead = async (req, res) => {
  try {
    const { leadId } = req.params;

    const [conversaciones] = await pool.query(
      `SELECT * FROM conversaciones_ia WHERE lead_id = ? ORDER BY created_at DESC`,
      [leadId]
    );

    res.json(conversaciones);
  } catch (error) {
    console.error("Error al obtener conversaciones:", error);
    res.status(500).json({ message: "Error al obtener conversaciones" });
  }
};