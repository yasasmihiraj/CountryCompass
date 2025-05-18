import { useEffect, useState } from "react";
import { Country } from "../types/country";
import {
  fetchAllCountries,
  fetchCountryByName,
  fetchCountriesByRegion,
} from "../api/countries";
import CountryCard from "../components/CountryCard";
import SearchBar from "../components/SearchBar";
import Filter from "../components/Filter";

const Home = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAllCountries();
  }, []);

  const loadAllCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllCountries();
      setCountries(data);
    } catch {
      setError("Failed to load countries. Please try again.");
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (name: string) => {
    if (!name) return loadAllCountries();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCountryByName(name);
      setCountries(data);
    } catch {
      setError(`No results found for "${name}".`);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (region: string) => {
    if (!region) return loadAllCountries();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCountriesByRegion(region);
      setCountries(data);
    } catch {
      setError(`No countries found in the "${region}" region.`);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen 
bg-gradient-to-r from-sky-400 via-teal-300 to-lime-300 
dark:bg-gradient-to-r dark:from-sky-900 dark:via-teal-900 dark:to-lime-900 
text-gray-900 dark:text-white transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            🌍 Explore Countries Around the World!
          </h1>
          <p className="text-black-500 dark:text-gray-300 text-sm">
            Search by name or filter by region to discover country details.
          </p>
        </header>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <SearchBar onSearch={handleSearch} />
          <Filter onFilter={handleFilter} />
        </div>

        {loading && (
          <div className="text-center text-lg font-medium animate-pulse py-16">
            <span className="inline-block w-6 h-6 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></span>
            <p className="mt-3">Loading countries...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 font-semibold py-16">
            {error}
          </div>
        )}

        {!loading && !error && countries.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {countries.map((country) => (
              <CountryCard key={country.cca3} country={country} />
            ))}
          </div>
        )}

        {!loading && !error && countries.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl font-semibold">No countries found.</p>
            <p className="text-sm text-gray-200 mt-1">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;