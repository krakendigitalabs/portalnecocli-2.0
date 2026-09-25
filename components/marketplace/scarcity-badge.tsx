"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useEffect, useState } from "react";

export function ScarcityBadge() {
  const [viewers, setViewers] = useState(12);

  useEffect(() => {
    // Simulate real-time people looking at this route to create urgency
    const interval = setInterval(() => {
      setViewers((prev) => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const newVal = prev + change;
        return newVal > 8 ? (newVal < 25 ? newVal : 25) : 8; // keep between 8 and 25
      });
    }, 15000); // every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewers}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        className="inline-flex items-center gap-2 bg-rose-50 text-rose-700 px-4 py-2 rounded-full text-sm font-bold border border-rose-200 shadow-sm animate-pulse"
      >
        <Flame className="w-4 h-4 fill-rose-500 text-rose-500" />🔥 Gran demanda: {viewers} personas
        están cotizando esta ruta
      </motion.div>
    </AnimatePresence>
  );
}
