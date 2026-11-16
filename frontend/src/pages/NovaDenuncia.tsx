import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, ShieldCheck, ArrowRight } from 'lucide-react'

import Navbar from '../components/ui/NavBar'
import { getSession } from '../services/authService'
import {
  TIPOS_OCORRENCIA,
  centroDoMunicipio,
  criarDenuncia,
  listarMunicipiosSP,
  type Municipio,
  type TipoOcorrencia,
} from '../services/denuncias'
import Footer from '../components/ui/Footer'

type LatLng = { lat: number; lng: number }
type Erros = Partial<
  Record<'tipo' | 'data' | 'titulo' | 'descricao' | 'municipio' | 'declaro', string>
>

const MAX_DESCRICAO = 3000
const MAX_TITULO = 120

// Estado de São Paulo (centro e limites para o mapa)
const CENTRO_SP: [number, number] = [-22.3, -48.7]
const LIMITES_SP = L.latLngBounds([-26.0, -54.5], [-19.0, -43.0])

// Data local (yyyy-mm-dd) — toISOString usaria UTC e erraria o "hoje" à noite no Brasil
const hoje = () => {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}
const fmtLatLng = (p: LatLng) => `${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}`

// O erro do Supabase é um objeto simples (não é instância de Error)
const msgErro = (e: unknown) => {
  const m =
    typeof e === 'object' && e !== null && 'message' in e
      ? String((e as { message: unknown }).message)
      : String(e)
  if (m.includes('sessao_invalida')) {
    return 'Sua sessão expirou. Entre novamente para enviar a denúncia.'
  }
  return m
}

const inputCls =
  'w-full p-2.5 text-sm rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700'
const labelCls = 'block text-xs font-bold text-gray-700 mb-1'
const erroCls = 'mt-1 text-xs text-red-600'

