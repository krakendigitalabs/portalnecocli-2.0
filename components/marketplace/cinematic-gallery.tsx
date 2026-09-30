"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { MapPin, Heart, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Category = "Todos" | "Alojamiento" | "Experiencias" | "Alimentos" | "Transporte";

interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: Category;
  location: string;
  description: string;
}

const ITEMS: GalleryItem[] = [
  { id: "1", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1739292149/Turismo_necocli_33_lnwvxw.jpg", title: "Nirvana Paradise", category: "Alojamiento", location: "Playa Principal", description: "Un santuario de descanso donde el mar Caribe besa la arena. Disfruta de atardeceres inolvidables y servicio de clase mundial." },
  { id: "2", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737933627/Playa_necocli_2_z5rgq9.jpg", title: "Atardecer de Oro", category: "Experiencias", location: "Playa El Pescador", description: "Siente la brisa cálida mientras el sol tiñe el horizonte de tonos cobrizos. Una experiencia fotográfica sin igual." },
  { id: "3", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1754277470/PLATO_1_oehl7j.jpg", title: "Sabor a Mar", category: "Alimentos", location: "Malecón Turístico", description: "La pesca del día convertida en alta cocina. Saborea la verdadera esencia de Necoclí en cada bocado." },
  { id: "4", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1743914983/turismo_necocli_1_3_-_copia_kzgmvt.jpg", title: "Ciénaga de Rionegro", category: "Experiencias", location: "Reserva Natural", description: "Adéntrate en los manglares vírgenes. Un ecosistema vibrante que es hogar de cientos de especies exóticas." },
  { id: "5", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744002694/volcan_de_lodo_el_cobre_qxrgzn.png", title: "Volcán El Cobre", category: "Experiencias", location: "Vía Arboletes", description: "Sumérgete en la tierra. Un spa natural milenario con propiedades curativas únicas en el mundo." },
  { id: "6", url: "https://res.cloudinary.com/dr50ioh9h/image/upload/v1752722144/motonecos1_pmd8an.png", title: "Motonecos", category: "Transporte", location: "Centro Histórico", description: "La forma más auténtica y emocionante de recorrer las calles de nuestro paraíso terrenal." },
  { id: "7", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737936904/slider_3_mymktw.png", title: "Eco-Lodge Premium", category: "Alojamiento", location: "Zona Rural", description: "Despierta con el sonido de las aves en una cabaña de lujo inmersa en la exuberante selva tropical." },
  { id: "8", url: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790714007/12_yvzosx.jpg", title: "Festín Costero", category: "Alimentos", location: "Bahía Sur", description: "Una explosión de sabores caribeños. Mariscos frescos y recetas ancestrales preparadas para impresionar." },
];

function ParallaxCard({ item, index }: { item: GalleryItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Efecto Parallax en la imagen (se mueve más lento que el contenedor)
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  // Efecto de opacidad al entrar
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale }}
      className="relative w-full h-[80vh] md:h-[90vh] min-h-[600px] overflow-hidden rounded-[40px] mb-12 lg:mb-24 shadow-2xl group"
    >
      {/* Contenedor de la Imagen con Parallax */}
      <motion.div style={{ y }} className="absolute inset-0 w-full h-[140%] -top-[20%]">
        <Image
          src={item.url}
          alt={item.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
        />
      </motion.div>

      {/* Gradientes Oscuros para dar peso y legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent pointer-events-none" />

      {/* Botón Favorito Flotante */}
      <div className="absolute top-8 right-8 z-20">
        <button className="p-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-rose-500 hover:scale-110 transition-all duration-300">
          <Heart className="w-6 h-6" />
        </button>
      </div>

      {/* Contenido (Textos Grandes y Botones) */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-1.5 rounded-full bg-teal-500/80 backdrop-blur-md text-white text-sm font-bold tracking-widest uppercase shadow-lg">
              {item.category}
            </span>
            <span className="flex items-center text-white/90 text-sm font-medium tracking-wide">
              <MapPin className="w-4 h-4 mr-1" />
              {item.location}
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] mb-6 drop-shadow-xl">
            {item.title}
          </h2>

          <p className="text-lg md:text-2xl text-white/80 font-light max-w-2xl leading-relaxed mb-10 text-shadow-sm">
            {item.description}
          </p>

          {/* Botones de Acción */}
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-teal-50 hover:scale-105 transition-all duration-300">
              Reservar ahora
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300">
              Ver detalles
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function CinematicGallery() {
  return (
    <div className="w-full flex flex-col items-center">
      {ITEMS.map((item, index) => (
        <ParallaxCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}
