import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { verifySession, type AppUser, type UserRole } from "../services/authService";
import Error from "../pages/Error";
import Carregando from "./ui/Carregando";

type PrivateRouteProps = {
  children: ReactNode;
  allowedRoles?: UserRole[];
};

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ativo = true;

    verifySession()
      .then((u) => ativo && setUser(u))
      .catch(() => ativo && setUser(null))
      .finally(() => ativo && setLoading(false));

    return () => {
      ativo = false;
    };
  }, []);

  if (loading) return <Carregando />;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Error/>;
  }

  return children;
};

export default PrivateRoute;  