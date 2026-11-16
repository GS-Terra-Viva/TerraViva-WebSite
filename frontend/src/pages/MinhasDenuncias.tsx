import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Search } from 'lucide-react'

import Navbar from '../components/ui/NavBar'
import { buscarDenunciaPorProtocolo, normalizarProtocolo } from '../services/denunciasPublicas'

const MAX_PROTOCOLO = 40

const MinhasDenuncias = () => {
  const navigate = useNavigate()

  const [protocolo, setProtocolo] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function consultar(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    setErro(null)

    const p = normalizarProtocolo(protocolo)
    if (!p) {
      setErro('Digite o protocolo da denúncia.')
      return
    }
    if (p.length > MAX_PROTOCOLO) {
      setErro('Protocolo inválido. Confira o código e tente novamente.')
      return
    }

    setBuscando(true)
    try {
      const denuncia = await buscarDenunciaPorProtocolo(p)

      if (!denuncia) {
        setErro('Protocolo não encontrado. Confira o código e tente novamente.')
        return
      }

      // Protocolo válido -> tela de acompanhamento
      navigate(`/minhas-denuncias/${encodeURIComponent(denuncia.protocolo)}`)
    } catch (e) {
      console.error(e)
      setErro('Não foi possível consultar agora. Tente novamente em instantes.')
    } finally {
      setBuscando(false)
    }
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
                  / <span>Minhas Denúncias</span>
                </nav>
        <h1 className="mt-2 text-4xl font-bold">Acompanhe a sua denúncia.</h1>
        <p className="mt-2 text-sm text-gray-600">
          Informe o protocolo recebido ao enviar o relato para ver em que etapa ele está.
        </p>

        <section className="mt-6 max-w-xl p-6 bg-white rounded-lg">
          <form onSubmit={consultar} noValidate className="space-y-4">
            <div>
              <label htmlFor="protocolo" className="block text-xs font-bold text-gray-700 mb-1">
                Protocolo *
              </label>

              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="protocolo"
                  type="text"
                  value={protocolo}
                  onChange={(e) => {
                    setProtocolo(e.target.value)
                    setErro(null)
                  }}
                  disabled={buscando}
                  maxLength={MAX_PROTOCOLO}
                  placeholder="Cole ou digite o protocolo"
                  autoComplete="off"
                  spellCheck={false}
                  autoFocus
                  aria-invalid={erro ? true : undefined}
                  aria-describedby={erro ? 'protocolo-erro' : undefined}
                  className="w-full pl-9 p-2.5 text-sm font-mono uppercase placeholder:normal-case placeholder:font-sans rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              {erro && (
                <p id="protocolo-erro" role="alert" className="mt-1 text-xs text-red-600">
                  {erro}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={buscando}
              className="flex items-center gap-2 px-6 py-2.5 rounded bg-green-800 hover:bg-green-900 text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {buscando ? 'Consultando...' : 'Consultar andamento'}
              {!buscando && <ArrowRight size={16} />}
            </button>
          </form>
        </section>

        <p className="mt-4 max-w-xl text-xs text-gray-500">
          O protocolo é exibido na tela de confirmação logo depois que a denúncia é enviada.
          Ainda não registrou um relato?{' '}
          <Link to="/nova-denuncia" className="font-bold text-green-800 underline">
            Fazer uma denúncia
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

export default MinhasDenuncias
