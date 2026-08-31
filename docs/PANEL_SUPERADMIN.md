# 👑 Panel SuperAdmin: Centro de Comando (Kraken Digital Labs)

Este documento es el plano maestro de todo lo que el **SuperAdmin (Yessy / Kraken Digital Labs)** podrá controlar dentro del cerebro de **Portal Necoclí 2.0**. 
Cada vez que construyamos un nuevo módulo en la plataforma, sus controles de administración se documentarán aquí.

---

## 1. 👥 Gestión de Leads y Turistas (CRM)
El SuperAdmin es el único con acceso a la base de datos completa de prospectos capturados por el *Enrutador Inteligente* antes de enviarlos a los aliados.
- **Base de Datos de Clientes:** Ver Nombre, Teléfono, Correo, Fecha de interés y cantidad de acompañantes de todos los que intentan reservar.
- **Trazabilidad:** Saber exactamente qué turista hizo clic para ir al WhatsApp de qué hotel/aliado.
- **Exportación:** Capacidad de exportar estos leads para campañas de remarketing o email marketing.

## 2. 🏦 Motor Financiero y Sistema Escrow
El control absoluto sobre el dinero que fluye a través de la plataforma (Caso A) y la auditoría de ventas.
- **Bóveda Central:** Visualizar el total de dinero retenido (`held_balance`) actualmente en custodia de Portal Necoclí.
- **Liquidaciones (Payouts) B2B:** Panel para aprobar y marcar pagos como "Liberados" (`released`) hacia las cuentas bancarias de los comercios aliados una vez prestado el servicio.
- **Control de Comisiones:** Visualizar las ganancias netas de la plataforma (`platformFee`) por cada transacción Escrow.
- **Gestor de Disputas:** Capacidad de marcar transacciones como `disputed` si hay problemas entre turista y hotel, y procesar reembolsos (`refunded`).

## 3. 🏢 Gestión de Negocios y Aliados
Control sobre quién puede vender dentro de Portal Necoclí.
- **Aprobación de Onboarding:** Cuando un comercio llena el formulario de "Afiliar Comercio", el SuperAdmin debe aprobar su ingreso.
- **Asignación de Roles y Tenants:** Crear credenciales de acceso para los hoteleros/operadores para que entren a su propio panel privado (`/merchant`).
- **Visibilidad:** Apagar o encender fichas de negocios en el Marketplace público si no están al día con sus pagos o no cumplen estándares.

## 4. 🌴 Creador de Paquetes Propios (Caso A)
La plataforma no solo enlaza, también vende productos propios de Kraken Digital Labs.
- **Gestor de Paquetes:** Crear, editar o eliminar paquetes como *Vive Islas*, *Vive Local*, *Día de Sol*.
- **Control de Inventario y Precios:** Definir cupos máximos, ajustar tarifas por temporada y establecer imágenes y descripciones.
- **Generador de Tickets Oficiales:** Ver los tickets de pago generados cuando un cliente reserva uno de estos paquetes.

## 5. 🤖 Sistema Multi-Agente y Configuración
Control sobre el comportamiento de la plataforma y sus asistentes de IA.
- **Prompts del Chatbot:** Ajustar el tono y las instrucciones del "Guía Comercial" (Agente 2) que atiende a los clientes B2C.
- **Control SEO y Blog:** Revisar los artículos creados por el "Community Manager" (Agente 5) antes de publicarlos en el blog del portal.
- **Gestor de Variables Globales:** Cambiar números de WhatsApp de soporte central, redes sociales o textos legales.

---
*(Este documento es un ente vivo. Se expandirá a medida que la plataforma sume nuevas funcionalidades y conquiste nuevos mercados).*
