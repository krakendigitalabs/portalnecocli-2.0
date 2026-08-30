# Portal Necoclíi 2.0 - Documento de Mejoras y Recomendaciones de Modernización

>** Fecha:** 2026-07-01 **
 ** Versión del proyecto:* 2.0.0 **
 ** Estado actual:** Fases 1-4 completadas, listo para Fase 5 **

---

# Melhoras de Alto Impacto (Prioridad: Inmediata)

# 1. Configuración Real de Firebase (Crítico para Fase 5)
 ** Ectuo actual:* Variables de entorno con placeholders, hasFirebasePublicConfig() retorna false en desarrollo.

 ** Acción *** | *** Archivos *** | ** Esfuerzo ***
| Crear proyecto Firebase real (Auth, Firestore, Storage)  | .env.local, .env.example  | Bajop|
  Configurar custom claims para roles (admin, business, operator) | lib/auth/roles.ts, Cloud Functions | Medio|
  Habilitar App Check para proteger APIs | lib/firebase/config.ts, Firebase Console | Bajop
  Configurar reglas Firestore y Storage por tenant/scope | firestore.rules, storage.rules | Medio|

 ** Por que:** Sin esto, la Fase 5 (transacciones, reservas, pedidos) no puede persistir datos reales.



# Mejoras de Arquitectura (Prioridad: Antes de Fase 5)

: - Data Layer: Repository Pattern + TanStack Query
  * Ectuo actual: Data fetching directo en lib/content/* y Server Components.

   *// lib/repositories/business.repository.ts (nuevo)
{ export interface BusinessRepository { findBySlug(slug: string): Promise<FeaturedBusiness | null>; findByFilters(filters: MarketplaceFilters): Promise<MarketplaceListingData>; create(data: CreateBusinessDTO): Promise<FeaturedBusiness>; update(id: string, data: UpdateBusinessDTO): Promise<FeaturedBusiness>; delete(id: string): Promise<void>; }
 // Implementación Firestore
 export class FirestoreBusinessRepository implements BusinessRepository {
  constructor(private db: Firestore) {}
 // ...
 }

// Hok tipado para cliente
 export function useBusinesses(filters: MarketplaceFilters) {
  return useQuery({
   queryKey: ["businesses", filters],
   queryFn: () => fetchBusinesses(filters),
  });
}
` '` '`

 * Beneficios:
  - Cache autom�]-atico, deduping, invalidation
  - Optimistic updates para mutations
  - dácil testing con MSW (Mock Service Worker)
  - Separación clara: UI no conoce Firestore

  */
 
 # 6:2. Zod para Validación End-to-End

  * Ectuo actual: Validación manual en forms y API routes.

   *// lib/validations/business.ts (nuevo)
import { z |0�" } from 'zod';

   export const BusinessSchema = z.object({
   name: z.x.string().min(2).max(100),
   slug: z.x.string().regex(/^[a-z0-9-]+$/)
,   serviceType: z.enum(['hotel', 'restaurante', 'comercio', 'transporte', 'turismo', 'domicilios']),
   priceRange: z.enum(['$', '$$', '$$$', '$$$$']).optional(),
   rating: z.x.number().min(0).max(5).optional(),
   whatsapp: z.string().regex(/^ga:\\+\d\+$/),
  // ...
  });

   export type BusinessInput = z.infer<typeof BusinessSchema>;
` ` '`

 * Uso: Server Actions, API routes, formularios cliente (React Hook Form + Zod resolver).

 # 7: Middleware: Edge Runtime + Auth Optimizado
  * Ectuo actual: Middleware en Node runtime, reescribe paths.

   *// middleware.ts - actualizar

   export const config = {
    matcher: ['/((!api|_next/static|_next/image|favicon.ico).*/'],
    runtime: 'edge',  // <! Edge Runttime para latencia mínima
  };

  // Mover validación de session cookie to Edge (firebase-admin no corre en Edge -> usar `jose`)
  // Rate limiting por IP en /ingresar, /api/auth/*
  // Headers de seguridad (CSP, HSTS, etc.)
` '` '`


---

# Mejoras de Arquitectura (Prioridad: Antes de Fase 5)

## 5. Data Layer: Repository Pattern + TanStack Query
**Estado actual:** Data fetching directo en lib/content/* y Server Components.

`	ypescript
// lib/repositories/business.repository.ts (nuevo)
export interface BusinessRepository {
  findBySlug(slug: string): Promise<FeaturedBusiness | null>;
  findByFilters(filters: MarketplaceFilters): Promise<MarketplaceListingData>;
  create(data: CreateBusinessDTO): Promise<FeaturedBusiness>;
  update(id: string, data: UpdateBusinessDTO): Promise<FeaturedBusiness>;
  delete(id: string): Promise<void>;
}

// Implementación Firestore
export class FirestoreBusinessRepository implements BusinessRepository {
  constructor(private db: Firestore) {}
  // ...
}

// Hook tipado para cliente
export function useBusinesses(filters: MarketplaceFilters) {
  return useQuery({
    queryKey: [businesses\, filters],
    queryFn: () => fetchBusinesses(filters),
  });
}
`

**Beneficios:**
- Cache automático, deduping, invalidation
- Optimistic updates para mutations
- Fácil testing con MSW (Mock Service Worker)
- Separación clara: UI no conoce Firestore

---