
/**
 * Tariff Lookup Service — Busca el precio oficial de una carrera por destino.
 *
 * Esta estructura indexa los tarifarios oficiales de motocarros 2026
 * para que Alejandro (AI) y el sistema de Rides puedan consultar precios
 * programáticamente sin depender del texto plano del prompt.
 */

export interface TariffEntry {
  destination: string;
  route: string;
  price: number; // Precio diurno en COP (ya incluye +10%)
}

/**
 * Tarifario completo de motocarros indexado por destino (lowercase, sin tildes).
 * Fuente: docs/TARIFARIO_MOTOCARRO_2026.md (con +10% aplicado).
 */
const MOTOCARRO_TARIFFS: TariffEntry[] = [
  // --- CASCO URBANO ---
  { destination: "casco urbano", route: "urbano", price: 6600 },

  // --- VÍA SAN SEBASTIÁN ---
  { destination: "mirador", route: "via_san_sebastian", price: 7700 },
  { destination: "barrio las flores", route: "via_san_sebastian", price: 11000 },
  { destination: "entrada simon la playa", route: "via_san_sebastian", price: 13200 },
  { destination: "riki ron", route: "via_san_sebastian", price: 13200 },
  { destination: "neco bote", route: "via_san_sebastian", price: 16500 },
  { destination: "urantia", route: "via_san_sebastian", price: 13200 },
  { destination: "esquina caliente", route: "via_san_sebastian", price: 13200 },
  { destination: "campin de jairo", route: "via_san_sebastian", price: 16500 },
  { destination: "peniel", route: "via_san_sebastian", price: 16500 },
  { destination: "mocho nicolas", route: "via_san_sebastian", price: 16500 },
  { destination: "balastrera", route: "via_san_sebastian", price: 16500 },
  { destination: "nirvana", route: "via_san_sebastian", price: 19800 },
  { destination: "el hoyito", route: "via_san_sebastian", price: 19800 },
  { destination: "rio necocli", route: "via_san_sebastian", price: 29700 },
  { destination: "acueducto", route: "via_san_sebastian", price: 39600 },
  { destination: "la mesa", route: "via_san_sebastian", price: 39600 },
  { destination: "el caballo", route: "via_san_sebastian", price: 55000 },
  { destination: "marimonda", route: "via_san_sebastian", price: 66000 },
  { destination: "lechugal", route: "via_san_sebastian", price: 82500 },

  // --- VÍA MELLITO ---
  { destination: "aeropuerto", route: "via_mellito", price: 13200 },
  { destination: "villa lucia", route: "via_mellito", price: 13200 },
  { destination: "providencia", route: "via_mellito", price: 13200 },
  { destination: "vale pava", route: "via_mellito", price: 16500 },
  { destination: "vale arriba miranda", route: "via_mellito", price: 19800 },
  { destination: "vale adentro", route: "via_mellito", price: 27500 },
  { destination: "botijuela", route: "via_mellito", price: 27500 },
  { destination: "piedrecita", route: "via_mellito", price: 33000 },
  { destination: "mellito", route: "via_mellito", price: 38500 },
  { destination: "buenos aires", route: "via_mellito", price: 49500 },
  { destination: "caribia", route: "via_mellito", price: 49500 },
  { destination: "curva de narvaez", route: "via_mellito", price: 52800 },
  { destination: "alto rosario", route: "via_mellito", price: 59400 },
  { destination: "sucio", route: "via_mellito", price: 59400 },
  { destination: "quebrada del palo", route: "via_mellito", price: 59400 },
  { destination: "la merced", route: "via_mellito", price: 59400 },
  { destination: "mulato", route: "via_mellito", price: 59400 },
  { destination: "limoncito", route: "via_mellito", price: 60500 },
  { destination: "cativo", route: "via_mellito", price: 66000 },
  { destination: "la yaya", route: "via_mellito", price: 71500 },
  { destination: "los naranjos", route: "via_mellito", price: 88000 },
  { destination: "changas", route: "via_mellito", price: 93500 },
  { destination: "zapata", route: "via_mellito", price: 93500 },
  { destination: "el bolao", route: "via_mellito", price: 99000 },
  { destination: "iguana porvenir", route: "via_mellito", price: 99000 },
  { destination: "iguana central", route: "via_mellito", price: 110000 },
  { destination: "pajon", route: "via_mellito", price: 39600 },
  { destination: "el cedro", route: "via_mellito", price: 42900 },
  { destination: "la bomba", route: "via_mellito", price: 42900 },
  { destination: "la gran colombia", route: "via_mellito", price: 42900 },

  // --- VÍA GARITON ---
  { destination: "guacamaya arriba", route: "via_gariton", price: 33000 },
  { destination: "guacamaya abajo", route: "via_gariton", price: 39600 },
  { destination: "gariton", route: "via_gariton", price: 44000 },
  { destination: "almacigo arriba", route: "via_gariton", price: 66000 },
  { destination: "bejuco", route: "via_gariton", price: 66000 },
  { destination: "almacigo abajo", route: "via_gariton", price: 71500 },
  { destination: "chapal las vegas", route: "via_gariton", price: 92400 },

  // --- VÍA PUEBLO NUEVO ---
  { destination: "bobal", route: "via_pueblo_nuevo", price: 13200 },
  { destination: "franklin", route: "via_pueblo_nuevo", price: 22000 },
  { destination: "loma de machado", route: "via_pueblo_nuevo", price: 33000 },
  { destination: "sevilla", route: "via_pueblo_nuevo", price: 39600 },
  { destination: "bobal carito", route: "via_pueblo_nuevo", price: 46200 },
  { destination: "loma de piedra", route: "via_pueblo_nuevo", price: 60500 },
  { destination: "comarca", route: "via_pueblo_nuevo", price: 66000 },
  { destination: "pueblo nuevo", route: "via_pueblo_nuevo", price: 66000 },
  { destination: "brisas del rio", route: "via_pueblo_nuevo", price: 77000 },
  { destination: "ecuador", route: "via_pueblo_nuevo", price: 77000 },
  { destination: "villa sonia", route: "via_pueblo_nuevo", price: 82500 },
  { destination: "villa nueva", route: "via_pueblo_nuevo", price: 82500 },
  { destination: "cenizosa", route: "via_pueblo_nuevo", price: 82500 },
  { destination: "san isidro", route: "via_pueblo_nuevo", price: 88000 },
  { destination: "mello villavicencio", route: "via_pueblo_nuevo", price: 99000 },
  { destination: "tulapita", route: "via_pueblo_nuevo", price: 99000 },
  { destination: "paraiso tulapa", route: "via_pueblo_nuevo", price: 110000 },

  // --- VÍA TOTUMO ---
  { destination: "el cobre", route: "via_totumo", price: 11000 },
  { destination: "bobal la playa", route: "via_totumo", price: 13200 },
  { destination: "carlos carretera", route: "via_totumo", price: 16500 },
  { destination: "casa blanca", route: "via_totumo", price: 19800 },
  { destination: "carlos adentro", route: "via_totumo", price: 27500 },
  { destination: "carlos playa", route: "via_totumo", price: 27500 },
  { destination: "carlos volcan", route: "via_totumo", price: 27500 },
  { destination: "la cana", route: "via_totumo", price: 27500 },
  { destination: "playa machin", route: "via_totumo", price: 27500 },
  { destination: "totumo", route: "via_totumo", price: 27500 },
  { destination: "seivita", route: "via_totumo", price: 30800 },
  { destination: "puente caiman", route: "via_totumo", price: 38500 },

  // --- VÍA MONCHOLO ---
  { destination: "barrio la y", route: "via_moncholo", price: 13200 },
  { destination: "el lejano", route: "via_moncholo", price: 19800 },
  { destination: "moncholo", route: "via_moncholo", price: 26400 },
  { destination: "moncholo cementerio", route: "via_moncholo", price: 29700 },
  { destination: "nuevo oriente", route: "via_moncholo", price: 33000 },
  { destination: "arizal teofilo", route: "via_moncholo", price: 36300 },
  { destination: "arizal caseta", route: "via_moncholo", price: 46200 },
  { destination: "finca la gloria", route: "via_moncholo", price: 55000 },

  // --- VÍA AGUAS CLARAS ---
  { destination: "yoqui cenizosa", route: "via_aguas_claras", price: 99000 },
  { destination: "comejen", route: "via_aguas_claras", price: 99000 },
  { destination: "los naranjos aguas claras", route: "via_aguas_claras", price: 99000 },
  { destination: "nueva luz", route: "via_aguas_claras", price: 108900 },
  { destination: "el indio", route: "via_aguas_claras", price: 108900 },
  { destination: "la magdalena", route: "via_aguas_claras", price: 108900 },
];

