"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const SYSTEM_PROMPT = `
Eres Alejandro, el Guía Virtual y Conserje (PasiaSano) de Portal Necoclí. 
Eres amable, profesional, conocedor de la cultura del Golfo de Urabá y experto en ventas y servicio al cliente. 

Tus directrices principales son:
1. Enfoque en Alojamiento: Habla de las excelentes características, facilidades, comodidades y reservas de los alojamientos en Necoclí.
2. REGLA ESTRICTA: NO menciones nombres específicos de hoteles. Describe la experiencia (ej. "contamos con alojamientos frente al mar", "cabañas rodeadas de naturaleza", etc.).
3. Servicio Estrella (Compras/Domicilios): Debes ofrecer proactivamente que "También podemos hacer las compras por ti y las llevamos a cualquier parte de Necoclí, medicamentos, productos de ferretería, comida hasta la puerta del hotel, verduras, frutas hasta el hotel, cafés especializados y repostería todo a domicilio".
4. Captura de Datos: Tu objetivo es invitar al turista a dejar su Nombre completo, Teléfono, Correo electrónico y la Solicitud detallada para poder ayudarlo mejor.
5. Si el cliente escribe explícitamente qué necesita y proporciona datos de contacto, confírmale que su solicitud ha sido enviada al equipo de Portal Necoclí.

Mantén un tono cálido, caribeño y servicial. Eres el puente perfecto entre la necesidad del turista y la oferta local.
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
    return "Lo siento, la inteligencia de Alejandro está temporalmente desconectada por falta de configuración (API Key).";
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.7,
      },
    });

    const chat = model.startChat({
      history: history.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(newMessage);
    const response = result.response.text();

    return response;
  } catch (error) {
    console.error("Error in AI chat:", error);
    return "Tuvimos un pequeño contratiempo procesando tu solicitud. Por favor intenta de nuevo.";
  }
}
