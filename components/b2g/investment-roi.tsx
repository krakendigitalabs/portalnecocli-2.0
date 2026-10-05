import { HandCoins, Landmark } from "lucide-react";

export function InvestmentRoi() {
  return (
    <section id="inversion" className="py-24 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16 items-center max-w-6xl mx-auto">
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-extrabold text-ink mb-6 leading-tight">
              Estructura de Apoyo - Fase 1
            </h2>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Buscamos el respaldo de la Alcaldía como el gran puente institucional para integrar masivamente a las <strong className="text-ink">100 empresas turísticas</strong> más representativas del municipio en esta primera fase.
            </p>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-sand rounded-2xl border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="bg-white shadow-sm p-3 rounded-xl border border-slate-100">
                    <HandCoins className="text-slate-700 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-ink">Costo Total (100 empresas)</h4>
                    <p className="text-sm text-slate-500">Valor de integración comercial</p>
                  </div>
                </div>
                <div className="text-xl font-black text-ink">$50.000.000</div>
              </div>

              <div className="flex items-center justify-between p-6 bg-mist rounded-2xl border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="bg-green p-3 rounded-xl text-white shadow-sm">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-green">Respaldo de la Alcaldía</h4>
                    <p className="text-sm text-teal">Aporte de $100.000 por empresa</p>
                  </div>
                </div>
                <div className="text-2xl font-black text-green">$10.000.000</div>
              </div>
            </div>
            
            <p className="mt-8 text-sm text-slate-500 bg-sand p-4 rounded-xl border border-slate-100">
              * Con el respaldo institucional, el costo para cada empresa se reduce a $400.000 COP. Esto nos permite unir rápidamente al gremio y activar de inmediato los fondos de regalías para el cuidado del municipio.
            </p>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="bg-green text-white rounded-3xl p-10 shadow-soft relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <TrendingUpIcon className="w-48 h-48" />
              </div>
              <h3 className="text-2xl font-bold mb-8 relative z-10 text-sand">Proyección a 5 Años</h3>
              
              <div className="space-y-8 relative z-10">
                <div>
                  <p className="text-mist text-sm font-medium mb-1">Escenario de Alta Adopción (Año 5)</p>
                  <p className="text-3xl font-black text-white">$3.000.000.000 <span className="text-xl font-normal text-mist">COP/año</span></p>
                </div>
                
                <div className="h-px bg-white/10 w-full" />
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-mist text-sm font-medium mb-1">Aporte Ciudad (3%)</p>
                    <p className="text-2xl font-bold text-gold">$90M <span className="text-sm font-normal text-mist">/ año</span></p>
                  </div>
                  <div>
                    <p className="text-mist text-sm font-medium mb-1">Aporte Gremio (2%)</p>
                    <p className="text-2xl font-bold text-gold">$60M <span className="text-sm font-normal text-mist">/ año</span></p>
                  </div>
                </div>

                <div className="bg-ink/30 p-4 rounded-xl mt-4 border border-white/5">
                  <p className="text-sm text-mist">
                    <strong className="text-white">Recuperación de la Inversión:</strong> El aporte económico inicial se recupera por completo e ingresa de nuevo a la economía del municipio en un periodo estimado de 6 a 8 meses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrendingUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
