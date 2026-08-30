import { Container } from "@/components/ui/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog y Noticias | Portal Necoclí",
  description: "Noticias, guías de viaje y actualidad turística del golfo de Urabá.",
};

export default function BlogPage() {
  return (
    <div className="pb-24 pt-16 md:pt-24 min-h-[70vh]">
      <Container className="max-w-4xl space-y-12">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-ink">
            El Blog del Golfo
          </h1>
          <p className="text-xl text-ink/70 max-w-2xl mx-auto">
            Descubre guías, tips de viaje y noticias exclusivas sobre Necoclí.
          </p>
        </div>

        <div className="bg-sand/20 border border-ink/5 p-12 rounded-[40px] text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 text-gold mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5L18.5 7H20" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-ink">Nuevos artículos en camino</h2>
          <p className="text-ink/60 max-w-lg mx-auto">
            Nuestros blogueros y el equipo editorial están preparando las mejores guías turísticas. Vuelve pronto para descubrir contenido exclusivo.
          </p>
        </div>
      </Container>
    </div>
  );
}
