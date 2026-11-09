
import { useNavigate } from "react-router-dom";
import {
  login as authLogin,
  getSession,
  logout as authLogout,
} from "../services/authService";

export const useAuth = () => {
  const navigate = useNavigate();

  const login = async (name: string, password: string) => {
    const user = await authLogin(name, password);

    if (user) {
      navigate("/dashboard");
    }

    return user;
  };

  const logout = () => {
    authLogout();
    navigate("/login");
  };

  const isAuthenticated = () => {
    return getSession() !== null;
  };

  return {
    login,
    logout,
    isAuthenticated,
    getSession,
  };
};
