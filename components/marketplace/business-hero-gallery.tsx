"use client";

import { useState } from "react";
import Image from "next/image";
import { Grid, Heart, Share, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useRouter } from "next/navigation";

interface BusinessHeroGalleryProps {
  name: string;
  mainImage: string;
  gallery?: string[];
}

export function BusinessHeroGallery({ name, mainImage, gallery = [] }: BusinessHeroGalleryProps) {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);

  // Combinamos la imagen principal con las de la galería, eliminando duplicados si los hay
  const allImages = [mainImage, ...gallery.filter((img) => img !== mainImage)];

  // Para el grid inicial usamos máximo 5 imágenes
  const displayImages = allImages.slice(0, 5);

  if (showAll) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b">
          <button
            onClick={() => setShowAll(false)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-full transition-colors font-medium text-sm"
          >
            <ChevronLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Share className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:gap-6">
            {allImages.map((img, i) => (
              <div
                key={img}
                className={cn(
                  "relative w-full rounded-2xl overflow-hidden",
                  i % 3 === 0 ? "aspect-[16/9]" : "aspect-[4/3]",
                )}
              >
                <Image
                  src={img}
                  alt={`${name} - Foto ${i + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      {/* Botones flotantes (Mobile) */}
      <div className="absolute top-4 right-4 z-10 flex gap-2 md:hidden">
        <button className="p-2.5 bg-white shadow-md rounded-full text-slate-700 hover:text-rose-500 transition-colors">
          <Share className="w-4 h-4" />
        </button>
        <button className="p-2.5 bg-white shadow-md rounded-full text-slate-700 hover:text-rose-500 transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="relative overflow-hidden md:rounded-3xl">
        {displayImages.length >= 5 ? (
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[40vh] md:h-[50vh] lg:h-[60vh] min-h-[300px]">
            {/* Imagen Principal Grande (Mitad izquierda) */}
            <div
              className="col-span-4 md:col-span-2 row-span-2 relative group cursor-pointer"
              onClick={() => setShowAll(true)}
            >
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <Image src={displayImages[0]} alt={name} fill className="object-cover" unoptimized />
            </div>

            {/* Cuadrícula derecha (Solo desktop) */}
            <div
              className="hidden md:block relative group cursor-pointer"
              onClick={() => setShowAll(true)}
            >
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <Image src={displayImages[1]} alt={name} fill className="object-cover" unoptimized />
            </div>
            <div
              className="hidden md:block relative group cursor-pointer"
              onClick={() => setShowAll(true)}
            >
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <Image src={displayImages[2]} alt={name} fill className="object-cover" unoptimized />
            </div>
            <div
              className="hidden md:block relative group cursor-pointer"
              onClick={() => setShowAll(true)}
            >
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <Image src={displayImages[3]} alt={name} fill className="object-cover" unoptimized />
            </div>
            <div
              className="hidden md:block relative group cursor-pointer"
              onClick={() => setShowAll(true)}
            >
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <Image src={displayImages[4]} alt={name} fill className="object-cover" unoptimized />
            </div>
          </div>
        ) : (
          <div
            className="relative w-full aspect-[4/3] md:aspect-[21/9] bg-slate-100 cursor-pointer group"
            onClick={() => setShowAll(true)}
          >
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
            <Image
              src={displayImages[0]}
              alt={name}
              fill
              className="object-contain md:object-cover"
              unoptimized
            />
          </div>
        )}

        {/* Botón flotante para ver todas */}
        {allImages.length > 1 && (
          <button
            onClick={() => setShowAll(true)}
            className="absolute bottom-6 right-6 z-20 flex items-center gap-2 bg-white px-4 py-2 rounded-lg font-medium text-sm shadow-md hover:scale-105 transition-transform border border-slate-200"
          >
            <Grid className="w-4 h-4" />
            <span className="hidden sm:inline">Mostrar todas las fotos</span>
            <span className="sm:hidden">{allImages.length} fotos</span>
          </button>
        )}
      </div>
    </div>
  );
}
