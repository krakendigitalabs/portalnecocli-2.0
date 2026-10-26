/**
 * Rutas disponibles para el tour en cuatrimoto en Necoclí.
 */
export type AtvRoute = "ruta1" | "ruta2" | "ruta3" | "ruta4";

/**
 * Información de un piloto (rider) individual para el tour en cuatrimoto.
 * Cada persona requiere póliza individual, por lo que se recopilan
 * nombre completo, cédula y tipo de sangre.
 */
export interface AtvRider {
  fullName: string;
  cedula: string;
  bloodType: string;
  phone?: string;
  email?: string;
}

/**
 * Detalle de una ruta del tour en cuatrimoto.
 */
export interface AtvRouteDetail {
  id: AtvRoute;
  number: number;
  title: string;
  description: string;
  duration: string;
  priceForTwo: number;
  includesLunch: boolean;
  isExtremeRoute: boolean;
}

/**
 * Input del formulario de reserva de cuatrimoto.
 */
export interface AtvBookingInput {
  route: AtvRoute;
  tourDate: string;
  riders: AtvRider[];
  totalPrice: number;
  depositAmount: number;
}

/**
 * Respuesta del server action de reserva de cuatrimoto.
 */
export type AtvBookingResult =
  | {
      success: true;
      ticketId: string;
      message: string;
    }
  | {
      success: false;
      error: string;
      fieldErrors?: { path: string; message: string }[];
    };
