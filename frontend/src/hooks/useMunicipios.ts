import { useEffect, useState } from 'react'
import { listarMunicipiosSP, type Municipio } from '../services/denuncias'

/** Carrega a lista de municípios de SP (API do IBGE). */
export function useMunicipios() {
  const [municipios, setMunicipios] = useState<Municipio[]>([])
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    listarMunicipiosSP()
      .then(setMunicipios)
      .catch((e) => {
        console.error(e)
        setErro('Não foi possível carregar a lista de municípios. Recarregue a página.')
      })
  }, [])

  return { municipios, erro }
}
