import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Country } from "../types/country";

type CountryCardProps = {
  country: Country;
};

const CountryCard: React.FC<CountryCardProps> = ({ country }) => {
  const [loading, setLoading] = useState(true);

  // Handle image load event
  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <Link
      to={`/country/${country.cca3}`}
      className="block bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg border border-white/20 dark:border-white/10 shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl transform"
    >
      <div className="relative">
        {/* Flag Image with Loader */}
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="loader-ring"></div>
          </div>
        )}
        <img
          src={country.flags.png}
          alt={`${country.name.common} flag`}
          className={`w-full h-48 object-cover rounded-t-lg ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
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
  );
};

export default CountryCard;
