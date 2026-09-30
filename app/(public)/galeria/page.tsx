import type { Metadata } from "next";
import { CinematicGallery } from "@/components/marketplace/cinematic-gallery";

export const metadata: Metadata = {
  title: "Galería y Catálogo · Portal Necoclí",
  description: "Descubre el paraíso a través de nuestra galería inmersiva de alojamientos, experiencias y gastronomía en Necoclí.",
};

export default function GaleriaPage() {
  return (
    <main className="min-h-screen bg-slate-950 pt-24 pb-20">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16 pt-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-teal-400 mb-6">
            Colección Signature
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-8">
            El Paraíso en <span className="text-teal-400">Gran Formato</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed font-light">
            Déjate envolver por la majestuosidad de Necoclí. Nuestro catálogo premium está diseñado
            para que sientas la arena, escuches el mar y saborees el Caribe antes de llegar.
          </p>
        </div>

        {/* Componente Cinemático */}
        <CinematicGallery />
        
      </div>
    </main>
  );
}
