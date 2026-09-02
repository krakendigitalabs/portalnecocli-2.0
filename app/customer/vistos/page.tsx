import { Clock, Eye, Compass } from "lucide-react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/server";

export default async function VistosPage() {
  await requireRole(["customer", "business", "admin", "super_admin"], {
    nextPath: "/customer/vistos",
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-ink tracking-tight">Vistos Recientemente</h2>
        <p className="text-ink/60 mt-2">
          Retoma tu búsqueda justo donde la dejaste. Aquí guardamos tu historial de exploración.
        </p>
      </div>

      <div className="bg-white rounded-[28px] shadow-soft border border-ink/5 p-12 flex flex-col items-center justify-center min-h-[450px] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal/5 via-sand/30 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-teal/20 blur-xl rounded-full" />
              <div className="bg-white border border-teal/20 p-5 rounded-full relative z-10 shadow-sm">
                <Clock className="w-12 h-12 text-teal" />
              </div>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-ink mb-3">No hay historial reciente</h3>
          <p className="text-ink/60 max-w-md mx-auto mb-10 leading-relaxed">
            Parece que aún no has explorado las fichas de nuestros aliados. Cuando veas el detalle de un hotel o restaurante, aparecerá aquí.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/negocios"
              className="bg-teal hover:bg-teal/90 text-white font-bold py-3.5 px-8 rounded-full transition-all shadow-soft flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              Empezar a Explorar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
