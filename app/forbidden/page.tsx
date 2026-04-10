import type { Metadata } from "next";
import { AccessState } from "@/components/auth/access-state";

export const metadata: Metadata = {
  title: "Acceso denegado | Portal Necoclí 2.0",
  description:
    "Tu cuenta no tiene permisos suficientes para consultar este recurso.",
};

type ForbiddenPageProps = {
  searchParams?: Promise<{
    next?: string;
  }>;
};

export default async function ForbiddenPage({
  searchParams,
}: ForbiddenPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const nextPath =
    resolvedSearchParams?.next?.startsWith("/")
      ? resolvedSearchParams.next
      : "/merchant";

  return (
    <AccessState
      description="La sesión es válida, pero tus roles o tu scope no cubren este recurso."
      eyebrow="403 Forbidden"
      nextPath={nextPath}
      primaryHref="/"
      primaryLabel="Ir al inicio"
      title="Tu cuenta no tiene permisos para esta operación."
    />
  );
}
