import { useMemo, useState } from 'react'
import type { DenunciaMapa } from '../services/denunciasPublicas'

/** Filtros da tela pública (busca, município, comunidade, tipo e status) e as listas derivadas. */
export function useFiltroDenunciasPublicas(denuncias: DenunciaMapa[]) {
  const [busca, setBusca] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [comunidade, setComunidade] = useState('')
  const [tipo, setTipo] = useState('')
  const [status, setStatus] = useState('')

  const municipios = useMemo(
    () => [...new Set(denuncias.map((d) => d.municipio).filter(Boolean))].sort(),
    [denuncias],
  )

  const comunidades = useMemo(
    () =>
      [
        ...new Set(
          denuncias
            .filter((d) => !municipio || d.municipio === municipio)
            .map((d) => d.comunidade)
            .filter((c): c is string => Boolean(c)),
        ),
      ].sort(),
    [denuncias, municipio],
  )

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return denuncias.filter(
      (d) =>
        (!termo || d.titulo.toLowerCase().includes(termo) || d.protocolo.toLowerCase().includes(termo)) &&
        (!municipio || d.municipio === municipio) &&
        (!comunidade || d.comunidade === comunidade) &&
        (!tipo || d.tipo === tipo) &&
        (!status || d.status === status),
    )
  }, [denuncias, busca, municipio, comunidade, tipo, status])

  const comLocalizacao = useMemo(
    () => filtradas.filter((d) => d.lat !== null && d.lng !== null),
    [filtradas],
  )

  function limparFiltros() {
    setBusca('')
    setMunicipio('')
    setComunidade('')
    setTipo('')
    setStatus('')
  }

  return {
    busca, setBusca,
    municipio, setMunicipio,
    comunidade, setComunidade,
    tipo, setTipo,
    status, setStatus,
    municipios, comunidades, filtradas, comLocalizacao, limparFiltros,
  }
}
