import { US_STATES, USState } from "./usStates";
import { US_CITIES } from "./usCities";

export const getUSStates = (): USState[] => US_STATES;

export const getUSStateByCode = (code: string): USState | undefined =>
  US_STATES.find((s) => s.code === code);

export const getUSStateName = (code: string): string =>
  getUSStateByCode(code)?.name ?? code;

export const getUSCitiesByState = (stateCode: string): string[] =>
  US_CITIES[stateCode] ?? [];

export const isValidUSState = (code: string): boolean =>
  US_STATES.some((s) => s.code === code);

export const isValidUSZipCode = (zip: string): boolean =>
  /^\d{5}(-\d{4})?$/.test(zip);

export const COUNTRIES = [{ code: "US", name: "United States" }] as const;

export type CountryCode = (typeof COUNTRIES)[number]["code"];
