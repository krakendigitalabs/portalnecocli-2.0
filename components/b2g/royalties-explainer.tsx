import { Trees, Store, HeartHandshake } from "lucide-react";

export function RoyaltiesExplainer() {
  return (
    <section className="py-24 bg-sand border-y border-slate-200 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-mist text-green mb-6 shadow-sm border border-slate-100">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-ink mb-6">
            El Pacto Vitalicio: 5% de Regalías
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            El turismo masivo requiere premiar a quienes innovan y cuidar los recursos naturales. Por ello, Portal Necoclí 2.0 destina de manera innegociable el <strong className="text-green font-bold">5% de sus ventas totales</strong> para devolverle el valor al municipio.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl p-10 shadow-soft border-t-4 border-green hover:-translate-y-2 transition-transform duration-300">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-4 bg-mist rounded-2xl text-green border border-slate-100">
                <Trees className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-ink">3% Ciudad y Playas</h3>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Fondo Institucional</p>
              </div>
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Fondos etiquetados estrictamente para el embellecimiento de Necoclí, gestionados en conjunto con la Alcaldía.
            </p>
            <ul className="space-y-3">
              {[
                "Limpieza y conservación de las playas.",
                "Mantenimiento de senderos urbanos.",
                "Apertura y señalización de rutas turísticas."
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-green mt-2 mr-3 flex-shrink-0" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-soft border-t-4 border-gold hover:-translate-y-2 transition-transform duration-300">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-4 bg-mist rounded-2xl text-gold border border-slate-100">
                <Store className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-ink">2% Gremio Fundador</h3>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Fondo Empresarial</p>
              </div>
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Recompensa económica vitalicia, distribuida como un retorno directo para las primeras 100 empresas que apoyen la Fase 1.
            </p>
            <ul className="space-y-3">
              {[
                "Retorno directo por apoyar el proyecto desde el día cero.",
                "Genera ingresos pasivos para los negocios pioneros.",
                "Fomenta el sentido de pertenencia y adopción de la herramienta."
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-gold mt-2 mr-3 flex-shrink-0" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
