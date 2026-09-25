# 🏛️ Especificación de Arquitectura UI/UX — Dashboard de Comercios Aliados
### Portal Necoclí 2.0 · Versión 2.0 · Revisado: Septiembre 2026
---

> **Metodologías aplicadas:** Design Thinking (IDEO) · Atomic Design (Brad Frost) · Jobs-to-be-Done (JTBD) · WCAG 2.1 AA · Material Design Responsive Guidelines · Nielsen's 10 Usability Heuristics.

---

## 0. Análisis de Usuarios (Jobs-To-Be-Done)

Antes de escribir una sola línea de código, debemos entender **quiénes usan el dashboard** y **qué trabajo quieren resolver**. Esto garantiza que construimos para personas reales, no para una pantalla vacía.

| Persona | Dispositivo principal | JTBD (Lo que quiere lograr) |
|---|---|---|
| **Dueño del Hotel / Restaurante** | PC (Oficina) | *"Ver cuánto dinero tengo disponible y cuánto está retenido en Escrow"* |
| **Recepcionista / Mesero** | Celular (en mano) | *"Aceptar o rechazar una reserva en 2 toques mientras atiendo al cliente"* |
| **Conductor / Lanchero** | Celular (al aire libre) | *"Ver si llegó un pedido nuevo sin tener que entrar a ninguna app complicada"* |
| **Administrador del Portal** | PC + Tablet | *"Supervisar todas las operaciones y liberar fondos de Escrow manualmente"* |

---

## 1. Principios de Diseño (Design Thinking Aplicado)

### 1.1 Guiding Principles (Principios Rectores)
1. **Claridad ante todo:** Un comerciante no debe dudar qué significa ningún número o botón.
2. **Velocidad de respuesta operativa:** Una nueva reserva debe poder ser confirmada en menos de 3 segundos, con 2 toques en el celular.
3. **Transparencia financiera:** El modelo Escrow puede generar desconfianza. La UI debe hacer que el dinero "retenido" se sienta **seguro**, no "atrapado".
4. **Sin fricción tecnológica:** Los aliados NO son desarrolladores. Los flujos deben funcionar sin tutoriales.
5. **Confianza y premium:** La estética comunica que Portal Necoclí es serio, confiable y profesional.

---

## 2. Sistema de Diseño Visual (Tokens y Estética)

Basado en el sistema de diseño ya existente del proyecto (`tailwind.config.ts`):

### 2.1 Paleta de Colores (Semántica de Negocio)
| Token | Color | Uso en el Dashboard |
|---|---|---|
| `teal` | Verde esmeralda | Saldo disponible, éxito, "Liberado" |
| `coral` | Naranja coral | Escrow retenido, alertas suaves, acciones clave |
| `ink` | Gris oscuro | Texto principal, fondo de tarjetas neutras |
| `sand` | Crema tropical | Fondos secundarios, tarjetas de información |

### 2.2 Tipografía
- **Encabezados:** Font del sistema con `font-bold tracking-tight` (ya configurado).
- **Montos financieros:** `text-3xl font-bold tabular-nums` — Los números deben tener ancho fijo para evitar saltos al actualizar.
- **Etiquetas operativas:** `text-xs uppercase tracking-widest` — Comunicación secundaria, sin jerarquía visual.

### 2.3 Espaciado y Radios
- **Tarjetas:** `rounded-[28px]` (ya en uso) — Evoca calidez, no frialdad corporativa.
- **Botones de acción primaria:** `rounded-full` con `min-h-[48px] min-w-[48px]` (norma táctil Apple HIG / Google Material).
- **Grid base:** `gap-4` en mobile, `gap-6` en desktop.

---

## 3. Arquitectura de Navegación (Responsive Navigation)

### 3.1 Estrategia Mobile-First (Diseño Primero para Celular)
El 80% de los usuarios operativos (meseros, conductores, recepcionistas) usarán **celulares en terreno**. El layout de escritorio es una expansión del diseño móvil, no al revés.

### 3.2 Patrón de Navegación por Dispositivo

#### 📱 Mobile (`< 768px`) — Bottom Navigation Bar
```
┌────────────────────────────────────────┐
│                                        │
│          [Contenido Principal]         │
│                                        │
│                                        │
├────────────────────────────────────────┤
│  🏠 Inicio │ 🛎️ Ops │ 🎫 Tickets │ ⚙️ │
└────────────────────────────────────────┘
```
- **Posición:** Fija al fondo (`fixed bottom-0`), nunca se pierde de vista.
- **Iconos grandes:** Mínimo 44px de área táctil por ícono.
- **Indicador activo:** Punto de color `coral` o `teal` debajo del ícono seleccionado.
- **Implementación:** `components/dashboards/merchant/MerchantBottomNav.tsx`

