"use client";

import { useState } from "react";
import { CreditCard, Power, Bell, Save, AlertTriangle } from "lucide-react";
import { SurfaceCard } from "@/components/ui/surface-card";

export function SettingsPanel() {
  const [isSaving, setIsSaving] = useState(false);
  const [bank, setBank] = useState("nequi");
  const [accountNumber, setAccountNumber] = useState("3000000000");
  const [vacationMode, setVacationMode] = useState(false);
  const [acceptingReservations, setAcceptingReservations] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Estado Operativo */}
      <SurfaceCard className="p-8 rounded-[32px] border border-ink/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-coral/10 p-2.5 rounded-xl">
            <Power className="w-5 h-5 text-coral" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink">Estado Operativo</h2>
            <p className="text-sm text-ink/60 mt-1">Controla tu disponibilidad en el portal.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl border border-ink/10 bg-white">
            <div>
              <h4 className="font-semibold text-ink">Recibir nuevas reservas</h4>
              <p className="text-xs text-ink/60">
                Si se apaga, tu comercio aparecerá como "Lleno" o "Cerrado temporalmente".
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={acceptingReservations}
                onChange={(e) => setAcceptingReservations(e.target.checked)}
              />
              <div className="w-11 h-6 bg-ink/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl border border-amber-400/30 bg-amber-50/50">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h4 className="font-semibold text-amber-900">Modo Vacaciones</h4>
              </div>
              <p className="text-xs text-amber-700/80 mt-1">
                Oculta temporalmente tu comercio del listado público sin perder tu información.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={vacationMode}
                onChange={(e) => setVacationMode(e.target.checked)}
              />
              <div className="w-11 h-6 bg-amber-900/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
        </div>
      </SurfaceCard>

      {/* Método de Payout Escrow */}
      <SurfaceCard className="p-8 rounded-[32px] border border-ink/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-500/10 p-2.5 rounded-xl">
            <CreditCard className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink">Cuenta para Liquidación (Escrow)</h2>
            <p className="text-sm text-ink/60 mt-1">
              Donde giraremos el dinero liberado de tus ventas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-ink/80 uppercase tracking-wide">
              Entidad Financiera
            </label>
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full bg-sand/50 border border-ink/10 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all appearance-none"
            >
              <option value="nequi">Nequi</option>
              <option value="bancolombia">Bancolombia (Ahorros)</option>
              <option value="davivienda">Davivienda</option>
              <option value="daviplata">Daviplata</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-ink/80 uppercase tracking-wide">
              Número de Cuenta
            </label>
            <input
              type="text"
              required
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full bg-sand/50 border border-ink/10 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
            />
          </div>
        </div>
      </SurfaceCard>

      {/* Notificaciones */}
      <SurfaceCard className="p-8 rounded-[32px] border border-ink/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-ink/5 p-2.5 rounded-xl">
            <Bell className="w-5 h-5 text-ink" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink">Alertas y Notificaciones</h2>
            <p className="text-sm text-ink/60 mt-1">Mantente al tanto de nuevas reservas.</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input type="checkbox" defaultChecked className="peer sr-only" />
              <div className="w-5 h-5 border-2 border-ink/30 rounded flex items-center justify-center peer-checked:bg-teal peer-checked:border-teal transition-colors">
                <svg
                  className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <span className="text-sm text-ink/80 group-hover:text-ink font-medium">
              Notificar reservas nuevas vía Email
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input type="checkbox" defaultChecked className="peer sr-only" />
              <div className="w-5 h-5 border-2 border-ink/30 rounded flex items-center justify-center peer-checked:bg-teal peer-checked:border-teal transition-colors">
                <svg
                  className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <span className="text-sm text-ink/80 group-hover:text-ink font-medium">
              Enviar reporte semanal de liquidaciones Escrow
            </span>
          </label>
        </div>
      </SurfaceCard>

      <div className="flex justify-end pt-2 pb-10">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-ink hover:bg-ink/90 text-white font-bold py-3.5 px-10 rounded-full transition-all shadow-xl hover:shadow-2xl flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <span>Guardando cambios...</span>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Guardar Configuración</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
