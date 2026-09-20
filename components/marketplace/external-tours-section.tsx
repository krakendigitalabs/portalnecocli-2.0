import { MapPin, CheckCircle2, Ticket } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SurfaceCard } from "@/components/ui/surface-card";

const paquetesDestinos = [
  {
    id: 1,
    titulo: "Guatapé Tour",
    precio: "$129.000",
    incluye: ["Transporte ida y regreso", "Desayuno y Almuerzo", "Guía acompañante", "Tarjeta de asistencia médica"],
    recorrido: "Visita al Peñol (Panorámico), La casa al revés (no incluye entrada), Alto del chocho, Piedra del peñol (no incluye ascenso), Visita a la plaza de zócalos, Parque central de Guatapé, Pasaporte para Barco rumbero, Malecón.",
    salidas: "Parque Poblado, Estación Metro Estadio (Recogida en hotel disponible)",
    image: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1789889388/guatape_brq8fb.jpg"
  },
  {
    id: 2,
    titulo: "Tour Hacienda Nápoles + Santorini",
    precio: "Básico: $259.000 | Safari: $299.000",
    incluye: ["Transporte ida y regreso", "Desayuno", "Guía Acompañante", "Tarjeta de asistencia médica", "NO INCLUYE ALMUERZO"],
    recorrido: "Visita a la plaza Santorini. BÁSICO: Lago de los hipopótamos, Amazon safari, Gran sabana africana, Museo memorial, Kamaria, Mariposario (No incluye piscinas). SAFARI: Incluye básico + Río Salvaje, Cataratas Victoria y Cobras.",
    salidas: "Punto de encuentro",
    image: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1789889804/NAPOLES_wfxc7m.jpg"
  },
  {
    id: 3,
    titulo: "Tour Vuelta Oriente",
    precio: "$145.000",
    incluye: ["Transporte ida y regreso", "Almuerzo", "Guía acompañante", "Tarjeta de asistencia médica"],
    recorrido: "Ingreso al Salto del Tequendamita. Visita al Parque del Retiro, Visita Parque de la Ceja, Visita al Parque de San Antonio de Pereira, Visita al Carmen de Viboral.",
    salidas: "Todos los días",
    image: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1789889413/oriente_aifrab.jpg"
  },
  {
    id: 4,
    titulo: "Chiva Rumbera",
    precio: "$70.000",
    incluye: ["Transporte ida y regreso", "Tarjeta de asistencia médica", "Una degustación (Cerveza, Agua, Gaseosa)"],
    recorrido: "Panorámico: Avenida 70, Puente de la 4 SUR, Parque del Poblado, Milla de Oro, Avenida 33.",
    salidas: "Estación Metro Estadio (7:00 PM), Parque Poblado (7:30 PM)",
    image: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1789890122/CHIVA_ELEJIDA_huazry.jpg"
  }
];

export function ExternalToursSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden" id="tourists">
      <div className="absolute inset-0 bg-ink/5 pointer-events-none" />
      <Container className="relative z-10">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <p className="text-teal font-bold tracking-widest uppercase text-sm mb-3">
            Más Aventuras
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-ink mb-6 font-tropical tracking-wide">
            Descubre Antioquia
          </h2>
          <p className="text-lg lg:text-xl text-ink/70">
            Completa tu viaje con estas experiencias y recorridos imperdibles fuera de Necoclí.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {paquetesDestinos.map((tour) => (
            <SurfaceCard key={tour.id} className="p-0 overflow-hidden flex flex-col lg:flex-row group transition-shadow hover:shadow-2xl hover:shadow-ink/10">
              {/* Image Header (Width and Grandeur) */}
              <div className="w-full lg:w-[55%] h-[320px] lg:h-auto lg:min-h-[450px] relative overflow-hidden shrink-0">
                <img 
                  src={tour.image} 
                  alt={tour.titulo} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent lg:bg-gradient-to-r lg:from-ink/40 lg:via-transparent lg:to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 lg:hidden">
                  <h3 className="text-3xl font-bold text-white leading-tight font-tropical tracking-wide drop-shadow-md">
                    {tour.titulo}
                  </h3>
                </div>
              </div>

              {/* Content Below / Beside */}
              <div className="p-6 sm:p-10 lg:p-12 flex-1 flex flex-col justify-center bg-white relative z-10">
                <div>
                  <h3 className="hidden lg:block text-4xl font-bold text-ink mb-4 font-tropical tracking-wide">
                    {tour.titulo}
                  </h3>
                  
                  <div className="flex items-center text-teal font-extrabold text-xl mb-6 bg-teal/5 inline-flex px-4 py-2 rounded-full border border-teal/10">
                    <Ticket className="w-5 h-5 mr-2" />
                    {tour.precio}
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-wider text-ink/40 font-bold mb-2">Recorrido</p>
                    <p className="text-sm text-ink/70 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                      {tour.recorrido}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-ink/40 font-bold mb-2">Incluye</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {tour.incluye.map((item, idx) => (
                        <li key={idx} className="flex items-start text-xs text-ink/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green mr-1.5 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-ink/10 flex items-center justify-between">
                  {tour.salidas && (
                    <div className="flex items-center text-xs text-ink/60 max-w-[60%]">
                      <MapPin className="w-4 h-4 mr-1.5 shrink-0 text-coral" />
                      <span className="truncate">{tour.salidas}</span>
                    </div>
                  )}
                  <a 
                    href="https://wa.me/573217511866?text=Hola,%20me%20gustaría%20reservar%20el%20tour:%20"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold uppercase tracking-wider text-green hover:text-green/80 transition-colors inline-flex items-center"
                  >
                    Reservar →
                  </a>
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
