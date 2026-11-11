import type { UsuarioLista } from '../../services/authService'

type Props = {
  usuario: UsuarioLista
  excluindo: boolean
  erro: string | null
  onConfirmar: () => void
  onCancelar: () => void
}

export default function ConfirmarExclusaoModal({
  usuario,
  excluindo,
  erro,
  onConfirmar,
  onCancelar,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-lg font-bold text-gray-900">Excluir usuário?</h2>
        <p className="mt-2 text-sm text-gray-600">
          Você vai apagar <strong>{usuario.name}</strong> ({usuario.email}) do banco de dados.
          Essa ação não pode ser desfeita.
        </p>

        {erro && <p className="mt-3 text-sm text-red-600">{erro}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelar}
            disabled={excluindo}
            className="px-4 py-2 text-sm font-bold rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={excluindo}
            className="px-4 py-2 text-sm font-bold text-white rounded bg-red-700 hover:bg-red-800 disabled:opacity-50"
          >
            {excluindo ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  )
}