import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Download, Search } from 'lucide-react'

import AdminLayout from '../components/layout/AdminLayout'
import StatCard from '../components/ui/StatCard'
import { COR_STATUS } from '../components/ui/StatusBadge'
import DenunciasTabela from '../components/ui/DenunciasTabela'
import DenunciaModal from '../components/ui/DenunciaModal'
import ConfirmarArquivarModal from '../components/ui/ConfirmarArquivarModal'
import AlterarStatusModal from '../components/ui/AlterarStatusModal'
import { GraficoPorTipo, GraficoRelatosPorDia } from '../components/ui/DenunciasGraficos'
import {
  alterarStatusDenuncia,
  arquivarDenuncia,
  listarDenuncias,
  STATUS_DENUNCIA,
  TIPOS_OCORRENCIA,
  type DenunciaLista,
  type StatusDenuncia,
  type TipoOcorrencia,
} from '../services/denuncias'
import { chaveDia, formatarData, formatarDataHora } from '../utils/formatters'

const POR_PAGINA = 5
const PERIODOS = [
  { dias: 7, label: 'Últimos 7 dias' },
  { dias: 14, label: 'Últimos 14 dias' },
  { dias: 30, label: 'Últimos 30 dias' },
] as const

const msgErro = (e: unknown) => {
  const m =
    typeof e === 'object' && e !== null && 'message' in e
      ? String((e as { message: unknown }).message)
      : String(e)
  if (m.includes('sessao_invalida')) return 'Sua sessão expirou. Entre novamente.'
  if (m.includes('mensagem_obrigatoria')) return 'Informe a mensagem sobre o processo.'
  if (m.includes('transicao_invalida')) return 'Este status não pode ser aplicado agora. Recarregue a página.'
  return m
}

const selectCls =
  'p-2.5 text-sm rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700'

const DIA_CURTO = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })

