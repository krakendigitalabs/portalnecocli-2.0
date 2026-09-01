import { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Descubre cómo funciona (FAQ) | Portal Necoclí",
  description: "Preguntas frecuentes sobre cómo reservar y operar en Portal Necoclí.",
};

export default function FAQPage() {
  return (
    <div className="pb-24 pt-16 md:pt-24 min-h-[70vh]">
      <Container className="max-w-4xl space-y-12">
        <div className="space-y-6">
          <p className="text-sm font-bold tracking-widest text-gold uppercase">FAQ</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-ink">
            Descubre cómo funciona
          </h1>
          <p className="text-xl text-ink/70">Todo lo que necesitas saber antes de tu viaje.</p>
        </div>

        <div className="space-y-8">
          <div className="border border-ink/10 rounded-3xl p-8 bg-white space-y-3">
            <h3 className="text-xl font-bold text-ink">¿Cómo funciona el pago de mis reservas?</h3>
            <p className="text-ink/70">
              Portal Necoclí utiliza un sistema de pagos seguro (Escrow). Cuando pagas una reserva
              (como un tour), tu dinero se guarda de forma segura y solo se le entrega al operador
              cuando tu actividad se confirma o comienza. Si algo sale mal, tu dinero está
              protegido.
            </p>
          </div>

          <div className="border border-ink/10 rounded-3xl p-8 bg-white space-y-3">
            <h3 className="text-xl font-bold text-ink">
              ¿Puedo contactar al hotel directamente antes de pagar?
            </h3>
            <p className="text-ink/70">
              ¡Por supuesto! Muchos de nuestros hoteles y restaurantes operan bajo "Enrutamiento
              Directo". Esto significa que verás botones de "Llamar ahora" o "Escribir por WhatsApp"
              en sus perfiles para que hables con ellos antes de hacer tu reserva oficial.
            </p>
          </div>

          <div className="border border-ink/10 rounded-3xl p-8 bg-white space-y-3">
            <h3 className="text-xl font-bold text-ink">
              ¿Qué hago si por clima no puedo hacer mi tour?
            </h3>
            <p className="text-ink/70">
              La seguridad es primero. Si la Capitanía de Puerto restringe las salidas al mar, te
              contactaremos inmediatamente para reprogramar tu tour sin costo adicional. Si no
              puedes en otra fecha, realizaremos la devolución de tu dinero (ver Políticas de
              Garantía).
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
