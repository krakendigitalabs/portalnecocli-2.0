import { Heart } from "lucide-react";
import Image from "next/image";

interface SolidarityBannerProps {
  onToggle: (isActive: boolean) => void;
  isActive: boolean;
}

export function SolidarityBanner({ onToggle, isActive }: SolidarityBannerProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm transition-all hover:shadow-md mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left side: Info & Logo */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-20 h-20 relative flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-100 p-2">
            <Image
              src="https://res.cloudinary.com/dwxk79gt0/image/upload/v1747866989/Copia_de_MOTONECO_247_rlibh1.png"
              alt="Motonecos"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h4 className="text-[#0f2e21] font-semibold text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              Apoya a Nuestra Comunidad
            </h4>
            <p className="text-gray-600 text-sm mt-1 max-w-lg">
              Únete al Proyecto de Confianza Turística. Tu aporte voluntario de{" "}
              <strong>$5.000 COP</strong> será donado directamente a la asociación{" "}
              <strong>Motonecos</strong>, apoyando a niños vulnerables con trastornos mentales en
              nuestra región.
            </p>
          </div>
        </div>

        {/* Right side: Action */}
        <div className="flex-shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={() => onToggle(!isActive)}
            className={`w-full md:w-auto px-6 py-2.5 rounded-full border-2 font-medium transition-colors ${
              isActive
                ? "bg-rose-50 border-rose-500 text-rose-600"
                : "border-gray-300 text-gray-700 hover:border-[#0f2e21] hover:text-[#0f2e21]"
            }`}
          >
            {isActive ? "¡Gracias por tu aporte! ❤️" : "Aportar $5.000 COP"}
          </button>
        </div>
      </div>
    </div>
  );
}
