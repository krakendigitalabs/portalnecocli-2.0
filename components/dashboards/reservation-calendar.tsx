"use client";

import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { Reservation } from "@/types/reservation";

type Props = {
  reservations: Reservation[];
};

export function ReservationCalendar({ reservations }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month); // 0 = Sunday

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Helper para normalizar una fecha ignorando las horas (solo nos importa el día/mes/año)
  const getStartOfDay = (dateString: string | undefined | null) => {
    if (!dateString) return 0;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 0;
    // Si viene como string '2026-09-18' localmente al hacer new Date puede desfasarse por horas,
    // extraemos explicitamente o confiamos en Date con UTC ajustado.
    // Lo más seguro es usar el año, mes y día de la fecha local
    d.setHours(0, 0, 0, 0);
    // Para compensar UTC de Firestore si fuese ISO
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  // Helper para verificar si hay reserva en un día específico (comprueba RANGOS de viaje)
  const getReservationsForDay = (day: number) => {
    if (!day) return [];

    // El timestamp (comienzo del día) de la celda del calendario que estamos dibujando
    const cellDate = new Date(year, month, day, 0, 0, 0, 0).getTime();

    return reservations.filter((r) => {
      // 1. Si la reserva tiene fechas exactas, usamos el rango de lead
      if (r.lead?.check_in_date) {
        const checkIn = getStartOfDay(r.lead.check_in_date);

        // Si hay check_out, es un rango de días. Si no hay, es solo 1 día.
        const checkOut = r.lead.check_out_date ? getStartOfDay(r.lead.check_out_date) : checkIn; // +1 día por defecto si quisiéramos, pero así está bien

        return cellDate >= checkIn && cellDate <= checkOut;
      }

      // 2. Si no hay fecha de viaje, retrocedemos al fallback ilustrativo (fecha de creación)
      const createdDate = getStartOfDay(r.created_at);
      return cellDate === createdDate;
    });
  };

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  return (
    <SurfaceCard className="rounded-[28px] p-8 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-teal">
            Mi Itinerario
          </p>
          <h3 className="mt-2 text-xl font-bold text-ink">Calendario de Viajes</h3>
        </div>
        <div className="bg-teal/10 p-3 rounded-2xl text-teal">
          <CalendarIcon className="w-6 h-6" />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 bg-ink/5 p-2 rounded-2xl">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-white rounded-xl transition-colors text-ink/70"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-ink">
          {monthNames[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-white rounded-xl transition-colors text-ink/70"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map((d) => (
          <div key={d} className="text-xs font-bold text-ink/40 py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-10"></div>;
          }

          const dayReservations = getReservationsForDay(day);
          const hasReservations = dayReservations.length > 0;
          const isToday = isCurrentMonth && day === today.getDate();

          return (
            <div
              key={`day-${day}`}
              className={`
                h-10 flex flex-col items-center justify-center rounded-xl text-sm relative group cursor-default transition-all
                ${isToday && !hasReservations ? "bg-ink/5 font-bold text-ink" : ""}
                ${hasReservations ? "bg-teal/15 font-bold text-teal shadow-sm border border-teal/20 hover:scale-110 z-10" : "text-ink/70 hover:bg-ink/5"}
              `}
            >
              <span>{day}</span>
              {hasReservations && (
                <div className="absolute -bottom-1 flex gap-0.5">
                  {dayReservations.map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-teal" />
                  ))}
                </div>
              )}

              {/* Tooltip con el nombre del negocio */}
              {hasReservations && (
                <div className="absolute bottom-full mb-2 bg-ink text-white text-xs py-1 px-3 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none shadow-lg">
                  {dayReservations.map((r) => r.business_name).join(", ")}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-ink rotate-45" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {reservations.length === 0 && (
        <div className="mt-6 text-center">
          <Link
            href="/negocios"
            className="text-sm font-bold text-teal hover:underline inline-flex items-center gap-1"
          >
            Agenda tu próxima aventura <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </SurfaceCard>
  );
}
