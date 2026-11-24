"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Anchor,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Loader2,
  MapPin,
  Ship,
  Sun,
  UserPlus,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { MaritimeBookingInput } from "@/app/actions/maritime-booking";
import { processMaritimeBooking } from "@/app/actions/maritime-booking";
import { NavieraSelector } from "./naviera-selector";
import { ScarcityBadge } from "./scarcity-badge";
import { SolidarityBanner } from "./solidarity-banner";

type TabType = "ruta" | "sol" | "yate";
type AccommodationType = "none" | "without_food" | "food_standard" | "food_exclusive";
type DocType = "CC" | "CE" | "TI" | "PAS";
type GroupMode = "individual" | "group";

interface Passenger {
  id: string;
  name: string;
  docType: DocType;
  docNum: string;
  phone: string;
  email: string;
  petFriendly: boolean;
  allergies: boolean;
}

const GROUP_SIZES = [10, 15, 20, 25, 30, 40, 50];

const TAB_CONFIG = {
  ruta: {
    label: "Ruta Diaria",
    icon: Ship,
    accent: "from-[#0077b6] to-[#00b4d8]",
    light: "bg-sky-50 border-sky-200 text-sky-700",
  },
  sol: {
    label: "Día de Sol",
    icon: Sun,
    accent: "from-[#f77f00] to-[#fcbf49]",
    light: "bg-amber-50 border-amber-200 text-amber-700",
  },
  yate: {
    label: "Yate Privado",
    icon: Anchor,
    accent: "from-[#7b2d8b] to-[#c77dff]",
    light: "bg-purple-50 border-purple-200 text-purple-700",
  },
};

