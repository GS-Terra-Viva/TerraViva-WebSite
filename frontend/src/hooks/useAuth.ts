import { useNavigate } from "react-router-dom";
import {
  login as authLogin,
  register as authRegister,
  getSession,
  logout as authLogout,
} from "../services/authService";

// Para onde cada tipo de usuário vai logo após o login
export const HOME_BY_ROLE = {
  admin: "/dashboard",
  user: "/",
} as const;

export const useAuth = () => {
  const navigate = useNavigate();

  const login = async (name: string, password: string) => {
    const user = await authLogin(name, password);

    if (user) {
      navigate(HOME_BY_ROLE[user.role]);
    }

    return user;
  };

  const register = async (name: string, email: string, password: string) => {
    await authRegister(name, email, password);
    return login(name, password);
  };

  const logout = () => {
    authLogout();
    navigate("/login");
  };

  const isAuthenticated = () => {
    return getSession() !== null;
  };

  const isAdmin = () => {
    return getSession()?.role === "admin";
  };

  return {
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    getSession,
  };
};