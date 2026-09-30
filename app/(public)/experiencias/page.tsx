"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ArrowRight } from "lucide-react";
import { PackageBookingForm } from "@/components/marketplace/package-booking-form";
import { MagicParticles } from "@/components/magic-particles";

const SLIDER_DATA = [
  {
    src: "https://res.cloudinary.com/dr50ioh9h/image/upload/v1787374828/yessy_portal_vnjote.jpg",
    tag: "El Paraíso Te Espera",
    title: "Bienvenido a Necoclí",
    description: "Descubre la perla del Golfo de Urabá. Un destino donde la brisa del mar y la calidez de su gente te hacen sentir en casa desde el primer segundo."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790714020/4_xwvtpo.jpg",
    tag: "Estadías de Negocio",
    title: "Confort y Productividad",
    description: "Espacios diseñados para el viajero corporativo. Habitaciones equipadas, conectividad de alta velocidad y el descanso que necesitas después de una jornada de trabajo."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790714016/6_jlis53.jpg",
    tag: "Nómadas Digitales",
    title: "Tu Oficina en el Caribe",
    description: "Cambia la vista de tu ventana por el azul del mar. Conexión Wi-Fi estable, clima tropical y la inspiración perfecta para trabajar remotamente."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790714007/12_yvzosx.jpg",
    tag: "Aventura y Verano",
    title: "Verano Eterno",
    description: "Días soleados, arena dorada y el sonido constante de las olas. El destino definitivo para sacudirte el estrés y vivir un verano que nunca termina."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790714009/11_ruo8xa.jpg",
    tag: "Tour de Islas",
    title: "Explora el Archipiélago",
    description: "Embárcate en un viaje cristalino. Descubre islas vírgenes, practica snorkel en arrecifes llenos de vida y siente la verdadera inmensidad del océano."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790714004/16_yaliyb.jpg",
    tag: "Grupos de Empresa",
    title: "Retiros Corporativos",
    description: "Fortalece el trabajo en equipo en un entorno paradisíaco. Ofrecemos alojamientos de gran capacidad y salones ideales para incentivos empresariales."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1790714003/18_doeyfe.jpg",
    tag: "Conexión Natural",
    title: "Santuario de Naturaleza",
    description: "Respira aire puro. Adéntrate en manglares, avista aves exóticas y reconecta con la tierra en nuestros corredores de turismo ecológico y sostenible."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1777075436/3_f0qwdx.jpg",
    tag: "Relajación Total",
    title: "Oasis de Descanso",
    description: "Deja que el tiempo se detenga. Encuentra la paz mental escuchando el murmullo del mar desde la comodidad de nuestras exclusivas instalaciones."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1754277470/PLATO_1_oehl7j.jpg",
    tag: "Gastronomía Local",
    title: "Sabores del Mar",
    description: "Una explosión culinaria en tu paladar. Deléitate con la pesca del día, patacones frescos y la sazón ancestral que define nuestra tierra caribeña."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1777075436/8_tyrjeo.jpg",
    tag: "Viajes con Amigos",
    title: "Aventuras Compartidas",
    description: "La escapada perfecta para tu grupo. Fiestas en la playa, música local, atardeceres dorados y risas que resonarán para toda la vida."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1777075436/4_dasbqm.jpg",
    tag: "Experiencias Únicas",
    title: "Volcanes de Lodo",
    description: "Sumérgete en un spa natural. Descubre los cráteres de lodo volcánico, conocidos por sus propiedades curativas y purificadoras para la piel."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744736290/guia_jontzc.jpg",
    tag: "Turismo Guiado",
    title: "Rutas con Historia",
    description: "Conoce Necoclí de la mano de sus verdaderos protagonistas. Guías locales expertos te llevarán por rutas llenas de cultura, mitos y tradiciones."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003514/turismo_necocli_45_mxvzea.jpg",
    tag: "Deportes Acuáticos",
    title: "Adrenalina sobre el Agua",
    description: "Siente la brisa en tu rostro. Desde kayak en aguas tranquilas hasta paseos en lancha deportiva; el mar Caribe es tu patio de juegos."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003509/turismo_necocli_52_paq3dl.jpg",
    tag: "Eco-Turismo",
    title: "Senderos Ancestrales",
    description: "Camina por senderos rodeados de selva tropical. Un encuentro profundo con la flora y fauna endémica de la región de Urabá."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003504/turismo_necocli_31_seediu.jpg",
    tag: "Rutas Costeras",
    title: "Exploración de Playas",
    description: "Cada playa tiene su propia magia. Recorre kilómetros de costa virgen descubriendo rincones secretos y aguas cristalinas intocables."
  },
  {
    src: "https://res.cloudinary.com/dr50ioh9h/image/upload/v1752722144/motonecos1_pmd8an.png",
    tag: "Transporte Seguro",
    title: "Turismo Local Confiable",
    description: "Recorre cada rincón de Necoclí con la tranquilidad que mereces. Nuestros conductores aliados (Motonecos) están capacitados para brindarte un servicio amable, guiado y 100% seguro."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744734193/transporte_necocli_hud8m0.jpg",
    tag: "Turismo Confiable",
    title: "Cultura de Seguridad",
    description: "Nuestra prioridad es tu tranquilidad. Operamos bajo estrictos protocolos de seguridad turística para que disfrutes cada recorrido con total confianza y paz mental."
  },

  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1739291734/turismo_necocli_111_hwcnic.jpg",
    tag: "Paisaje Mágico",
    title: "Atardeceres de Fuego",
    description: "La joya de la corona. Cada día termina con un espectáculo visual en el cielo, donde el sol se funde con el mar Caribe regalando atardeceres dorados."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003498/turismo_necocli_32_i66jft.jpg",
    tag: "Verano Sin Fin",
    title: "Playas Vírgenes",
    description: "Siente la arena cálida bajo tus pies. Kilómetros de costas serenas bordeadas de palmeras te esperan para disfrutar del sol caribeño en su máxima expresión."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003480/turismo_30_dzr8jh.jpg",
    tag: "Ecoturismo",
    title: "Naturaleza Viva",
    description: "Respira aire puro y conéctate con la tierra. Descubre la exuberante selva tropical y los ecosistemas vibrantes que hacen de Necoclí un santuario natural."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003466/turismo_necocli_39_v2yyos.jpg",
    tag: "Aventura Tropical",
    title: "Espíritu Explorador",
    description: "Para los corazones inquietos. Adéntrate en rutas escondidas, manglares misteriosos y senderos ecológicos guiados por expertos locales."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003449/turismo_necocli_40_rn8ztu.jpg",
    tag: "Paz y Bienestar",
    title: "Desconexión Total",
    description: "Deja atrás el estrés urbano. Encuentra rincones de profunda tranquilidad donde el sonido de las olas es tu única compañía durante el día."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003419/turismo_necocli_59_uxosee.jpg",
    tag: "Adrenalina Caribeña",
    title: "Deportes Acuáticos",
    description: "Siente la velocidad y domina las olas. Desde paseos dinámicos hasta motos acuáticas, el mar de Necoclí es tu patio de juegos."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003414/turismo_necocli_60_cu438c.jpg",
    tag: "Mar Abierto",
    title: "Excursiones Marítimas",
    description: "Navega hacia el horizonte. Zarpa en expediciones seguras y emocionantes para conocer ensenadas ocultas y maravillas costeras incomparables."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003383/turismo_necocli_51_zk1wa6.jpg",
    tag: "Sabor a Mar",
    title: "Gastronomía Costera",
    description: "Un festín para tus sentidos. Deléitate con la pesca del día, cocos frescos y las tradicionales preparaciones culinarias que caracterizan nuestra región."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003361/turismo_necocli_67_tzdjdf.jpg",
    tag: "Vida Submarina",
    title: "Descubre el Arrecife",
    description: "Sumérgete en aguas cristalinas y maravíllate con la rica biodiversidad marina que habita en las profundidades de nuestras costas."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1743917706/Copia_de_Copia_de_Turismo_necocli_1_3_ojy0et.png",
    tag: "Turismo Local",
    title: "Magia del Golfo",
    description: "Recorre las tradiciones y lugares más emblemáticos. Nuestra comunidad te abre las puertas a una experiencia auténtica y llena de calidez humana."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1743916015/Copia_de_Turismo_necocli_1_vuef4z.png",
    tag: "Patrimonio Natural",
    title: "Rutas Ancestrales",
    description: "Camina por senderos donde la historia y la naturaleza se entrelazan, descubriendo paisajes que han perdurado a través del tiempo."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1743914983/turismo_necocli_1_3_-_copia_kzgmvt.jpg",
    tag: "Paseos en Bote",
    title: "Aventuras Costeras",
    description: "Siente la suave brisa del mar mientras bordeas las costas de arena blanca en nuestras tradicionales embarcaciones locales."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1743903236/turismo_necocli_23_nuihua.jpg",
    tag: "Descanso y Sol",
    title: "Oasis de Relajación",
    description: "Un refugio apartado del bullicio. El destino perfecto para encontrar la paz bajo la sombra de las palmeras con el sonido del mar de fondo."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1739292149/Turismo_necocli_33_lnwvxw.jpg",
    tag: "Ecoturismo Responsable",
    title: "Santuario de Flora",
    description: "Conéctate profundamente con el entorno. Explora reservas ecológicas protegidas y maravíllate con la exuberante vegetación tropical."
  },

  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737933627/Playa_necocli_2_z5rgq9.jpg",
    tag: "Brisas del Mar",
    title: "Costas Inolvidables",
    description: "Pasea por kilómetros de arenas cálidas y déjate abrazar por el encanto de uno de los paraísos más hermosos del Urabá."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737748236/IMG-20240107-WA0029_ly0gba.jpg",
    tag: "Recuerdos Eternos",
    title: "Postales Vivas",
    description: "Captura instantes perfectos bajo el sol. Cada rincón te invita a crear memorias que atesorarás para toda la vida."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737932109/Playa_necocli_6_usilb7.jpg",
    tag: "Refugio Tropical",
    title: "Playa y Brisa",
    description: "El lugar donde el tiempo se detiene. Sumérgete en aguas cristalinas y renueva tus energías con la suave corriente del mar."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737932069/MAravillaas_vimond.jpg",
    tag: "Tesoros Ocultos",
    title: "Maravillas Naturales",
    description: "Explora paisajes asombrosos. Desde manglares hasta playas vírgenes, descubre los secretos mejor guardados de nuestro ecosistema."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737931986/IMG_20241217_173749_onbd2f.jpg",
    tag: "Aventura Salvaje",
    title: "Exploración Natural",
    description: "Adéntrate en los paisajes vírgenes de Necoclí y descubre rincones llenos de magia y biodiversidad."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737931948/IMG_20241217_173230_hqu79p.jpg",
    tag: "Rincones Secretos",
    title: "Senderos Místicos",
    description: "Camina por rutas rodeadas de exuberante vegetación y conéctate con la pureza de nuestro ecosistema."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737931944/IMG_20241217_173202_a2jdjk.jpg",
    tag: "Paraíso Tropical",
    title: "Palmeras y Sol",
    description: "Relájate bajo el vibrante sol caribeño y deja que el sonido del viento entre las palmeras te renueve."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737748239/IMG_20240106_181825_gx0nsb.jpg",
    tag: "Momentos Mágicos",
    title: "Tardes de Playa",
    description: "Sumérgete en la calidez de nuestras costas mientras disfrutas de una tarde inolvidable junto al mar."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1777075437/5_rgphce.jpg",
    tag: "Escapada Perfecta",
    title: "Oasis Caribeño",
    description: "Encuentra la tranquilidad que buscas en un entorno paradisíaco diseñado para tu descanso absoluto."
  },
  {
    src: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1777075436/2_d4xktg.jpg",
    tag: "Cultura y Color",
    title: "Vibraciones Locales",
    description: "Siente el ritmo y la alegría de nuestra tierra en cada rincón, donde la naturaleza y la cultura se funden."
  }
];

