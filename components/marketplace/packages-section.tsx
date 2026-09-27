"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useState } from "react";
import { BookingForm } from "@/components/marketplace/booking-form";
import { Container } from "@/components/ui/container";

const packages = [
  {
    id: "alojamiento-basico",
    title: "Alojamiento Básico",
    description:
      "Opción económica y cómoda para hospedaje. Incluye acceso a piscina frente al mar, parqueadero, opción de alimentación a la habitación, WiFi y zonas de descanso. Ideal para el viajero práctico que busca relajarse en Necoclí.",
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1739291954/turismo_necocli_motonecos_1_mmblod.jpg",
    highlight: "Económico · Piscina frente al mar",
    options: [
      { id: "basico_multiple", label: "Acomodación Múltiple", price: 45000 },
      { id: "basico_ventilador", label: "Solo Alojamiento - Ventilador", price: 50000 },
      { id: "basico_aire", label: "Solo Alojamiento - Aire Acondicionado", price: 60000 },
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
      "Ideal para parejas que buscan una escapada de fin de semana. Alojamiento con alimento, transporte en motocarro hacia el sitio con piscina y acceso al mar, y regreso al hotel incluido. Disponible sábados y domingos.",
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1744003434/turismo_necocli_57_gqvstk.jpg",
    highlight: "Sáb & Dom · Pareja · Piscina + Mar",
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
    <section className="py-24 relative bg-sand/30">
      <Container>
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <p className="text-green font-bold tracking-widest uppercase text-sm mb-3">
            Explora por Experiencia
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-ink mb-6">Paquetes Premium</h2>
          <p className="text-lg lg:text-xl text-ink/70">
            Hemos diseñado estas experiencias pensando en tu confort. Escoge tu vibra y deja que
            nosotros nos encarguemos de la magia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => {
            const isOpen = openId === pkg.id;
            return (
              <div key={pkg.id} className="flex flex-col">
                {/* ─ Card ─ */}
                <button
                  onClick={() => setOpenId(isOpen ? null : pkg.id)}
                  className={`group relative h-[420px] w-full rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-ink text-left flex-shrink-0 ${isOpen ? "ring-4 ring-teal rounded-b-none" : ""}`}
                >
                  <div className="absolute inset-0 bg-ink/25 z-10 group-hover:bg-ink/10 transition-colors duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent z-10" />
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 z-20 p-7 flex flex-col justify-end">
                    <span className="mb-3 self-start text-[10px] font-bold uppercase tracking-widest bg-white/15 text-gold/90 border border-gold/30 backdrop-blur-sm px-3 py-1 rounded-full">
                      {pkg.highlight}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2 font-tropical tracking-wide">
                      {pkg.title}
                    </h3>
                    <p className="text-white/75 text-sm leading-relaxed mb-5 line-clamp-2 group-hover:line-clamp-none transition-all">
                      {pkg.description}
                    </p>

                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-white">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 block mb-0.5">
                          Desde
                        </span>
                        <span className="text-lg font-bold">
                          {new Intl.NumberFormat("es-CO", {
                            style: "currency",
                            currency: "COP",
                            maximumFractionDigits: 0,
                          }).format(Math.min(...pkg.options.map((opt) => opt.price)))}
                        </span>
                      </div>

                      <div className="inline-flex items-center text-gold font-bold text-sm tracking-widest uppercase bg-ink/40 px-4 py-2 rounded-full backdrop-blur-sm border border-gold/20 hover:bg-gold hover:text-ink transition-colors">
                        {isOpen ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1.5" />
                            Cerrar
                          </>
                        ) : (
                          <>
                            Reservar
                            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                              →
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* ─ Inline form below card ─ */}
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
                      <div className="bg-white border-2 border-teal border-t-0 rounded-b-[32px] shadow-xl shadow-teal/10">
                        {/* Package mini-header inside form */}
                        <div className="px-6 pt-5 pb-4 border-b border-ink/8 bg-teal/5">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-teal mb-0.5">
                            {pkg.highlight}
                          </p>
                          <p className="text-sm font-bold text-ink">{pkg.title}</p>
                        </div>
                        <BookingForm
                          businessId="portal_necocli_internal"
                          baseServiceName={`Paquete: ${pkg.title}`}
                          routingType="CASE_A"
                          packageOptions={pkg.options}
                        />
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
