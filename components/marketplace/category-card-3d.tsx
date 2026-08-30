"use client";

import Link from "next/link";
import type { Category } from "@/types/category";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CategoryCard3D({ category }: { category: Category }) {
  // Físicas de Parallax y Tilt de Framer Motion
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const content = (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative h-[450px] lg:h-[550px] w-full rounded-[40px] border border-ink/5 bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl shadow-2xl p-8 lg:p-12 transition-colors hover:border-gold/40 group cursor-pointer overflow-hidden"
    >
      {/* Capa de Contenido HTML (Al frente) */}
      <div className="relative z-10 flex flex-col h-full justify-end" style={{ transform: "translateZ(80px)" }}>
        
        <div className="mt-auto">
          <h3 className="text-[2.5rem] sm:text-5xl lg:text-7xl font-bold text-ink group-hover:text-green transition-colors drop-shadow-md tracking-tighter leading-[0.9] mb-4 lg:mb-6 w-full break-words">
            {category.label}
          </h3>
          <p className="text-base lg:text-xl leading-relaxed text-ink/80 max-w-sm drop-shadow-sm font-medium">
            {category.description}
          </p>
          
          {category.metric ? (
            <div className="mt-8 lg:mt-12 flex items-center justify-between">
              <p className="text-sm lg:text-base font-bold uppercase tracking-[0.25em] text-green bg-green/10 px-5 py-2.5 rounded-full shadow-inner border border-green/10">
                {category.metric}
              </p>
              <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-green transition-all">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );

  if (category.href) {
    return <Link href={category.href} className="block w-full" style={{ perspective: 1200 }}>{content}</Link>;
  }

  return <div className="block w-full" style={{ perspective: 1200 }}>{content}</div>;
}