function exportarCsv(linhas: DenunciaLista[]) {
  const cab = [
    'Protocolo', 'Título', 'Tipo', 'Status', 'Data do ocorrido', 'Recebida em',
    'Município', 'Comunidade', 'Descrição', 'Latitude', 'Longitude', 'Denunciante', 'E-mail',
  ]
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const corpo = linhas.map((d) =>
    [
      d.protocolo, d.titulo, TIPOS_OCORRENCIA[d.tipo] ?? d.tipo,
      STATUS_DENUNCIA[d.status] ?? d.status, formatarData(d.data_ocorrido),
      formatarDataHora(d.created_at), d.municipio, d.comunidade, d.descricao,
      d.lat, d.lng, d.usuario_nome, d.usuario_email,
    ].map(esc).join(';'),
  )
  const csv = '﻿' + [cab.map(esc).join(';'), ...corpo].join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `denuncias-${chaveDia(new Date())}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const DashboardDenuncias = () => {
  const [denuncias, setDenuncias] = useState<DenunciaLista[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const [periodo, setPeriodo] = useState<number>(7)
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState<'todos' | StatusDenuncia>('todos')
  const [filtroTipo, setFiltroTipo] = useState<'todos' | TipoOcorrencia>('todos')
  const [pagina, setPagina] = useState(1)

  const [vendo, setVendo] = useState<DenunciaLista | null>(null)
  const [alvo, setAlvo] = useState<DenunciaLista | null>(null)
  const [arquivando, setArquivando] = useState(false)
  const [erroArquivar, setErroArquivar] = useState<string | null>(null)

  const [mudanca, setMudanca] = useState<{ d: DenunciaLista; novo: StatusDenuncia } | null>(null)
  const [salvandoStatus, setSalvandoStatus] = useState(false)
  const [erroStatus, setErroStatus] = useState<string | null>(null)

  useEffect(() => {
    listarDenuncias()
      .then(setDenuncias)
      .catch((e) => {
        console.error(e)
        setErro(msgErro(e))
      })
      .finally(() => setCarregando(false))
  }, [])

  const totais = useMemo(() => {
    const conta = (s: StatusDenuncia) => denuncias.filter((d) => d.status === s).length
    return {
      total: denuncias.length,
      recebidas: conta('recebida'),
      emAnalise: conta('em_analise'),
      concluidas: conta('concluida'),
    }
  }, [denuncias])

  // Gráficos: filtrados pelo período (data em que o relato foi recebido)
  const { dias, porTipo } = useMemo(() => {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const lista = Array.from({ length: periodo }, (_, i) => {
      const dt = new Date(hoje)
      dt.setDate(hoje.getDate() - (periodo - 1 - i))
      return { chave: chaveDia(dt), rotulo: DIA_CURTO.format(dt).replace('.', ''), total: 0 }
    })
    const indice = new Map(lista.map((d) => [d.chave, d]))
    const tipos = new Map<TipoOcorrencia, number>()

    for (const d of denuncias) {
      const dia = indice.get(chaveDia(new Date(d.created_at)))
      if (!dia) continue
      dia.total += 1
      tipos.set(d.tipo, (tipos.get(d.tipo) ?? 0) + 1)
    }

    return {
      dias: lista,
      porTipo: [...tipos.entries()]
        .map(([tipo, total]) => ({ tipo, total }))
        .sort((a, b) => b.total - a.total),
    }
  }, [denuncias, periodo])

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

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const inicio = (paginaAtual - 1) * POR_PAGINA
  const visiveis = filtradas.slice(inicio, inicio + POR_PAGINA)

  async function confirmarArquivar() {
    if (!alvo) return
    setArquivando(true)
    setErroArquivar(null)
    try {
      await arquivarDenuncia(alvo.id)
      setDenuncias((lista) => lista.filter((d) => d.id !== alvo.id))
      setAlvo(null)
    } catch (e) {
      console.error(e)
      setErroArquivar(msgErro(e))
    } finally {
      setArquivando(false)
    }
  }

  async function confirmarStatus(mensagem?: string) {
    if (!mudanca) return
    const { d, novo } = mudanca
    setSalvandoStatus(true)
    setErroStatus(null)
    try {
      await alterarStatusDenuncia(d.id, novo, mensagem)
      setDenuncias((lista) =>
        lista.map((x) =>
          x.id !== d.id
            ? x
            : {
                ...x,
                status: novo,
                mensagem_encaminhamento: novo === 'encaminhada' ? (mensagem ?? null) : x.mensagem_encaminhamento,
                mensagem_conclusao: novo === 'concluida' ? (mensagem ?? null) : x.mensagem_conclusao,
              },
        ),
      )
      setMudanca(null)
    } catch (e) {
      console.error(e)
      setErroStatus(msgErro(e))
    } finally {
      setSalvandoStatus(false)
    }
  }

  return (
    <AdminLayout titulo="Denúncias" valor={carregando ? undefined : totais.total}>
      <main className="max-w-6xl p-6 md:p-10">
        <p className="text-xs font-bold tracking-wide text-green-800">PAINEL / DENÚNCIAS</p>
        <h1 className="mt-2 text-4xl font-bold">O que a comunidade está relatando.</h1>
        <p className="mt-2 text-sm text-gray-600">
          Acompanhe os relatos recebidos, avance o status de cada caso e arquive os já tratados.
        </p>

        {/* Resumo */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard titulo="Total de denúncias" valor={totais.total} legenda="Todas as denúncias" corBorda="border-green-800" />
          <StatCard titulo="Recebidas" valor={totais.recebidas} legenda="Aguardando triagem" corBorda={COR_STATUS.recebida} />
          <StatCard titulo="Em análise" valor={totais.emAnalise} legenda="Em apuração" corBorda={COR_STATUS.em_analise} />
          <StatCard titulo="Concluídas" valor={totais.concluidas} legenda="Finalizadas" corBorda={COR_STATUS.concluida} />
        </div>

        {/* Gráficos */}
        <div className="mt-10 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">Panorama</h2>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(Number(e.target.value))}
            className={selectCls}
            aria-label="Período"
          >
            {PERIODOS.map((p) => (
              <option key={p.dias} value={p.dias}>{p.label}</option>
            ))}
          </select>
        </div>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3"><GraficoRelatosPorDia dias={dias} /></div>
          <div className="lg:col-span-2"><GraficoPorTipo itens={porTipo} /></div>
        </div>

        {/* Lista */}
        <div className="mt-10 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Lista de denúncias</h2>
            <p className="mt-1 text-sm text-gray-600">{filtradas.length} registros encontrados</p>
          </div>
          <button
            type="button"
            onClick={() => exportarCsv(filtradas)}
            disabled={filtradas.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded bg-green-800 hover:bg-green-900 disabled:opacity-40"
          >
            <Download size={16} /> Exportar lista
          </button>
        </div>

        <div className="mt-4 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setPagina(1) }}
              placeholder="Buscar por protocolo, título, município ou denunciante"
              className={`${selectCls} w-full pl-9`}
            />
          </div>
          <select
            value={filtroStatus}
            onChange={(e) => { setFiltroStatus(e.target.value as typeof filtroStatus); setPagina(1) }}
            className={selectCls}
          >
            <option value="todos">Todos os status</option>
            {Object.entries(STATUS_DENUNCIA).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <select
            value={filtroTipo}
            onChange={(e) => { setFiltroTipo(e.target.value as typeof filtroTipo); setPagina(1) }}
            className={selectCls}
          >
            <option value="todos">Todos os tipos</option>
            {Object.entries(TIPOS_OCORRENCIA).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          {carregando ? (
            <p className="p-6 text-sm text-gray-500">Carregando denúncias...</p>
          ) : erro ? (
            <p className="p-6 text-sm text-red-600">{erro}</p>
          ) : (
            <DenunciasTabela
                  denuncias={visiveis}
                  onVer={setVendo}
                  onArquivar={setAlvo}
                  onAlterarStatus={(d, novo) => {
                    setErroStatus(null)
                    setMudanca({ d, novo })
                  } } atualizandoStatusId={0}            />
          )}
        </div>

        {!carregando && !erro && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              {filtradas.length === 0
                ? 'Nenhum registro'
                : `Exibindo ${inicio + 1}–${inicio + visiveis.length} de ${filtradas.length} denúncias`}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPagina(paginaAtual - 1)}
                disabled={paginaAtual === 1}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-30"
              >
                <ArrowLeft size={16} />
              </button>
              <span className="px-3 py-1 text-white bg-green-800 rounded font-bold">{paginaAtual}</span>
              <span>/ {totalPaginas}</span>
              <button
                type="button"
                onClick={() => setPagina(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-30"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </main>

      {vendo && <DenunciaModal denuncia={vendo} onFechar={() => setVendo(null)} />}

      {mudanca && (
        <AlterarStatusModal
          denuncia={mudanca.d}
          novoStatus={mudanca.novo}
          salvando={salvandoStatus}
          erro={erroStatus}
          onConfirmar={confirmarStatus}
          onCancelar={() => {
            setMudanca(null)
            setErroStatus(null)
          }}
        />
      )}

      {alvo && (
        <ConfirmarArquivarModal
          denuncia={alvo}
          arquivando={arquivando}
          erro={erroArquivar}
          onConfirmar={confirmarArquivar}
          onCancelar={() => {
            setAlvo(null)
            setErroArquivar(null)
          }}
        />
      )}
    </AdminLayout>
  )
}

export default DashboardDenuncias
