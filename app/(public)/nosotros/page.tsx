import { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Quiénes Somos | Portal Necoclí",
  description:
    "Conoce el equipo detrás de Portal Necoclí, la plataforma premium que está revolucionando el turismo en Necoclí.",
};

export default function NosotrosPage() {
  return (
    <div className="pb-24 pt-16 md:pt-24">
      <Container className="max-w-4xl space-y-12">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-ink">Quiénes Somos</h1>
          <p className="text-xl text-ink/70 max-w-2xl mx-auto">
            Impulsando el desarrollo digital, el turismo consciente y la economía local en la perla
            de Necoclí.
          </p>
        </div>

        <div className="prose prose-lg prose-ink mx-auto text-ink/80 text-justify">
          <p>
            <strong>Portal Necoclí 2.0</strong> nace bajo la visión de <em>Kraken Digital Labs</em>{" "}
            como una plataforma tecnológica de alto nivel destinada a conectar a turistas de todo el
            mundo con la riqueza natural, cultural y gastronómica de Necoclí, Antioquia.
          </p>
          <p>
            Nuestro propósito es transformar la forma en la que se descubre y se consume el destino.
            No somos simplemente un directorio; somos un puente transaccional seguro operando bajo
            un modelo de fideicomiso tecnológico (Escrow) que garantiza la confianza tanto para el
            viajero como para el operador local.
          </p>
          <h2 className="text-2xl font-bold text-ink mt-10 mb-4 text-left">Nuestra Misión</h2>
          <p>
            Digitalizar la oferta de servicios en Necoclí con estándares de clase mundial,
            permitiendo a los comerciantes locales competir en el ecosistema global de reservas,
            mientras proporcionamos al usuario una experiencia de usuario (UX) impecable,
            transparente y altamente resolutiva.
          </p>
          <h2 className="text-2xl font-bold text-ink mt-10 mb-4 text-left">Nuestra Visión</h2>
          <p>
            Convertir a Necoclí en el epicentro del turismo inteligente en el caribe colombiano para
            el año 2027, siendo la principal herramienta tecnológica que soporta la economía de la
            región a través de la formalización y la innovación constante.
          </p>
        </div>
      </Container>
    </div>
  );
}
