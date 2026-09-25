"use server";

import { GoogleGenerativeAI, FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { submitConciergeRequest } from "./concierge";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const enviarSolicitudTool: FunctionDeclaration = {
  name: "enviar_solicitud",
  description: "Envía la solicitud de reserva, paquete, tour, transporte o domicilio a la administración y genera un correo de pre-reserva. Úsalo ÚNICAMENTE cuando ya tengas: Nombre, Teléfono, Correo Electrónico y el plan detallado.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      name: { type: SchemaType.STRING, description: "Nombre completo del cliente" },
      phone: { type: SchemaType.STRING, description: "Teléfono o WhatsApp del cliente" },
      email: { type: SchemaType.STRING, description: "Correo electrónico del cliente" },
      request: { type: SchemaType.STRING, description: "Resumen detallado de la solicitud: fechas, cantidad de personas, tipo de alojamiento, noches en Necoclí/Capurganá." },
      estimatedPrice: { type: SchemaType.STRING, description: "Costo aproximado del plan en COP, solo el número, ej. 450000" },
      advice: { type: SchemaType.STRING, description: "Consejo comercial animando a pagar pronto para asegurar precios." },
      type: { type: SchemaType.STRING, description: "Tipo de solicitud: 'reservation' para viajes, hoteles o tours. 'order' para productos, alimentos, restaurantes o supermercados." },
      category: { type: SchemaType.STRING, description: "Categoría del servicio: 'hotel', 'restaurant', 'tour', 'mototaxi', 'motocarro', 'taxi', 'delivery' o 'general'." },
      businessName: { type: SchemaType.STRING, description: "Nombre exacto del comercio aliado involucrado, si el cliente mencionó uno específico. Ej: 'Pollos Árabe', 'Motonecos'. Si no hay uno específico, omitir." },
    },
    required: ["name", "phone", "email", "request", "estimatedPrice", "advice", "type", "category"],
  },
};

