"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { BookingForm } from "@/components/marketplace/booking-form";
import { Container } from "@/components/ui/container";

function PackageImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 w-full h-full group">
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${title} - imagen ${currentIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent lg:hidden pointer-events-none" />

      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20 lg:bottom-4">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const packages = [
  {
    id: "alojamiento-basico",
    title: "Alojamiento Básico",
    description:
      "Opción económica y cómoda para hospedaje. Incluye acceso a piscina frente al mar, parqueadero, opción de alimentación a la habitación, WiFi y zonas de descanso. Ideal para el viajero práctico que busca relajarse en Necoclí.",
    images: [
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790716675/hab_sencilla_atuadx.jpg",
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790716687/triple33_ymv8ww.jpg",
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790716721/PERFIL_109_qlweuj.jpg",
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790716754/9_habitacion_1_cama_213_sdhfdo.jpg",
    ],
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1739291954/turismo_necocli_motonecos_1_mmblod.jpg",
    highlight: "Económico · Piscina frente al mar",
    options: [
      { id: "basico_ventilador", label: "Alojamiento - Ventilador", price: 70000 },
      { id: "basico_aire", label: "Alojamiento - Aire Acondicionado", price: 70000 },
      { id: "piscina_persona", label: "Alojamiento + Piscina (Por persona)", price: 90000 },
      { id: "piscina_pareja", label: "Alojamiento + Piscina (Plan Pareja)", price: 175000 },
      { id: "mar_persona", label: "Vista al Mar (Por persona)", price: 90000 },
      { id: "mar_pareja", label: "Vista al Mar (Plan Pareja)", price: 175000 },
    ],
  },
  {
    id: "sol-playa-express",
    title: "Sol y Playa Express",
    description:
      "Una escapada completa de 2 noches. Llegás la noche anterior, disfrutás un día de sol en yate con almuerzo incluido, y regresás cómodamente con alojamiento y desayuno. Todo organizado para que solo pienses en disfrutar.",
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1737932109/Playa_necocli_6_usilb7.jpg",
    highlight: "2 noches · Yate · Comidas incluidas",
    options: [
      { id: "spe_completo", label: "Paquete Completo (2 noches + Yate + Comidas)", price: 375000 },
    ],
  },
  {
    id: "noche-express",
    title: "Noche Express",
    description:
      "Ideal para parejas que buscan una escapada de fin de semana. Alojamiento con alimento, transporte en motocarro hacia el sitio con piscina y a una cuadra del mar, y regreso al hotel incluido. Disponible sábados y domingos.",
    images: [
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790714003/18_doeyfe.jpg",
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790714007/12_yvzosx.jpg",
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790714004/13_gwyils.jpg",
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1777075437/5_rgphce.jpg",
    ],
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1744003434/turismo_necocli_57_gqvstk.jpg",
    highlight: "Sáb & Dom · Pareja · Piscina + A una cuadra del mar",
    options: [{ id: "nx_pareja", label: "Noche Express — Pareja (Sáb o Dom)", price: 250000 }],
  },
  {
    id: "fin-de-semana",
    title: "Fin de Semana Completo",
    description:
      "Sábado y domingo de experiencias. Hotel frente al mar con alimento y piscina, tour local el primer día. El domingo, motocarro al amanecer hacia el sitio con piscina y mar, con transporte de regreso al hotel.",
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1744003480/turismo_30_dzr8jh.jpg",
    highlight: "2 días · Hotel frente al mar · Tour local",
    options: [{ id: "fds_completo", label: "Fin de Semana Completo (Sáb + Dom)", price: 500000 }],
  },
  {
    id: "full-necocli-vip",
    title: "Full Necoclí VIP",
    description:
      "La experiencia definitiva en dos días. Día 1: hotel con piscina, desayuno, almuerzo, turismo local y cena frente al mar. Día 2: tour en la naturaleza, día de sol, almuerzo, acceso a piscina y al mar, cena y regreso al hotel.",
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1739243210/IMG_20241217_173322_xfanmb.jpg",
    highlight: "2 días · Todo incluido · Piscina + Mar",
    options: [{ id: "vip_full", label: "Full VIP — Todo Incluido (2 días)", price: 620000 }],
  },
  {
    id: "en-naturaleza",
    title: "En Naturaleza",
    description:
      "Para el viajero independiente. Alojamiento cómodo en entorno natural, con la libertad de elegir cuántas comidas incluir: desayuno, almuerzo o cena. Arma tu plan perfecto.",
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1739291954/turismo_necocli_motonecos_1_mmblod.jpg",
    highlight: "Flexible · 1 noche · Elige tus comidas",
    options: [
      { id: "nat_solo", label: "Solo Alojamiento con Aire (1 noche)", price: 65000 },
      { id: "nat_1c", label: "Alojamiento con Aire + 1 Comida", price: 82000 },
      { id: "nat_2c", label: "Alojamiento con Aire + 2 Comidas", price: 99000 },
      { id: "nat_3c", label: "Alojamiento con Aire + 3 Comidas", price: 116000 },
    ],
  },
  {
    id: "alojamiento-multiple",
    title: "Alojamiento Múltiple",
    description:
      "Perfecto para grupos, familias o mochileros. Precio especial por noche en alojamiento compartido, con la opción de añadir las comidas que necesites a lo largo del día.",
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1744003485/turismo_necocli_35_c81lmu.jpg",
    highlight: "Grupal · Precio especial · Comidas opcionales",
    options: [
      { id: "mul_solo", label: "Solo Alojamiento Múltiple (1 noche)", price: 50000 },
      { id: "mul_1c", label: "Alojamiento Múltiple + 1 Comida", price: 67000 },
      { id: "mul_2c", label: "Alojamiento Múltiple + 2 Comidas", price: 84000 },
      { id: "mul_3c", label: "Alojamiento Múltiple + Desayuno, Almuerzo y Cena", price: 101000 },
    ],
  },
];

