import { requireAuth } from "@/lib/auth/server";
import { DriverRegisterForm } from "@/components/driver/driver-register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Completa tu Registro | Portal Necoclí",
};

export default async function RegistroConductorPage() {
  const session = await requireAuth({ nextPath: "/conductores/registro" });

  return (
    <main className="min-h-screen bg-gradient-to-b from-sand/30 to-white pb-24 px-4 pt-10">
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl shadow-ink/5 border border-ink/5 p-6 sm:p-10">
        <h2 className="text-xl font-bold text-ink mb-1 text-center">Completa tu Registro</h2>
        <p className="text-sm text-ink/50 text-center mb-8">
          Hola{" "}
          <strong>{session.user.displayName || session.user.email || "futuro conductor"}</strong>,
          necesitamos unos datos sobre tu vehículo.
        </p>
        <DriverRegisterForm />
      </div>
    </main>
  );
}
