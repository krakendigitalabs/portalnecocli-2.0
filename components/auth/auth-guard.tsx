"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { getMissingFirebasePublicConfig } from "@/lib/firebase/config";
import { hasRequiredRole } from "@/lib/auth/roles";
import { useAuthSession } from "@/hooks/use-auth-session";
import type { UserRole } from "@/types/auth";

type AuthGuardProps = {
  allowedRoles?: UserRole[];
  children: React.ReactNode;
  title: string;
  description: string;
};

export function AuthGuard({
  allowedRoles = [],
  children,
  title,
  description,
}: AuthGuardProps) {
  const pathname = usePathname();
  const session = useAuthSession();

  if (session.status === "loading") {
    return (
      <SurfaceCard className="rounded-[28px] p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          Verificando acceso
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-ink/72">
          Estamos validando tu sesión de Firebase para cargar este espacio de trabajo.
        </p>
      </SurfaceCard>
    );
  }

  if (session.status === "unconfigured") {
    const missingConfig = getMissingFirebasePublicConfig();

    return (
      <SurfaceCard className="rounded-[28px] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
          Firebase pendiente
        </p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
          Falta configurar Firebase para proteger esta ruta.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-ink/72">
          Define las variables públicas requeridas para activar autenticación, Firestore y Storage.
        </p>
        <p className="mt-4 text-sm leading-7 text-ink/68">
          {missingConfig.join(", ")}
        </p>
      </SurfaceCard>
    );
  }

  if (session.status === "unauthenticated") {
    const nextHref = pathname ? `?next=${encodeURIComponent(pathname)}` : "";

    return (
      <SurfaceCard className="rounded-[28px] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
          Acceso protegido
        </p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-ink/72">
          {description}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button href={`/ingresar${nextHref}`} size="lg">
            Ingresar con Firebase
          </Button>
          <Button href="/" size="lg" variant="secondary">
            Volver al portal
          </Button>
        </div>
      </SurfaceCard>
    );
  }

  if (!session.user || !hasRequiredRole(session.user.roles, allowedRoles)) {
    return (
      <SurfaceCard className="rounded-[28px] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
          Permisos insuficientes
        </p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
          Tu cuenta no tiene el rol necesario para entrar aquí.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-ink/72">
          Esta zona está reservada para perfiles autorizados dentro del ecosistema Portal Necoclí.
        </p>
        <p className="mt-4 text-sm leading-7 text-ink/68">
          Roles requeridos: {allowedRoles.join(", ")}
        </p>
        <div className="mt-6">
          <Link
            className="text-sm font-semibold text-teal transition hover:text-teal/80"
            href="/"
          >
            Volver al inicio
          </Link>
        </div>
      </SurfaceCard>
    );
  }

  return <>{children}</>;
}
