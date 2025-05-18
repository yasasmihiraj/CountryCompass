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
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userFavorites, setUserFavorites] = useState<string[]>([]);

  // ✅ Load countries AND favorites when user changes
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        await loadAllCountries();
        if (user) await fetchUserFavorites();
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [user]);

  const loadAllCountries = async () => {
    try {
      const data = await fetchAllCountries();
      setCountries(data);
    } catch {
      setError("Failed to load countries. Please try again.");
      setCountries([]);
    }
  };

  const fetchUserFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://countrycompass-backend.onrender.com/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch favorites");

      const data = await res.json();
      setUserFavorites(data.favorites || []);
    } catch (err) {
      console.error("Failed to fetch user favorites:", err);
    }
  };

  const handleSearch = async (name: string) => {
    if (!name) return await refreshAll();

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
    if (!region) return await refreshAll();

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

  // ✅ Refresh countries and favorites after filters/search clear
  const refreshAll = async () => {
    setLoading(true);
    setError(null);
    try {
      await loadAllCountries();
      if (user) await fetchUserFavorites();
    } catch {
      setError("Failed to refresh data.");
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
      <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 drop-shadow-lg flex items-center justify-center gap-2">
            <span role="img" aria-label="Earth">🌍</span>
            <span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-pink-600 to-yellow-500 dark:from-indigo-200 dark:via-pink-300 dark:to-yellow-200 animate-gradient-x">
                Explore Countries
              </span>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 font-medium">
                  Discover, search, and favorite countries worldwide! 🌐✨
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
              <CountryCard
              key={country.cca3}
              country={country}
              {...(user && {
                isFavorited: userFavorites.includes(country.cca3),
                onFavoriteAdded: () =>
                  setUserFavorites((prev) => [...prev, country.cca3]),
                onFavoriteRemoved: () =>
                  setUserFavorites((prev) =>
                    prev.filter((code) => code !== country.cca3)
                  ),
              })}
            />
            
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
