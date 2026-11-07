"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Coffee, Heart, MessageCircle, Send, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChatMessage, chatWithAlejandro } from "@/lib/actions/ai";
import { submitConciergeRequest } from "@/lib/actions/concierge";
import { useAuthSession } from "@/hooks/use-auth-session";
import { ConciergeNudge } from "@/components/marketplace/concierge-nudge";

export function AiConciergeWidget() {
  const { user } = useAuthSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isEngaged, setIsEngaged] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      content:
        "¡Hola! Soy Alejandro, guía local de Portal Necoclí. Conozco cada rincón de Necoclí. ¿Para qué fechas planeas tu viaje y qué tienes en mente?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Formulario explícito para la recolección de datos
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", request: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formType, setFormType] = useState<string>("general");

  // Estado para modal de propina
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState<string>("5000");

  const handleWompiPayment = () => {
    const amountInCents = parseInt(tipAmount) * 100;
    if (isNaN(amountInCents) || amountInCents <= 0) return;

    // Generar referencia única
    const reference = `PROPINA_ALEJANDRO_${Date.now()}`;
    // Usamos la llave pública de producción configurada en las variables de entorno
    const publicKey =
      process.env.NEXT_PUBLIC_WOMPI_KEY || "pub_prod_r6V49rlDfVKH0rp2VkIFEzqw0oVwwgmi";

    const wompiUrl = `https://checkout.wompi.co/p/?public-key=${publicKey}&currency=COP&amount-in-cents=${amountInCents}&reference=${reference}&redirect-url=https://portalnecocli.com`;

    window.open(wompiUrl, "_blank");
    setShowTipModal(false);
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showForm]);

  const handleSend = async (messageOverride?: string) => {
    const userMessage = (typeof messageOverride === "string" ? messageOverride : input).trim();
    if (!userMessage || isLoading) return;

    if (!messageOverride) setInput("");

    // Si el usuario da señales de querer hacer un pedido
    if (
      userMessage.toLowerCase().includes("solicitar") ||
      userMessage.toLowerCase().includes("pedir") ||
      userMessage.toLowerCase().includes("reservar")
    ) {
      // setShowForm(true);
      // Podemos seguir chateando o mostrar el form. Dejamos que Alejandro lo maneje.
    }

    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await chatWithAlejandro(messages, userMessage, user?.uid);
      setMessages([...newMessages, { role: "model", content: response }]);
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          role: "model",
          content: "Lo siento, tuve un problema de conexión. ¿Podemos intentar de nuevo?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    const result = await submitConciergeRequest(formData);
    if (result.success) {
      setFormStatus("success");
      setMessages([
        ...messages,
        {
          role: "model",
          content: `¡Excelente ${formData.name}! Tu solicitud ha sido registrada y enviada a tu correo (${formData.email}). Nos pondremos en contacto pronto.`,
        },
      ]);
      setTimeout(() => setShowForm(false), 3000);
    } else {
      setFormStatus("error");
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <div
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[9000]"
        onMouseEnter={() => setIsEngaged(true)}
        onMouseLeave={() => setIsEngaged(false)}
        onFocus={() => setIsEngaged(true)}
        onBlur={() => setIsEngaged(false)}
      >
        {!isOpen && <ConciergeNudge engaged={isEngaged} />}
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0, y: 50 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: [0, -12, 0],
                rotate: [0, -5, 5, -5, 0],
              }}
              transition={{
                y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 },
                scale: { duration: 0.3 },
                opacity: { duration: 0.3 },
              }}
              exit={{ scale: 0, opacity: 0, y: 50 }}
              onClick={() => setIsOpen(true)}
              className="bg-emerald-600 text-white rounded-full p-4 shadow-2xl hover:bg-emerald-700 hover:scale-110 transition-all flex items-center justify-center relative"
              aria-label="Abrir chat con la guía local"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                <Image
                  src="https://res.cloudinary.com/dwxk79gt0/image/upload/v1754280672/logo_pasiasano_it6yh0.png"
                  alt="Alejandro"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Ventana de Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 sm:inset-auto sm:bottom-8 sm:right-8 z-[9999] w-full sm:w-[380px] h-[100dvh] sm:h-[600px] sm:max-h-[85vh] bg-gradient-to-b from-gray-50 to-emerald-50/20 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 font-sans"
          >
            {/* Header */}
            <div className="bg-emerald-600 p-4 text-white flex items-center justify-between shadow-md relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-white p-0.5 shadow-sm">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-emerald-50">
                    <Image
                      src="https://res.cloudinary.com/dwxk79gt0/image/upload/v1754280672/logo_pasiasano_it6yh0.png"
                      alt="Alejandro"
                      fill
                      className="object-cover scale-110"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-wide">Alejandro</h3>
                  <p className="text-xs text-emerald-100 font-medium">Guía Local</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse border border-red-400"
                  onClick={() => setShowTipModal(true)}
                  title="Dar propina al Conserje"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span className="font-bold hidden sm:inline">Propina</span>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-emerald-100 hover:text-white transition-colors p-2 -mr-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal de Propina */}
            <AnimatePresence>
              {showTipModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white w-full max-w-sm rounded-xl p-5 shadow-2xl relative"
                  >
                    <button
                      onClick={() => setShowTipModal(false)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="text-center mb-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-600">
                        <Coffee className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900">
                        Invítale un café a Alejandro
                      </h3>
                      <p className="text-sm text-gray-500">
                        Apoya a tu guía local voluntariamente.
                      </p>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ¿Cuánto deseas aportar? (COP)
                      </label>
                      <input
                        type="number"
                        value={tipAmount}
                        onChange={(e) => setTipAmount(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-semibold text-lg text-gray-900"
                        placeholder="Ej: 5000"
                      />
                      <div className="flex gap-2 mt-2">
                        {[5000, 10000, 20000].map((amt) => (
                          <button
                            key={amt}
                            onClick={() => setTipAmount(amt.toString())}
                            className={`flex-1 py-1 text-xs font-medium rounded border transition-colors ${tipAmount === amt.toString() ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}
                          >
                            ${amt / 1000}k
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleWompiPayment}
                      className="w-full bg-[#2733d1] hover:bg-[#1a239b] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      Pagar con Wompi
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scroll-smooth">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 text-sm shadow-md whitespace-pre-wrap leading-snug ${
                      msg.role === "user"
                        ? "bg-emerald-600 text-white rounded-2xl rounded-tr-sm shadow-emerald-500/20"
                        : "bg-white text-gray-800 border border-gray-100/60 rounded-2xl rounded-tl-sm shadow-black/5"
                    }`}
                  >
                    {msg.content
                      .split(/(\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s]+)/g)
                      .map((part, i) => {
                        const mdMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                        if (mdMatch) {
                          return (
                            <a
                              key={i}
                              href={mdMatch[2]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline font-semibold"
                            >
                              {mdMatch[1]}
                            </a>
                          );
                        }
                        if (part.match(/^(https?:\/\/[^\s]+)$/)) {
                          return (
                            <a
                              key={i}
                              href={part}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline break-all"
                            >
                              {part}
                            </a>
                          );
                        }
                        return <span key={i}>{part}</span>;
                      })}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] px-4 py-3 bg-white border border-gray-100/60 rounded-2xl rounded-tl-sm shadow-md shadow-black/5 flex gap-1.5 items-center h-10">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}

              {showForm && (
                <div className="bg-white border border-emerald-100 rounded-xl p-4 shadow-sm text-sm relative mt-2">
                  <button
                    onClick={() => setShowForm(false)}
                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <h4 className="font-semibold text-emerald-800 mb-2 pr-6">
                    {formType === "hotel" && "Reserva de Hotel"}
                    {formType === "domicilio" && "Solicitud de Domicilio"}
                    {formType === "paquete" && "Armar Paquete Turístico"}
                    {formType === "tour" && "Tour de Islas"}
                    {formType === "transporte" && "Solicitud de Transporte"}
                    {formType === "general" && "Completar Solicitud"}
                  </h4>
                  <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
                    <input
                      required
                      type="text"
                      placeholder="Nombre completo"
                      className="w-full border rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500/50 outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                      required
                      type="email"
                      placeholder="Correo electrónico"
                      className="w-full border rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500/50 outline-none"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Teléfono / WhatsApp"
                      className="w-full border rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500/50 outline-none"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <textarea
                      required
                      placeholder="Detalle de tu solicitud o pedido"
                      className="w-full border rounded-lg p-2.5 text-xs min-h-[60px] focus:ring-2 focus:ring-emerald-500/50 outline-none resize-none"
                      value={formData.request}
                      onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                    />
                    <button
                      type="submit"
                      disabled={formStatus === "submitting" || formStatus === "success"}
                      className="bg-emerald-600 text-white rounded-lg py-2.5 mt-1 text-xs font-semibold hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2"
                    >
                      {formStatus === "submitting" ? (
                        "Enviando..."
                      ) : formStatus === "success" ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> ¡Enviado!
                        </>
                      ) : (
                        "Confirmar Solicitud"
                      )}
                    </button>
                  </form>
                </div>
              )}

              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input Area (Dock) */}
            {!showForm && (
              <div className="bg-white/80 backdrop-blur-md border-t border-gray-100 flex flex-col shrink-0">
                {/* Chips flotantes internos */}
                <div className="flex items-center gap-2 px-3 pt-3 overflow-x-auto snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <a
                    href="/customer/pedir"
                    className="snap-start shrink-0 bg-indigo-50 text-indigo-700 text-xs px-4 py-2 rounded-full font-semibold border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span className="text-sm">🛺</span> Pedir Vehículo
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setFormType("general");
                      setShowForm(true);
                    }}
                    className="snap-start shrink-0 bg-emerald-50 text-emerald-700 text-xs px-4 py-2 rounded-full font-semibold border border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200 transition-all shadow-sm flex items-center gap-1.5 animate-pulse"
                  >
                    <span className="text-sm">📝</span> Otras Solicitudes
                  </button>
                </div>

                <div className="p-3 flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 max-h-32 min-h-[44px] bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none overflow-y-auto shadow-inner"
                    rows={1}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="bg-emerald-600 text-white rounded-full p-2 h-[44px] w-[44px] flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shrink-0 active:scale-95"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
