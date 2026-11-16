import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'

import Navbar from '../components/ui/NavBar'
import { TIPOS_OCORRENCIA, type TipoOcorrencia } from '../services/denuncias'
import {
  ETAPAS,
  buscarDenunciaPorProtocolo,
  fmtDataIso,
  fmtRecebida,
  identificarEtapa,
  type DenunciaPublica,
  type EtapaId,
} from '../services/denunciasPublicas'

type Estado =
  | { tipo: 'carregando' }
  | { tipo: 'erro' }
  | { tipo: 'naoEncontrada' }
  | { tipo: 'ok'; denuncia: DenunciaPublica }

const COR_ETAPA: Record<EtapaId, string> = {
  recebida: 'bg-red-100 text-red-700',
  em_analise: 'bg-amber-100 text-amber-800',
  encaminhada: 'bg-slate-200 text-slate-700',
  concluida: 'bg-green-100 text-green-800',
}

const rotuloTipo = (tipo: string) =>
  Object.hasOwn(TIPOS_OCORRENCIA, tipo) ? TIPOS_OCORRENCIA[tipo as TipoOcorrencia] : tipo || '—'

function Campo({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <dt className="text-xs font-bold text-gray-500 uppercase">{rotulo}</dt>
      <dd className="mt-1 text-sm text-gray-900 break-words">{valor || '—'}</dd>
    </div>
  )
}

const AcompanharDenuncia = () => {
  const { protocolo = '' } = useParams()

  // Guarda de qual protocolo é o resultado, para não mostrar dados antigos ao trocar de protocolo
  const [resultado, setResultado] = useState<{ para: string; estado: Estado } | null>(null)

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

  const estado: Estado =
    resultado && resultado.para === protocolo ? resultado.estado : { tipo: 'carregando' }

  return (
    <div className="min-h-screen bg-[#f6f7f0] text-gray-900">
      <div className="relative z-20 border-b border-gray-200 bg-white">
        <Navbar />
      </div>

      <div className="max-w-6xl mx-auto px-4 my-20 md:p-8">
      <nav aria-label="Você está em" className="text-sm text-[#2c674b] mb-5">
                  <Link to="/" className="hover:underline">
                    Início
                  </Link>{' '}/{' '}
                  <Link to="/minhas-denuncias" className="hover:underline">
                    Minhas Denúncias
                  </Link>{' '}
                  / <span>{protocolo}</span>
                </nav>
        <h1 className="mt-2 text-4xl font-bold">Andamento da denúncia.</h1>

        <Link
          to="/minhas-denuncias"
          className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-green-800 hover:underline"
        >
          <ArrowLeft size={14} />
          Consultar outro protocolo
        </Link>

        {estado.tipo === 'carregando' && (
          <p className="mt-6 text-sm text-gray-500">Consultando protocolo...</p>
        )}

        {estado.tipo === 'erro' && (
          <p className="mt-6 text-sm text-red-600">
            Não foi possível consultar agora. Tente novamente em instantes.
          </p>
        )}

        {estado.tipo === 'naoEncontrada' && (
          <section className="mt-6 max-w-xl p-6 bg-white border border-gray-200 rounded-lg space-y-2">
            <h2 className="text-xl font-bold">Protocolo não encontrado</h2>
            <p className="text-sm text-gray-600">
              Não encontramos uma denúncia com o protocolo{' '}
              <span className="font-mono font-bold">{protocolo}</span>. Confira o código e tente
              novamente.
            </p>
          </section>
        )}

        {estado.tipo === 'ok' && <Detalhe denuncia={estado.denuncia} />}
      </div>
    </div>
  )
}

function Detalhe({ denuncia: d }: { denuncia: DenunciaPublica }) {
  const etapa = identificarEtapa(d.status)
  const indice = etapa ? ETAPAS.findIndex((e) => e.id === etapa) : -1
  const info = etapa ? ETAPAS[indice] : null

  // Uma mensagem por etapa, na ordem do processo (a conclusão nunca substitui o encaminhamento)
  const mensagens = [
    { id: 'encaminhada', titulo: 'Encaminhamento', texto: d.mensagemEncaminhamento },
    { id: 'concluida', titulo: 'Conclusão', texto: d.mensagemConclusao },
  ].filter((m): m is { id: string; titulo: string; texto: string } => !!m.texto?.trim())

    console.log(d)

  return (
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
      {/* ---------------------------- Status ---------------------------- */}
      <section className="p-6 bg-white border border-gray-200 rounded-lg">
        <p className="text-xs font-bold tracking-wide text-gray-500">PROTOCOLO</p>
        <p className="mt-1 text-2xl font-mono font-bold break-all">{d.protocolo}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span
            className={`px-3 py-1 text-sm font-bold rounded ${
              etapa ? COR_ETAPA[etapa] : 'bg-gray-100 text-gray-700'
            }`}
          >
            {info ? info.label : d.status || 'Sem status'}
          </span>
          {info && <p className="text-sm text-gray-600">{info.descricao}</p>}
        </div>

        {etapa && (
          <div className="relative mt-8">
            {/* trilha entre as etapas */}
            <div className="absolute left-[12.5%] right-[12.5%] top-4 h-0.5 bg-gray-200">
              <div
                className="h-full bg-green-800"
                style={{ width: `${(indice / (ETAPAS.length - 1)) * 100}%` }}
              />
            </div>

            <ol className="relative grid grid-cols-4">
              {ETAPAS.map((e, i) => {
                const feita = i < indice
                const atual = i === indice
                return (
                  <li key={e.id} className="flex flex-col items-center text-center">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                        feita || atual ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-500'
                      } ${atual ? 'ring-4 ring-green-200' : ''}`}
                    >
                      {feita ? <Check size={16} /> : i + 1}
                    </span>
                    <span
                      className={`mt-2 text-xs ${atual ? 'font-bold text-gray-900' : 'text-gray-500'}`}
                    >
                      {e.label}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>
        )}

        {mensagens.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-bold">Informações sobre o andamento</h2>
            {mensagens.map((m) => (
              <div
                key={m.id}
                className="p-4 border-l-4 border-green-800 rounded bg-[#f4f3ee]"
              >
                <p className="text-xs font-bold tracking-wide text-gray-500 uppercase">
                  {m.titulo}
                </p>
                <p className="mt-2 text-sm text-gray-900 whitespace-pre-wrap break-words">
                  {m.texto}
                </p>
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-xs text-gray-500">
          A equipe analisa as informações antes de atualizar o status da denúncia.
        </p>
      </section>

      {/* ---------------------------- Resumo ---------------------------- */}
      <section className="p-6 bg-white border border-gray-200 rounded-lg">
        <h2 className="text-lg font-bold">Resumo do relato</h2>
        <h3 className="mt-2 text-sm font-semibold text-gray-900 break-words">
          {d.titulo || 'Sem título'}
        </h3>

        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo rotulo="Tipo de ocorrência" valor={rotuloTipo(d.tipo)} />
          <Campo rotulo="Município" valor={d.municipio} />
          <Campo rotulo="Terra indígena ou comunidade" valor={d.comunidade} />
          <Campo rotulo="Data do ocorrido" valor={fmtDataIso(d.dataOcorrido)} />
          <Campo rotulo="Recebida em" valor={fmtRecebida(d.recebidaEm)} />
        </dl>
      </section>
    </div>
  )
}

export default AcompanharDenuncia