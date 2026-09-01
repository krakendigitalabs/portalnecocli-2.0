import { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Políticas de Garantía | Portal Necoclí",
  description: "Políticas de reservas, cancelaciones y el modelo Escrow de Portal Necoclí.",
};

export default function GarantiaPage() {
  return (
    <div className="pb-24 pt-16 md:pt-24">
      <Container className="max-w-4xl space-y-12">
        <div className="space-y-6">
          <p className="text-sm font-bold tracking-widest text-gold uppercase">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-ink">
            Políticas de Garantía y Reembolsos
          </h1>
        </div>

        <div className="prose prose-lg prose-ink text-justify max-w-none text-ink/80">
          <p>
            Nuestra prioridad es que viajes con total tranquilidad. Portal Necoclí ha implementado
            un sistema robusto de garantías a través de nuestro modelo Escrow (Fideicomiso) para
            proteger tu dinero.
          </p>

          <h3>1. Garantía del Modelo Escrow</h3>
          <p>
            Cuando realizas el pago de una reserva (Caso A - Servicio Empaquetado), los fondos no se
            entregan inmediatamente al comercio. Portal Necoclí retiene temporalmente el pago y solo
            lo libera al comercio cuando tu reserva se ha cumplido satisfactoriamente o cuando
            inicia el servicio. Si el comercio cancela la operación por motivos de fuerza mayor, tu
            dinero está 100% seguro con nosotros y puede ser reembolsado.
          </p>

          <h3>2. Cancelaciones por parte del Usuario</h3>
          <ul>
            <li>
              <strong>Con más de 72 horas de anticipación:</strong> Puedes solicitar un reembolso
              del 90% del valor total pagado (retenemos un 10% por costos transaccionales de las
              pasarelas).
            </li>
            <li>
              <strong>Entre 72 y 24 horas:</strong> Reembolso sujeto a las políticas individuales
              del hotel u operador (generalmente 50% de devolución).
            </li>
            <li>
              <strong>Menos de 24 horas (No-Show):</strong> No se aplican reembolsos, dado que el
              comercio ya ha reservado el espacio y/o insumos para tu llegada.
            </li>
          </ul>

          <h3>3. Factores Climáticos y Fuerza Mayor</h3>
          <p>
            Necoclí es un destino tropical y costero. En caso de que la Capitanía de Puerto cierre
            el muelle, o existan condiciones climáticas extremas que impidan la realización de un
            tour marítimo, se ofrecerá la <strong>reprogramación gratuita</strong> de la actividad.
            Si por tu itinerario de viaje no puedes reprogramar, procederemos a realizar un
            reembolso completo.
          </p>

          <h3>4. Proceso de Solicitud</h3>
          <p>
            Toda solicitud de modificación o reembolso debe realizarse enviando un correo a{" "}
            <strong>soporte@portalnecocli.com</strong> adjuntando tu Número de Ticket y los motivos.
            Nuestro equipo resolverá tu solicitud en un tiempo máximo de 3 días hábiles.
          </p>
        </div>
      </Container>
    </div>
  );
}
