"use client";

import { Download, Printer } from "lucide-react";

/**
 * Botones de acción del Ticket Digital.
 * `window.print()` activa el CSS @media print del ticket page para una salida limpia.
 */
export function PrintTicketButton() {
  return (
    <>
      <button
        type="button"
        onClick={() => window.print()}
        className="flex items-center gap-2 text-ink font-bold text-sm bg-white border border-ink/10 shadow-sm hover:shadow-md px-4 py-2 rounded-full w-fit transition-all"
      >
        <Printer className="w-4 h-4" />
        <span className="hidden sm:inline">Imprimir</span>
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        title="Para descargar como PDF, selecciona 'Guardar como PDF' en el diálogo de impresión"
        className="flex items-center gap-2 text-teal font-bold text-sm bg-teal/10 hover:bg-teal/20 px-4 py-2 rounded-full w-fit transition-all"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Descargar PDF</span>
      </button>
    </>
  );
}
