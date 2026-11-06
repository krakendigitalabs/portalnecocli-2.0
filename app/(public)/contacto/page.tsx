import { Clock, Mail, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contacto y Asesoría | Portal Necoclí",
  description:
    "¿Listo para vivir Necoclí? Solicita tu asesoría personalizada. Te respondemos en menos de 24 horas para diseñar tu experiencia perfecta en Necoclí.",
  openGraph: {
    title: "Contacto y Asesoría | Portal Necoclí",
    description:
      "Solicita tu asesoría personalizada para vivir Necoclí de forma premium. Tours de islas, yates privados, hoteles y más.",
    images: ["https://res.cloudinary.com/dr50ioh9h/image/upload/v1752722255/familia_22_febopw.png"],
  },
};

const contactMethods = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+57 321 751 1866",
    href: "https://wa.me/573217511866?text=Hola!%20Quiero%20recibir%20asesor%C3%ADa%20para%20mi%20viaje%20a%20Necocl%C3%AD.%20%F0%9F%8C%B4",
    cta: "Chatear ahora",
    color: "bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20",
    accent: "#25D366",
  },
  {
    icon: Mail,
    label: "Correo electrónico",
    value: "guia@portalnecocli.com",
    href: "mailto:guia@portalnecocli.com",
    cta: "Escribir correo",
    color: "bg-gold/10 text-gold border-gold/20",
    accent: "#C9A84C",
  },
  {
    icon: Phone,
    label: "Llamadas",
    value: "+57 321 751 1866",
    href: "tel:+573217511866",
    cta: "Llamar ahora",
    color: "bg-green/10 text-green border-green/20",
    accent: "#1a7a4a",
  },
  {
    icon: MapPin,
    label: "Ubicación",
    value: "Necoclí, Antioquia, Colombia",
    href: "https://www.google.com/maps/d/viewer?mid=1MeqaIVfxJjigVhzq50ktIl5W4n_z8A4&femb=1&ll=7.338825176265945%2C-76.17668610000001&z=8",
    cta: "Ver en mapa",
    color: "bg-coral/10 text-coral border-coral/20",
    accent: "#dd6b42",
  },
];

const trustSignals = [
  { icon: "⚡", label: "Respuesta rápida", desc: "En menos de 24 horas" },
  { icon: "🌴", label: "Expertos locales", desc: "Conocemos Necoclí al detalle" },
  { icon: "🔒", label: "100% seguro", desc: "Tus datos están protegidos" },
  { icon: "🎯", label: "Asesoría personalizada", desc: "Diseñamos tu experiencia ideal" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/portalnecocli/?hl=es",
    color: "hover:text-pink-500",
    svg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2c2.72 0 3.05.01 4.12.06 1.06.05 1.79.22 2.43.47.65.25 1.2.6 1.75 1.15.55.55.9 1.1 1.15 1.75.25.64.42 1.37.47 2.43.05 1.07.06 1.4.06 4.12s-.01 3.05-.06 4.12c-.05 1.06-.22 1.79-.47 2.43-.25.65-.6 1.2-1.15 1.75-.55.55-1.1.9-1.75 1.15-.64.25-1.37.42-2.43.47-1.07.05-1.4.06-4.12.06s-3.05-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47-.65-.25-1.2-.6-1.75-1.15-.55-.55-.9-1.1-1.15-1.75-.25-.64-.42-1.37-.47-2.43C2.01 15.05 2 14.72 2 12s.01-3.05.06-4.12c.05-1.06.22-1.79.47-2.43.25-.65.6-1.2 1.15-1.75.55-.55 1.1-.9 1.75-1.15.64-.25 1.37-.42 2.43-.47C8.95 2.01 9.28 2 12 2zm0 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-2c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm5.5-2.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100084510412418",
    color: "hover:text-blue-500",
    svg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
      </svg>
    ),
  },
];

const reviews = [
  {
    name: "Camila R.",
    stars: 5,
    text: "El equipo de Portal Necoclí nos organizó todo perfecto. ¡El tour a las islas fue mágico!",
    city: "Medellín",
  },
  {
    name: "Andrés M.",
    stars: 5,
    text: "Respondieron al instante y nos ayudaron a elegir el mejor paquete. Muy profesionales.",
    city: "Bogotá",
  },
  {
    name: "Laura V.",
    stars: 5,
    text: "La mejor experiencia de viaje que he tenido. El yate privado fue absolutamente increíble.",
    city: "Cali",
  },
];

