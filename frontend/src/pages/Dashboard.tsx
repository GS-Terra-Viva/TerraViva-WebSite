import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

import AdminLayout from '../components/layout/AdminLayout'
import StatCard from '../components/ui/StatCard'
import StatusBadge, { COR_STATUS } from '../components/ui/StatusBadge'
import { GraficoPorTipo, GraficoRelatosPorDia } from '../components/ui/DenunciasGraficos'
import { listarUsuarios, type UsuarioLista } from '../services/authService'
import {
  listarDenuncias,
  ORDEM_STATUS,
  STATUS_DENUNCIA,
  type DenunciaLista,
  type StatusDenuncia,
  type TipoOcorrencia,
} from '../services/denuncias'
import { chaveDia, formatarData } from '../utils/formatters'

const DIAS = 7
const DIA_CURTO = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })

const COR_BARRA: Record<StatusDenuncia, string> = {
  recebida: 'bg-blue-600',
  em_analise: 'bg-amber-500',
  encaminhada: 'bg-purple-600',
  concluida: 'bg-green-800',
}

const msgErro = (e: unknown) => {
  const m =
    typeof e === 'object' && e !== null && 'message' in e
      ? String((e as { message: unknown }).message)
      : String(e)
  if (m.includes('sessao_invalida')) return 'Sua sessão expirou. Entre novamente.'
  return m
}

