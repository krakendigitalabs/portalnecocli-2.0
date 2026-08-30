import { Container } from "@/components/ui/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Portal Necoclí",
  description: "Términos y condiciones de uso de la plataforma transaccional Portal Necoclí.",
};

export default function TerminosPage() {
  return (
    <div className="pb-24 pt-16 md:pt-24">
      <Container className="max-w-4xl space-y-12">
        <div className="space-y-6">
          <p className="text-sm font-bold tracking-widest text-gold uppercase">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-ink">
            Términos y Condiciones
          </h1>
          <p className="text-ink/60">Última actualización: 30 de Agosto de 2026</p>
        </div>

        <div className="prose prose-lg prose-ink text-justify max-w-none text-ink/80">
          <p>
            Bienvenido a <strong>Portal Necoclí 2.0</strong>, operado por <em>Kraken Digital Labs</em>. Al acceder o utilizar nuestra plataforma, aceptas estar sujeto a los siguientes términos y condiciones. Te recomendamos leerlos cuidadosamente antes de realizar cualquier reserva o transacción.
          </p>
          
          <h3>1. Naturaleza del Servicio y Modelo Escrow</h3>
          <p>
            Portal Necoclí opera bajo un modelo de fideicomiso tecnológico (Escrow) y como puente de enrutamiento comercial. 
            Actuamos como un tercero de confianza que retiene los fondos del Turista (Cliente) hasta que el prestador del servicio (Hotel, Operador de Turismo, Restaurante o Transporte) confirme o brinde la atención pactada, garantizando así la seguridad de la transacción para ambas partes.
          </p>

          <h3>2. Reservas y Pagos</h3>
          <ul>
            <li>Todas las tarifas mostradas en la plataforma están sujetas a disponibilidad y pueden cambiar sin previo aviso antes de la confirmación final del pago.</li>
            <li>Al procesar un pago a través de nuestros canales integrados (ej. Wompi, Nequi), Portal Necoclí emitirá un <strong>Ticket Digital de Recaudo Oficial</strong> que actúa como soporte contable temporal.</li>
            <li>El comercio aliado es el responsable final de la emisión de la factura de venta definitiva por el servicio prestado, según la normativa tributaria colombiana vigente.</li>
          </ul>

          <h3>3. Obligaciones del Usuario (Turista)</h3>
          <p>
            El usuario se compromete a proveer información veraz durante el proceso de reserva, respetar los reglamentos internos de cada comercio aliado (hoteles, botes, etc.) y llegar puntualmente a los puntos de encuentro establecidos.
          </p>

          <h3>4. Enrutamiento Directo (Servicios Aliados)</h3>
          <p>
            En los casos donde Portal Necoclí actúa solo como puente de conexión comercial (Enrutamiento Directo), la plataforma facilitará el contacto mediante WhatsApp u otros canales entre el turista y el comercio. En estos escenarios, las políticas de cancelación y pago dependerán directamente del comercio aliado.
          </p>

          <h3>5. Modificaciones</h3>
          <p>
            Nos reservamos el derecho de actualizar estos términos en cualquier momento. El uso continuado de la plataforma tras la publicación de los cambios constituirá la aceptación de los mismos.
          </p>
        </div>
      </Container>
    </div>
  );
}
