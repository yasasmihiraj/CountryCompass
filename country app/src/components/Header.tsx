import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaMoon, FaSun } from "react-icons/fa";

const Header = () => {
  const { user, login, logout } = useAuth();
  const [showModal, setShowModal] = useState<"login" | "register" | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains("dark"));
  const [error, setError] = useState<string | null>(null); // Added error state

  const handleSubmit = async (type: "login" | "register") => {
    setLoading(true);
    setError(null); // Reset error before submitting
    try {
      const res = await fetch(`https://countrycompass-backend.onrender.com/api/auth/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        login(form.email, data.token);
        setShowModal(null);
      } else {
        setError(data.message || "An error occurred.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 to-gray-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center relative">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          🌍 <span>NationExplorer</span>
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="text-xl bg-white/20 p-2 rounded-full hover:bg-white/30 transition"
            title="Toggle Theme"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          {!user ? (
            <>
              <button
                onClick={() => setShowModal("login")}
                className="flex items-center gap-2 bg-white text-indigo-600 font-semibold px-4 py-1.5 rounded-full shadow hover:bg-gray-100 transition"
              >
                <FaSignInAlt /> Login
              </button>
              <button
                onClick={() => setShowModal("register")}
                className="flex items-center gap-2 bg-white text-indigo-600 font-semibold px-4 py-1.5 rounded-full shadow hover:bg-gray-100 transition"
              >
                <FaUserPlus /> Register
              </button>
            </>
          ) : (
            <>
              <span className="flex items-center gap-2 text-sm font-medium">
                <FaUser className="text-white" /> {user}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-1.5 rounded-full shadow transition"
              >
                <FaSignOutAlt /> Logout
              </button>
            </>
          )}
        </div>

        {showModal && (
          <div className="absolute top-20 right-4 bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/10 text-black dark:text-white rounded-xl shadow-lg w-80 p-6 animate-fade-in z-50">
            <h2 className="text-xl font-bold mb-4 text-center capitalize">{showModal}</h2>

            {loading ? (
              <div className="flex justify-center items-center py-6">
                <div className="loader-ring"></div>
              </div>
            ) : (
              <>
                {showModal === "register" && (
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}

                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                
                {/* Display error message if there's any */}
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <button
                  onClick={() => handleSubmit(showModal)}
                  className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition"
                >
                  Submit
                </button>
              </>
            )}

            <button
              onClick={() => setShowModal(null)}
              className="w-full mt-2 text-center text-sm text-indigo-200 dark:text-indigo-300 hover:underline"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