/**
 * Normaliza un string para búsqueda (lowercase, sin tildes, sin caracteres especiales).
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

/**
 * Busca la tarifa de motocarro por destino usando fuzzy matching.
 * Retorna la primera coincidencia o null si no encuentra.
 */
export function lookupMotocarroTariff(destination: string): TariffEntry | null {
  const normalizedQuery = normalize(destination);

  // Búsqueda exacta primero
  const exact = MOTOCARRO_TARIFFS.find((t) => normalize(t.destination) === normalizedQuery);
  if (exact) return exact;

  // Búsqueda parcial (el query está contenido en el destino o viceversa)
  const partial = MOTOCARRO_TARIFFS.find(
    (t) =>
      normalize(t.destination).includes(normalizedQuery) ||
      normalizedQuery.includes(normalize(t.destination)),
  );
  if (partial) return partial;

  return null;
}

/**
 * Retorna todas las tarifas para una ruta específica.
 */
export function getTariffsByRoute(routeKey: string): TariffEntry[] {
  return MOTOCARRO_TARIFFS.filter((t) => t.route === routeKey);
}

/**
 * Retorna todas las rutas disponibles (únicas).
 */
export function getAvailableRoutes(): string[] {
  return [...new Set(MOTOCARRO_TARIFFS.map((t) => t.route))];
}

/**
 * Retorna el tarifario completo.
 */
export function getAllTariffs(): TariffEntry[] {
  return MOTOCARRO_TARIFFS;
}
