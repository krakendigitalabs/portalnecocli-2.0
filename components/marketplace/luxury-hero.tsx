"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Search, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { HeroVideoPlaylist } from "@/components/marketplace/hero-video-playlist";

const DESTINATION_MAP: Record<string, string> = {
  hoteles: "/hoteles",
  tours: "/tours",
  restaurantes: "/restaurantes",
  transporte: "/transporte",
};

export function LuxuryHero() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    destination: "",
    date: "",
    guests: "",
  });
  const [focused, setFocused] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const target = searchData.destination
      ? (DESTINATION_MAP[searchData.destination] ?? "/hoteles")
      : "/hoteles";
    router.push(target);
  };

  return (
    <section className="relative w-full h-[100svh] overflow-hidden bg-black flex flex-col items-center justify-between py-12 md:py-16">
      {/* ─── Video Background ─── */}
      <HeroVideoPlaylist />

      {/* ─── Gradient overlays — subtle, only corners & bottom ─── */}
      <div
        className="absolute inset-0 bg-black/40 md:bg-black/20 pointer-events-none"
        style={{ zIndex: 1 }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(to bottom, rgba(10,14,20,0.8) 0%, transparent 25%, transparent 75%, rgba(10,14,20,0.8) 100%)",
        }}
      />

      {/* ─── Headline (solo lectores de pantalla/SEO) ─── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="sr-only">
          Vive el Caribe de Urabá: Playas, Islas y Aventura sin intermediarios
        </h1>
      </div>

      {/* ─── Search bar — anchored to bottom ─── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.45 }}
        className="relative z-10 w-full px-4 sm:px-6 flex justify-center pb-8 md:pb-4"
      >
        <form ref={formRef} onSubmit={handleSearch} className="w-full max-w-3xl">
          {/* Glass pill wrapper */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white/[0.14] backdrop-blur-xl border border-white/25 rounded-2xl sm:rounded-full shadow-[0_8px_40px_rgba(0,0,0,0.35)] overflow-hidden">
            {/* — Destino — */}
            <div
              className={`flex-1 flex items-center gap-3 px-5 py-4 sm:py-3.5 cursor-pointer transition-colors ${focused === "dest" ? "bg-white/[0.18]" : "hover:bg-white/[0.1]"}`}
              onClick={() => setFocused("dest")}
            >
              <MapPin className="w-5 h-5 text-[#F5C842] shrink-0" />
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 leading-none mb-1">
                  Destino
                </span>
                <select
                  value={searchData.destination}
                  onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                  onFocus={() => setFocused("dest")}
                  onBlur={() => setFocused(null)}
                  className="bg-transparent text-white text-sm font-medium outline-none appearance-none cursor-pointer w-full placeholder:text-white/50"
                  style={{ color: searchData.destination ? "white" : "rgba(255,255,255,0.55)" }}
                >
                  <option value="" className="text-ink">
                    ¿Qué buscas?
                  </option>
                  <option value="hoteles" className="text-ink">
                    🏨 Hoteles &amp; Hospedajes
                  </option>
                  <option value="tours" className="text-ink">
                    🌊 Tours &amp; Experiencias
                  </option>
                  <option value="restaurantes" className="text-ink">
                    🍽️ Restaurantes
                  </option>
                  <option value="transporte" className="text-ink">
                    🚐 Transporte
                  </option>
                </select>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-10 bg-white/20 self-center" />

            {/* — Fecha — */}
            <div
              className={`flex-1 flex items-center gap-3 px-5 py-4 sm:py-3.5 cursor-pointer transition-colors ${focused === "date" ? "bg-white/[0.18]" : "hover:bg-white/[0.1]"}`}
              onClick={() => setFocused("date")}
            >
              <Calendar className="w-5 h-5 text-[#4ECDC4] shrink-0" />
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 leading-none mb-1">
                  Fecha
                </span>
                <input
                  type="date"
                  value={searchData.date}
                  onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                  onFocus={() => setFocused("date")}
                  onBlur={() => setFocused(null)}
                  className="bg-transparent text-white text-sm font-medium outline-none w-full [color-scheme:dark]"
                  style={{ color: searchData.date ? "white" : "rgba(255,255,255,0.55)" }}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-10 bg-white/20 self-center" />

            {/* — Huéspedes + Botón — */}
            <div
              className={`flex items-center gap-3 px-5 py-4 sm:py-3.5 transition-colors ${focused === "guests" ? "bg-white/[0.18]" : "hover:bg-white/[0.1]"}`}
              onClick={() => setFocused("guests")}
            >
              <Users className="w-5 h-5 text-[#4ECDC4] shrink-0" />
              <div className="flex flex-col text-left min-w-[70px]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 leading-none mb-1">
                  Huéspedes
                </span>
                <input
                  type="number"
                  min={1}
                  max={20}
                  placeholder="¿Cuántos?"
                  value={searchData.guests}
                  onChange={(e) => setSearchData({ ...searchData, guests: e.target.value })}
                  onFocus={() => setFocused("guests")}
                  onBlur={() => setFocused(null)}
                  className="bg-transparent text-white text-sm font-medium outline-none w-full placeholder:text-white/50 [color-scheme:dark]"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-coral px-8 py-4 text-base font-extrabold text-white shadow-xl shadow-coral/40 ring-2 ring-white/70 transition hover:bg-coral/90 active:scale-95"
          >
            <Search className="h-5 w-5" />
            Buscar Experiencias
          </button>
        </form>
      </motion.div>

      {/* ─── Bottom fade to white (page transition) ─── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          zIndex: 5,
          background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.6))",
        }}
      />
    </section>
  );
}
