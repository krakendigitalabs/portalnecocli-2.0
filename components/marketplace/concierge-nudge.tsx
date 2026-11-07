"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const NUDGE_PHRASES = [
  "¿Dónde alojarte? Hotel, casa hotel o cabaña 🏝️",
  "¿Paseo en catamarán o yate? ⛵",
  "¿Cuatrimotos o tours de aventura? 🏍️",
  "¿A la carta o corrientazo? 🍽️",
  "¿Quieres ponerte bonita? Belleza y spa 💅",
  "¿Víveres a domicilio? Te los llevamos 🛵",
  "Pregúntame lo que quieras 😉",
];

const PHRASE_INTERVAL_MS = 3200;
const IDLE_HINT_DELAY_MS = 9000;
const IDLE_HINT_DURATION_MS = 7000;
const SEEN_STORAGE_KEY = "concierge-nudge-seen";

interface ConciergeNudgeProps {
  /** Hover o foco del usuario sobre el botón. */
  engaged: boolean;
}

/**
 * Globo de sugerencias sobre el botón del concierge.
 * Aparece al interactuar y, una sola vez por sesión, como recordatorio sutil.
 */
export function ConciergeNudge({ engaged }: ConciergeNudgeProps) {
  const reduceMotion = useReducedMotion();
  const [hintVisible, setHintVisible] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const visible = engaged || hintVisible;

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_STORAGE_KEY)) return;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    const showTimer = setTimeout(() => {
      sessionStorage.setItem(SEEN_STORAGE_KEY, "1");
      setHintVisible(true);
      hideTimer = setTimeout(() => setHintVisible(false), IDLE_HINT_DURATION_MS);
    }, IDLE_HINT_DELAY_MS);
    return () => {
      clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(
      () => setPhraseIndex((current) => (current + 1) % NUDGE_PHRASES.length),
      PHRASE_INTERVAL_MS,
    );
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.9 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.9 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="pointer-events-none absolute bottom-full right-0 mb-3 w-max max-w-[220px] origin-bottom-right rounded-2xl rounded-br-sm bg-white px-4 py-2.5 text-xs font-semibold leading-snug text-emerald-900 shadow-xl ring-1 ring-emerald-100 sm:max-w-[260px] sm:text-sm"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={phraseIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="block"
            >
              {NUDGE_PHRASES[phraseIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
