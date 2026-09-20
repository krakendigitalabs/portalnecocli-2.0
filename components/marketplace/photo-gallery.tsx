"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";

const galleryImages = [
  "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737730071/IMG_20240122_172355_b4rmaj.jpg",
  "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737733633/IMG_20240116_174428_atjtfv.jpg",
  "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737748238/IMG_20240116_175237_d3wlur.jpg",
  "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737748238/IMG_20240107_161824_soutyq.jpg",
  "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737931944/IMG_20241217_173202_a2jdjk.jpg",
  "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737932109/Playa_necocli_6_usilb7.jpg",
  "https://res.cloudinary.com/dwxk79gt0/image/upload/v1739243210/IMG_20241217_173322_xfanmb.jpg",
  "https://res.cloudinary.com/dwxk79gt0/image/upload/v1739291734/turismo_necocli_111_hwcnic.jpg",
  "https://res.cloudinary.com/dwxk79gt0/image/upload/v1739292149/Turismo_necocli_33_lnwvxw.jpg",
  "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003361/turismo_necocli_67_tzdjdf.jpg",
  "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003434/turismo_necocli_57_gqvstk.jpg",
  "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003480/turismo_30_dzr8jh.jpg",
  "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003485/turismo_necocli_35_c81lmu.jpg",
  "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003509/turismo_necocli_52_paq3dl.jpg",
  "https://res.cloudinary.com/dwxk79gt0/image/upload/v1754277470/plato_4_akdkbk.jpg",
  "https://res.cloudinary.com/dwxk79gt0/image/upload/v1777075436/2_d4xktg.jpg",
  "https://res.cloudinary.com/dwxk79gt0/image/upload/v1777075436/8_tyrjeo.jpg",
];

// Split images into two rows for the marquee
const firstRow = galleryImages.slice(0, 9);
const secondRow = galleryImages.slice(9);

export function PhotoGallery() {
  return (
    <section className="py-24 bg-ink relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-ink via-ink to-black z-0" />
      
      <Container className="relative z-10 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gold font-bold tracking-[0.2em] uppercase text-sm mb-4 drop-shadow-md">
            Momentos Inolvidables
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-tropical tracking-wide drop-shadow-lg">
            Vive Necoclí
          </h2>
        </motion.div>
      </Container>

      <div className="relative z-10 flex flex-col gap-6 md:gap-8 overflow-hidden w-full">
        {/* Fila 1 - Moviéndose a la izquierda */}
        <div className="flex group w-full overflow-hidden">
          <motion.div
            className="flex gap-6 md:gap-8 min-w-full pr-6 md:pr-8"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 40,
            }}
          >
            {/* Duplicamos para efecto infinito */}
            {[...firstRow, ...firstRow].map((img, index) => (
              <GalleryItem key={`row1-${index}`} item={img} />
            ))}
          </motion.div>
        </div>

        {/* Fila 2 - Moviéndose a la derecha */}
        <div className="flex group w-full overflow-hidden">
          <motion.div
            className="flex gap-6 md:gap-8 min-w-full pr-6 md:pr-8"
            animate={{ x: ["-100%", "0%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 35,
            }}
          >
            {/* Duplicamos para efecto infinito */}
            {[...secondRow, ...secondRow].map((img, index) => (
              <GalleryItem key={`row2-${index}`} item={img} />
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Sombras en los bordes para difuminar */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/12 bg-gradient-to-r from-ink to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/12 bg-gradient-to-l from-ink to-transparent z-20" />
    </section>
  );
}

function GalleryItem({ item }: { item: string | { src: string; isSvg: boolean } }) {
  const isObject = typeof item === "object";
  const src = isObject ? item.src : item;
  const isSvg = isObject ? item.isSvg : false;

  return (
    <motion.div
      whileHover={{ 
        scale: 1.05, 
        zIndex: 50,
        boxShadow: "0 0 30px rgba(201, 168, 76, 0.4)", // Resplandor dorado
      }}
      className={`relative shrink-0 overflow-hidden rounded-[24px] cursor-pointer transition-all duration-300
        ${isSvg ? 'bg-white/5 flex items-center justify-center p-8' : 'bg-white/10'}
        w-[250px] h-[350px] sm:w-[300px] sm:h-[400px] lg:w-[350px] lg:h-[450px]
      `}
    >
      {isSvg ? (
        <motion.img 
          src={src} 
          alt="Necoclí" 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
        />
      ) : (
        <img
          src={src}
          alt="Galería Necoclí"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
      )}
      
      {/* Overlay luminoso al hacer hover */}
      {!isSvg && (
        <div className="absolute inset-0 bg-gradient-to-t from-gold/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
    </motion.div>
  );
}