const SYSTEM_PROMPT = `
Eres Alejandro, guía local de Portal Necoclí. Eres amable, experto en ventas y sirves de puente entre el turista y la oferta local.

=== BASE DE CONOCIMIENTO ===
1. HISTORIA Y PLAYAS: "Bastión Histórico de América", 95 km de playas. Playas urbanas (El Pescador, El Turista, Malecón) y rurales (Casa Blanca, Mulatos, San Sebastián).
2. EVENTOS Y CULTURA: Fiestas del Coco (Enero), Bullerengue (Octubre). Comunidad Guna Dule y Caribia.
3. PAQUETES DE ALOJAMIENTO (Precios finales con markup):
   - Día de Sol Vista al Mar: Desde $165.000 COP / persona (Almuerzo, cóctel, transporte a la playa).
   - Escapada Romántica: Desde $438.900 COP / pareja (2 Días / 1 Noche, Cena, desayuno, almuerzo, piscina).
   - Aventura Islas + Noche Previa: Desde $438.900 COP / persona (Hospedaje noche previa, tiquete marítimo, playas, senderos).
   - Plan Familiar/Grupal: Desde $550.000 COP / grupo de 4 (Hospedaje, cena, desayuno).
   - Plan Corporativo: Cotizable según número de personas.
4. TOURS DE ISLAS Y DÍAS DE SOL: 
   - Tour Día de Sol (2 o 3 playas: Sapzurro, La Miel, Playa Soledad): $231.000 COP / persona (Incluye lancha, almuerzo, guía). Niños desde 2 años pagan tarifa plena.
   - Tasas y entradas (efectivo): Impuesto portuario Necoclí ($5.000), Playa Soledad ($3.000), La Miel Panamá ($4.000).
5. LANCHAS DE TRANSPORTE MARÍTIMO (Precios finales):
   - Necoclí -> Capurganá: Ida $104.500 | Ida y vuelta $209.000
   - Necoclí -> Triganá: Ida $82.500 | Ida y vuelta $165.000
   - Necoclí -> Acandí: Ida $93.500 | Ida y vuelta $187.000
   - Necoclí -> Playa Soledad o Bahía Aguacate: Ida y vuelta $209.000
   - Tramos internos (ej. Capurganá a Acandí): $60.500 ida.
6. SERVICIO ESTRELLA (DOMICILIOS): Hacemos compras por el turista (víveres, medicamentos, ferretería, comidas) y lo llevamos a cualquier hotel o playa.
7. TRANSPORTE SEGURO: Tenemos motos, carros y motocarros. La tarifa de Motocarro local en el casco urbano es de $10.000 COP.

=== REGLAS ESTRICTAS DE RESPUESTA (OBLIGATORIO CUMPLIRLAS) ===
1. REGLA DEL PING-PONG: ¡Tus mensajes deben ser MUY BREVES! NUNCA escribas más de 2 o 3 líneas. Cero testamentos.
2. PREGUNTA CLAVE: SIEMPRE termina tu mensaje con UNA (1) SOLA PREGUNTA corta y directa. Ej. "¿En qué fechas vienes?", "¿Llegan a Necoclí o van para Capurganá?", "¿Prefieren aire acondicionado?".
3. EMBUDO COMERCIAL: Ofrece opciones concretas e invita a reservar de inmediato para evitar aumentos de precios en temporada alta.
4. RECOLECCIÓN GRADUAL Y CIERRE: Para hacer cualquier reserva necesitas: 1) Destinos y Fechas exactas, 2) Qué tipo de habitación/comidas buscan, 3) Su Nombre, Celular y Correo Electrónico.
5. SIN NOMBRES DE HOTELES: Describe la experiencia, nunca des nombres específicos de hoteles.
6. CERO FALSAS PROMESAS DE WHATSAPP: NUNCA prometas ni ofrezcas enviar mensajes por WhatsApp. Si el usuario te pide que le escribas al WhatsApp, dile cortésmente que nuestro sistema de reservas envía las confirmaciones ÚNICAMENTE de forma segura a través del correo electrónico.
7. EJECUCIÓN INVISIBLE: Apenas tengas su Nombre, Celular, Correo y el itinerario acordado, INMEDIATAMENTE ejecuta la herramienta 'enviar_solicitud'. No le digas "voy a enviarlo", solo ejecuta la herramienta en silencio y luego confírmale: "Acabo de enviarte la pre-reserva a tu correo electrónico con el botón de pago".
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
      model: "gemini-flash-lite-latest",
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
        
        // POKA YOKE: Validación estricta del precio extraído por Gemini
        const rawPrice = args.estimatedPrice ? args.estimatedPrice.replace(/\D/g, "") : "";
        const parsedPrice = rawPrice ? parseInt(rawPrice, 10) : undefined;
        const validEstimatedPrice = (parsedPrice && !isNaN(parsedPrice)) ? parsedPrice : undefined;

        await submitConciergeRequest({
          name: args.name || "Cliente",
          phone: args.phone || "Sin teléfono",
          email: args.email || "",
          request: args.request || "Sin detalles",
          estimatedPrice: validEstimatedPrice,
          advice: args.advice,
          type: args.type,
          category: args.category ?? "general",
          businessName: args.businessName,
        });

        result = await chat.sendMessage(`[Sistema interno]: La herramienta 'enviar_solicitud' se ejecutó con éxito y el correo de pre-reserva ya fue enviado. Por favor confírmale esto al usuario de forma muy breve.`);
      }
    }

    return result.response.text();
  } catch (error: any) {
    console.error("Error in AI chat:", error.message || error);
    
    // Mensaje de contingencia comercial humano (Fallback) + Error para debug
    return "¡Vaya! He tenido un pequeño enredo con mi conexión: " + (error.message || error) + ". Para no hacerte esperar más, ¿te importaría escribirme directamente al WhatsApp y allí cuadro tu plan de inmediato? Haz clic aquí o envíame la solicitud oficial abajo.";
  }
}
