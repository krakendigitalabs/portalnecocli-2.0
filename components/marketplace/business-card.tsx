"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Business } from "@/types/business";

type BusinessCardProps = {
  business: Business;
};

export function BusinessCard({ business }: BusinessCardProps) {
  const statusLabel = business.status === "active" ? "Activo" : "Borrador";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-full"
    >
      <Link href={`/negocios/${business.id}`} className="group h-full block">
        <Card className="h-full rounded-[30px] border-ink/10 p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-gold/30">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
                {business.categoryLabel}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-ink group-hover:text-green">
                {business.name}
              </h3>
            </div>
            <Badge variant={business.status === "active" ? "teal" : "neutral"}>{statusLabel}</Badge>
          </div>
          <p className="mt-4 text-sm leading-6 text-ink/70">{business.summary}</p>
          <div className="mt-6 flex items-center justify-between text-sm text-ink/65">
            <span>{business.location}</span>
            <span className="font-semibold text-green">{business.priceRange}</span>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
