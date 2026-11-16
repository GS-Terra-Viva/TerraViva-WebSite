import { Check, Copy } from 'lucide-react'
import { useCopiarTexto } from '../../hooks/useCopiarTexto'

type BotaoCopiarProps = {
  texto: string
  rotulo?: string
  className?: string
}

const BotaoCopiar = ({
  texto,
  rotulo = 'Copiar',
  className = 'inline-flex items-center gap-1 text-xs font-bold text-[#A71E0C] hover:underline',
}: BotaoCopiarProps) => {
  const { copiado, copiar } = useCopiarTexto()

  return (
    <>
      <button type="button" onClick={() => copiar(texto)} className={className}>
        {copiado ? (
          <>
            <Check size={14} /> Copiado!
          </>
        ) : (
          <>
            <Copy size={14} /> {rotulo}
          </>
        )}
      </button>
      <span role="status" className="sr-only">
        {copiado ? 'Copiado para a área de transferência' : ''}
      </span>
    </>
  )
}

export default BotaoCopiar