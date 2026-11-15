import type { ReactNode } from 'react'
import { ExternalLink, X } from 'lucide-react'
import { TIPOS_OCORRENCIA, type DenunciaLista } from '../../services/denuncias'
import { formatarData, formatarDataHora } from '../../utils/formatters'
import StatusBadge from './StatusBadge'

type Props = {
  denuncia: DenunciaLista
  onFechar: () => void
}

function Campo({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-bold tracking-wide text-gray-500 uppercase">{rotulo}</dt>
      <dd className="mt-1 text-sm text-gray-900 break-words">{children}</dd>
    </div>
  )
}

export default function DenunciaModal({ denuncia: d, onFechar }: Props) {
  const temPonto = d.lat != null && d.lng != null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onFechar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Relatório ${d.protocolo}`}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-200">
          <div className="min-w-0">
            <p className="font-mono text-xs text-gray-500">{d.protocolo}</p>
            <h2 className="mt-1 text-xl font-bold text-gray-900">{d.titulo}</h2>
            <div className="mt-3">
              <StatusBadge status={d.status} />
            </div>
          </div>
          <button
            type="button"
            onClick={onFechar}
            title="Fechar"
            className="p-2 rounded hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-6">
          <Campo rotulo="Tipo de ocorrência">{TIPOS_OCORRENCIA[d.tipo] ?? d.tipo}</Campo>
          <Campo rotulo="Data do ocorrido">{formatarData(d.data_ocorrido)}</Campo>
          <Campo rotulo="Município">{d.municipio}</Campo>
          <Campo rotulo="Comunidade">{d.comunidade?.trim() || '—'}</Campo>
          <Campo rotulo="Recebida em">{formatarDataHora(d.created_at)}</Campo>
          <Campo rotulo="Coordenadas">
            {temPonto ? (
              <span className="inline-flex items-center gap-2 flex-wrap">
                {d.lat!.toFixed(6)}, {d.lng!.toFixed(6)}
                <a
                  href={`https://www.openstreetmap.org/?mlat=${d.lat}&mlon=${d.lng}#map=15/${d.lat}/${d.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-green-800 hover:underline"
                >
                  Abrir no mapa <ExternalLink size={12} />
                </a>
              </span>
            ) : (
              'Não informadas'
            )}
          </Campo>

          <div className="sm:col-span-2">
            <Campo rotulo="Descrição">
              <p className="whitespace-pre-wrap">{d.descricao}</p>
            </Campo>
          </div>

          {d.mensagem_encaminhamento && (
            <div className="sm:col-span-2">
              <Campo rotulo="Informações do encaminhamento">
                <p className="whitespace-pre-wrap">{d.mensagem_encaminhamento}</p>
              </Campo>
            </div>
          )}

          {d.mensagem_conclusao && (
            <div className="sm:col-span-2">
              <Campo rotulo="Informações da conclusão">
                <p className="whitespace-pre-wrap">{d.mensagem_conclusao}</p>
              </Campo>
            </div>
          )}

          <div className="sm:col-span-2 p-4 rounded-md bg-[#f4f3ee]">
            <p className="text-[11px] font-bold tracking-wide text-gray-500 uppercase">
              Registrada por
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{d.usuario_nome || '—'}</p>
            <p className="text-sm text-gray-600">{d.usuario_email || '—'}</p>
          </div>
        </dl>

        <div className="flex justify-end p-6 pt-0">
          <button
            type="button"
            onClick={onFechar}
            className="px-4 py-2 text-sm font-bold rounded bg-gray-200 hover:bg-gray-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}