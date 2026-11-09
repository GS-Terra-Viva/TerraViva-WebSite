import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CircleUserRound,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const UserMenu = () => {
  const [aberto, setAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout, isAdmin } = useAuth();

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
        className="flex items-center justify-center rounded-full p-1 transition-colors cursor-pointer hover:bg-(--background-color-dark)/10 dark:hover:bg-(--background-color)/10"
        aria-label="Abrir menu do usuário"
        aria-expanded={aberto}
      >
        <CircleUserRound className="h-8 w-8" />
      </button>

      <div>
        {aberto && (
          <nav
            className="absolute right-0 top-12 z-50 flex w-44 flex-col gap-1 rounded-xl border border-(--card-border-color1) bg-white p-2 shadow-lg dark:bg-(--background-color-dark) dark:border-(--card-border-color1-dark)"
          >
            {isAdmin() && (<Link
              to="/dashboard"
              onClick={() => setAberto(false)}
              className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-(--background-color-dark)/10 dark:hover:bg-(--background-color)/10"
            >
              <LayoutDashboard className="h-4 w-4" />
              Ver Dashboard
            </Link>)}

            <button
              onClick={() => {
                setAberto(false);
                logout();
              }}
              className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-left text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
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
