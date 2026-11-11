import { Trash2 } from 'lucide-react'
import type { UsuarioLista } from '../../services/authService'

type Props = {
  usuarios: UsuarioLista[]
  idLogado?: number | string
  onExcluir: (u: UsuarioLista) => void
}

const badge = {
  admin: 'bg-amber-100 text-amber-800',
  user: 'bg-green-100 text-green-800',
} as const

export default function UsuariosTabela({ usuarios, idLogado, onExcluir }: Props) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#e9ece6] text-xs font-bold text-gray-600 uppercase">
          <tr>
            <th className="px-5 py-4">Nome completo</th>
            <th className="px-5 py-4">E-mail</th>
            <th className="px-5 py-4">Tipo</th>
            <th className="px-5 py-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 && (
            <tr>
              <td colSpan={4} className="px-5 py-8 text-center text-gray-500">
                Nenhum usuário encontrado.
              </td>
            </tr>
          )}

          {usuarios.map((u) => {
            const ehVoce = String(u.id) === String(idLogado)
            return (
              <tr key={u.id} className="border-t border-gray-100">
                <td className="px-5 py-4 font-semibold text-gray-900">
                  {u.name}
                  {ehVoce && <span className="ml-2 text-xs font-normal text-gray-500">(você)</span>}
                </td>
                <td className="px-5 py-4 text-gray-600">{u.email}</td>
                <td className="px-5 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded ${badge[u.role] ?? 'bg-gray-100 text-gray-700'}`}
                  >
                    {u.role === 'admin' ? 'Admin' : 'Usuário'}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onExcluir(u)}
                    disabled={ehVoce}
                    title={ehVoce ? 'Você não pode excluir a si mesmo' : 'Excluir usuário'}
                    className="p-2 text-red-700 rounded hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}