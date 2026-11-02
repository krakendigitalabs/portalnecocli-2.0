import { ArrowLeft, MessageCircle, Phone, ShieldCheck, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDriverProfile } from "@/data/driverService";
import { requireAuth } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: "Ajustes de la cuenta | Neco-Dispatch",
  robots: { index: false, follow: false },
};

export default async function DriverAccountSettingsPage() {
  const session = await requireAuth({ nextPath: "/driver/perfil/ajustes" });
  const driverProfile = await getDriverProfile(session.user.uid);

  if (!driverProfile) {
    redirect("/conductores");
  }

  const phoneNumber = driverProfile.phone_number ?? driverProfile.phone ?? "";
  const whatsappNumber = driverProfile.whatsapp ?? phoneNumber;
  const identification = driverProfile.identification_number ?? "No registrada";

  return (
    <div className="min-h-screen bg-[#1A1D23] pb-24 text-white">
      <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-white/5 bg-[#1A1D23]/95 px-4 py-3 backdrop-blur-md">
        <Link href="/driver/perfil" className="-ml-2 rounded-full p-2 transition hover:bg-white/10">
          <ArrowLeft className="h-5 w-5 text-white/70" />
        </Link>
        <div>
          <h1 className="text-base font-bold text-white">Ajustes de la cuenta</h1>
          <p className="text-xs text-white/55">Administra tus datos de contacto y perfil</p>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-4 pt-6">
        <section className="space-y-1 rounded-3xl border border-white/5 bg-[#2A2D35] p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
            Perfil del conductor
          </p>
          <h2 className="text-xl font-black">{driverProfile.full_name}</h2>
          <p className="text-sm text-white/65">
            Mantén estos datos actualizados para mejorar tu operación y soporte.
          </p>
        </section>

        <section className="rounded-3xl border border-white/5 bg-[#2A2D35] p-5 shadow-lg">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-white/50">
            Contacto principal
          </h3>

          <div className="space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-xs uppercase tracking-widest text-white/45">Teléfono</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="font-semibold text-white">{phoneNumber || "No registrado"}</p>
                {phoneNumber ? (
                  <a
                    href={`tel:${phoneNumber}`}
                    className="inline-flex items-center gap-1 rounded-full border border-blue-500/35 bg-blue-500/12 px-3 py-1 text-xs font-semibold text-blue-300 transition hover:bg-blue-500/18"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Llamar
                  </a>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-xs uppercase tracking-widest text-white/45">WhatsApp</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="font-semibold text-white">{whatsappNumber || "No registrado"}</p>
                {whatsappNumber ? (
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/12 px-3 py-1 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/18"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Escribir
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/5 bg-[#2A2D35] p-5 shadow-lg">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-white/50">
            Seguridad y verificación
          </h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className="rounded-full bg-white/8 p-2">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/45">Identificación</p>
                <p className="font-semibold text-white">CC: {identification}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className="rounded-full bg-white/8 p-2">
                <UserRound className="h-4 w-4 text-white/70" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/45">UID de cuenta</p>
                <p className="font-mono text-xs text-white/85">{session.user.uid}</p>
              </div>
            </div>
          </div>
        </section>

        <p className="px-1 text-xs text-white/45">
          Si necesitas editar datos críticos (vehículo o documento), contacta soporte operativo.
        </p>
      </main>
    </div>
  );
}
