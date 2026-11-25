"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { EditorialShareBar } from "@/components/blog/editorial-share-bar";
import {
    Anchor,
    ArrowLeft,
    ArrowRight,
    Backpack,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    Compass,
    Luggage,
    MapPin,
    PawPrint,
    ShieldCheck,
    Ship,
    Sparkles,
    Sun,
    Ticket,
    Waves,
    Wind,
} from "lucide-react";

type SeasonKey = "brisa" | "calma";
type NavieraTab = "sol-y-playa" | "el-caribe";

const TIMELINE_NAV = [
    { id: "etapa-1", label: "01 · La noche anterior", time: "Día previo" },
    { id: "etapa-2", label: "02 · Base Náutica", time: "6:00 - 7:00 a.m." },
    { id: "etapa-3", label: "03 · Zarpe y tarifas", time: "8:00 a.m." },
    { id: "etapa-4", label: "04 · Ruta o Día de Sol", time: "Tu plan" },
    { id: "etapa-5", label: "05 · Qué empacar", time: "Checklist" },
    { id: "etapa-6", label: "06 · Asegura tu cupo", time: "Pre-reserva" },
];

const ROUTES_2026 = [
    { route: "Necoclí → Capurganá", oneWay: "$95.000", roundTrip: "$190.000", type: "Ruta diaria" },
    { route: "Necoclí → Acandí", oneWay: "$85.000", roundTrip: "$170.000", type: "Ruta diaria" },
    { route: "Necoclí → Triganá", oneWay: "$75.000", roundTrip: "$150.000", type: "Ruta diaria" },
    { route: "Necoclí → Playa Soledad", oneWay: "$95.000", roundTrip: "$190.000", type: "Ruta especial" },
    { route: "Necoclí → Bahía Aguacate", oneWay: "$95.000", roundTrip: "$190.000", type: "Sujeta a clima" },
];

const PACKING_BY_SEASON: Record<
    SeasonKey,
    {
        title: string;
        months: string;
        summary: string;
        badge: string;
        items: string[];
    }
> = {
    brisa: {
        title: "Temporada de brisa y oleaje",
        months: "Enero a Marzo",
        badge: "Viento fresco en el golfo",
        summary:
            "La brisa marina es más intensa. Empacar con protección contra salpicaduras hace el viaje mucho más cómodo.",
        items: [
            "Bolsa seca o funda impermeable para celular y documentos",
            "Chaqueta rompevientos ligera para la travesía de la mañana",
            "Medicamento para el mareo (tomar 30 min antes) y elegir puestos traseros",
            "Gorra bien ajustada y gafas con cordón",
        ],
    },
    calma: {
        title: "Mar calmo y máxima visibilidad",
        months: "Abril a Noviembre",
        badge: "Ideal para snorkel y tortugas",
        summary:
            "El oleaje baja y las aguas entre Acandí y la frontera se vuelven cristalinas. Entre abril y mayo llegan las tortugas marinas.",
        items: [
            "Careta o equipo ligero de snorkel para arrecifes y corales",
            "Bloqueador solar amigable con el ecosistema marino",
            "Ropa fresca de secado rápido y sombrero",
            "Cámara acuática o funda sumergible",
        ],
    },
};

const ESSENTIALS_CHECKLIST = [
    "Cédula original (colombianos) o pasaporte vigente (extranjeros)",
    "Registro civil o tarjeta de identidad si viajan menores",
    "Efectivo en billetes pequeños para tasas portuarias e hidratación",
    "Sandalias con agarre o escarpines que puedan mojarse",
    "Equipaje dentro de los 10 kg incluidos (extra: $2.000 COP/kg en taquilla)",
];

