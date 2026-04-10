"use client";

import { SurfaceCard } from "@/components/ui/surface-card";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/hooks/use-auth-session";
import { getFirebaseDiagnostics } from "@/lib/firebase/client";
import { signOutCurrentUser } from "@/lib/firebase/auth";

export default function FirebaseTestPage() {
  const session = useAuthSession();
  const diagnostics = getFirebaseDiagnostics();

  return (
    <div className="space-y-6 pb-14 pt-6 md:space-y-8 md:pt-10">
      <SurfaceCard className="rounded-[30px] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
          Diagnóstico Firebase
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
          Estado actual de la integración
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-ink/72">
          Esta pantalla confirma si la configuración pública está cargada y si la sesión de Firebase Auth está respondiendo en el cliente.
        </p>
      </SurfaceCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SurfaceCard className="rounded-[28px] p-6">
          <h2 className="text-xl font-semibold tracking-tight text-ink">
            Servicios
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-ink/70">
            <li>Config pública: {diagnostics.hasConfig ? "Lista" : "Incompleta"}</li>
            <li>App: {diagnostics.appReady ? "Inicializada" : "No disponible"}</li>
            <li>Auth: {diagnostics.authReady ? "Lista" : "No disponible"}</li>
            <li>
              Firestore: {diagnostics.firestoreReady ? "Listo" : "No disponible"}
            </li>
            <li>
              Storage: {diagnostics.storageReady ? "Listo" : "No disponible"}
            </li>
          </ul>
          {!diagnostics.hasConfig ? (
            <p className="mt-4 rounded-[18px] border border-coral/18 bg-coral/8 px-4 py-3 text-sm text-coral">
              Faltan variables: {diagnostics.missingConfig.join(", ")}
            </p>
          ) : null}
        </SurfaceCard>

        <SurfaceCard className="rounded-[28px] p-6">
          <h2 className="text-xl font-semibold tracking-tight text-ink">
            Sesión
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-ink/70">
            <li>Estado: {session.status}</li>
            <li>UID: {session.user?.uid ?? "Sin sesión"}</li>
            <li>Correo: {session.user?.email ?? "Sin sesión"}</li>
            <li>Correo verificado: {session.user?.emailVerified ? "Sí" : "No"}</li>
            <li>Rol principal: {session.user?.primaryRole ?? "Sin rol"}</li>
            <li>
              Roles: {session.user?.roles.length ? session.user.roles.join(", ") : "Sin roles"}
            </li>
            <li>
              Claim usado: {session.user?.claimsSource ?? "Sin custom claims detectados"}
            </li>
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/ingresar" size="lg">
              Probar ingreso
            </Button>
            {session.user ? (
              <button
                className="inline-flex items-center justify-center rounded-full border border-ink/12 px-6 py-3.5 text-sm font-semibold text-ink transition hover:text-teal"
                onClick={() => void signOutCurrentUser()}
                type="button"
              >
                Cerrar sesión
              </button>
            ) : null}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
