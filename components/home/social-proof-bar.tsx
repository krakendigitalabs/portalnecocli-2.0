import { Anchor, CalendarCheck, ShieldCheck } from "lucide-react";

const metrics = [
  { icon: CalendarCheck, label: "+1.000 reservas este mes" },
  { icon: Anchor, label: "Aliado Oficial Transporte Marítimo Sol y Playa / El Caribe" },
  { icon: ShieldCheck, label: "Pago Seguro / Soporte 24/7" },
] as const;

export function SocialProofBar() {
  return (
    <section aria-label="Garantías y confianza" className="bg-green text-white">
      <ul className="mx-auto grid max-w-6xl gap-3 px-4 py-4 text-sm font-semibold sm:grid-cols-3 sm:gap-6 sm:px-6">
        {metrics.map(({ icon: Icon, label }) => (
          <li className="flex items-center justify-center gap-2 text-center" key={label}>
            <Icon aria-hidden className="h-5 w-5 shrink-0 text-gold" />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
