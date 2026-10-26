# Contexto de Portal Necoclí
- Stack: Next.js (App Router), TypeScript, Tailwind CSS, Biome (linter), Resend (emails), Wompi (pagos).
- Estructura clave:
  - Server Actions en `app/actions/` (`maritime-booking.ts`, `wompi.ts`, `ticket-actions.ts`).
  - Rutas públicas en `app/(public)/`.
  - Documentación y auditoría en `docs/BITACORA_VALORIZACION.md`.
- Reglas de trabajo: Cero deuda técnica, tipado estricto en TypeScript (sin `any`), respetar reglas de Biome.
