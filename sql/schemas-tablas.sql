CREATE DATABASE IF NOT EXISTS tonavtech;
USE tonavtech;

-- =========================================================
-- CREAR TABLAS PRINCIPALES
-- =========================================================

-- Tabla de leads:Para guardar los datos de los clientes potenciales que se generan a través de la IA, formularios web, WhatsApp, etc.
CREATE TABLE leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  dni_ruc VARCHAR(20) UNIQUE,
  email VARCHAR(150),
  telefono VARCHAR(30),
  empresa VARCHAR(150),
  rubro VARCHAR(100),
  ciudad VARCHAR(100),
  mensaje TEXT,
  origen ENUM('web', 'agente_ia', 'formulario', 'whatsapp') DEFAULT 'agente_ia',
  estado ENUM('nuevo', 'contactado', 'calificado', 'descartado', 'convertido') DEFAULT 'nuevo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Servicios: Para listar los servicios que ofrece la empresa, con sus descripciones y precios.
CREATE TABLE servicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  slug VARCHAR(120) UNIQUE,
  descripcion TEXT,
  activo BOOLEAN DEFAULT TRUE
);

--Lead servicios: Para relacionar los leads con los servicios que les interesan, permitiendo un seguimiento más detallado.
CREATE TABLE lead_servicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  servicio_id INT NOT NULL,
  FOREIGN KEY (lead_id) REFERENCES leads(id),
  FOREIGN KEY (servicio_id) REFERENCES servicios(id)
);

--conversaciones_ia: Para guardar las interacciones que los clientes tienen con la IA, lo que puede ayudar a mejorar el servicio y entender mejor las necesidades de los clientes.
CREATE TABLE conversaciones_ia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT,
  resumen TEXT,
  intencion VARCHAR(120),
  presupuesto_estimado VARCHAR(100),
  urgencia ENUM('baja', 'media', 'alta') DEFAULT 'media',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id)
);

--mensajes_ia: Para almacenar los mensajes individuales que se intercambian entre la IA y el cliente, lo que puede ser útil para análisis posteriores.
CREATE TABLE mensajes_ia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversacion_id INT NOT NULL,
  rol ENUM('user', 'assistant', 'system') NOT NULL,
  contenido TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversacion_id) REFERENCES conversaciones_ia(id)
);

--proyectos: Para gestionar los proyectos que se generan a partir de los leads convertidos, incluyendo detalles como el estado del proyecto, fechas importantes, etc.
CREATE TABLE proyectos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  nombre_proyecto VARCHAR(150) NOT NULL,
  tipo_proyecto VARCHAR(120),
  descripcion TEXT,
  estado ENUM('propuesta', 'aprobado', 'en_desarrollo', 'entregado', 'pausado', 'cancelado') DEFAULT 'propuesta',
  fecha_inicio DATE,
  fecha_entrega_estimada DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id)
);

--cotizaciones: Para registrar las cotizaciones que se generan para cada proyecto, con detalles sobre los servicios incluidos, precios, etc.
CREATE TABLE cotizaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proyecto_id INT NOT NULL,
  monto DECIMAL(10,2),
  moneda VARCHAR(10) DEFAULT 'PEN',
  descripcion TEXT,
  estado ENUM('pendiente', 'aceptada', 'rechazada') DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (proyecto_id) REFERENCES proyectos(id)
);

