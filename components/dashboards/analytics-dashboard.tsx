"use client";

import { useState, useEffect } from "react";
import { SurfaceCard } from "@/components/ui/surface-card";
import { BarChart3, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnalyticsDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  useEffect(() => {
    // We only access process.env on the client side inside useEffect 
    // if we want to ensure it matches or we can just read NEXT_PUBLIC
    const url = process.env.NEXT_PUBLIC_LOOKER_STUDIO_EMBED_URL;
    if (url && url !== "https://lookerstudio.google.com/embed/reporting/your-report-id/page/1M") {
      setEmbedUrl(url);
    }
  }, []);

  return (
    <SurfaceCard className="rounded-[28px] p-8 col-span-full">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-600 dark:text-emerald-400">
            Inteligencia de Negocios (GA4)
          </p>
          <h2 className="mt-2 text-2xl font-bold text-ink flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Tráfico y Rendimiento
          </h2>
          <p className="mt-1 text-sm text-ink/60">
            Métricas de adquisición de usuarios y rendimiento de campañas.
          </p>
        </div>
        {embedUrl && (
          <Button variant="secondary" size="sm" className="hidden sm:flex" asChild>
            <a href={embedUrl} target="_blank" rel="noopener noreferrer">
              Abrir reporte
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        )}
      </div>

      <div className="w-full">
        {!embedUrl ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              Dashboard no configurado
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
              Para visualizar las métricas aquí, debes configurar la variable de entorno <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-sm">NEXT_PUBLIC_LOOKER_STUDIO_EMBED_URL</code> con el enlace de inserción de tu reporte de Looker Studio.
            </p>
          </div>
        ) : (
          <div className="relative w-full aspect-square sm:aspect-video lg:aspect-[21/9]">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="w-full h-full rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              </div>
            )}
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              style={{ display: isLoading ? "none" : "block" }}
              onLoad={() => setIsLoading(false)}
              allowFullScreen
              sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        )}
      </div>
    </SurfaceCard>
  );
}
