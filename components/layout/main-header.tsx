import { AuthEntry } from "@/components/layout/auth-entry";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { navigationLinks } from "@/lib/constants/site";
import { MobileNav } from "./mobile-nav";

type MainHeaderProps = {
  brandName: string;
  announcement?: string;
};

const reservationHref =
  "https://wa.me/573217511866?text=%C2%A1Hola!%20Quiero%20reservar%20mi%20experiencia%20en%20Necocl%C3%AD.";
const affiliateHref =
  "https://wa.me/573217511866?text=Hola,%20estoy%20interesado%20en%20vincular%20mi%20comercio%20a%20Portal%20Necocl%C3%AD.";

export function MainHeader({ brandName }: MainHeaderProps) {
  return (
    <header className="sticky top-0 z-[100] w-full transition-all duration-300">
      {/* Top Bar - Split Navigation (Socials & Actions) */}
      <div className="w-full bg-sand border-b border-ink/5">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto px-4 xl:px-8 py-1.5">
          
          {/* Social Icons */}
          <div className="flex items-center gap-4 text-ink/50">
            <a href="https://www.facebook.com/people/Portal-Necocli/100084510412418/" target="_blank" rel="noreferrer" className="hover:text-green transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
            </a>
            <a href="https://www.instagram.com/portalnecocli/?hl=es" target="_blank" rel="noreferrer" className="hover:text-green transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c2.72 0 3.05.01 4.12.06 1.06.05 1.79.22 2.43.47.65.25 1.2.6 1.75 1.15.55.55.9 1.1 1.15 1.75.25.64.42 1.37.47 2.43.05 1.07.06 1.4.06 4.12s-.01 3.05-.06 4.12c-.05 1.06-.22 1.79-.47 2.43-.25.65-.6 1.2-1.15 1.75-.55.55-1.1.9-1.75 1.15-.64.25-1.37.42-2.43.47-1.07.05-1.4.06-4.12.06s-3.05-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47-.65-.25-1.2-.6-1.75-1.15-.55-.55-.9-1.1-1.15-1.75-.25-.64-.42-1.37-.47-2.43C2.01 15.05 2 14.72 2 12s.01-3.05.06-4.12c.05-1.06.22-1.79.47-2.43.25-.65.6-1.2 1.15-1.75.55-.55 1.1-.9 1.75-1.15.64-.25 1.37-.42 2.43-.47C8.95 2.01 9.28 2 12 2zm0 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-2c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm5.5-2.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/></svg>
            </a>
            <a href="https://x.com/Portalnecocli" target="_blank" rel="noreferrer" className="hover:text-green transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@portalnecocli" target="_blank" rel="noreferrer" className="hover:text-green transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.24-2.37.52-4.8 2.05-6.52 1.5-1.64 3.65-2.6 5.86-2.58.01 1.45 0 2.9.01 4.35-1.15-.04-2.27.35-3.13 1.11-.8.71-1.28 1.75-1.3 2.82-.01 1.25.64 2.45 1.65 3.1 1.05.67 2.37.81 3.53.43 1.39-.47 2.34-1.8 2.41-3.26.04-3.66.02-7.31.02-10.97.01-1.88 0-3.76.01-5.64z"/></svg>
            </a>
            <a href="https://www.youtube.com/channel/UCrgjIBaQVDFms2WU77ye9tA" target="_blank" rel="noreferrer" className="hover:text-green transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3z"/></svg>
            </a>
          </div>

          {/* User Actions (Corregido Botón Verde) */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm">
              <AuthEntry />
            </div>
            
            <Button 
              className="hidden md:inline-flex bg-green text-white hover:bg-green/90 shadow-sm rounded-full px-4 h-7 text-xs font-bold" 
              href={affiliateHref} 
            >
              Afiliar Comercio
            </Button>
            
            <Button 
              className="rounded-full px-4 h-7 text-xs bg-gold hover:bg-gold/90 text-white shadow-sm font-bold tracking-wide" 
              href="/tarifario" 
            >
              Cotizar Plan
            </Button>
          </div>
          
        </div>
      </div>

      {/* Main Bar - Logo and Navigation */}
      <div className="w-full bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 xl:px-8 py-3 lg:py-5">
          <div className="flex flex-row items-center justify-between">
            
            {/* Logo & Brand (Solo Imagen, Más Protagonista) */}
            <Link href="/" className="flex items-center group flex-shrink-0">
              <img 
                src="https://res.cloudinary.com/dr50ioh9h/image/upload/v1746587440/Dise%C3%B1o_sin_t%C3%ADtulo_pvwjh9.png" 
                alt="Logo Portal Necocli" 
                className="h-10 sm:h-12 md:h-16 lg:h-20 w-auto object-contain transition-transform duration-500 hover:scale-105 hover:drop-shadow-lg"
              />
            </Link>

            {/* Navegación Central Elegante (Desktop XL+) */}
            <nav className="hidden xl:flex flex-1 justify-center items-center gap-4 2xl:gap-8 h-full">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="whitespace-nowrap px-2 py-2 text-sm 2xl:text-base font-tropical font-bold text-ink/80 hover:text-green transition-all duration-300 uppercase tracking-wide hover:scale-105"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            
            {/* Espaciador invisible para balancear el logo (solo visible en pantallas extra grandes) */}
            <div className="hidden xl:block w-[150px] 2xl:w-[200px]" />

            {/* Menú Sándwich para Móviles y Tablets/Laptops Pequeñas */}
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
