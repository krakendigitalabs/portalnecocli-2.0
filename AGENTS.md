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
