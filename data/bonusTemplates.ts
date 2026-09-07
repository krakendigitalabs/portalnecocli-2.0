import { LoyaltyBonus } from "@/types/loyalty";

type BonusTemplate = Omit<LoyaltyBonus, "id" | "customer_id" | "code" | "status" | "created_at" | "expires_at" | "redeemed_on_reservation_id" | "redeemed_at">;

// Constantes para días
const ALL_DAYS: number[] = [];
const WEEKDAYS = [1, 2, 3, 4]; // Lunes a Jueves
const WEEKENDS = [5, 6, 0]; // Viernes, Sábado, Domingo
const MIDWEEK = [2, 3]; // Martes, Miércoles

export const BONUS_TEMPLATES: BonusTemplate[] = [
  // ===================== HOTELES =====================
  {
    title: "Late Check-out gratuito",
    description: "Salida extendida hasta las 4 PM sin costo adicional.",
    target_category: "hotel",
    type: "SPECIAL_PERK",
    valid_days: [0], // Domingos
  },
  {
    title: "15% OFF en 2da Noche",
    description: "Recibe 15% de descuento en la segunda noche consecutiva.",
    target_category: "hotel",
    type: "DISCOUNT_PERCENTAGE",
    value: 15,
    valid_days: WEEKDAYS,
  },
  {
    title: "Upgrade de Habitación",
    description: "Mejora a la siguiente categoría de habitación sin costo (Sujeto a disponibilidad).",
    target_category: "hotel",
    type: "SPECIAL_PERK",
    valid_days: ALL_DAYS,
  },
  {
    title: "Desayuno Tropical Gratis",
    description: "Desayuno incluido para tu acompañante.",
    target_category: "hotel",
    type: "FREE_ITEM",
    valid_days: WEEKENDS,
  },
  {
    title: "Bono de $20,000 en Alojamiento",
    description: "Descuento directo en el valor total de tu estadía.",
    target_category: "hotel",
    type: "FIXED_AMOUNT",
    value: 20000,
    valid_days: ALL_DAYS,
  },
  {
    title: "Noche Romántica",
    description: "Decoración especial y botella de vino en la habitación gratis.",
    target_category: "hotel",
    type: "SPECIAL_PERK",
    valid_days: [5, 6], // Viernes y Sábados
  },

  // ===================== RESTAURANTES =====================
  {
    title: "Postre y Bebida Gratis",
    description: "Por la compra de un plato fuerte, recibe postre y bebida.",
    target_category: "restaurant",
    type: "FREE_ITEM",
    valid_days: ALL_DAYS,
  },
  {
    title: "Bono de $5,000 Consumibles",
    description: "Descuento directo en tu cuenta total.",
    target_category: "restaurant",
    type: "FIXED_AMOUNT",
    value: 5000,
    valid_days: ALL_DAYS,
  },
  {
    title: "2x1 en Cócteles",
    description: "Paga uno, lleva dos. Válido durante el atardecer (5 PM - 7 PM).",
    target_category: "restaurant",
    type: "SPECIAL_PERK",
    valid_days: [5, 6, 0], // Fin de semana
  },
  {
    title: "Entrada Caribeña Gratis",
    description: "Recibe una porción de patacones con suero costeño gratis con tu pedido.",
    target_category: "restaurant",
    type: "FREE_ITEM",
    valid_days: WEEKDAYS,
  },
  {
    title: "10% OFF en Mariscos",
    description: "Descuento exclusivo en todos los platos de mar.",
    target_category: "restaurant",
    type: "DISCOUNT_PERCENTAGE",
    value: 10,
    valid_days: [3, 4], // Miércoles y Jueves
  },
  {
    title: "Café de Cortesía",
    description: "Un café especial de cortesía después de tu almuerzo.",
    target_category: "restaurant",
    type: "FREE_ITEM",
    valid_days: ALL_DAYS,
  },

  // ===================== TOURS / PLANES =====================
  {
    title: "2x1 en Volcán de Lodo",
    description: "Compra un tiquete y tu acompañante entra gratis.",
    target_category: "tour",
    type: "SPECIAL_PERK",
    valid_days: MIDWEEK,
  },
  {
    title: "15% OFF Paseo en Lancha",
    description: "Descuento en trayectos turísticos por la costa.",
    target_category: "tour",
    type: "DISCOUNT_PERCENTAGE",
    value: 15,
    valid_days: ALL_DAYS,
  },
  {
    title: "Silla VIP Asegurada",
    description: "Garantiza ubicación privilegiada en tu transporte marítimo sin costo extra.",
    target_category: "tour",
    type: "SPECIAL_PERK",
    valid_days: WEEKENDS,
  },
  {
    title: "Guía Fotográfica Gratis",
    description: "El guía te tomará fotos profesionales con tu cámara durante el recorrido.",
    target_category: "tour",
    type: "FREE_ITEM",
    valid_days: ALL_DAYS,
  },
  {
    title: "Snack de Ruta Gratis",
    description: "Refrigerio gratis durante el trayecto de tu tour.",
    target_category: "tour",
    type: "FREE_ITEM",
    valid_days: ALL_DAYS,
  },
  {
    title: "Bono de $10,000 en Tours",
    description: "Descuento aplicable a paquetes de más de 4 horas.",
    target_category: "tour",
    type: "FIXED_AMOUNT",
    value: 10000,
    valid_days: [1, 2],
  },

  // ===================== FERRETERÍAS / COMERCIO =====================
  {
    title: "10% OFF en Marca Aliada",
    description: "Descuento directo en herramientas y materiales seleccionados.",
    target_category: "hardware",
    type: "DISCOUNT_PERCENTAGE",
    value: 10,
    valid_days: WEEKDAYS,
  },
  {
    title: "Envío Domicilio Gratis",
    description: "Transporte gratuito de tus materiales dentro del casco urbano.",
    target_category: "hardware",
    type: "SPECIAL_PERK",
    valid_days: ALL_DAYS,
  },
  {
    title: "Bono $15,000 Ferretero",
    description: "Aplica en compras mayores a $150,000 COP.",
    target_category: "hardware",
    type: "FIXED_AMOUNT",
    value: 15000,
    valid_days: [1, 2, 3],
  },
  {
    title: "Asesoría Técnica Gratis",
    description: "1 hora de consultoría sobre materiales de construcción.",
    target_category: "hardware",
    type: "FREE_ITEM",
    valid_days: WEEKENDS,
  },
  {
    title: "5% OFF en Pinturas",
    description: "Ideal para renovar tus espacios.",
    target_category: "hardware",
    type: "DISCOUNT_PERCENTAGE",
    value: 5,
    valid_days: ALL_DAYS,
  },
  {
    title: "Regalo: Set de Brochas",
    description: "Gratis por cualquier compra superior a $50,000 COP.",
    target_category: "hardware",
    type: "FREE_ITEM",
    valid_days: [5, 6],
  },

  // ===================== ODONTOLOGÍAS / SALUD =====================
  {
    title: "Valoración Gratis + 50% Profilaxis",
    description: "Chequeo completo y limpieza a mitad de precio.",
    target_category: "health",
    type: "SPECIAL_PERK",
    valid_days: WEEKDAYS,
  },
  {
    title: "15% OFF Diseño de Sonrisa",
    description: "Descuento válido en tratamientos estéticos.",
    target_category: "health",
    type: "DISCOUNT_PERCENTAGE",
    value: 15,
    valid_days: ALL_DAYS,
  },
  {
    title: "Bono de $50,000 en Ortodoncia",
    description: "Aplica para la cuota inicial de tu tratamiento.",
    target_category: "health",
    type: "FIXED_AMOUNT",
    value: 50000,
    valid_days: [1, 2, 3, 4],
  },
  {
    title: "Kit Dental de Regalo",
    description: "Gratis al asistir a tu primera cita.",
    target_category: "health",
    type: "FREE_ITEM",
    valid_days: ALL_DAYS,
  },
  {
    title: "Blanqueamiento 2x1",
    description: "Lleva a un acompañante y pagan solo por uno.",
    target_category: "health",
    type: "SPECIAL_PERK",
    valid_days: [5, 6],
  },
  {
    title: "10% OFF en Resinas",
    description: "Descuento en calzas estéticas.",
    target_category: "health",
    type: "DISCOUNT_PERCENTAGE",
    value: 10,
    valid_days: ALL_DAYS,
  },
];
