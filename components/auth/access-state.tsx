import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";

type AccessStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  nextPath?: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function AccessState({
  eyebrow,
  title,
  description,
  nextPath,
  primaryHref,
  primaryLabel,
  secondaryHref = "/",
  secondaryLabel = "Volver al portal",
}: AccessStateProps) {
  return (
    <div className="space-y-6 pb-14 pt-6 md:space-y-8 md:pt-10">
      <SurfaceCard className="rounded-[30px] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-ink/72">
          {description}
        </p>
        {nextPath ? (
          <p className="mt-4 text-sm leading-7 text-ink/62">
            Ruta solicitada: {nextPath}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button href={primaryHref} size="lg">
            {primaryLabel}
          </Button>
          <Button href={secondaryHref} size="lg" variant="secondary">
            {secondaryLabel}
          </Button>
        </div>
      </SurfaceCard>
    </div>
  );
}
