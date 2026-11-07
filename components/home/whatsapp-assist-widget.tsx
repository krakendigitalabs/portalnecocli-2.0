import { MessageCircle } from "lucide-react";
import { SALES_WHATSAPP_PHONE } from "@/data/home-offers";
import { createWhatsAppHref } from "@/lib/utils/business-links";

const SALES_MESSAGE =
  "¡Hola Alejandro! Quiero información y precios para reservar mi viaje a Necoclí.";

export function WhatsAppAssistWidget() {
  return (
    <a
      aria-label="Habla con Alejandro por WhatsApp"
      className="fixed bottom-6 left-4 z-[9000] flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-2xl transition hover:scale-105 active:scale-95 sm:left-8 sm:bottom-8"
      href={createWhatsAppHref(SALES_WHATSAPP_PHONE, SALES_MESSAGE)}
      rel="noopener noreferrer"
      target="_blank"
    >
      <MessageCircle aria-hidden className="h-5 w-5" />
      <span className="hidden sm:inline">¡Habla con Alejandro!</span>
    </a>
  );
}
