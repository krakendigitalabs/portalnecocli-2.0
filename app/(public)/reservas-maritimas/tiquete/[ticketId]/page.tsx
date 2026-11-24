import { Metadata } from "next";
import {
  MaritimeBoardingPass,
  type TripType,
} from "@/components/marketplace/maritime-boarding-pass";

export const metadata: Metadata = {
  title: "Tu Tiquete Marítimo | Portal Necoclí",
  description: "Tiquete de pre-reserva verificado. Preséntalo en taquilla para embarcar.",
};

interface PageProps {
  params: Promise<{ ticketId: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function MaritimeTicketPage({ params, searchParams }: PageProps) {
  const { ticketId } = await params;
  const sp = await searchParams;

  // In production, we'd fetch from Firestore by ticketId
  // For now we reconstruct from searchParams (passed via redirect from action)
  const passengers = sp.passengers
    ? JSON.parse(decodeURIComponent(sp.passengers))
    : [
        {
          name: "Pasajero 1",
          docType: "CC",
          docNum: "000000",
          phone: "",
          petFriendly: false,
          allergies: false,
        },
      ];

  const props = {
    ticketId,
    tripType: (sp.tripType as TripType) ?? "ruta",
    destination: sp.destination ?? "Capurganá",
    date: sp.date,
    passengers,
    accommodation: sp.accommodation ?? "none",
    totalPrice: Number(sp.total ?? 190000),
    isSolidarityActive: sp.solidarity === "true",
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5ef] to-[#f0f9ff] py-16 px-4">
      <div className="max-w-2xl mx-auto mb-10 text-center">
        <h1 className="text-3xl font-bold text-[#0f2e21] mb-2">¡Tu Pre-reserva está Registrada!</h1>
        <p className="text-gray-600">
          Un asesor de la naviera se comunicará contigo para asentar tus datos. Recuerda que
          realizar el pago a sus cuentas oficiales garantiza tu cupo al 100%.
        </p>
      </div>
      <MaritimeBoardingPass {...props} />
    </div>
  );
}
