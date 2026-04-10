import type { Metadata } from "next";
import { AccessState } from "@/components/auth/access-state";

export const metadata: Metadata = {
  title: "Acceso requerido | Portal Necoclí 2.0",
  description:
    "Debes iniciar sesión para entrar a esta sección privada de Portal Necoclí.",
};

type UnauthorizedPageProps = {
  searchParams?: Promise<{
    next?: string;
  }>;
};

export default async function UnauthorizedPage({
  searchParams,
}: UnauthorizedPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const nextPath =
    resolvedSearchParams?.next?.startsWith("/")
      ? resolvedSearchParams.next
      : "/merchant";

  return (
    <AccessState
      description="Necesitas una sesión válida del servidor para continuar. Inicia sesión y vuelve a intentar."
      eyebrow="401 Unauthorized"
      nextPath={nextPath}
      primaryHref={`/ingresar?next=${encodeURIComponent(nextPath)}`}
      primaryLabel="Iniciar sesión"
      title="Tu sesión no está autorizada para entrar aquí."
    />
  );
}