export default function ExperienciasPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % SLIDER_DATA.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? SLIDER_DATA.length - 1 : prev - 1));

  const currentSlide = SLIDER_DATA[currentIndex];

  return (
    <main className="min-h-screen bg-black">
      {/* ─── HERO SECTION ─── */}
      <section className="relative w-full bg-black pt-32 pb-20 px-4 md:px-8 overflow-hidden min-h-screen flex flex-col">
        {/* Fondo decorativo sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 to-black z-0" />
        
        {/* Partículas Mágicas 3D Interactivas */}
        <MagicParticles />
        
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1] mb-6 drop-shadow-lg">
            Experiencias <span className="text-teal-400">Turísticas</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed max-w-3xl">
            Descubre la verdadera esencia de Necoclí a través de aventuras diseñadas para cautivar tus sentidos.
            Desde atardeceres dorados hasta volcanes de lodo ancestrales.
          </p>
        </div>

        {/* ─── CAROUSEL CINEMÁTICO (FILMSTRIP & PARALLAX) ─── */}
        <div className="relative z-10 w-full h-[65vh] md:h-[70vh] min-h-[450px] md:min-h-[500px] flex items-center justify-center overflow-hidden mb-12">
          {SLIDER_DATA.map((slide, index) => {
            const len = SLIDER_DATA.length;
            // Calcular la distancia más corta en un arreglo circular
            let offset = index - currentIndex;
            if (offset > len / 2) offset -= len;
            if (offset < -len / 2) offset += len;

            // Renderizar solo si está cerca del centro para mejor rendimiento
            if (Math.abs(offset) > 2) return null;

            const isCenter = offset === 0;
            const xPos = offset * 110; // 110% para ajustar al nuevo ancho

            return (
              <motion.div
                key={index}
                animate={{
                  x: `${xPos}%`,
                  scale: isCenter ? 1 : 0.85,
                  opacity: isCenter ? 1 : (Math.abs(offset) === 1 ? 0.5 : 0),
                  zIndex: isCenter ? 20 : 10 - Math.abs(offset),
                }}
                transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                className="absolute w-[90vw] md:w-[70vw] max-w-[1400px] h-full rounded-[24px] md:rounded-[40px] overflow-hidden shadow-2xl border border-white/10 bg-black group transition-all duration-700 hover:border-white/20 hover:shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                style={{
                  pointerEvents: isCenter ? 'auto' : 'none'
                }}
              >
                {/* Contenedor Interno para Imagen completa (Ajuste natural) */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={slide.src}
                    alt={slide.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-[3s] ease-out group-hover:scale-105"
                    priority={isCenter || Math.abs(offset) === 1}
                  />
                </div>
                
                {/* Overlay Oscuro Elegante (Solo en el central) */}
                <motion.div 
                  animate={{ opacity: isCenter ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-70" 
                />

                {/* Spotlight de Iluminación Fina (Glow Interno) */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_60%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none mix-blend-overlay" />
                
                {/* Contenido sobre la imagen (Solo en el central) */}
                <motion.div 
                  animate={{ opacity: isCenter ? 1 : 0, y: isCenter ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: isCenter ? 0.2 : 0 }}
                  className="absolute inset-0 flex flex-col justify-end p-6 md:p-16"
                >
                  <div className="max-w-2xl">
                    <p className="text-white text-xs md:text-sm font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-3 flex items-center gap-2">
                      <span className="w-6 h-[2px] bg-white rounded-full hidden md:inline-block"></span>
                      {slide.tag}
                    </p>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-lg leading-tight">
                      {slide.title}
                    </h2>
                    
                    {/* Botones de Acción */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
                      <button 
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-full font-bold text-base md:text-lg transition-all duration-300 shadow-lg shadow-teal-500/30 hover:scale-105 w-full sm:w-auto"
                      >
                        Reservar Ahora
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <button 
                        onClick={() => setIsDetailsOpen(true)}
                        className="px-6 py-3 md:px-8 md:py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-full font-bold text-base md:text-lg hover:bg-white/20 transition-all duration-300 w-full sm:w-auto text-center"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}

          {/* Controles del Slider */}
          <button 
            onClick={prevSlide}
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-3 md:p-5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-colors z-30 shadow-2xl"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-3 md:p-5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-colors z-30 shadow-2xl"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>
      </section>

      {/* ─── MODAL DE DETALLES ─── */}
      <AnimatePresence>
        {isDetailsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl bg-neutral-950 rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-white/10"
            >
              <button 
                onClick={() => setIsDetailsOpen(false)}
                className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-rose-500 transition-colors z-50 shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="relative w-full h-72 md:h-[450px] bg-black overflow-hidden flex-shrink-0">
                {/* Fondo difuminado (Cinematic blur) */}
                <Image
                  src={currentSlide.src}
                  alt="Background blur"
                  fill
                  className="object-cover opacity-40 blur-2xl scale-110"
                />
                {/* Imagen principal 100% visible sin cortes */}
                <Image
                  src={currentSlide.src}
                  alt={currentSlide.title}
                  fill
                  className="object-contain z-10 p-2 md:p-6"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent z-20 pointer-events-none" />
              </div>
              
              <div className="p-8 md:p-12 -mt-16 md:-mt-24 relative z-30 text-center flex-grow flex flex-col justify-end">
                <p className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-2">
                  {currentSlide.tag}
                </p>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                  {currentSlide.title}
                </h2>
                <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8">
                  {currentSlide.description}
                </p>
                
                <button 
                  onClick={() => {
                    setIsDetailsOpen(false);
                    setTimeout(() => setIsFormOpen(true), 300);
                  }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-full font-bold text-lg transition-all duration-300 shadow-lg"
                >
                  Continuar a Reserva
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MODAL DEL FORMULARIO DE RESERVA ─── */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="relative w-full max-w-md max-h-[95vh] bg-white rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Botón de cerrar fijo en la parte superior del modal */}
              <button 
                onClick={() => setIsFormOpen(false)}
                className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-rose-500 transition-colors z-50 shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Renderizamos el formulario con su propio scroll interno */}
              <div className="overflow-y-auto w-full h-full hide-scrollbar pb-8">
                <PackageBookingForm />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
