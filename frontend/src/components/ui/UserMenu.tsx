import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CircleUserRound,
  FileText,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const UserMenu = () => {
  const [aberto, setAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout, isAdmin, getSession, isAuthenticated } = useAuth();
  const user = getSession();


  useEffect(() => {
    const handleClickFora = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setAberto(false);
      }
    };

    document.addEventListener("mousedown", handleClickFora);

    return () => {
      document.removeEventListener("mousedown", handleClickFora);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setAberto(!aberto)}
        className="flex items-center justify-center rounded-full p-1 transition-colors cursor-pointer text-[#EEE2D0] gap-2"
        aria-label="Abrir menu do usuário"
        aria-expanded={aberto}
      >
        <CircleUserRound className="h-8 w-8 text-[#EEE2D0]"/>{user?.name}
      </button>

      <div>
        {aberto && (
          <nav
            className="absolute top-12 z-50 flex w-max flex-col gap-1 rounded-lg p-2 shadow-lg border border-white/10 bg-black text-[#EEE2D0]"
          >
            {isAdmin() && (<Link
              to="/dashboard"
              onClick={() => setAberto(false)}
              className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-[#f2d4a743]"
            >
              <LayoutDashboard className="h-4 w-4" />
              Ver Dashboard
            </Link>)}
            {isAuthenticated() && (<Link
              to="/minhas-denuncias"
              onClick={() => setAberto(false)}
              className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-[#f2d4a743]"
            >
              <FileText className="h-4 w-4" />
              Minhas denúncias
            </Link>)}

            <button
              onClick={() => {
                setAberto(false);
                logout();
              }}
              className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-left text-red-600 transition-colors hover:bg-red-300/30"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default UserMenu;
