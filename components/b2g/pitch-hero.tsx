import { ArrowRight, Building2, TrendingUp } from "lucide-react";
import Link from "next/link";

export function PitchHero() {
  return (
    <section className="relative overflow-hidden bg-green text-white py-24 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20">
            <Building2 className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium tracking-wide uppercase text-gold">Alianza Estratégica 2026</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white">
            Trabajar como un solo <span className="text-gold">Necoclí.</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-emerald-50 mb-10 leading-relaxed font-light">
            No somos un simple directorio comercial. Somos el primer <strong className="font-semibold text-white">Motor Económico Regional</strong> diseñado para unificar nuestra oferta, retener la riqueza en el municipio y financiar el cuidado de nuestras playas.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="#inversion" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium bg-gold text-green rounded-full hover:bg-yellow-400 transition-colors shadow-[0_0_20px_rgba(212,175,55,0.4)] w-full sm:w-auto"
            >
              Ver Propuesta de Apoyo
              <TrendingUp className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="#tecnologia" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium bg-white/10 text-white border border-white/20 rounded-full hover:bg-white/20 transition-all backdrop-blur-sm w-full sm:w-auto"
            >
              Conoce nuestra Solución
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
