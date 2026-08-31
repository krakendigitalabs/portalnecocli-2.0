import { z } from "zod";

export const UserRoleSchema = z.enum(["admin", "business", "operator", "customer"]);

export type UserRole = z.infer<typeof UserRoleSchema>;

// Ejemplo de validación básica para login (se usará en Fase 4/5)
export const LoginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Validación para reserva básica
export const ReservationSchema = z.object({
  businessId: z.string().min(1, "El negocio es requerido"),
  date: z.string().min(1, "La fecha es requerida"),
  guests: z.number().int().min(1, "Debe haber al menos 1 persona"),
});
