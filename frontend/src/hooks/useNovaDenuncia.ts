import { useState } from 'react'
import { getSession } from '../services/authService'
import { centroDoMunicipio, criarDenuncia, type TipoOcorrencia } from '../services/denuncias'
import { msgErro } from '../utils/erros'
import { validarDenuncia, type ErrosDenuncia } from '../utils/validacaoDenuncia'
import { useMapaSelecao } from './useMapaSelecao'
import { useMunicipios } from './useMunicipios'

/**
 * Toda a lógica da tela "Nova denúncia": campos do formulário, validação,
 * envio ao banco, mapa de seleção do local e lista de municípios.
 * A página só renderiza o que o hook devolve.
 */
export function useNovaDenuncia() {
  const usuario = getSession() // só para exibir "em nome de"; quem grava é o banco, pelo token

  // Campos do formulário
  const [tipo, setTipo] = useState<TipoOcorrencia | ''>('')
  const [data, setData] = useState('')
  const [titulo, setTitulo] = useState('')
  const [comunidade, setComunidade] = useState('')
  const [descricao, setDescricao] = useState('')
  const [municipioId, setMunicipioId] = useState('')
  const [declaro, setDeclaro] = useState(false)

  // Estado da tela
  const [erros, setErros] = useState<ErrosDenuncia>({})
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState<string | null>(null)
  const [protocolo, setProtocolo] = useState<string | null>(null)

  const { municipios, erro: erroMunicipios } = useMunicipios()
  const { mapDivRef, ponto, voarPara, limparMarcador } = useMapaSelecao(!protocolo)

  /** Ao escolher o município, o mapa voa até ele. */
  async function escolherMunicipio(id: string) {
    setMunicipioId(id)
    setErros((x) => ({ ...x, municipio: undefined }))
    const m = municipios.find((mu) => String(mu.id) === id)
    if (!m) return
    const centro = await centroDoMunicipio(m.nome)
    if (centro) voarPara(centro.lat, centro.lng)
  }

  async function enviar(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    setErroEnvio(null)

    const e = validarDenuncia({ tipo, data, titulo, descricao, municipioId, declaro })
    setErros(e)
    if (Object.keys(e).length > 0) return

    const municipio = municipios.find((m) => String(m.id) === municipioId)
    if (!municipio || !tipo) return

    setEnviando(true)
    try {
      // Grava no Supabase (função criar_denuncia) — só segue se o banco confirmar
      const criada = await criarDenuncia({
        tipo,
        dataOcorrido: data,
        titulo,
        comunidade,
        descricao,
        municipio,
        ponto,
      })
      setProtocolo(criada.protocolo)
    } catch (err) {
      console.error(err)
      setErroEnvio(msgErro(err))
    } finally {
      setEnviando(false)
    }
  }

  /** Volta ao formulário limpo (o mapa é recriado quando `protocolo` zera). */
  function novaDenuncia() {
    setTipo('')
    setData('')
    setTitulo('')
    setComunidade('')
    setDescricao('')
    setMunicipioId('')
    limparMarcador()
    setDeclaro(false)
    setErros({})
    setErroEnvio(null)
    setProtocolo(null)
  }

  return {
    usuario,
    tipo, setTipo,
    data, setData,
    titulo, setTitulo,
    comunidade, setComunidade,
    descricao, setDescricao,
    municipioId, escolherMunicipio,
    declaro, setDeclaro,
    municipios, erroMunicipios,
    mapDivRef, ponto, limparMarcador,
    erros, setErros,
    enviando, erroEnvio, protocolo,
    enviar, novaDenuncia,
  }
}
