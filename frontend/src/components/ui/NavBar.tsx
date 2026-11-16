import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import UserMenu from "../ui/UserMenu";
import logoImg from "../../assets/pages/home/Logotipo Terra Viva.png";
import { ArrowRight, Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuAberto, setMenuAberto] = useState(false);
  const { logout, isAdmin, isAuthenticated } = useAuth();

  const autenticado = isAuthenticated();
  const administrador = isAdmin();

  // Fecha o menu ao voltar para o desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuAberto(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fecharMenu = () => setMenuAberto(false);

  const linkClass =
    "text-[#EEE2D0] rounded-lg p-3 transition-colors hover:bg-white/10";

  const sair = () => {
    fecharMenu();
    logout();
  };

  return (
    <header className="fixed z-500 w-full flex items-center justify-between bg-black px-8 py-2 md:px-20">

      {/* Logo */}
      <Link to="/" onClick={fecharMenu}>
        <img
          src={logoImg}
          alt="Terra Viva"
          className="h-17 w-auto object-contain"
        />
      </Link>

      {/* Menu Desktop */}
      <nav className="hidden md:flex items-center gap-8">
        <Link to="/como-funciona" className="text-[#EEE2D0]">
          Como funciona
        </Link>

        <Link to="/denuncias" className="text-[#EEE2D0]">
          Territórios
        </Link>
        <Link to="/minhas-denuncias" className="text-[#EEE2D0]">
          Minhas Denúncias
        </Link>

        {autenticado ? (
          <UserMenu />
        ) : (
          <Link
            to="/login"
            className="relative flex items-center overflow-hidden text-[#EEE2D0] w-fit py-1.5 px-2 rounded-full gap-2"
          >
            Entrar
          </Link>
        )}

        <Link
          to="/nova-denuncia"
          className="text-[#EEE2D0] rounded-sm bg-[#B3261E] px-4 py-2 flex gap-4 items-center"
        >
          <p>Fazer denúncia</p>
          <ArrowRight size={20} />
        </Link>
      </nav>

      {/* Botão Hambúrguer */}
      <button
        onClick={() => setMenuAberto(!menuAberto)}
        className="md:hidden text-[#EEE2D0] rounded-lg p-2 hover:bg-white/10 transition-colors"
        aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
        aria-expanded={menuAberto}
      >
        {menuAberto ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Menu Mobile */}
      {menuAberto && (
        <div className="absolute right-4 top-full mt-2 flex w-64 flex-col gap-2 rounded-xl border border-white/10 bg-black p-3 shadow-lg md:hidden">

          <nav className="flex flex-col gap-2">
            <Link
              to="/como-funciona"
              className={linkClass}
              onClick={fecharMenu}
            >
              Como funciona
            </Link>

            <Link
              to="/denuncias"
              className={linkClass}
              onClick={fecharMenu}
            >
              Denúncias
            </Link>

            {administrador && (
              <Link
                to="/dashboard"
                onClick={fecharMenu}
                className={linkClass}
              >
                Ver Dashboard
              </Link>
            )}

            {autenticado && (
              <Link
                to="/minhas-denuncias"
                onClick={fecharMenu}
                className={linkClass}
              >
                Minhas denúncias
              </Link>
            )}

            {!autenticado && (
              <Link
                to="/login"
                className={linkClass}
                onClick={fecharMenu}
              >
                Entrar
              </Link>
            )}

            {autenticado && (
              <button
                onClick={sair}
                className="flex cursor-pointer items-center gap-2 rounded-lg p-3 text-left text-red-500 transition-colors hover:bg-red-200/10"
              >
                Sair
              </button>
            )}

            <Link
              to="/nova-denuncia"
              className="flex items-center justify-between gap-2 rounded-sm bg-[#B3261E] px-4 py-3 text-[#EEE2D0]"
              onClick={fecharMenu}
            >
              Fazer denúncia
              <ArrowRight size={20} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
