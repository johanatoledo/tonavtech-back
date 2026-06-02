export const tools = [
  {
    type: "function",
    function: {
      name: "obtener_servicios",
      description: "Obtiene todos los servicios disponibles desde la base de datos",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },

  {
    type: "function",
    function: {
      name: "obtener_datos_dni",
      description: "Consulta datos por DNI",
      parameters: {
        type: "object",
        properties: {
          dni: { type: "string" }
        },
        required: ["dni"]
      }
    }
  },

  {
    type: "function",
    function: {
      name: "obtener_datos_ruc",
      description: "Consulta datos por RUC",
      parameters: {
        type: "object",
        properties: {
          ruc: { type: "string" }
        },
        required: ["ruc"]
      }
    }
  },

  {
    type: "function",
    function: {
      name: "guardar_lead",
      description: "Guarda los datos del cliente interesado",
      parameters: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          dni_ruc: { type: "string" },
          email: { type: "string" },
          telefono: { type: "string" },
          empresa: { type: "string" },
          rubro: { type: "string" },
          ciudad: { type: "string" },
          mensaje: { type: "string" },
          origen: { type: "string" },
          servicios: {
            type: "array",
            items: { type: "number" }
          }
        },
        required: [
          "nombre",
          "dni_ruc",
          "telefono",
          "servicios"
        ]
      }
    }
  },

  {
    type: "function",
    function: {
      name: "generar_cotizacion",
      description: "Genera y registra la cotización del servicio",
      parameters: {
        type: "object",
        properties: {
          lead_id: { type: "number" },
          servicio_id: { type: "number" },
          descripcion: { type: "string" },
          monto: { type: "number" }
        },
        required: [
          "lead_id",
          "servicio_id",
          "descripcion",
          "monto"
        ]
      }
    }
  },

  {
    type: "function",
    function: {
      name: "enviar_cotizacion_email",
      description: "Envía la cotización al email del cliente",
      parameters: {
        type: "object",
        properties: {
          email: { type: "string" },
          nombre: { type: "string" },
          servicio: { type: "string" },
          monto: { type: "number" },
          descripcion: { type: "string" }
        },
        required: [
          "email",
          "nombre",
          "servicio"
        ]
      }
    }
  },

  {
  type: "function",
  function: {
    name: "enviar_cotizacion_email",
    description: "Envía por correo electrónico la cotización del servicio solicitado por el cliente.",
    parameters: {
      type: "object",
      properties: {
        email: { type: "string" },
        nombre: { type: "string" },
        servicio: { type: "string" },
        monto: { type: "number" },
        descripcion: { type: "string" }
      },
      required: ["email", "nombre", "servicio", "descripcion"]
    }
  }
}

];