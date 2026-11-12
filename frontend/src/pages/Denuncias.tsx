import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import Navbar from '../components/ui/NavBar'
import { supabase } from '../services/supabase'

type DenunciaPublica = {
  id: string
  protocolo: string
  tipo: string
  data_ocorrido: string
  titulo: string
  comunidade: string | null
  municipio: string
  lat: number | null
  lng: number | null
  status: string
  created_at: string
}

const TIPOS: Record<string, string> = {
  invasao_territorio: 'Invasão de território',
  desmatamento: 'Desmatamento',
  exploracao_ilegal: 'Exploração ilegal',
  violencia: 'Violência ou ameaça',
  conflito_fundiario: 'Conflito fundiário',
  contaminacao: 'Contaminação / poluição',
  acesso_servicos: 'Falta de acesso a serviços',
  outro: 'Outro',
}

const STATUS: Record<string, string> = {
  recebida: 'Recebida',
  em_analise: 'Em análise',
  encaminhada: 'Encaminhada',
  concluida: 'Concluída',
}

const CORES: Record<string, string> = {
  recebida: '#2563eb',
  em_analise: '#d97706',
  encaminhada: '#7c3aed',
  concluida: '#16a34a',
}

function formatarData(data: string) {
  if (!data) return 'Data não informada'

  return new Date(`${data.slice(0, 10)}T12:00:00`).toLocaleDateString('pt-BR')
}

