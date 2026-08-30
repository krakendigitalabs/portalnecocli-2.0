# 🚀 ONBOARDING TÉCNICO Y ARQUITECTURA: PORTAL NECOCLÍ 2.0

> [!IMPORTANT]
> **LECTURA OBLIGATORIA:** Este documento debe ser leído y comprendido por cualquier ingeniero, agente de IA o colaborador antes de intervenir en el código base de Portal Necoclí.

## 1. Visión General de Ingeniería
Portal Necoclí 2.0 es una plataforma transaccional de alto rendimiento diseñada bajo principios de **ingeniería de software moderna para la nube**. No es un simple directorio turístico; es un ecosistema B2B2C que gestiona un modelo de confianza (Escrow) y enrutamiento inteligente de solicitudes.

- **Tipo de Sistema:** Marketplace B2B2C, Motor Transaccional y Sistema de Enrutamiento Inteligente.
- **Enfoque de Diseño:** API-First, Mobile-First, Server-less (Vercel/Firebase).
- **Paradigma:** Clean Architecture, SOLID.

## 2. Stack Tecnológico (Core)
El stack ha sido seleccionado rigurosamente para garantizar escalabilidad masiva, tiempos de respuesta de milisegundos y mantenibilidad.

### Frontend & Framework
- **Next.js (App Router):** Framework principal. Se aprovecha SSR (Server-Side Rendering) para SEO dinámico y RSC (React Server Components) para reducir el bundle de JavaScript en el cliente, logrando tiempos de carga óptimos.
- **TypeScript:** Lenguaje principal en todo el proyecto. **Estrictamente tipado**. No se permite el uso de `any`.
- **Tailwind CSS:** Motor de estilos base. Permite consistencia a través de tokens, un sistema de diseño predecible y evita CSS residual.
- **Framer Motion:** (Requerimiento visual) Utilizado para micro-interacciones sutiles que aportan la sensación de plataforma "Premium/Luxury".

### Backend as a Service (BaaS) & Persistencia
- **Firebase Auth:** Gestión unificada de identidades y roles (Admin, Business, Operator, Customer).
- **Firestore (NoSQL):** Base de datos principal. Estructura orientada a documentos, ideal para el modelo transaccional y catálogos de lectura masiva.
- **Firebase Storage:** Almacenamiento de assets pesados, comprobantes de pago (Escrow) y recursos multimedia de los aliados.

### Infraestructura y DevOps
- **Vercel:** Plataforma Edge para despliegue. CI/CD automático, optimización de imágenes nativa y ejecución de Edge/Serverless Functions para nuestra API.

## 3. Arquitectura del Proyecto (Estructura de Directorios)
El proyecto impone una estricta separación de responsabilidades (Separation of Concerns).

```text
/
├── app/          # Enrutamiento basado en archivos (Next.js), Endpoints (/api), Pages, Layouts. Capa de presentación pura y enrutamiento backend.
├── components/   # Componentes React reutilizables (UI, Layouts, Widgets). Deben ser "dumb components" o de presentación en su mayoría.
├── lib/          # Utilidades base, formateadores, inicialización de clientes (ej. Firebase), configuración de la plataforma.
├── hooks/        # Lógica reactiva reutilizable (Custom Hooks) del lado del cliente.
├── types/        # Definiciones de interfaces y tipos globales (TypeScript). Actúan como el contrato de datos (Domain layer).
├── data/         # Repositorios y servicios de acceso a datos (Abstracción sobre Firestore y APIs externas).
├── public/       # Assets estáticos (fuentes, iconos, imágenes base).
└── docs/         # Documentación de ingeniería, planes maestros, análisis técnicos y guías.
```

## 4. Patrones de Diseño y Reglas Arquitectónicas

> [!CAUTION]
> **REGLAS ESTRICTAS DE DESARROLLO**
> 1. **Idioma:** Nombres de archivos, variables, funciones, tipado y commits SIEMPRE en **Inglés**. Textos visibles de UI SIEMPRE en **Español**.
> 2. **DRY & Reutilización:** No duplicar lógica. Todo código repetitivo debe extraerse a `hooks/`, `lib/` o `components/`.
> 3. **Separación de Capas:** NUNCA consultar Firestore directamente desde un componente de UI en `app/`. La llamada debe abstraerse en la capa `data/` o usar *Server Actions*.

### 4.1. Arquitectura en Capas
- **Capa de Dominio (`types/`):** Define qué es una `Reservation`, un `User`, una `EscrowTransaction`. Entidades puras.
- **Capa de Datos (`data/`):** Implementa cómo obtener o escribir datos (ej. `getReservationById`), encapsulando completamente la lógica de Firestore.
- **Capa de Presentación (`app/`, `components/`):** Solicita o recibe los datos y se encarga exclusivamente de renderizar y capturar eventos de usuario.

### 4.2. Modelos Críticos de Negocio
- **Modelo Escrow:** Sistema transaccional de garantía. Las reservas del "Caso A" entran en estado retenido (`escrow`) hasta que el servicio es prestado y verificado. Requiere inmutabilidad y auditoría rigurosa.
- **Enrutador de Triangulación:** Sistema inteligente de flujo de ventas.
  - *Caso A (Paquete Portal):* Cierre transaccional 100% dentro de la plataforma (Retención de cliente y pago).
  - *Caso B (Tercero):* Hand-off (transferencia) limpia al aliado externo recolectando previamente datos analíticos.

## 5. Ecosistema Multi-Agente
El proyecto convive con agentes IA especializados. Al desarrollar, respeta los lineamientos de cada rol de diseño e ingeniería:
- **Agente 1 (Arquitecto):** Vigila la integridad estructural, SOLID, y seguridad backend.
- **Agente 2 (Chatbot):** Modela la experiencia B2C, la venta y el enrutamiento.
- **Agente 3 (Director Creativo):** Impone el estándar "Luxury/Premium". Espacios en blanco, tipografías correctas y paletas sofisticadas.
- **Agente 4 (DevOps):** Prioriza SEO, tiempos de respuesta de milisegundos y configuración limpia en CI/CD.
- **Agente 5 (CM):** Requiere que las rutas y metas estén 100% pensadas para indexación de Google y generación de contenido orgánico.

## 6. Checklist de Intervención (Antes de escribir código)
Antes de crear o modificar un módulo en el código fuente, cualquier desarrollador/IA debe confirmar:
- [ ] Entiendo a qué **Fase del Roadmap** (ver `AGENTS.md`) pertenece mi tarea actual.
- [ ] He revisado si ya existe un tipo, interfaz o componente que resuelva parte del problema en `types/` o `components/`.
- [ ] Mi código será **100% TypeScript** sin usar `any`.
- [ ] La UI resultante será **mobile-first** y mantendrá el estándar estético premium del portal.
- [ ] Al finalizar, pasaré validaciones locales de compilación y linters (`npm run build`).

---
*Fin del Onboarding. El cumplimiento de estas directrices no es opcional, es la base operativa de Kraken Digital Labs para Portal Necoclí.*
