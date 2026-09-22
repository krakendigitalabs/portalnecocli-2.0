import type { Metadata } from "next";
import { CustomerDashboard } from "@/components/dashboards/customer-dashboard";
import {
  getLoyaltyBonuses,
  getLoyaltyStars,
  getOrCreateLoyaltyProfile,
} from "@/data/loyaltyService";
import { getCustomerFavorites } from "@/data/favoriteService";
import { getReservationsByCustomer } from "@/data/reservationService";
import { requireRole } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: "Mi Panel | Portal Necoclí",
  description:
    "Gestiona tus reservas, estrellas de fidelidad y bonos exclusivos de Portal Necoclí.",
};

export default async function CustomerPage() {
  const session = await requireRole(["customer", "business", "admin", "super_admin"], {
    nextPath: "/customer",
  });

  const { user } = session;

  // Obtener o crear perfil de fidelización del turista
  const [loyaltyProfile, stars, bonuses, reservations, favorites] = await Promise.all([
    getOrCreateLoyaltyProfile(
      user.uid,
      user.displayName ?? user.email ?? "Turista",
      user.email ?? "",
    ),
    getLoyaltyStars(user.uid),
    getLoyaltyBonuses(user.uid),
    getReservationsByCustomer(user.uid),
    getCustomerFavorites(user.uid),
  ]);

  return (
    <CustomerDashboard
      user={user}
      loyaltyProfile={loyaltyProfile}
      recentStars={stars}
      bonuses={bonuses}
      reservations={reservations}
      favorites={favorites}
    />
  );
}