const NovaDenuncia = () => {
  const navigate = useNavigate()
  const usuario = getSession() // só para exibir "em nome de"; quem grava é o banco, pelo token

  const mapDivRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const pinRef = useRef<L.Marker | null>(null)

  // Campos do formulário
  const [tipo, setTipo] = useState<TipoOcorrencia | ''>('')
  const [data, setData] = useState('')
  const [titulo, setTitulo] = useState('')
  const [comunidade, setComunidade] = useState('')
  const [descricao, setDescricao] = useState('')
  const [municipioId, setMunicipioId] = useState('')
  const [ponto, setPonto] = useState<LatLng | null>(null)
  const [declaro, setDeclaro] = useState(false)

  // Estado da tela
  const [municipios, setMunicipios] = useState<Municipio[]>([])
  const [erroMunicipios, setErroMunicipios] = useState<string | null>(null)
  const [erros, setErros] = useState<Erros>({})
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState<string | null>(null)
  const [protocolo, setProtocolo] = useState<string | null>(null)

  // --- Municípios de SP (IBGE) ---
  useEffect(() => {
    listarMunicipiosSP()
      .then(setMunicipios)
      .catch((e) => {
        console.error(e)
        setErroMunicipios('Não foi possível carregar a lista de municípios. Recarregue a página.')
      })
  }, [])

  // --- Mapa (Leaflet + OpenStreetMap) ---
  // O mapa só existe enquanto o formulário está na tela (some na tela de sucesso),
  // por isso o efeito depende de `protocolo`: recria ao voltar para o formulário.
  useEffect(() => {
    if (protocolo || !mapDivRef.current) return

    const map = L.map(mapDivRef.current, {
      maxBounds: LIMITES_SP,
      maxBoundsViscosity: 1,
      minZoom: 6,
    }).setView(CENTRO_SP, 6)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; contribuidores do OpenStreetMap',
    }).addTo(map)

    // Clicar marca (ou move) o local da ocorrência
    map.on('click', (e: L.LeafletMouseEvent) => {
      const p = { lat: e.latlng.lat, lng: e.latlng.lng }
      if (!pinRef.current) {
        const pin = L.marker([p.lat, p.lng], { draggable: true }).addTo(map)
        pin.on('dragend', () => {
          const ll = pin.getLatLng()
          setPonto({ lat: ll.lat, lng: ll.lng })
        })
        pinRef.current = pin
      } else {
        pinRef.current.setLatLng([p.lat, p.lng])
      }
      setPonto(p)
    })

    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
      pinRef.current = null
    }
  }, [protocolo])

  // Ao escolher o município, o mapa voa até ele
  async function escolherMunicipio(id: string) {
    setMunicipioId(id)
    setErros((x) => ({ ...x, municipio: undefined }))
    const m = municipios.find((mu) => String(mu.id) === id)
    if (!m) return
    const centro = await centroDoMunicipio(m.nome)
    if (centro && mapRef.current) mapRef.current.flyTo([centro.lat, centro.lng], 12)
  }

  function limparMarcador() {
    pinRef.current?.remove()
    pinRef.current = null
    setPonto(null)
  }

  function validar(): Erros {
    const e: Erros = {}
    if (!tipo) e.tipo = 'Selecione o tipo de ocorrência.'
    if (!data) e.data = 'Informe a data do ocorrido.'
    else if (data > hoje()) e.data = 'A data não pode ser no futuro.'
    if (!titulo.trim()) e.titulo = 'Resuma o ocorrido em uma frase.'
    if (!descricao.trim()) e.descricao = 'Descreva o que aconteceu.'
    if (!municipioId) e.municipio = 'Selecione o município.'
    if (!declaro) e.declaro = 'É necessário declarar que as informações são verdadeiras.'
    return e
  }

  async function enviar(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    setErroEnvio(null)

    const e = validar()
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

  function novaDenuncia() {
    setTipo('')
    setData('')
    setTitulo('')
    setComunidade('')
    setDescricao('')
    setMunicipioId('')
    setPonto(null)
    setDeclaro(false)
    setErros({})
    setErroEnvio(null)
    setProtocolo(null) // o efeito do mapa recria o mapa limpo
  }

  return (
    <div className="min-h-screen bg-[#f6f7f0] text-gray-900">
      <div className="relative z-20 border-b border-gray-200 bg-white">
        <Navbar />
      </div>

      <div className="max-w-6xl mx-auto px-4 my-20 md:p-8">
      <nav aria-label="Você está em" className="text-sm text-[#2c674b] mb-5">
                  <Link to="/" className="hover:underline">
                    Início
                  </Link>{' '}
                  / <span>Nova Denúncia</span>
                </nav>
        <h1 className="mt-2 text-4xl font-bold">O seu relato importa.</h1>
        <p className="mt-2 text-sm text-gray-600">
          Conte o que aconteceu. Quanto mais contexto, melhor será a análise.
        </p>

        {/* Tela de sucesso */}
        {protocolo ? (
          <div className="mt-6 max-w-xl p-6 bg-white rounded-lg space-y-3">
            <h2 className="text-xl font-bold text-green-800">Denúncia enviada!</h2>
            <p className="text-sm">Guarde o protocolo para acompanhar o relato:</p>
            <p className="text-2xl font-mono font-bold">{protocolo}</p>
            <p className="text-sm text-gray-600">
              A equipe analisa as informações antes de atualizar o status da denúncia.
            </p>
            <button
              type="button"
              onClick={novaDenuncia}
              className="mt-2 px-4 py-2 rounded bg-green-800 text-white text-sm font-bold"
            >
              Registrar outra denúncia
            </button>
          </div>
        ) : (
          <form onSubmit={enviar} noValidate className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 items-start">
              {/* ------------------ 01 · Sobre a ocorrência ------------------ */}
              <section className="p-6 bg-white rounded-lg space-y-4">
                <header>
                  <h2 className="text-xl font-bold">
                    <span className="text-sm text-red-700 mr-3">01</span>
                    Sobre a ocorrência
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Preencha com informações que você conhece.
                  </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tipo" className={labelCls}>
                      Tipo de ocorrência *
                    </label>
                    <select
                      id="tipo"
                      value={tipo}
                      onChange={(e) => {
                        setTipo(e.target.value as TipoOcorrencia | '')
                        setErros((x) => ({ ...x, tipo: undefined }))
                      }}
                      disabled={enviando}
                      className={inputCls}
                    >
                      <option value="">Selecione uma categoria</option>
                      {Object.entries(TIPOS_OCORRENCIA).map(([id, label]) => (
                        <option key={id} value={id}>
                          {label}
                        </option>
                      ))}
                    </select>
                    {erros.tipo && <p className={erroCls}>{erros.tipo}</p>}
                  </div>

                  <div>
                    <label htmlFor="data" className={labelCls}>
                      Data do ocorrido *
                    </label>
                    <input
                      id="data"
                      type="date"
                      max={hoje()}
                      value={data}
                      onChange={(e) => {
                        setData(e.target.value)
                        setErros((x) => ({ ...x, data: undefined }))
                      }}
                      disabled={enviando}
                      className={inputCls}
                    />
                    {erros.data && <p className={erroCls}>{erros.data}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="titulo" className={labelCls}>
                    Título da denúncia *
                  </label>
                  <input
                    id="titulo"
                    type="text"
                    value={titulo}
                    maxLength={MAX_TITULO}
                    onChange={(e) => {
                      setTitulo(e.target.value)
                      setErros((x) => ({ ...x, titulo: undefined }))
                    }}
                    disabled={enviando}
                    placeholder="Resuma o ocorrido em uma frase"
                    className={inputCls}
                  />
                  {erros.titulo && <p className={erroCls}>{erros.titulo}</p>}
                </div>

                <div>
                  <label htmlFor="comunidade" className={labelCls}>
                    Terra indígena ou comunidade
                  </label>
                  <input
                    id="comunidade"
                    type="text"
                    value={comunidade}
                    maxLength={150}
                    onChange={(e) => setComunidade(e.target.value)}
                    disabled={enviando}
                    placeholder="Nome do território, se souber"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label htmlFor="descricao" className={labelCls}>
                    Descrição do ocorrido *
                  </label>
                  <textarea
                    id="descricao"
                    value={descricao}
                    maxLength={MAX_DESCRICAO}
                    rows={7}
                    onChange={(e) => {
                      setDescricao(e.target.value)
                      setErros((x) => ({ ...x, descricao: undefined }))
                    }}
                    disabled={enviando}
                    placeholder={
                      'O que aconteceu? Há quanto tempo? Quem ou o que foi afetado?\n' +
                      'Inclua pontos de referência e detalhes que ajudem a entender a situação.\n' +
                      'Não inclua dados pessoais de outras pessoas.'
                    }
                    className={inputCls}
                  />
                  <p className="text-right text-xs text-gray-500">
                    {descricao.length} / {MAX_DESCRICAO.toLocaleString('pt-BR')}
                  </p>
                  {erros.descricao && <p className={erroCls}>{erros.descricao}</p>}
                </div>

                {/* TODO: seção "Evidências e anexos" (upload) — fica para a próxima etapa */}
              </section>

              {/* ------------------ 02 · Onde aconteceu ------------------ */}
              <div className="space-y-6">
                <section className="p-6 bg-white rounded-lg space-y-4">
                  <h2 className="text-xl font-bold">
                    <span className="text-sm text-red-700 mr-3">02</span>
                    Onde aconteceu?
                  </h2>

                  <div>
                    <label htmlFor="municipio" className={labelCls}>
                      Município *
                    </label>
                    <select
                      id="municipio"
                      value={municipioId}
                      onChange={(e) => escolherMunicipio(e.target.value)}
                      disabled={enviando || municipios.length === 0}
                      className={inputCls}
                    >
                      <option value="">Selecione em São Paulo</option>
                      {municipios.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nome}
                        </option>
                      ))}
                    </select>
                    {erroMunicipios && <p className={erroCls}>{erroMunicipios}</p>}
                    {erros.municipio && <p className={erroCls}>{erros.municipio}</p>}
                  </div>

                  <div
                    ref={mapDivRef}
                    className="relative isolate z-0 h-64 w-full rounded"
                  />
                  <p className="text-xs text-gray-600">Clique no mapa para marcar o local do ocorrido.</p>

                  <div className="flex items-start gap-2 p-3 rounded bg-green-50 text-sm">
                    <MapPin size={16} className="mt-0.5 text-green-800 shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-green-900">
                        {ponto ? 'Ponto selecionado' : 'Nenhum ponto selecionado'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {ponto
                          ? `${fmtLatLng(ponto)} — arraste o marcador para ajustar.`
                          : 'A localização exata não será exibida publicamente.'}
                      </p>
                      {ponto && (
                        <button
                          type="button"
                          onClick={limparMarcador}
                          className="mt-1 text-xs underline text-green-800"
                        >
                          Remover ponto
                        </button>
                      )}
                    </div>
                  </div>
                </section>

                <section className="p-5 rounded-lg bg-green-50 border border-green-100">
                  <h3 className="flex items-center gap-2 font-bold text-green-900">
                    <ShieldCheck size={18} /> Proteja você e a comunidade
                  </h3>
                  <p className="mt-2 text-sm text-green-900">
                    Não confronte os envolvidos. Evite expor nomes, rostos ou informações sensíveis.
                    Em uma situação de perigo imediato, procure os serviços de emergência.
                  </p>
                </section>

                <section className="px-1">
                  <h3 className="font-bold">O que acontece após o envio?</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Você recebe um protocolo para acompanhar o relato. A equipe analisa as
                    informações antes de atualizar o status da denúncia.
                  </p>
                </section>
              </div>
            </div>

            {/* ------------------ Declaração + ações ------------------ */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={declaro}
                    onChange={(e) => {
                      setDeclaro(e.target.checked)
                      setErros((x) => ({ ...x, declaro: undefined }))
                    }}
                    disabled={enviando}
                    className="mt-1"
                  />
                  <span>
                    Declaro que as informações são verdadeiras, conforme meu conhecimento, e li a
                    Política de privacidade.
                  </span>
                </label>
                {erros.declaro && <p className={erroCls}>{erros.declaro}</p>}
              </div>

              {usuario && (
                <p className="text-xs text-gray-500">
                  A denúncia será registrada em nome de <strong>{usuario.name}</strong>
                  {usuario.email ? ` (${usuario.email})` : ''}.
                </p>
              )}

              {erroEnvio && <p className="text-sm text-red-600">{erroEnvio}</p>}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/denuncias')}
                  disabled={enviando}
                  className="px-6 py-2.5 rounded bg-white hover:bg-gray-50 text-sm font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={enviando}
                  className="flex items-center gap-2 px-6 py-2.5 rounded bg-red-700 hover:bg-red-800 text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enviando ? 'Enviando...' : 'Enviar denúncia'}
                  {!enviando && <ArrowRight size={16} />}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
      <Footer/>
    </div>
  )
}

export default NovaDenuncia