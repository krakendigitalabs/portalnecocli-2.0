"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";

declare global {
  interface Window {
    WidgetCheckout: any;
  }
}

type WompiButtonProps = {
  reference: string;
  amountInCents: number;
  currency?: string;
  redirectUrl: string;
  signature?: string;
};

export function WompiButton({ reference, amountInCents, currency = "COP", redirectUrl, signature }: WompiButtonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [checkout, setCheckout] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isDev = process.env.NODE_ENV !== "production";
    const pubKey = isDev 
      ? (process.env.NEXT_PUBLIC_WOMPI_TEST_KEY || "pub_test_Q5yDA9xoKdePzhSGeVe9HAez7HgGORGf")
      : (process.env.NEXT_PUBLIC_WOMPI_KEY || "");  
      
    if (!pubKey) {
      setError("Falta la llave pública de Wompi.");
      return;
    }

    function initCheckout(pubKey: string) {
      try {
        const widgetConfig: any = {
          currency,
          amountInCents,
          reference,
          publicKey: pubKey,
          // ELIMINAMOS redirectUrl de aquí porque Wompi a veces bloquea localhost
          // o URLs no-HTTPS internamente en su iframe, causando el bucle infinito.
          // Lo manejaremos manualmente en el callback de success.
        };

        if (signature) {
          widgetConfig.signature = { integrity: signature };
        }

        const widget = new window.WidgetCheckout(widgetConfig);
        setCheckout(widget);
        setIsLoaded(true);
      } catch (err) {
        console.error("Error inicializando Wompi:", err);
        setError("Error al cargar la pasarela.");
      }
    }

    if (!document.getElementById("wompi-script")) {
      const script = document.createElement("script");
      script.id = "wompi-script";
      script.src = "https://checkout.wompi.co/widget.js";
      script.onload = () => {
        initCheckout(pubKey);
      };
      document.body.appendChild(script);
    } else {
      // Script ya cargado
      const checkInterval = setInterval(() => {
        if (window.WidgetCheckout) {
          clearInterval(checkInterval);
          initCheckout(pubKey);
        }
      }, 100);
    }
  }, [reference, amountInCents, currency, redirectUrl, signature]);

  if (error) {
    return (
      <div className="w-full flex justify-center py-2">
        <div className="text-red-500 text-sm font-medium p-4 border border-red-200 rounded-lg bg-red-50">
          ⚠️ {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-2 min-h-[60px]">
      {!isLoaded ? (
        <div className="flex items-center text-ink/50 text-sm font-medium">
          <Loader2 className="w-4 h-4 animate-spin mr-2" /> Preparando pasarela...
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault();
            checkout?.open((result: any) => {
              console.log("Wompi Result:", result);
              // Wompi devuelve la transacción aquí. 
              // Redirigimos manualmente al usuario a su ticket!
              if (result && result.transaction) {
                  window.location.href = redirectUrl;
              }
            });
          }}
          className="w-full max-w-sm bg-[#002A54] hover:bg-[#001D38] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-[#002A54]/20 hover:scale-[1.02] active:scale-95 border-b-4 border-[#00152B]"
        >
          <ShieldCheck className="w-6 h-6 mr-3 text-[#00E5FF]" />
          Pagar Protegido con Wompi
        </button>
      )}
    </div>
  );
}
