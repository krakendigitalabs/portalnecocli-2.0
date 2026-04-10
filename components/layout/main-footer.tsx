import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type MainFooterProps = {
  brandName: string;
};

export function MainFooter({ brandName }: MainFooterProps) {
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
              <p>Base de producción en construcción</p>
              <p>Diseño mobile-first y modular</p>
            </div>
          </div>
        </Card>
      </Container>
    </footer>
  );
}