export default function ContactoPage() {
  return (
    <div className="min-h-screen">
      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f2e21] via-[#0f5c5c] to-[#1a3a2a] py-24 md:py-36">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-green/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-[600px] rounded-full bg-white/5 blur-3xl" />
        </div>

        {/* Decorative dots grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 xl:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold text-white/80 uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            Equipo disponible ahora
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.05]">
            Hablemos de tu
            <span className="block bg-gradient-to-r from-gold via-yellow-300 to-gold bg-clip-text text-transparent">
              próxima aventura
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/65 max-w-2xl mx-auto leading-relaxed">
            Solicita tu asesoría personalizada. Nuestros expertos locales diseñarán la experiencia
            perfecta en el paraíso de Necoclí para ti.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
            {trustSignals.map((signal) => (
              <div
                key={signal.label}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2 text-sm text-white/80"
              >
                <span>{signal.icon}</span>
                <span className="font-semibold">{signal.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full block"
          >
            <path d="M0 40 C360 80 1080 0 1440 40 L1440 80 L0 80 Z" fill="#fcfaf6" />
          </svg>
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 xl:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_540px] lg:items-start lg:gap-16">
          {/* LEFT: Info Column */}
          <div className="space-y-10">
            {/* Intro */}
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green">
                Atención directa y personalizada
              </p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-ink leading-tight">
                Estamos a un mensaje de hacer tu viaje realidad
              </h2>
              <p className="text-ink/60 text-lg leading-relaxed">
                Desde tours de islas y yates privados hasta recomendaciones de hoteles boutique.
                Nuestro equipo nativo de Necoclí conoce cada rincón de Necoclí.
              </p>
            </div>

            {/* Contact Methods Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <a
                    key={method.label}
                    href={method.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex flex-col gap-4 p-6 bg-white rounded-[24px] border border-ink/8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${method.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-ink/40 mb-1">
                        {method.label}
                      </p>
                      <p className="font-bold text-ink text-sm leading-snug">{method.value}</p>
                    </div>
                    <span
                      className="mt-auto text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
                      style={{ color: method.accent }}
                    >
                      {method.cta} →
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Horario */}
            <div className="flex items-start gap-4 p-6 bg-sand/50 rounded-[24px] border border-ink/8">
              <div className="w-12 h-12 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="font-bold text-ink mb-1">Horario de atención</p>
                <p className="text-sm text-ink/60 leading-relaxed">
                  Lunes a Sábado · 7:00 AM – 8:00 PM (hora Colombia)
                  <br />
                  <span className="text-green font-semibold">
                    WhatsApp disponible hasta las 10:00 PM
                  </span>
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/40">
                Síguenos en redes
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`w-12 h-12 bg-white border border-ink/10 rounded-2xl flex items-center justify-center text-ink/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${social.color}`}
                    aria-label={social.label}
                  >
                    {social.svg}
                  </a>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/40">
                  Lo que dicen nuestros viajeros
                </p>
                <div className="flex items-center gap-1 text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <span className="text-xs font-bold text-ink/50 ml-1">5.0</span>
                </div>
              </div>
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div
                    key={review.name}
                    className="p-5 bg-white rounded-[20px] border border-ink/8 space-y-2.5"
                  >
                    <div className="flex items-center gap-1">
                      {[...Array(review.stars)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                      ))}
                    </div>
                    <p className="text-sm text-ink/70 leading-relaxed italic">"{review.text}"</p>
                    <p className="text-xs font-bold text-ink/40">
                      — {review.name} · {review.city}
                    </p>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <a
                  href="https://share.google/BJVqu712naWEr5XMH"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-ink hover:text-green transition-colors"
                >
                  <Star className="w-4 h-4" />
                  Lee y deja tu reseña en Google
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: Form Column — Sticky */}
          <div className="lg:sticky lg:top-28">
            <div className="relative overflow-hidden bg-white rounded-[32px] border border-ink/8 shadow-2xl shadow-ink/5 p-8 md:p-10">
              {/* Corner accent */}
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br from-green/20 to-gold/10 blur-2xl pointer-events-none" />

              {/* Form Header */}
              <div className="mb-8 relative z-10">
                <div className="inline-flex items-center gap-2 bg-green/8 border border-green/15 rounded-full px-3 py-1.5 text-xs font-bold text-green uppercase tracking-widest mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                  Solicitar asesoría
                </div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-ink leading-tight">
                  Cuéntanos tu plan
                  <span className="block text-green">y lo hacemos realidad</span>
                </h2>
                <p className="text-sm text-ink/50 mt-3 leading-relaxed">
                  Completa el formulario y recibirás confirmación en tu correo. Nuestro equipo te
                  contactará para personalizar tu experiencia.
                </p>
              </div>

              {/* Form Component */}
              <div className="relative z-10">
                <ContactForm />
              </div>

              {/* Bottom trust line */}
              <div className="mt-6 pt-6 border-t border-ink/6 flex items-center justify-center gap-2 text-xs text-ink/35">
                <span>🔒</span>
                <span>Información segura · No compartimos tus datos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAP SECTION ─────────────────────────────────────────── */}
      <section className="pb-24 max-w-7xl mx-auto px-4 xl:px-8">
        <div className="relative overflow-hidden rounded-[32px] border border-ink/8 bg-gradient-to-br from-[#0f2e21] via-[#0f5c5c] to-[#1a3a2a] p-10 md:p-16">
          {/* Blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-green/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold/15 blur-3xl" />
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold/80">
                Nuestra ubicación
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                En el corazón del
                <span className="block text-gold"> Necoclí</span>
              </h2>
              <p className="text-white/60 leading-relaxed">
                Necoclí, Antioquia, Colombia. El destino más vibrante del Caribe colombiano, puerta
                de acceso al Darién y las islas paradisíacas del Golfo.
              </p>
              <a
                href="https://www.google.com/maps/d/viewer?mid=1MeqaIVfxJjigVhzq50ktIl5W4n_z8A4&femb=1&ll=7.338825176265945%2C-76.17668610000001&z=8"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300"
              >
                <MapPin className="w-4 h-4" />
                Ver en Google Maps
              </a>
            </div>

            {/* Map embed */}
            <div className="relative h-64 md:h-80 rounded-[24px] overflow-hidden bg-white/5 border border-white/10">
              <iframe
                src="https://www.google.com/maps/d/embed?mid=1MeqaIVfxJjigVhzq50ktIl5W4n_z8A4&ehbc=2D3142"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Portal Necoclí"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
