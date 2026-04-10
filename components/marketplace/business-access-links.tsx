import { cn } from "@/lib/utils/cn";
import type { FeaturedBusiness } from "@/types/featured-business";
import {
  createPhoneHref,
  createWhatsAppHref,
} from "@/lib/utils/business-links";

type BusinessAccessLinksProps = {
  business: FeaturedBusiness;
  className?: string;
};

export function BusinessAccessLinks({
  business,
  className,
}: BusinessAccessLinksProps) {
  const quickLinks = [
    {
      label: "Escribenos por WhatsApp",
      href: createWhatsAppHref(business.whatsapp),
      external: true,
    },
    {
      label: "Llamar ahora",
      href: createPhoneHref(business.phone),
      external: false,
    },
    {
      label: "Como llegar",
      href: business.mapLink,
      external: true,
    },
  ];

  return (
    <div
      aria-label={`Accesos rapidos para ${business.name}`}
      className={cn("flex flex-wrap gap-2", className)}
      role="group"
    >
      {quickLinks.map((link) => (
        <a
          key={link.label}
          className="inline-flex items-center rounded-full border border-ink/10 bg-white px-3 py-2 text-xs font-semibold text-ink/75 transition hover:border-teal/30 hover:text-teal"
          href={link.href}
          rel={link.external ? "noreferrer" : undefined}
          target={link.external ? "_blank" : undefined}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
