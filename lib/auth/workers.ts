import "server-only";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server";
import { isWorkerSuperAdminEmail } from "@/lib/auth/worker-access";

export async function requireWorkerAccess() {
  const session = await requireRole(["super_admin"], {
    nextPath: "/trabajadores",
  });

  if (!isWorkerSuperAdminEmail(session.user.email)) {
    redirect("/forbidden?next=%2Ftrabajadores");
  }

  return session;
}
