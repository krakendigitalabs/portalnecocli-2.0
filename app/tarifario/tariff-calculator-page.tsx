"use client";

import { useState } from "react";
import { TariffCalculator } from "@/components/marketplace/tariff-calculator";
import { BookingModal } from "@/components/marketplace/booking-modal";
import type { TariffService } from "@/data/tariffData";

interface SelectedItem {
  serviceId: string;
  categoryId: string;
  service: TariffService;
  quantity: number;
  unitPrice: number;
  nights?: number;
}

export function TariffCalculatorPage() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  function handleReserve(total: number, _items: SelectedItem[]) {
    setTotalAmount(total);
    setShowBookingModal(true);
  }

  function handleReserveAndPay(total: number, _items: SelectedItem[]) {
    setTotalAmount(total);
    // Por ahora abre el modal de reserva; el checkout con pago se implementa en la siguiente fase
    setShowBookingModal(true);
  }

  return (
    <>
      <TariffCalculator
        onReserve={handleReserve}
        onReserveAndPay={handleReserveAndPay}
      />

      {showBookingModal && (
        <BookingModal
          businessId="tarifario-general"
          businessName="Portal Necoclí — Tarifario"
          priceRange={`Total cotizado: $${totalAmount.toLocaleString("es-CO")} COP`}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </>
  );
}
