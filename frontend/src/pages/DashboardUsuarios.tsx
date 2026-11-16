import { useState } from 'react'
import { ArrowLeft, ArrowRight, Search } from 'lucide-react'

import AdminLayout from '../components/layout/AdminLayout'
import StatCard from '../components/ui/StatCard'
import UsuariosTabela from '../components/ui/UsuariosTabela'
import ConfirmarExclusaoModal from '../components/ui/ConfirmarExclusaoModal'
import { getSession, type UsuarioLista } from '../services/authService'
import { useUsuarios } from '../hooks/useUsuarios'
import { useFiltroUsuarios } from '../hooks/useFiltroUsuarios'
import { usePaginacao } from '../hooks/usePaginacao'
import { msgErro } from '../utils/erros'

const POR_PAGINA = 5

const selectCls =
  'p-2.5 text-sm rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700'

const DashboardUsuarios = () => {
  const logado = getSession()

  const { usuarios, carregando, erro, excluir } = useUsuarios()
  const { busca, setBusca, filtroRole, setFiltroRole, totais, filtrados } = useFiltroUsuarios(usuarios)
  const { setPagina, paginaAtual, totalPaginas, inicio, visiveis } = usePaginacao(filtrados, POR_PAGINA)

  const [alvo, setAlvo] = useState<UsuarioLista | null>(null)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState<string | null>(null)

  async function confirmarExclusao() {
    if (!alvo) return
    setExcluindo(true)
    setErroExclusao(null)
    try {
      await excluir(alvo.id)
      setAlvo(null)
    } catch (e) {
      console.error(e)
      setErroExclusao(msgErro(e))
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <AdminLayout titulo="Gestão de usuários" valor={carregando ? undefined : totais.total}>
        <main className="max-w-6xl p-6 md:p-10">
          <p className="text-xs font-bold tracking-wide text-green-800">PAINEL / USUÁRIOS</p>
          <h1 className="mt-2 text-4xl font-bold">Quem faz parte da plataforma.</h1>
          <p className="mt-2 text-sm text-gray-600">
            Consulte as contas cadastradas e remova as que não devem mais ter acesso.
          </p>

          {/* Resumo */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              titulo="Total de usuários"
              valor={totais.total}
              legenda="Todas as contas"
              corBorda="border-green-800"
            />
            <StatCard
              titulo="Administradores"
              valor={totais.admins}
              legenda="Acesso ao painel"
              corBorda="border-yellow-600"
            />
            <StatCard
              titulo="Usuários comuns"
              valor={totais.comuns}
              legenda="Acesso padrão"
              corBorda="border-red-700"
            />
          </div>

          {/* Lista */}
          <h2 className="mt-10 text-2xl font-bold">Lista de usuários</h2>
          <p className="mt-1 text-sm text-gray-600">{filtrados.length} registros encontrados</p>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value)
                  setPagina(1)
                }}
                placeholder="Buscar por nome ou e-mail"
                className={`${selectCls} w-full pl-9`}
              />
            </div>
            <select
              value={filtroRole}
              onChange={(e) => {
                setFiltroRole(e.target.value as 'todos' | 'admin' | 'user')
                setPagina(1)
              }}
              className={selectCls}
            >
              <option value="todos">Todos os tipos</option>
              <option value="admin">Admin</option>
              <option value="user">Usuário</option>
            </select>
          </div>

          <div className="mt-4">
            {carregando ? (
              <p className="p-6 text-sm text-gray-500">Carregando usuários...</p>
            ) : erro ? (
              <p className="p-6 text-sm text-red-600">{erro}</p>
            ) : (
              <UsuariosTabela usuarios={visiveis} idLogado={logado?.id} onExcluir={setAlvo} />
            )}
          </div>

          {!carregando && !erro && (
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>
                {filtrados.length === 0
                  ? 'Nenhum registro'
                  : `Exibindo ${inicio + 1}–${inicio + visiveis.length} de ${filtrados.length} usuários`}
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
                <span className="px-3 py-1 text-white bg-green-800 rounded font-bold">
                  {paginaAtual}
                </span>
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

      {alvo && (
        <ConfirmarExclusaoModal
          usuario={alvo}
          excluindo={excluindo}
          erro={erroExclusao}
          onConfirmar={confirmarExclusao}
          onCancelar={() => {
            setAlvo(null)
            setErroExclusao(null)
          }}
        />
      )}
    </AdminLayout>
  )
}

export default DashboardUsuarios