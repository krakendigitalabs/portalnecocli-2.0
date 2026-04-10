import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { navigationLinks } from "@/lib/constants/site";

type MainHeaderProps = {
  announcement: string;
  brandName: string;
};

const reservationHref =
  "https://wa.me/573217511866?text=%C2%A1Hola!%20Quiero%20reservar%20mi%20experiencia%20en%20Necocl%C3%AD.";
const affiliateHref =
  "https://wa.me/573217511866?text=Hola,%20estoy%20interesado%20en%20vincular%20mi%20comercio%20a%20Portal%20Necocl%C3%AD.";

export function MainHeader({ announcement, brandName }: MainHeaderProps) {
  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-white/60 bg-white/72 backdrop-blur-xl">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-teal">
          <span>{announcement}</span>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Necoclí, Antioquia</span>
            <Link
              className="text-coral transition hover:text-coral/80"
              href="/negocios"
            >
              Explora negocios
            </Link>
          </div>
        </Container>
      </div>
      <Container className="mt-3">
        <Card className="rounded-[30px] border-white/60 bg-white/82 px-4 py-4 shadow-soft backdrop-blur-xl md:px-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-coral">
                  Portal
                </span>
                <span className="text-lg font-semibold text-ink">
                  {brandName}
                </span>
              </Link>
              <Badge className="sm:hidden" variant="accent">
                Turismo + negocios
              </Badge>
            </div>

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
              <nav className="flex flex-wrap items-center gap-4 md:gap-6">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-ink/80 transition hover:text-teal"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap xl:items-center">
                <Badge className="hidden sm:inline-flex" variant="accent">
                  Directorio premium
                </Badge>
                <Button href="/negocios" size="md" variant="primary">
                  Ver negocios
                </Button>
                <Button href={reservationHref} size="md" variant="accent">
                  Reservar ahora
                </Button>
                <Button href={affiliateHref} size="md" variant="secondary">
                  Afiliar mi negocio
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </header>
  );
}
