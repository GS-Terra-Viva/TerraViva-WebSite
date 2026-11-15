type Props = {
    titulo: string
    valor: number | string
    legenda: string
    corBorda: string
  }
  
  export default function StatCard({ titulo, valor, legenda, corBorda }: Props) {
    return (
      <div className={`p-5 bg-white rounded-lg border-l-4 ${corBorda} shadow-sm`}>
        <p className="text-sm text-gray-600">{titulo}</p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <span className="text-4xl font-bold text-gray-900">{valor}</span>
          <span className="text-xs text-gray-500 pb-1">{legenda}</span>
        </div>
      </div>
    )
  }