import { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Afiliar mi Comercio | Portal Necoclí",
  description:
    "Únete a Portal Necoclí y digitaliza tu negocio. Aumenta tus ventas y llega a miles de turistas.",
};

export default function AfiliarPage() {
  return (
    <div className="pb-24 pt-16 md:pt-24">
      <Container className="max-w-5xl space-y-16">
        <div className="space-y-6 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-ink max-w-3xl leading-tight">
            Escala tu negocio de turismo con tecnología de clase mundial
          </h1>
          <p className="text-xl text-ink/70 max-w-2xl mx-auto">
            Únete a la red de operadores, hoteles y restaurantes más exclusiva del golfo de Urabá.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-sand/30 border border-ink/5 p-8 rounded-3xl space-y-4 hover:border-gold/30 transition-colors">
            <h3 className="text-2xl font-bold text-ink">Visibilidad Premium</h3>
            <p className="text-ink/70 leading-relaxed">
              Tu comercio tendrá una ficha dedicada con posicionamiento SEO nativo. Los turistas te
              encontrarán primero al buscar sobre Necoclí en Google.
            </p>
          </div>
          <div className="bg-sand/30 border border-ink/5 p-8 rounded-3xl space-y-4 hover:border-gold/30 transition-colors">
            <h3 className="text-2xl font-bold text-ink">Modelo Seguro</h3>
            <p className="text-ink/70 leading-relaxed">
              Mediante nuestro sistema Escrow, aseguramos los fondos del turista hasta que prestas
              el servicio, garantizando seguridad para ambas partes.
            </p>
          </div>
          <div className="bg-sand/30 border border-ink/5 p-8 rounded-3xl space-y-4 hover:border-gold/30 transition-colors">
            <h3 className="text-2xl font-bold text-ink">Cero Fricción</h3>
            <p className="text-ink/70 leading-relaxed">
              Dashboard de gestión simplificado. Recibe notificaciones, gestiona reservas y controla
              tu disponibilidad desde tu celular.
            </p>
          </div>
        </div>

        <div className="bg-ink text-white rounded-[40px] p-10 md:p-16 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-hero-glow opacity-30 pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-bold relative z-10">
            ¿Listo para modernizar tu operación?
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto relative z-10">
            Deja tus datos y uno de nuestros arquitectos comerciales de Kraken Digital Labs se
            pondrá en contacto contigo para estructurar tu ingreso a la plataforma.
          </p>
          <div className="relative z-10">
            <a
              href="mailto:comercial@portalnecocli.com"
              className="inline-flex items-center justify-center bg-gold text-white font-bold py-4 px-10 rounded-full hover:scale-105 transition-transform"
            >
              Contactar al equipo comercial
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