export function PackagesSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="py-24 relative bg-sand/30 overflow-hidden" id="packages">
      <div className="absolute inset-0 bg-ink/5 pointer-events-none" />
      <Container className="relative z-10">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <p className="text-gold font-bold tracking-widest uppercase text-sm mb-3">
            Explora por Experiencia
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-ink mb-6 font-tropical tracking-wide">
            Paquetes Premium
          </h2>
          <p className="text-lg lg:text-xl text-ink/70">
            Hemos diseñado estas experiencias pensando en tu confort. Escoge tu vibra y deja que
            nosotros nos encarguemos de la magia.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 relative z-10">
          {packages.map((pkg) => {
            const isOpen = openId === pkg.id;
            const minPrice = Math.min(...pkg.options.map((opt) => opt.price));

            return (
              <div key={pkg.id}>
                {/* ─ Premium Horizontal Card ─ */}
                <div
                  className={`bg-white overflow-hidden flex flex-col lg:flex-row group transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-ink/10 border border-ink/5 ${
                    isOpen ? "rounded-t-[32px] rounded-b-none border-b-0" : "rounded-[32px]"
                  }`}
                >
                  {/* Image Section */}
                  <div className="w-full lg:w-[45%] h-[320px] lg:h-auto lg:min-h-[400px] relative overflow-hidden shrink-0">
                    {pkg.images ? (
                      <PackageImageCarousel images={pkg.images} title={pkg.title} />
                    ) : (
                      <>
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent lg:hidden pointer-events-none" />
                      </>
                    )}

                    <div className="absolute bottom-6 left-6 right-6 lg:hidden pointer-events-none z-30">
                      <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-widest bg-white/20 text-white border border-white/30 backdrop-blur-sm px-3 py-1 rounded-full">
                        {pkg.highlight}
                      </span>
                      <h3 className="text-3xl font-bold text-white leading-tight font-tropical tracking-wide drop-shadow-md">
                        {pkg.title}
                      </h3>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 sm:p-10 lg:p-12 flex-1 flex flex-col justify-center bg-white relative z-10">
                    <div className="hidden lg:block mb-4">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-sand/50 text-gold border border-gold/20 px-3 py-1 rounded-full mb-3">
                        {pkg.highlight}
                      </span>
                      <h3 className="text-4xl font-bold text-ink font-tropical tracking-wide">
                        {pkg.title}
                      </h3>
                    </div>

                    <p className="text-sm sm:text-base text-ink/70 leading-relaxed mb-8">
                      {pkg.description}
                    </p>

                    <div className="mt-auto flex flex-col sm:flex-row sm:items-end justify-between pt-6 border-t border-ink/10 gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mb-1">
                          Desde
                        </p>
                        <p className="text-2xl font-black text-ink">
                          {new Intl.NumberFormat("es-CO", {
                            style: "currency",
                            currency: "COP",
                            maximumFractionDigits: 0,
                          }).format(minPrice)}
                        </p>
                      </div>

                      <button
                        onClick={() => setOpenId(isOpen ? null : pkg.id)}
                        className={`inline-flex items-center justify-center px-6 py-3 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 ${
                          isOpen
                            ? "bg-ink/5 text-ink hover:bg-ink/10"
                            : "bg-ink text-white hover:bg-gold hover:text-ink shadow-lg shadow-ink/20 hover:shadow-gold/30 hover:-translate-y-0.5"
                        }`}
                      >
                        {isOpen ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-2" /> Cerrar
                          </>
                        ) : (
                          <>Reservar →</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* ─ Inline Booking Form ─ */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white border-2 border-t-0 border-ink/5 rounded-b-[32px] shadow-2xl shadow-ink/10">
                        <div className="px-8 pt-6 pb-5 border-b border-ink/8 bg-sand/10">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gold mb-1">
                            {pkg.highlight}
                          </p>
                          <p className="text-lg font-bold text-ink">Configura tu reserva</p>
                        </div>
                        <div className="p-2 sm:p-4">
                          <BookingForm
                            businessId="portal_necocli_internal"
                            baseServiceName={`Paquete: ${pkg.title}`}
                            routingType="CASE_A"
                            packageOptions={pkg.options}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
