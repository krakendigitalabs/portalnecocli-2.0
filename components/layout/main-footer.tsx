import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCommercialHomeContent } from "@/lib/content/commercial-home";

type MainFooterProps = {
  brandName: string;
};

export async function MainFooter({ brandName }: MainFooterProps) {
  const commercialHomeContent = await getCommercialHomeContent();
  const { contactItems, socialLinks } = commercialHomeContent.contactSection;
  const whatsappItem = contactItems.find((item) => item.label === "WhatsApp");
  const emailItem = contactItems.find(
    (item) => item.label === "Correo principal",
  );

  return (
    <footer className="py-10 md:py-14">
      <Container>
        <Card className="rounded-[32px] border-ink/10 bg-ink px-6 py-8 text-white md:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-4">
              <Badge className="bg-white/12 text-white" variant="neutral">
                Portal Necoclí 2.0
              </Badge>
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Base visual premium lista para seguir creciendo por fases.
                </h2>
                <p className="text-sm leading-7 text-white/72 md:text-base">
                  {brandName} conecta hotelería, turismo, alimentos, transporte
                  turístico y domicilios con una arquitectura limpia y
                  comercial.
                </p>
              </div>
            </div>
            <div className="grid gap-2 text-sm text-white/72">
              <p>Necoclí, Antioquia</p>
              {whatsappItem ? <p>WhatsApp: {whatsappItem.value}</p> : null}
              {emailItem ? <p>{emailItem.value}</p> : null}
              <div className="flex flex-wrap gap-2 pt-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    className="text-white/72 transition hover:text-white"
                    href={link.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </footer>
  );
}
