"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { sendPasswordReset, signInWithEmailPassword } from "@/lib/firebase/auth";
import { getMissingFirebasePublicConfig } from "@/lib/firebase/config";
import { useAuthSession } from "@/hooks/use-auth-session";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return "No fue posible completar la operación con Firebase.";
}

const fieldClassName =
  "w-full rounded-[18px] border border-ink/12 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/38 focus:border-teal/40 focus:ring-2 focus:ring-teal/10 disabled:cursor-not-allowed disabled:opacity-60";
const textButtonClassName =
  "inline-flex w-full items-center justify-center rounded-full border border-transparent px-6 py-3.5 text-sm font-semibold text-ink transition hover:text-teal disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto";

type LoginFormProps = {
  nextPath?: string;
};

export function LoginForm({ nextPath = "/negocios" }: LoginFormProps) {
  const router = useRouter();
  const session = useAuthSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setFeedbackMessage(null);

    try {
      await signInWithEmailPassword(email.trim(), password);
      router.push(nextPath);
      router.refresh();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordReset() {
    if (!email.trim()) {
      setErrorMessage("Escribe tu correo para enviarte el enlace de recuperación.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setFeedbackMessage(null);

    try {
      await sendPasswordReset(email.trim());
      setFeedbackMessage("Te enviamos un correo para restablecer tu contraseña.");
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
          La base de autenticación está instalada, pero todavía no puede iniciar sesión hasta que el entorno tenga las credenciales correctas.
        </p>
        <p className="mt-4 text-sm leading-7 text-ink/68">
          {missingConfig.join(", ")}
        </p>
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
          Inicia sesión con Firebase Auth
        </h1>
        <p className="mt-4 text-base leading-7 text-ink/72">
          Usa tu cuenta autorizada para entrar al backoffice, al hub de negocios y a futuros módulos operativos del portal.
        </p>
        <ul className="mt-6 space-y-3 text-sm leading-7 text-ink/68">
          <li>Correo y contraseña sobre Firebase Auth.</li>
          <li>Roles leídos desde claims del token.</li>
          <li>Base lista para crecer hacia sesiones más robustas.</li>
        </ul>
      </SurfaceCard>

      <SurfaceCard className="rounded-[30px] p-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-ink" htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              className={fieldClassName}
              autoComplete="email"
              disabled={isSubmitting}
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu-correo@dominio.com"
              type="email"
              value={email}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-ink" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              className={fieldClassName}
              autoComplete="current-password"
              disabled={isSubmitting}
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Ingresa tu contraseña"
              type="password"
              value={password}
            />
          </div>

          {errorMessage ? (
            <p className="rounded-[18px] border border-coral/18 bg-coral/8 px-4 py-3 text-sm text-coral">
              {errorMessage}
            </p>
          ) : null}

          {feedbackMessage ? (
            <p className="rounded-[18px] border border-teal/18 bg-teal/8 px-4 py-3 text-sm text-teal">
              {feedbackMessage}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="w-full sm:w-auto"
              disabled={isSubmitting}
              size="lg"
              type="submit"
              variant="primary"
            >
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </Button>
            <Button
              className="w-full sm:w-auto"
              href="/"
              size="lg"
              variant="secondary"
            >
              Volver al portal
            </Button>
          </div>
        </form>

        <div className="mt-6 border-t border-ink/8 pt-6">
          <p className="text-sm leading-7 text-ink/68">
            Si olvidaste tu contraseña, usa tu correo y te enviaremos un enlace de recuperación.
          </p>
          <div className="mt-4">
            <button
              className={textButtonClassName}
              disabled={isSubmitting}
              onClick={handlePasswordReset}
              type="button"
            >
              {isSubmitting ? "Procesando..." : "Recuperar acceso"}
            </button>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
