"use client";

import { motion } from "framer-motion";
import { Info, Check, Clock, Anchor, MapPin, AlertCircle, Package, Shield, Navigation } from "lucide-react";

export function DiaDeSolInfo({ operator = "sol_playa" }: { operator?: "caribe" | "sol_playa" }) {
  const scrollToBooking = () => {
    const element = document.getElementById("booking-widget");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Podemos disparar un evento custom para cambiar la pestaña a "sol"
      window.dispatchEvent(new CustomEvent('change-booking-tab', { detail: 'sol' }));
    }
  };

  return (
    <div className="w-full mt-16 space-y-12 mb-20">
      {/* ── MAIN BANNER ── */}
      <div className="bg-[#fffdf2] border border-[#fef0ba] rounded-[2rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
        {/* Decoraciones de fondo */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#fef0ba] rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#fde047] rounded-full mix-blend-multiply filter blur-3xl opacity-30" />

        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          
          {/* Info Izquierda */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#fef0ba] text-yellow-900 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
              <span>🌞</span> Experiencia destacada
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-[#0f2e21] tracking-tight font-serif">
              Día de Sol
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-md">
              {operator === "caribe"
                ? "Vive una experiencia turística ideal para disfrutar con familia o amigos. El plan incluye transporte ida y regreso, refrigerio, almuerzo, guía turístico y póliza de viaje."
                : "Nuestro plan incluye transporte marítimo ida y regreso, visita a tres playas, alimentación, guía acompañante, póliza de seguro y servicio de parqueadero incluido."}
            </p>
            
            <div className="inline-flex items-center gap-3 bg-[#fbbf24] text-[#78350f] px-6 py-3 rounded-full text-xl font-bold shadow-md">
              <span>💰</span> $210.000 por persona
            </div>
            
            <p className="text-sm font-semibold text-[#854d0e]">
              Pagan a partir de los 2 años. Tasas portuarias no incluidas.
            </p>

            <button 
              onClick={scrollToBooking}
              className="mt-4 bg-[#22c55e] hover:bg-[#16a34a] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-green-500/30 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              Consultar Día de Sol
            </button>
          </div>

          {/* Grid Derecha */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {(operator === "caribe"
              ? [
                  { text: "Transporte ida y vuelta", icon: "🛥️" },
                  { text: "Refrigerio incluido", icon: "🥤" },
                  { text: "Almuerzo incluido", icon: "🍽️" },
                  { text: "Guía turístico", icon: "🧭" },
                  { text: "Póliza de viaje", icon: "🛡️" },
                  { text: "Día de naturaleza", icon: "🌴" }
                ]
              : [
                  { text: "Transporte ida y regreso", icon: "🛥️" },
                  { text: "Sapzurro", icon: "✅" },
                  { text: "La Miel - Panamá", icon: "✅" },
                  { text: "Playa Soledad", icon: "✅" },
                  { text: "2 refrigerios", icon: "🥤" },
                  { text: "Almuerzo típico", icon: "🍽️" },
                  { text: "Póliza de seguro", icon: "🛡️" },
                  { text: "Parqueadero gratis", icon: "🅿️" }
                ]
            ).map((feature, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="bg-white p-4 rounded-2xl border border-yellow-100 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow"
              >
                <span className="text-xl">{feature.icon}</span>
                <span className="text-sm font-bold text-gray-800 leading-tight">{feature.text}</span>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* ── HORARIOS ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white border border-sky-100 rounded-[2rem] p-8 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center"
      >
        <div className="bg-sky-50 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0">
          <span className="text-3xl">⏰</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[#0f2e21] mb-2 font-serif">Horarios Día de Sol</h3>
          {operator === "caribe" ? (
            <p className="text-gray-600 leading-relaxed">
              <strong>Salidas:</strong> Salidas diarias a las 8:00 a.m. Regresos con hora por confirmar según operación, clima, ocupación y condiciones marítimas.
            </p>
          ) : (
            <p className="text-gray-600 leading-relaxed">
              <strong>Check-in:</strong> 6:00 a.m. · <strong>Salida:</strong> 7:00 a.m. · <strong>Regreso:</strong> 4:00 p.m. aproximadamente, variable según clima y restricciones de DIMAR.
            </p>
          )}
          <p className="text-gray-500 text-sm mt-2">
            Si tú o alguien de tu grupo no come pescado, informa con anticipación para cambiarlo por pollo o carne.
          </p>
        </div>
      </motion.div>

      {/* ── COSTOS ADICIONALES ── */}
      <div className="space-y-6 pt-6">
        <div>
          <h3 className="text-3xl font-bold text-[#0f2e21] mb-2 flex items-center gap-2 font-serif">
            <span className="text-rose-500">📌</span> Costos adicionales
          </h3>
          <p className="text-gray-500 text-lg">
            Estos valores son pagos externos o adicionales que pueden aplicar según destino y condiciones del recorrido.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Impuesto portuario", icon: "🏛️", desc: "Impuesto portuario en Necoclí de $5.000, pagado a funcionario de la alcaldía municipal." },
            { title: "Playa Soledad", icon: "🌴", desc: "Costo adicional de $3.000 para acceder a Playa Soledad." },
            { title: "La Miel, Panamá", icon: "🇵🇦", desc: "Costo adicional de $4.000 para acceder a La Miel, Panamá." }
          ].map((cost, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <h4 className="text-xl font-bold text-[#0f2e21] mb-3 flex items-center gap-2">
                <span>{cost.icon}</span> {cost.title}
              </h4>
              <p className="text-gray-600 leading-relaxed text-sm">
                {cost.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── CÓMO HACER EFECTIVA TU RESERVA ── */}
      <div className="space-y-6 pt-6">
        <div>
          <h3 className="text-3xl font-bold text-[#0f2e21] mb-2 flex items-center gap-2 font-serif">
            <span className="text-rose-500">📌</span> Cómo hacer efectiva tu reserva
          </h3>
          <p className="text-gray-500 text-lg">
            Genera tu pre-reserva gratis y asegura tu cupo en la embarcación.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <h4 className="text-xl font-bold text-[#0f2e21] mb-4">
              Datos requeridos
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#22c55e]" /> Nombres completos de los pasajeros</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#22c55e]" /> Número de documento de identidad</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#22c55e]" /> Fecha del viaje</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#22c55e]" /> Número de contacto de la persona responsable</li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-yellow-50/50 border border-yellow-200 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <h4 className="text-xl font-bold text-yellow-900 mb-4">
              Pago presencial en Taquilla
            </h4>
            <p className="text-sm text-yellow-800 leading-relaxed mb-3">
              Para garantizar tu seguridad y la de tu dinero, no exigimos transferencias bancarias anticipadas. 
            </p>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li className="flex items-center gap-2"><strong>1.</strong> Genera el tiquete digital aquí en el portal.</li>
              <li className="flex items-center gap-2"><strong>2.</strong> Preséntate en la taquilla 45 mins antes.</li>
              <li className="flex items-center gap-2"><strong>3.</strong> Realiza el pago físico y aborda seguro.</li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* ── INFORMACIÓN IMPORTANTE ── */}
      <div className="space-y-6 pt-6">
        <div>
          <h3 className="text-3xl font-bold text-[#0f2e21] mb-2 font-serif">
            Información importante antes de viajar
          </h3>
          <p className="text-gray-500 text-lg">
            Todo lo que debes saber para embarcar sin contratiempos.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Normas a bordo", icon: "🚫", desc: "Uso obligatorio de chaleco salvavidas, prohibido fumar dentro o cerca del bote y seguir las instrucciones de la tripulación." },
            { title: "Pet Friendly", icon: "🐾", desc: "Tus mascotas son bienvenidas a bordo. Deben portar carnet, bozal o guacal según corresponda." },
            { title: "Encomiendas", icon: "📦", desc: "Empaca y sella bien tu envío, cancela el costo en origen y presenta la guía para reclamar." }
          ].map((info, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-sky-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl">
                {info.icon}
              </div>
              <h4 className="text-xl font-bold text-[#0f2e21] mb-3">
                {info.title}
              </h4>
              <p className="text-gray-600 leading-relaxed text-sm">
                {info.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── UBICACIÓN Y CONTACTO ── */}
      <div className="grid md:grid-cols-2 gap-6 pt-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm flex gap-4 hover:shadow-md transition-shadow"
        >
          <div className="text-rose-500 mt-1">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-[#0f2e21] mb-1">
              Ubicación
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Muelle Turístico<br />
              Necoclí, Antioquia
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm flex gap-4 hover:shadow-md transition-shadow"
        >
          <div className="text-rose-500 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <div>
            <h4 className="text-xl font-bold text-[#0f2e21] mb-1">
              Contacto
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              WhatsApp: +57 321 7511866<br />
              Atención para reservas, rutas, horarios, ubicación y recomendaciones.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
