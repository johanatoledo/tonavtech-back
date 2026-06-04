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

export const obtenerServicioPorId = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, nombre, slug, descripcion 
     FROM servicios 
     WHERE id = ? AND activo = TRUE`,
    [id]
  );

  return rows[0] || null;
};

export const actualizarEstadoServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    // Validación rápida de tipos
    if (typeof activo !== 'boolean') {
      return res.status(400).json({ 
        message: "El campo 'activo' es obligatorio y debe ser un valor booleano (true/false)." 
      });
    }

    // Ejecutamos la actualización atómica en MySQL
    const [result] = await pool.query(
      `UPDATE servicios SET activo = ? WHERE id = ?`,
      [activo, id]
    );

    // Si no se afectó ninguna fila, significa que el ID no existe
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "No se encontró el servicio solicitado en el catálogo." 
      });
    }

    console.log(`🔄 [MySQL] Servicio ID ${id} actualizado. Estado activo: ${activo}`);

    return res.status(200).json({
      success: true,
      message: `El estado del servicio se actualizó correctamente a: ${activo ? 'Activo' : 'Inactivo'}`
    });

  } catch (error) {
    console.error("❌ Error en actualizarEstadoServicio:", error);
    return res.status(500).json({ 
      message: "Error interno en el servidor al intentar cambiar el estado del servicio." 
    });
  }
};