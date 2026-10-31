# Mantenimiento y verificación — Portal Necoclí 2.0

Baseline verificado: `next build` OK, `tsc` OK, 84 pruebas Vitest OK.

## Verificaciones

| Cuándo | Comando |
|---|---|
| Cada cambio | `npm run typecheck` y `npm test` |
| Antes de abrir PR | `npx biome check <archivos tocados>` |
| Antes de desplegar | `npm run build` |
| Si el build falla con tipos de rutas borradas | `rm -rf .next` y repetir |
| Semanal | `npm audit` |

Nota: `npm run lint` sobre todo el repo aún reporta errores y avisos previos; revisar solo los archivos que se modifican.

## Variables de entorno (configurar en Vercel; nunca en el repositorio)

- `RESEND_API_KEY`: sin ella `/api/contact` responde 503.
- Firma de eventos de Wompi: sin ella el webhook rechaza todas las peticiones.
- `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` (o `KV_REST_API_URL` y `KV_REST_API_TOKEN`): sin ellas el rate limiting queda desactivado y solo se registra un aviso.
- Credenciales de Firebase Admin: sin ellas la app usa datos semilla.

## Comportamientos intencionales

- `/api/reservations` responde 503 hasta que el servidor calcule el precio desde un catálogo confiable.
- `/experiencias` envía una solicitud de disponibilidad por correo; no reserva ni cobra.
- Rate limiting (por IP): contacto 5/10 min, registro de conductores 5/h, reservas 10/10 min. Si Redis falla, deja pasar la petición y registra el error.
- El webhook de Wompi no tiene rate limit: ya exige firma y bloquearlo podría perder pagos.

## Revisión posterior al despliegue (manual)

1. Enviar el formulario de contacto y confirmar que llegan ambos correos.
2. Abrir `/experiencias`, enviar una solicitud y revisar la consola del navegador: la CSP no debe bloquear recursos propios, Wompi ni Firebase.
3. Iniciar sesión con cada rol (cliente, comercio, conductor, admin) y comprobar el acceso correcto.
4. Hacer un pago de prueba en Wompi y verificar el webhook, el monto y la liquidación.
5. En los logs de Vercel buscar `[RateLimit]`, `[Contact]` y `[Wompi Webhook]`.

## Reglas de trabajo

- Una rama y un PR por cambio; no apilar PR salvo que se fusionen de abajo hacia arriba y se verifique que `main` recibió todo.
- Revisión de seguridad independiente en pagos, sesiones, rutas de API y Server Actions.
- No leer ni subir `.env*` ni credenciales. Si una clave se expone, rotarla en el proveedor; borrar el archivo no la invalida.
- Pendiente de seguridad: rotar la API key de Gemini que estuvo en el historial de Git.

## Pendientes conocidos

- Precio de reservas calculado en servidor (reactivar `/api/reservations`).
- Pruebas E2E con Playwright (no hay script `test:e2e`) y CI que ejecute `tsc` y Vitest.
- Pruebas de autorización por Server Action y de reglas de Firestore con el emulador.
- Errores de Biome previos en el repositorio.
