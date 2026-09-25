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
  const isOrderMode = ["restaurante", "comercio", "domicilios"].includes(business.serviceType);

  return (
    <>
      <div
        className={
          compact
            ? "flex flex-col gap-2 sm:flex-row flex-wrap"
            : "flex flex-col gap-3 sm:flex-row flex-wrap"
        }
      >
        {/* Botón Reservar → abre el formulario de reserva o va a reservas-maritimas */}
        {business.slug === "transporte-maritimo-sol-y-playa" ||
        business.slug === "el-caribe-sas" ? (
          <Button href="/reservas-maritimas" size={sizeClass} variant="primary">
            Reservar Tour / Día de Sol
          </Button>
        ) : (
          <Button size={sizeClass} variant="primary" onClick={() => setIsModalOpen(true)}>
            {isOrderMode ? "Hacer Pedido" : "Reservar ahora"}
          </Button>
        )}

        {/* Botón primario → enlace externo (WhatsApp / teléfono) */}
        <Button
          href={business.ctaPrimaryHref}
          size={sizeClass}
          variant="secondary"
          className="border-teal text-teal hover:bg-teal hover:text-white"
        >
          {business.ctaPrimaryLabel}
        </Button>

        {/* Botón secundario → enlace externo */}
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
          mode={isOrderMode ? "order" : "booking"}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
