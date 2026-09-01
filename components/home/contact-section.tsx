import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import type { CommercialHomeContent } from "@/types/commercial-content";

type ContactSectionProps = {
  content: CommercialHomeContent["contactSection"];
};

export function ContactSection({ content }: ContactSectionProps) {
  return (
    <section id="contact" className="scroll-mt-32 space-y-6">
      <SectionHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[30px] border-ink/10 p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            {content.contactItems.map((item) => (
              <div key={item.label} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    className="text-base leading-7 text-ink/78 transition hover:text-teal"
                    href={item.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-base leading-7 text-ink/78">{item.value}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
        <Card className="rounded-[30px] border-ink/10 p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
            Redes activas
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {content.socialLinks.map((link) => (
              <a
                key={link.label}
                className="inline-flex items-center rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-teal/30 hover:text-teal"
                href={link.href}
                rel="noreferrer"
                target="_blank"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-8 space-y-3">
            <Badge variant="teal">Atención comercial y turística</Badge>
            <p className="text-sm leading-7 text-ink/70">
              El nuevo portal toma la información central del sitio actual y la organiza en bloques
              listos para crecer hacia directorio, reservas, roles y operaciones reales.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
