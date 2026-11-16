import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Copia um texto para a área de transferência e informa `copiado` por alguns
 * segundos (para mostrar "Copiado!" no botão). Usa um plano B para navegadores
 * sem `navigator.clipboard` (por exemplo, páginas em http).
 */
export function useCopiarTexto(duracaoMs = 2000) {
  const [copiado, setCopiado] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copiar = useCallback(
    async (texto: string) => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(texto)
        } else {
          const campo = document.createElement('textarea')
          campo.value = texto
          campo.style.position = 'fixed'
          campo.style.opacity = '0'
          document.body.appendChild(campo)
          campo.select()
          document.execCommand('copy')
          document.body.removeChild(campo)
        }

        setCopiado(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setCopiado(false), duracaoMs)
      } catch (e) {
        console.error(e)
      }
    },
    [duracaoMs],
  )

  return { copiado, copiar }
}