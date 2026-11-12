import type { DenunciaLista } from '../../services/denuncias'

type Props = {
  denuncia: DenunciaLista
  arquivando: boolean
  erro: string | null
  onConfirmar: () => void
  onCancelar: () => void
}

export default function ConfirmarArquivarModal({
  denuncia,
  arquivando,
  erro,
  onConfirmar,
  onCancelar,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-lg font-bold text-gray-900">Arquivar denúncia?</h2>
        <p className="mt-2 text-sm text-gray-600">
          A denúncia <strong>{denuncia.protocolo}</strong> ({denuncia.titulo}) será arquivada e
          deixará de aparecer na lista.
        </p>

        {erro && <p className="mt-3 text-sm text-red-600">{erro}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelar}
            disabled={arquivando}
            className="px-4 py-2 text-sm font-bold rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={arquivando}
            className="px-4 py-2 text-sm font-bold text-white rounded bg-green-800 hover:bg-green-900 disabled:opacity-50"
          >
            {arquivando ? 'Arquivando...' : 'Arquivar'}
          </button>
        </div>
      </div>
    </div>
  )
}
