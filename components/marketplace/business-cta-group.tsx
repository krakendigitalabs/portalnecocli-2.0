"use client";

import { useState } from "react";
import { BookingModal } from "@/components/marketplace/booking-modal";
import { Button } from "@/components/ui/button";
import type { FeaturedBusiness } from "@/types/featured-business";

type BusinessCTAGroupProps = {
  business: FeaturedBusiness;
  compact?: boolean;
};

/**
 * Grupo de CTAs de un negocio.
 * El botón primario ("Reservar ahora") abre el BookingModal.
 * El botón secundario mantiene el comportamiento de enlace original (ej. WhatsApp).
 */
export function BusinessCTAGroup({ business, compact = false }: BusinessCTAGroupProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sizeClass = compact ? "md" : "lg";

  return (
    <>
      <div
        className={compact ? "flex flex-col gap-2 sm:flex-row" : "flex flex-col gap-3 sm:flex-row"}
      >
        {/* Botón primario → abre el formulario de reserva */}
        <Button size={sizeClass} variant="primary" onClick={() => setIsModalOpen(true)}>
          {business.ctaPrimaryLabel}
        </Button>

        {/* Botón secundario → enlace externo (WhatsApp / teléfono) */}
        <Button href={business.ctaSecondaryHref} size={sizeClass} variant="secondary">
          {business.ctaSecondaryLabel}
        </Button>
      </div>

      {/* Modal de reserva: se monta solo cuando está abierto */}
      {isModalOpen && (
        <BookingModal
          businessId={business.id}
          businessName={business.name}
          priceRange={business.priceRange}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
