"use client";

import { useState } from "react";
import { SurfaceCard } from "@/components/ui/surface-card";
import { sendCustomEmailAction } from "@/app/actions/drivers";

export function DriverCrmPanel({ drivers }: { drivers: any[] }) {
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Filtramos solo los que tienen email para poder seleccionarlos
  const driversWithEmail = drivers.filter((d) => d.email && d.email.includes("@"));

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedEmails(driversWithEmail.map((d) => d.email));
    } else {
      setSelectedEmails([]);
    }
  };

  const handleSelectOne = (email: string) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email],
    );
  };

  const handleSendEmail = async () => {
    if (selectedEmails.length === 0) {
      setNotification({ type: "error", text: "Selecciona al menos un conductor." });
      return;
    }
    if (!subject.trim() || !message.trim()) {
      setNotification({ type: "error", text: "Asunto y mensaje son obligatorios." });
      return;
    }

    setLoading(true);
    setNotification(null);
    try {
      const res = await sendCustomEmailAction(selectedEmails, subject, message);
      if (res.success) {
        setNotification({
          type: "success",
          text: `Correo enviado exitosamente a ${res.count} conductor(es).`,
        });
        setSubject("");
        setMessage("");
        setSelectedEmails([]);
      } else {
        setNotification({ type: "error", text: res.error || "Error al enviar correo" });
      }
    } catch (err: any) {
      setNotification({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SurfaceCard className="rounded-[28px] p-8">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-indigo-600">
          Neco-Dispatch · CRM
        </p>
        <h2 className="mt-2 text-2xl font-bold text-ink">Base de Datos y Comunicaciones</h2>
        <p className="mt-1 text-sm text-ink/60">
          Selecciona a los conductores para enviarles notificaciones masivas o individuales.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Lado Izquierdo: Tabla de Datos */}
        <div className="border border-ink/8 rounded-2xl overflow-hidden flex flex-col bg-white h-[400px]">
          <div className="bg-sand/30 px-4 py-3 border-b border-ink/8 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  selectedEmails.length > 0 && selectedEmails.length === driversWithEmail.length
                }
                className="w-4 h-4 rounded border-ink/20 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs font-bold text-ink/70 uppercase">Seleccionar Todos</span>
            </div>
            <span className="text-xs font-semibold text-ink/50">
              {driversWithEmail.length} disponibles
            </span>
          </div>

          <div className="overflow-y-auto p-4 space-y-2 flex-1">
            {driversWithEmail.map((driver) => (
              <label
                key={driver.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-ink/5 hover:bg-sand/20 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedEmails.includes(driver.email)}
                  onChange={() => handleSelectOne(driver.email)}
                  className="w-4 h-4 rounded border-ink/20 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">{driver.full_name}</p>
                  <p className="text-xs text-ink/60 truncate">{driver.email}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                      driver.status === "active"
                        ? "bg-teal/10 text-teal"
                        : driver.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {driver.status === "pending_approval" ? "Pendiente" : driver.status}
                  </span>
                </div>
              </label>
            ))}
            {driversWithEmail.length === 0 && (
              <p className="text-sm text-center text-ink/40 mt-10">
                No hay conductores con correo registrado.
              </p>
            )}
          </div>
        </div>

        {/* Lado Derecho: Editor de Correo */}
        <div className="flex flex-col gap-4">
          <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl flex-1 flex flex-col">
            <h3 className="text-sm font-bold text-indigo-900 mb-4 flex justify-between items-center">
              <span>Redactar Notificación</span>
              <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-full text-xs">
                {selectedEmails.length} dest.
              </span>
            </h3>

            <input
              type="text"
              placeholder="Asunto del correo (ej. Actualización de Tarifas)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 text-sm"
            />

            <textarea
              placeholder="Escribe tu mensaje aquí. Puedes usar HTML básico si lo deseas..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full flex-1 px-4 py-3 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm mb-4 min-h-[150px]"
            />

            {notification && (
              <div
                className={`mb-4 text-sm p-3 rounded-xl ${notification.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
              >
                {notification.text}
              </div>
            )}

            <button
              onClick={handleSendEmail}
              disabled={loading || selectedEmails.length === 0}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? "Enviando..." : "Enviar Correo a Seleccionados 🚀"}
            </button>
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}
