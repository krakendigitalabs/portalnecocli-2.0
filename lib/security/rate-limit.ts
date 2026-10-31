import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

type RateLimitPolicy = {
  name: string;
  limit: number;
  window: `${number} ${"s" | "m" | "h"}`;
};

export const rateLimitPolicies = {
  contact: { name: "contact", limit: 5, window: "10 m" },
  driverRegistration: { name: "driver-registration", limit: 5, window: "1 h" },
  reservations: { name: "reservations", limit: 10, window: "10 m" },
} satisfies Record<string, RateLimitPolicy>;

let redis: Redis | null | undefined;
const limiters = new Map<string, Ratelimit>();
let warnedMissingConfig = false;

function getRedis(): Redis | null {
  if (redis !== undefined) {
    return redis;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  redis = url && token ? new Redis({ url, token }) : null;
  return redis;
}

/**
 * Vercel sobrescribe estas cabeceras en el borde, por lo que el cliente no puede falsificarlas.
 * No se usa x-forwarded-for porque su primer valor puede venir del cliente fuera de Vercel.
 */
export function getClientIdentifier(request: Request): string {
  const candidate =
    request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-real-ip") ?? "";
  const ip = candidate.split(",")[0]?.trim();
  return ip || "unknown";
}

function getLimiter(policy: RateLimitPolicy, client: Redis): Ratelimit {
  let limiter = limiters.get(policy.name);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: client,
      limiter: Ratelimit.slidingWindow(policy.limit, policy.window),
      prefix: `ratelimit:${policy.name}`,
    });
    limiters.set(policy.name, limiter);
  }
  return limiter;
}

/**
 * Devuelve una respuesta 429 si se superó el límite; null si la petición puede continuar.
 * Si el almacén no está configurado o falla, deja pasar la petición (fail-open) y registra el aviso,
 * para que una caída de Redis no deje fuera de servicio los formularios.
 */
export async function enforceRateLimit(
  request: Request,
  policy: RateLimitPolicy,
): Promise<NextResponse | null> {
  const client = getRedis();
  if (!client) {
    if (!warnedMissingConfig) {
      warnedMissingConfig = true;
      console.warn("[RateLimit] Upstash Redis no configurado; límites de peticiones desactivados.");
    }
    return null;
  }

  try {
    const result = await getLimiter(policy, client).limit(getClientIdentifier(request));
    if (result.success) {
      return null;
    }

    const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
    return NextResponse.json(
      { success: false, error: "Demasiadas solicitudes. Inténtalo de nuevo más tarde." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  } catch (error) {
    console.error("[RateLimit] No se pudo consultar el almacén de límites:", error);
    return null;
  }
}
