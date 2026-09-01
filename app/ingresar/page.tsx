import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Ingresar | Portal Necoclí 2.0",
  description:
    "Acceso protegido con Firebase Auth para backoffice, negocios y futuros módulos operativos de Portal Necoclí.",
  alternates: {
    canonical: "https://portalnecocli.com/ingresar",
  },
};

type SignInPageProps = {
  searchParams?: Promise<{
    next?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const nextPath = resolvedSearchParams?.next?.startsWith("/")
    ? resolvedSearchParams.next
    : "/negocios";

  return (
    <div className="space-y-6 pb-14 pt-6 md:space-y-8 md:pt-10">
      <LoginForm nextPath={nextPath} />
    </div>
  );
}
