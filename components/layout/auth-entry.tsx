"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/hooks/use-auth-session";
import { signOutCurrentUser } from "@/lib/firebase/auth";

function getDashboardHref(roles: string[]): string {
  if (roles.includes("admin")) {
    return "/admin";
  }

  if (roles.includes("business") || roles.includes("operator")) {
    return "/merchant";
  }

  return "/negocios";
}

export function AuthEntry() {
  const session = useAuthSession();

  const dashboardHref = useMemo(() => {
    return session.user ? getDashboardHref(session.user.roles) : "/negocios";
  }, [session.user]);

  if (session.status === "loading") {
    return (
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/50">
        Verificando sesión
      </span>
    );
  }

  if (session.status !== "authenticated" || !session.user) {
    return (
      <Button className="w-full sm:w-auto" href="/ingresar" size="md" variant="ghost">
        Ingresar
      </Button>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] xl:flex xl:flex-wrap xl:items-center">
      <div className="rounded-[20px] border border-ink/10 bg-ink/[0.04] px-4 py-3">
        <p className="truncate text-sm font-semibold text-ink">
          {session.user.displayName || session.user.email || "Usuario autenticado"}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant="teal">
            {session.user.primaryRole || "sin rol"}
          </Badge>
          {!session.user.emailVerified ? (
            <Badge variant="neutral">correo pendiente</Badge>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button className="w-full sm:w-auto" href={dashboardHref} size="md" variant="ghost">
          Mi cuenta
        </Button>
        <button
          className="inline-flex w-full items-center justify-center rounded-full border border-ink/12 px-5 py-3 text-sm font-semibold text-ink transition hover:text-teal sm:w-auto"
          onClick={() => void signOutCurrentUser()}
          type="button"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
