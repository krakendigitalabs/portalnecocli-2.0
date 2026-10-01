"use client";

import dynamic from "next/dynamic";

const RideMapClient = dynamic(() => import("@/components/rides/ride-map-client"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-3xl bg-ink/5 animate-pulse">
      <p className="text-ink/40 font-bold uppercase tracking-widest text-xs">
        Cargando Satélite...
      </p>
    </div>
  ),
});

export function RideMapWrapper({
  userId,
  userName,
  userPhone,
}: {
  userId: string;
  userName: string;
  userPhone: string;
}) {
  return <RideMapClient userId={userId} userName={userName} userPhone={userPhone} />;
}
