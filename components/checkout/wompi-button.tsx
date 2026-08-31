"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

type WompiButtonProps = {
  reference: string;
  amountInCents: number;
  currency?: string;
  redirectUrl: string;
  signature?: string;
};

export function WompiButton({ reference, amountInCents, currency = "COP", redirectUrl, signature }: WompiButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Evitar montar el script dos veces en React Strict Mode
    if (containerRef.current.innerHTML !== "") return;

    // Autoselección de llave según el entorno
    const isDev = process.env.NODE_ENV !== "production";
    const pubKey = isDev 
      ? (process.env.NEXT_PUBLIC_WOMPI_TEST_KEY || "pub_test_Q5yDA9xoKdePzhSGeVe9HAez7HgGORGf")
      : (process.env.NEXT_PUBLIC_WOMPI_KEY || "");  

    const script = document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.setAttribute("data-render", "button");
    script.setAttribute("data-public-key", pubKey);
    script.setAttribute("data-currency", currency);
    script.setAttribute("data-amount-in-cents", amountInCents.toString());
    script.setAttribute("data-reference", reference);
    script.setAttribute("data-redirect-url", redirectUrl);
    
    if (signature) {
      script.setAttribute("data-signature:integrity", signature);
    }

    script.onload = () => setIsLoaded(true);

    containerRef.current.appendChild(script);
  }, [reference, amountInCents, currency, redirectUrl]);

  return (
    <div className="w-full flex flex-col items-center justify-center py-2 min-h-[60px]">
      {!isLoaded && (
        <div className="flex items-center text-ink/50 text-sm font-medium">
          <Loader2 className="w-4 h-4 animate-spin mr-2" /> Cargando pasarela segura...
        </div>
      )}
      <div ref={containerRef} className={!isLoaded ? "hidden" : "w-full flex justify-center scale-110 transform-gpu transition-all"} />
    </div>
  );
}
