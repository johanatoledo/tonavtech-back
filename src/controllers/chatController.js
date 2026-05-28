
import OpenAI from 'openai';
import { SYSTEM_PROMPT } from '../config/prompts.js';
import { tools } from "../tools/chatTools.js";
import { consultarRuc, consultarDni } from '../services/apisPeru.js';
import { obtenerServicios } from "./servicesController.js";
import { crearLead } from "./leadsController.js";
import { crearCotizacion } from "./quotesController.js";
import { crearConversacion, guardarMensajeIA } from "./msjController.js";

import dotenv from 'dotenv';
dotenv.config();

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// ✅ FUNCIÓN AUXILIAR PARA VALIDAR MENSAJES
const sanitizeMessages = (messages) => {
  return messages.map(msg => ({
    role: msg.role,
    content: (msg.content && String(msg.content).trim()) || "Sin contenido disponible",
    ...(msg.tool_call_id && { tool_call_id: msg.tool_call_id }),
    ...(msg.name && { name: msg.name })
  })).filter(msg => {
    if (!msg.role || !['user', 'assistant', 'tool', 'system'].includes(msg.role)) {
      console.warn('⚠️ Mensaje inválido descartado:', msg);
      return false;
    }
    return true;
  });
};
 

// ✅ CONTROLLER PRINCIPAL DEL CHAT
export const chatController = async (req, res) => {
  const { messages, conversacionId } = req.body;

  // 1. Obtener el historial completo (solo mensajes del usuario para mayor precisión)
  const historialUsuario = messages
    .filter(m => m.role === 'user')
    .map(m => m.content || '')
    .join(' ')
    .toLowerCase();

  const ultimoMsjUsuario = [...messages].reverse().find(m => m.role === 'user');

    console.log('📨 Nuevo mensaje recibido:', ultimoMsjUsuario ? `${ultimoMsjUsuario.content.substring(0, 50)}...` : 'No se encontró mensaje de usuario');

  // 2. Si ya existe una conversación activa en Base de Datos, guardamos el mensaje entrante del usuario de inmediato
  if (conversacionId && ultimoMsjUsuario) {
    await guardarMensajeIA({
      conversacion_id: conversacionId,
      rol: 'user',
      content: ultimoMsjUsuario.content
    });
  }
  
  const mainSystemPrompt = `${SYSTEM_PROMPT}
     REGLAS DE OPERACIÓN CRÍTICAS PARA TONAVTECH:
     1. Tu primera interacción debe dar la bienvenida y listar los servicios usando 'obtener_servicios'.
     2. Recopila interactivamente: Nombre, Teléfono, Correo e Identificación (DNI o RUC).
     3. Ejecuta 'obtener_datos_dni' (8 dígitos) o 'obtener_datos_ruc' (11 dígitos) según corresponda.
     4. Con los datos completos, llama a 'guardar_lead'.
     5. Al recibir el 'leadId', ejecuta 'generar_cotizacion'.
     6. Envía el correo con 'enviar_cotizacion_email' y confirma al cliente de forma profesional.`;

  let conversationHistory = [{ role: 'system', content: mainSystemPrompt }, ...sanitizeMessages(messages) ];
 
  // Validación inicial
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ 
      error: 'El campo messages es requerido y debe ser un array.' 
    });
  }
 
  const invalido = messages.some(
    (m) => !m.role || !['user', 'assistant', 'system'].includes(m.role)
  );
  
  if (invalido) {
    return res.status(400).json({ 
      error: 'Formato de mensajes inválido.' 
    });
  }
   
 
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 300,
      temperature: 0.3,
      messages: conversationHistory,
      tools: tools,
      tool_choice: "auto"
    });
 
    let responseMessage = completion.choices[0].message;
    const toolCalls = responseMessage.tool_calls;
 
    if (toolCalls) {
      conversationHistory.push(responseMessage);
 
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        let functionResponse;

        console.log(`🔧 [IA Tool] Invocando: ${functionName}`);
        
    try {
      
          switch (functionName) {
            case "obtener_servicios":
              functionResponse = await obtenerServicios();
              break;

            case "obtener_datos_dni":
              functionResponse = await consultarDni(args.dni);
              break;

            case "obtener_datos_ruc":
              functionResponse = await consultarRuc(args.ruc);
              break;

            case "guardar_lead":
              functionResponse = await crearLead(args);

              // ⚡ INSTANCIA DE PERSISTENCIA MÁGICA: Si el lead se guardó correctamente,
              // creamos el registro base en la tabla 'conversaciones_ia' vinculando su lead_id
              if (functionResponse && functionResponse.leadId) {
                console.log(`📊 [Admin Tracker] Creando conversación para el Lead ID: ${functionResponse.leadId}`);
                conversacionId = await crearConversacion({
                  lead_id: functionResponse.leadId,
                  resumen: `Conversación con ${args.nombre || 'Cliente potencial'}`,
                  intencion: `Interés en: ${args.rubro || 'Desarrollo Digital'}`
                });
              }
              break;

            case "generar_cotizacion":
              functionResponse = await crearCotizacion({
                proyecto_id: args.lead_id,
                monto: args.monto,
                descripcion: args.descripcion
              });
              break;

            case "enviar_cotizacion_email":
              functionResponse = { success: true, message: "Correo enviado conforme." };
              break;

            default:
              functionResponse = { status: "error", message: "Función no reconocida." };
          }
        } catch (err) {
          console.error(`❌ Error en función ${functionName}:`, err);
          functionResponse = { success: false, message: "Error en el servidor de TonavTech." };
        }

        conversationHistory.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: JSON.stringify(functionResponse)
        });
      }

      const secondResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: conversationHistory
      });

      const finalAssistantMessage = secondResponse.choices[0].message;
      // Si tenemos un id de conversación inicializado o heredado, guardamos la respuesta de la IA
      if (conversacionId && finalAssistantMessage?.content) {
        await guardarMensajeIA({
          conversacion_id: conversacionId,
          rol: 'assistant',
          contenido: finalAssistantMessage.content
        });
      }

      return res.status(200).json({ 
        result: finalAssistantMessage,
        conversacionId // Devolvemos el ID al cliente para que lo rastree en los siguientes mensajes
      });
    }

    // Guardado de respuesta directa si la conversación ya posee tracking activo en el panel
    if (conversacionId && responseMessage?.content) {
      await guardarMensajeIA({
        conversacion_id: conversacionId,
        rol: 'assistant',
        contenido: responseMessage.content
      });
    }

    return res.status(200).json({ 
      result: responseMessage,
      conversacionId 
    });

  } catch (error) {
    console.error('❌ Error Core Chat:', error);
    return res.status(500).json({ error: 'Asistente no disponible.' });
  }
   
};
       
 
      
 
 
 