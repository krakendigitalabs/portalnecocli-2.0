"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { type BookingResponse, processBookingRequest } from "@/lib/actions/booking";
import { BookingRequestSchema } from "@/lib/validations/schemas";

// Extraemos el tipo base de Zod pero modificamos date para el formulario (viene como string en HTML)
const FormSchema = BookingRequestSchema.extend({
  reservationDate: z.string().min(1, "Selecciona una fecha"),
});

type FormValues = z.infer<typeof FormSchema>;

export type PackageOption = {
  id: string;
  label: string;
  price: number;
};

type BookingFormProps = {
  businessId?: string;
  baseServiceName: string;
  routingType: "CASE_A" | "CASE_B";
  packageOptions?: PackageOption[];
};

export function BookingForm({
  businessId,
  baseServiceName,
  routingType,
  packageOptions = [],
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<BookingResponse | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      businessId,
      serviceName: packageOptions.length > 0 ? packageOptions[0].id : baseServiceName,
      routingType,
      guests: 1,
    },
  });

  const guestsCount = watch("guests") || 1;
  const selectedOptionId = watch("serviceName");

  // Find the selected option price
  const selectedOption = packageOptions.find((opt) => opt.id === selectedOptionId);
  const totalAmount =
    routingType === "CASE_A" && selectedOption ? selectedOption.price * guestsCount : undefined;

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setResponse(null);

    try {
      // Re-map serviceName to the human readable label for the backend
      const finalServiceName = selectedOption
        ? `${baseServiceName} - ${selectedOption.label}`
        : data.serviceName;

      const serverData = {
        ...data,
        serviceName: finalServiceName,
        reservationDate: new Date(data.reservationDate),
        totalAmount,
      };

      const result = await processBookingRequest(serverData);
      setResponse(result);

      if (result.success && result.whatsappLink) {
        // Redirigir a WhatsApp después de un breve delay
        setTimeout(() => {
          window.location.href = result.whatsappLink!;
        }, 1500);
      }
    } catch (error) {
      setResponse({ success: false, message: "Ocurrió un error de conexión." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (response?.success) {
    return (
      <SurfaceCard className="p-8 text-center rounded-[32px]">
        <CheckCircle2 className="w-16 h-16 text-teal mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-ink mb-2">¡Solicitud Registrada!</h3>
        <p className="text-ink/70 mb-6">{response.message}</p>

        {response.whatsappLink && (
          <Button
            className="w-full rounded-full bg-green text-white hover:bg-green/90 h-12 shadow-lg shadow-green/20"
            href={response.whatsappLink}
          >
            Continuar en WhatsApp <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        )}

        {response.ticketId && (
          <Button
            className="w-full rounded-full bg-gold text-white hover:bg-gold/90 h-12 shadow-lg shadow-gold/20"
            href={`/tickets/${response.ticketId}`}
          >
            Ver Ticket de Pago <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        )}
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="p-6 md:p-8 rounded-[32px]">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-ink mb-1">Reserva tu lugar</h3>
        <p className="text-sm text-ink/60">Completa tus datos para confirmar disponibilidad.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Service Options Select */}
        {packageOptions.length > 0 && (
          <div>
            <label className="block text-xs font-bold text-ink/70 uppercase tracking-widest mb-1.5">
              Opción del Paquete
            </label>
            <select
              {...register("serviceName")}
              className="w-full h-12 px-4 rounded-xl border border-ink/10 bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
            >
              {packageOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.serviceName && (
              <p className="text-coral text-xs mt-1 font-medium">{errors.serviceName.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-ink/70 uppercase tracking-widest mb-1.5">
            Nombre Completo
          </label>
          <input
            {...register("customerName")}
            className="w-full h-12 px-4 rounded-xl border border-ink/10 bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
            placeholder="Ej. Juan Pérez"
          />
          {errors.customerName && (
            <p className="text-coral text-xs mt-1 font-medium">{errors.customerName.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-ink/70 uppercase tracking-widest mb-1.5">
              Teléfono
            </label>
            <input
              {...register("customerPhone")}
              className="w-full h-12 px-4 rounded-xl border border-ink/10 bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
              placeholder="+57 300 000 0000"
            />
            {errors.customerPhone && (
              <p className="text-coral text-xs mt-1 font-medium">{errors.customerPhone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-ink/70 uppercase tracking-widest mb-1.5">
              Correo
            </label>
            <input
              type="email"
              {...register("customerEmail")}
              className="w-full h-12 px-4 rounded-xl border border-ink/10 bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
              placeholder="juan@email.com"
            />
            {errors.customerEmail && (
              <p className="text-coral text-xs mt-1 font-medium">{errors.customerEmail.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-ink/70 uppercase tracking-widest mb-1.5">
              Fecha
            </label>
            <input
              type="date"
              {...register("reservationDate")}
              className="w-full h-12 px-4 rounded-xl border border-ink/10 bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
            />
            {errors.reservationDate && (
              <p className="text-coral text-xs mt-1 font-medium">
                {errors.reservationDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-ink/70 uppercase tracking-widest mb-1.5">
              Huéspedes / Cupos
            </label>
            <input
              type="number"
              min={1}
              {...register("guests", { valueAsNumber: true })}
              className="w-full h-12 px-4 rounded-xl border border-ink/10 bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
            />
            {errors.guests && (
              <p className="text-coral text-xs mt-1 font-medium">{errors.guests.message}</p>
            )}
          </div>
        </div>

        {response?.success === false && (
          <div className="p-4 rounded-xl bg-coral/10 border border-coral/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-coral shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-coral/90">{response.message}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-14 rounded-full bg-teal text-white hover:bg-teal/90 shadow-lg shadow-teal/20 text-lg font-bold mt-4"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Procesando...
            </>
          ) : routingType === "CASE_B" ? (
            "Solicitar Disponibilidad"
          ) : (
            "Ir a Pagar"
          )}
        </Button>
      </form>
    </SurfaceCard>
  );
}
