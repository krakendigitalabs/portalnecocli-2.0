import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { WORKER_SUPER_ADMIN_EMAIL } from "@/lib/auth/worker-access";

export const metadata: Metadata = {
  title: "Acceso de trabajadores | Portal Necoclí 2.0",
  description: "Acceso privado al panel operativo de trabajadores.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WorkerSignInPage() {
  return (
    <div className="space-y-6 pb-14 pt-6 md:space-y-8 md:pt-10">
      <LoginForm allowedEmail={WORKER_SUPER_ADMIN_EMAIL} mode="worker" nextPath="/trabajadores" />
    </div>
  );
}
