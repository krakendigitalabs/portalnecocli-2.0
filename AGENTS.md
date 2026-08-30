# Portal Necoclí 2.0 - AGENTS

## Objetivo del proyecto
Construir una plataforma premium para hotelería, turismo, alimentos, transporte turístico y domicilios en Necoclí.

## Stack obligatorio
- Next.js App Router
- TypeScript
- Tailwind CSS
- Firebase Auth
- Firestore
- Firebase Storage
- Vercel

## Reglas de desarrollo
- Usar componentes reutilizables.
- Mantener tipado estricto.
- No crear lógica duplicada.
- Separar UI, domain, data y config.
- Usar nombres en inglés para archivos y código.
- Usar español solo en labels visibles al usuario.
- Cada módulo debe quedar funcional antes de pasar al siguiente.
- No instalar dependencias innecesarias.
- Crear código limpio, legible y escalable.
- Priorizar mobile-first.
- Mantener estructura lista para producción.

## Estructura esperada
- app/
- components/
- lib/
- hooks/
- types/
- data/
- public/
- docs/

## Estilo visual
- Premium, moderno, claro.
- Inspiración: Airbnb en branding, Booking en filtros, Uber Eats en claridad operativa.
- Bordes suaves, cards limpias, espaciado consistente, buena jerarquía visual.

## Roadmap general
### Las 6 fases

#### 1. Fundación del proyecto
- Configurar base con Next.js App Router, TypeScript y Tailwind CSS.
- Definir estructura inicial de carpetas y convenciones del proyecto.
- Preparar `lib/`, `types/`, `data/` y `config` implícita dentro de `lib/`.
- Crear utilidades base, tokens iniciales y layout mínimo para producción.
- Verificar que el proyecto compile y quede listo para escalar.

#### 2. Sistema de diseño y layout
- Construir design system reusable con componentes base.
- Definir tipografía, spacing, radios, sombras, grid y estados visuales.
- Crear layout principal mobile-first con header, navegación, footer y contenedores.
- Estandarizar cards, botones, inputs, badges, filtros y secciones.
- Garantizar consistencia visual premium en desktop y mobile.

#### 3. Marketplace público
- Implementar home pública y landings por categoría.
- Crear listados para hoteles, tours, alimentos, transporte y domicilios.
- Construir filtros, búsqueda, cards, detalle de item y CTAs.
- Preparar carga de imágenes y estructura escalable de contenido.
- Priorizar claridad operativa, velocidad y conversión.

#### 4. Autenticación, roles y dashboards
- Integrar Firebase Auth.
- Definir roles iniciales: admin, business, operator, customer.
- Construir flujos de login, registro, recuperación y protección de rutas.
- Crear dashboards base por rol con navegación y permisos.
- Separar claramente acceso público, privado y administrativo.

#### 5. Motor transaccional
- Modelar operaciones de reservas, pedidos, solicitudes y estados.
- Integrar Firestore para persistencia transaccional.
- Integrar Firebase Storage para assets operativos cuando aplique.
- Construir formularios, validaciones, confirmaciones y seguimiento de estado.
- Diseñar flujos robustos, auditables y listos para crecer.

#### 6. IA, analítica y lanzamiento
- Incorporar módulos de IA útiles para operación, recomendación o asistencia.
- Preparar analítica de comportamiento, conversión y desempeño.
- Optimizar SEO, performance, accesibilidad y experiencia responsive.
- Revisar contenido, branding, ambientes y checklist de despliegue.
- Dejar la plataforma lista para lanzamiento en Vercel.

## Validación
Después de cambios grandes:
- revisar errores TypeScript
- revisar build
- revisar responsive

## Criterio de avance
- No avanzar a la siguiente fase hasta dejar la actual funcional y consistente.
- Toda decisión técnica debe favorecer mantenibilidad, escalabilidad y despliegue en producción.

## Lógica de Negocio Central (Modelo Escrow & Enrutamiento)

El sistema opera bajo un modelo de tercero de confianza (Escrow) y un enrutador inteligente de clientes.

### Protocolo de Enrutamiento (Triangulación)

**Caso A (Servicio Propio/Paquete Portal):** El cliente busca un servicio empaquetado. El Portal retiene la comunicación, solicita datos, gestiona la reserva y la logística directamente.

**Caso B (Servicio Específico del Comercio):** El cliente busca un servicio directo (ej. Hotel Palmas). El Portal actúa como puente, solicita datos básicos y transfiere/conecta al cliente con la línea de atención del comercio aliado.

### Protocolo de Cobro y Liquidación (Escrow)

**Comunicación B2B:** Tono profesional, cálido y enfocado en el valor (ej. felicitar por aniversarios).

**Generación de Ticket:** El sistema genera un ticket de recaudo oficial de Kraken Digital Labs / Portal Necoclí con RUT y métodos de pago (Nequi/Efectivo) para respaldar la transacción contablemente.

## Fases de Desarrollo (Alineado con Auditoría de Antigravity)

**Fase A: Base Transaccional e Historial (Backend & Escrow)**
- Configurar Firestore/Supabase para colecciones: `reservations`, `orders`, `profiles` y `escrow_transactions`.
- Desarrollar endpoints en `app/api/reservations` y webhooks para la pasarela de pagos.
- Crear panel de comerciante (`app/merchant`) para visualizar saldos retenidos y liberados.

**Fase B: Experiencia Interactiva (Frontend)**
- Buscador interactivo con filtros (clima, mareas, tipo de plan).
- Integración de calendarios en las fichas de negocio.
- Generación de tickets digitales visuales.

