"use server";

import { FunctionDeclaration, GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { submitConciergeRequest } from "./concierge";
import { getCachedMarketplaceBusinesses } from "@/app/actions/marketplace";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const enviarSolicitudTool: FunctionDeclaration = {
  name: "enviar_solicitud",
  description:
    "Envía la solicitud de reserva, paquete o tour a la administración y genera un correo de pre-reserva. Úsalo ÚNICAMENTE para RESERVAS (hoteles, tours). NO lo uses para transporte ni domicilios.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      name: { type: SchemaType.STRING, description: "Nombre completo del cliente" },
      phone: { type: SchemaType.STRING, description: "Teléfono o WhatsApp del cliente" },
      email: { type: SchemaType.STRING, description: "Correo electrónico del cliente" },
      request: {
        type: SchemaType.STRING,
        description:
          "Resumen detallado de la solicitud: fechas, cantidad de personas, tipo de alojamiento, noches en Necoclí/Capurganá.",
      },
      estimatedPrice: {
        type: SchemaType.STRING,
        description: "Costo aproximado del plan en COP, solo el número, ej. 450000",
      },
      advice: {
        type: SchemaType.STRING,
        description: "Consejo comercial animando a pagar pronto para asegurar precios.",
      },
      type: {
        type: SchemaType.STRING,
        description:
          "Tipo de solicitud: 'reservation' para viajes, hoteles o tours. 'order' para productos, alimentos, restaurantes o supermercados.",
      },
      category: {
        type: SchemaType.STRING,
        description:
          "Categoría del servicio: 'hotel', 'restaurant', 'tour', 'mototaxi', 'motocarro', 'taxi', 'delivery' o 'general'.",
      },
      businessName: {
        type: SchemaType.STRING,
        description:
          "Nombre exacto del comercio aliado involucrado, si el cliente mencionó uno específico. Ej: 'Pollos Árabe', 'Motonecos'. Si no hay uno específico, omitir.",
      },
    },
    required: ["name", "phone", "email", "request", "estimatedPrice", "advice", "type", "category"],
  },
};

const solicitarCarreraTool: FunctionDeclaration = {
  name: "solicitar_carrera",
  description:
    "Crea una solicitud de carrera de transporte (mototaxi, motocarro, taxi) O UN DOMICILIO (compras de farmacia, súper, comida). " +
    "Úsalo cuando el cliente quiera moverse AHORA o pida un DOMICILIO para entrega inmediata. " +
    "Necesitas: destino (lugar de entrega), tipo de vehículo, y nombre/teléfono del cliente. Pon la lista de compras del domicilio en 'notes'.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      destination: { type: SchemaType.STRING, description: "Destino exacto del viaje" },
      vehicleType: { type: SchemaType.STRING, description: "mototaxi, motocarro o taxi" },
      clientName: { type: SchemaType.STRING, description: "Nombre del cliente" },
      clientPhone: { type: SchemaType.STRING, description: "Teléfono del cliente" },
      passengerCount: { type: SchemaType.NUMBER, description: "Cantidad de pasajeros" },
      notes: { type: SchemaType.STRING, description: "Notas adicionales (equipaje, hora)" },
    },
    required: ["destination", "vehicleType", "clientName", "clientPhone"],
  },
};

