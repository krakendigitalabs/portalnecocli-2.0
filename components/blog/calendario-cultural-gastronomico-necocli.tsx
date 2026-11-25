"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    Award,
    Calendar,
    Clock,
    Compass,
    Flame,
    Heart,
    MapPin,
    Music,
    PartyPopper,
    ShoppingBag,
    Sparkles,
    Sun,
    Truck,
    Utensils,
} from "lucide-react";
import { EditorialShareBar } from "@/components/blog/editorial-share-bar";

type FlavorTab = "mar" | "coco" | "dulces";

const ARTICLE_IMAGES = {
    fiestasCoco:
        "https://res.cloudinary.com/dr50ioh9h/image/upload/f_auto,q_auto/v1794196668/Captura_de_pantalla_2026-11-08_225546_lijcfk.png",
    festivalVerano:
        "https://res.cloudinary.com/dr50ioh9h/image/upload/f_auto,q_auto/v1794196670/Captura_de_pantalla_2026-11-08_225528_stvnkk.png",
    bullerengue:
        "https://res.cloudinary.com/dr50ioh9h/image/upload/f_auto,q_auto/v1794196179/Captura_de_pantalla_2026-11-08_223907_s1fzvu.png",
    gastronomiaMariscos:
        "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=1400&q=80",
};

const TIMELINE_NAV = [
    { id: "enero-coco", label: "01 · Fiestas del Coco", time: "Enero" },
    { id: "agosto-verano", label: "02 · Festival de Verano", time: "Agosto" },
    { id: "octubre-bullerengue", label: "03 · Bullerengue", time: "Octubre" },
    { id: "orgullo-cuadrado", label: "04 · Orgullo Necocliseño", time: "Todo el año" },
    { id: "ruta-gastronomica", label: "05 · Ruta Gastronómica", time: "Sabores" },
    { id: "explora-sabores", label: "06 · Restaurantes y Domicilios", time: "Pide ya" },
];

const FLAVOR_TABS: Record<
    FlavorTab,
    {
        badge: string;
        title: string;
        description: string;
        highlights: { name: string; detail: string }[];
    }
> = {
    mar: {
        badge: "Del mar directo a la mesa",
        title: "Pescados frescos y cazuelas de mariscos",
        description:
            "La pesca diaria del Golfo de Urabá garantiza frescura real en cada plato, sazonado con hierbas locales y toque caribeño.",
        highlights: [
            {
                name: "Pargo rojo frito",
                detail: "Crujiente por fuera y jugoso por dentro, servido con patacón y ensalada fresca.",
            },
            {
                name: "Cazuela de mariscos y langosta",
                detail: "Cremosa, especiada y preparada con camarón, calamar, pulpo y pesca del día.",
            },
            {
                name: "Sancocho de pescado con coco",
                detail: "El clásico levantamuertos después de una mañana de sol y playa.",
            },
        ],
    },
    coco: {
        badge: "El rey de la cocina local",
        title: "Arroz con coco y tradición agrícola",
        description:
            "El coco y el plátano son el corazón de la economía y la identidad culinaria de Necoclí, presentes en casi cada almuerzo frente al mar.",
        highlights: [
            {
                name: "Arroz con coco (titoté)",
                detail: "Con ese contraste exacto entre dulce y salado que solo da la leche de coco recién rallado.",
            },
            {
                name: "Yuca, ñame y plátano maduro",
                detail: "Acompañamientos cosechados en las veredas del municipio que redondean cada plato.",
            },
            {
                name: "Sazón antioqueña y asados",
                detail: "Para quienes viajan en grupo, también encuentras parrilla y cocina paisa tradicional.",
            },
        ],
    },
    dulces: {
        badge: "Recuerdos con sabor y mano local",
        title: "Dulces de frutas y artesanías en cáscara de coco",
        description:
            "Antes de volver a casa, llévate un pedacito del Caribe antioqueño hecho por cocineras tradicionales y artesanos del pueblo.",
        highlights: [
            {
                name: "Cocadas y dulces de frutas locales",
                detail: "Preparados con coco, tamarindo, mango y frutas de cosecha de la región.",
            },
            {
                name: "Joyería en cáscara de coco",
                detail: "Manillas, collares y pulseras talladas y pulidas a mano por artesanos locales.",
            },
            {
                name: "Hamacas, chinchorros y lámparas",
                detail: "Tejidos frescos para el descanso y piezas decorativas en madera y fibra natural.",
            },
        ],
    },
};

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
                className="absolute left-[15px] sm:left-[19px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-amber-500/80 via-orange-400/40 to-slate-200"
            />

            <div
                className={`absolute left-0 top-0 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 shadow-md transition-transform duration-500 ${visible
                        ? "scale-100 border-amber-600 bg-amber-600 text-white"
                        : "scale-75 border-slate-300 bg-white text-slate-400"
                    }`}
            >
                {icon}
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-black tracking-wider text-white">
                    CAPÍTULO {stepNumber}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-0.5 text-xs font-bold text-amber-900">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
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

