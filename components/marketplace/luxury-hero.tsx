"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Search, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

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
      ? DESTINATION_MAP[searchData.destination] ?? "/hoteles"
      : "/hoteles";
    router.push(target);
  };

  return (
    <section className="relative w-full h-screen min-h-[640px] max-h-[900px] overflow-hidden">
      {/* ─── Video Background ─── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ zIndex: 0 }}
      >
        <source
          src="https://res.cloudinary.com/dwxk79gt0/video/upload/v1755742793/PORTAL_NECOCLI_2025_V1_xq3pnu.mp4"
          type="video/mp4"
        />
      </video>

      {/* ─── Gradient overlays — subtle, only corners & bottom ─── */}
      {/* Top vignette (very light) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(to bottom, rgba(10,14,20,0.45) 0%, transparent 30%, transparent 55%, rgba(10,14,20,0.72) 100%)",
        }}
      />

      {/* ─── Floating Logo — top center ─── */}
      <div
        className="absolute top-0 left-0 right-0 flex justify-center pt-6 sm:pt-8"
        style={{ zIndex: 10 }}
      >
        <motion.img
          src="https://res.cloudinary.com/dwxk79gt0/image/upload/v1755929246/icono_portal_necocli_nw9wle.png"
          alt="Portal Necoclí"
          initial={{ opacity: 0, scale: 0.75, y: -10 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -8, 0],
          }}
          transition={{
            opacity: { duration: 0.9 },
            scale: { duration: 0.9 },
            y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 },
          }}
          className="w-16 sm:w-20 md:w-24 drop-shadow-[0_4px_24px_rgba(255,255,255,0.35)]"
        />
      </div>

      {/* ─── Hero copy — vertically centered slightly above middle ─── */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
        className="absolute inset-x-0 flex flex-col items-center text-center px-4"
        style={{ top: "30%", zIndex: 10 }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)]">
          Descubre el Paraíso
          <br />
          <span className="text-[#F5C842]">Oculto de Colombia</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl text-white/85 max-w-xl font-light leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
          Hoteles, tours, restaurantes y transporte en Necoclí — reserva con seguridad garantizada.
        </p>
      </motion.div>

      {/* ─── Search bar — anchored to bottom inside hero ─── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.45 }}
        className="absolute inset-x-0 bottom-12 sm:bottom-14 px-4 sm:px-6 flex justify-center"
        style={{ zIndex: 10 }}
      >
        <form
          ref={formRef}
          onSubmit={handleSearch}
          className="w-full max-w-3xl"
        >
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
                  <option value="" className="text-ink">¿Qué buscas?</option>
                  <option value="hoteles" className="text-ink">🏨 Hoteles &amp; Hospedajes</option>
                  <option value="tours" className="text-ink">🌊 Tours &amp; Experiencias</option>
                  <option value="restaurantes" className="text-ink">🍽️ Restaurantes</option>
                  <option value="transporte" className="text-ink">🚐 Transporte</option>
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

              {/* Search button */}
              <button
                type="submit"
                className="ml-2 sm:ml-4 h-11 w-11 shrink-0 rounded-full bg-[#F5C842] hover:bg-[#e6b82e] text-ink flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
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
