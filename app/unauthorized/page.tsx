import type { Metadata } from "next";
import { headers } from "next/headers";
import { AccessState } from "@/components/auth/access-state";
import { buildPortalUrl } from "@/lib/routing/subdomains";

export const metadata: Metadata = {
  title: "Acceso requerido | Portal Necoclí 2.0",
  description: "Debes iniciar sesión para entrar a esta sección privada de Portal Necoclí.",
};

type UnauthorizedPageProps = {
  searchParams?: Promise<{
    next?: string;
  }>;
};

export default async function UnauthorizedPage({ searchParams }: UnauthorizedPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto");
  const nextPath = resolvedSearchParams?.next?.startsWith("/")
    ? resolvedSearchParams.next
    : "/merchant";
  const loginHref = buildPortalUrl("public", `/ingresar?next=${encodeURIComponent(nextPath)}`, {
    host,
    protocol,
  });
  const portalHref = buildPortalUrl("public", "/", {
    host,
    protocol,
  });

  return (
    <AccessState
      description="Necesitas una sesión válida del servidor para continuar. Inicia sesión y vuelve a intentar."
      eyebrow="401 Unauthorized"
      nextPath={nextPath}
      primaryHref={loginHref}
      primaryLabel="Iniciar sesión"
      secondaryHref={portalHref}
      title="Tu sesión no está autorizada para entrar aquí."
    />
  );
}
