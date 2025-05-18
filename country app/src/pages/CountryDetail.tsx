import { JSX, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchCountryByCode } from "../api/countries";
import { Country } from "../types/country";
import { FaArrowLeft, FaGlobe, FaUsers, FaLanguage, FaCity } from "react-icons/fa";

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
  value: string;
}) => (
  <div className="flex items-center">
    <span className="text-primary mr-2">{icon}</span>
    <span className="text-sm">
      <strong>{label}:</strong> {value}
    </span>
  </div>
);

const CountryDetail = () => {
  const { user, authLoading } = useAuth();
  const { code } = useParams();
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && code) {
      setLoading(true);
      setError("");
      fetchCountryByCode(code)
        .then((data) => setCountry(data))
        .catch(() => setError("Failed to load country details. Please try again."))
        .finally(() => setLoading(false));
    }
  }, [code, user]);

  // Wait for auth state to resolve before showing UI
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  // Show login message if user is not logged in
  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-xl font-semibold text-red-500">
          🔒 Please log in to view country details.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center text-white bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-600 rounded-full px-4 py-2 shadow-md transition-colors duration-300"
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
    <main
      className="min-h-screen bg-gradient-to-r from-pink-300 via-red-300 to-yellow-300 
      dark:bg-gradient-to-r dark:from-pink-900 dark:via-red-900 dark:to-yellow-900 
      text-gray-900 dark:text-white transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center mb-6 text-sm text-white bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-600 rounded-full px-4 py-2 shadow-md transition-colors duration-300"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Flag card */}
          <div className="md:w-1/2 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
            <img
              src={country.flags.png}
              alt={`${country.name.common} flag`}
              className="w-full h-56 md:h-full object-cover"
            />
          </div>

          {/* Details card */}
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
                value={Object.keys(country.languages || {}).length ? Object.values(country.languages).join(", ") : "—"}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CountryDetail;
