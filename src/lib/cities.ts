export const INDIA_HIGH_POTENTIAL_CITIES = [
  "Udaipur",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Pune",
  "Indore",
] as const;

export const DEFAULT_LAUNCH_CITY = "Udaipur";

const CITY_ALIASES: Record<string, string> = {
  "north goa": "goa north",
  "south goa": "goa south",
};

export function normalizeCityKey(city: string | null | undefined) {
  const raw = (city || "").toLowerCase().trim().replace(/\s+/g, " ");
  return CITY_ALIASES[raw] || raw;
}

export function canonicalizeCity(city: string | null | undefined) {
  const key = normalizeCityKey(city);
  const matched = INDIA_HIGH_POTENTIAL_CITIES.find(
    (value) => normalizeCityKey(value) === key,
  );
  return matched || (city || "").trim();
}

