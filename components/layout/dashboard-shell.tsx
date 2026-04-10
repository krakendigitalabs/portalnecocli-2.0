import { Container } from "@/components/ui/container";
import { SurfaceCard } from "@/components/ui/surface-card";

type DashboardShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function DashboardShell({
  eyebrow,
  title,
  description,
  children,
}: DashboardShellProps) {
  return (
    <Container className="space-y-8 pb-12 pt-8">
      <SurfaceCard className="rounded-[32px] p-8 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-ink/72">
          {description}
        </p>
      </SurfaceCard>
      {children}
    </Container>
  );
}
