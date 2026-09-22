import { requireRole } from "@/lib/auth/server";
import { RecentlyViewedList } from "./recently-viewed-list";

export default async function VistosPage() {
  await requireRole(["customer", "business", "admin", "super_admin"], {
    nextPath: "/customer/vistos",
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-ink tracking-tight">Vistos Recientemente</h2>
        <p className="text-ink/60 mt-2">
          Retoma tu búsqueda justo donde la dejaste. Aquí guardamos tu historial de exploración.
        </p>
      </div>

      <RecentlyViewedList />
    </div>
  );
}
