import { useState } from 'react'
import {
  MENSAGEM_MIN,
  STATUS_COM_MENSAGEM,
  type DenunciaLista,
  type StatusDenuncia,
} from '../../services/denuncias'
import StatusBadge from './StatusBadge'

type Props = {
  denuncia: DenunciaLista
  novoStatus: StatusDenuncia
  salvando: boolean
  erro: string | null
  onConfirmar: (mensagem?: string) => void
  onCancelar: () => void
}

export default function AlterarStatusModal({
  denuncia,
  novoStatus,
  salvando,
  erro,
  onConfirmar,
  onCancelar,
}: Props) {
  const [mensagem, setMensagem] = useState('')
  const exigeMensagem = STATUS_COM_MENSAGEM.includes(novoStatus)
  const tamanho = mensagem.trim().length
  const invalida = exigeMensagem && tamanho < MENSAGEM_MIN

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-lg font-bold text-gray-900">Alterar status</h2>
        <p className="mt-1 text-sm text-gray-600">
          <span className="font-mono text-xs">{denuncia.protocolo}</span> · {denuncia.titulo}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <StatusBadge status={denuncia.status} />
          <span className="text-gray-400">→</span>
          <StatusBadge status={novoStatus} />
        </div>

        {exigeMensagem ? (
          <div className="mt-5">
            <label htmlFor="msg-status" className="text-sm font-semibold text-gray-900">
              Informações sobre o processo <span className="text-red-600">*</span>
            </label>
            <p className="mt-1 text-xs text-gray-500">
              Descreva o que foi ou será feito. Esta mensagem fica registrada nesta etapa e não
              pode ser alterada depois.
            </p>
            <textarea
              id="msg-status"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              rows={5}
              disabled={salvando}
              className="mt-2 w-full p-2.5 text-sm rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <p className={`mt-1 text-xs ${invalida ? 'text-red-600' : 'text-gray-500'}`}>
              {tamanho} caracteres (mínimo {MENSAGEM_MIN})
            </p>
          </div>
        ) : (
          <p className="mt-5 text-sm text-gray-600">
            Confirme a mudança de status. Não é necessário informar mensagem.
          </p>
        )}

        {erro && <p className="mt-3 text-sm text-red-600">{erro}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelar}
            disabled={salvando}
            className="px-4 py-2 text-sm font-bold rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirmar(exigeMensagem ? mensagem.trim() : undefined)}
            disabled={salvando || invalida}
            className="px-4 py-2 text-sm font-bold text-white rounded bg-green-800 hover:bg-green-900 disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}
