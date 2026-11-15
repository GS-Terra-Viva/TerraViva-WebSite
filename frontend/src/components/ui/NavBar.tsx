
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import UserMenu from "../ui/UserMenu";
import logoImg from "../../assets/pages/home/Logotipo Terra Viva.png";

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="flex items-center justify-between bg-black px-8 py-4 md:px-20">
      <Link to="/">
        <img
          src={logoImg}
          alt="Terra Viva"
          className="h-12 w-auto object-contain"
          />
      </Link>

      {isAuthenticated() ? (
        <UserMenu />
      ) : (
        <Link
          to="/login"
          className="relative flex items-center overflow-hidden bg-white text-black w-fit py-1.5 px-2 rounded-full gap-2"
        >
          <span className="absolute inset-0 bg-(--primary-color)" />

          <span className="relative z-10 flex items-center gap-2">
            <User size={18} />
            Entrar
          </span>
        </Link>
      )}
      <Link to="/denuncias" className="text-white">Denúncias</Link>
    </header>
  );
};

export default Navbar;
