const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_PEOPLE = 20;

export interface TripSearchParams {
  date?: string;
  people?: string;
}

export interface TripPrefill {
  date?: string;
  people?: number;
}

/** Valida los parámetros enviados por el buscador del home; ignora valores inválidos. */
export function parseTripSearchParams({ date, people }: TripSearchParams): TripPrefill {
  const parsedPeople = Number.parseInt(people ?? "", 10);
  return {
    date: date && DATE_PATTERN.test(date) ? date : undefined,
    people:
      Number.isInteger(parsedPeople) && parsedPeople >= 1
        ? Math.min(parsedPeople, MAX_PEOPLE)
        : undefined,
  };
}
