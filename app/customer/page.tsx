import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/server";
import { getOrCreateLoyaltyProfile, getLoyaltyStars, getLoyaltyBonuses } from "@/data/loyaltyService";
import { getReservationsByCustomer } from "@/data/reservationService";
import { CustomerDashboard } from "@/components/dashboards/customer-dashboard";

export const metadata: Metadata = {
  title: "Mi Panel | Portal Necoclí",
  description: "Gestiona tus reservas, estrellas de fidelidad y bonos exclusivos de Portal Necoclí.",
};

export default async function CustomerPage() {
  const session = await requireRole(
    ["customer", "business", "admin", "super_admin"],
    { nextPath: "/customer" }
  );

  const { user } = session;

  // Obtener o crear perfil de fidelización del turista
  const [loyaltyProfile, stars, bonuses, reservations] = await Promise.all([
    getOrCreateLoyaltyProfile(
      user.uid,
      user.displayName ?? user.email ?? "Turista",
      user.email ?? ""
    ),
    getLoyaltyStars(user.uid),
    getLoyaltyBonuses(user.uid),
    getReservationsByCustomer(user.uid),
  ]);

  return (
    <CustomerDashboard
      user={user}
      loyaltyProfile={loyaltyProfile}
      recentStars={stars}
      bonuses={bonuses}
      reservations={reservations}
    />
  );
}
