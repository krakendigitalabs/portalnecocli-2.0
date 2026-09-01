import { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Preferencias de Cookies | Portal Necoclí",
  description: "Declaración y configuración de cookies de Portal Necoclí.",
};

export default function CookiesPage() {
  return (
    <div className="pb-24 pt-16 md:pt-24">
      <Container className="max-w-4xl space-y-12">
        <div className="space-y-6">
          <p className="text-sm font-bold tracking-widest text-gold uppercase">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-ink">
            Preferencias de Cookies
          </h1>
        </div>

        <div className="prose prose-lg prose-ink text-justify max-w-none text-ink/80">
          <p>
            Portal Necoclí utiliza cookies y tecnologías de seguimiento similares para mejorar tu
            experiencia de usuario, entender cómo interactúas con nuestra plataforma y ofrecerte
            contenido relevante.
          </p>

          <h3>¿Qué son las cookies?</h3>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo
            (computadora, tablet o smartphone) cuando visitas un sitio web. Nos ayudan a recordar
            tus preferencias y a reconocer tu dispositivo en visitas posteriores.
          </p>

          <h3>Tipos de cookies que utilizamos</h3>
          <ul>
            <li>
              <strong>Cookies Estrictamente Necesarias:</strong> Esenciales para que la plataforma
              funcione, como mantener tu sesión de usuario activa y procesar el carrito de reservas.
            </li>
            <li>
              <strong>Cookies de Rendimiento y Analítica:</strong> Nos permiten medir el tráfico y
              analizar cómo los usuarios navegan por el portal (ej. Firebase Analytics) para mejorar
              el diseño y la velocidad.
            </li>
            <li>
              <strong>Cookies de Funcionalidad:</strong> Permiten recordar tus preferencias, como el
              idioma o la ubicación.
            </li>
          </ul>

          <h3>Administración de tus Preferencias</h3>
          <p>
            Puedes configurar tu navegador web para rechazar o eliminar cookies en cualquier
            momento. Sin embargo, ten en cuenta que deshabilitar ciertas cookies (como las
            estrictamente necesarias) puede afectar el correcto funcionamiento de áreas críticas
            como el proceso de pago y reserva.
          </p>
        </div>
      </Container>
    </div>
  );
}
