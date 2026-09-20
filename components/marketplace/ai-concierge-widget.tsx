"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Coffee, CheckCircle2 } from "lucide-react";
import { chatWithAlejandro, ChatMessage } from "@/lib/actions/ai";
import { submitConciergeRequest } from "@/lib/actions/concierge";
import Image from "next/image";

export function AiConciergeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      content: "¡Hola! Soy Alejandro, tu conserje de PasiaSano en Portal Necoclí. ¿En qué te puedo ayudar hoy? Te puedo asesorar con alojamientos espectaculares o llevarte compras y domicilios hasta la puerta de tu hotel.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Formulario explícito para la recolección de datos
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", request: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showForm]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Si el usuario da señales de querer hacer un pedido
    if (userMessage.toLowerCase().includes("solicitar") || userMessage.toLowerCase().includes("pedir") || userMessage.toLowerCase().includes("reservar")) {
      // setShowForm(true);
      // Podemos seguir chateando o mostrar el form. Dejamos que Alejandro lo maneje.
    }

    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await chatWithAlejandro(messages, userMessage);
      setMessages([...newMessages, { role: "model", content: response }]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "model", content: "Lo siento, tuve un problema de conexión. ¿Podemos intentar de nuevo?" },
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
        { role: "model", content: `¡Excelente ${formData.name}! Tu solicitud ha sido registrada y enviada a tu correo (${formData.email}). Nos pondremos en contacto pronto.` }
      ]);
      setTimeout(() => setShowForm(false), 3000);
    } else {
      setFormStatus("error");
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setIsOpen(true)}
              className="bg-emerald-600 text-white rounded-full p-4 shadow-2xl hover:bg-emerald-700 transition-colors flex items-center justify-center relative group"
            >
              <div className="absolute -top-10 -left-10 bg-white px-3 py-1 rounded-lg text-emerald-800 text-xs font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                ¡Habla con Alejandro!
              </div>
              {/* <MessageCircle className="w-6 h-6" /> */}
              <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                <Image src="https://res.cloudinary.com/dwxk79gt0/image/upload/v1754280672/logo_pasiasano_it6yh0.png" alt="PasiaSano" fill className="object-cover" />
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
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-[90vw] sm:w-[380px] h-[600px] max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 font-sans"
          >
            {/* Header */}
            <div className="bg-emerald-600 p-4 text-white flex items-center justify-between shadow-md relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white p-0.5">
                   <div className="relative w-full h-full rounded-full overflow-hidden">
                     <Image src="https://res.cloudinary.com/dwxk79gt0/image/upload/v1754280672/logo_pasiasano_it6yh0.png" alt="Alejandro" fill className="object-cover" />
                   </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Alejandro</h3>
                  <p className="text-xs text-emerald-100">Conserje PasiaSano</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="bg-emerald-700/50 hover:bg-emerald-700 text-white text-xs px-2 py-1.5 rounded flex items-center gap-1 transition-colors"
                  onClick={() => alert("Próximamente: Integración con Checkout Wompi para propinas.")}
                  title="Dar propina al Conserje"
                >
                  <Coffee className="w-3 h-3" />
                  <span>Propina</span>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-emerald-100 hover:text-white transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                      msg.role === "user"
                        ? "bg-emerald-600 text-white rounded-tr-sm"
                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-2xl bg-white text-gray-500 border border-gray-100 rounded-tl-sm flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
              
              {showForm && (
                <div className="bg-white border border-emerald-100 rounded-xl p-4 shadow-sm text-sm">
                  <h4 className="font-semibold text-emerald-800 mb-2">Completar Solicitud</h4>
                  <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
                    <input required type="text" placeholder="Nombre completo" className="w-full border rounded p-2 text-xs" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <input required type="email" placeholder="Correo electrónico" className="w-full border rounded p-2 text-xs" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    <input required type="tel" placeholder="Teléfono / WhatsApp" className="w-full border rounded p-2 text-xs" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    <textarea required placeholder="Detalle de tu solicitud o pedido" className="w-full border rounded p-2 text-xs min-h-[60px]" value={formData.request} onChange={e => setFormData({...formData, request: e.target.value})} />
                    <button type="submit" disabled={formStatus === "submitting" || formStatus === "success"} className="bg-emerald-600 text-white rounded py-2 text-xs font-medium hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2">
                      {formStatus === "submitting" ? "Enviando..." : formStatus === "success" ? <><CheckCircle2 className="w-4 h-4"/> ¡Enviado!</> : "Confirmar Solicitud"}
                    </button>
                  </form>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {!showForm && (
              <div className="p-3 bg-white border-t flex items-end gap-2 relative">
                <button 
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 bg-emerald-100 text-emerald-800 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm border border-emerald-200 hover:bg-emerald-200 transition-colors whitespace-nowrap"
                >
                  Generar Solicitud Oficial
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 max-h-32 min-h-[44px] bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none overflow-y-auto"
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-emerald-600 text-white rounded-xl p-2.5 h-[44px] w-[44px] flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
