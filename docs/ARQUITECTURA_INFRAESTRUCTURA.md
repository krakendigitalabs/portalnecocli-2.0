# 🏗️ INFORME DE INFRAESTRUCTURA Y ESCALABILIDAD
**Documento Oficial - Kraken Digital Labs (Portal Necoclí)**

Este documento detalla las capacidades técnicas actuales, límites operativos, costos reales de escalabilidad y oportunidades de la arquitectura de la plataforma. Ha sido diseñado para ser presentado ante la junta de Kraken Digital Labs, inversionistas o autoridades (Cámara de Comercio).

---

## 1. 🌐 VERCEL (Hosting, Cómputo Serverless y CDN)
Vercel es nuestra plataforma de despliegue principal. Hospeda la aplicación construida en **Next.js App Router**, gestionando el tráfico público y la ejecución del backend ligero (Serverless Functions).

* **Capacidad Actual (Capa Hobby/Gratuita):**
  * Soporta cómodamente ráfagas de miles de visitas por hora gracias a su Edge Network global.
  * Límite de 100 GB de ancho de banda al mes.
  * Funciones sin servidor (Backend) limitadas a 10 segundos de ejecución.
* **El Cuello de Botella:** Si el portal supera las decenas de miles de visitas mensuales, se superará el límite de ancho de banda.
* **Costos de Escalamiento (Oportunidad):**
  * Escalar al plan **Vercel Pro ($20 USD / mes)** multiplica el ancho de banda a 1 TB/mes, permite funciones backend de hasta 5 minutos de ejecución y habilita protección avanzada contra ataques DDoS, blindando la plataforma en temporadas altas.

## 2. 🔥 FIREBASE Y FIRESTORE (Google Cloud)
Firebase es el corazón de los datos transaccionales de Portal Necoclí. Gestiona la autenticación de usuarios (Firebase Auth) y la base de datos en tiempo real (Firestore).

* **Capacidad Actual (Capa Spark/Gratuita):**
  * **Auth:** Hasta 50.000 usuarios activos mensuales. (Suficiente para todo Necoclí).
  * **Firestore:** Soporta 1 millón de conexiones concurrentes y 10.000 escrituras por segundo. 
  * **Límite Gratuito Diario:** 50.000 lecturas y 20.000 escrituras de documentos por día (aproximadamente 3.000 reservas/pedidos al día).
* **El Cuello de Botella:** El límite de lecturas puede superarse si miles de turistas hacen búsquedas masivas de hoteles/restaurantes todos los días de forma simultánea.
* **Costos de Escalamiento:** 
  * Plan **Pay-as-you-go (Blaze)**: Al superar los límites gratuitos, Google cobra centavos. Ej: $0.06 USD por cada 100.000 lecturas adicionales y $0.18 USD por 100.000 escrituras. Mantener una base de 10.000 transacciones mensuales costaría menos de **$5 USD / mes**.

## 3. 🤖 GOOGLE GEMINI (AI Studio / Vertex AI)
El motor de inteligencia de "Alejandro (Guía Local)" corre sobre los modelos `gemini-1.5-flash` y `gemini-flash-lite-latest`.

* **Capacidad Actual (Capa Gratuita AI Studio):**
  * Límite de 15 solicitudes (Request Per Minute - RPM).
  * Límite de 1 millón de tokens por minuto (TPM) y 1.500 peticiones diarias (RPD).
* **El Cuello de Botella:** La limitación de 15 peticiones por minuto. Si 5 personas chatean rápidamente con Alejandro al mismo tiempo, la IA se detendrá momentáneamente dando un error `429 (Too Many Requests)`.
* **Costos de Escalamiento:**
  * Asociar una tarjeta en Google AI Studio (Facturación por consumo).
  * **Costo real:** ~$0.35 USD por 1 Millón de tokens en `Flash-Lite`. Para contextualizar, 1 millón de tokens equivale a unas 2,000 interacciones promedio. Operar la IA 24/7 con miles de clientes costará menos de **$15 a $20 USD / mes**.

## 4. 📧 RESEND (Motor de Correos Transaccionales)
Encargado de disparar simultáneamente los 4 correos dinámicos por cada compra o pedido (Cliente, Comercio Aliado, Operaciones Kraken y Buzón del Guía).

* **Capacidad Actual (Capa Gratuita):**
  * 3.000 correos al mes (limitado a **100 correos diarios**).
* **El Cuello de Botella:** Al enviar 4 correos por transacción, la plataforma solo puede procesar **25 pedidos al día** en la capa gratuita. Es el límite más restrictivo de todo el ecosistema.
* **Costos de Escalamiento:**
  * Plan **Resend Pro ($20 USD / mes)**: Amplía la capacidad a 50.000 correos mensuales (1.200 transacciones o pedidos al mes). Si las ventas superan esa cifra, se pagan $10 USD por cada 50.000 correos adicionales. Es una inversión minúscula frente a la comisión recaudada.

## 5. 💳 WOMPI (Pasarela de Pagos / Escrow)
Wompi, respaldado por Bancolombia, es la bóveda financiera de Portal Necoclí.

* **Capacidad Actual:** Ilimitada.
* **Costos (Variable por transacción):**
  * Retiene $2.65% + $900 COP (o 2.95% + $800 COP) por transacción exitosa. No hay mensualidades ni cobros ocultos.
* **Oportunidad:** Como Kraken Digital Labs retendrá el dinero temporalmente (Escrow), se genera flujo de caja inmediato. Los costos de Wompi se absorben perfectamente con las comisiones B2B pactadas (6%, 10% y 12%).

---

### 🚀 OPORTUNIDADES FUTURAS
1. **Infraestructura elástica:** Hoy la plataforma opera con $0 USD de costo fijo mensual.
2. **El "Threshold" Mágico:** Cuando Portal Necoclí empiece a superar consistentemente los 25 pedidos al día, el Take Rate generado por esas ventas pagará por sí solo la actualización de los servidores (Vercel + Resend + Gemini).
3. **Migración a Enterprise:** En un escenario de masificación del turismo donde la plataforma tramite más de 20.000 reservas al mes, el costo de los servidores ascendería a un aproximado de $100-$150 USD/mes, cifra completamente insignificante frente a la rentabilidad del negocio.
