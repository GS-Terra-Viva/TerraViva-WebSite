
import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { STATUS_DENUNCIA, type StatusDenuncia } from '../../services/denuncias'

const estilos: Record<StatusDenuncia, { pill: string; dot: string }> = {
  recebida: {
    pill: 'bg-[#EDF1E8] text-[#687C51] border-[#687C51]',
    dot: 'bg-[#687C51]',
  },
  em_analise: {
    pill: 'bg-[#FBEAE7] text-[#A71E0C] border-[#A71E0C]',
    dot: 'bg-[#A71E0C]',
  },
  encaminhada: {
    pill: 'bg-[#FFF4D6] text-[#85630E] border-[#C49A32]',
    dot: 'bg-[#C49A32]',
  },
  concluida: {
    pill: 'bg-[#E5F3E9] text-[#287044] border-[#287044]',
    dot: 'bg-[#287044]',
  },
}

export const COR_STATUS = {
  recebida: 'border-[#687C51]',
  em_analise: 'border-[#A71E0C]',
  encaminhada: 'border-[#C49A32]',
  concluida: 'border-[#287044]',
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
