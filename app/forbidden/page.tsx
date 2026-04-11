import type { Metadata } from "next";
import { headers } from "next/headers";
import { AccessState } from "@/components/auth/access-state";
import { buildPortalUrl } from "@/lib/routing/subdomains";

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
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto");
  const nextPath =
    resolvedSearchParams?.next?.startsWith("/")
      ? resolvedSearchParams.next
      : "/merchant";
  const switchAccountHref = buildPortalUrl(
    "public",
    `/ingresar?next=${encodeURIComponent(nextPath)}`,
    {
      host,
      protocol,
    },
  );
  const portalHref = buildPortalUrl("public", "/", {
    host,
    protocol,
  });

  return (
    <AccessState
      description="La sesión es válida, pero tus roles o tu scope no cubren este recurso."
      eyebrow="403 Forbidden"
      nextPath={nextPath}
      primaryHref={switchAccountHref}
      primaryLabel="Cambiar de cuenta"
      secondaryHref={portalHref}
      title="Tu cuenta no tiene permisos para esta operación."
    />
  );
}
