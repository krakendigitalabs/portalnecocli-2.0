import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Regístrate como Conductor | Portal Necoclí",
  description:
    "Únete a la red de conductores aliados de Portal Necoclí. Recibe solicitudes de turistas y locales directamente en tu celular. Mototaxi, motocarro, taxi o lancha.",
};

export default function ConductoresPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sand/30 to-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4 text-center bg-ink">
        <div className="absolute inset-0 bg-gradient-to-br from-teal/20 via-transparent to-gold/10" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-block text-5xl mb-4">🛺</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Gana más con cada carrera
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto mb-8 leading-relaxed">
            Regístrate como conductor aliado de Portal Necoclí. Recibe solicitudes de turistas y
            locales directamente en tu celular. Tú decides cuándo trabajar.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/10">
              🌊 Clientes que llegan solos
            </span>
            <span className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/10">
              💰 Tu plata al instante
            </span>
            <span className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/10">
              📱 Desde tu celular
            </span>
            <span className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/10">
              ⭐ Reputación que crece
            </span>
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-ink text-center mb-10">¿Cómo funciona?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-14 h-14 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
              📝
            </div>
            <h3 className="font-bold text-ink mb-1">1. Te registras</h3>
            <p className="text-sm text-ink/60">
              Llenas este formulario con tus datos y tipo de vehículo. Nosotros verificamos.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
              📲
            </div>
            <h3 className="font-bold text-ink mb-1">2. Recibes carreras</h3>
            <p className="text-sm text-ink/60">
              Los turistas piden transporte y tú ves las carreras disponibles en tu tablero.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
              💵
            </div>
            <h3 className="font-bold text-ink mb-1">3. Cobras directo</h3>
            <p className="text-sm text-ink/60">
              El cliente te paga a ti en efectivo o Nequi. Tú te quedas con tu plata al instante.
            </p>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="pb-24 px-4 text-center">
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl shadow-ink/5 border border-ink/5 p-10">
          <h2 className="text-2xl font-bold text-ink mb-4">¿Listo para unirte?</h2>
          <p className="text-ink/60 mb-8">
            Necesitas crear una cuenta o iniciar sesión para poder registrar tu vehículo.
          </p>
          <Link
            href="/conductores/registro"
            className="inline-block w-full sm:w-auto px-8 py-4 bg-teal text-white font-bold text-lg rounded-2xl hover:bg-teal/90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-teal/25"
          >
            Iniciar sesión y Registrarme 🚀
          </Link>
        </div>
      </section>
    </main>
  );
}
