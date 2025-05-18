import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: string | null;
  token: string | null;
  login: (email: string, token: string) => void;
  logout: () => void;
  authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedToken = localStorage.getItem("token");

    if (storedEmail && storedToken) {
      setUser(storedEmail);
      setToken(storedToken);
    }

    setAuthLoading(false);
  }, []);

  const login = (email: string, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", email);
    setUser(email);
    setToken(token);
  };

  const logout = async () => {
    await fetch("https://countrycompass-backend.onrender.com/api/auth/logout", { method: "POST" });
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext must be used inside AuthProvider");
  return ctx;
};