#### 💻 Tablet + PC (`>= 768px`) — Sidebar Lateral Colapsable
```
┌──────────┬──────────────────────────────┐
│   LOGO   │                              │
│──────────│    [Contenido Principal]     │
│ 🏠 Inicio│                              │
│ 🛎️ Ops   │                              │
│ 🎫 Tickets│                             │
│ ⚙️ Config │                             │
│          │                              │
│  v2.0    │                              │
└──────────┴──────────────────────────────┘
```
- **Ancho:** `w-64` expandido, `w-20` colapsado (solo iconos).
- **Toggle:** Botón hamburguesa que anima con Framer Motion.
- **Implementación:** `components/dashboards/merchant/MerchantSidebar.tsx`

---

## 4. Arquitectura Atómica de Componentes (Atomic Design)

Siguiendo la metodología de Brad Frost, los componentes se construyen de menor a mayor complejidad:

```
Átomos → Moléculas → Organismos → Plantillas → Páginas
```

### 4.1 Átomos (Componentes Base — ya existentes en el proyecto)
- `SurfaceCard.tsx` — Contenedor con sombra y borde.
- `MetricCard.tsx` — Tarjeta de métrica simple.
- Badges de estado (`rounded-full bg-teal/10 text-teal`).

### 4.2 Moléculas (Nuevos Componentes a Construir)
Ubicación: `components/dashboards/merchant/`

| Componente | Descripción |
|---|---|
| `FinancialMetricCard.tsx` | Tarjeta de saldo con gradiente semántico y ícono |
| `ReservationRowCard.tsx` | Fila de reserva con botones de acción táctiles (Aceptar/Rechazar) |
| `EscrowStatusBadge.tsx` | Badge de estado: `held`, `released`, `pending` con colores semánticos |
| `ModeToggleSwitch.tsx` | Switch ON/OFF gigante para Modo Ocupado (64px altura) |
| `TicketInputWidget.tsx` | Input de código de ticket + botón de redimir |

### 4.3 Organismos (Secciones Completas)
| Componente | Descripción |
|---|---|
| `MerchantBottomNav.tsx` | Barra de navegación inferior (solo mobile) |
| `MerchantSidebar.tsx` | Barra lateral colapsable (tablet + desktop) |
| `EscrowSummaryPanel.tsx` | Panel de 3 saldos: Disponible, Retenido, Total |
| `OperationsPanel.tsx` | Feed de reservas del día con filtros |
| `TicketRedemptionPanel.tsx` | Herramienta de redención de tickets |

---

## 5. Estructura de Módulos y Rutas (Páginas del Dashboard)

### A. Vista General / Home (`app/merchant/page.tsx`) ✅ Existente
**Objetivo JTBD:** *"Ver mis saldos financieros y actividad reciente de un vistazo"*

**Contenido:**
1. **Banner de bienvenida personalizado** con el nombre del negocio y hora local.
2. **Panel Escrow `EscrowSummaryPanel.tsx`:** 3 tarjetas en grilla responsiva.
   - `grid-cols-1` en mobile (apiladas) → `grid-cols-3` en desktop.
3. **Feed de últimas transacciones Escrow** (ya implementado, necesita mejoras de UX responsiva).
4. **Mini-gráfico de tendencia semanal** usando `Recharts` con `<ResponsiveContainer width="100%" height={120}>`.
5. **CTA "Boost"** (Centro de Crecimiento, ya implementado).

**Gap detectado (Deuda Técnica):** La navegación actual usa tabs simples (`<nav>`) no responsivos. Debe ser reemplazada por el sistema `MerchantBottomNav` / `MerchantSidebar`.

---

### B. Gestión Operativa (`app/merchant/operaciones/page.tsx`) 🔴 Por construir
**Objetivo JTBD:** *"Aceptar o rechazar una reserva nueva en menos de 2 toques"*

**Contenido:**
1. **Filtros rápidos sticky** (pegados al top, siempre visibles):
   - `[ Hoy ] [ Mañana ] [ Esta Semana ] [ Histórico ]`
   - En mobile: Scroll horizontal (`overflow-x-auto flex gap-2`).
