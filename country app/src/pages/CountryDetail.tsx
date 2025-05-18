// CountryDetail.tsx
import { JSX, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchCountryByCode } from "../api/countries";
import { Country } from "../types/country";
import {
  FaArrowLeft,
  FaGlobe,
  FaUsers,
  FaLanguage,
  FaCity,
  FaMapMarkedAlt,
} from "react-icons/fa";

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center">
    <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
    <p className="mt-3 text-lg font-medium text-gray-500 dark:text-gray-400">
      Loading country details...
    </p>
  </div>
);

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: JSX.Element;
  label: string;
  value: string | JSX.Element;
}) => (
  <div className="flex items-start gap-2">
    <span className="mt-1 text-primary">{icon}</span>
    <span className="text-sm">
      <strong>{label}:</strong> {typeof value === "string" ? value : value}
    </span>
  </div>
);

const CountryDetail = () => {
  const { user, authLoading } = useAuth();
  const { code } = useParams<{ code: string }>();
  const [country, setCountry] = useState<Country | null>(null);
  const [borderCountries, setBorderCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      if (!user || !code) return;

      try {
        setLoading(true);
        const data = await fetchCountryByCode(code);
        setCountry(data);

        if (data.borders?.length) {
          const neighbors = await Promise.all(
            data.borders.map(async (borderCode) => {
              try {
                const res = await fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`);
                const json = await res.json();
                return json[0];
              } catch {
                return null;
              }
            })
          );
          setBorderCountries(neighbors.filter(Boolean));
        } else {
          setBorderCountries([]);
        }
      } catch {
        setError("Failed to load country details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [code, user]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-xl font-semibold text-red-500">
          🔒 Please log in to view country details.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center text-white bg-indigo-500 hover:bg-indigo-600 rounded-full px-4 py-2 shadow-md transition"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] transition-all duration-300">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="text-center py-16">
        <p className="text-xl font-semibold text-red-500">
          {error || "Country not found."}
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center text-primary hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-pink-300 via-red-300 to-yellow-300 dark:from-pink-900 dark:via-red-900 dark:to-yellow-900 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center mb-6 text-sm text-white bg-indigo-500 hover:bg-indigo-600 rounded-full px-4 py-2 shadow-md transition"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Flag */}
          <div className="md:w-1/2 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
            <img
              src={country.flags.png}
              alt={`${country.name.common} flag`}
              className="w-full h-56 md:h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="md:w-1/2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-sm p-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {country.name.common}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <em>Official Name:</em> {country.name.official}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <DetailItem icon={<FaCity />} label="Capital" value={country.capital?.[0] || "—"} />
              <DetailItem icon={<FaGlobe />} label="Region" value={country.region} />
              <DetailItem icon={<FaUsers />} label="Population" value={country.population.toLocaleString()} />
              <DetailItem
                icon={<FaLanguage />}
                label="Languages"
                value={Object.values(country.languages || {}).join(", ") || "—"}
              />
              <DetailItem
                icon={<FaGlobe />}
                label="Currencies"
                value={
                  country.currencies
                    ? Object.entries(country.currencies)
                        .map(([code, cur]: any) => `${cur.name} (${cur.symbol || code})`)
                        .join(", ")
                    : "—"
                }
              />
              <DetailItem
                icon={<FaMapMarkedAlt />}
                label="Google Maps"
                value={
                  <a
                    href={country.maps?.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline hover:text-blue-300"
                  >
                    Open Map
                  </a>
                }
              />
            </div>
          </div>
        </div>

        {/* Neighboring Countries */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Neighboring Countries</h2>
          {borderCountries.length === 0 ? (
            <p className="text-gray-700 dark:text-gray-300">None</p>
          ) : (
            <div className="flex overflow-x-auto space-x-4 pb-2 snap-x snap-mandatory hide-scrollbar">
              {borderCountries.map((neighbor) => (
                <Link
                  to={`/country/${neighbor.cca3}`}
                  key={neighbor.cca3}
                  className="flex-shrink-0 snap-start w-28 bg-white/30 dark:bg-gray-800/40 p-2 rounded-lg shadow transition transform hover:-translate-y-1 hover:shadow-xl hover:bg-white/50 dark:hover:bg-gray-700"
                >
                  <img
                    src={neighbor.flags?.png}
                    alt={neighbor.name.common}
                    className="w-full h-16 object-cover rounded border border-gray-300 dark:border-gray-600 mb-2 transition-transform duration-200 hover:scale-105"
                  />
                  <p className="text-center text-sm font-medium truncate">
                    {neighbor.name.common}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CountryDetail;
