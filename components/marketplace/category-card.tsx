"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types/category";
import { motion } from "framer-motion";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full rounded-[32px] border-ink/10 p-8 lg:p-10 transition-colors hover:shadow-2xl hover:border-gold/50 bg-white/60 backdrop-blur-sm">
        <Badge variant="accent" className="px-4 py-1.5 text-sm">{category.shortLabel}</Badge>
        <h3 className="mt-6 text-2xl lg:text-3xl font-semibold text-ink group-hover:text-green transition-colors">{category.label}</h3>
        <p className="mt-4 text-base lg:text-lg leading-relaxed text-ink/75">
          {category.description}
        </p>
        {category.metric ? (
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-green">
            {category.metric}
          </p>
        ) : null}
      </Card>
    </motion.div>
  );

  if (category.href) {
    return <Link href={category.href} className="group h-full block">{content}</Link>;
  }

  return <div className="group h-full">{content}</div>;
}
