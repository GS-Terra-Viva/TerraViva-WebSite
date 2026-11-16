import { Link } from 'react-router-dom'

import Navbar from '../components/ui/NavBar'
import Footer from '../components/ui/Footer'
import { STATUS_DENUNCIA, TIPOS_OCORRENCIA } from '../services/denuncias'
import type { DenunciaMapa } from '../services/denunciasPublicas'
import { useDenunciasPublicas } from '../hooks/useDenunciasPublicas'
import { useFiltroDenunciasPublicas } from '../hooks/useFiltroDenunciasPublicas'
import { useMapaDenuncias } from '../hooks/useMapaDenuncias'
// Os valores vêm do banco como string, então indexamos por string
const TIPOS: Record<string, string> = TIPOS_OCORRENCIA
const STATUS: Record<string, string> = STATUS_DENUNCIA

const CORES: Record<string, string> = {
  recebida: '#687C51',
  em_analise: '#A71E0C',
  encaminhada: '#C49A32',
  concluida: '#287044',
}

function formatarData(data: string) {
  if (!data) return 'Data não informada'

  return new Date(`${data.slice(0, 10)}T12:00:00`).toLocaleDateString('pt-BR')
}

function Denuncias() {
  // Dados, filtros e mapa ficam nos hooks; a página só apresenta
  const { denuncias, carregando, erro } = useDenunciasPublicas()

  const {
    busca, setBusca,
    municipio, setMunicipio,
    comunidade, setComunidade,
    tipo, setTipo,
    status, setStatus,
    municipios, comunidades, filtradas, comLocalizacao, limparFiltros,
  } = useFiltroDenunciasPublicas(denuncias)

  const { mapaRef, localizar } = useMapaDenuncias(comLocalizacao, CORES, STATUS)

  const localizarDenuncia = (d: DenunciaMapa) => localizar(d)

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f6f7f0] px-6 pt-32 pb-12 text-black md:px-12">

        <div className="mx-auto max-w-7x1">
        <nav aria-label="Você está em" className="text-sm text-[#2c674b] mb-5">
                  <Link to="/" className="hover:underline">
                    Início
                  </Link>{' '}
                  / <span>Denúncias</span>
                </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-bold">Denúncias públicas</h1>
          <p className="mt-2 text-[#657168]">
            Consulte as denúncias registradas e acompanhe sua situação.
          </p>
        </header>

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-5">
            <p className="text-sm font-bold text-black">Denúncias encontradas</p>
            <strong className="mt-2 block text-3xl text-black">{filtradas.length}</strong>
          </div>

          <div className="rounded-xl bg-white p-5">
            <p className="text-sm font-bold text-black">Recebidas</p>
            <strong className="mt-2 block text-3xl text-black">
              {filtradas.filter((d) => d.status === 'recebida').length}
            </strong>
          </div>

          <div className="rounded-xl bg-white p-5">
            <p className="text-sm font-bold text-black">Em análise</p>
            <strong className="mt-2 block text-3xl text-black">
              {filtradas.filter((d) => d.status === 'em_analise').length}
            </strong>
          </div>

          <div className="rounded-xl bg-white p-5">
            <p className="text-sm font-bold text-black">Concluídas</p>
            <strong className="mt-2 block text-3xl text-black">
              {filtradas.filter((d) => d.status === 'concluida').length}
            </strong>
          </div>
        </section>

        <section className="mb-8 rounded-xl bg-white p-6 text-[#12241B]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#12241B]">Filtros</h2>
            <button
              type="button"
              onClick={limparFiltros}
              className="text-sm font-bold text-[#A71E0C] hover:underline"
            >
              Limpar filtros
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar título"
              className="w-full rounded-lg border border-[#657168] bg-white px-3 py-2 text-[#12241B] outline-none focus:border-[#A71E0C]"
            />

            <select
              value={municipio}
              onChange={(e) => {
                setMunicipio(e.target.value)
                setComunidade('')
              }}
              className="w-full rounded-lg border border-[#657168] bg-white px-3 py-2 text-[#12241B] outline-none focus:border-[#A71E0C]"
            >
              <option value="">Todos os municípios</option>
              {municipios.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <select
              value={comunidade}
              onChange={(e) => setComunidade(e.target.value)}
              className="w-full rounded-lg border border-[#657168] bg-white px-3 py-2 text-[#12241B] outline-none focus:border-[#A71E0C]"
            >
              <option value="">Todas as comunidades</option>
              {comunidades.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full rounded-lg border border-[#657168] bg-white px-3 py-2 text-[#12241B] outline-none focus:border-[#A71E0C]"
            >
              <option value="">Todos os tipos</option>
              {Object.entries(TIPOS).map(([valor, nome]) => (
                <option key={valor} value={valor}>{nome}</option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-[#657168] bg-white px-3 py-2 text-[#12241B] outline-none focus:border-[#A71E0C]"
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
              className="h-[500px] w-full rounded-xl border border-transparent overflow-hidden"
            />
            <p className="mt-2 text-[#FAF0D4]">
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
                  className="rounded-xl border border-[#D1C6A8] bg-[#FAF0D4] p-5 text-[#12241B]"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-[#12241B]">{d.titulo}</h3>
                    <span
                      className="shrink-0 rounded-full px-2 py-1 text-xs font-medium text-white"
                      style={{ backgroundColor: CORES[d.status] ?? '#64748b' }}
                    >
                      {STATUS[d.status] ?? d.status}
                    </span>
                  </div>

                  <p className="text-sm text-[#58695D]">
                    {TIPOS[d.tipo] ?? d.tipo}
                  </p>

                  <p className="mt-2 text-sm">
                    {d.comunidade ? `${d.comunidade}, ` : ''}{d.municipio}
                  </p>

                  <p className="mt-1 text-xs text-[#58695D]">
                    Ocorrido em: {formatarData(d.data_ocorrido)}
                  </p>

                  {d.lat !== null && d.lng !== null ? (
                    <button
                      type="button"
                      onClick={() => localizarDenuncia(d)}
                      className="mt-3 text-sm font-bold text-[#A71E0C] hover:underline"
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

        </div>
      </main>

      <Footer />
    </>
  )
}

export default Denuncias