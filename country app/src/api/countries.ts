import { Country } from "../types/country";

const BASE_URL = "https://restcountries.com/v3.1";

export const fetchAllCountries = async (): Promise<Country[]> => {
  const res = await fetch(`${BASE_URL}/all`);
  return await res.json();
};

export const fetchCountryByName = async (name: string): Promise<Country[]> => {
  const res = await fetch(`${BASE_URL}/name/${name}`);
  return await res.json();
};

export const fetchCountriesByRegion = async (region: string): Promise<Country[]> => {
  const res = await fetch(`${BASE_URL}/region/${region}`);
  return await res.json();
};

export const fetchCountryByCode = async (code: string): Promise<Country> => {
  const res = await fetch(`${BASE_URL}/alpha/${code}`);
  const data = await res.json();
  return data[0];
};
