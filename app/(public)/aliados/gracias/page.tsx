import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SurfaceCard } from "@/components/ui/surface-card";

export const metadata: Metadata = {
  title: "Solicitud Recibida · Portal Necoclí",
  description:
    "Tu solicitud de alianza fue enviada correctamente. El equipo de Portal Necoclí la revisará en breve.",
};

export default function AliadosGraciasPage() {
  return (
    <main>
      <Container className="flex min-h-[60vh] items-center justify-center py-16 max-w-xl">
        <SurfaceCard className="rounded-[32px] p-10 text-center w-full">
          <p className="text-6xl">🌴</p>
          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            ¡Bienvenido a la familia de aliados!
          </h1>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Tu solicitud fue recibida y está en revisión. Te contactaremos al correo registrado en
            menos de <strong>48 horas hábiles</strong> para activar tu cuenta de aliado.
          </p>
          <div className="mt-4 rounded-2xl bg-teal-50 border border-teal-100 px-5 py-4 text-sm text-teal-700">
            <p>¿Tienes preguntas urgentes?</p>
            <a
              href="https://wa.me/573001234567"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block font-bold hover:underline"
            >
              💬 Escríbenos por WhatsApp
            </a>
          </div>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
          >
            Volver al inicio
          </Link>
        </SurfaceCard>
      </Container>
    </main>
  );
}
