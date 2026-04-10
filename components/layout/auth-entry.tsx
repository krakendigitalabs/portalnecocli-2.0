"use client";

import { useMemo } from "react";
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
  );
}
