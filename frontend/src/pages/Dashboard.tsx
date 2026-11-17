import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

import AdminLayout from '../components/layout/AdminLayout'
import StatCard from '../components/ui/StatCard'
import StatusBadge from '../components/ui/StatusBadge'
import { GraficoPorTipo, GraficoRelatosPorDia } from '../components/ui/DenunciasGraficos'
import { ORDEM_STATUS, STATUS_DENUNCIA, type StatusDenuncia } from '../services/denuncias'
import { formatarData } from '../utils/formatters'
import { agruparPorDia, contarPorStatus, maisRecentes, resumirUsuarios } from '../utils/estatisticas'
import { useDenuncias } from '../hooks/useDenuncias'
import { useUsuarios } from '../hooks/useUsuarios'

const DIAS = 7

const COR_BARRA: Record<StatusDenuncia, string> = {
  recebida: '#687C51',
  em_analise: '#A71E0C',
  encaminhada: '#C49A32',
  concluida: '#287044',
}

const Dashboard = () => {
  // Dados e estados de carregamento ficam nos hooks; a página só apresenta
  const { denuncias, carregando: carregandoDenuncias, erro } = useDenuncias()
  const { usuarios, carregando: carregandoUsuarios, erro: erroMsgUsuarios } = useUsuarios()

  const carregando = carregandoDenuncias || carregandoUsuarios
  const erroUsuarios = erroMsgUsuarios !== null

  const porStatus = useMemo(() => contarPorStatus(denuncias), [denuncias])
  const { dias, porTipo } = useMemo(() => agruparPorDia(denuncias, DIAS), [denuncias])
  const recentes = useMemo(() => maisRecentes(denuncias, 5), [denuncias])
  const { admins, comuns, ultimos: ultimosUsuarios } = useMemo(
    () => resumirUsuarios(usuarios),
    [usuarios],
  )

  const total = denuncias.length
  const totalUsuarios = usuarios.length
  const emAndamento = porStatus.em_analise + porStatus.encaminhada

  const valorUsuarios = carregando ? '…' : erroUsuarios ? '—' : totalUsuarios
  const legendaUsuarios =
    carregando || erroUsuarios ? 'Contas cadastradas' : `${admins} admin · ${comuns} comuns`

  return (
    <AdminLayout titulo="Visão geral">
      <main className="max-w-7xl p-6 text-[#12241B] md:p-10">

        {/* CABEÇALHO TERRA VIVA */}
        <header className="relative overflow-hidden rounded-2xl bg-[#21382C] px-7 py-9 text-[#FAF0D4] md:px-10 md:py-11">

          {/* Detalhe decorativo */}
          <div className="absolute right-0 top-0 h-full w-2 bg-[#A71E0C]" />

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A9B9AF]">
            PAINEL / VISÃO GERAL
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Como está a plataforma hoje.
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-[#D1C6A8] md:text-base">
            Um resumo das denúncias recebidas e do andamento de cada caso.
          </p>

          <div className="mt-7 h-1 w-16 rounded-full bg-[#E53935]" />
        </header>

        {erro && (
          <p className="mt-6 text-sm text-[#A71E0C]">{erro}</p>
        )}

        {/* INDICADORES */}
        <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            titulo="Total de denúncias"
            valor={carregando ? '…' : total}
            legenda="Em aberto"
            corBorda="border-[#12241B]"
          />

          <StatCard
            titulo="Recebidas"
            valor={carregando ? '…' : porStatus.recebida}
            legenda="Aguardando triagem"
            corBorda="border-[#687C51]"
          />

          <StatCard
            titulo="Em andamento"
            valor={carregando ? '…' : emAndamento}
            legenda="Análise e encaminhadas"
            corBorda="border-[#A71E0C]"
          />

          <StatCard
            titulo="Concluídas"
            valor={carregando ? '…' : porStatus.concluida}
            legenda="Finalizadas"
            corBorda="border-[#287044]"
          />

          <StatCard
            titulo="Usuários"
            valor={valorUsuarios}
            legenda={legendaUsuarios}
            corBorda="border-[#C49A32]"
          />
        </section>

        {/* GRÁFICOS */}
        <section className="mt-12">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-[#A71E0C]" />
            <h2 className="text-2xl font-bold text-[#12241B]">
              Últimos {DIAS} dias
            </h2>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <GraficoRelatosPorDia dias={dias} />
            </div>

            <div className="lg:col-span-2">
              <GraficoPorTipo itens={porTipo} />
            </div>
          </div>
        </section>

        {/* DENÚNCIAS RECENTES E ANDAMENTO */}
        <section className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-5">

          <div className="rounded-xl border border-[#D1C6A8]/60 bg-white p-6 shadow-sm lg:col-span-3">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-bold text-[#12241B]">
                Últimas denúncias
              </h3>

              <Link
                to="/dashboard/denuncias"
                className="inline-flex items-center gap-1 text-sm font-bold text-[#287044] hover:underline"
              >
                Ver todas <ArrowRight size={14} />
              </Link>
            </div>

            {carregando ? (
              <p className="mt-6 text-sm text-[#58695D]">
                Carregando...
              </p>
            ) : recentes.length === 0 ? (
              <p className="mt-6 text-sm text-[#58695D]">
                Nenhuma denúncia recebida ainda.
              </p>
            ) : (
              <ul className="mt-5 divide-y divide-[#E8E5DC]">
                {recentes.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#12241B]">
                        {d.titulo}
                      </p>

                      <p className="mt-1 text-xs text-[#58695D]">
                        <span className="font-mono">{d.protocolo}</span>
                        {' · '}
                        {d.municipio}
                        {' · '}
                        {formatarData(d.data_ocorrido)}
                      </p>
                    </div>

                    <StatusBadge status={d.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-[#D1C6A8]/60 bg-white p-6 shadow-sm lg:col-span-2">
            <h3 className="text-lg font-bold text-[#12241B]">
              Andamento dos casos
            </h3>

            <ul className="mt-6 space-y-5">
              {ORDEM_STATUS.map((s) => (
                <li key={s}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#58695D]">
                      {STATUS_DENUNCIA[s]}
                    </span>

                    <span className="font-bold text-[#12241B]">
                      {porStatus[s]}
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E8E5DC]">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: total
                          ? `${(porStatus[s] / total) * 100}%`
                          : '0%',
                        backgroundColor: COR_BARRA[s],
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* USUÁRIOS */}
        <section className="mt-12">

          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-[#A71E0C]" />
            <h2 className="text-2xl font-bold text-[#12241B]">
              Usuários
            </h2>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-5">

            {/* CADASTROS RECENTES */}
            <div className="rounded-xl border border-[#D1C6A8]/60 bg-white p-6 shadow-sm lg:col-span-3">
              <h3 className="text-lg font-bold text-[#12241B]">
                Cadastros mais recentes
              </h3>

              {carregando ? (
                <p className="mt-6 text-sm text-[#58695D]">
                  Carregando...
                </p>
              ) : erroUsuarios ? (
                <p className="mt-6 text-sm text-[#A71E0C]">
                  Não foi possível carregar os usuários.
                </p>
              ) : ultimosUsuarios.length === 0 ? (
                <p className="mt-6 text-sm text-[#58695D]">
                  Nenhum usuário cadastrado.
                </p>
              ) : (
                <ul className="mt-5 divide-y divide-[#E8E5DC]">
                  {ultimosUsuarios.map((u) => (
                    <li
                      key={u.id}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E5EDDF] text-sm font-bold text-[#287044]">
                          {u.name.charAt(0).toUpperCase()}
                        </span>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[#12241B]">
                            {u.name}
                          </p>

                          <p className="mt-1 truncate text-xs text-[#58695D]">
                            {u.email}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-md px-3 py-1 text-xs font-bold ${
                          u.role === 'admin'
                            ? 'bg-[#F7EAC7] text-[#795A12]'
                            : 'bg-[#E5EDDF] text-[#287044]'
                        }`}
                      >
                        {u.role === 'admin' ? 'Admin' : 'Usuário'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* TIPOS DE CONTA */}
            <div className="rounded-xl border border-[#D1C6A8]/60 bg-white p-6 shadow-sm lg:col-span-2">
              <h3 className="text-lg font-bold text-[#12241B]">
                Tipos de conta
              </h3>

              {erroUsuarios ? (
                <p className="mt-6 text-sm text-[#A71E0C]">
                  Não foi possível carregar os usuários.
                </p>
              ) : (
                <ul className="mt-6 space-y-5">
                  {[
                    {
                      rotulo: 'Administradores',
                      valor: admins,
                      cor: '#C49A32',
                    },
                    {
                      rotulo: 'Usuários comuns',
                      valor: comuns,
                      cor: '#287044',
                    },
                  ].map((t) => (
                    <li key={t.rotulo}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#58695D]">
                          {t.rotulo}
                        </span>

                        <span className="font-bold text-[#12241B]">
                          {carregando ? '…' : t.valor}
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E8E5DC]">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: totalUsuarios
                              ? `${(t.valor / totalUsuarios) * 100}%`
                              : '0%',
                            backgroundColor: t.cor,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </main>
    </AdminLayout>
  )
}

export default Dashboard