function Denuncias() {
  const [denuncias, setDenuncias] = useState<DenunciaPublica[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const [busca, setBusca] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [comunidade, setComunidade] = useState('')
  const [tipo, setTipo] = useState('')
  const [status, setStatus] = useState('')

  const mapaRef = useRef<HTMLDivElement>(null)
  const instanciaMapa = useRef<L.Map | null>(null)
  const camadaMarcadores = useRef<L.LayerGroup | null>(null)
  const marcadores = useRef<Map<string, L.CircleMarker>>(new Map())

  useEffect(() => {
    async function carregarDenuncias() {
      setCarregando(true)
      setErro('')

      const { data, error } = await supabase.rpc('listar_denuncias_publicas')

      if (error) {
        console.error('Erro ao carregar denúncias:', error)
        setErro('Não foi possível carregar as denúncias.')
        setCarregando(false)
        return
      }

      setDenuncias((data ?? []) as DenunciaPublica[])
      setCarregando(false)
    }

    carregarDenuncias()
  }, [])

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

    return denuncias.filter((d) => {
      const correspondeBusca =
        !termo ||
        d.titulo.toLowerCase().includes(termo) ||
        d.protocolo.toLowerCase().includes(termo)

      return (
        correspondeBusca &&
        (!municipio || d.municipio === municipio) &&
        (!comunidade || d.comunidade === comunidade) &&
        (!tipo || d.tipo === tipo) &&
        (!status || d.status === status)
      )
    })
  }, [denuncias, busca, municipio, comunidade, tipo, status])

  const comLocalizacao = useMemo(
    () => filtradas.filter((d) => d.lat !== null && d.lng !== null),
    [filtradas],
  )

  // Inicializa o mapa uma única vez.
  useEffect(() => {
    if (!mapaRef.current || instanciaMapa.current) return

    const mapa = L.map(mapaRef.current).setView([-14.235, -51.925], 4)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapa)

    instanciaMapa.current = mapa
    camadaMarcadores.current = L.layerGroup().addTo(mapa)

    const timer = window.setTimeout(() => mapa.invalidateSize(), 200)

    return () => {
      window.clearTimeout(timer)
      mapa.remove()
      instanciaMapa.current = null
      camadaMarcadores.current = null
      marcadores.current.clear()
    }
  }, [])

  // Atualiza os marcadores sempre que os filtros mudarem.
  useEffect(() => {
    const mapa = instanciaMapa.current
    const camada = camadaMarcadores.current

    if (!mapa || !camada) return

    camada.clearLayers()
    marcadores.current.clear()

    const pontos: L.LatLngExpression[] = []

    comLocalizacao.forEach((d) => {
      const cor = CORES[d.status] ?? '#64748b'

      const marcador = L.circleMarker([d.lat!, d.lng!], {
        radius: 8,
        color: '#ffffff',
        weight: 2,
        fillColor: cor,
        fillOpacity: 0.95,
      })

      const popup = document.createElement('div')
      const titulo = document.createElement('strong')
      titulo.textContent = d.titulo

      const protocolo = document.createElement('p')
      protocolo.textContent = `Protocolo: ${d.protocolo}`

      const local = document.createElement('p')
      local.textContent = `${d.comunidade ? `${d.comunidade}, ` : ''}${d.municipio}`

      const situacao = document.createElement('p')
      situacao.textContent = `Status: ${STATUS[d.status] ?? d.status}`

      popup.append(titulo, protocolo, local, situacao)
      marcador.bindPopup(popup)
      marcador.addTo(camada)

      marcadores.current.set(d.id, marcador)
      pontos.push([d.lat!, d.lng!])
    })

    if (pontos.length > 1) {
      mapa.fitBounds(L.latLngBounds(pontos), { padding: [30, 30], maxZoom: 13 })
    } else if (pontos.length === 1) {
      mapa.setView(pontos[0], 13)
    }
  }, [comLocalizacao])

  function localizarDenuncia(denuncia: DenunciaPublica) {
    const marcador = marcadores.current.get(denuncia.id)
    const mapa = instanciaMapa.current

    if (!marcador || !mapa || denuncia.lat === null || denuncia.lng === null) {
      return
    }

    mapa.setView([denuncia.lat, denuncia.lng], 15)
    marcador.openPopup()
  }

  function limparFiltros() {
    setBusca('')
    setMunicipio('')
    setComunidade('')
    setTipo('')
    setStatus('')
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Denúncias públicas</h1>
          <p className="mt-2 text-gray-600">
            Consulte as denúncias registradas e acompanhe sua situação.
          </p>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">Denúncias encontradas</p>
            <strong className="text-2xl">{filtradas.length}</strong>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">Recebidas</p>
            <strong className="text-2xl">
              {filtradas.filter((d) => d.status === 'recebida').length}
            </strong>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">Em análise</p>
            <strong className="text-2xl">
              {filtradas.filter((d) => d.status === 'em_analise').length}
            </strong>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">Concluídas</p>
            <strong className="text-2xl">
              {filtradas.filter((d) => d.status === 'concluida').length}
            </strong>
          </div>
        </section>

        <section className="mb-6 rounded-lg border p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Filtros</h2>
            <button
              type="button"
              onClick={limparFiltros}
              className="text-sm text-blue-600 hover:underline"
            >
              Limpar filtros
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar título ou protocolo"
              className="rounded-md border px-3 py-2"
            />

            <select
              value={municipio}
              onChange={(e) => {
                setMunicipio(e.target.value)
                setComunidade('')
              }}
              className="rounded-md border px-3 py-2"
            >
              <option value="">Todos os municípios</option>
              {municipios.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <select
              value={comunidade}
              onChange={(e) => setComunidade(e.target.value)}
              className="rounded-md border px-3 py-2"
            >
              <option value="">Todas as comunidades</option>
              {comunidades.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="rounded-md border px-3 py-2"
            >
              <option value="">Todos os tipos</option>
              {Object.entries(TIPOS).map(([valor, nome]) => (
                <option key={valor} value={valor}>{nome}</option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-md border px-3 py-2"
            >
              <option value="">Todos os status</option>
              {Object.entries(STATUS).map(([valor, nome]) => (
                <option key={valor} value={valor}>{nome}</option>
              ))}
            </select>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="mb-3 text-lg font-semibold">Mapa das denúncias</h2>
            <div
              ref={mapaRef}
              className="h-[500px] w-full rounded-lg border"
            />
            <p className="mt-2 text-sm text-gray-500">
              {comLocalizacao.length} denúncia(s) com localização no mapa.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold">
              Registros ({filtradas.length})
            </h2>

            <div className="max-h-[550px] space-y-3 overflow-y-auto pr-1">
              {carregando && (
                <p className="text-gray-500">Carregando denúncias...</p>
              )}

              {erro && (
                <p className="text-red-600">{erro}</p>
              )}

              {!carregando && !erro && filtradas.length === 0 && (
                <p className="rounded-lg border p-4 text-gray-500">
                  Nenhuma denúncia encontrada.
                </p>
              )}

              {!carregando && filtradas.map((d) => (
                <article
                  key={d.id}
                  className="rounded-lg border p-4"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{d.titulo}</h3>
                    <span
                      className="shrink-0 rounded-full px-2 py-1 text-xs font-medium text-white"
                      style={{ backgroundColor: CORES[d.status] ?? '#64748b' }}
                    >
                      {STATUS[d.status] ?? d.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    {TIPOS[d.tipo] ?? d.tipo}
                  </p>

                  <p className="mt-2 text-sm">
                    {d.comunidade ? `${d.comunidade}, ` : ''}{d.municipio}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Protocolo: {d.protocolo}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Ocorrido em: {formatarData(d.data_ocorrido)}
                  </p>

                  {d.lat !== null && d.lng !== null ? (
                    <button
                      type="button"
                      onClick={() => localizarDenuncia(d)}
                      className="mt-3 text-sm font-medium text-blue-600 hover:underline"
                    >
                      Ver no mapa
                    </button>
                  ) : (
                    <p className="mt-3 text-xs text-gray-400">
                      Localização não informada
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Denuncias
