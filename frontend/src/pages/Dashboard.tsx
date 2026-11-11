import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Search } from 'lucide-react'

import AdminSidebar from '../components/layout/AdminSidebar'
import StatCard from '../components/ui/StatCard'
import UsuariosTabela from '../components/ui/UsuariosTabela'
import ConfirmarExclusaoModal from '../components/ui/ConfirmarExclusaoModal'
import {
  excluirUsuario,
  getSession,
  listarUsuarios,
  type UsuarioLista,
} from '../services/authService'

const POR_PAGINA = 5

const msgErro = (e: unknown) => {
  const m =
    typeof e === 'object' && e !== null && 'message' in e
      ? String((e as { message: unknown }).message)
      : String(e)
  if (m.includes('sessao_invalida')) return 'Sua sessão expirou. Entre novamente.'
  if (m.includes('nao_pode_excluir_a_si_mesmo')) return 'Você não pode excluir a si mesmo.'
  if (m.includes('violates foreign key')) {
    return 'Este usuário possui registros vinculados (ex.: denúncias) e não pode ser excluído.'
  }
  return m
}

const selectCls =
  'p-2.5 text-sm rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700'

const Dashboard = () => {
  const logado = getSession()

  const [usuarios, setUsuarios] = useState<UsuarioLista[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const [busca, setBusca] = useState('')
  const [filtroRole, setFiltroRole] = useState<'todos' | 'admin' | 'user'>('todos')
  const [pagina, setPagina] = useState(1)

  const [alvo, setAlvo] = useState<UsuarioLista | null>(null)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState<string | null>(null)

  useEffect(() => {
    listarUsuarios()
      .then(setUsuarios)
      .catch((e) => {
        console.error(e)
        setErro(msgErro(e))
      })
      .finally(() => setCarregando(false))
  }, [])

  const totais = useMemo(
    () => ({
      total: usuarios.length,
      admins: usuarios.filter((u) => u.role === 'admin').length,
      comuns: usuarios.filter((u) => u.role === 'user').length,
    }),
    [usuarios],
  )

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return usuarios.filter(
      (u) =>
        (filtroRole === 'todos' || u.role === filtroRole) &&
        (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)),
    )
  }, [usuarios, busca, filtroRole])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const inicio = (paginaAtual - 1) * POR_PAGINA
  const visiveis = filtrados.slice(inicio, inicio + POR_PAGINA)

  async function confirmarExclusao() {
    if (!alvo) return
    setExcluindo(true)
    setErroExclusao(null)
    try {
      await excluirUsuario(alvo.id)
      setUsuarios((lista) => lista.filter((u) => u.id !== alvo.id))
      setAlvo(null)
    } catch (e) {
      console.error(e)
      setErroExclusao(msgErro(e))
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#f4f3ee] text-gray-900">
      <AdminSidebar />

      <div className="flex-1 min-w-0">
        <header className="px-6 md:px-10 py-5 bg-white border-b border-gray-200">
          <h2 className="text-lg font-semibold">Gestão de usuários</h2>
        </header>

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
      </div>

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
    </div>
  )
}

export default Dashboard