const Dashboard = () => {
  const [denuncias, setDenuncias] = useState<DenunciaLista[]>([])
  const [usuarios, setUsuarios] = useState<UsuarioLista[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [erroUsuarios, setErroUsuarios] = useState(false)

  useEffect(() => {
    // Usuários são secundários: se falharem, o resto da tela continua funcionando
    Promise.allSettled([listarDenuncias(), listarUsuarios()]).then(([d, u]) => {
      if (d.status === 'fulfilled') setDenuncias(d.value)
      else {
        console.error(d.reason)
        setErro(msgErro(d.reason))
      }
      if (u.status === 'fulfilled') setUsuarios(u.value)
      else {
        console.error(u.reason)
        setErroUsuarios(true)
      }
      setCarregando(false)
    })
  }, [])

  const porStatus = useMemo(() => {
    const m = Object.fromEntries(ORDEM_STATUS.map((s) => [s, 0])) as Record<StatusDenuncia, number>
    for (const d of denuncias) if (d.status in m) m[d.status] += 1
    return m
  }, [denuncias])

  const { dias, porTipo } = useMemo(() => {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const lista = Array.from({ length: DIAS }, (_, i) => {
      const dt = new Date(hoje)
      dt.setDate(hoje.getDate() - (DIAS - 1 - i))
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
  }, [denuncias])

  const recentes = useMemo(
    () =>
      [...denuncias]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5),
    [denuncias],
  )

  // Usuários: divisão por tipo de conta e os cadastros mais recentes.
  // A lista não traz data de cadastro, então "mais recentes" = maiores ids.
  const { admins, comuns, ultimosUsuarios } = useMemo(() => {
    const qtdAdmins = usuarios.filter((u) => u.role === 'admin').length
    return {
      admins: qtdAdmins,
      comuns: usuarios.length - qtdAdmins,
      ultimosUsuarios: [...usuarios].sort((a, b) => Number(b.id) - Number(a.id)).slice(0, 5),
    }
  }, [usuarios])

  const total = denuncias.length
  const totalUsuarios = usuarios.length
  const emAndamento = porStatus.em_analise + porStatus.encaminhada

  const valorUsuarios = carregando ? '…' : erroUsuarios ? '—' : totalUsuarios
  const legendaUsuarios =
    carregando || erroUsuarios ? 'Contas cadastradas' : `${admins} admin · ${comuns} comuns`

  return (
    <AdminLayout titulo="Visão geral">
      <main className="max-w-6xl p-6 md:p-10">
        <p className="text-xs font-bold tracking-wide text-green-800">PAINEL / VISÃO GERAL</p>
        <h1 className="mt-2 text-4xl font-bold">Como está a plataforma hoje.</h1>
        <p className="mt-2 text-sm text-gray-600">
          Um resumo das denúncias recebidas e do andamento de cada caso.
        </p>

        {erro && <p className="mt-6 text-sm text-red-600">{erro}</p>}

        {/* Resumo */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard titulo="Total de denúncias" valor={carregando ? '…' : total} legenda="Em aberto" corBorda="border-green-800" />
          <StatCard titulo="Recebidas" valor={carregando ? '…' : porStatus.recebida} legenda="Aguardando triagem" corBorda={COR_STATUS.recebida} />
          <StatCard titulo="Em andamento" valor={carregando ? '…' : emAndamento} legenda="Análise e encaminhadas" corBorda={COR_STATUS.em_analise} />
          <StatCard titulo="Concluídas" valor={carregando ? '…' : porStatus.concluida} legenda="Finalizadas" corBorda={COR_STATUS.concluida} />
          <StatCard titulo="Usuários" valor={valorUsuarios} legenda={legendaUsuarios} corBorda="border-yellow-600" />
        </div>

        {/* Gráficos */}
        <h2 className="mt-10 text-2xl font-bold">Últimos {DIAS} dias</h2>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3"><GraficoRelatosPorDia dias={dias} /></div>
          <div className="lg:col-span-2"><GraficoPorTipo itens={porTipo} /></div>
        </div>

        {/* Andamento + recentes */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-4">
          <section className="lg:col-span-3 p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-baseline justify-between">
              <h3 className="text-base font-bold">Últimas denúncias</h3>
              <Link
                to="/dashboard/denuncias"
                className="inline-flex items-center gap-1 text-sm font-bold text-green-800 hover:underline"
              >
                Ver todas <ArrowRight size={14} />
              </Link>
            </div>

            {carregando ? (
              <p className="mt-6 text-sm text-gray-500">Carregando...</p>
            ) : recentes.length === 0 ? (
              <p className="mt-6 text-sm text-gray-500">Nenhuma denúncia recebida ainda.</p>
            ) : (
              <ul className="mt-4 divide-y divide-gray-100">
                {recentes.map((d) => (
                  <li key={d.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{d.titulo}</p>
                      <p className="text-xs text-gray-500">
                        <span className="font-mono">{d.protocolo}</span> · {d.municipio} ·{' '}
                        {formatarData(d.data_ocorrido)}
                      </p>
                    </div>
                    <StatusBadge status={d.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="lg:col-span-2 p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-base font-bold">Andamento dos casos</h3>
            <ul className="mt-5 space-y-3">
              {ORDEM_STATUS.map((s) => (
                <li key={s}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{STATUS_DENUNCIA[s]}</span>
                    <span className="font-semibold text-gray-900">{porStatus[s]}</span>
                  </div>
                  <div className="mt-1 h-2 rounded bg-gray-100">
                    <div
                      className={`h-2 rounded ${COR_BARRA[s]}`}
                      style={{ width: total ? `${(porStatus[s] / total) * 100}%` : '0%' }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Usuários cadastrados */}
        <h2 className="mt-10 text-2xl font-bold">Usuários</h2>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-5 gap-4">
          <section className="lg:col-span-3 p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-base font-bold">Cadastros mais recentes</h3>

            {carregando ? (
              <p className="mt-6 text-sm text-gray-500">Carregando...</p>
            ) : erroUsuarios ? (
              <p className="mt-6 text-sm text-red-600">Não foi possível carregar os usuários.</p>
            ) : ultimosUsuarios.length === 0 ? (
              <p className="mt-6 text-sm text-gray-500">Nenhum usuário cadastrado.</p>
            ) : (
              <ul className="mt-4 divide-y divide-gray-100">
                {ultimosUsuarios.map((u) => (
                  <li key={u.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-800">
                        {u.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{u.name}</p>
                        <p className="text-xs text-gray-500 truncate">{u.email}</p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 px-3 py-1 text-xs font-bold rounded ${
                        u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {u.role === 'admin' ? 'Admin' : 'Usuário'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="lg:col-span-2 p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-base font-bold">Tipos de conta</h3>

            {erroUsuarios ? (
              <p className="mt-6 text-sm text-red-600">Não foi possível carregar os usuários.</p>
            ) : (
              <ul className="mt-5 space-y-3">
                {[
                  { rotulo: 'Administradores', valor: admins, cor: 'bg-amber-500' },
                  { rotulo: 'Usuários comuns', valor: comuns, cor: 'bg-green-800' },
                ].map((t) => (
                  <li key={t.rotulo}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{t.rotulo}</span>
                      <span className="font-semibold text-gray-900">{carregando ? '…' : t.valor}</span>
                    </div>
                    <div className="mt-1 h-2 rounded bg-gray-100">
                      <div
                        className={`h-2 rounded ${t.cor}`}
                        style={{ width: totalUsuarios ? `${(t.valor / totalUsuarios) * 100}%` : '0%' }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </AdminLayout>
  )
}

export default Dashboard