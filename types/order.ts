export type RequestCategory =
  | "hotel" // Alojamiento
  | "restaurant" // Restaurantes y comidas
  | "tour" // Tours turísticos e islas
  | "mototaxi" // Transporte en moto
  | "motocarro" // Transporte en motocarro
  | "taxi" // Taxi amarillo
  | "delivery" // Domicilios generales (farmacia, supermercado)
  | "general"; // Solicitud sin clasificar

export const COMMISSION_RATES: Record<RequestCategory, number> = {
  restaurant: 0.06, // 6% Take Rate
  delivery: 0.06, // 6% Take Rate
  hotel: 0.1, // 10% Take Rate
  tour: 0.12, // 12% Take Rate
  mototaxi: 0.0, // Margen ya incluido en tarifa base
  motocarro: 0.0, // Margen ya incluido en tarifa base
  taxi: 0.1, // 10% Take Rate
  general: 0.06, // 6% por defecto
};

export interface ConciergeRequest {
  id?: string;
  name: string;
  email: string;
  phone: string;
  request: string;
  advice?: string;
  estimatedPrice?: number;
  status?: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  type?: "reservation" | "order";
  category?: RequestCategory;
  businessName?: string;
  commission?: number;
  referenceCode?: string;
  createdAt?: string;
  updatedAt?: string;
}
