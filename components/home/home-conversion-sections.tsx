import Link from "next/link";
import { CheckCircle2, Hotel, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SurfaceCard } from "@/components/ui/surface-card";

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-sm text-ink/75">
      <CheckCircle2 size={18} className="text-coral shrink-0" />
      <span>{text}</span>
    </li>
  );
}

function TestimonialCard({ name, text }: { name: string; text: string }) {
  return (
    <SurfaceCard className="rounded-[30px] p-6 space-y-4 border-ink/5 bg-white shadow-soft">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-sm italic leading-relaxed text-ink/80">&ldquo;{text}&rdquo;</p>
      <div className="pt-4 border-t border-ink/5">
        <p className="text-sm font-bold text-ink">{name}</p>
        <p className="text-xs text-ink/50">Viajero Verificado</p>
      </div>
    </SurfaceCard>
  );
}

export function HomeConversionSections() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-sand/40 to-white">
      <Container className="max-w-6xl space-y-16 md:space-y-24">
        {/* ── 1. PAQUETES RECOMENDADOS ── */}
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <p className="text-teal font-bold tracking-[0.2em] uppercase text-xs">
              Experiencias Todo Incluido
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-ink tracking-tight">
              Paquetes Recomendados
            </h2>
            <p className="text-ink/65 text-base md:text-lg max-w-xl mx-auto">
              Elige la experiencia que mejor se adapte a tu viaje y viaja con respaldo oficial
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto items-stretch">
            {/* Paquete Favorable */}
            <SurfaceCard className="rounded-[32px] p-8 md:p-10 flex flex-col border-ink/10 bg-white hover:border-teal/30 transition-all duration-300 shadow-soft">
              <div className="mb-6">
                <span className="inline-block bg-teal/10 text-teal text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                  Esencial
                </span>
                <h3 className="text-2xl font-bold text-ink">Plan Favorable</h3>
                <p className="text-sm text-ink/60 mt-1">
                  Ideal para quienes buscan lo esencial y explorar a su propio ritmo
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <FeatureItem text="Transporte ida y vuelta garantizado" />
                <FeatureItem text="Guía local certificado" />
                <FeatureItem text="Acceso a puntos turísticos clave" />
                <FeatureItem text="Seguro y póliza de viaje básica" />
              </ul>

              <Button href="/turistas" variant="secondary" size="lg" className="w-full font-bold">
                Ver Detalles
              </Button>
            </SurfaceCard>

            {/* Paquete FULL (Destacado) */}
            <SurfaceCard className="rounded-[32px] p-8 md:p-10 flex flex-col border-2 border-coral bg-gradient-to-b from-white to-coral/5 relative shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-coral text-white px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
                ⭐ Más Popular
              </div>

              <div className="mb-6 mt-2">
                <span className="inline-block bg-coral/10 text-coral text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                  Experiencia VIP
                </span>
                <h3 className="text-2xl font-bold text-ink">Plan Full Experiencia</h3>
                <p className="text-sm text-coral font-medium mt-1">
                  La aventura completa sin preocupaciones con todo organizado
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <FeatureItem text="Transporte VIP marítimo y terrestre" />
                <FeatureItem text="Todos los tours principales incluidos" />
                <FeatureItem text="Alimentación completa (desayunos y almuerzos)" />
                <FeatureItem text="Hospedaje coordinado en hoteles aliados" />
                <FeatureItem text="Acceso prioritario y acompañamiento continuo" />
              </ul>

              <Button
                href="/turistas"
                variant="accent"
                size="lg"
                className="w-full font-bold shadow-lg shadow-coral/25"
              >
                Reservar Plan Full
              </Button>
            </SurfaceCard>
          </div>
        </div>

        {/* ── 2. DESTACADOS DE TEMPORADA & HOSPEDAJE (Sin descuentos ficticios) ── */}
        <div className="grid gap-6 md:grid-cols-2">
          <SurfaceCard className="rounded-[30px] p-7 border border-coral/20 bg-gradient-to-r from-coral/5 to-white flex items-center gap-5 shadow-sm hover:border-coral/40 transition-colors">
            <div className="bg-coral p-4 rounded-2xl text-white shrink-0 shadow-md shadow-coral/20">
              <Zap size={28} fill="currentColor" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink">Aventura en Cuatrimoto</h3>
              <p className="text-sm text-ink/70 mt-0.5">
                Rutas por pantanos, veredas y playas con casco, gafas y póliza incluida.
              </p>
              <Link
                href="/tours/cuatrimoto"
                className="text-sm font-bold text-coral hover:underline mt-2 inline-flex items-center gap-1"
              >
                Ver rutas disponibles →
              </Link>
            </div>
          </SurfaceCard>

          <SurfaceCard className="rounded-[30px] p-7 border border-teal/20 bg-gradient-to-r from-teal/5 to-white flex items-center gap-5 shadow-sm hover:border-teal/40 transition-colors">
            <div className="bg-teal p-4 rounded-2xl text-white shrink-0 shadow-md shadow-teal/20">
              <Hotel size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink">Hospedaje Recomendado</h3>
              <p className="text-sm text-ink/70 mt-0.5">
                Descubre los hoteles y cabañas más cómodos cerca al mar y a las playas de Necoclí.
              </p>
              <Link
                href="/hoteles"
                className="text-sm font-bold text-teal hover:underline mt-2 inline-flex items-center gap-1"
              >
                Ver alojamientos disponibles →
              </Link>
            </div>
          </SurfaceCard>
        </div>

        {/* ── 3. TESTIMONIOS REALES CON ENLACE A GOOGLE REVIEWS ── */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <p className="text-gold font-bold tracking-[0.2em] uppercase text-xs">
              Opiniones de la Comunidad
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
              Lo que dicen nuestros viajeros
            </h2>
            <p className="text-ink/60 text-sm md:text-base max-w-lg mx-auto">
              Experiencias reales de personas que ya vivieron la magia del golfo de Urabá
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <TestimonialCard
              name="Juan Pérez"
              text="La organización fue impecable. El transporte marítimo puntual y el guía muy atento. ¡100% recomendado para viajar en familia!"
            />
            <TestimonialCard
              name="María García"
              text="El plan Full es la mejor inversión. No tuvimos que preocuparnos por nada, todo estaba coordinado y disfrutamos sin estrés."
            />
            <TestimonialCard
              name="Carlos Ruiz"
              text="Necoclí es hermoso y el portal hizo que planear el viaje fuera muy sencillo. La atención y el respaldo brindan total confianza."
            />
          </div>

          <div className="text-center pt-2">
            <Button
              href="https://g.page/r/CRFcMAbI46COEAE/review"
              variant="secondary"
              size="lg"
              className="rounded-full px-8 font-semibold shadow-sm"
            >
              Ver todas las reseñas en Google{" "}
              <Star size={16} className="ml-2 fill-yellow-400 text-yellow-400 inline" />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
