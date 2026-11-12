import { Archive, Eye } from 'lucide-react'
import {
  TIPOS_OCORRENCIA,
  type DenunciaLista,
  type StatusDenuncia,
} from '../../services/denuncias'
import { formatarData } from '../../utils/formatters'
import StatusBadge from './StatusBadge'

type Props = {
  denuncias: DenunciaLista[]
  onVer: (d: DenunciaLista) => void
  onArquivar: (d: DenunciaLista) => void
  onAlterarStatus: (d: DenunciaLista, status: StatusDenuncia) => void
  atualizandoStatusId: number | null
}

export default function DenunciasTabela({
  denuncias,
  onVer,
  onArquivar,
  onAlterarStatus,
  atualizandoStatusId,
}: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#e9ece6] text-xs font-bold text-gray-600 uppercase">
          <tr>
            <th className="px-5 py-4">Protocolo</th>
            <th className="px-5 py-4">Denúncia</th>
            <th className="px-5 py-4">Município</th>
            <th className="px-5 py-4">Data</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4 text-right">Ações</th>
          </tr>
        </thead>

        <tbody>
          {denuncias.length === 0 && (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                Nenhuma denúncia encontrada.
              </td>
            </tr>
          )}

          {denuncias.map((d) => (
            <tr key={d.id} className="border-t border-gray-100">
              <td className="px-5 py-4 font-mono text-xs text-gray-700 whitespace-nowrap">
                {d.protocolo}
              </td>

              <td className="px-5 py-4 max-w-xs">
                <p className="font-semibold text-gray-900 truncate">
                  {d.titulo}
                </p>
                <p className="text-xs text-gray-500">
                  {TIPOS_OCORRENCIA[d.tipo] ?? d.tipo}
                </p>
              </td>

              <td className="px-5 py-4 text-gray-600">
                {d.municipio}
              </td>

              <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                {formatarData(d.data_ocorrido)}
              </td>

              <td className="px-5 py-4">
                <StatusBadge
                  status={d.status}
                  dropdown
                  disabled={atualizandoStatusId === d.id}
                  onChange={(novoStatus) => onAlterarStatus(d, novoStatus)}
                />
              </td>

              <td className="px-5 py-4 text-right whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => onVer(d)}
                  title="Ver relatório"
                  className="p-2 text-green-800 rounded hover:bg-green-50"
                >
                  <Eye size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => onArquivar(d)}
                  title="Arquivar denúncia"
                  className="p-2 text-amber-700 rounded hover:bg-amber-50"
                >
                  <Archive size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
