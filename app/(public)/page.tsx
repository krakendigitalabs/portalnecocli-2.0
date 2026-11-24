import type { Metadata } from "next";
import { HomeClient } from "./HomeClient";

<<<<<<< HEAD
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

const StarOfferCard = ({ gallery, tag, title, description, price, buttonText }: StarOfferCardProps) => {
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
          alt={title}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Botones de navegación del carrusel */}
        <button
          onClick={prevSlide}
          aria-label="Imagen anterior"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-ink p-2.5 rounded-full shadow-md backdrop-blur-sm transition-all hover:scale-110 z-10"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Siguiente imagen"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-ink p-2.5 rounded-full shadow-md backdrop-blur-sm transition-all hover:scale-110 z-10"
        >
          <ChevronRight size={20} />
        </button>

        {/* Indicadores (Dots) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {gallery.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
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
            href="/reservas"
            className="bg-ink text-white px-7 py-3.5 rounded-full font-bold text-base hover:bg-green transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
=======
export const metadata: Metadata = {
  title: "Portal Necoclí | Turismo, Hoteles, Tours y Experiencias en el Mar Dulce",
  description:
    "Descubre lo mejor de Necoclí: reserva hoteles, pasajes marítimos a Capurganá y Triganá, días de sol, gastronomía local y experiencias inolvidables.",
  alternates: {
    canonical: "https://portalnecocli.com",
  },
  openGraph: {
    title: "Portal Necoclí | Turismo, Hoteles y Experiencias",
    description:
      "Planea tu visita a Necoclí: descubre experiencias, alojamiento, gastronomía y servicios locales.",
    url: "https://portalnecocli.com",
    siteName: "Portal Necoclí",
    locale: "es_CO",
    type: "website",
  },
>>>>>>> origin/main
};

export default function PublicHomePage() {
  return <HomeClient />;
}
