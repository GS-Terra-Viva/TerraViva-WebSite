import { LogOut, ShieldCheck, Users } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function AdminSidebar() {
  const { logout, getSession } = useAuth()
  const usuario = getSession()

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-[#14251d] text-white">
      <div className="px-6 py-6 text-xl font-bold tracking-wide">TERRA VIVA</div>

      <p className="px-6 mt-6 text-[11px] font-bold tracking-wider text-gray-400">
        ÁREA ADMINISTRATIVA
      </p>

      <nav className="mt-3 px-3">
        <div className="flex items-center gap-3 px-3 py-3 rounded-md bg-white/10 border-l-4 border-yellow-500">
          <Users size={18} />
          <span className="text-sm font-semibold">Usuários</span>
        </div>
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