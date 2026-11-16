import { useEffect, useState } from 'react'
import { listarDenunciasPublicas, type DenunciaMapa } from '../services/denunciasPublicas'

/** Carrega as denúncias públicas exibidas no mapa. */
export function useDenunciasPublicas() {
  const [denuncias, setDenuncias] = useState<DenunciaMapa[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    listarDenunciasPublicas()
      .then(setDenuncias)
      .catch((e) => {
        console.error('Erro ao carregar denúncias:', e)
        setErro('Não foi possível carregar as denúncias.')
      })
      .finally(() => setCarregando(false))
  }, [])

  return { denuncias, carregando, erro }
}
