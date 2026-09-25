import { z } from "zod";

// ─── Schema de validación estricta (Zod) ──────────────────────────────────────
export const MerchantApplicationSchema = z.object({
  businessName: z
    .string()
    .min(3, "El nombre del negocio debe tener al menos 3 caracteres.")
    .max(80, "El nombre es demasiado largo."),
  ownerName: z.string().min(3, "El nombre del responsable es obligatorio.").max(80),
  email: z.string().email("El correo electrónico no es válido."),
  phone: z
    .string()
    .regex(
      /^[0-9]{10}$/,
      "El teléfono debe tener exactamente 10 dígitos (sin espacios ni guiones).",
    ),
  whatsapp: z
    .string()
    .regex(/^[0-9]{10}$/, "El WhatsApp debe tener exactamente 10 dígitos.")
    .optional()
    .or(z.literal("")),
  category: z.enum(["hotel", "restaurant", "tour", "transport", "commerce", "delivery"] as const, {
    message: "Selecciona una categoría válida.",
  }),
  nit: z
    .string()
    .regex(/^[0-9]{6,12}-?[0-9]$/, "El NIT debe tener formato válido (ej: 8128036-5)."),
  rnt: z.string().max(20, "El RNT es inválido.").optional().or(z.literal("")),
  camaraComercio: z
    .string()
    .max(100, "La Cámara de Comercio es inválida.")
    .optional()
    .or(z.literal("")),
  address: z.string().min(5, "La dirección es obligatoria.").max(200),
  description: z
    .string()
    .max(500, "La descripción no puede superar 500 caracteres.")
    .optional()
    .or(z.literal("")),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y la comisión de la plataforma.",
  }),
});

export type MerchantApplicationInput = z.infer<typeof MerchantApplicationSchema>;

// ─── Categorías válidas (usadas en el formulario cliente) ─────────────────────
export const MERCHANT_CATEGORIES = [
  { value: "hotel", label: "🏨 Hotel / Hospedaje" },
  { value: "restaurant", label: "🍽️ Restaurante / Comida" },
  { value: "tour", label: "🏝️ Tour / Experiencia Turística" },
  { value: "transport", label: "🛵 Transporte (Taxi, Moto, Marítimo)" },
  { value: "commerce", label: "🏪 Comercio / Tienda" },
  { value: "delivery", label: "📦 Domicilios" },
] as const;