function RevealStep({
    id,
    stepNumber,
    timeBadge,
    title,
    icon,
    children,
}: {
    id: string;
    stepNumber: string;
    timeBadge: string;
    title: string;
    icon: ReactNode;
    children: ReactNode;
}) {
    const ref = useRef<HTMLElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            id={id}
            ref={ref}
            className={`relative scroll-mt-28 pl-8 sm:pl-12 pb-14 last:pb-0 transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
        >
            <span
                aria-hidden="true"
                className="absolute left-[15px] sm:left-[19px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/70 via-teal-400/40 to-slate-200"
            />

            <div
                className={`absolute left-0 top-0 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 shadow-md transition-transform duration-500 ${visible
                    ? "scale-100 border-emerald-600 bg-emerald-600 text-white"
                    : "scale-75 border-slate-300 bg-white text-slate-400"
                    }`}
            >
                {icon}
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-black tracking-wider text-white">
                    ETAPA {stepNumber}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-800">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {timeBadge}
                </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-4">
                {title}
            </h2>

            <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-sm hover:shadow-md transition-shadow duration-300">
                {children}
            </div>
        </section>
    );
}

export function GuiaNecocliCapurganaCronologica() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeStage, setActiveStage] = useState("etapa-1");
    const [season, setSeason] = useState<SeasonKey>("calma");
    const [navieraTab, setNavieraTab] = useState<NavieraTab>("sol-y-playa");
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            setScrollProgress(
                docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0,
            );

            for (let i = TIMELINE_NAV.length - 1; i >= 0; i--) {
                const section = document.getElementById(TIMELINE_NAV[i].id);
                if (section && section.getBoundingClientRect().top <= 180) {
                    setActiveStage(TIMELINE_NAV[i].id);
                    break;
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleCheck = (item: string) => {
        setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));
    };

    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    const activeSeason = PACKING_BY_SEASON[season];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30 text-slate-800">
            <div
                aria-hidden="true"
                className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-slate-200/70 backdrop-blur-sm"
            >
                <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-[width] duration-150 ease-out"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            <header className="relative overflow-hidden bg-[#0b1f1a] text-white pt-12 pb-16 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl"
                />

                <div className="relative mx-auto max-w-5xl">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-300 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        Volver al Blog de Necoclí
                    </Link>

                    <div className="flex flex-wrap items-center gap-2.5 mb-5">
                        <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                            Transporte · Guía Cronológica 2026
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                            <Clock className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                            6 min de lectura
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                            <Calendar className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                            Actualizado 2026
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-[54px] font-black tracking-tight leading-[1.08] max-w-4xl">
                        Guía definitiva de Necoclí a Capurganá 2026:{" "}
                        <span className="text-emerald-400">
                            lanchas, horarios, precios y qué llevar
                        </span>
                    </h1>

                    <p className="mt-5 max-w-3xl text-base sm:text-lg text-slate-200 leading-relaxed">
                        Sigue este recorrido paso a paso, en orden cronológico, desde la noche previa en Necoclí hasta que pises las aguas cristalinas de Capurganá. Todo lo que necesitas saber para navegar seguro y sin filas.
                    </p>

                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: "Travesía rápida", value: "~1h 15 min" },
                            { label: "Zarpe diario", value: "8:00 a.m." },
                            { label: "Equipaje incluido", value: "10 kg / pax" },
                            { label: "Muelle oficial", value: "Base Náutica" },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
                            >
                                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                                    {stat.label}
                                </p>
                                <p className="mt-0.5 text-lg font-black text-white">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="grid gap-10 lg:grid-cols-12 items-start">
                    <aside className="hidden lg:block lg:col-span-4 sticky top-10 space-y-5">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 mb-4 flex items-center gap-2">
                                <Compass className="h-4 w-4" aria-hidden="true" />
                                Ruta de lectura cronológica
                            </p>

                            <nav aria-label="Etapas del viaje" className="space-y-1.5">
                                {TIMELINE_NAV.map((item) => {
                                    const isActive = activeStage === item.id;
                                    return (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            className={`flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all ${isActive
                                                ? "bg-emerald-600 text-white shadow-sm translate-x-1"
                                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                }`}
                                        >
                                            <span>{item.label}</span>
                                            <span
                                                className={`text-[10px] ${isActive ? "text-emerald-100" : "text-slate-400"
                                                    }`}
                                            >
                                                {item.time}
                                            </span>
                                        </a>
                                    );
                                })}
                            </nav>

                            <div className="mt-6 pt-5 border-t border-slate-100">
                                <Link
                                    href="/reservas-maritimas"
                                    className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-xs font-extrabold text-white shadow-md hover:bg-emerald-700 transition-colors"
                                >
                                    <Ship className="h-4 w-4" aria-hidden="true" />
                                    <span>Ir a Reservas Marítimas</span>
                                </Link>
                            </div>
                        </div>
                    </aside>

                    <article className="lg:col-span-8">
                        <RevealStep
                            id="etapa-1"
                            stepNumber="01"
                            timeBadge="La tarde anterior"
                            title="¿Por qué zarpar desde Necoclí es tan fácil y beneficioso?"
                            icon={<MapPin className="h-4 w-4" aria-hidden="true" />}
                        >
                            <p className="text-slate-600 leading-relaxed mb-5">
                                Capurganá es un paraíso al que <strong>no se llega por carretera</strong>, lo que mantiene intactos sus arrecifes y su tranquilidad. Comenzar tu travesía en Necoclí convierte el traslado en parte del descanso:
                            </p>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {[
                                    {
                                        title: "Travesía ágil (~1h 15 min)",
                                        desc: "Un cruce cómodo y directo por el Golfo de Urabá, ideal para familias con niños y adultos mayores.",
                                    },
                                    {
                                        title: "Todo a minutos del muelle",
                                        desc: "Llegas el día anterior, duermes frente al mar, cenas comida caribeña y estás en el muelle en menos de 10 minutos.",
                                    },
                                    {
                                        title: "Movilidad local al instante",
                                        desc: "Pide motocarro o mototaxi con tarifa clara y rastreo GPS hacia el muelle en Neco-Dispatch.",
                                    },
                                    {
                                        title: "Dos viajes en uno",
                                        desc: "Aprovecha para disfrutar las playas y volcanes de lodo de Necoclí antes o después de ir a Capurganá.",
                                    },
                                ].map((benefit) => (
                                    <div
                                        key={benefit.title}
                                        className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 hover:border-emerald-200 transition-colors"
                                    >
                                        <p className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" aria-hidden="true" />
                                            {benefit.title}
                                        </p>
                                        <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                                            {benefit.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 px-4 py-3 text-xs">
                                <span className="font-semibold text-emerald-950">
                                    ¿Necesitas motocarro desde tu hotel hasta la Base Náutica?
                                </span>
                                <Link
                                    href="/turismo-local"
                                    className="font-extrabold text-emerald-700 hover:underline inline-flex items-center gap-1"
                                >
                                    Pedir en Turismo Local <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                                </Link>
                            </div>
                        </RevealStep>

                        <RevealStep
                            id="etapa-2"
                            stepNumber="02"
                            timeBadge="6:00 a.m. – 7:00 a.m."
                            title="Llegada a la Base Náutica y check-in oficial"
                            icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />}
                        >
                            <p className="text-slate-600 leading-relaxed mb-5">
                                La mañana del viaje comienza en la <strong>Base Náutica de Necoclí</strong>, el <strong>único punto autorizado</strong> por la Dirección General Marítima (<strong>DIMAR</strong>) y la Alcaldía de Necoclí para el embarque de pasajeros.
                            </p>

                            <ul className="space-y-3 text-sm text-slate-700">
                                <li className="flex items-start gap-2.5">
                                    <Ticket className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                                    <span>
                                        <strong>Preséntate 45 min a 1 hora antes:</strong> con tu tiquete de pre-reserva aseguras tu cupo, pagas en la taquilla de la naviera asignada y reclamas tu pase de abordar.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <Luggage className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                                    <span>
                                        <strong>Política de equipaje:</strong> cada pasajero tiene <strong>10 kg incluidos</strong>. El peso adicional cuesta <strong>$2.000 COP por kilo</strong> (pago en taquilla).
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <PawPrint className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                                    <span>
                                        <strong>Viaje Pet Friendly:</strong> puedes viajar con tu mascota llevando su carnet de vacunación y bozal o guacal según corresponda.
                                    </span>
                                </li>
                            </ul>

                            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-xs sm:text-sm text-amber-950">
                                <strong>Importante (normativa DIMAR):</strong> todo niño a partir de los <strong>2 años cumplidos</strong> ocupa puesto y paga tarifa plena (100%). Además, todos los zarpes están sujetos a autorización climática diaria de la Capitanía de Puerto.
                            </div>
                        </RevealStep>

                        <RevealStep
                            id="etapa-3"
                            stepNumber="03"
                            timeBadge="8:00 a.m. · Zarpe diario"
                            title="Horarios y tarifas oficiales de referencia 2026"
                            icon={<Anchor className="h-4 w-4" aria-hidden="true" />}
                        >
                            <p className="text-slate-600 leading-relaxed mb-5">
                                Las lanchas de ruta diaria zarpan habitualmente a las <strong>8:00 a.m.</strong> desde Necoclí (en temporada alta pueden habilitarse horarios extra). El regreso regular desde Capurganá opera alrededor de las <strong>9:00 a.m.</strong>
                            </p>

                            <div className="overflow-x-auto rounded-2xl border border-slate-200">
                                <table className="w-full text-left text-xs sm:text-sm">
                                    <thead className="bg-slate-900 text-white">
                                        <tr>
                                            <th className="px-4 py-3 font-bold">Ruta desde Necoclí</th>
                                            <th className="px-4 py-3 font-bold">Solo ida</th>
                                            <th className="px-4 py-3 font-bold">Ida y vuelta</th>
                                            <th className="px-4 py-3 font-bold">Modalidad</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {ROUTES_2026.map((row) => (
                                            <tr
                                                key={row.route}
                                                className="hover:bg-emerald-50/50 transition-colors"
                                            >
                                                <td className="px-4 py-3 font-extrabold text-slate-900">
                                                    {row.route}
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-slate-700">
                                                    {row.oneWay}
                                                </td>
                                                <td className="px-4 py-3 font-black text-emerald-700">
                                                    {row.roundTrip}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                                                        {row.type}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </RevealStep>

                        <RevealStep
                            id="etapa-4"
                            stepNumber="04"
                            timeBadge="Elige tu experiencia"
                            title="¿Ruta Diaria o Plan Día de Sol? Compara nuestras navieras"
                            icon={<Sun className="h-4 w-4" aria-hidden="true" />}
                        >
                            <p className="text-slate-600 leading-relaxed mb-5">
                                Si vas a hospedarte varias noches en Capurganá, elige <strong>Ruta Diaria</strong>. Si tu base es Necoclí y quieres recorrer playas del Darién e incluso cruzar a Panamá regresando el mismo día, elige un <strong>Plan Día de Sol</strong> con cualquiera de nuestras dos navieras oficiales:
                            </p>

                            <div className="grid grid-cols-2 gap-3 mb-5" role="tablist">
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={navieraTab === "sol-y-playa"}
                                    onClick={() => setNavieraTab("sol-y-playa")}
                                    className={`rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${navieraTab === "sol-y-playa"
                                        ? "border-amber-500 bg-amber-50 shadow-sm ring-2 ring-amber-400/30"
                                        : "border-slate-200 bg-white hover:border-amber-300"
                                        }`}
                                >
                                    <p className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                                        <Sun className="h-4 w-4 text-amber-500" aria-hidden="true" />
                                        Sol y Playa S.A.S
                                    </p>
                                    <p className="text-[11px] text-slate-600 mt-0.5">
                                        Día de Sol · 3 Playas
                                    </p>
                                </button>

                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={navieraTab === "el-caribe"}
                                    onClick={() => setNavieraTab("el-caribe")}
                                    className={`rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${navieraTab === "el-caribe"
                                        ? "border-cyan-600 bg-cyan-50 shadow-sm ring-2 ring-cyan-500/25"
                                        : "border-slate-200 bg-white hover:border-cyan-300"
                                        }`}
                                >
                                    <p className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                                        <Waves className="h-4 w-4 text-cyan-600" aria-hidden="true" />
                                        El Caribe S.A.S
                                    </p>
                                    <p className="text-[11px] text-slate-600 mt-0.5">
                                        2 opciones de Día de Sol
                                    </p>
                                </button>
                            </div>

                            {navieraTab === "sol-y-playa" ? (
                                <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/70 to-white p-5">
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                        <h3 className="text-lg font-black text-slate-900">
                                            Día de Sol · 3 Playas
                                        </h3>
                                        <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-black text-white">
                                            $210.000 COP / pax
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                                        Visita <strong>Sapzurro, La Miel (Panamá) y Playa Soledad</strong> en una jornada. Incluye transporte ida y regreso, 2 refrigerios, almuerzo típico, guía acompañante, póliza de seguro y <strong>parqueadero gratis</strong> en Necoclí.
                                    </p>
                                    <p className="mt-3 text-xs font-bold text-amber-900">
                                        Check-in: 6:00 a.m. · Salida: 7:00 a.m. · Regreso aprox.: 4:00 p.m.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50/60 to-white p-4">
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <h3 className="text-sm font-black text-slate-900">
                                                Playa Soledad y Sapzurro
                                            </h3>
                                            <span className="rounded-full bg-cyan-700 px-2.5 py-0.5 text-[11px] font-black text-white">
                                                $210.000
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-700 leading-relaxed">
                                            Transporte ida y vuelta, refrigerio, almuerzo, guía turístico y póliza de viaje en flota de yates turísticos.
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-cyan-300 bg-gradient-to-br from-cyan-50 to-white p-4">
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <h3 className="text-sm font-black text-slate-900">
                                                Día de Sol en Panamá
                                            </h3>
                                            <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-black text-white">
                                                $270.000
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-700 leading-relaxed">
                                            Visita <strong>La Miel y Puerto Obaldía</strong> con refrigerio, almuerzo, US$3 consumibles, tour guiado y opción de descanso en Playa La Boquita.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </RevealStep>

                        <RevealStep
                            id="etapa-5"
                            stepNumber="05"
                            timeBadge="Antes de cerrar la maleta"
                            title="Qué empacar según la temporada del Golfo"
                            icon={<Backpack className="h-4 w-4" aria-hidden="true" />}
                        >
                            <div className="flex flex-wrap gap-2 mb-5">
                                <button
                                    type="button"
                                    onClick={() => setSeason("calma")}
                                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition-all cursor-pointer ${season === "calma"
                                        ? "bg-emerald-600 text-white shadow-sm"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        }`}
                                >
                                    <Waves className="h-3.5 w-3.5" aria-hidden="true" />
                                    Abril – Noviembre (Mar calmo)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSeason("brisa")}
                                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition-all cursor-pointer ${season === "brisa"
                                        ? "bg-slate-900 text-white shadow-sm"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        }`}
                                >
                                    <Wind className="h-3.5 w-3.5" aria-hidden="true" />
                                    Enero – Marzo (Brisa y oleaje)
                                </button>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 mb-6">
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                    <h3 className="text-base font-black text-slate-900">
                                        {activeSeason.title} ({activeSeason.months})
                                    </h3>
                                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                                        {activeSeason.badge}
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-600 mb-3">
                                    {activeSeason.summary}
                                </p>
                                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                                    {activeSeason.items.map((item) => (
                                        <li key={item} className="flex items-start gap-2">
                                            <Sparkles className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                                        Checklist interactivo (todo el año)
                                    </p>
                                    <span className="text-xs font-bold text-emerald-700">
                                        {checkedCount}/{ESSENTIALS_CHECKLIST.length} listos
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {ESSENTIALS_CHECKLIST.map((item) => {
                                        const isChecked = !!checkedItems[item];
                                        return (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => toggleCheck(item)}
                                                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-xs sm:text-sm transition-all cursor-pointer ${isChecked
                                                    ? "border-emerald-300 bg-emerald-50/80 text-emerald-950 line-through opacity-80"
                                                    : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300"
                                                    }`}
                                            >
                                                <span
                                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${isChecked
                                                        ? "border-emerald-600 bg-emerald-600 text-white"
                                                        : "border-slate-300 bg-white"
                                                        }`}
                                                >
                                                    {isChecked && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                                                </span>
                                                <span className="font-medium">{item}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </RevealStep>

                        <RevealStep
                            id="etapa-6"
                            stepNumber="06"
                            timeBadge="¡Todo listo para zarpar!"
                            title="Asegura tu cupo en línea antes de ir al muelle"
                            icon={<Ship className="h-4 w-4" aria-hidden="true" />}
                        >
                            <div className="rounded-2xl bg-gradient-to-r from-[#0b1f1a] via-[#10332b] to-[#0f4c4c] p-6 sm:p-8 text-white">
                                <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-300 mb-2">
                                    Alianza de Confianza Turística · Portal Necoclí
                                </p>
                                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                                    Reserva tu lancha hacia Capurganá en menos de 2 minutos
                                </h3>
                                <p className="mt-3 text-sm text-slate-200 leading-relaxed">
                                    En fines de semana y puentes festivos los cupos se agotan temprano. Genera tu tiquete de pre-reserva con <strong>Sol y Playa S.A.S</strong> o <strong>El Caribe S.A.S</strong>, elige Ruta Diaria, Día de Sol o Yate Privado y viaja con total respaldo desde la Base Náutica.
                                </p>

                                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                    <Link
                                        href="/reservas-maritimas"
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg hover:bg-emerald-300 hover:-translate-y-0.5 transition-all"
                                    >
                                        <span>Pre-reservar mi viaje marítimo</span>
                                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                    </Link>

                                    <Link
                                        href="/turismo-local"
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition-colors"
                                    >
                                        <span>Pedir transporte al muelle</span>
                                    </Link>
                                </div>
                            </div>
                        </RevealStep>
                        <EditorialShareBar
                            title="Guía definitiva de Necoclí a Capurganá 2026: lanchas, horarios, precios y qué llevar"
                            slug="como-llegar-necocli-capurgana-guia-2026"
                        />
                    </article>
                </div>
            </main>
        </div>
    );
}