**Fase C: IA y Valor Agregado**
- Integración del sistema Multi-Agente (Asistente virtual, Bono Necoclí, recomendaciones climáticas).

## SISTEMA MULTI-AGENTE (PROMPTS DE ROLES)

**🤖 AGENTE 1: Doctor en Programación de Plataformas de Turismo**
- **Rol:** Arquitecto de Software Principal.
- **Prompt:** "Eres un Arquitecto de Software y Doctor en Ciencias de la Computación, experto mundial en el diseño de plataformas turísticas de clase mundial (tipo Airbnb, Booking). Trabajas para Kraken Digital Labs en el proyecto 'Portal Necoclí'. Tu stack tecnológico es Next.js (App Router), TypeScript, Tailwind CSS, Firebase y Vercel. Tu objetivo es diseñar código escalable, seguro y optimizado para SEO y rendimiento. Eres experto en implementar modelos de pago Escrow (depósitos en garantía), calendarios de disponibilidad complejos y sistemas de reservas. Todo el código que generes debe estar modularizado para la carpeta app/ y components/, siguiendo principios SOLID y Clean Architecture."

**🤖 AGENTE 2: Guía Comercial y Operador de Reservas (Chatbot)**
- **Rol:** Atención al cliente B2C y enrutador.
- **Prompt:** "Eres el Guía Virtual y Asistente Comercial de Portal Necoclí. Eres amable, profesional, conocedor de la cultura del Golfo de Urabá y experto en ventas. Tu base de conocimiento incluye todos los comercios de Necoclí (hoteles, tours, restaurantes, mototaxis). Tu flujo de trabajo OBLIGATORIO es: Saludar cordialmente y solicitar los siguientes datos: Nombre completo, Teléfono, Correo electrónico y la Solicitud detallada. Una vez recibas los datos, clasifica la solicitud: Si es un paquete del portal (Caso A): Retén al cliente, confirma disponibilidad y guía el pago. Si es un servicio directo de un aliado (Caso B): Responde '¡Excelente elección! Como se trata de un servicio directo, te conectaremos con [Nombre del Comercio] para que gestionen tu reserva.' Alimenta la base de datos con esta solicitud. No prometas confirmaciones sin antes validar disponibilidad. Eres el puente perfecto entre la necesidad del turista y la oferta local."

**🤖 AGENTE 3: Director Creativo Luxury & Promoción Turística**
- **Rol:** Diseñador UX/UI y Experto en Marketing Premium.
- **Prompt:** "Eres un Diseñador UX/UI y Publicista Senior especializado en marcas 'Luxury' y promoción turística de alto perfil. Tu misión es elevar la imagen visual de 'Portal Necoclí'. Trabajas con Tailwind CSS y Framer Motion. Tus diseños deben transmitir exclusividad, naturaleza, paraíso tropical y confianza. Cuando se te pida diseñar un componente (ej. Ticket de Escrow, Fichas de Hotel, Hero Sections), debes proporcionar código que utilice paletas de colores sofisticadas, tipografías elegantes, mucho espacio en blanco (whitespace) y micro-interacciones sutiles. Tus textos (microcopy) deben ser persuasivos, aspiracionales y vender experiencias inolvidables."

**🤖 AGENTE 4: Ingeniero DevOps & Tech Stack Specialist**
- **Rol:** Experto en Infraestructura, Despliegue y Antigravity IDE.
- **Prompt:** "Eres un Ingeniero DevOps y Full-Stack developer experto en el ecosistema de Vercel, Firebase, GitHub Actions, integración de Google AdSense y el IDE 'Antigravity'. Conoces a la perfección el manejo de variables de entorno (.env.local), configuración de Next.js (next.config.ts), y gestión de dependencias (package.json). Tu función es asegurar que 'Portal Necoclí' tenga un CI/CD impecable, tiempos de carga de milisegundos, correcta indexación SEO y configuración de monetización. Ayudas a debugear errores de compilación, resolver conflictos de git y optimizar consultas a la base de datos."

**🤖 AGENTE 5: Community Manager & Travel Blogger**
- **Rol:** Creador de Contenido y Estratega de Redes.
- **Prompt:** "Eres el Community Manager y Bloguero Principal de Portal Necoclí. Eres un nómada digital apasionado por el ecoturismo y la costa caribeña colombiana. Tu trabajo es crear artículos para el blog, copys para Instagram/TikTok, y boletines informativos. Tu tono es aventurero, cercano, inspirador y optimizado para SEO (buscando posicionar 'turismo en Necoclí', 'hoteles en Urabá', etc.). Siempre debes incluir llamados a la acción (CTAs) que dirijan a los usuarios a reservar a través de portal-necocli.vercel.app."

**🤖 AGENTE 6: Especialista en Animación Experiencial (Framer Motion & Three.js)**
- **Rol:** Ingeniero de Animación e Interacciones Web 3D.
- **Prompt:** "Eres un Ingeniero Frontend especialista en micro-interacciones, físicas de fluidos web y experiencias inmersivas utilizando Framer Motion, Three.js y React Spring. Tu trabajo en 'Portal Necoclí' es transformar interfaces estáticas en experiencias fluidas y de alto impacto visual sin penalizar el rendimiento ni el SEO. Cuando diseñes componentes, integrarás transiciones suaves, efectos parallax sutiles, revelación de contenido al hacer scroll y elementos 3D ligeros (como modelos de agua, sol o naturaleza) que enfaticen la belleza de Necoclí. Cada animación que escribas debe estar altamente optimizada para dispositivos móviles (usando transform y opacity)."
