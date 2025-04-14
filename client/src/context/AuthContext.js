import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await axios.post("/api/validate-token", { token });
      setIsAuthenticated(response.data.valid);
    } catch (error) {
      console.error("Token validation failed:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (token) => {
    localStorage.setItem("adminToken", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Thêm hook useAuth để sử dụng trong các component
export const useAuth = () => {
  return useContext(AuthContext);
};

// Export default cho trường hợp import khác
export default AuthContext;
