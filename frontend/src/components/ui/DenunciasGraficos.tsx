import { TIPOS_OCORRENCIA, type TipoOcorrencia } from '../../services/denuncias'

type Dia = { chave: string; rotulo: string; total: number }
type PorTipo = { tipo: TipoOcorrencia; total: number }

const card = 'p-5 bg-white rounded-lg border border-gray-200 shadow-sm'

export function GraficoRelatosPorDia({ dias }: { dias: Dia[] }) {
  const max = Math.max(1, ...dias.map((d) => d.total))
  const total = dias.reduce((s, d) => s + d.total, 0)
  // Com muitos dias, mostra só alguns rótulos para não encavalar
  const passo = dias.length > 14 ? Math.ceil(dias.length / 7) : 1

  return (
    <div className={card}>
      <div className="flex items-baseline justify-between">
        <h3 className="text-base font-bold">Relatos recebidos</h3>
        <span className="text-xs text-gray-500">{total} no período</span>
      </div>

      <div className="mt-6 flex items-end gap-1.5 h-44">
        {dias.map((d) => (
          <div
            key={d.chave}
            title={`${d.rotulo}: ${d.total}`}
            className="flex-1 h-full flex flex-col justify-end items-center min-w-0"
          >
            <span className="mb-1 text-[11px] font-semibold text-gray-600">
              {d.total > 0 ? d.total : ''}
            </span>
            <div
              className="w-full max-w-10 rounded-t bg-green-800"
              style={{ height: `${(d.total / max) * 100}%`, minHeight: d.total > 0 ? 4 : 2, opacity: d.total > 0 ? 1 : 0.15 }}
            />
          </div>
        ))}
      </div>

      <div className="mt-2 flex gap-1.5">
        {dias.map((d, i) => (
          <span key={d.chave} className="flex-1 min-w-0 text-center text-[11px] text-gray-500">
            {i % passo === 0 ? d.rotulo : ''}
          </span>
        ))}
      </div>
    </div>
  )
}

export function GraficoPorTipo({ itens }: { itens: PorTipo[] }) {
  const max = Math.max(1, ...itens.map((i) => i.total))

  return (
    <div className={card}>
      <h3 className="text-base font-bold">Por tipo de ocorrência</h3>

      {itens.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">Sem relatos no período.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {itens.map((i) => (
            <li key={i.tipo}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 truncate pr-3">
                  {TIPOS_OCORRENCIA[i.tipo] ?? i.tipo}
                </span>
                <span className="font-semibold text-gray-900">{i.total}</span>
              </div>
              <div className="mt-1 h-2 rounded bg-gray-100">
                <div
                  className="h-2 rounded bg-yellow-600"
                  style={{ width: `${(i.total / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
