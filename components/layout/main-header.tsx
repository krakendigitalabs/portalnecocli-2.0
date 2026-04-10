import Link from "next/link";
import { Button } from "@/components/ui/button";
import { navigationLinks } from "@/lib/constants/site";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type MainHeaderProps = {
  announcement: string;
  brandName: string;
};

export function MainHeader({ announcement, brandName }: MainHeaderProps) {
  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <Container className="flex items-center justify-between gap-3 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-teal">
          <span>{announcement}</span>
          <span className="hidden sm:inline">Necoclí, Antioquia</span>
        </Container>
      </div>
      <Container className="mt-3">
        <Card className="rounded-[28px] px-4 py-4 md:px-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
                2.0
              </Badge>
            </div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
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
              <div className="flex items-center gap-3">
                <Badge className="hidden sm:inline-flex" variant="accent">
                  Portal 2.0
                </Badge>
                <Button href="/#businesses" size="md" variant="secondary">
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
