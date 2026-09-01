import { requireRole } from "@/lib/auth/server";

type FirebaseTestLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function FirebaseTestLayout({ children }: FirebaseTestLayoutProps) {
  await requireRole(["admin"], { nextPath: "/firebase-test" });

  return children;
}
