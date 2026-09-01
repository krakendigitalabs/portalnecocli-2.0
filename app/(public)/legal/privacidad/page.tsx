import { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Aviso de Privacidad | Portal Necoclí",
  description: "Políticas de tratamiento de datos personales de Portal Necoclí.",
};

export default function PrivacidadPage() {
  return (
    <div className="pb-24 pt-16 md:pt-24">
      <Container className="max-w-4xl space-y-12">
        <div className="space-y-6">
          <p className="text-sm font-bold tracking-widest text-gold uppercase">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-ink">
            Aviso de Privacidad
          </h1>
          <p className="text-ink/60">Última actualización: 30 de Agosto de 2026</p>
        </div>

        <div className="prose prose-lg prose-ink text-justify max-w-none text-ink/80">
          <p>
            En <strong>Portal Necoclí</strong>, respaldado por <em>Kraken Digital Labs</em>,
            valoramos profundamente tu privacidad y estamos comprometidos con la protección de tus
            datos personales, en cumplimiento con la Ley 1581 de 2012 y el Decreto 1377 de 2013 de
            la República de Colombia.
          </p>

          <h3>1. Datos que Recolectamos</h3>
          <p>
            Recolectamos información personal necesaria para procesar tus reservas y mejorar tu
            experiencia en nuestra plataforma. Esto incluye:
          </p>
          <ul>
            <li>Nombres y apellidos.</li>
            <li>Información de contacto (correo electrónico, número de teléfono/WhatsApp).</li>
            <li>
              Documento de identidad (requerido para registros hoteleros y manifiestos de transporte
              marítimo).
            </li>
            <li>
              Historial de navegación y preferencias de uso a través de nuestra plataforma web.
            </li>
          </ul>

          <h3>2. Uso de la Información</h3>
          <p>Los datos recolectados se utilizan exclusivamente para los siguientes propósitos:</p>
          <ul>
            <li>Gestionar, procesar y confirmar tus reservas con los comercios aliados.</li>
            <li>Comunicarnos contigo en relación con tu itinerario, pagos o soporte técnico.</li>
            <li>
              Enrutamiento comercial (compartir datos básicos con el hotel o tour operador para
              asegurar la prestación del servicio).
            </li>
            <li>
              Envío de promociones y boletines turísticos (solo si nos has dado tu consentimiento
              explícito).
            </li>
          </ul>

          <h3>3. Seguridad y Protección</h3>
          <p>
            Utilizamos tecnologías de encriptación estándar de la industria y la infraestructura de
            seguridad de Firebase (Google Cloud) para proteger tu información contra acceso no
            autorizado, alteración, divulgación o destrucción. No almacenamos directamente los datos
            de tu tarjeta de crédito; estos son procesados de forma segura por nuestras pasarelas de
            pago aliadas.
          </p>

          <h3>4. Tus Derechos</h3>
          <p>
            Como titular de los datos, tienes derecho a conocer, actualizar, rectificar y solicitar
            la eliminación de tu información de nuestras bases de datos en cualquier momento. Para
            ejercer estos derechos, por favor contáctanos al correo{" "}
            <strong>privacidad@portalnecocli.com</strong>.
          </p>
        </div>
      </Container>
    </div>
  );
}
