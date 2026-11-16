import { useMemo, useState } from 'react'

/** Paginação de uma lista em memória. */
export function usePaginacao<T>(itens: T[], porPagina: number) {
  const [pagina, setPagina] = useState(1)

  const totalPaginas = Math.max(1, Math.ceil(itens.length / porPagina))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const inicio = (paginaAtual - 1) * porPagina
  const visiveis = useMemo(() => itens.slice(inicio, inicio + porPagina), [itens, inicio, porPagina])

  return { pagina, setPagina, paginaAtual, totalPaginas, inicio, visiveis }
}
