import Image from "next/image";
import { useState } from "react";
import { DynamicAppointmentModal } from "./dynamic-appointment-modal";

export function BusinessCard({ business }: { business: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="group relative bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      
      {/* IMAGEN OPTIMIZADA: object-contain + fondo oscuro para evitar cortes de logos */}
      <div className="relative w-full h-[220px] md:h-[260px] bg-slate-900 rounded-t-[32px] overflow-hidden flex items-center justify-center p-6">
        <Image
          src={business?.image || "/placeholder-business.jpg"}
          alt={business?.name || "Negocio"}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-105 p-2"
          priority
        />
      </div>

      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-ink leading-tight">{business?.name}</h3>
          </div>
          
          <p className="text-sm text-slate-500 mb-4 line-clamp-2">{business?.description}</p>

          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 bg-teal/10 text-teal text-[10px] font-bold uppercase rounded-full">
              {business?.category}
            </span>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)} 
          className="w-full py-3 bg-ink text-white rounded-2xl font-bold text-sm hover:bg-teal transition-colors shadow-sm"
        >
          Agendar Servicio
        </button>
      </div>

      {/* MODAL ADAPTATIVO POR CATEGORÍA */}
      <DynamicAppointmentModal
        businessName={business?.name || ""}
        category={business?.category || ""}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}