import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/server";
import { OnboardingForm } from "@/components/merchant/onboarding-form";

export const metadata: Metadata = {
  title: "Registro de Comercio | Portal Necoclí",
  description: "Afilia tu hotel, restaurante, transporte o comercio local a Portal Necoclí.",
};

export default async function RegistroComercioPage() {
  // Solo exigimos que esté autenticado (cualquier rol) para poder registrar su negocio
  const session = await requireRole(["customer", "business", "admin", "super_admin"], {
    nextPath: "/registro-comercio",
  });

  return (
    <main className="min-h-screen bg-sand py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-teal mb-3">
            Únete al Hub
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-ink tracking-tight mb-4">
            Afilia tu Comercio
          </h1>
          <p className="text-base text-ink/70 max-w-xl mx-auto">
            Completa la información de tu negocio para activar tu panel Escrow y empezar a recibir
            reservas y compras de turistas verificados.
          </p>
        </div>

        <OnboardingForm
          userEmail={session.user.email ?? ""}
          userName={session.user.displayName ?? ""}
        />
      </div>
    </main>
  );
}
