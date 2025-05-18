import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Country } from "../types/country";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

type CountryCardProps = {
  country: Country;
  isFavorited?: boolean;
  onFavoriteAdded?: () => void;
  onFavoriteRemoved?: () => void;
};

const CountryCard: React.FC<CountryCardProps> = ({
  country,
  isFavorited = false,
  onFavoriteAdded,
  onFavoriteRemoved,
}) => {
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(isFavorited);
  const { user, favorites, setFavorites } = useAuth(); // ✅ Access global favorites

  useEffect(() => {
    setIsFavorite(isFavorited);
  }, [isFavorited]);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!user) {
      toast.warn("Please login to manage favorites");
      return;
    }

    const token = localStorage.getItem("token");
    const endpoint = isFavorite
      ? "https://countrycompass-backend.onrender.com/api/favorites/remove"
      : "https://countrycompass-backend.onrender.com/api/favorites/add";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ countryCode: country.cca3 }),
      });

      if (res.ok) {
        const updated = isFavorite
          ? favorites.filter((code) => code !== country.cca3)
          : [...favorites, country.cca3];

        setFavorites(updated); // ✅ Update global state
        setIsFavorite(!isFavorite);

        if (!isFavorite) {
          onFavoriteAdded?.();
          toast.success("✅ Added to favorites");
        } else {
          onFavoriteRemoved?.();
          toast.info("❌ Removed from favorites");
        }
      } else {
        const data = await res.json();
        toast.error(data.message || "Error updating favorite");
      }
    } catch (err) {
      console.error("Toggle favorite error:", err);
      toast.error("Failed to update favorites.");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleFavorite}
        className={`absolute top-2 right-2 z-10 px-3 py-1 rounded-full text-sm font-medium shadow transition ${
          isFavorite
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-red-100 hover:bg-red-200 text-red-600"
        }`}
      >
        {isFavorite ? "❤️ Added" : "🤍 Favorite"}
      </button>

      <Link
        to={`/country/${country.cca3}`}
        className="block bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg border border-white/20 dark:border-white/10 shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl transform"
      >
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="loader-ring"></div>
            </div>
          )}
          <img
            src={country.flags.png}
            alt={`${country.name.common} flag`}
            className={`w-full h-48 object-cover rounded-t-lg ${
              loading ? "opacity-0" : "opacity-100"
            } transition-opacity duration-300`}
            onLoad={handleImageLoad}
          />
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            {country.name.common}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Region:</strong> {country.region}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            <strong>Population:</strong> {country.population.toLocaleString()}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default CountryCard;
