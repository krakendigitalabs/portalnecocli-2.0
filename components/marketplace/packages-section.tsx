"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { BookingForm } from "@/components/marketplace/booking-form";
import { Container } from "@/components/ui/container";
import { touristPackages as packages } from "@/data/tourist-packages";
import type { TripPrefill } from "@/lib/utils/trip-search-params";

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
          {images.map((image, idx) => (
            <button
              key={image}
              type="button"
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

export function PackagesSection({ prefill }: { prefill?: TripPrefill }) {
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

                    {"details" in pkg && pkg.details && (
                      <ul className="mb-8 space-y-2 text-sm text-ink/70">
                        {pkg.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                    )}

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

                      {"bookingUrl" in pkg && pkg.bookingUrl ? (
                        <a
                          href={pkg.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-6 py-3 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 bg-ink text-white hover:bg-gold hover:text-ink shadow-lg shadow-ink/20 hover:shadow-gold/30 hover:-translate-y-0.5"
                        >
                          Reservar día de yate →
                        </a>
                      ) : (
                        <button
                          type="button"
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
                      )}
                    </div>
                  </div>
                </div>

                {/* ─ Inline Booking Form ─ */}
                <AnimatePresence>
                  {isOpen && !("bookingUrl" in pkg && pkg.bookingUrl) && (
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
                            prefill={prefill}
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

        <aside className="mt-10 rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 text-sm text-ink/70">
          <h3 className="mb-4 text-lg font-bold text-ink">
            Información importante para tu estadía
          </h3>
          <ul className="space-y-2">
            <li>El uso de la piscina requiere gorro y ropa de baño adecuada.</li>
            <li>
              La entrada al hotel es desde las 9:00 a. m.; las habitaciones se entregan a las 3:00
              p. m. y deben dejarse a la 1:00 p. m. del día siguiente.
            </li>
            <li>
              Puedes disfrutar de las instalaciones antes de recibir la habitación y después de
              entregarla.
            </li>
            <li>
              El seguro hotelero para niños de 0 a 4 años cuesta $49.000 e incluye la entrada y la
              asistencia médica.
            </li>
          </ul>
        </aside>
      </Container>
    </section>
  );
}
