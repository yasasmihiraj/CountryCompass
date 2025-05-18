import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Country } from "../types/country";
import CountryCard from "../components/CountryCard";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFavoriteCountries();
    } else {
      setLoading(false);
      setError("🔒 You must be logged in to view favorites.");
    }
  }, [user, refreshFlag]);

  const fetchFavoriteCountries = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://countrycompass-backend.onrender.com/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch favorites");

      const data = await res.json();
      const codes: string[] = data.favorites;

      const fetches = codes.map((code) =>
        fetch(`https://restcountries.com/v3.1/alpha/${code}`).then((res) =>
          res.json()
        )
      );

      const results = await Promise.all(fetches);
      const countries = results.map((res) => res[0]);

      setFavorites(countries);
    } catch (err) {
      console.error(err);
      setError("⚠️ Error fetching favorite countries.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Just trigger refresh – toast is handled elsewhere
  const handleFavoriteRemoved = () => {
    setRefreshFlag((prev) => !prev);
  };

  return (
    <main
      className="min-h-screen 
      bg-gradient-to-r from-pink-300 via-red-300 to-yellow-300 
      dark:bg-gradient-to-r dark:from-pink-900 dark:via-red-900 dark:to-yellow-900 
      text-gray-900 dark:text-white transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-white bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-600 rounded-full px-4 py-2 shadow-md transition-colors duration-300"
          >
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>
        </div>

        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            ❤️ Your Favorite Countries
          </h1>
          <p className="text-black-500 dark:text-gray-300 text-sm">
            These are the countries you’ve marked as favorites.
          </p>
        </header>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-3 text-lg font-medium text-gray-500 dark:text-gray-400">
              Loading favorites...
            </p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 font-semibold py-16">
            {error}
          </div>
        )}

        {!loading && !error && favorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((country) => (
              <CountryCard
                key={country.cca3}
                country={country}
                isFavorited={true}
                onFavoriteRemoved={handleFavoriteRemoved}
              />
            ))}
          </div>
        )}

        {!loading && !error && favorites.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl font-semibold">No favorites added yet.</p>
            <p className="text-sm text-gray-200 mt-1">
              Go to the home page and ❤️ mark countries you love!
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center text-white bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-600 rounded-full px-4 py-2 shadow-md transition-colors duration-300"
            >
              <FaArrowLeft className="mr-2" /> Explore Countries
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default Favorites;
