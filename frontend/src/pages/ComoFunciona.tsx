
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Axe,
  BriefcaseMedical,
  Check,
  Droplet,
  Ellipsis,
  FileText,
  MapPin,
  Pickaxe,
  Search,
  Trees,
  TriangleAlert,
} from 'lucide-react'

import Navbar from '../components/ui/NavBar'
import Footer from '../components/ui/Footer'
import Tribo from '../assets/pages/como-funciona/01-comunidade-indigena.png'
import Mapa from '../assets/pages/como-funciona/02-mapa-localizacao.png'
import Paisagem from '../assets/pages/como-funciona/03-rio-e-floresta-aerea.png'
import Seguranca from '../assets/pages/como-funciona/04-maos-com-celular-e-mapa.png'
import Paisagem2 from '../assets/pages/como-funciona/05-rio-ao-entardecer.png'

const ComoFunciona = () => { 
  const [ativa, setAtiva] = useState('o-que-denunciar')

  const secoes = [
    { id: 'o-que-denunciar', label: 'O que pode ser denunciado' },
    { id: 'como-registrar', label: 'Como registrar' },
    { id: 'depois-do-envio', label: 'O que acontece depois' },
    { id: 'protecao-de-dados', label: 'Proteção de dados' },
    { id: 'acompanhamento', label: 'Acompanhamento' },
  ]

  const tipos = [
    { label: 'Invasão de território', icon: Trees },
    { label: 'Desmatamento', icon: Axe },
    { label: 'Exploração ilegal', icon: Pickaxe },
    { label: 'Violência', icon: TriangleAlert },
    { label: 'Conflito fundiário', icon: MapPin },
    { label: 'Contaminação', icon: Droplet },
    { label: 'Dificuldade de acesso a serviços', icon: BriefcaseMedical },
    { label: 'Outro', icon: Ellipsis },
  ]

  const passos = [
    {
      titulo: 'Criar uma conta',
      texto: 'Faça seu cadastro na plataforma para registrar a denúncia de forma segura.',
    },
    {
      titulo: 'Informar o ocorrido',
      texto: 'Descreva o que aconteceu, incluindo o máximo de detalhes possíveis, como datas, envolvidos e evidências.',
    },
    {
      titulo: 'Indicar o local no mapa',
      texto: 'Mostre no mapa onde o fato ocorreu. A localização ajuda a contextualizar a informação.',
    },
    {
      titulo: 'Receber um protocolo',
      texto: 'Após o envio, você receberá um número de protocolo para acompanhar o andamento do caso.',
    },
  ]

  const etapas = [
    {
      titulo: 'Recebida',
      texto: 'O relato foi registrado.',
      icon: FileText,
      cor: '#d9a85b',
    },
    {
      titulo: 'Em análise',
      texto: 'As informações estão sendo verificadas.',
      icon: Search,
      cor: '#6fae82',
    },
    {
      titulo: 'Encaminhada',
      texto: 'O caso foi direcionado às equipes competentes.',
      icon: ArrowRight,
      cor: '#e07a5f',
    },
    {
      titulo: 'Concluída',
      texto: 'A apuração recebeu uma conclusão ou encaminhamento final.',
      icon: Check,
      cor: '#6fae82',
    },
  ]

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#12261c] pt-18 text-[#d7dccf]">
        <main>

          {/* Hero */}
          <section className="border-b border-[#2b4a3b]">
            <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1fr_320px]">

              <div>
                <nav aria-label="Você está em" className="text-sm text-[#d7dccf]">
                  <Link to="/" className="hover:underline">
                    Início
                  </Link>{' '}
                  / <span>Como funciona</span>
                </nav>

                <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-[#f0e4cf] md:text-6xl">
                  Como funciona o canal de denúncias
                </h1>

                <p className="mt-5 max-w-2xl text-lg text-[#e4e6dc]">
                  Este canal permite registrar informações sobre crimes ambientais e violações que
                  afetam povos, comunidades e territórios indígenas.
                </p>
              </div>

              <aside
                aria-label="Nesta página"
                className="hidden border-l border-[#2b4a3b] pl-8 lg:block"
              >
                <p className="text-xs tracking-wider text-[#9fb3a5]">
                  NESTA PÁGINA
                </p>

                <ul className="mt-4 space-y-4">
                  {secoes.map((secao) => (
                    <li key={secao.id}>
                      <a
                        href={`#${secao.id}`}
                        onClick={() => setAtiva(secao.id)}
                        className="flex items-center gap-3 text-sm text-[#e4e6dc] hover:text-white"
                      >
                        <span
                          aria-hidden="true"
                          className={`h-2 w-2 shrink-0 rounded-full ${ativa === secao.id
                              ? 'bg-[#e2552d]'
                              : 'bg-[#8a9a86]'
                            }`}
                        />
                        {secao.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>

            </div>
          </section>

          {/* O que pode ser denunciado */}
          <section id="o-que-denunciar" className="scroll-mt-20 border-b border-[#2b4a3b]">
  <div className="mx-auto max-w-7xl px-6">
    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">

      <div className="py-10">
        <h2 className="text-3xl font-bold tracking-tight text-[#f0e4cf]">
          O que pode ser denunciado
        </h2>

        <p className="mt-2 text-[#e4e6dc]">
          Você pode registrar informações sobre situações que afetam os povos indígenas e seus
          territórios, como:
        </p>

        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tipos.map(({ label, icon: Icon }) => (
            <li
              key={label}
              className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-md bg-[#1b3a2d] px-3 py-5 text-center text-sm font-semibold text-[#f0e4cf]"
            >
              <Icon
                size={38}
                strokeWidth={1.5}
                className="text-[#d9a85b]"
                aria-hidden="true"
              />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative min-h-64 lg:min-h-full">
        <img
          src={Tribo}
          alt="Comunidade indígena"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

    </div>
  </div>
</section>

          {/* Como registrar */}
          <section id="como-registrar" className="scroll-mt-20 border-b border-[#2b4a3b]">
            <div className="mx-auto max-w-7xl px-6 py-10">
              <div className="grid gap-10 lg:grid-cols-2">

                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-[#f0e4cf]">
                    Como registrar uma denúncia
                  </h2>

                  <p className="mt-2 text-[#e4e6dc]">
                    O processo é simples e pode ser feito em poucos passos:
                  </p>

                  <ol className="mt-6 space-y-6">
                    {passos.map((passo, i) => (
                      <li key={passo.titulo} className="flex gap-4">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#d9a85b] text-lg font-bold text-[#12261c]">
                          {String(i + 1).padStart(2, '0')}
                        </span>

                        <div>
                          <h3 className="text-xl font-semibold text-[#f0e4cf]">
                            {passo.titulo}
                          </h3>

                          <p className="mt-1 text-[#b9c4b8]">
                            {passo.texto}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <figure>
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={Mapa}
                      alt="Mapa ilustrativo de localização"
                      className="h-full w-full object-cover"
                    />

                    <h3 className="absolute left-5 top-4 text-2xl font-bold text-[#f0e4cf]">
                      Localização do ocorrido
                    </h3>

                    <MapPin
                      size={44}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#e2552d]"
                    />

                    <div className="absolute bottom-0 right-0 flex items-center gap-2 rounded-tl-lg border-l border-t border-[#2b4a3b] bg-[#0d1c14] px-4 py-3 text-xs font-semibold text-[#f0e4cf]">
                      <MapPin size={20} className="text-[#e2552d]" aria-hidden="true" />
                      Localização aproximada
                    </div>
                  </div>

                  <figcaption className="mt-2 text-xs text-[#b9c4b8]">
                    A localização ajuda as equipes responsáveis a compreender o contexto do caso.
                  </figcaption>
                </figure>

              </div>
            </div>
          </section>

          {/* Faixa do lema */}
          <section
  aria-label="Lema"
  className="relative overflow-hidden border-b border-[#2b4a3b] bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: `linear-gradient(rgba(18, 38, 28, 0.65), rgba(18, 38, 28, 0.65)), url(${Paisagem})`,
  }}
>
  <div className="mx-auto flex min-h-52 max-w-7xl items-center justify-end px-6 py-12">
    <p className="text-sm font-semibold uppercase leading-7 tracking-[0.3em]">
      <span className="block text-[#8aa392]">Territórios</span>
      <span className="block text-[#8aa392]">Vivos</span>
      <span className="block text-[#d9a85b]">Povos</span>
      <span className="block text-[#d9a85b]">Presentes</span>
    </p>
  </div>
</section>

          {/* O que acontece depois */}
          <section id="depois-do-envio" className="scroll-mt-20 border-b border-[#2b4a3b]">
            <div className="mx-auto max-w-7xl px-6 py-10">

              <h2 className="text-3xl font-bold tracking-tight text-[#f0e4cf]">
                O que acontece depois do envio
              </h2>

              <p className="mt-2 text-[#e4e6dc]">
                Seu relato passa por diferentes etapas até ser concluído.
              </p>

              <div className="relative mt-8">
                <div
                  aria-hidden="true"
                  className="absolute left-[12.5%] right-[12.5%] top-8 hidden border-t border-dashed border-[#d9a85b]/50 md:block"
                />

                <ol className="relative grid grid-cols-2 gap-y-8 md:grid-cols-4">
                  {etapas.map(({ titulo, texto, icon: Icon, cor }) => (
                    <li key={titulo} className="flex flex-col items-center px-4 text-center">
                      <span
                        className="flex h-16 w-16 items-center justify-center rounded-full border-2 bg-[#12261c]"
                        style={{ borderColor: cor, color: cor }}
                      >
                        <Icon size={26} aria-hidden="true" />
                      </span>

                      <h3 className="mt-3 text-xl font-semibold text-[#f0e4cf]">
                        {titulo}
                      </h3>

                      <p className="mt-1 text-sm text-[#b9c4b8]">
                        {texto}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

            </div>
          </section>

          {/* Proteção de dados */}
          <section id="protecao-de-dados" className="scroll-mt-20 border-b border-[#2b4a3b]">
  <div className="mx-auto max-w-7xl px-6 py-10">

    <h2 className="text-3xl font-bold tracking-tight text-[#f0e4cf]">
      Proteção da identidade e dos dados
    </h2>

    <div className="mt-5 grid items-center gap-6 md:grid-cols-[1.5fr_1fr]">

      <img
        src={Seguranca}
        alt="Pessoa utilizando um celular para consultar a localização de uma denúncia"
        className="h-64 w-full rounded-md object-cover"
      />

      <div>
        <p className="text-lg leading-relaxed text-[#f0e4cf]">
          A denúncia publicada não identifica quem relatou. Os dados usados para criar a conta
          ficam restritos ao funcionamento seguro do sistema.
        </p>

        <hr className="my-5 border-[#2b4a3b]" />

        <p className="text-sm text-[#b9c4b8]">
          Relatos públicos são apresentados de forma anônima.
        </p>
      </div>

    </div>
  </div>
</section>

          {/* Acompanhamento */}
          <section id="acompanhamento" className="scroll-mt-20 border-b border-[#2b4a3b]">
            <div className="mx-auto max-w-7xl px-6 py-10">
              <div className="grid items-center gap-8 lg:grid-cols-2">

                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-[#f0e4cf]">
                    Quem pode acompanhar o caso
                  </h2>

                  <p className="mt-3 text-[#e4e6dc]">
                    Você pode acompanhar o andamento da sua denúncia usando o número de protocolo em{' '}
                    <Link to="/minhas-denuncias" className="text-[#d9a85b] hover:underline">
                      Minha denúncia
                    </Link>
                    . Lá é possível ver o status atual e as atualizações do relato.
                  </p>
                </div>

                <dl className="grid grid-cols-1 divide-y divide-[#2b4a3b] rounded-lg bg-[#1b3a2d] p-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  {[
                    { rotulo: 'Protocolo', valor: 'TV-2024-001234' },
                    { rotulo: 'Última atualização', valor: '12/03/2024' },
                    { rotulo: 'Etapa atual', valor: 'Em análise' },
                  ].map((item) => (
                    <div key={item.rotulo} className="py-3 sm:px-5 sm:py-0 sm:first:pl-0 sm:last:pr-0">
                      <dt className="text-xs text-[#9fb3a5]">
                        {item.rotulo}
                      </dt>

                      <dd className="mt-1 font-semibold text-[#f0e4cf]">
                        {item.valor}
                      </dd>
                    </div>
                  ))}
                </dl>

              </div>
            </div>
          </section>

          {/* Transparência */}
          <section className="relative overflow-hidden border-b border-[#2b4a3b]">
  <div className="absolute inset-y-0 right-0 w-3/5">
    <img
      src={Paisagem2}
      alt="Vista aérea de um rio cercado pela floresta"
      className="h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-[#12261c] via-[#12261c]/30 to-transparent" />
  </div>

  <div className="relative mx-auto max-w-7xl px-6 py-10">
    <h2 className="text-3xl font-bold tracking-tight text-[#f0e4cf]">
      Transparência em cada etapa
    </h2>

    <p className="mt-3 max-w-2xl text-[#e4e6dc]">
      Os relatos são analisados e podem ser encaminhados a organizações responsáveis, como
      IBAMA, órgãos públicos, defensorias, Ministério Público e organizações parceiras. Esses
      são exemplos de instituições que podem atuar nos casos, conforme o tema e a localidade.
    </p>
  </div>
</section>

        </main>

        <Footer />
      </div>
    </>
  )
}

export default ComoFunciona
