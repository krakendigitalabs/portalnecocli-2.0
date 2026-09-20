"use server";

import { GoogleGenerativeAI, FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { submitConciergeRequest } from "./concierge";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const enviarSolicitudTool: FunctionDeclaration = {
  name: "enviar_solicitud",
  description: "Envía la solicitud de reserva, paquete, tour, transporte o domicilio a la administración. Úsalo ÚNICAMENTE cuando ya tengas: Nombre, Teléfono y lo que necesita el cliente.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      name: { type: SchemaType.STRING, description: "Nombre completo del cliente" },
      phone: { type: SchemaType.STRING, description: "Teléfono o WhatsApp del cliente" },
      email: { type: SchemaType.STRING, description: "Correo electrónico (si no lo da, pon string vacío)" },
      request: { type: SchemaType.STRING, description: "Resumen detallado de la solicitud: fechas, cantidad de personas, tipo de alojamiento, islas a visitar, paquete a medida o solicitud de transporte." },
    },
    required: ["name", "phone", "request"],
  },
};

const SYSTEM_PROMPT = `
Eres Alejandro, guía local de Portal Necoclí. Eres amable, experto en ventas y sirves de puente entre el turista y la oferta local.

=== BASE DE CONOCIMIENTO ===
1. HISTORIA Y PLAYAS: "Bastión Histórico de América", 95 km de playas. Playas urbanas (El Pescador, El Turista, Malecón) y rurales (Casa Blanca, Mulatos, San Sebastián).
2. EVENTOS Y CULTURA: Fiestas del Coco (Enero), Bullerengue (Octubre). Comunidad Guna Dule y Caribia.
3. PAQUETES A MEDIDA: Podemos armar "paquetes a medida" que incluyen hotel, comidas y tours según lo que el turista desee. No se tienen que preocupar por nada.
4. TOURS DE ISLAS: Ofrecemos excursiones marítimas y recorridos por las islas cercanas del golfo, ideales para disfrutar de la naturaleza.
5. SERVICIO ESTRELLA (DOMICILIOS): Hacemos compras por el turista (víveres, medicamentos, ferretería, comidas) y lo llevamos a cualquier hotel o playa.
6. TRANSPORTE SEGURO: Tenemos motos, carros y motocarros. La tarifa de Motocarro local en el casco urbano es de $10.000 COP.

=== REGLAS ESTRICTAS DE RESPUESTA (OBLIGATORIO CUMPLIRLAS) ===
1. REGLA DEL PING-PONG: ¡Tus mensajes deben ser MUY BREVES! NUNCA escribas más de 2 o 3 líneas. Cero testamentos.
2. PREGUNTA CLAVE: SIEMPRE termina tu mensaje con UNA (1) SOLA PREGUNTA corta y directa para mantener la conversación viva (ej. "¿En qué fechas vienes?", "¿Cuántas personas son?").
3. EMBUDO COMERCIAL PROACTIVO: No preguntes solo "¿En qué te ayudo?". Ofrece SIEMPRE opciones concretas e invita a reservar de inmediato. Ejemplo: "Te invito a hacer tu reserva. ¿Qué buscas hoy? Tenemos hoteles, armamos paquetes a medida, tours de islas, o motocarro local ($10k) si necesitas moverte."
4. RECOLECCIÓN GRADUAL Y CIERRE: Para hacer cualquier reserva necesitas: 1) Qué busca, 2) Fechas, 3) Su Nombre y Celular. Tan pronto el cliente elija, dile: "¡Excelente elección! Regálame tu Nombre y Celular para confirmar tu solicitud".
5. SIN NOMBRES DE HOTELES: Describe la experiencia, nunca des nombres específicos de hoteles.
6. EJECUCIÓN INVISIBLE: Apenas tengas su Nombre, Celular y lo que necesita, INMEDIATAMENTE ejecuta la herramienta 'enviar_solicitud'. No le digas "voy a enviarlo", solo ejecuta la herramienta en silencio y luego confírmale que su solicitud está lista.
==================================================
`;

export type ChatMessage = {
  role: "user" | "model";
  content: string;
};

export async function chatWithAlejandro(
  history: ChatMessage[],
  newMessage: string
) {
  if (!genAI) {
    return "Lo siento, la inteligencia de Alejandro está temporalmente desconectada. (Falta API Key)";
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.7-flash",
      systemInstruction: SYSTEM_PROMPT,
      tools: [{ functionDeclarations: [enviarSolicitudTool] }],
      generationConfig: {
        temperature: 0.7,
      },
    });

    // Filtro robusto de historial para cumplir la regla estricta de Gemini (User -> Model alternado)
    let validHistory: any[] = [];
    let nextExpected = "user";
    
    for (const msg of history) {
      // Omitir mensajes vacíos para evitar errores
      if (!msg.content || msg.content.trim() === "") continue;
      
      if (msg.role === nextExpected) {
        validHistory.push({ role: msg.role, parts: [{ text: msg.content }] });
        nextExpected = nextExpected === "user" ? "model" : "user";
      }
    }
    
    // El historial que pasamos a startChat DEBE terminar en 'model' porque newMessage será 'user'
    if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === "user") {
      validHistory.pop();
    }

    const chat = model.startChat({
      history: validHistory,
    });

    let result = await chat.sendMessage(newMessage);
    let functionCalls = result.response.functionCalls();
    
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      if (call.name === "enviar_solicitud") {
        const args = call.args as any;
        
        const submitResult = await submitConciergeRequest({
          name: args.name || "Cliente",
          phone: args.phone || "Sin teléfono",
          email: args.email || "",
          request: args.request || "Sin detalles",
        });

        result = await chat.sendMessage([{
          functionResponse: {
            name: "enviar_solicitud",
            response: { success: submitResult.success }
          }
        }]);
      }
    }

    return result.response.text();
  } catch (error: any) {
    console.error("Error in AI chat:", error.message || error);
    
    // Mensaje de contingencia comercial (Fallback) si la IA se cae o se satura
    return "¡Hola! En este momento estoy a tope organizando experiencias inolvidables en Necoclí, pero no te preocupes. Te recuerdo que te puedo ayudar a armar Paquetes a Medida, reservar Hoteles, ir de Tour a las Islas o conseguir Transporte y Domicilios. ¡Usa los botones de abajo para enviarme tu solicitud directa y la procesaré apenas me desocupe!";
  }
}
