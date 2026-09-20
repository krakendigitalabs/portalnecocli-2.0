"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { navigationLinks } from "@/lib/constants/site";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="xl:hidden flex items-center">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-ink hover:text-green transition-colors"
        aria-label="Abrir menú"
      >
        <Menu className="w-8 h-8" />
      </button>

      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 bg-ink/60 z-[200] backdrop-blur-sm"
                />
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 h-[100dvh] w-[85%] max-w-[400px] bg-sand z-[201] shadow-2xl flex flex-col"
                >
                  <div className="flex justify-end p-4 border-b border-ink/5">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 text-ink hover:text-green transition-colors bg-white rounded-full shadow-sm"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-6 px-6 py-8 overflow-y-auto h-full">
                    <div className="flex justify-center mb-6">
                      <img
                        src="https://res.cloudinary.com/dr50ioh9h/image/upload/v1746587440/Dise%C3%B1o_sin_t%C3%ADtulo_pvwjh9.png"
                        alt="Logo Portal Necocli"
                        className="h-16 w-auto object-contain drop-shadow-md"
                      />
                    </div>

                    <nav className="flex flex-col gap-6 items-center w-full">
                      {navigationLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="w-full text-center py-3 text-xl font-tropical font-bold text-ink/80 hover:text-green hover:bg-white/50 rounded-xl transition-all uppercase tracking-widest"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>

                    <div className="mt-auto pt-8 flex flex-col gap-4">
                      <Button
                        className="w-full bg-green text-white hover:bg-green/90 shadow-md rounded-full h-12 text-sm font-bold"
                        href="https://wa.me/573217511866?text=Hola,%20estoy%20interesado%20en%20vincular%20mi%20comercio%20a%20Portal%20Necocl%C3%AD."
                      >
                        Afiliar Comercio
                      </Button>
                      {/* <Button
                        className="w-full bg-gold hover:bg-gold/90 text-white shadow-md rounded-full h-12 text-sm font-bold tracking-wide"
                        href="/tarifario"
                      >
                        Cotizar Plan
                      </Button> */}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
