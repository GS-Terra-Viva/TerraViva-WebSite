import { Link, NavLink } from 'react-router-dom'
import {
  FileText,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import LOGO from '../../assets/pages/home/Logotipo Terra Viva.png';

type Item = { label: string; to?: string; icon: LucideIcon; end?: boolean }

const ITENS: Item[] = [
  { label: 'Visão geral', to: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Denúncias', to: '/dashboard/denuncias', icon: FileText },
  { label: 'Usuários', to: '/dashboard/usuarios', icon: Users },
]

const base = 'flex items-center gap-3 px-3 py-3 rounded-md border-l-4 text-sm font-semibold'

export default function AdminSidebar({ valor }: { valor?: number | string }) {
  const { logout, getSession } = useAuth()
  const usuario = getSession()

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-[#14251d] text-white">
      <Link to="/" className="px-6 py-6 text-xl font-bold tracking-wide"><img src={LOGO} className='w-60' /></Link>

      <p className="px-6 mt-6 text-[11px] font-bold tracking-wider text-gray-400">
        ÁREA ADMINISTRATIVA
      </p>

      <nav className="mt-3 px-3 space-y-1">
      {ITENS.map(({ label, to, icon: Icon, end }) =>
  to ? (
    <NavLink
    key={label}
    to={to}
    end={end}
    className={({ isActive }) =>
      `${base} ${
        isActive
          ? 'bg-white/10 border-yellow-500'
          : 'border-transparent text-gray-300 hover:bg-white/5'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <Icon size={18} />
        <span>{label}</span>
        {isActive && valor !== undefined && (
          <span className="ml-auto rounded bg-yellow-500 px-2 py-0.5 text-xs font-bold text-[#14251d]">
            {valor}
          </span>
        )}
      </>
    )}
  </NavLink>
          ) : (
            <div
              key={label}
              title="Em breve"
              aria-disabled="true"
              className={`${base} border-transparent text-gray-500 cursor-not-allowed`}
            >
              <Icon size={18} />
              <span>{label}</span>
              <span className="ml-auto text-[10px] font-bold uppercase text-gray-500">Em breve</span>
            </div>
          ),
        )}
      </nav>

      <div className="mt-auto p-3 space-y-3">
        <div className="p-4 rounded-md bg-white/5 text-sm">
          <ShieldCheck size={18} className="text-yellow-500" />
          <p className="mt-2 font-semibold">Cuidado com os dados</p>
          <p className="mt-1 text-xs text-gray-400">
            Acesse e compartilhe apenas o necessário para a análise.
          </p>
        </div>

        <div className="flex items-center justify-between px-3 py-3 border-t border-white/10">
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{usuario?.name ?? 'Administrador'}</p>
            <p className="text-xs text-gray-400">Administrador</p>
          </div>
          <button
            type="button"
            onClick={logout}
            title="Sair"
            className="p-2 rounded hover:bg-white/10"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  )
}
