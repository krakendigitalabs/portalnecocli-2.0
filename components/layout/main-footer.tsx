import Link from "next/link";
import { Container } from "@/components/ui/container";
import { getCommercialHomeContent } from "@/lib/content/commercial-home";

export async function MainFooter() {
  const commercialHomeContent = await getCommercialHomeContent();
  const { contactItems, socialLinks } = commercialHomeContent.contactSection;

  return (
    <footer className="bg-ink text-white/70 py-12 md:py-16 text-sm mt-10">
      <Container className="max-w-[1400px]">
        {/* Encabezado del Footer */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b border-white/10 pb-8">
          {/* Logo en recuadro blanco */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shrink-0">
              <img
                src="https://res.cloudinary.com/dwxk79gt0/image/upload/v1755929246/icono_portal_necocli_nw9wle.png"
                alt="Portal Necoclí"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <p className="text-white font-bold text-base leading-tight">Portal Necoclí</p>
              <p className="text-white/45 text-xs">La plataforma turística de Necoclí</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="https://www.facebook.com/profile.php?id=100084510412418"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/portalnecocli/?hl=es"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c2.72 0 3.05.01 4.12.06 1.06.05 1.79.22 2.43.47.65.25 1.2.6 1.75 1.15.55.55.9 1.1 1.15 1.75.25.64.42 1.37.47 2.43.05 1.07.06 1.4.06 4.12s-.01 3.05-.06 4.12c-.05 1.06-.22 1.79-.47 2.43-.25.65-.6 1.2-1.15 1.75-.55.55-1.1.9-1.75 1.15-.64.25-1.37-.42-2.43.47-1.07.05-1.4.06-4.12.06s-3.05-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47-.65-.25-1.2-.6-1.75-1.15-.55-.55-.9-1.1-1.15-1.75-.25-.64-.42-1.37-.47-2.43C2.01 15.05 2 14.72 2 12s.01-3.05.06-4.12c.05-1.06.22-1.79.47-2.43.25-.65.6-1.2 1.15-1.75.55-.55 1.1-.9 1.75-1.15.64-.25 1.37-.42 2.43-.47C8.95 2.01 9.28 2 12 2zm0 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-2c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm5.5-2.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
              </svg>
            </a>
            <a
              href="https://x.com/Portalnecocli"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@portalnecocli"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.24-2.37.52-4.8 2.05-6.52 1.5-1.64 3.65-2.6 5.86-2.58.01 1.45 0 2.9.01 4.35-1.15-.04-2.27.35-3.13 1.11-.8.71-1.28 1.75-1.3 2.82-.01 1.25.64 2.45 1.65 3.1 1.05.67 2.37.81 3.53.43 1.39-.47 2.34-1.8 2.41-3.26.04-3.66.02-7.31.02-10.97.01-1.88 0-3.76.01-5.64z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/channel/UCrgjIBaQVDFms2WU77ye9tA"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Columnas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1 */}
          <div className="space-y-5">
            <h4 className="font-bold text-white text-base">Compañía</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/nosotros" className="hover:text-white transition-colors">
                  Quiénes somos
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog y Noticias
                </Link>
              </li>
              <li>
                <Link href="/afiliar" className="hover:text-white transition-colors">
                  Afiliar mi comercio
                </Link>
              </li>
              <li>
                <Link href="/prensa" className="hover:text-white transition-colors">
                  Prensa y Media
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="space-y-5">
            <h4 className="font-bold text-white text-base">Términos y políticas</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/legal/terminos" className="hover:text-white transition-colors">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/legal/privacidad" className="hover:text-white transition-colors">
                  Aviso de privacidad
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="hover:text-white transition-colors">
                  Preferencias de cookies
                </Link>
              </li>
              <li>
                <Link href="/legal/garantia" className="hover:text-white transition-colors">
                  Políticas de garantía
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-5">
            <h4 className="font-bold text-white text-base">Ayuda</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/ayuda" className="hover:text-white transition-colors">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Descubre cómo funciona
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  Contáctanos
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 - CTA Login */}
          <div className="lg:col-span-1">
            <div className="rounded-[20px] border border-white/20 p-6 bg-white/5 space-y-4 hover:border-gold/50 transition-colors">
              <h4 className="font-bold text-white text-base">
                Inicia sesión y obtén beneficios exclusivos
              </h4>
              <ul className="space-y-3 text-sm text-white/80">
                <li className="flex gap-3 items-start">
                  <svg
                    className="w-5 h-5 text-green shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Personaliza tu experiencia de viaje
                </li>
                <li className="flex gap-3 items-start">
                  <svg
                    className="w-5 h-5 text-green shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Obtén ofertas y cupones para socios
                </li>
              </ul>
              <Link
                href="/ingresar"
                className="block text-center w-full bg-green hover:bg-green/90 text-white font-bold py-3 rounded-xl transition-transform hover:scale-105 active:scale-95 mt-6 shadow-lg shadow-green/20"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>

        {/* Derechos */}
        <div className="mt-16 pt-8 border-t border-white/10 text-xs text-white/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>Portal Necoclí 2.0 | La plataforma turística de Necoclí.</p>
          <p>
            Copyright &copy; {new Date().getFullYear()}{" "}
            <a
              href="https://www.krakendigitalabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-block font-black bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300 bg-clip-text text-transparent animate-pulse hover:animate-none hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.8)]"
            >
              Kraken Digital Labs
            </a>
            . Todos los derechos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}
