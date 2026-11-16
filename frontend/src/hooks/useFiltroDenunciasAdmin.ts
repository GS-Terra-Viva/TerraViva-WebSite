import { useMemo, useState } from 'react'
import type { DenunciaLista, StatusDenuncia, TipoOcorrencia } from '../services/denuncias'

/** Busca e filtros (status e tipo) da tabela de denúncias do painel admin. */
export function useFiltroDenunciasAdmin(denuncias: DenunciaLista[]) {
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState<'todos' | StatusDenuncia>('todos')
  const [filtroTipo, setFiltroTipo] = useState<'todos' | TipoOcorrencia>('todos')

  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return denuncias.filter(
      (d) =>
        (filtroStatus === 'todos' || d.status === filtroStatus) &&
        (filtroTipo === 'todos' || d.tipo === filtroTipo) &&
        (!q ||
          d.protocolo.toLowerCase().includes(q) ||
          d.titulo.toLowerCase().includes(q) ||
          d.municipio.toLowerCase().includes(q) ||
          (d.usuario_nome ?? '').toLowerCase().includes(q)),
    )
  }, [denuncias, busca, filtroStatus, filtroTipo])

  return { busca, setBusca, filtroStatus, setFiltroStatus, filtroTipo, setFiltroTipo, filtradas }
}
