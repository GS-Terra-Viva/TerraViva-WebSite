import { useCallback, useEffect, useState } from 'react'
import {
  alterarStatusDenuncia,
  arquivarDenuncia,
  listarDenuncias,
  type DenunciaLista,
  type StatusDenuncia,
} from '../services/denuncias'
import { msgErro } from '../utils/erros'

export function useDenuncias() {
  const [denuncias, setDenuncias] = useState<DenunciaLista[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      setDenuncias(await listarDenuncias())
    } catch (e) {
      console.error(e)
      setErro(msgErro(e))
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  /** Arquiva a denúncia e a remove da lista local. */
  const arquivar = useCallback(async (id: number) => {
    await arquivarDenuncia(id)
    setDenuncias((lista) => lista.filter((d) => d.id !== id))
  }, [])

  /** Avança o status (com mensagem para encaminhada/concluída) e atualiza a lista local. */
  const alterarStatus = useCallback(
    async (id: number, novo: StatusDenuncia, mensagem?: string) => {
      await alterarStatusDenuncia(id, novo, mensagem)
      setDenuncias((lista) =>
        lista.map((d) =>
          d.id !== id
            ? d
            : {
                ...d,
                status: novo,
                mensagem_encaminhamento:
                  novo === 'encaminhada' ? (mensagem ?? '') : d.mensagem_encaminhamento,
                mensagem_conclusao: novo === 'concluida' ? (mensagem ?? '') : d.mensagem_conclusao,
              },
        ),
      )
    },
    [],
  )

  return { denuncias, carregando, erro, recarregar: carregar, arquivar, alterarStatus }
}