const SYSTEM_PROMPT = `
Eres Alejandro, guía local de Portal Necoclí. Eres amable, experto en ventas y sirves de puente entre el turista y la oferta local.

=== BASE DE CONOCIMIENTO OFICIAL (TARIFARIOS 2026) ===

--- 1. HISTORIA Y PLAYAS ---
"Bastión Histórico de América", 95 km de playas. Playas urbanas (El Pescador, El Turista, Malecón) y rurales (Casa Blanca, Mulatos, San Sebastián).
Eventos: Fiestas del Coco (Enero), Bullerengue (Octubre). Comunidades Guna Dule y Caribia.

--- 2. TARIFARIO HOTELES Y ALOJAMIENTO 2026 ---
ESTÁNDAR (por noche):
- Sencilla ventilador: $66.000 | Sencilla A/C: $77.000
- Pareja ventilador: $132.000 | Pareja A/C: $165.000
- Persona adicional ventilador: $44.000 | A/C: $55.000
HOTEL CON PISCINA:
- Sencilla piscina+ventilador: $99.000 | Pareja: $198.000
- Sencilla Premium piscina+A/C: $275.000 | Pareja: $385.000
HOTEL VIP / SUITES:
- Hospedaje 1 persona: $132.000 | Pareja: $198.000
- Suite 1 persona: $198.000 | Suite pareja: $253.000
- Jacuzzi 2 personas: $55.000 | 4 personas: $66.000
HABITACIÓN MÚLTIPLE (precio por persona):
- 2 personas: $93.500 c/u | 3: $82.500 c/u | 4: $71.500 c/u
- 5 personas: $60.500-$77.000 c/u | 6: $71.500 c/u | 7: $66.000 c/u | 8: $55.000 c/u
PAQUETES PORTAL:
- Día de Sol Vista al Mar: $165.000/persona (almuerzo, cóctel, transporte)
- Escapada Romántica: $438.900/pareja (2D/1N, cena, desayuno, almuerzo, piscina)
- Aventura Islas + Noche: $438.900/persona
- Plan Familiar/Grupal: $550.000/grupo de 4

--- 3. TARIFARIO MOTOTAXI 2026 ---
CASCO URBANO: Urbana sencilla $3.000 | Nocturna (después 8pm): $4.000
VÍA TOTUMO: Casa Blanca $10.000 | Totumo $15.000 | Caimán $22.000 | Tie $26.000
VÍA PUEBLO NUEVO: La Escoba $8.000 | Sevilla $17.000 | Pueblo Nuevo $35.000 | Brisas del Río $40.000 | Tulapita $50.000
VÍA MELLITO: Villa Lucia $6.000 | Caribia $20.000 | Mellito $20.000 | Mulatos $35.000
VÍA MONCHOLO: La Y $5.000 | Moncholo $12.000 | Nuevo Oriente $17.000
VÍA CAÑA FLECHAL: Mirador $4.000 | San Sebastián $6.000 | Peniel $8.000 | Río $12.000 | Marimonda $25.000 | Cerro del Águila $60.000

--- 4. TARIFARIO MOTOCARRO 2026 ---
NOTA: Tarifa Nocturna (después de 8pm) es el DOBLE del precio normal.
CASCO URBANO: Carrera base $6.600 COP
VÍA SAN SEBASTIÁN: Mirador $7.700 | Las Flores $11.000 | Peniel $16.500 | Río Necoclí $29.700 | La Mesa $39.600 | Marimonda $66.000 | Lechugal $82.500
VÍA MELLITO: Aeropuerto $13.200 | Caribia $49.500 | Mellito $38.500 | Limoncito $60.500 | Cativo $66.000 | Zapata $93.500
VÍA PUEBLO NUEVO: Bobal $13.200 | Pueblo Nuevo $66.000 | Brisas del Río $77.000 | Tulapita $99.000 | Paraíso Tulapa $110.000
VÍA TOTUMO: Casa Blanca $19.800 | Totumo $27.500 | Puente Caimán $38.500
VÍA GARITON: Guacamaya $33.000 | Gariton $44.000 | Almácigo $71.500
VÍA MONCHOLO: La Y $13.200 | Moncholo $26.400 | Nuevo Oriente $33.000 | Finca La Gloria $55.000

--- 5. TARIFARIO TAXI AMARILLO 2026 ---
RUTAS URBANAS: Urbana $9.000 | Hospital-Aeropuerto $18.000 | Plaza-Aeropuerto $15.000
RUTAS RURALES: Bobal $18.000 | Casa Blanca $24.000-$27.000 | Totumo $28.000-$32.000 | Moncholo $45.000 | Caribia $60.000 | Pueblo Nuevo $120.000 | Brisas del Río $130.000 | Mello Villavicencio $170.000 | Mulatos $70.000 | Zapata $100.000
INTERMUNICIPALES: Turbo $125.000 | Apartadó $202.000 | Aeropuerto Carepa $240.000 | San Juan de Urabá $190.000 | Arboletes $220.000

--- 6. LANCHAS DE TRANSPORTE MARÍTIMO ---
- Necoclí → Capurganá: Ida $104.500 | I/V $209.000
- Necoclí → Triganá: Ida $82.500 | I/V $165.000
- Necoclí → Acandí: Ida $93.500 | I/V $187.000
- Necoclí → Playa Soledad/Bahía Aguacate: I/V $209.000
- Tramos internos (ej. Capurganá→Acandí): $60.500 ida
TOURS DE ISLAS: Tour Día de Sol (Sapzurro, La Miel, Playa Soledad): $231.000/persona (lancha, almuerzo, guía).
Tasas en efectivo: Puerto Necoclí $5.000 | Playa Soledad $3.000 | La Miel Panamá $4.000

--- 7. MENÚ POLLOS ÁRABE 2026 ---
Pollo a la Brasa: Entero $52.800 | Medio $28.600 | Cuarto $17.600
Almuerzos ejecutivos: Carne ahumada/cerdo/res/chicharrón $22.000 | Pollo $24.200 | Costilla $25.300
Picadas: Pequeña $44.000 | Mediana $55.000 | Grande $66.000
Cortes de res (Punta de Anca, Churrasco): $49.500 | Solomito: $33.000
Pescados/Mariscos: Tilapia $27.500 | Róbalo $38.500 | Sierra $44.000 | Cazuela Mariscos $38.500
Comidas rápidas: Hamburguesa pechuga $27.500 | Salchipapa $17.600 | Alitas BBQ $22.000
Bebidas: Jugo leche $8.800 | Jugo agua $7.700 | Cerveza $6.600

--- 8. MENÚ RESTAURANTE MARISCOS Y CARNES 2026 ---
Ceviches: Manglar (caracol, camarón, pulpo) $46.200 | Peruano $39.600 | Caribeño $41.800
Langostinos: Arpones $50.600 | Langostinos Caribeños $52.800 | Chalupa de Mariscos $62.700
Pescados: Sierra Frita $46.200 | Róbalo Frito $59.400 | Salmón al Horno $51.700 | Salmón Caribeño $56.100
Carnes: Solomito a la parrilla $39.600 | Punta de Anca desde $30.800 | Cañón de Cerdo $33.000-$39.600 | Pechuga pollo $30.800-$33.000
Platos especiales: Marea Baja $82.500 | Del Mar Paraíso $57.200 | Picada Mixta Grande $77.000
Hamburguesas: Clásica $33.000 | LangostiBurger $42.900 | Pollo Crujiente $29.700
Pastas: Boloñesa $46.200 | Fruto del Mar $52.800
Menú infantil: Nuggets $19.800 | Mini burguer $19.800
Cócteles: Paraíso verde/Caribe azul/Mojitos $20.900-$35.200

--- 9. SERVICIO ESTRELLA (DOMICILIOS) ---
Hacemos compras por el turista (víveres, medicamentos, ferretería, comidas) y lo llevamos a cualquier hotel o playa. ¡USA SIEMPRE LA HERRAMIENTA solicitar_carrera PARA MANDARLE ESTO A LOS CONDUCTORES EN TIEMPO REAL!

=== REGLAS ESTRICTAS DE RESPUESTA (OBLIGATORIO CUMPLIRLAS) ===
1. REGLA DEL PING-PONG: ¡Tus mensajes deben ser MUY BREVES! NUNCA escribas más de 2 o 3 líneas. Cero testamentos.
2. PREGUNTA CLAVE: SIEMPRE termina tu mensaje con UNA (1) SOLA PREGUNTA corta y directa. Ej. "¿En qué fechas vienes?", "¿Llegan a Necoclí o van para Capurganá?", "¿Prefieren aire acondicionado?".
3. EMBUDO COMERCIAL: Ofrece opciones concretas e invita a reservar de inmediato para evitar aumentos de precios en temporada alta.
4. RECOLECCIÓN GRADUAL Y CIERRE: Para hacer cualquier reserva necesitas: 1) Destinos y Fechas exactas, 2) Qué tipo de habitación/comidas buscan, 3) Su Nombre, Celular y Correo Electrónico.
5. SIN NOMBRES DE HOTELES: Describe la experiencia, nunca des nombres específicos de hoteles.
6. CERO FALSAS PROMESAS DE WHATSAPP: NUNCA prometas ni ofrezcas enviar mensajes por WhatsApp. Si el usuario te pide que le escribas al WhatsApp, dile cortésmente que nuestro sistema de reservas envía las confirmaciones ÚNICAMENTE de forma segura a través del correo electrónico.
7. EJECUCIÓN INVISIBLE: Apenas tengas los datos completos para una reserva/tour, ejecuta 'enviar_solicitud'. Si es un domicilio, ejecuta 'solicitar_carrera'.
8. USO DEL MAPA PARA TRANSPORTE: Si el cliente pide un transporte (moto, motocarro, taxi), NO uses la herramienta 'solicitar_carrera' manualmente. En su lugar, dile que hemos habilitado nuestro Mapa Satelital y envíale ESTE ENLACE EXACTO en formato Markdown: [📍 Abrir Mapa de Neco-Dispatch](/customer/pedir). Diles que ahí podrán ver su ubicación exacta, marcar el destino y pedir el vehículo automáticamente.
==================================================
`;

