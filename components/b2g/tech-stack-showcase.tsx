import { Smartphone, ShieldCheck, Zap, Server } from "lucide-react";

export function TechStackShowcase() {
  const features = [
    {
      icon: <Smartphone className="w-8 h-8 text-gold" />,
      title: "Plataforma Inteligente",
      description: "Una aplicación moderna que los turistas pueden usar de inmediato en sus teléfonos, sin descargas complicadas y que funciona incluso con poca señal."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-gold" />,
      title: "Pagos 100% Seguros",
      description: "Protegemos cada reserva. El dinero del turista se retiene de forma segura hasta que se cumple el servicio, respaldado por la solidez de Bancolombia."
    },
    {
      icon: <Zap className="w-8 h-8 text-gold" />,
      title: "Coordinación Logística",
      description: "Un sistema de control para flotas y transportadores que organiza y asigna los viajes en tiempo real, evitando el caos en temporada alta."
    },
    {
      icon: <Server className="w-8 h-8 text-gold" />,
      title: "Conexión de Clase Mundial",
      description: "Nuestra plataforma está preparada para recibir a miles de turistas al mismo tiempo, garantizando velocidad y confianza sin importar desde qué país nos visiten."
    }
  ];

  return (
    <section id="tecnologia" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-ink mb-6">Herramientas de Nivel Internacional</h2>
          <p className="text-xl text-slate-600">
            Hemos construido una solución integral que pone a los negocios de Necoclí a la altura de las grandes marcas turísticas globales, facilitando las ventas y la operación diaria.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5 transition-all duration-300 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-ink mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
