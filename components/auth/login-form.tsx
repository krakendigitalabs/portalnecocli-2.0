"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useAuthSession } from "@/hooks/use-auth-session";
import { signInWithGoogle } from "@/lib/firebase/auth";
import {
  getFirebasePublicConfigDiagnostics,
  getMissingFirebasePublicConfig,
} from "@/lib/firebase/config";
import {
  getFirebaseAuthErrorDetails,
  getFirebaseConfigurationWarning,
} from "@/lib/firebase/errors";
import { firebaseConfig } from "@/lib/firebase/config";

function getErrorMessage(error: unknown): string {
  const details = getFirebaseAuthErrorDetails(error, firebaseConfig);

  return details.action ? `${details.message} ${details.action}` : details.message;
}

type LoginFormProps = {
  nextPath?: string;
};

export function LoginForm({ nextPath = "/negocios" }: LoginFormProps) {
  const router = useRouter();
  const session = useAuthSession();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firebaseDiagnostics = getFirebasePublicConfigDiagnostics();
  const configurationWarning = getFirebaseConfigurationWarning();

  async function handleGoogleSignIn() {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await signInWithGoogle();
      router.push(nextPath);
      router.refresh();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (session.status === "authenticated") {
    const authenticatedUser = session.user;

    if (!authenticatedUser) {
      return null;
    }

    return (
      <SurfaceCard className="rounded-[30px] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
          Sesión activa
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
          Ya tienes una sesión iniciada.
        </h1>
        <p className="mt-4 text-base leading-7 text-ink/72">
          Continúa hacia tu siguiente paso dentro del portal.
        </p>
        <div className="mt-5 rounded-[20px] border border-ink/10 bg-ink/[0.03] px-4 py-4 text-sm leading-7 text-ink/70">
          <p>Correo: {authenticatedUser.email ?? "Sin correo visible"}</p>
          <p>Rol principal: {authenticatedUser.primaryRole ?? "Sin rol asignado"}</p>
          <p>Origen del claim: {authenticatedUser.claimsSource ?? "Sin custom claims"}</p>
        </div>
        <div className="mt-6">
          <Button href={nextPath} size="lg">
            Continuar
          </Button>
        </div>
      </SurfaceCard>
    );
  }

  if (session.status === "unconfigured") {
    const missingConfig = getMissingFirebasePublicConfig();

    return (
      <SurfaceCard className="rounded-[30px] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
          Firebase pendiente
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
          Falta configurar las variables públicas de Firebase.
        </h1>
        <p className="mt-4 text-base leading-7 text-ink/72">
          La base de autenticación está instalada, pero todavía no puede iniciar sesión hasta que el
          entorno tenga las credenciales correctas.
        </p>
        <p className="mt-4 text-sm leading-7 text-ink/68">{missingConfig.join(", ")}</p>
      </SurfaceCard>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <SurfaceCard className="rounded-[30px] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
          Acceso seguro
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
          Inicia sesión en Portal Necoclí
        </h1>
        <p className="mt-4 text-base leading-7 text-ink/72">
          Usa tu cuenta de Google autorizada para entrar al backoffice, al hub de negocios y a futuros módulos
          operativos del portal.
        </p>
        <ul className="mt-6 space-y-3 text-sm leading-7 text-ink/68">
          <li>Acceso seguro y rápido (OAuth 2.0).</li>
          <li>Sin contraseñas que recordar.</li>
          <li>Roles leídos desde claims del token.</li>
        </ul>
      </SurfaceCard>

      <SurfaceCard className="flex flex-col justify-center rounded-[30px] p-8">
        <div className="space-y-6">
          <button
            className="inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-4 text-sm font-semibold text-white shadow-soft transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            onClick={handleGoogleSignIn}
            type="button"
          >
            {isSubmitting ? "Conectando con Google..." : "Continuar con Google"}
          </button>
          
          <div className="flex justify-center">
            <Button className="w-full sm:w-auto" href="/" size="lg" variant="secondary">
              Volver al inicio
            </Button>
          </div>

          {errorMessage ? (
            <p className="rounded-[18px] border border-coral/18 bg-coral/8 px-4 py-3 text-sm text-coral">
              {errorMessage}
            </p>
          ) : null}

          {process.env.NODE_ENV !== "production" && configurationWarning ? (
            <p className="rounded-[18px] border border-amber-400/30 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Diagnóstico dev: {configurationWarning}
            </p>
          ) : null}

          {process.env.NODE_ENV !== "production" && errorMessage ? (
            <p className="rounded-[18px] border border-ink/10 bg-ink/[0.03] px-4 py-3 text-xs leading-6 text-ink/70">
              Proyecto Firebase: {firebaseDiagnostics.projectId || "sin projectId"} · authDomain:{" "}
              {firebaseDiagnostics.authDomain || "sin authDomain"}
            </p>
          ) : null}
        </div>
      </SurfaceCard>
    </div>
  );
}