function EditorialPhoto({
    src,
    alt,
    caption,
}: {
    src: string;
    alt: string;
    caption: string;
}) {
    return (
        <figure className="group mb-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
            </div>
            <figcaption className="bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-500">
                {caption}
            </figcaption>
        </figure>
    );
}

export function CalendarioCulturalGastronomicoNecocli() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeStage, setActiveStage] = useState("enero-coco");
    const [flavorTab, setFlavorTab] = useState<FlavorTab>("mar");

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

    const currentFlavor = FLAVOR_TABS[flavorTab];

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-orange-50/20 text-slate-800">
            {/* Barra fija de progreso */}
            <div
                aria-hidden="true"
                className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-slate-200/70 backdrop-blur-sm"
            >
                <div
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 transition-[width] duration-150 ease-out"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* HERO EDITORIAL */}
            <header className="relative overflow-hidden bg-[#1f130c] text-white pt-12 pb-16 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-amber-500/25 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-rose-500/15 blur-3xl"
                />

                <div className="relative mx-auto max-w-5xl">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        Volver al Blog de Necoclí
                    </Link>

                    <div className="flex flex-wrap items-center gap-2.5 mb-5">
                        <span className="rounded-full bg-amber-500/20 border border-amber-400/30 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-200">
                            Gastronomía y Cultura · Calendario Anual
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                            <Clock className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                            5 min de lectura
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                            <MapPin className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                            Necoclí, Urabá Antioqueño
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-[54px] font-black tracking-tight leading-[1.08] max-w-4xl">
                        Del Bullerengue a las Fiestas del Coco:{" "}
                        <span className="text-amber-400">
                            calendario cultural y gastronómico de Necoclí
                        </span>
                    </h1>

                    <p className="mt-5 max-w-3xl text-base sm:text-lg text-slate-200 leading-relaxed">
                        Necoclí se vive con los cinco sentidos: tambores que retumban frente al Caribe, fiestas que encienden el calendario en enero, agosto y octubre, orgullo futbolero de exportación y una cocina de mar que enamora desde el primer bocado.
                    </p>

                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: "Enero", value: "Fiestas del Coco" },
                            { label: "Agosto", value: "Festival de Verano" },
                            { label: "Octubre", value: "Bullerengue" },
                            { label: "Plato insignia", value: "Arroz con Coco" },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
                            >
                                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                                    {stat.label}
                                </p>
                                <p className="mt-0.5 text-base sm:text-lg font-black text-white">
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* CUERPO PRINCIPAL */}
            <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="grid gap-10 lg:grid-cols-12 items-start">
                    {/* Sidebar cronológico */}
                    <aside className="hidden lg:block lg:col-span-4 sticky top-10 space-y-5">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-xs font-extrabold uppercase tracking-widest text-amber-700 mb-4 flex items-center gap-2">
                                <Compass className="h-4 w-4" aria-hidden="true" />
                                Calendario de lectura
                            </p>

                            <nav aria-label="Calendario cultural" className="space-y-1.5">
                                {TIMELINE_NAV.map((item) => {
                                    const isActive = activeStage === item.id;
                                    return (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            className={`flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all ${isActive
                                                    ? "bg-amber-600 text-white shadow-sm translate-x-1"
                                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                }`}
                                        >
                                            <span>{item.label}</span>
                                            <span
                                                className={`text-[10px] ${isActive ? "text-amber-100" : "text-slate-400"
                                                    }`}
                                            >
                                                {item.time}
                                            </span>
                                        </a>
                                    );
                                })}
                            </nav>

                            <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
                                <Link
                                    href="/negocios"
                                    className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-xs font-extrabold text-white shadow-md hover:bg-amber-600 transition-colors"
                                >
                                    <Utensils className="h-4 w-4" aria-hidden="true" />
                                    <span>Explorar Restaurantes</span>
                                </Link>
                                <Link
                                    href="/turismo-local"
                                    className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-bold text-slate-800 hover:border-amber-400 transition-colors"
                                >
                                    <Truck className="h-4 w-4 text-amber-600" aria-hidden="true" />
                                    <span>Pedir domicilio / movilidad</span>
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* LÍNEA DE TIEMPO */}
                    <article className="lg:col-span-8">
                        {/* CAPÍTULO 01: ENERO */}
                        <RevealStep
                            id="enero-coco"
                            stepNumber="01"
                            timeBadge="Primer puente festivo de enero"
                            title="Fiestas del Coco: el año arranca con sabor caribeño"
                            icon={<PartyPopper className="h-4 w-4" aria-hidden="true" />}
                        >
                            <EditorialPhoto
                                src={ARTICLE_IMAGES.fiestasCoco}
                                alt="Tradición cultural y Fiestas del Coco en Necoclí"
                                caption="Las Fiestas del Coco abren el calendario turístico de Necoclí cada primer puente festivo de enero."
                            />

                            <p className="text-slate-600 leading-relaxed mb-4">
                                En Necoclí el calendario no empieza en silencio: arranca al ritmo de las tradicionales <strong>Fiestas del Coco</strong>, celebradas cada año durante el <strong>primer puente festivo de enero</strong>. Es un homenaje al fruto que sostiene buena parte de la economía agrícola, artesanal y culinaria del municipio.
                            </p>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                                    <p className="text-sm font-extrabold text-slate-900">
                                        Desfiles, música y corralejas
                                    </p>
                                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                                        El parque principal y las calles cercanas a la playa se llenan de comparsas, conciertos nocturnos, muestras culturales y el ambiente festivo de comienzo de año.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                                    <p className="text-sm font-extrabold text-slate-900">
                                        Tip de viajero para enero
                                    </p>
                                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                                        Es una de las temporadas con mayor ocupación hotelera. Reserva alojamiento y transporte marítimo con anticipación para disfrutar sin carreras.
                                    </p>
                                </div>
                            </div>
                        </RevealStep>

                        {/* CAPÍTULO 02: AGOSTO */}
                        <RevealStep
                            id="agosto-verano"
                            stepNumber="02"
                            timeBadge="Agosto"
                            title="Festival de Verano: playa, deporte y brisa de mitad de año"
                            icon={<Sun className="h-4 w-4" aria-hidden="true" />}
                        >
                            <EditorialPhoto
                                src={ARTICLE_IMAGES.festivalVerano}
                                alt="Ambiente festivo y cultural del Festival de Verano en Necoclí"
                                caption="Agosto trae sol, deporte en la arena y programación cultural frente al Golfo de Urabá."
                            />

                            <p className="text-slate-600 leading-relaxed mb-4">
                                Cuando el calendario llega a agosto, Necoclí celebra su <strong>Festival de Verano</strong>, aprovechando la energía de sus <strong>95 kilómetros de playa</strong> y un mar mucho más sereno que en los primeros meses del año.
                            </p>
                            <ul className="space-y-2.5 text-sm text-slate-700">
                                <li className="flex items-start gap-2.5">
                                    <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-1" aria-hidden="true" />
                                    <span>
                                        <strong>Actividades al aire libre:</strong> torneos de playa, encuentros recreativos familiares y programación artística frente al Golfo de Urabá.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-1" aria-hidden="true" />
                                    <span>
                                        <strong>Clima ideal para combinar planes:</strong> es el mes perfecto para mezclar playa en El Totumo o El Pescador con un Día de Sol hacia Sapzurro y Capurganá.
                                    </span>
                                </li>
                            </ul>
                        </RevealStep>

                        {/* CAPÍTULO 03: OCTUBRE */}
                        <RevealStep
                            id="octubre-bullerengue"
                            stepNumber="03"
                            timeBadge="Octubre"
                            title="Festival Nacional del Bullerengue: el latido ancestral del Urabá"
                            icon={<Music className="h-4 w-4" aria-hidden="true" />}
                        >
                            <EditorialPhoto
                                src={ARTICLE_IMAGES.bullerengue}
                                alt="Festival Nacional del Bullerengue en Necoclí"
                                caption="En octubre los tambores, cantadoras y bailes tradicionales convierten a Necoclí en capital nacional del Bullerengue."
                            />

                            <p className="text-slate-600 leading-relaxed mb-4">
                                Si quieres conocer el alma más profunda de Necoclí, marca <strong>octubre</strong> en tu agenda. El <strong>Festival Nacional del Bullerengue</strong> reúne cantadoras, tamboreros y bailarines de todo el Caribe colombiano en una celebración de herencia afrodescendiente que eriza la piel.
                            </p>
                            <div className="rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50/80 to-amber-50/80 p-5">
                                <p className="text-xs font-extrabold uppercase tracking-wider text-rose-700 mb-1.5 flex items-center gap-1.5">
                                    <Flame className="h-4 w-4" aria-hidden="true" />
                                    ¿Qué hace único al Bullerengue?
                                </p>
                                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                                    Es un canto de respuesta liderado por voces femeninas, palmas y tambores alegre y llamador. En Necoclí, donde confluyen comunidades afrodescendientes, mestizas e indígenas (Kunas y Zenúes), el festival es patrimonio vivo y punto de encuentro en torno a espacios como la Casa de Nuestras Culturas y el Centro Cultural El Totumo Encantado.
                                </p>
                            </div>
                        </RevealStep>

                        {/* CAPÍTULO 04: ORGULLO LOCAL */}
                        <RevealStep
                            id="orgullo-cuadrado"
                            stepNumber="04"
                            timeBadge="Identidad todo el año"
                            title="Cuna de talento: el orgullo de ser la tierra de Juan Guillermo Cuadrado"
                            icon={<Award className="h-4 w-4" aria-hidden="true" />}
                        >
                            <p className="text-slate-600 leading-relaxed mb-4">
                                Hablar de Necoclí también es hablar de disciplina, alegría y deporte. El municipio es reconocido en todo el país y el mundo por ser el lugar de nacimiento de <strong>Juan Guillermo Cuadrado</strong>, referente histórico de la Selección Colombia y del fútbol europeo.
                            </p>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 flex items-start gap-3">
                                <Heart className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                                    Caminar por el malecón al atardecer y ver a niños jugando fútbol descalzos sobre la arena resume el espíritu necocliseño: hospitalario, sonriente y orgulloso de sus raíces.
                                </p>
                            </div>
                        </RevealStep>

                        {/* CAPÍTULO 05: RUTA GASTRONÓMICA INTERACTIVA */}
                        <RevealStep
                            id="ruta-gastronomica"
                            stepNumber="05"
                            timeBadge="Ruta de sabores y artesanías"
                            title="Qué comer (y qué llevarte) en Necoclí"
                            icon={<Utensils className="h-4 w-4" aria-hidden="true" />}
                        >
                            <EditorialPhoto
                                src={ARTICLE_IMAGES.gastronomiaMariscos}
                                alt="Gastronomía de mariscos y pescados frescos del Caribe"
                                caption="Mariscos frescos, pargo rojo y arroz con coco: el sabor inconfundible de la mesa frente al Golfo de Urabá."
                            />

                            <p className="text-slate-600 leading-relaxed mb-5">
                                La cocina necocliseña mezcla lo mejor del Caribe con el toque tradicional antioqueño. Explora las 3 paradas obligatorias de nuestra ruta gastronómica y artesanal:
                            </p>

                            {/* Selector interactivo */}
                            <div className="flex flex-wrap gap-2 mb-5" role="tablist">
                                {[
                                    { key: "mar" as FlavorTab, label: "Pargo y Mariscos" },
                                    { key: "coco" as FlavorTab, label: "Arroz con Coco y Cosecha" },
                                    { key: "dulces" as FlavorTab, label: "Dulces y Artesanías" },
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        role="tab"
                                        aria-selected={flavorTab === tab.key}
                                        onClick={() => setFlavorTab(tab.key)}
                                        className={`rounded-full px-4 py-2 text-xs font-extrabold transition-all cursor-pointer ${flavorTab === tab.key
                                                ? "bg-amber-600 text-white shadow-sm"
                                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/60 to-white p-5">
                                <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-900 mb-2">
                                    {currentFlavor.badge}
                                </span>
                                <h3 className="text-lg font-black text-slate-900">
                                    {currentFlavor.title}
                                </h3>
                                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                                    {currentFlavor.description}
                                </p>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    {currentFlavor.highlights.map((item) => (
                                        <div
                                            key={item.name}
                                            className="rounded-xl border border-slate-200/80 bg-white p-3.5"
                                        >
                                            <p className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                                                <ShoppingBag className="h-3.5 w-3.5 text-amber-600 shrink-0" aria-hidden="true" />
                                                {item.name}
                                            </p>
                                            <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                                                {item.detail}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </RevealStep>

                        {/* CAPÍTULO 06: CTA CONVERSIÓN */}
                        <RevealStep
                            id="explora-sabores"
                            stepNumber="06"
                            timeBadge="Vive Necoclí como un local"
                            title="Descubre restaurantes locales o pide a domicilio con Alejandro"
                            icon={<Truck className="h-4 w-4" aria-hidden="true" />}
                        >
                            <div className="rounded-2xl bg-gradient-to-r from-[#1f130c] via-[#3a1f10] to-[#7c2d12] p-6 sm:p-8 text-white">
                                <p className="text-xs font-extrabold uppercase tracking-widest text-amber-300 mb-2">
                                    Directorio Oficial y Movilidad · Portal Necoclí
                                </p>
                                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                                    ¿Se te antojó un pargo frito con arroz con coco ahora mismo?
                                </h3>
                                <p className="mt-3 text-sm text-amber-100/90 leading-relaxed">
                                    Explora los restaurantes, heladerías y comercios verificados de Necoclí o solicita un domicilio y transporte local en minutos desde <strong>Turismo Local</strong> con el acompañamiento de nuestro guía <strong>Alejandro</strong>.
                                </p>

                                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                    <Link
                                        href="/negocios"
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg hover:bg-amber-300 hover:-translate-y-0.5 transition-all"
                                    >
                                        <span>Explorar negocios y restaurantes</span>
                                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                    </Link>

                                    <Link
                                        href="/turismo-local"
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition-colors"
                                    >
                                        <span>Pedir domicilio con Alejandro</span>
                                    </Link>
                                </div>
                            </div>
                        </RevealStep>

                        <EditorialShareBar
                            title="Del Bullerengue a las Fiestas del Coco: calendario cultural y gastronómico de Necoclí"
                            slug="fiestas-bullerengue-coco-y-gastronomia-necocli"
                        />
                    </article>
                </div>
            </main>
        </div>
    );
}