// Animated wave SVG
function Waves({ color = "#00b4d8" }: { color?: string }) {
  return (
    <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="w-full h-full">
      <motion.path
        d="M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,80 L0,80 Z"
        fill={color}
        fillOpacity="0.15"
        animate={{
          d: [
            "M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,80 L0,80 Z",
            "M0,55 C200,10 400,70 600,30 C800,10 1000,65 1200,35 L1200,80 L0,80 Z",
            "M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,80 L0,80 Z",
          ],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M0,55 C150,20 350,70 600,50 C850,30 1050,65 1200,45 L1200,80 L0,80 Z"
        fill={color}
        fillOpacity="0.25"
        animate={{
          d: [
            "M0,55 C150,20 350,70 600,50 C850,30 1050,65 1200,45 L1200,80 L0,80 Z",
            "M0,35 C150,65 350,25 600,55 C850,75 1050,30 1200,55 L1200,80 L0,80 Z",
            "M0,55 C150,20 350,70 600,50 C850,30 1050,65 1200,45 L1200,80 L0,80 Z",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </svg>
  );
}

interface MaritimeBookingWidgetProps {
  initialDate?: string;
  initialPeople?: number;
}

export function MaritimeBookingWidget({ initialDate, initialPeople }: MaritimeBookingWidgetProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("ruta");
<<<<<<< HEAD
  const [operator, setOperator] = useState<"sol_playa" | "caribe" | "">("");
=======
  const [operator, setOperator] = useState<"sol_playa" | "caribe">("sol_playa");
>>>>>>> origin/main
  const [origin, setOrigin] = useState("Necoclí");
  const [destination, setDestination] = useState("Capurganá");
  const [journeyType, setJourneyType] = useState<"ida" | "ida_vuelta">("ida_vuelta");
  const [adults, setAdults] = useState(initialPeople ?? 1);
  const [children, setChildren] = useState(0);
  const [travelDate, setTravelDate] = useState(initialDate ?? "");
  const [accommodation, setAccommodation] = useState<AccommodationType>("none");
  const [isSolidarityActive, setIsSolidarityActive] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passengerPanelOpen, setPassengerPanelOpen] = useState(false);
  const [groupMode, setGroupMode] = useState<GroupMode>("individual");
  const [groupSize, setGroupSize] = useState(10);
  const [groupContactName, setGroupContactName] = useState("");
  const [groupContactPhone, setGroupContactPhone] = useState("");
  const [groupContactEmail, setGroupContactEmail] = useState("");

  const totalPassengers = groupMode === "group" ? groupSize : adults + children;

  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      id: "1",
      name: "",
      docType: "CC" as DocType,
      docNum: "",
      phone: "",
      email: "",
      petFriendly: false,
      allergies: false,
    },
  ]);

  useEffect(() => {
    if (groupMode === "group") return; // groups use contact form instead
    setPassengers((prev) => {
      if (prev.length === totalPassengers) return prev;
      if (prev.length < totalPassengers) {
        return [
          ...prev,
          ...Array.from({ length: totalPassengers - prev.length }, (_, i) => ({
            id: `p-${Date.now()}-${i}`,
            name: "",
            docType: "CC" as DocType,
            docNum: "",
            phone: "",
            email: "",
            petFriendly: false,
            allergies: false,
          })),
        ];
      }
      return prev.slice(0, totalPassengers);
    });
  }, [totalPassengers, groupMode]);

  useEffect(() => {
    const handleTabChange = (e: CustomEvent) => {
      if (e.detail === "sol") setActiveTab("sol");
    };
    const handleSelectNaviera = (e: CustomEvent<{ id?: string; planId?: string }>) => {
      if (e.detail?.id === "sol-y-playa") {
        setOperator("sol_playa");
      } else if (e.detail?.id === "el-caribe") {
        setOperator("caribe");
      }
      if (e.detail?.planId === "el-caribe-panama") {
        setDestination("Plan Día de Sol en Panamá (La Miel y Puerto Obaldía)");
      } else if (e.detail?.planId === "el-caribe-soledad-sapzurro") {
        setDestination("Día de Sol · Playa Soledad y Sapzurro");
      } else if (e.detail?.planId === "sol-y-playa-3-playas") {
        setDestination("Día de Sol · 3 Playas (Sapzurro, La Miel y Playa Soledad)");
      }
    };
    window.addEventListener("change-booking-tab", handleTabChange as EventListener);
    window.addEventListener("select-naviera", handleSelectNaviera as EventListener);
    return () => {
      window.removeEventListener("change-booking-tab", handleTabChange as EventListener);
      window.removeEventListener("select-naviera", handleSelectNaviera as EventListener);
    };
  }, []);

  useEffect(() => {
    if (activeTab === "sol") {
      setOrigin("Necoclí");
      if (operator === "sol_playa") {
        setDestination("Día de Sol · 3 Playas (Sapzurro, La Miel y Playa Soledad)");
      } else if (operator === "caribe") {
        if (!destination.includes("Panamá")) {
          setDestination("Día de Sol · Playa Soledad y Sapzurro");
        }
      } else {
        if (!destination.includes("Día de Sol") && !destination.includes("Panamá")) {
          setDestination("Día de Sol · Playa Soledad y Sapzurro");
        }
      }
    } else if (destination.includes("Día de Sol") || destination.includes("Panamá")) {
      setOrigin("Necoclí");
      setDestination("Capurganá");
    }
  }, [activeTab, operator]);

  const handleOriginChange = (newOrigin: string) => {
    setOrigin(newOrigin);
    // Auto-update destination to something valid
    if (newOrigin === "Capurganá" && destination === "Capurganá") setDestination("Necoclí");
    if (newOrigin === "Triganá" && destination === "Triganá") setDestination("Necoclí");
    if (newOrigin === "Acandí" && destination === "Acandí") setDestination("Necoclí");
    if (
      newOrigin !== "Necoclí" &&
      (destination === "Playa Soledad" || destination === "Bahía Aguacate")
    ) {
      setDestination("Necoclí");
    }
  };

  const getBasePrice = () => {
    if (activeTab === "yate") {
      const baseFor6 = 8000000;
      if (totalPassengers > 6) {
        return baseFor6 + (totalPassengers - 6) * 1100000;
      }
      return baseFor6;
    }
    if (activeTab === "sol") {
      const isPanama = destination.includes("Panamá") || destination.includes("270");
      return (isPanama ? 270000 : 210000) * totalPassengers; // Siempre ida y vuelta
    }

    const route = `${origin}-${destination}`;
    const idaPrices: Record<string, number> = {
      "Necoclí-Capurganá": 95000,
      "Capurganá-Necoclí": 95000,
      "Necoclí-Triganá": 75000,
      "Triganá-Necoclí": 75000,
      "Necoclí-Acandí": 85000,
      "Acandí-Necoclí": 85000,
      "Capurganá-Triganá": 75000,
      "Triganá-Capurganá": 75000,
      "Capurganá-Acandí": 55000,
      "Acandí-Capurganá": 55000,
      "Triganá-Acandí": 55000,
      "Acandí-Triganá": 55000,
      "Necoclí-Playa Soledad": 95000,
      "Necoclí-Bahía Aguacate": 95000,
    };

    const base = idaPrices[route] || 95000;
    const perPassengerPrice = journeyType === "ida" ? base : base * 2;

    return perPassengerPrice * totalPassengers;
  };

  const getAccommodationPrice = () => {
    if (accommodation === "none") return 0;
    if (accommodation === "without_food") return 80000 * totalPassengers;
    if (accommodation === "food_standard") return 105000 * totalPassengers;
    if (accommodation === "food_exclusive") return 160000 * totalPassengers;
    return 0;
  };

  const solidarityPrice = isSolidarityActive ? 5000 : 0;
  const total = getBasePrice() + getAccommodationPrice() + solidarityPrice;

  const handleUpdatePassenger = useCallback(
    (index: number, field: keyof Passenger, value: string | boolean) => {
      setPassengers((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
    },
    [],
  );

  const handleGenerateTicket = async () => {
    if (!termsAccepted || isLoading) return;

    if (!operator) {
      alert(
        "⚠️ Debes seleccionar una Naviera (Sol y Playa S.A.S o El Caribe S.A.S) antes de continuar.",
      );
      return;
    }

    if (!travelDate) {
      alert("⚠️ Debes seleccionar una Fecha de Viaje antes de continuar.");
      return;
    }

    if (groupMode === "individual") {
      const p1 = passengers[0];
      if (!p1.name || !p1.docNum || !p1.phone || !p1.email) {
        alert(
          "⚠️ Los datos del Pasajero 1 (Nombre, Documento, Teléfono y Correo) son obligatorios.",
        );
        return;
      }
    } else {
      if (!groupContactName || !groupContactPhone || !groupContactEmail) {
        alert("⚠️ Los datos del Representante del Grupo son obligatorios.");
        return;
      }
    }

    setIsLoading(true);
    try {
      const passengersPayload: MaritimeBookingInput["passengers"] =
        groupMode === "group"
          ? [
              {
                name: groupContactName || "Representante del Grupo",
                docType: "CC",
                docNum: "000000",
                phone: groupContactPhone,
                email: groupContactEmail,
                petFriendly: false,
                allergies: false,
              },
            ]
          : passengers.map(({ id, ...rest }) => rest);

      const result = await processMaritimeBooking({
        tripType: activeTab,
        journeyType: activeTab === "ruta" ? journeyType : "ida_vuelta",
        operator: operator as "sol_playa" | "caribe",
        origin,
        destination,
        date: travelDate,
        accommodation,
        isSolidarityActive,
        totalPrice: total,
        passengers: passengersPayload,
      });
      if (result.success && result.ticketId) {
        const params = new URLSearchParams({
          tripType: activeTab,
          journeyType: activeTab === "ruta" ? journeyType : "ida_vuelta",
          origin,
          destination,
          date: travelDate,
          accommodation,
          solidarity: String(isSolidarityActive),
          total: String(total),
          ticket: result.ticketId,
        });

        if (result.wompiLink) {
          const returnUrl = `${window.location.origin}/reservas-maritimas?${params.toString()}`;
          window.location.href = `${result.wompiLink}&redirect-url=${encodeURIComponent(returnUrl)}`;
        } else {
          router.push(`/reservas-maritimas?${params.toString()}`);
        }
      } else {
        alert(
          result.error ||
            "Hubo un error al generar tu tiquete. Verifica los datos e inténtalo nuevamente.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const tab = TAB_CONFIG[activeTab];
  const TabIcon = tab.icon;

  const waveColor = activeTab === "ruta" ? "#00b4d8" : activeTab === "sol" ? "#f77f00" : "#9d4edd";

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div
        id="booking-widget"
        className="w-full bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden border border-gray-100"
      >
        {/* ── HERO HEADER with animated waves ── */}
        <div
          className={`relative bg-gradient-to-br ${tab.accent} px-5 py-8 md:px-8 md:py-10 overflow-hidden`}
        >
          {/* Animated boat crossing */}
          <motion.div
            className="absolute bottom-6 opacity-20"
            animate={{ x: ["-10%", "110%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Ship className="w-20 h-20 text-white" />
          </motion.div>

          {/* Wave bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-12">
            <Waves color="white" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{
                  y: [0, -4, 0],
                  rotate: [0, 4, -4, 0],
                  boxShadow: [
                    "0px 4px 15px rgba(0, 0, 0, 0.2)",
                    "0px 10px 30px rgba(255, 255, 255, 0.5)",
                    "0px 4px 15px rgba(0, 0, 0, 0.2)",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-white/60 flex items-center justify-center overflow-hidden shrink-0 z-20"
              >
                <img
                  src="https://res.cloudinary.com/dr50ioh9h/image/upload/v1746587440/Dise%C3%B1o_sin_t%C3%ADtulo_pvwjh9.png"
                  alt="Portal Necoclí"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div>
                <p className="text-white/70 text-xs uppercase tracking-widest font-semibold">
                  Reservas Marítimas
                </p>
                <h1 className="text-white text-2xl font-extrabold leading-tight">
                  Proyecto de Confianza Turística
                </h1>
              </div>
            </div>
            <ScarcityBadge />
          </div>
        </div>

        {/* ── TAB SELECTOR ── */}
        <div className="border-b border-slate-200 px-2 md:px-8 pt-0 bg-slate-100/80 overflow-x-auto no-scrollbar">
          <div className="flex gap-0 -mb-px min-w-max">
            {(["ruta", "sol", "yate"] as TabType[]).map((t) => {
              const cfg = TAB_CONFIG[t];
              const Icon = cfg.icon;
              const active = activeTab === t;
              return (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`relative flex items-center gap-2 px-5 md:px-7 py-4 text-sm md:text-base font-bold border-b-2 transition-all ${
                    active
                      ? "border-current text-slate-950"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  {cfg.label}
                  {active && (
                    <motion.div
                      layoutId="tabUnderline"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${cfg.accent}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px]">
          {/* ══ LEFT: MAIN FORM ══ */}
          <div className="p-5 lg:p-10 space-y-8">
            {/* Search bar row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-4">
<<<<<<< HEAD
              {/* Naviera Selector 50/50 con Zoom Alternado */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <NavieraSelector
                  value={operator}
                  onChange={(val) => setOperator(val)}
                  randomizeOrder
                />
              </div>

=======
>>>>>>> origin/main
              {/* Origin */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 hover:border-sky-500 shadow-sm transition-all relative">
                <p className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  Origen
                </p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                  {activeTab === "sol" ? (
                    <span className="font-bold text-slate-900 text-sm md:text-base">Necoclí</span>
                  ) : (
                    <select
                      className="w-full bg-white font-bold text-slate-900 outline-none appearance-none cursor-pointer pr-6 text-sm md:text-base border-0 focus:ring-0"
                      value={origin}
                      onChange={(e) => handleOriginChange(e.target.value)}
                    >
<<<<<<< HEAD
                      <option className="bg-white text-slate-900 font-semibold py-2">
                        Necoclí
                      </option>
                      <option className="bg-white text-slate-900 font-semibold py-2">
                        Capurganá
                      </option>
                      <option className="bg-white text-slate-900 font-semibold py-2">
                        Triganá
                      </option>
=======
                      <option className="bg-white text-slate-900 font-semibold py-2">Necoclí</option>
                      <option className="bg-white text-slate-900 font-semibold py-2">Capurganá</option>
                      <option className="bg-white text-slate-900 font-semibold py-2">Triganá</option>
>>>>>>> origin/main
                      <option className="bg-white text-slate-900 font-semibold py-2">Acandí</option>
                    </select>
                  )}
                  {activeTab !== "sol" && (
                    <ChevronDown className="w-4 h-4 absolute right-4 bottom-4 text-slate-600 pointer-events-none" />
                  )}
                </div>
              </div>

<<<<<<< HEAD
=======
              {/* Naviera / Operador */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 hover:border-sky-500 shadow-sm transition-all relative">
                <p className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  Naviera
                </p>
                <select
                  className="w-full bg-white font-bold text-slate-900 outline-none appearance-none cursor-pointer pr-6 text-sm md:text-base border-0 focus:ring-0"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value as "caribe" | "sol_playa")}
                >
                  <option value="sol_playa" className="bg-white text-slate-900 font-semibold py-2">
                    Sol y Playa S.A.S
                  </option>
                  <option value="caribe" className="bg-white text-slate-900 font-semibold py-2">
                    El Caribe S.A.S
                  </option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-4 bottom-4 text-slate-600 pointer-events-none" />
              </div>

>>>>>>> origin/main
              {/* Destination */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 hover:border-sky-500 shadow-sm transition-all relative">
                <p className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  Destino
                </p>
                <select
                  className="w-full bg-white font-bold text-slate-900 outline-none appearance-none cursor-pointer pr-6 text-sm md:text-base border-0 focus:ring-0"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  {activeTab === "sol" ? (
<<<<<<< HEAD
                    operator === "sol_playa" ? (
                      <option
                        value="Día de Sol · 3 Playas (Sapzurro, La Miel y Playa Soledad)"
                        className="bg-white text-slate-900 font-semibold py-2"
                      >
                        Día de Sol · 3 Playas (Sapzurro, La Miel, Playa Soledad) — $210.000 COP
                      </option>
                    ) : operator === "caribe" ? (
                      <>
                        <option
                          value="Día de Sol · Playa Soledad y Sapzurro"
                          className="bg-white text-slate-900 font-semibold py-2"
                        >
                          Día de Sol: Playa Soledad y Sapzurro — $210.000 COP
                        </option>
                        <option
                          value="Plan Día de Sol en Panamá (La Miel y Puerto Obaldía)"
                          className="bg-white text-slate-900 font-semibold py-2"
                        >
                          Plan Día de Sol en Panamá (La Miel y Pto. Obaldía) — $270.000 COP
                        </option>
                      </>
                    ) : (
                      <>
                        <option
                          value="Día de Sol · 3 Playas (Sol y Playa)"
                          className="bg-white text-slate-900 font-semibold py-2"
                        >
                          [Sol y Playa] 3 Playas: Sapzurro, La Miel, Soledad — $210.000 COP
                        </option>
                        <option
                          value="Día de Sol · Playa Soledad y Sapzurro"
                          className="bg-white text-slate-900 font-semibold py-2"
                        >
                          [El Caribe] Playa Soledad y Sapzurro — $210.000 COP
                        </option>
                        <option
                          value="Plan Día de Sol en Panamá (La Miel y Puerto Obaldía)"
                          className="bg-white text-slate-900 font-semibold py-2"
                        >
                          [El Caribe] Día de Sol en Panamá — $270.000 COP
                        </option>
                      </>
                    )
                  ) : (
                    <>
                      {origin !== "Capurganá" && (
                        <option className="bg-white text-slate-900 font-semibold py-2">
                          Capurganá
                        </option>
                      )}
                      {origin !== "Triganá" && (
                        <option className="bg-white text-slate-900 font-semibold py-2">
                          Triganá
                        </option>
                      )}
                      {origin !== "Acandí" && (
                        <option className="bg-white text-slate-900 font-semibold py-2">
                          Acandí
                        </option>
                      )}
                      {origin !== "Necoclí" && (
                        <option className="bg-white text-slate-900 font-semibold py-2">
                          Necoclí
                        </option>
                      )}
                      {origin === "Necoclí" && (
                        <>
                          <option className="bg-white text-slate-900 font-semibold py-2">
                            Playa Soledad
                          </option>
                          <option className="bg-white text-slate-900 font-semibold py-2">
                            Bahía Aguacate
                          </option>
=======
                    <option className="bg-white text-slate-900 font-semibold py-2">
                      Día de Sol: Playa Soledad y Sapzurro
                    </option>
                  ) : (
                    <>
                      {origin !== "Capurganá" && (
                        <option className="bg-white text-slate-900 font-semibold py-2">Capurganá</option>
                      )}
                      {origin !== "Triganá" && (
                        <option className="bg-white text-slate-900 font-semibold py-2">Triganá</option>
                      )}
                      {origin !== "Acandí" && (
                        <option className="bg-white text-slate-900 font-semibold py-2">Acandí</option>
                      )}
                      {origin !== "Necoclí" && (
                        <option className="bg-white text-slate-900 font-semibold py-2">Necoclí</option>
                      )}
                      {origin === "Necoclí" && (
                        <>
                          <option className="bg-white text-slate-900 font-semibold py-2">Playa Soledad</option>
                          <option className="bg-white text-slate-900 font-semibold py-2">Bahía Aguacate</option>
>>>>>>> origin/main
                        </>
                      )}
                    </>
                  )}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-4 bottom-4 text-slate-600 pointer-events-none" />
              </div>

              {/* Tipo de Trayecto (Only for ruta) */}
              {activeTab === "ruta" && (
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 hover:border-sky-500 shadow-sm transition-all relative">
                  <p className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Trayecto
                  </p>
                  <select
                    className="w-full bg-white font-bold text-slate-900 outline-none appearance-none cursor-pointer pr-6 text-sm md:text-base border-0 focus:ring-0"
                    value={journeyType}
                    onChange={(e) => setJourneyType(e.target.value as "ida" | "ida_vuelta")}
                  >
                    <option value="ida" className="bg-white text-slate-900 font-semibold py-2">
                      Ida (Solo ida)
                    </option>
<<<<<<< HEAD
                    <option
                      value="ida_vuelta"
                      className="bg-white text-slate-900 font-semibold py-2"
                    >
=======
                    <option value="ida_vuelta" className="bg-white text-slate-900 font-semibold py-2">
>>>>>>> origin/main
                      Ida y Vuelta
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-4 bottom-4 text-slate-600 pointer-events-none" />
                </div>
              )}

              {/* Date */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 hover:border-sky-500 shadow-sm transition-all relative">
                <p className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  Fecha de Viaje <span className="text-rose-600 text-xs">*</span>
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                  <input
                    type="date"
                    className="bg-transparent font-bold text-slate-900 outline-none w-full text-sm md:text-base cursor-pointer"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Passengers selector */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 hover:border-sky-500 shadow-sm transition-all relative">
                <p className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  Pasajeros
                </p>
                <button
                  type="button"
                  onClick={() => setPassengerPanelOpen((v) => !v)}
                  className="flex items-center justify-between w-full font-bold text-slate-900 text-sm md:text-base"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-sky-600" />
                    {totalPassengers}{" "}
                    {groupMode === "group"
                      ? "en grupo"
                      : totalPassengers > 1
                        ? "pasajeros"
                        : "pasajero"}
                  </span>
                  {passengerPanelOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  )}
                </button>

                <AnimatePresence>
                  {passengerPanelOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full right-0 lg:right-auto lg:left-0 mt-2 w-[calc(100vw-2.5rem)] max-w-[320px] bg-white border-2 border-slate-200 shadow-2xl rounded-2xl p-4 sm:p-5 z-30"
                    >
                      {/* Mode toggle */}
                      <div className="flex gap-2 mb-5 bg-slate-100 rounded-xl p-1">
                        <button
                          onClick={() => setGroupMode("individual")}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${groupMode === "individual" ? "bg-white shadow text-slate-900" : "text-slate-600"}`}
                        >
                          <UserPlus className="w-3.5 h-3.5" /> Individual
                        </button>
                        <button
                          onClick={() => setGroupMode("group")}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${groupMode === "group" ? "bg-white shadow text-slate-900" : "text-slate-600"}`}
                        >
                          <Building2 className="w-3.5 h-3.5" /> Grupo / Empresa
                        </button>
                      </div>

                      {groupMode === "individual" ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-bold text-sm text-slate-900">Adultos</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setAdults(Math.max(1, adults - 1))}
                                className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center hover:bg-slate-100 font-bold text-slate-900"
                              >
                                -
                              </button>
<<<<<<< HEAD
                              <span className="w-5 text-center font-bold text-slate-900">
                                {adults}
                              </span>
=======
                              <span className="w-5 text-center font-bold text-slate-900">{adults}</span>
>>>>>>> origin/main
                              <button
                                type="button"
                                onClick={() => setAdults(adults + 1)}
                                className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center hover:bg-slate-100 font-bold text-slate-900"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-bold text-sm text-slate-900">Niños (2+ años)</p>
<<<<<<< HEAD
                              <p className="text-xs font-semibold text-amber-700">
                                Pagan tarifa plena
                              </p>
=======
                              <p className="text-xs font-semibold text-amber-700">Pagan tarifa plena</p>
>>>>>>> origin/main
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setChildren(Math.max(0, children - 1))}
                                className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center hover:bg-slate-100 font-bold text-slate-900"
                              >
                                -
                              </button>
<<<<<<< HEAD
                              <span className="w-5 text-center font-bold text-slate-900">
                                {children}
                              </span>
=======
                              <span className="w-5 text-center font-bold text-slate-900">{children}</span>
>>>>>>> origin/main
                              <button
                                type="button"
                                onClick={() => setChildren(children + 1)}
                                className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center hover:bg-slate-100 font-bold text-slate-900"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                              Tamaño del grupo
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {GROUP_SIZES.map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setGroupSize(s)}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 transition-all ${
                                    groupSize === s
                                      ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                                      : "border-slate-200 text-slate-800 hover:border-sky-400 bg-white"
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                              <input
                                type="number"
                                min={2}
                                max={200}
                                placeholder="Otro"
                                className="w-16 px-2 py-1.5 rounded-lg text-sm font-bold border-2 border-slate-200 outline-none focus:border-sky-400 text-center text-slate-900"
                                onChange={(e) => {
                                  const v = parseInt(e.target.value);
                                  if (v > 1) setGroupSize(v);
                                }}
                              />
                            </div>
                          </div>
                          <p className="text-xs text-sky-900 font-medium bg-sky-50 rounded-lg px-3 py-2 border border-sky-200">
<<<<<<< HEAD
                            Para grupos, solo se captura el dato del{" "}
                            <strong className="font-bold text-sky-950">representante</strong>. El
                            operador coordinará el listado completo en taquilla.
=======
                            Para grupos, solo se captura el dato del <strong className="font-bold text-sky-950">representante</strong>.
                            El operador coordinará el listado completo en taquilla.
>>>>>>> origin/main
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => setPassengerPanelOpen(false)}
                        className="mt-4 w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow"
                      >
                        Confirmar
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Passenger Forms */}
            <div className="space-y-5">
              <h3 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2.5">
                <Users className="w-6 h-6 text-sky-600" />
                {groupMode === "group"
                  ? `Datos del Representante del Grupo (${groupSize} personas)`
                  : "Datos de los Pasajeros"}
              </h3>

              {groupMode === "group" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border-2 border-sky-300 rounded-2xl p-6 shadow-sm"
                >
                  <p className="text-xs text-sky-800 font-black uppercase tracking-wider mb-4">
                    📋 Representante o Coordinador del Grupo
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-bold text-slate-800 mb-1.5">
                        Nombre Completo del Representante <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full p-3.5 bg-slate-50/70 focus:bg-white border-2 border-slate-200 focus:border-sky-500 rounded-xl text-sm md:text-base font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                        placeholder="Nombre del representante o empresa"
                        value={groupContactName}
                        onChange={(e) => setGroupContactName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-bold text-slate-800 mb-1.5">
                        Teléfono de Contacto <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="tel"
                        className="w-full p-3.5 bg-slate-50/70 focus:bg-white border-2 border-slate-200 focus:border-sky-500 rounded-xl text-sm md:text-base font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                        placeholder="+57 300 000 0000"
                        value={groupContactPhone}
                        onChange={(e) => setGroupContactPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs md:text-sm font-bold text-slate-800 mb-1.5">
                        Correo Electrónico <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="email"
                        className="w-full p-3.5 bg-slate-50/70 focus:bg-white border-2 border-slate-200 focus:border-sky-500 rounded-xl text-sm md:text-base font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                        placeholder="ejemplo@correo.com"
                        value={groupContactEmail}
                        onChange={(e) => setGroupContactEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4 p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs md:text-sm text-amber-900 font-semibold">
                    ⚠️ Para grupos, el listado completo de pasajeros será solicitado por el operador
                    en taquilla el día del embarque.
                  </div>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {passengers.map((pass, index) => (
                    <motion.div
                      key={pass.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.05 }}
                      className="bg-white border-2 border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm"
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <div
                          className={`w-8 h-8 rounded-full bg-gradient-to-br ${tab.accent} text-white text-sm font-black flex items-center justify-center shadow`}
                        >
                          {index + 1}
                        </div>
                        <h4 className="font-bold text-base md:text-lg text-slate-900">
                          Pasajero {index + 1}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-3">
                          <label className="block text-xs md:text-sm font-bold text-slate-800 mb-1.5">
                            Nombre Completo (como en el documento){" "}
                            <span className="text-rose-600">*</span>
                          </label>
                          <input
                            type="text"
                            className="w-full p-3.5 bg-slate-50/70 focus:bg-white border-2 border-slate-200 focus:border-sky-500 rounded-xl text-sm md:text-base font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                            placeholder="Ej. Juan García Pérez"
                            value={pass.name}
                            onChange={(e) => handleUpdatePassenger(index, "name", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs md:text-sm font-bold text-slate-800 mb-1.5">
                            Tipo de Documento
                          </label>
                          <select
                            className="w-full p-3.5 bg-slate-50/70 focus:bg-white border-2 border-slate-200 focus:border-sky-500 rounded-xl text-sm md:text-base font-semibold text-slate-900 outline-none transition-all cursor-pointer"
                            value={pass.docType}
                            onChange={(e) =>
                              handleUpdatePassenger(index, "docType", e.target.value)
                            }
                          >
<<<<<<< HEAD
                            <option
                              value="CC"
                              className="bg-white text-slate-900 font-semibold py-2"
                            >
                              Cédula de Ciudadanía
                            </option>
                            <option
                              value="CE"
                              className="bg-white text-slate-900 font-semibold py-2"
                            >
                              Cédula de Extranjería
                            </option>
                            <option
                              value="TI"
                              className="bg-white text-slate-900 font-semibold py-2"
                            >
                              Tarjeta de Identidad
                            </option>
                            <option
                              value="PAS"
                              className="bg-white text-slate-900 font-semibold py-2"
                            >
=======
                            <option value="CC" className="bg-white text-slate-900 font-semibold py-2">
                              Cédula de Ciudadanía
                            </option>
                            <option value="CE" className="bg-white text-slate-900 font-semibold py-2">
                              Cédula de Extranjería
                            </option>
                            <option value="TI" className="bg-white text-slate-900 font-semibold py-2">
                              Tarjeta de Identidad
                            </option>
                            <option value="PAS" className="bg-white text-slate-900 font-semibold py-2">
>>>>>>> origin/main
                              Pasaporte
                            </option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs md:text-sm font-bold text-slate-800 mb-1.5">
                            Número de Documento <span className="text-rose-600">*</span>
                          </label>
                          <input
                            type="text"
                            className="w-full p-3.5 bg-slate-50/70 focus:bg-white border-2 border-slate-200 focus:border-sky-500 rounded-xl text-sm md:text-base font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                            placeholder="Número"
                            value={pass.docNum}
                            onChange={(e) => handleUpdatePassenger(index, "docNum", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs md:text-sm font-bold text-slate-800 mb-1.5">
                            Teléfono {index === 0 && <span className="text-rose-600">*</span>}
                          </label>
                          <input
                            type="tel"
                            className="w-full p-3.5 bg-slate-50/70 focus:bg-white border-2 border-slate-200 focus:border-sky-500 rounded-xl text-sm md:text-base font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                            placeholder="+57 300 000 0000"
                            value={pass.phone}
                            onChange={(e) => handleUpdatePassenger(index, "phone", e.target.value)}
                            required={index === 0}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-xs md:text-sm font-bold text-slate-800 mb-1.5">
                            Correo Electrónico{" "}
                            {index === 0 && <span className="text-rose-600">*</span>}
                          </label>
                          <input
                            type="email"
                            className="w-full p-3.5 bg-slate-50/70 focus:bg-white border-2 border-slate-200 focus:border-sky-500 rounded-xl text-sm md:text-base font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                            placeholder="ejemplo@correo.com"
                            value={pass.email}
                            onChange={(e) => handleUpdatePassenger(index, "email", e.target.value)}
                            required={index === 0}
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-4 pt-4 border-t border-slate-200">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-sky-600 rounded"
                            checked={pass.petFriendly}
                            onChange={(e) =>
                              handleUpdatePassenger(index, "petFriendly", e.target.checked)
                            }
                          />
                          <span className="text-sm font-bold text-slate-800">
                            Viaja con Mascota (Pet Friendly) 🐾
                          </span>
                        </label>
                        {activeTab === "sol" && (
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              className="w-4 h-4 accent-rose-500 rounded"
                              checked={pass.allergies}
                              onChange={(e) =>
                                handleUpdatePassenger(index, "allergies", e.target.checked)
                              }
                            />
                            <span className="text-sm font-bold text-slate-800">
                              Alergia / No come Pescado 🚫🐟
                            </span>
                          </label>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Terms */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm">
              <div className="flex items-start gap-3.5">
                <input
                  type="checkbox"
                  id="terms-checkbox"
                  className="mt-1 w-5 h-5 accent-sky-600 rounded border-slate-300 cursor-pointer shrink-0"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <div className="flex-1">
                  <label
                    htmlFor="terms-checkbox"
                    className="text-sm md:text-base font-bold text-slate-900 cursor-pointer block"
                  >
                    Acepto los términos y condiciones de viaje
                  </label>
                  <p
                    className="text-xs md:text-sm font-medium text-slate-700 mt-1 leading-relaxed cursor-pointer"
                    onClick={() => setTermsAccepted(!termsAccepted)}
                  >
                    Certifico que los datos ingresados son reales. Entiendo que niños de 2 años en
                    adelante pagan tarifa completa. Este servicio opera bajo la{" "}
<<<<<<< HEAD
                    <strong className="text-slate-900">
                      Alianza de Confianza Turística Portal Necoclí
                    </strong>
                    .
=======
                    <strong className="text-slate-900">Alianza de Confianza Turística Portal Necoclí</strong>.
>>>>>>> origin/main
                  </p>

                  <details className="mt-3 group">
                    <summary className="text-xs md:text-sm text-sky-700 hover:text-sky-800 inline-flex items-center gap-1.5 cursor-pointer font-bold list-none [&::-webkit-details-marker]:hidden bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-lg transition-colors">
                      <span className="group-open:hidden">Leer Contrato para el Cliente ↓</span>
                      <span className="hidden group-open:inline">Ocultar Contrato ↑</span>
                    </summary>
                    <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-700 leading-relaxed max-h-60 overflow-y-auto shadow-inner">
                      <p className="font-black text-slate-900 mb-3 uppercase tracking-wide">
                        Términos y Condiciones del Servicio de Transporte
                      </p>
                      <div className="space-y-3">
                        <p>
<<<<<<< HEAD
                          <strong className="text-slate-900">1. Naturaleza del Servicio:</strong>{" "}
                          Portal Necoclí actúa exclusivamente como corredor tecnológico y canal de
                          enrutamiento para las empresas operadoras marítimas aliadas (ej. Sol y
                          Playa S.A.S, El Caribe S.A.S). La responsabilidad directa sobre la
                          prestación del servicio de transporte, seguridad, itinerarios y
                          cumplimiento normativo recae enteramente sobre la naviera operadora.
                        </p>
                        <p>
                          <strong className="text-slate-900">
                            2. Pre-reserva y Asentamiento de Datos:
                          </strong>{" "}
                          El tiquete generado a través de Portal Necoclí constituye una pre-reserva.
                          El equipo de atención de la naviera asignada se comunicará con el usuario
                          para verificar y asentar la información de los pasajeros y coordinar la
                          reserva formal.
                        </p>
                        <p>
                          <strong className="text-slate-900">3. Garantía de Cupo:</strong> El cupo
                          en la embarcación solo queda 100% asegurado al realizar el pago a las
                          cuentas bancarias oficiales suministradas por la naviera. Si el pasajero
                          decide esperar a pagar en la taquilla el día del zarpe, los puestos quedan
                          sujetos a disponibilidad y existe alta probabilidad de que se agoten antes
                          de su llegada a la taquilla debido a la alta demanda.
                        </p>
                        <p>
                          <strong className="text-slate-900">4. Tarifas y Menores de Edad:</strong>{" "}
                          Las tarifas mostradas son establecidas por la empresa operadora. Por
                          estricta normatividad de seguridad marítima y seguros de vida (DIMAR),
                          todo niño a partir de los 2 años cumplidos ocupa puesto en la embarcación
                          y debe pagar la tarifa completa (100%).
                        </p>
                        <p>
                          <strong className="text-slate-900">5. Cambios y Cancelaciones:</strong>{" "}
                          Los zarpes están estrictamente sujetos a las condiciones climáticas y a la
                          autorización de la Capitanía de Puerto. En caso de cierre temporal de
                          puerto por mal tiempo, las navieras aliadas reprogramarán el servicio
                          según el orden de reservas y la disponibilidad inmediata.
                        </p>
                        <p>
                          <strong className="text-slate-900">6. Tratamiento de Datos:</strong> Al
                          generar esta pre-reserva, el pasajero acepta compartir sus datos de
                          contacto de manera segura con Portal Necoclí y la empresa operadora final,
                          exclusivamente para los fines logísticos y de coordinación del viaje,
                          conforme a la Ley 1581 de 2012 (Habeas Data).
=======
                          <strong className="text-slate-900">1. Naturaleza del Servicio:</strong> Portal Necoclí actúa
                          exclusivamente como corredor tecnológico y canal de enrutamiento para las
                          empresas operadoras marítimas aliadas (ej. Sol y Playa S.A.S, El Caribe
                          S.A.S). La responsabilidad directa sobre la prestación del servicio de
                          transporte, seguridad, itinerarios y cumplimiento normativo recae
                          enteramente sobre la naviera operadora.
                        </p>
                        <p>
                          <strong className="text-slate-900">2. Validez de la Pre-reserva:</strong> El tiquete generado a
                          través de Portal Necoclí garantiza la pre-reserva de su cupo. Para hacer
                          efectiva la reserva, el pasajero debe presentarse en la taquilla de la
                          naviera asignada al menos <strong>45 minutos antes</strong> de la hora de
                          zarpe estipulada para realizar el pago final del servicio y reclamar su
                          pase de abordar.
                        </p>
                        <p>
                          <strong className="text-slate-900">3. Tarifas y Menores de Edad:</strong> Las tarifas mostradas son
                          establecidas por la empresa operadora. Por estricta normatividad de
                          seguridad marítima y seguros de vida (DIMAR), todo niño a partir de los 2
                          años cumplidos ocupa puesto en la embarcación y debe pagar la tarifa
                          completa (100%).
                        </p>
                        <p>
                          <strong className="text-slate-900">4. Cambios y Cancelaciones:</strong> Los zarpes están
                          estrictamente sujetos a las condiciones climáticas y a la autorización de
                          la Capitanía de Puerto. En caso de cierre temporal de puerto por mal
                          tiempo, las navieras aliadas reprogramarán el servicio según el orden de
                          reservas y la disponibilidad inmediata.
                        </p>
                        <p>
                          <strong className="text-slate-900">5. Tratamiento de Datos:</strong> Al generar esta pre-reserva, el
                          pasajero acepta compartir sus datos de contacto de manera segura con
                          Portal Necoclí y la empresa operadora final, exclusivamente para los fines
                          logísticos y de coordinación del viaje, conforme a la Ley 1581 de 2012
                          (Habeas Data).
>>>>>>> origin/main
                        </p>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>

          {/* ══ RIGHT: OCEAN SUMMARY PANEL ══ */}
          <div className="relative flex flex-col bg-gradient-to-b from-[#03045e] via-[#0077b6] to-[#00b4d8] text-white overflow-hidden">
            {/* Animated wave top decoration */}
            <div className="absolute top-0 left-0 right-0 h-20 opacity-20">
              <Waves color="white" />
            </div>

            {/* Moving boat */}
            <motion.div
              className="absolute right-0 top-16 opacity-10"
              animate={{ x: [0, -15, 0], rotate: [0, 2, 0, -2, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Ship className="w-48 h-48" />
            </motion.div>

            <div className="relative z-10 p-6 md:p-8 flex flex-col h-full">
              {/* Trip summary header */}
              <div className="mb-8 text-center relative">
                <TabIcon className="w-10 h-10 mx-auto mb-3 opacity-80" />
                <h3 className="text-xl font-extrabold tracking-wide">{tab.label}</h3>
                <motion.div
                  className="absolute inset-0 flex justify-center items-center opacity-10 pointer-events-none"
                  animate={{ y: [0, -8, 0], rotate: [0, -2, 2, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <TabIcon className="w-64 h-64 text-white" />
                </motion.div>
                <div className="flex items-center justify-center gap-2 mt-1 text-sky-100 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-sky-200" />
                  <span>
                    {origin} → <strong className="text-white font-extrabold">{destination}</strong>
                  </span>
                </div>
                {activeTab === "ruta" && (
                  <p className="text-sky-100 text-xs mt-1.5 uppercase tracking-wide font-bold">
                    {journeyType === "ida" ? "Solo Ida" : "Ida y Vuelta"}
                  </p>
                )}
                {travelDate && (
                  <p className="text-sky-100 text-xs mt-1.5 font-semibold">
                    📅{" "}
                    {new Date(travelDate + "T12:00:00").toLocaleDateString("es-CO", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                )}
              </div>

              {/* Price breakdown */}
              <div className="space-y-3 flex-1">
                <div className="flex justify-between items-center py-3 border-b border-white/20 text-sm">
                  <span className="text-sky-100 font-medium">
                    {groupMode === "group"
                      ? `Grupo de ${groupSize} pers.`
                      : `${totalPassengers} pasajero${totalPassengers > 1 ? "s" : ""}`}
                  </span>
<<<<<<< HEAD
                  <span className="font-extrabold text-white text-base">
                    ${getBasePrice().toLocaleString("es-CO")}
                  </span>
=======
                  <span className="font-extrabold text-white text-base">${getBasePrice().toLocaleString("es-CO")}</span>
>>>>>>> origin/main
                </div>

                {getAccommodationPrice() > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-white/20 text-sm">
                    <span className="text-sky-100 font-medium">Alojamiento</span>
                    <span className="font-extrabold text-white text-base">
                      ${getAccommodationPrice().toLocaleString("es-CO")}
                    </span>
                  </div>
                )}

                {isSolidarityActive && (
                  <div className="flex justify-between items-center py-3 border-b border-white/20 text-sm">
                    <span className="text-rose-200 flex items-center gap-1 font-semibold">
                      ❤️ Aporte Motonecos
                    </span>
                    <span className="font-extrabold text-rose-200 text-base">$5.000</span>
                  </div>
                )}

                <div className="pt-5">
                  <p className="text-sky-200 text-xs uppercase tracking-widest mb-1 font-black">
                    Total Estimado
                  </p>
                  <motion.p
                    key={total}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl md:text-5xl font-black text-white"
                  >
                    ${total.toLocaleString("es-CO")}
                    <span className="text-lg font-bold text-sky-200 ml-1.5">COP</span>
                  </motion.p>
                  <p className="text-xs text-sky-100 font-semibold mt-1.5 mb-4">
<<<<<<< HEAD
                    Impuestos incluidos · Pre-reserva en línea
=======
                    Impuestos incluidos · Pago en taquilla
>>>>>>> origin/main
                  </p>

                  <div className="p-3.5 bg-white/15 rounded-xl border border-white/30 text-xs text-white shadow-sm leading-relaxed">
                    <p className="font-bold text-white mb-1 flex items-center gap-1.5">
                      🧳 Política de Equipaje
                    </p>
                    <p className="font-medium text-sky-50">
                      10 kg incluidos por pasajero. El peso excedente tiene un valor de{" "}
<<<<<<< HEAD
                      <strong className="text-white font-bold">$2.000 COP</strong> por cada kilo
                      adicional (pago exclusivo en taquilla).
=======
                      <strong className="text-white font-bold">$2.000 COP</strong> por cada kilo adicional (pago exclusivo en
                      taquilla).
>>>>>>> origin/main
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-8 space-y-4">
                <motion.button
                  disabled={!termsAccepted || isLoading}
                  onClick={handleGenerateTicket}
                  whileHover={termsAccepted && !isLoading ? { scale: 1.02 } : {}}
                  whileTap={termsAccepted && !isLoading ? { scale: 0.98 } : {}}
                  className={`w-full py-4 rounded-2xl font-black text-base md:text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                    termsAccepted && !isLoading
                      ? "bg-white text-[#0077b6] hover:bg-sky-50 shadow-xl shadow-black/20 hover:shadow-2xl cursor-pointer"
                      : "bg-white/20 text-white/50 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Generando Tiquete...
                    </>
                  ) : (
                    <>
                      <Ship className="w-5 h-5" />
                      {operator === "sol_playa"
                        ? "Pre-reservar con Sol y Playa S.A.S"
                        : operator === "caribe"
                          ? "Pre-reservar con El Caribe S.A.S"
                          : "Generar Tiquete de Pre-reserva"}
                    </>
                  )}
                </motion.button>

                {!termsAccepted && (
                  <p className="text-center text-xs text-sky-100 font-semibold">
                    Acepta los términos para continuar
                  </p>
                )}
                {termsAccepted && !operator && (
                  <p className="text-center text-xs text-amber-200 font-bold animate-pulse">
                    ⚠️ Selecciona una naviera arriba para continuar
                  </p>
                )}

                {/* Footer logos */}
                <div className="pt-5 border-t border-white/20 text-center space-y-3">
                  <Image
                    src="https://res.cloudinary.com/dwxk79gt0/image/upload/v1747861208/logo-kraken-blanco-negro_om3uor.png"
                    alt="Kraken Digital Labs"
                    width={90}
                    height={28}
                    className="mx-auto opacity-50 invert"
                  />
                  <p className="text-xs text-sky-100 font-medium leading-relaxed">
                    Alianza tecnológica Kraken Digital Labs
                    <br />
<<<<<<< HEAD
                    <strong className="text-white font-bold">Sol y Playa S.A.S</strong> · NIT:
                    901797992-1
                    <br />
                    <strong className="text-white font-bold">El Caribe S.A.S</strong> · NIT:
                    901000756-8
=======
                    <strong className="text-white font-bold">Sol y Playa S.A.S</strong> · NIT: 901797992-1
                    <br />
                    <strong className="text-white font-bold">El Caribe S.A.S</strong> · NIT: 901000756-8
>>>>>>> origin/main
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Heart icon for the summary panel
const Heart = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);