2. **Feed de Reservas (`ReservationRowCard.tsx`):**
   - Cada tarjeta muestra: Nombre del turista, servicio, fecha/hora, monto, estado.
   - **Botones de acción:**
     - ✅ Aceptar (`bg-teal text-white min-h-[48px]`)
     - ❌ Rechazar (`bg-red-50 text-red-600 min-h-[48px]`)
     - 💬 WhatsApp directo (enlace `wa.me/[telefono]`)
3. **Estado vacío (`Empty State`):** Ilustración amigable + mensaje *"No hay reservas para hoy. ¡Buen descanso! 🌴"*

---

### C. Redención de Tickets (`app/merchant/tickets/page.tsx`) 🔴 Por construir
**Objetivo JTBD:** *"Confirmar que el cliente llegó y liberar el dinero retenido"*

**Flujo de usuario (User Flow):**
```
Comerciante ingresa al módulo Tickets
    → Digita el código NEC-XXXX en el input
    → Sistema busca el ticket en Firestore
    → Si válido: Muestra nombre del cliente, servicio y monto
    → Comerciante toca "Confirmar Servicio Prestado"
    → Sistema llama a `releaseFunds()` → Estado pasa de `held` a `released`
    → Animación de confetti/éxito + notificación al cliente por correo
```

**Diseño:**
- Input central: `text-4xl text-center font-mono tracking-widest min-h-[80px]` — Fácil de digitar en celular.
- Teclado numérico virtual (futuro, actualmente usa el nativo del SO).
- **Preparado para QR:** El botón de escaneo estará presente pero deshabilitado con tooltip *"Próximamente"*.

---

### D. Configuración y Disponibilidad (`app/merchant/configuracion/page.tsx`) 🔴 Por construir
**Objetivo JTBD:** *"Pausar las reservas rápidamente cuando estoy lleno"*

**Contenido:**
1. **Switch "Modo Ocupado" (`ModeToggleSwitch.tsx`):**
   - Tamaño: `w-24 h-12` — Imposible de no ver.
   - Estado OFF (Verde ✅): *"Recibiendo reservas"*
   - Estado ON (Rojo 🔴): *"OCUPADO · No recibimos reservas temporalmente"*
   - Al activar: Dispara un Server Action que actualiza el campo `isAvailable: false` en Firestore.
   - La IA Alejandro consulta este campo antes de ofrecer el servicio en el chat.
2. **Edición de información del negocio:** Teléfono de contacto, horario, descripción.
3. **Gestión de fotos:** Enlace a Cloudinary para actualizar imágenes.

---

## 6. Accesibilidad (WCAG 2.1 AA — Estándar Obligatorio)

Siguiendo el estándar internacional de accesibilidad web:

| Criterio | Implementación |
|---|---|
| **Contraste de colores** | Relación mínima 4.5:1 para texto normal, 3:1 para texto grande. Validar con `axe` o Figma. |
| **Navegación por teclado** | Todos los elementos interactivos deben ser alcanzables con `Tab` y activables con `Enter/Space`. |
| **Áreas táctiles** | Mínimo `44x44px` por botón (Apple HIG) / `48x48px` recomendado (Google Material). |
| **`aria-label`** | Todos los íconos sin texto visible deben tener `aria-label` descriptivo. |
| **Feedback de estado** | Los cambios de estado (ej: "Reserva Aceptada") deben anunciarse con `aria-live="polite"`. |
| **Reduced Motion** | Animaciones de Framer Motion deben respetar `@media (prefers-reduced-motion: reduce)`. |

---

## 7. Gestión de Estados de Datos (Data States)

