// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AuthContextType = {
  user: string | null;
  token: string | null;
  authLoading: boolean;
  login: (email: string, token: string) => void;
  logout: () => void;
  favorites: string[];
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(localStorage.getItem("user"));
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [authLoading, setAuthLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]); // ✅ Global favorites

  useEffect(() => {
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    if (user && token) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user, token]);

  const fetchFavorites = async () => {
    try {
      const res = await fetch("https://countrycompass-backend.onrender.com/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      console.error("Failed to fetch favorites", err);
      setFavorites([]);
    }
  };

  const login = (email: string, token: string) => {
    localStorage.setItem("user", email);
    localStorage.setItem("token", token);
    setUser(email);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setFavorites([]); // clear on logout
  };

  return (
    <AuthContext.Provider
      value={{ user, token, authLoading, login, logout, favorites, setFavorites }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
