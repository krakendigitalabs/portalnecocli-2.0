import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";

const logos = [
  { id: 1, src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1738777490/logo_b561kb.jpg", alt: "Marca 1" },
  { id: 2, src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1738777443/Untitled_design_9_aoctc8.png", alt: "Marca 2" },
  { id: 3, src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1738777571/logo_s808au.png", alt: "Marca 3" },
  { id: 4, src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1738777611/logo_atlantico_ymanrj.png", alt: "Marca 4" },
  { id: 5, src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1738777623/logo_looxym.jpg", alt: "Marca 5" },
  { id: 6, src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1738777642/logo_maracana_1_g332ka.jpg", alt: "Marca 6" },
  { id: 7, src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1738777675/Untitled_design_1_xtavuv.png", alt: "Marca 7" },
  { id: 8, src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1738777712/LOGO_URAVENTAS_jpq4el.jpg", alt: "Marca 8" },
  { id: 9, src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1738777931/logo_wqumz0.png", alt: "Marca 9" },
  { id: 10, src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1738778181/2_gabdov.png", alt: "Marca 10" },
  { id: 11, src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1738778191/logo-kraken-blanco-negro_1_xsrdvy.png", alt: "Kraken Digital Labs", featured: true },
  { id: 12, src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1740669054/LOGO_SOL_Y_PLAYA_ip7gwt.png", alt: "Marca 12" },
  { id: 13, src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1742344622/LOGO_TAVI_wf0ycq.png", alt: "Marca 13" },
  { id: 14, src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1742344764/aly_agelcn.png", alt: "Marca 14" },
];

export function LogoMarquee() {
  return (
    <section className="py-20 bg-white overflow-hidden border-t border-ink/5">
      <Container>
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <p className="text-green font-bold tracking-widest uppercase text-xs mb-3">
            Confianza local
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
            Negocios y experiencias recomendadas
          </h2>
          <p className="text-base text-ink/70">
            Aliados visibles para turistas y comunidad local. Una red activa de marcas, servicios y experiencias dentro de Necoclí.
          </p>
        </div>
      </Container>

      {/* Marquee Wrapper */}
      <div className="relative flex overflow-x-hidden w-full group">
        
        {/* Track animado */}
        <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap items-center w-max">
          
          {/* Renderizamos la lista 2 veces para un loop perfecto */}
          {[...logos, ...logos].map((logo, index) => (
            <Link 
              key={`${logo.id}-${index}`} 
              href="/location" 
              className={`relative flex items-center justify-center shrink-0 mx-6 transition-all duration-300 hover:scale-110 opacity-70 hover:opacity-100 filter hover:grayscale-0 ${logo.featured ? 'grayscale-0 opacity-100 scale-105 mx-10' : 'grayscale'}`}
            >
              {logo.featured && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gold text-white text-[10px] uppercase font-bold tracking-widest py-1 px-3 rounded-full shadow-md z-10">
                  Destacada
                </span>
              )}
              
              <div className={`relative h-20 w-32 md:h-24 md:w-40 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-ink/5 p-4 ${logo.featured ? 'ring-2 ring-gold/30 shadow-gold/20' : ''}`}>
                {/* Fallback a tag img normal ya que algunos srcs de cloudinary pueden no estar configurados en next.config */}
                <img 
                  src={logo.src} 
                  alt={logo.alt} 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </Link>
          ))}
          
        </div>
        
        {/* Gradientes laterales para suavizar la entrada/salida */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
