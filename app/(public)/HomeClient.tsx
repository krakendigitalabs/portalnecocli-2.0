"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CategoryCard3D } from "@/components/marketplace/category-card-3d";
import { LogoMarquee } from "@/components/marketplace/logo-marquee";
import { LuxuryHero } from "@/components/marketplace/luxury-hero";
import { PhotoGallery } from "@/components/marketplace/photo-gallery";
import { WelcomeModal } from "@/components/marketplace/welcome-modal";
import { Container } from "@/components/ui/container";
import { businessCategories } from "@/data/categories";
import { Star, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";

// --- INTERFACES ---

interface CommercialCardProps {
  image: string;
  label: string;
  title: string;
  description: string;
  colorClass: string;
}

interface StarOfferCardProps {
  gallery: string[];
  tag: string;
  title: string;
  description: string;
  price: string;
  buttonText: string;
  href: string;
}

// --- COMPONENTES AUXILIARES ---

const CommercialCard = ({ image, label, title, description, colorClass }: CommercialCardProps) => (
  <div className="group relative rounded-[32px] overflow-hidden h-[400px] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
    <Image
      src={image}
      alt={title}
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-110"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-8">
      <span className={`inline-block ${colorClass} text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full mb-3`}>
        {label}
      </span>
      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 font-tropical">{title}</h3>
      <p className="text-sm text-white/80 leading-relaxed">{description}</p>
    </div>
  </div>
);

const StarOfferCard = ({ gallery, tag, title, description, price, buttonText, href }: StarOfferCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white rounded-[36px] overflow-hidden shadow-xl border border-gray-100 flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-300">
      {/* Carrusel de Imágenes Ampliado */}
      <div className="relative w-full md:w-1/2 h-80 md:h-[380px] bg-slate-100 overflow-hidden">
        <Image
          src={gallery[currentIndex]}
          alt={`${title} - Imagen ${currentIndex + 1}`}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Botones de navegación del carrusel */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Imagen anterior"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-ink p-2.5 rounded-full shadow-md backdrop-blur-sm transition-all hover:scale-110 z-10"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Siguiente imagen"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-ink p-2.5 rounded-full shadow-md backdrop-blur-sm transition-all hover:scale-110 z-10"
        >
          <ChevronRight size={20} />
        </button>

        {/* Indicadores (Dots) con accesibilidad mejorada */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {gallery.map((_, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Ir a la imagen ${idx + 1} de ${title}`}
              className={`h-2.5 rounded-full transition-all ${currentIndex === idx ? "w-7 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
                }`}
            />
          ))}
        </div>
      </div>

      {/* Contenido textual */}
      <div className="p-8 md:p-10 md:w-1/2 flex flex-col justify-between">
        <div>
          <span className="text-teal font-bold text-xs uppercase tracking-widest">{tag}</span>
          <h3 className="text-2xl md:text-3xl font-bold text-ink mt-2 mb-3 font-tropical leading-snug">{title}</h3>
          <p className="text-ink/70 text-base leading-relaxed mb-6">{description}</p>
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-ink/40 uppercase font-bold tracking-wider">Desde</p>
            <p className="text-3xl md:text-4xl font-extrabold text-ink">${price}</p>
          </div>
          <Link
            href={href}
            className="bg-ink text-white px-7 py-3.5 rounded-full font-bold text-base hover:bg-green transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export function HomeClient() {
  const homeCategories = businessCategories.filter((category) => category.slug !== "delivery");

  return (
    <div className="pb-14">
      <LuxuryHero />

      {/* Categorías Principales */}
      <section className="w-full max-w-[2400px] mx-auto px-4 md:px-8 xl:px-12 mt-20 mb-20">
        <div className="mb-10 lg:mb-16 px-2 lg:px-4 flex flex-col items-center text-center">
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-ink mb-6">
            Empresas recomendadas
          </h2>
          <p className="text-xl lg:text-2xl text-ink/70 max-w-3xl">
            Siente la energía de Necoclí. Un toque es suficiente para conectar con las experiencias más exclusivas del mar dulce.
          </p>
        </div>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2 xl:grid-cols-4 w-full">
          {homeCategories.map((category) => (
            <CategoryCard3D category={category} key={category.slug} />
          ))}
        </div>
      </section>

      {/* SECCIÓN DE OFERTAS Y PASADÍAS EN CARRUSEL */}
      <section className="py-24 bg-slate-50">
        <Container className="max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-teal font-bold uppercase tracking-widest text-xs mb-3">
              Días de Sol & Navegación
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-ink">
              Experiencias Destacadas del Día
            </h2>
          </div>

          <div className="grid gap-10">
            <StarOfferCard
              tag="Día de sol · Transporte · Almuerzo · Piscina · Playa privada"
              title="Sabor & Sol Sin Preocupaciones"
              description="Día de sol con transporte, almuerzo, acceso a piscina y playa privada. El descanso que mereces en el paraíso."
              price="150.000"
              buttonText="Reservar →"
              href="/turistas"
              gallery={[
                "https://res.cloudinary.com/dwxk79gt0/image/upload/v1739291734/turismo_necocli_111_hwcnic.jpg",
                "https://res.cloudinary.com/dr50ioh9h/image/upload/v1794196680/Captura_de_pantalla_2026-11-08_224534_p8sa9y.png",
                "https://res.cloudinary.com/dr50ioh9h/image/upload/v1794196179/Captura_de_pantalla_2026-11-08_223907_s1fzvu.png",
              ]}
            />
            <StarOfferCard
              tag="Día de sol · Katamarán 3 islas · Almuerzo y refrigerio"
              title="Navega Necoclí: Yate & Mar"
              description="Disfruta un día de sol navegando en katamarán por 3 islas, con almuerzo y refrigerio incluidos. Una experiencia maravillosa."
              price="210.000"
              buttonText="Reservar día de Yate →"
              href="/reservas-maritimas"
              gallery={[
                "https://res.cloudinary.com/dr50ioh9h/image/upload/v1794196172/Captura_de_pantalla_2026-11-08_224455_rie1tc.png",
                "https://res.cloudinary.com/dr50ioh9h/image/upload/v1794196177/Captura_de_pantalla_2026-11-08_224102_cfwvf8.png",
                "https://res.cloudinary.com/dr50ioh9h/image/upload/v1794196179/Captura_de_pantalla_2026-11-08_223954_fn5d7w.png",
              ]}
            />
          </div>
        </Container>
      </section>

      {/* SECCIÓN DE OPINIONES */}
      <section className="py-24 bg-white">
        <Container className="max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-ink mb-4">Opiniones de la Comunidad</h2>
            <p className="text-ink/60 text-lg max-w-2xl mx-auto">
              Lo que dicen nuestros viajeros. Experiencias reales de personas que ya vivieron la magia del golfo de Urabá.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Juan Pérez",
                role: "Viajero Verificado",
                text: "La organización fue impecable. El transporte marítimo puntual y el guía muy atento. ¡100% recomendado para viajar en familia!",
              },
              {
                name: "María García",
                role: "Viajero Verificado",
                text: "El plan Full es la mejor inversión. No tuvimos que preocuparnos por nada, todo estaba coordinado y disfrutamos sin estrés.",
              },
              {
                name: "Carlos Ruiz",
                role: "Viajero Verificado",
                text: "Necoclí es hermoso y el portal hizo que planear el viaje fuera muy sencillo. La atención y el respaldo brindan total confianza.",
              },
            ].map((review, i) => (
              <div key={i} className="p-8 rounded-[32px] bg-slate-50 border border-gray-100 relative">
                <div className="flex gap-1 text-gold mb-4">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-ink/80 italic mb-6 leading-relaxed">“{review.text}”</p>
                <div>
                  <p className="font-bold text-ink">{review.name}</p>
                  <p className="text-xs text-ink/40 uppercase font-bold">{review.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="https://share.google/WVtNBG4FduB8CVJXX"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink font-bold hover:text-green transition-colors inline-flex items-center justify-center gap-2"
            >
              Ver todas las reseñas en Google →
            </Link>
          </div>
        </Container>
      </section>

      <PhotoGallery />
      <LogoMarquee />

      {/* Sección Comercial Final */}
      <section className="py-20 bg-white">
        <Container className="max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-teal font-bold tracking-[0.2em] uppercase text-xs mb-3">Necoclí · Colombia</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-ink mb-5 leading-tight">
              Necoclí te espera —<br />
              <span className="text-green">¿Cuándo vienes?</span>
            </h2>
            <p className="text-lg md:text-xl text-ink/60 max-w-2xl mx-auto leading-relaxed">
              Un destino que mezcla mar dulce, cultura viva y sabores únicos del Caribe colombiano.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <CommercialCard
              label="Playas de Necocli"
              title="Aventura en Necoclí"
              description="Playas doradas, el encanto del mar dulce y momentos inolvidables en familia."
              image="https://res.cloudinary.com/dwxk79gt0/image/upload/v1739291734/turismo_necocli_111_hwcnic.jpg"
              colorClass="bg-teal/90 text-white"
            />
            <CommercialCard
              label="Islas Hermosas"
              title="Historia Viva"
              description="Sapzurro, Capurganá, La Miel, Playa Soledad y Bahía Aguacate: rincones vírgenes donde el tiempo se detiene."
              image="https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003485/turismo_necocli_35_c81lmu.jpg"
              colorClass="bg-gold/90 text-ink"
            />
            <CommercialCard
              label="Gastronomía"
              title="Sabores del Caribe"
              description="Sabor a mar en minutos: disfruta de langosta fresca, pargo frito, pulpo y cazuelas artesanales."
              image="https://res.cloudinary.com/dwxk79gt0/image/upload/v1754277470/plato_4_akdkbk.jpg"
              colorClass="bg-coral/90 text-white"
            />
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/turistas"
              className="inline-flex items-center gap-3 bg-green text-white font-bold text-base px-8 py-4 rounded-full shadow-lg shadow-green/25 hover:bg-green/90 transition-all hover:-translate-y-1 active:scale-95"
            >
              🌊 Programa tu viaje a Necoclí
              <span className="text-lg">→</span>
            </Link>
            <p className="mt-4 text-sm text-ink/40">
              Paquetes Alojamiento desde <span className="font-bold text-ink/70">$70.000 COP</span> · Reserva en minutos
            </p>
          </div>

          {/* TÉRMINOS Y CONDICIONES DEL SERVICIO DE ALOJAMIENTO */}
          <div className="max-w-4xl mx-auto mt-20 pt-10 border-t border-slate-200">
            <details className="group">
              <summary className="text-lg md:text-xl font-bold text-slate-900 cursor-pointer flex items-center justify-between list-none [&::-webkit-details-marker]:hidden bg-slate-50 border border-slate-200 hover:border-teal p-5 rounded-2xl shadow-sm transition-all">
                <span className="flex items-center gap-3">
                  <ShieldCheck className="text-teal shrink-0" size={24} />
                  <span>Términos y Condiciones del Servicio de Alojamiento</span>
                </span>
                <span className="text-sm font-bold text-teal flex items-center gap-1 shrink-0 ml-2">
                  <span className="group-open:hidden">Leer contrato</span>
                  <span className="hidden group-open:inline">Ocultar</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>

              <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 text-slate-700 text-sm md:text-base space-y-5 leading-relaxed shadow-sm">
                <p>
                  <strong className="text-slate-900">1. Naturaleza del Servicio:</strong> Portal Necoclí actúa exclusivamente como corredor tecnológico y canal de enrutamiento para los establecimientos de alojamiento y hospedaje aliados (ej. Hotel Ibiza). La responsabilidad directa sobre la prestación del servicio de hospedaje, infraestructura, comodidades, seguridad y cumplimiento normativo recae enteramente sobre el operador u hotel prestador del servicio.
                </p>

                <p>
                  <strong className="text-slate-900">2. Validez de la Pre-reserva:</strong> El registro generado a través de Portal Necoclí garantiza la pre-reserva de su habitación o espacio de alojamiento. Para hacer efectiva la estancia y confirmar la reserva, el huésped deberá cumplir con las directrices de pago y presentarse en la recepción del establecimiento aliado en la fecha acordada y dentro de los horarios establecidos para el <em>check-in</em>.
                </p>

                <p>
                  <strong className="text-slate-900">3. Tarifas y Políticas de Menores:</strong> Las tarifas mostradas son establecidas por el establecimiento operador. Las políticas específicas de cobro, admisión y alojamiento para menores de edad se rigen según la reglamentación particular de cada hotel o espacio de hospedaje aliado.
                </p>

                <div>
                  <p className="font-bold text-slate-900 mb-2">4. Cambios, Cancelaciones y Devoluciones:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong className="text-slate-900">Cancelación por parte del cliente:</strong> En caso de que el cliente decida cancelar su reserva después de haber efectuado un 50% de abono, <strong>Portal Necoclí extraerá un 10%</strong> del valor administrado para cubrir los gastos administrativos y de gestión de la devolución del dinero.
                    </li>
                    <li>
                      <strong className="text-slate-900">Incumplimiento por parte del operador:</strong> Si el establecimiento operador no puede cumplir con el servicio de alojamiento contratado después de haber recibido el 50% de abono, <strong>tendrá la obligación de devolver la totalidad del dinero (100%) al cliente de manera inmediata</strong>.
                    </li>
                    <li>
                      <strong className="text-slate-900">Incumplimiento de devolución y sanciones:</strong> Si pasados <strong>5 días</strong> el operador no realiza la devolución del dinero correspondiente, se activarán trámites jurídicos formales que implican la imposición de multas, el bloqueo comercial y la suspensión definitiva de la red de confianza de Portal Necoclí.
                    </li>
                    <li>
                      <strong className="text-slate-900">Fuerza Mayor:</strong> Las estancias están sujetas a restricciones operativas o de fuerza mayor del establecimiento. Ante cierres temporales justificados, se priorizará la reprogramación de fechas o las directrices de devolución acordadas.
                    </li>
                  </ul>
                </div>

                <p>
                  <strong className="text-slate-900">5. Tratamiento de Datos:</strong> Al generar esta pre-reserva, el usuario acepta compartir sus datos de contacto e identificación de manera segura con Portal Necoclí y el establecimiento de alojamiento final, exclusivamente para los fines logísticos, de registro y coordinación de la estancia, conforme a la Ley 1581 de 2012 (Habeas Data).
                </p>
              </div>
            </details>
          </div>
        </Container>
      </section>

      <WelcomeModal />
    </div>
  );
}