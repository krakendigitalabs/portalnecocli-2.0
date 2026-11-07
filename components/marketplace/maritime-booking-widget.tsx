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
import { DiaDeSolInfo } from "./dia-de-sol-info";
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
  const [operator, setOperator] = useState<"caribe" | "sol_playa">("caribe");
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
    window.addEventListener("change-booking-tab", handleTabChange as EventListener);
    return () => window.removeEventListener("change-booking-tab", handleTabChange as EventListener);
  }, []);

  useEffect(() => {
    if (activeTab === "sol") {
      setOrigin("Necoclí");
      setDestination("Día de Sol: Playa Soledad y Sapzurro");
    } else if (destination.startsWith("Día de Sol")) {
      setOrigin("Necoclí");
      setDestination("Capurganá");
    }
  }, [activeTab]);

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
      return 210000 * totalPassengers; // Siempre ida y vuelta
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
        operator,
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
        <div className="border-b border-gray-100 px-2 md:px-8 pt-0 bg-gray-50 overflow-x-auto no-scrollbar">
          <div className="flex gap-0 -mb-px min-w-max">
            {(["ruta", "sol", "yate"] as TabType[]).map((t) => {
              const cfg = TAB_CONFIG[t];
              const Icon = cfg.icon;
              const active = activeTab === t;
              return (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`relative flex items-center gap-2 px-4 md:px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                    active
                      ? "border-current text-gray-900"
                      : "border-transparent text-gray-400 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
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
            <div
              className={`grid grid-cols-2 md:grid-cols-3 ${activeTab === "ruta" ? "lg:grid-cols-6" : "lg:grid-cols-5"} gap-3 md:gap-4`}
            >
              {/* Origin */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 hover:border-gray-400 transition-colors relative">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Origen
                </p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                  {activeTab === "sol" ? (
                    <span className="font-semibold text-gray-800">Necoclí</span>
                  ) : (
                    <select
                      className="w-full bg-transparent font-semibold text-gray-800 outline-none appearance-none cursor-pointer pr-5"
                      value={origin}
                      onChange={(e) => handleOriginChange(e.target.value)}
                    >
                      <option>Necoclí</option>
                      <option>Capurganá</option>
                      <option>Triganá</option>
                      <option>Acandí</option>
                    </select>
                  )}
                  {activeTab !== "sol" && (
                    <ChevronDown className="w-3.5 h-3.5 absolute right-3 bottom-4 text-gray-400 pointer-events-none" />
                  )}
                </div>
              </div>

              {/* Naviera / Operador */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 hover:border-gray-400 transition-colors relative">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Naviera
                </p>
                <select
                  className="w-full bg-transparent font-semibold text-gray-800 outline-none appearance-none cursor-pointer pr-5 text-sm"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value as "caribe" | "sol_playa")}
                >
                  <option value="caribe">El Caribe S.A.S</option>
                  <option value="sol_playa">Sol y Playa S.A.S</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-3 bottom-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Destination */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 hover:border-gray-400 transition-colors relative">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Destino
                </p>
                <select
                  className="w-full bg-transparent font-semibold text-gray-800 outline-none appearance-none cursor-pointer pr-5"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  {activeTab === "sol" ? (
                    <option>Día de Sol: Playa Soledad y Sapzurro</option>
                  ) : (
                    <>
                      {origin !== "Capurganá" && <option>Capurganá</option>}
                      {origin !== "Triganá" && <option>Triganá</option>}
                      {origin !== "Acandí" && <option>Acandí</option>}
                      {origin !== "Necoclí" && <option>Necoclí</option>}
                      {origin === "Necoclí" && (
                        <>
                          <option>Playa Soledad</option>
                          <option>Bahía Aguacate</option>
                        </>
                      )}
                    </>
                  )}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-3 bottom-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Tipo de Trayecto (Only for ruta) */}
              {activeTab === "ruta" && (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 hover:border-gray-400 transition-colors relative">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Trayecto
                  </p>
                  <select
                    className="w-full bg-transparent font-semibold text-gray-800 outline-none appearance-none cursor-pointer pr-5 text-sm"
                    value={journeyType}
                    onChange={(e) => setJourneyType(e.target.value as "ida" | "ida_vuelta")}
                  >
                    <option value="ida">Ida (One-way)</option>
                    <option value="ida_vuelta">Ida y Vuelta</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-3 bottom-4 text-gray-400 pointer-events-none" />
                </div>
              )}

              {/* Date */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 hover:border-gray-400 transition-colors">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Fecha de Viaje <span className="text-rose-500 text-xs">*</span>
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-500 shrink-0" />
                  <input
                    type="date"
                    className="bg-transparent font-semibold text-gray-800 outline-none w-full text-sm cursor-pointer"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Passengers selector */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 hover:border-gray-400 transition-colors relative">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Pasajeros
                </p>
                <button
                  type="button"
                  onClick={() => setPassengerPanelOpen((v) => !v)}
                  className="flex items-center justify-between w-full font-semibold text-gray-800"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-sky-500" />
                    {totalPassengers}{" "}
                    {groupMode === "group"
                      ? "en grupo"
                      : totalPassengers > 1
                        ? "pasajeros"
                        : "pasajero"}
                  </span>
                  {passengerPanelOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                <AnimatePresence>
                  {passengerPanelOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full right-0 lg:right-auto lg:left-0 mt-2 w-[calc(100vw-2.5rem)] max-w-[320px] bg-white border border-gray-200 shadow-2xl rounded-2xl p-4 sm:p-5 z-30"
                    >
                      {/* Mode toggle */}
                      <div className="flex gap-2 mb-5 bg-gray-100 rounded-xl p-1">
                        <button
                          onClick={() => setGroupMode("individual")}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${groupMode === "individual" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
                        >
                          <UserPlus className="w-3.5 h-3.5" /> Individual
                        </button>
                        <button
                          onClick={() => setGroupMode("group")}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${groupMode === "group" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
                        >
                          <Building2 className="w-3.5 h-3.5" /> Grupo / Empresa
                        </button>
                      </div>

                      {groupMode === "individual" ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-sm text-gray-800">Adultos</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setAdults(Math.max(1, adults - 1))}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 font-bold"
                              >
                                -
                              </button>
                              <span className="w-5 text-center font-semibold">{adults}</span>
                              <button
                                type="button"
                                onClick={() => setAdults(adults + 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-sm text-gray-800">Niños (2+ años)</p>
                              <p className="text-xs text-amber-600">Pagan tarifa plena</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setChildren(Math.max(0, children - 1))}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 font-bold"
                              >
                                -
                              </button>
                              <span className="w-5 text-center font-semibold">{children}</span>
                              <button
                                type="button"
                                onClick={() => setChildren(children + 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                              Tamaño del grupo
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {GROUP_SIZES.map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setGroupSize(s)}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                                    groupSize === s
                                      ? "bg-sky-600 text-white border-sky-600"
                                      : "border-gray-200 text-gray-700 hover:border-sky-400"
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
                                className="w-16 px-2 py-1.5 rounded-lg text-sm font-semibold border border-gray-200 outline-none focus:border-sky-400 text-center"
                                onChange={(e) => {
                                  const v = parseInt(e.target.value);
                                  if (v > 1) setGroupSize(v);
                                }}
                              />
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 bg-sky-50 rounded-lg px-3 py-2 border border-sky-100">
                            Para grupos, solo se captura el dato del <strong>representante</strong>.
                            El operador coordinará el listado completo en taquilla.
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => setPassengerPanelOpen(false)}
                        className="mt-4 w-full py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors"
                      >
                        Confirmar
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Passenger Forms */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-500" />
                {groupMode === "group"
                  ? `Datos del Representante del Grupo (${groupSize} personas)`
                  : "Datos de los Pasajeros"}
              </h3>

              {groupMode === "group" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-6"
                >
                  <p className="text-xs text-sky-700 font-semibold uppercase tracking-wider mb-4">
                    📋 Representante o Coordinador del Grupo
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Nombre Completo del Representante <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 outline-none"
                        placeholder="Nombre del representante o empresa"
                        value={groupContactName}
                        onChange={(e) => setGroupContactName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Teléfono de Contacto <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 outline-none"
                        placeholder="+57 300 000 0000"
                        value={groupContactPhone}
                        onChange={(e) => setGroupContactPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Correo Electrónico <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 outline-none"
                        placeholder="ejemplo@correo.com"
                        value={groupContactEmail}
                        onChange={(e) => setGroupContactEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
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
                      className="bg-gray-50 border border-gray-200 rounded-2xl p-4 md:p-5"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div
                          className={`w-7 h-7 rounded-full bg-gradient-to-br ${tab.accent} text-white text-xs font-bold flex items-center justify-center shadow`}
                        >
                          {index + 1}
                        </div>
                        <h4 className="font-semibold text-gray-800">Pasajero {index + 1}</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-3">
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Nombre Completo (como en el documento){" "}
                            <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 outline-none"
                            placeholder="Ej. Juan García Pérez"
                            value={pass.name}
                            onChange={(e) => handleUpdatePassenger(index, "name", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Tipo de Documento
                          </label>
                          <select
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 outline-none"
                            value={pass.docType}
                            onChange={(e) =>
                              handleUpdatePassenger(index, "docType", e.target.value)
                            }
                          >
                            <option value="CC">Cédula de Ciudadanía</option>
                            <option value="CE">Cédula de Extranjería</option>
                            <option value="TI">Tarjeta de Identidad</option>
                            <option value="PAS">Pasaporte</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Número de Documento <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 outline-none"
                            placeholder="Número"
                            value={pass.docNum}
                            onChange={(e) => handleUpdatePassenger(index, "docNum", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Teléfono {index === 0 && <span className="text-rose-500">*</span>}
                          </label>
                          <input
                            type="tel"
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 outline-none"
                            placeholder="+57 300 000 0000"
                            value={pass.phone}
                            onChange={(e) => handleUpdatePassenger(index, "phone", e.target.value)}
                            required={index === 0}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Correo Electrónico{" "}
                            {index === 0 && <span className="text-rose-500">*</span>}
                          </label>
                          <input
                            type="email"
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 outline-none"
                            placeholder="ejemplo@correo.com"
                            value={pass.email}
                            onChange={(e) => handleUpdatePassenger(index, "email", e.target.value)}
                            required={index === 0}
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-4 pt-3 border-t border-gray-100">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-sky-600 rounded"
                            checked={pass.petFriendly}
                            onChange={(e) =>
                              handleUpdatePassenger(index, "petFriendly", e.target.checked)
                            }
                          />
                          <span className="text-sm text-gray-700">
                            Viaja con Mascota (Pet Friendly) 🐾
                          </span>
                        </label>
                        {activeTab === "sol" && (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              className="w-4 h-4 accent-rose-500 rounded"
                              checked={pass.allergies}
                              onChange={(e) =>
                                handleUpdatePassenger(index, "allergies", e.target.checked)
                              }
                            />
                            <span className="text-sm text-gray-700">
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

            {/* Solidarity - DESACTIVADO HASTA NUEVA ORDEN */}
            {/* <SolidarityBanner isActive={isSolidarityActive} onToggle={setIsSolidarityActive} /> */}

            {/* Terms */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms-checkbox"
                  className="mt-0.5 w-5 h-5 accent-sky-600 rounded border-gray-300 cursor-pointer"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <div className="flex-1">
                  <label
                    htmlFor="terms-checkbox"
                    className="text-sm font-semibold text-gray-900 cursor-pointer"
                  >
                    Acepto los términos y condiciones de viaje
                  </label>
                  <p
                    className="text-xs text-gray-500 mt-1 leading-relaxed cursor-pointer"
                    onClick={() => setTermsAccepted(!termsAccepted)}
                  >
                    Certifico que los datos ingresados son reales. Entiendo que niños de 2 años en
                    adelante pagan tarifa completa. Este servicio opera bajo la{" "}
                    <strong>Alianza de Confianza Turística Portal Necoclí</strong>.
                  </p>

                  <details className="mt-3 group">
                    <summary className="text-xs text-sky-600 hover:text-sky-700 inline-flex items-center gap-1 cursor-pointer font-bold list-none [&::-webkit-details-marker]:hidden bg-sky-50/50 hover:bg-sky-50 px-2 py-1 rounded transition-colors">
                      <span className="group-open:hidden">Leer Contrato para el Cliente ↓</span>
                      <span className="hidden group-open:inline">Ocultar Contrato ↑</span>
                    </summary>
                    <div className="mt-3 p-4 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-600 leading-relaxed max-h-60 overflow-y-auto shadow-inner">
                      <p className="font-bold text-gray-800 mb-3 uppercase tracking-wide">
                        Términos y Condiciones del Servicio de Transporte
                      </p>
                      <div className="space-y-3">
                        <p>
                          <strong>1. Naturaleza del Servicio:</strong> Portal Necoclí actúa
                          exclusivamente como corredor tecnológico y canal de enrutamiento para las
                          empresas operadoras marítimas aliadas (ej. El Caribe S.A.S, Sol y Playa
                          S.A.S). La responsabilidad directa sobre la prestación del servicio de
                          transporte, seguridad, itinerarios y cumplimiento normativo recae
                          enteramente sobre la naviera operadora.
                        </p>
                        <p>
                          <strong>2. Validez de la Pre-reserva:</strong> El tiquete generado a
                          través de Portal Necoclí garantiza la pre-reserva de su cupo. Para hacer
                          efectiva la reserva, el pasajero debe presentarse en la taquilla de la
                          naviera asignada al menos <strong>45 minutos antes</strong> de la hora de
                          zarpe estipulada para realizar el pago final del servicio y reclamar su
                          pase de abordar.
                        </p>
                        <p>
                          <strong>3. Tarifas y Menores de Edad:</strong> Las tarifas mostradas son
                          establecidas por la empresa operadora. Por estricta normatividad de
                          seguridad marítima y seguros de vida (DIMAR), todo niño a partir de los 2
                          años cumplidos ocupa puesto en la embarcación y debe pagar la tarifa
                          completa (100%).
                        </p>
                        <p>
                          <strong>4. Cambios y Cancelaciones:</strong> Los zarpes están
                          estrictamente sujetos a las condiciones climáticas y a la autorización de
                          la Capitanía de Puerto. En caso de cierre temporal de puerto por mal
                          tiempo, las navieras aliadas reprogramarán el servicio según el orden de
                          reservas y la disponibilidad inmediata.
                        </p>
                        <p>
                          <strong>5. Tratamiento de Datos:</strong> Al generar esta pre-reserva, el
                          pasajero acepta compartir sus datos de contacto de manera segura con
                          Portal Necoclí y la empresa operadora final, exclusivamente para los fines
                          logísticos y de coordinación del viaje, conforme a la Ley 1581 de 2012
                          (Habeas Data).
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
                <div className="flex items-center justify-center gap-2 mt-1 text-sky-200 text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {origin} → <strong className="text-white">{destination}</strong>
                  </span>
                </div>
                {activeTab === "ruta" && (
                  <p className="text-sky-200 text-xs mt-1 uppercase tracking-wide font-semibold">
                    {journeyType === "ida" ? "Solo Ida" : "Ida y Vuelta"}
                  </p>
                )}
                {travelDate && (
                  <p className="text-sky-200 text-xs mt-1">
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
                  <span className="text-sky-200">
                    {groupMode === "group"
                      ? `Grupo de ${groupSize} pers.`
                      : `${totalPassengers} pasajero${totalPassengers > 1 ? "s" : ""}`}
                  </span>
                  <span className="font-semibold">${getBasePrice().toLocaleString("es-CO")}</span>
                </div>

                {getAccommodationPrice() > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-white/20 text-sm">
                    <span className="text-sky-200">Alojamiento</span>
                    <span className="font-semibold">
                      ${getAccommodationPrice().toLocaleString("es-CO")}
                    </span>
                  </div>
                )}

                {isSolidarityActive && (
                  <div className="flex justify-between items-center py-3 border-b border-white/20 text-sm">
                    <span className="text-rose-300 flex items-center gap-1">
                      ❤️ Aporte Motonecos
                    </span>
                    <span className="font-semibold text-rose-300">$5.000</span>
                  </div>
                )}

                <div className="pt-5">
                  <p className="text-sky-300 text-xs uppercase tracking-widest mb-1">
                    Total Estimado
                  </p>
                  <motion.p
                    key={total}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl font-black"
                  >
                    ${total.toLocaleString("es-CO")}
                    <span className="text-base font-normal text-sky-300 ml-1">COP</span>
                  </motion.p>
                  <p className="text-xs text-sky-300 mt-1 mb-4">
                    Impuestos incluidos · Pago en taquilla
                  </p>

                  <div className="p-3 bg-white/10 rounded-xl border border-white/20 text-xs text-sky-100 shadow-sm">
                    <p className="font-semibold text-white mb-1 flex items-center gap-1.5">
                      🧳 Política de Equipaje
                    </p>
                    <p>
                      10 kg incluidos por pasajero. El peso excedente tiene un valor de{" "}
                      <strong>$2.000 COP</strong> por cada kilo adicional (pago exclusivo en
                      taquilla).
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
                  className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 ${
                    termsAccepted && !isLoading
                      ? "bg-white text-[#0077b6] shadow-xl shadow-black/20 hover:shadow-2xl"
                      : "bg-white/20 text-white/40 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Generando Tiquete...
                    </>
                  ) : (
                    <>
                      <Ship className="w-5 h-5" /> Generar Tiquete de Pre-reserva
                    </>
                  )}
                </motion.button>

                {!termsAccepted && (
                  <p className="text-center text-xs text-sky-300">
                    Acepta los términos para continuar
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
                  <p className="text-[10px] text-sky-300 leading-relaxed">
                    Alianza tecnológica Kraken Digital Labs
                    <br />
                    Sol y Playa S.A.S · NIT: 901797992-1
                    <br />
                    El Caribe S.A.S · NIT: 901000756-8
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── DÍA DE SOL INFO ── */}
      {activeTab === "sol" && (
        <div className="mt-16 w-full">
          <DiaDeSolInfo operator={operator} />
        </div>
      )}
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
