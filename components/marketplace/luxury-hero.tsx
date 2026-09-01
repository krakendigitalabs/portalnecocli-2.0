"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronDown, MapPin, Search, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function LuxuryHero() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchData, setSearchData] = useState({
    destination: "",
    date: "",
    guests: "2",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // En el futuro, esto puede navegar a una página de resultados con parámetros en la URL
    // Por ahora, scrollea a la sección principal del marketplace
    const marketplaceSection = document.getElementById("marketplace-categories");
    if (marketplaceSection) {
      marketplaceSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80"
          alt="Necoclí Playa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/30 to-ink/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center mt-16">
        {/* Animated Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-4 drop-shadow-lg">
            Descubre el Paraíso Oculto
          </h1>
          <p className="text-lg md:text-2xl text-sand/90 font-light max-w-2xl mx-auto drop-shadow-md">
            Mar dulce, playas vírgenes y cultura vibrante. Reserva hoteles, experiencias y
            transporte en Necoclí con seguridad garantizada.
          </p>
        </motion.div>

        {/* Floating Glassmorphism Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          onClick={() => !isExpanded && setIsExpanded(true)}
          className={`w-full max-w-4xl bg-white/10 backdrop-blur-md border border-white/20 p-2 md:p-3 rounded-3xl md:rounded-full shadow-glass transition-all duration-300 ${isExpanded ? "ring-2 ring-gold/50" : ""}`}
        >
          <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl md:rounded-full p-2 gap-2 shadow-inner w-full">
            {/* Destino */}
            <div className="flex-1 flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-full cursor-pointer transition-colors w-full relative group">
              <MapPin className="text-gold w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col text-left w-full">
                <span className="text-[10px] md:text-xs font-bold text-ink uppercase tracking-wider">
                  Destino
                </span>
                {isExpanded ? (
                  <select
                    className="w-full bg-transparent text-sm outline-none text-ink cursor-pointer font-medium appearance-none"
                    value={searchData.destination}
                    onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                  >
                    <option value="">¿A dónde vas?</option>
                    <option value="hoteles">Hoteles & Hospedajes</option>
                    <option value="tours">Tours & Experiencias</option>
                    <option value="restaurantes">Restaurantes</option>
                  </select>
                ) : (
                  <span className="text-sm text-gray-500 truncate">Hospedajes, tours...</span>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-10 bg-gray-200" />

            {/* Fechas */}
            <div className="flex-1 flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-full cursor-pointer transition-colors w-full relative group">
              <Calendar className="text-green w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col text-left w-full">
                <span className="text-[10px] md:text-xs font-bold text-ink uppercase tracking-wider">
                  Fechas
                </span>
                {isExpanded ? (
                  <input
                    type="date"
                    className="w-full bg-transparent text-sm outline-none text-ink font-medium"
                    value={searchData.date}
                    onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                  />
                ) : (
                  <span className="text-sm text-gray-500 truncate">Agregar fechas</span>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-10 bg-gray-200" />

            {/* Huéspedes & Search Button */}
            <div className="flex-1 flex items-center justify-between gap-3 pl-4 pr-1 py-1 hover:bg-gray-50 rounded-full cursor-pointer transition-colors w-full group">
              <div className="flex items-center gap-3 w-full">
                <Users className="text-green w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col text-left w-full">
                  <span className="text-[10px] md:text-xs font-bold text-ink uppercase tracking-wider">
                    Huéspedes
                  </span>
                  {isExpanded ? (
                    <input
                      type="number"
                      min="1"
                      max="20"
                      className="w-full bg-transparent text-sm outline-none text-ink font-medium"
                      value={searchData.guests}
                      onChange={(e) => setSearchData({ ...searchData, guests: e.target.value })}
                    />
                  ) : (
                    <span className="text-sm text-gray-500 truncate">¿Cuántos?</span>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="h-12 w-12 p-0 flex items-center justify-center rounded-full bg-gold hover:bg-gold/90 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 flex-shrink-0 z-20 relative"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.form>
      </div>

      {/* Decorative Bottom Curve/Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  );
}
