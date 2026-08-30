import { Container } from "@/components/ui/container";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Centro de Ayuda | Portal Necoclí",
  description: "¿Necesitas soporte? Encuentra respuestas a tus preguntas y comunícate con nosotros.",
};

export default function AyudaPage() {
  return (
    <div className="pb-24 pt-16 md:pt-24 min-h-[70vh]">
      <Container className="max-w-5xl space-y-16">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-ink">
            Centro de Ayuda
          </h1>
          <p className="text-xl text-ink/70 max-w-2xl mx-auto">
            Estamos aquí para asegurarnos de que tu experiencia en Necoclí sea perfecta.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Link href="/faq" className="group p-10 rounded-[32px] border border-ink/5 bg-sand/30 hover:bg-white hover:border-gold/30 hover:shadow-lg transition-all space-y-4">
            <div className="w-14 h-14 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-6">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-ink group-hover:text-gold transition-colors">Descubre cómo funciona</h3>
            <p className="text-ink/70">
              Respuestas rápidas a las preguntas más frecuentes sobre reservas, pagos y el uso de la plataforma.
            </p>
          </Link>

          <Link href="/contacto" className="group p-10 rounded-[32px] border border-ink/5 bg-sand/30 hover:bg-white hover:border-green/30 hover:shadow-lg transition-all space-y-4">
            <div className="w-14 h-14 rounded-full bg-green/10 text-green flex items-center justify-center mb-6">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-ink group-hover:text-green transition-colors">Atención al Cliente</h3>
            <p className="text-ink/70">
              ¿Tienes un problema con tu reserva o necesitas hablar con un humano? Contáctanos directamente.
            </p>
          </Link>
        </div>
      </Container>
    </div>
  );
}
