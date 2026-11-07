"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useAuthSession } from "@/hooks/use-auth-session";
import { signInWithGoogle, signOutCurrentUser } from "@/lib/firebase/auth";
import {
  firebaseConfig,
  getFirebasePublicConfigDiagnostics,
  getMissingFirebasePublicConfig,
} from "@/lib/firebase/config";
import {
  getFirebaseAuthErrorDetails,
  getFirebaseConfigurationWarning,
} from "@/lib/firebase/errors";

function getErrorMessage(error: unknown): string {
  const details = getFirebaseAuthErrorDetails(error, firebaseConfig);

  return details.action ? `${details.message} ${details.action}` : details.message;
}

type LoginFormProps = {
  nextPath?: string;
  requestedRole?: "merchant" | "customer" | "driver";
  mode?: "profile-selector" | "worker";
  allowedEmail?: string;
};

export function LoginForm({
  nextPath,
  requestedRole,
  mode = "profile-selector",
  allowedEmail,
}: LoginFormProps) {
  const router = useRouter();
  const session = useAuthSession();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingPath, setLoadingPath] = useState<string | null>(null);
  const firebaseDiagnostics = getFirebasePublicConfigDiagnostics();
  const configurationWarning = getFirebaseConfigurationWarning();

  async function handleGoogleSignIn(overrideNextPath?: string) {
    const finalPath = overrideNextPath || nextPath || "/";
    setLoadingPath(finalPath);
    setErrorMessage(null);

    try {
      const credentials = await signInWithGoogle();

      if (
        allowedEmail &&
        credentials.user.email?.trim().toLowerCase() !== allowedEmail.trim().toLowerCase()
      ) {
        await signOutCurrentUser();
        setErrorMessage("Este acceso está reservado para la cuenta operativa autorizada.");
        setLoadingPath(null);
        return;
      }

      // Si hay un overrideNextPath (botón explícito), lo usamos.
      // Si no, respetamos el nextPath de la URL.
      router.push(finalPath);
      router.refresh();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setLoadingPath(null); // Solo quitamos el loading si hay error (si hay éxito, se redirige)
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

  const isMerchant = requestedRole === "merchant";
  const isWorkerLogin = mode === "worker";

  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <SurfaceCard className="rounded-[30px] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
          Acceso seguro
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
          {isWorkerLogin
            ? "Ingresa al panel operativo"
            : isMerchant
              ? "Afiliar o ingresar tu comercio"
              : "Inicia sesión para tu viaje"}
        </h1>
        <p className="mt-4 text-base leading-7 text-ink/72">
          {isWorkerLogin
            ? "Este espacio está separado de los accesos de turistas, comercios y conductores aliados."
            : isMerchant
              ? "Conecta tu hotel, restaurante o tour operadora con Portal Necoclí. Gestiona tus reservas y libera tus fondos Escrow de forma segura."
              : "Usa tu cuenta de Google para guardar favoritos, ver tus reservas oficiales y acumular estrellas para bonos de descuento."}
        </p>
        <ul className="mt-6 space-y-3 text-sm leading-7 text-ink/68">
          <li>Acceso seguro y rápido (OAuth 2.0).</li>
          <li>Sin contraseñas que recordar.</li>
          {isWorkerLogin ? (
            <li>Uso exclusivo para operación interna autorizada.</li>
          ) : isMerchant ? (
            <li>Panel de administración para negocios.</li>
          ) : (
            <li>Gestión centralizada de tu itinerario.</li>
          )}
        </ul>
      </SurfaceCard>

      <SurfaceCard className="flex flex-col justify-center rounded-[30px] p-8 md:p-12 border-0 shadow-2xl shadow-ink/5">
        <div className="space-y-4">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-ink">
            {isWorkerLogin ? "Acceso de trabajadores" : "Selecciona tu perfil"}
          </h2>

          {isWorkerLogin ? (
            <button
              onClick={() => handleGoogleSignIn("/trabajadores")}
              disabled={loadingPath !== null}
              type="button"
              className="group relative flex w-full items-center justify-between rounded-2xl border-2 border-ink/5 bg-white p-5 text-left transition-all hover:border-ink hover:bg-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div>
                <p className="text-base font-bold text-ink transition-colors group-hover:text-white">
                  Ingresar con Google
                </p>
                <p className="mt-0.5 text-sm text-ink/60 transition-colors group-hover:text-white/70">
                  Cuenta superadministradora autorizada
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 transition-colors group-hover:bg-white group-hover:text-ink">
                {loadingPath === "/trabajadores" ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-ink/20 border-t-ink group-hover:border-white/40 group-hover:border-t-ink" />
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                )}
              </div>
            </button>
          ) : (
            <>
              {/* Opción Turista */}
              <button
                onClick={() => handleGoogleSignIn("/customer")}
                disabled={loadingPath !== null}
                type="button"
                className="w-full group relative flex items-center justify-between p-5 rounded-2xl border-2 border-ink/5 bg-white hover:border-ink hover:bg-ink transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div>
                  <p className="text-base font-bold text-ink group-hover:text-white transition-colors">
                    Turista
                  </p>
                  <p className="text-sm text-ink/60 mt-0.5 group-hover:text-white/70 transition-colors">
                    Explora, reserva y viaja
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center group-hover:bg-white group-hover:text-ink transition-colors">
                  {loadingPath === "/customer" ? (
                    <div className="w-5 h-5 border-2 border-ink/20 border-t-ink rounded-full animate-spin group-hover:border-white/40 group-hover:border-t-ink" />
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  )}
                </div>
              </button>

              {/* Opción Conductor */}
              <button
                onClick={() => handleGoogleSignIn("/driver")}
                disabled={loadingPath !== null}
                type="button"
                className="w-full group relative flex items-center justify-between p-5 rounded-2xl border-2 border-ink/5 bg-white hover:border-ink hover:bg-ink transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div>
                  <p className="text-base font-bold text-ink group-hover:text-white transition-colors">
                    Conductor Aliado
                  </p>
                  <p className="text-sm text-ink/60 mt-0.5 group-hover:text-white/70 transition-colors">
                    Recibe carreras y gana
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center group-hover:bg-white group-hover:text-ink transition-colors">
                  {loadingPath === "/driver" ? (
                    <div className="w-5 h-5 border-2 border-ink/20 border-t-ink rounded-full animate-spin group-hover:border-white/40 group-hover:border-t-ink" />
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  )}
                </div>
              </button>

              {/* Opción Comercio */}
              <button
                onClick={() => handleGoogleSignIn("/merchant")}
                disabled={loadingPath !== null}
                type="button"
                className="w-full group relative flex items-center justify-between p-5 rounded-2xl border-2 border-ink/5 bg-white hover:border-ink hover:bg-ink transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div>
                  <p className="text-base font-bold text-ink group-hover:text-white transition-colors">
                    Comercio
                  </p>
                  <p className="text-sm text-ink/60 mt-0.5 group-hover:text-white/70 transition-colors">
                    Hoteles, restaurantes y tours
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center group-hover:bg-white group-hover:text-ink transition-colors">
                  {loadingPath === "/merchant" ? (
                    <div className="w-5 h-5 border-2 border-ink/20 border-t-ink rounded-full animate-spin group-hover:border-white/40 group-hover:border-t-ink" />
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  )}
                </div>
              </button>
            </>
          )}

          <div className="flex justify-center pt-6 border-t border-ink/10 mt-6">
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
