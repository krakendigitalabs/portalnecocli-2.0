import { getLoyaltyBonuses } from "@/data/loyaltyService";
import { requireRole } from "@/lib/auth/server";
import { BonosClientView } from "./bonos-client-view";

export default async function BonosPage() {
  const session = await requireRole(["customer", "business", "admin", "super_admin"], {
    nextPath: "/customer/bonos",
  });

  const { user } = session;
  const bonuses = await getLoyaltyBonuses(user.uid);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-ink tracking-tight">Tus Recompensas</h2>
        <p className="text-ink/60 mt-2">
          Desbloquea premios y bonos cruzados cada 5 estrellas. ¡Apoyemos la economía local!
        </p>
      </div>

      <BonosClientView bonuses={bonuses} />
    </div>
  );
}
