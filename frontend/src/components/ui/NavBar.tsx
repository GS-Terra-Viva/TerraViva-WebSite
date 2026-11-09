
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import UserMenu from "../ui/UserMenu";

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="flex justify-between items-center">
      <Link to="/">
        <h1>Site</h1>
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
    </header>
  );
};

export default Navbar;
