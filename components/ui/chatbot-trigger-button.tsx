"use client";

import React from "react";

export function ChatbotTriggerButton() {
  const handleClick = () => {
    // Intentar encontrar el botón del chatbot (usualmente tienen un aria-label o ID específico)
    // Como es genérico, mostramos la alerta como respaldo.
    alert(
      "¡Hola! Soy Alejandro. Para pedir un viaje o domicilio, usa el botón de chat en la esquina inferior derecha.",
    );
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-8 py-4 bg-ink text-white rounded-full font-bold hover:bg-ink/80 transition-all shadow-lg hover:scale-105 active:scale-95 mt-2"
    >
      <span className="text-xl">🤖</span>
      <span>Hablar con Alejandro</span>
    </button>
  );
}
