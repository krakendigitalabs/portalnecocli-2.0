import Link from "next/link";
import { Metadata } from "next";
import { ChatbotTriggerButton } from "@/components/ui/chatbot-trigger-button";

export const metadata: Metadata = {
  title: "Turismo Local | Portal Necoclí",
  description: "Movilidad, transporte y domicilios en Necoclí. Gestiona tus carreras o regístrate como conductor asociado.",
};

export default function TurismoLocalPage() {
  return (
    <div className="min-h-screen bg-sand flex flex-col items-center pt-24 pb-32">
      {/* Header Visual */}
      <div className="max-w-4xl w-full px-4 text-center mb-16">
        <span className="text-green font-bold tracking-widest uppercase text-sm mb-4 block">
          Neco-Dispatch
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-tropical font-bold text-ink mb-6">
          Turismo Local & Movilidad
        </h1>
        <p className="text-lg text-ink/70 max-w-2xl mx-auto">
          La primera red inteligente de transporte y domicilios en el Golfo de Urabá. 
          Conectamos a turistas y locales con mototaxis, motocarros y lanchas de manera 
          segura, rápida y justa.
        </p>
      </div>

      {/* Cards de Acceso */}
      <div className="max-w-5xl w-full px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Registro de Conductores */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-ink/5 hover:shadow-xl transition-all duration-300 flex flex-col group">
          <div className="h-14 w-14 bg-green/10 text-green rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
            🚀
          </div>
          <h2 className="text-2xl font-bold text-ink mb-3">Afíliate como Conductor</h2>
          <p className="text-ink/60 mb-8 flex-1 text-sm">
            ¿Tienes un motocarro, mototaxi o lancha? Únete a nuestra flota oficial, recibe carreras 
            directo en tu celular y aumenta tus ingresos diarios sin intermediarios físicos.
          </p>
          <Link 
            href="/conductores"
            className="w-full bg-green text-white text-center py-3 rounded-full font-bold hover:bg-green/90 transition-colors"
          >
            Registrarme Ahora
          </Link>
        </div>

        {/* Card 2: Dashboard del Conductor */}
        <div className="bg-ink rounded-3xl p-8 shadow-sm border border-white/10 hover:shadow-xl transition-all duration-300 flex flex-col group">
          <div className="h-14 w-14 bg-white/10 text-white rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
            🛺
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Tablero de Viajes</h2>
          <p className="text-white/60 mb-8 flex-1 text-sm">
            Acceso exclusivo para conductores activos. Revisa las carreras disponibles en tiempo real, 
            acepta servicios y gestiona tus ingresos diarios directamente desde tu pantalla.
          </p>
          <Link 
            href="/driver"
            className="w-full bg-white text-ink text-center py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
          >
            Abrir Tablero
          </Link>
        </div>

        {/* Card 3: Billetera y Recargas */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-ink/5 hover:shadow-xl transition-all duration-300 flex flex-col group relative overflow-hidden">
          {/* Badge Decorativo */}
          <div className="absolute top-0 right-0 bg-gold text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
            Wompi
          </div>
          
          <div className="h-14 w-14 bg-gold/10 text-gold rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
            💳
          </div>
          <h2 className="text-2xl font-bold text-ink mb-3">Tu Billetera Digital</h2>
          <p className="text-ink/60 mb-8 flex-1 text-sm">
            Administra tu saldo prepago, realiza recargas seguras vía Nequi, Bancolombia o PSE 
            para seguir recibiendo carreras, y consulta tu historial financiero.
          </p>
          <Link 
            href="/driver/billetera"
            className="w-full bg-gold text-white text-center py-3 rounded-full font-bold hover:bg-gold/90 transition-colors"
          >
            Recargar Saldo
          </Link>
        </div>

      </div>

      {/* Sección Informativa Adicional */}
      <div className="max-w-4xl w-full px-4 mt-24 text-center">
        <h3 className="text-2xl font-bold text-ink mb-4">¿Buscas transporte o domicilios?</h3>
        <p className="text-ink/60 mb-6">
          Si eres turista o local y necesitas solicitar un motocarro, un taxi o pedir un domicilio 
          de los mejores restaurantes, háblale directamente a nuestro guía virtual inteligente.
        </p>
        <ChatbotTriggerButton />
      </div>
    </div>
  );
}
