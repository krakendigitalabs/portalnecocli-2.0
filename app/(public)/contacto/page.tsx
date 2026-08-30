import { Container } from "@/components/ui/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contáctanos | Portal Necoclí",
  description: "Información de contacto de Portal Necoclí.",
};

export default function ContactoPage() {
  return (
    <div className="pb-24 pt-16 md:pt-24 min-h-[70vh]">
      <Container className="max-w-4xl space-y-12">
        <div className="space-y-6 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-ink">
            Contáctanos
          </h1>
          <p className="text-xl text-ink/70 max-w-2xl mx-auto">
            ¿Tienes dudas, sugerencias o necesitas ayuda con una reserva? Nuestro equipo está listo para escucharte.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-sand/30 border border-ink/5 p-10 rounded-[32px] space-y-6">
            <h3 className="text-2xl font-bold text-ink">Líneas de Atención</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gold mb-1">Soporte a Turistas</p>
                <a href="mailto:soporte@portalnecocli.com" className="text-lg font-medium text-ink hover:text-green transition-colors">soporte@portalnecocli.com</a>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gold mb-1">Aliados Comerciales</p>
                <a href="mailto:comercial@portalnecocli.com" className="text-lg font-medium text-ink hover:text-green transition-colors">comercial@portalnecocli.com</a>
              </div>
            </div>
          </div>

          <div className="bg-white border border-ink/10 p-10 rounded-[32px] space-y-6 shadow-sm">
            <h3 className="text-2xl font-bold text-ink">Escríbenos</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">Nombre</label>
                <input type="text" className="w-full bg-sand/30 border border-ink/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold/50" placeholder="Tu nombre completo" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">Correo electrónico</label>
                <input type="email" className="w-full bg-sand/30 border border-ink/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold/50" placeholder="ejemplo@correo.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">Mensaje</label>
                <textarea rows={4} className="w-full bg-sand/30 border border-ink/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold/50" placeholder="¿En qué podemos ayudarte?"></textarea>
              </div>
              <button type="button" className="w-full bg-ink text-white font-bold py-4 rounded-xl hover:bg-ink/90 transition-colors mt-2">
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
