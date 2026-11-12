
import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { STATUS_DENUNCIA, type StatusDenuncia } from '../../services/denuncias'

const estilos: Record<StatusDenuncia, { pill: string; dot: string }> = {
  recebida: {
    pill: 'bg-blue-50 text-blue-800 border-blue-200',
    dot: 'bg-blue-600',
  },
  em_analise: {
    pill: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
  },
  encaminhada: {
    pill: 'bg-purple-50 text-purple-800 border-purple-200',
    dot: 'bg-purple-600',
  },
  concluida: {
    pill: 'bg-green-50 text-green-800 border-green-200',
    dot: 'bg-green-700',
  },
}

export const COR_STATUS = {
  recebida: 'border-blue-600',
  em_analise: 'border-amber-500',
  encaminhada: 'border-purple-600',
  concluida: 'border-green-800',
} as const

type Props = {
  status: StatusDenuncia
  dropdown?: boolean
  onChange?: (status: StatusDenuncia) => void
  disabled?: boolean
}

export default function StatusBadge({
  status,
  dropdown = false,
  onChange,
  disabled = false,
}: Props) {
  const [aberto, setAberto] = useState(false)

  const e = estilos[status] ?? {
    pill: 'bg-gray-50 text-gray-700 border-gray-200',
    dot: 'bg-gray-400',
  }

  const editavel = dropdown && !!onChange

  function selecionar(novoStatus: StatusDenuncia) {
    setAberto(false)

    if (novoStatus !== status) {
      onChange?.(novoStatus)
    }
  }

  const conteudo = (
    <>
      <span className={`w-2 h-2 rounded-full ${e.dot}`} />
      {STATUS_DENUNCIA[status] ?? status}
      {dropdown && (
        <ChevronDown
          size={14}
          className={`opacity-60 transition-transform ${aberto ? 'rotate-180' : ''}`}
        />
      )}
    </>
  )

  return (
    <div className="relative inline-block">
      {editavel ? (
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          disabled={disabled}
          aria-expanded={aberto}
          aria-label={`Alterar status: ${STATUS_DENUNCIA[status]}`}
          className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-full border ${e.pill} ${
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer hover:brightness-95'
          }`}
        >
          {conteudo}
        </button>
      ) : (
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-full border ${e.pill}`}
        >
          {conteudo}
        </span>
      )}

      {editavel && aberto && (
        <div className="absolute left-0 top-full mt-2 z-50 min-w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
          {(Object.entries(STATUS_DENUNCIA) as [StatusDenuncia, string][]).map(
            ([valor, label]) => {
              const estilo = estilos[valor]
              const selecionado = valor === status

              return (
                <button
                  key={valor}
                  type="button"
                  onClick={() => selecionar(valor)}
                  className="w-full flex items-center justify-between gap-3 px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${estilo.dot}`} />
                    {label}
                  </span>

                  {selecionado && (
                    <Check size={14} className="text-green-700" />
                  )}
                </button>
              )
            }
          )}
        </div>
      )}
    </div>
  )
}
