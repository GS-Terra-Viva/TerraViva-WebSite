import { useEffect, useState } from 'react'
import { buscarDenunciaPorProtocolo, type DenunciaPublica } from '../services/denunciasPublicas'

export type EstadoConsulta =
  | { tipo: 'carregando' }
  | { tipo: 'erro' }
  | { tipo: 'naoEncontrada' }
  | { tipo: 'ok'; denuncia: DenunciaPublica }

/** Busca a denúncia pelo protocolo e devolve o estado da consulta. */
export function useDenunciaPorProtocolo(protocolo: string): EstadoConsulta {
  // Guarda de qual protocolo é o resultado, para não mostrar dados antigos ao trocar de protocolo
  const [resultado, setResultado] = useState<{ para: string; estado: EstadoConsulta } | null>(null)

  useEffect(() => {
    let ativo = true

    buscarDenunciaPorProtocolo(protocolo)
      .then((d) => {
        if (!ativo) return
        setResultado({
          para: protocolo,
          estado: d ? { tipo: 'ok', denuncia: d } : { tipo: 'naoEncontrada' },
        })
      })
      .catch((e) => {
        console.error(e)
        if (ativo) setResultado({ para: protocolo, estado: { tipo: 'erro' } })
      })

    return () => {
      ativo = false
    }
  }, [protocolo])

  return resultado && resultado.para === protocolo ? resultado.estado : { tipo: 'carregando' }
}
