"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin, Heart, Maximize2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Category = "Todos" | "Alojamiento" | "Experiencias" | "Alimentos" | "Transporte";

interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: Category;
  location: string;
  size: "small" | "medium" | "large" | "wide" | "tall";
}

// Catálogo ordenado aleatoriamente y categorizado
const ITEMS: GalleryItem[] = [
  { id: "1", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1743914983/turismo_necocli_1_3_-_copia_kzgmvt.jpg", title: "Ciénaga de Rionegro", category: "Experiencias", location: "Reserva Natural", size: "large" },
  { id: "2", url: "https://res.cloudinary.com/dr50ioh9h/image/upload/v1752722144/motonecos1_pmd8an.png", title: "Motonecos Aventura", category: "Transporte", location: "Centro Histórico", size: "small" },
  { id: "3", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1754277470/PLATO_1_oehl7j.jpg", title: "Gastronomía Local", category: "Alimentos", location: "Malecón", size: "tall" },
  { id: "4", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1739292149/Turismo_necocli_33_lnwvxw.jpg", title: "Hotel Nirvana", category: "Alojamiento", location: "Playa Principal", size: "wide" },
  { id: "5", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744002694/volcan_de_lodo_el_cobre_qxrgzn.png", title: "Volcán de Lodo", category: "Experiencias", location: "Vía Arboletes", size: "tall" },
  { id: "6", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737936586/slider_2_phuwte.png", title: "Resort Frente al Mar", category: "Alojamiento", location: "Playa Norte", size: "medium" },
  { id: "7", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744734193/transporte_necocli_hud8m0.jpg", title: "Transporte Privado", category: "Transporte", location: "Muelle Turístico", size: "small" },
  { id: "8", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737936904/slider_3_mymktw.png", title: "Eco-Lodge Premium", category: "Alojamiento", location: "Zona Rural", size: "large" },
  { id: "9", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737933627/Playa_necocli_2_z5rgq9.jpg", title: "Atardecer Caribeño", category: "Experiencias", location: "Playa El Pescador", size: "wide" },
  { id: "10", url: "https://res.cloudinary.com/dr50ioh9h/image/upload/v1752721836/motonecos_letrero_p4iekf.jpg", title: "Estación Motonecos", category: "Transporte", location: "Parque Principal", size: "small" },
  { id: "11", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790714007/12_yvzosx.jpg", title: "Mariscos Frescos", category: "Alimentos", location: "Restaurante Costero", size: "medium" },
  { id: "12", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744736290/guia_jontzc.jpg", title: "Ruta del Cacao", category: "Experiencias", location: "Finca Tradicional", size: "tall" },
  { id: "13", url: "https://res.cloudinary.com/dr50ioh9h/image/upload/v1752722255/familia_22_febopw.png", title: "Paseo Familiar", category: "Experiencias", location: "Playas", size: "medium" },
  { id: "14", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003480/turismo_30_dzr8jh.jpg", title: "Tour en Lancha", category: "Experiencias", location: "Golfo de Urabá", size: "small" },
  { id: "15", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003514/turismo_necocli_45_mxvzea.jpg", title: "Cabañas Rusticas", category: "Alojamiento", location: "Sector Sur", size: "large" },
  { id: "16", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790714020/4_xwvtpo.jpg", title: "Bebidas Tropicales", category: "Alimentos", location: "Bar de Playa", size: "small" },
  { id: "17", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1743903236/turismo_necocli_23_nuihua.jpg", title: "Avistamiento de Aves", category: "Experiencias", location: "Humedales", size: "tall" },
  { id: "18", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737748238/elegida_10_qeylgb.jpg", title: "Escape Romántico", category: "Alojamiento", location: "Punta Arena", size: "wide" },
];

const CATEGORIES: Category[] = ["Todos", "Alojamiento", "Experiencias", "Alimentos", "Transporte"];

const sizeClasses = {
  small: "col-span-1 row-span-1",
  medium: "col-span-1 md:col-span-2 row-span-1",
  wide: "col-span-1 md:col-span-2 lg:col-span-3 row-span-1",
  tall: "col-span-1 row-span-2",
  large: "col-span-1 md:col-span-2 row-span-2",
};

export function BentoGallery() {
  const [activeCategory, setActiveCategory] = useState<Category>("Todos");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredItems = ITEMS.filter(
    (item) => activeCategory === "Todos" || item.category === activeCategory
  );

  return (
    <div className="w-full">
      {/* ─── TABS DE CRISTAL ─── */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "relative px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300",
              activeCategory === cat
                ? "text-white shadow-lg shadow-teal-500/30"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white/50 backdrop-blur-sm border border-slate-200/50"
            )}
          >
            {activeCategory === cat && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-teal-600 rounded-full"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {cat === "Todos" && <Sparkles className="w-4 h-4" />}
              {cat}
            </span>
          </button>
        ))}
      </div>

      {/* ─── BENTO GRID ─── */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[220px] gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className={cn(
                "relative group overflow-hidden rounded-[24px] bg-slate-100",
                activeCategory === "Todos" ? sizeClasses[item.size] : "col-span-1 row-span-1" // Si filtra, se normaliza el grid
              )}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Imagen con Parallax suave */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized // Para Cloudinary directo sin configurar dominios extra si hace falta
                />
              </div>

              {/* Overlay Oscuro Elegante */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

              {/* Botón Flotante Favorito */}
              <div className="absolute top-4 right-4 translate-y-[-20px] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20">
                <button className="p-2.5 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-rose-500 transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              {/* Información Inferior (Glassmorphism) */}
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-teal-300 mb-1">
                        {item.category}
                      </p>
                      <h3 className="text-lg font-bold text-white leading-tight mb-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center text-slate-300 text-sm">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        {item.location}
                      </div>
                    </div>
                    <button className="bg-white text-slate-900 p-2 rounded-full hover:bg-teal-400 hover:text-white transition-colors">
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Estado Normal (Visible siempre) */}
              <div
                className={cn(
                  "absolute bottom-5 left-5 transition-all duration-300 z-10",
                  hoveredId === item.id ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                )}
              >
                <h3 className="text-xl font-bold text-white drop-shadow-md">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