export type ChatMessage = {
  role: "user" | "model";
  content: string;
};

export async function chatWithAlejandro(
  history: ChatMessage[],
  newMessage: string,
  userId?: string,
) {
  if (!genAI) {
    return "Lo siento, la inteligencia de Alejandro está temporalmente desconectada. (Falta API Key)";
  }

  try {
    const businesses = await getCachedMarketplaceBusinesses();
    const catalogString =
      businesses.length > 0
        ? businesses
            .map(
              (b: any) =>
                `- ${b.name} (${b.category}): ${b.shortDescription} | Precio: ${b.priceRange}`,
            )
            .join("\n")
        : "No hay comercios registrados.";

    const dynamicSystemPrompt = `${SYSTEM_PROMPT}

=== CATÁLOGO COMERCIAL EN TIEMPO REAL (BASE DE DATOS) ===
Estos son los aliados comerciales activos. Usa esta información para enrutarlos y ofrecer sus servicios:
${catalogString}
=========================================================`;

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-lite-latest",
      systemInstruction: dynamicSystemPrompt,
      tools: [{ functionDeclarations: [enviarSolicitudTool, solicitarCarreraTool] }],
      generationConfig: {
        temperature: 0.7,
      },
    });

    // Filtro robusto de historial para cumplir la regla estricta de Gemini (User -> Model alternado)
    const validHistory: any[] = [];
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
    const functionCalls = result.response.functionCalls();

    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      if (call.name === "enviar_solicitud") {
        const args = call.args as any;

        // POKA YOKE: Validación estricta del precio extraído por Gemini
        const rawPrice = args.estimatedPrice ? args.estimatedPrice.replace(/\D/g, "") : "";
        const parsedPrice = rawPrice ? parseInt(rawPrice, 10) : undefined;
        const validEstimatedPrice = parsedPrice && !isNaN(parsedPrice) ? parsedPrice : undefined;

        await submitConciergeRequest({
          name: args.name || "Cliente",
          phone: args.phone || "Sin teléfono",
          email: args.email || "",
          request: args.request || "Sin detalles",
          estimatedPrice: validEstimatedPrice,
          advice: args.advice || "Reserva pronto para asegurar el mejor precio.",
          type: args.type || "reservation",
          category: args.category ?? "general",
          businessName: args.businessName,
        });

        result = await chat.sendMessage(
          `[Sistema interno]: La herramienta 'enviar_solicitud' se ejecutó con éxito y el correo de pre-reserva ya fue enviado. Por favor confírmale esto al usuario de forma muy breve.`,
        );
      } else if (call.name === "solicitar_carrera") {
        const args = call.args as any;

        if (!userId) {
          result = await chat.sendMessage(
            `[Sistema interno]: El usuario solicitó una carrera pero NO ESTÁ AUTENTICADO. Dile cordialmente que por motivos de seguridad y para poder rastrear en tiempo real al conductor, debe Iniciar Sesión primero.`,
          );
          return result.response.text();
        }

        const { createRideAction } = await import("@/lib/rides/ride-actions");

        const rideRes = await createRideAction({
          origin: "Centro de Necoclí (O lugar acordado)",
          destination: args.destination || "",
          vehicleType: args.vehicleType || "motocarro",
          clientName: args.clientName || "Cliente",
          clientPhone: args.clientPhone || "",
          clientUid: userId,
          passengerCount: args.passengerCount || 1,
          notes: args.notes || "",
          source: "chatbot",
        });

        if (rideRes.success) {
          result = await chat.sendMessage(
            `[Sistema interno]: La herramienta 'solicitar_carrera' se ejecutó con éxito. La carrera ha sido publicada. Dile al usuario que su transporte ya fue solicitado y dile que puede rastrearlo en tiempo real haciendo clic aquí: [Ver estado del viaje](/customer/viajes/${rideRes.id}).`,
          );
        } else {
          result = await chat.sendMessage(
            `[Sistema interno]: Hubo un error al publicar la carrera: ${rideRes.error}. Infórmale al usuario que hubo un problema logístico y que intente más tarde.`,
          );
        }
      }
    }

    return result.response.text();
  } catch (error: any) {
    console.error("Error in AI chat:", error.message || error);

    const isOverloaded = error.message && error.message.includes("503");

    // Mensaje de contingencia comercial humano (Fallback) limpio, sin errores crudos.
    if (isOverloaded) {
      return "¡Vaya! En este preciso instante tengo a muchos turistas preguntándome cosas y mi línea está un poco saturada. 😅 ¿Te importaría intentar de nuevo en unos segundos o escribirme por WhatsApp para cuadrar tu plan de inmediato?";
    }

    return "¡Uy! He tenido un pequeño enredo técnico con mi conexión. Para no hacerte esperar más, ¿te importaría escribirme directamente al WhatsApp y allí cuadro tu plan de inmediato? También puedes enviarme la solicitud oficial usando el botón de abajo.";
  }
}