Todo panel de datos debe manejar los **4 estados posibles** (Nielsen Heuristic #1: Visibilidad del estado del sistema):

| Estado | Componente de UI |
|---|---|
| **Loading** | Skeleton placeholders animados (`animate-pulse`) — nunca un spinner girando en vacío |
| **Empty** | Ilustración + mensaje motivador + CTA (ej: *"Comparte tu enlace del portal para recibir tu primera reserva"*) |
| **Error** | Alerta con botón "Reintentar" y mensaje técnico en `details` colapsable (para debugging) |
| **Success** | Datos reales con micro-animación de entrada (`framer-motion: fadeInUp`) |

---

## 8. Performance y Optimización (Core Web Vitals)

Objetivo: Dashboard con `LCP < 2.5s`, `FID < 100ms`, `CLS = 0`.

| Técnica | Aplicación en el Dashboard |
|---|---|
| **React Server Components** | `app/merchant/page.tsx` carga datos de Firestore en el servidor. Sin fetching en el cliente. |
| **Suspense Boundaries** | Cada sección del dashboard envuelta en `<Suspense fallback={<Skeleton />}>` para carga progresiva. |
| **`tabular-nums`** | Fuente de ancho fijo para montos COP — elimina el `Cumulative Layout Shift` cuando los números cambian. |
| **`will-change: transform`** | Solo en animaciones de Framer Motion que usan GPU. |
| **No over-fetching** | Cada página solo pide los datos que necesita. El Home NO carga la lista de pedidos. |

---

## 9. Stack Tecnológico (Confirmado)

| Capa | Tecnología | Justificación |
|---|---|---|
| **UI Base** | Tailwind CSS `v3.4` | Sistema de diseño ya instaurado. Sin duplicar estilos. |
| **Animaciones** | Framer Motion `v13` | `AnimatePresence` para transiciones de rutas. `useReducedMotion()` para accesibilidad. |
| **Iconografía** | Lucide React `v1.37` | Vectores SVG, 0 dependencias de fuentes externas en runtime. |
| **Gráficos** | Recharts `v3.10` | Ya instalado. `<ResponsiveContainer>` garantiza adaptabilidad. |
| **Estado Servidor** | React Query `@tanstack/react-query v5` | Ya instalado. Manejo de cache, revalidación y estados de carga. |
| **Persistencia** | Firestore (firebase-admin) | Colecciones: `reservations`, `escrow_transactions`, `businesses`. |
| **Notificaciones** | Resend | Correos automáticos al liberar Escrow o confirmar reservas. |

---

## 10. Plan de Construcción (Sprint de Implementación)

**Orden de construcción recomendado (menor a mayor complejidad):**

```
Sprint 1: Layout Responsivo Base
  ├── [ ] MerchantBottomNav.tsx (mobile)
  ├── [ ] MerchantSidebar.tsx (desktop)
  └── [ ] Actualizar app/merchant/layout.tsx para usar ambos

Sprint 2: Mejoras al Home (app/merchant/page.tsx)
  ├── [ ] EscrowSummaryPanel.tsx con skeleton loading
  ├── [ ] Mini-gráfico de tendencia semanal
  └── [ ] Auditoría de responsividad (mobile test)

Sprint 3: Gestión Operativa
  ├── [ ] app/merchant/operaciones/page.tsx
  ├── [ ] ReservationRowCard.tsx con botones táctiles
  └── [ ] Filtros rápidos (Hoy / Mañana / Semana)

Sprint 4: Redención de Tickets
  ├── [ ] app/merchant/tickets/page.tsx
  ├── [ ] TicketInputWidget.tsx
  └── [ ] Server Action: confirmTicketRedemption()

Sprint 5: Configuración
  ├── [ ] app/merchant/configuracion/page.tsx
  ├── [ ] ModeToggleSwitch.tsx
  └── [ ] Server Action: toggleMerchantAvailability()
```

---

## 11. Estado Actual del Dashboard (Auditoría)

| Módulo | Archivo | Estado | Deuda Técnica |
|---|---|---|---|
| **Home / Saldos Escrow** | `app/merchant/page.tsx` + `merchant-dashboard.tsx` | ✅ Funcional | Navegación no responsiva (tabs simples) |
| **Pedidos** | `app/merchant/pedidos/page.tsx` + `orders-panel.tsx` | ✅ Funcional | Sin filtros, sin estados vacíos |
| **Bottom Nav Mobile** | — | 🔴 No existe | Crear `MerchantBottomNav.tsx` |
| **Sidebar Desktop** | `DashboardShell` genérico | 🟡 Parcial | Adaptar para merchant específicamente |
| **Operaciones / Reservas** | — | 🔴 No existe | Sprint 3 |
| **Redención Tickets** | — | 🔴 No existe | Sprint 4 |
| **Configuración / Modo Ocupado** | — | 🔴 No existe | Sprint 5 |

---

*📋 Documento de arquitectura oficial — Portal Necoclí 2.0 · Kraken Digital Labs*  
*Actualizado bajo metodologías: Design Thinking (IDEO), Atomic Design (Brad Frost), JTBD, WCAG 2.1 AA, Nielsen's 10 Heuristics.*
