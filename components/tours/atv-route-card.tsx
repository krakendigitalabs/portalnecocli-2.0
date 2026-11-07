"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { AtvRouteDetail } from "@/types/atv-booking";
import { AtvBookingForm } from "@/components/tours/atv-booking-form";
import type { TripPrefill } from "@/lib/utils/trip-search-params";

interface AtvRouteCardProps {
  route: AtvRouteDetail;
  prefill?: TripPrefill;
}

export function AtvRouteCard({ route, prefill }: AtvRouteCardProps) {
  const [showModal, setShowModal] = useState(false);

  const badgeColors: Record<string, string> = {
    ruta1: "bg-emerald-500",
    ruta2: "bg-blue-500",
    ruta3: "bg-purple-500",
    ruta4: "bg-red-500",
  };

  const badgeColor = badgeColors[route.id] ?? "bg-amber-500";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: route.number * 0.1 }}
        className="group bg-white rounded-[28px] border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col"
      >
        {/* Route number badge */}
        <div className="relative h-36 bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-4 text-[120px] font-black text-amber-400 select-none leading-none">
              {route.number}
            </div>
          </div>
          <div className="relative flex items-center gap-4">
            <span
              className={`${badgeColor} text-white font-black text-3xl w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg`}
            >
              {route.number}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-1">
                {route.duration}
              </p>
              {route.includesLunch && (
                <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  🍽️ Incluye almuerzo
                </span>
              )}
              {route.isExtremeRoute && (
                <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ⚡ Ruta extrema
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-amber-700 transition-colors">
            {route.title}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">
            {route.description}
          </p>

          {/* Price */}
          <div className="border-t border-slate-100 pt-4 mb-5">
            {route.isExtremeRoute ? (
              <p className="text-sm font-bold text-red-600">
                ⚡ Precio según experiencia — consulta con el operador
              </p>
            ) : (
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Valor ruta (2 personas)</p>
                  <p className="text-2xl font-black text-amber-700">
                    ${route.priceForTwo.toLocaleString("es-CO")}
                    <span className="text-sm font-normal text-slate-400 ml-1">COP</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Anticipo (50%)</p>
                  <p className="text-base font-bold text-green-600">
                    ${(route.priceForTwo / 2).toLocaleString("es-CO")} COP
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-2xl transition-all hover:-translate-y-0.5 shadow-md shadow-amber-100 text-sm"
          >
            Reservar esta ruta 🏍️
          </button>
        </div>
      </motion.div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-slate-900/60 z-[300] backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-x-4 top-4 bottom-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-[301] bg-white rounded-[28px] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                <div>
                  <h2 className="font-bold text-slate-800 text-base">
                    Reservar Ruta {route.number}
                  </h2>
                  <p className="text-xs text-slate-400">{route.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Modal body — scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                <AtvBookingForm route={route} prefill={prefill} onClose={() => setShowModal(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
