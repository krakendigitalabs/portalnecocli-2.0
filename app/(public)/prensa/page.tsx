import { Container } from "@/components/ui/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prensa y Media | Portal Necoclí",
  description: "Recursos de marca, comunicados de prensa e información para medios de Portal Necoclí.",
};

export default function PrensaPage() {
  return (
    <div className="pb-24 pt-16 md:pt-24 min-h-[70vh]">
      <Container className="max-w-4xl space-y-12">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-ink">
            Prensa y Media
          </h1>
          <p className="text-xl text-ink/70 max-w-2xl mx-auto">
            Recursos oficiales y kits de marca para medios de comunicación y aliados.
          </p>
        </div>

        <div className="bg-sand/20 border border-ink/5 p-12 rounded-[40px] text-center space-y-4">
          <h2 className="text-2xl font-bold text-ink">Kit de Marca</h2>
          <p className="text-ink/60 max-w-lg mx-auto mb-6">
            Si representas a un medio de comunicación o eres un aliado estratégico, puedes solicitar nuestros recursos gráficos y comunicados oficiales escribiendo a nuestro correo de relaciones públicas.
          </p>
          <a 
            href="mailto:prensa@portalnecocli.com" 
            className="inline-flex text-green font-bold hover:text-gold transition-colors"
          >
            prensa@portalnecocli.com
          </a>
        </div>
      </Container>
    </div>
  );
}
