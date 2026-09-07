"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { BookingForm } from "@/components/marketplace/booking-form";
import { Container } from "@/components/ui/container";

const packages = [
  {
    id: "sol-playa-express",
    title: "Sol y Playa Express",
    description:
      "Viaje en ferry hacia playas de ensueño. Incluye transporte urbano y un almuerzo típico costeño.",
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1737932109/Playa_necocli_6_usilb7.jpg",
    options: [
      { id: "spe_basico", label: "Paquete Base (Ferry + Almuerzo + Transporte)", price: 230000 },
      { id: "spe_premium", label: "Paquete Premium (Ferry + 3 Comidas)", price: 247000 },
    ],
  },
  {
    id: "savage-weekend",
    title: "Savage Weekend",
    description:
      "2 noches de alojamiento con aire acondicionado, desayunos, cenas y transporte incluido. Pura aventura.",
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1744003434/turismo_necocli_57_gqvstk.jpg",
    options: [
      { id: "sw_2noches", label: "2 Noches de Aventura", price: 218000 },
      { id: "sw_1noche", label: "1 Noche Express", price: 109000 },
    ],
  },
  {
    id: "full-necocli-vip",
    title: "Full Necoclí VIP",
    description:
      "La experiencia definitiva. Hotel AC, 3 comidas, Día de Sol en Ferry y transporte a las afueras.",
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1744003480/turismo_30_dzr8jh.jpg",
    options: [
      { id: "fnv_vip", label: "Todo Incluido VIP", price: 339000 },
    ],
  },
  {
    id: "naturaleza-relax",
    title: "Naturaleza y Relax",
    description:
      "Alojamiento básico ideal para exploradores, con almuerzo y transporte a los alrededores de Necoclí.",
    image:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/q_auto/f_auto/v1739291954/turismo_necocli_motonecos_1_mmblod.jpg",
    options: [
      { id: "nr_basico", label: "Explorador (Hotel Básico + Almuerzo)", price: 74000 },
      { id: "nr_ac", label: "Explorador (Hotel AC + Almuerzo)", price: 104000 },
    ],
  },
];

export function PackagesSection() {
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  const selectedPackage = packages.find((p) => p.id === selectedPackageId);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackageId(pkg.id)}
              className={`group relative h-[450px] w-full rounded-[32px] overflow-hidden block shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-ink text-left ${selectedPackageId === pkg.id ? "ring-4 ring-teal scale-[1.02]" : ""}`}
            >
              <div className="absolute inset-0 bg-ink/30 z-10 group-hover:bg-ink/10 transition-colors duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent z-10" />

              <img
                src={pkg.image}
                alt={pkg.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
              />

              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <h3 className="text-3xl font-bold text-white mb-3 font-tropical tracking-wide">
                  {pkg.title}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed mb-6 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                  {pkg.description}
                </p>
                <div className="inline-flex items-center text-gold font-bold text-sm tracking-widest uppercase group-hover:text-white transition-colors">
                  Reservar Ahora{" "}
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {selectedPackage && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className="mt-12 w-full max-w-4xl mx-auto overflow-hidden"
            >
              <div className="bg-white rounded-[40px] shadow-2xl border border-ink/5 relative p-2">
                <button
                  onClick={() => setSelectedPackageId(null)}
                  className="absolute top-6 right-6 z-50 p-2 bg-ink/5 hover:bg-coral hover:text-white rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <BookingForm
                  businessId="portal_necocli_internal"
                  baseServiceName={`Paquete Turístico: ${selectedPackage.title}`}
                  routingType="CASE_A"
                  packageOptions={selectedPackage.options}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}
