"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";

interface SwipeButtonProps {
  onConfirm: () => void;
  text: string;
  isPending?: boolean;
  theme?: "emerald" | "teal" | "coral" | "indigo" | "blue";
  disabled?: boolean;
}

export function SwipeButton({
  onConfirm,
  text,
  isPending,
  theme = "emerald",
  disabled = false,
}: SwipeButtonProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const x = useMotionValue(0);
  const controls = useAnimation();

  // Theme styling mapping
  const themes = {
    emerald: {
      bg: "bg-emerald-500",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      bgSoft: "bg-emerald-500/10",
    },
    teal: {
      bg: "bg-teal-500",
      text: "text-teal-400",
      border: "border-teal-500/30",
      bgSoft: "bg-teal-500/10",
    },
    coral: { bg: "bg-coral", text: "text-coral", border: "border-coral/30", bgSoft: "bg-coral/10" },
    indigo: {
      bg: "bg-indigo-500",
      text: "text-indigo-400",
      border: "border-indigo-500/30",
      bgSoft: "bg-indigo-500/10",
    },
    blue: {
      bg: "bg-blue-600",
      text: "text-blue-400",
      border: "border-blue-600/30",
      bgSoft: "bg-blue-600/10",
    },
  };

  const selectedTheme = themes[theme];
  const thumbWidth = 64; // 4rem (w-16)

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setContainerWidth(entry.contentRect.width);
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const handleDragEnd = (event: any, info: any) => {
    const dragThreshold = containerWidth - thumbWidth - 10; // 10px margin

    if (info.offset.x >= dragThreshold * 0.7) {
      // Trigger success
      controls.start({ x: containerWidth - thumbWidth - 8 }); // Snap to end
      setIsSuccess(true);
      onConfirm();
    } else {
      // Snap back
      controls.start({ x: 0, transition: { type: "spring", stiffness: 400, damping: 25 } });
    }
  };

  // Reset if pending turns false and we aren't successful anymore
  useEffect(() => {
    if (!isPending && isSuccess) {
      // In case we want to reset it (e.g. error happened)
      // Usually, components like RideCard will just unmount or re-render different buttons
    }
  }, [isPending, isSuccess]);

  const bgOpacity = useTransform(x, [0, containerWidth - thumbWidth], [0, 1]);
  const textOpacity = useTransform(x, [0, (containerWidth - thumbWidth) / 2], [1, 0]);

  return (
    <div
      ref={containerRef}
      className={`relative h-[68px] w-full rounded-[20px] overflow-hidden border-2 ${selectedTheme.border} ${selectedTheme.bgSoft} flex items-center justify-center ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <motion.div
        className={`absolute inset-0 origin-left ${selectedTheme.bg}`}
        style={{ opacity: bgOpacity }}
      />

      <motion.span
        style={{ opacity: textOpacity }}
        className={`z-10 font-black text-sm uppercase tracking-widest pl-10 ${isPending || isSuccess ? "text-white" : selectedTheme.text}`}
      >
        {isPending ? "Procesando..." : isSuccess ? "¡LISTO!" : text}
      </motion.span>

      <motion.div
        drag={isPending || isSuccess || disabled || containerWidth === 0 ? false : "x"}
        dragConstraints={{ left: 0, right: containerWidth ? containerWidth - thumbWidth - 8 : 0 }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        whileHover={!disabled && !isPending && !isSuccess ? { scale: 1.05 } : {}}
        whileTap={!disabled && !isPending && !isSuccess ? { scale: 0.95 } : {}}
        className={`absolute left-[4px] top-[4px] bottom-[4px] w-[56px] rounded-2xl flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing ${selectedTheme.bg} z-20`}
      >
        {isPending ? (
          <div className="w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
        ) : isSuccess ? (
          <span className="text-white text-xl">✅</span>
        ) : (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </motion.div>
    </div>
  );
}
