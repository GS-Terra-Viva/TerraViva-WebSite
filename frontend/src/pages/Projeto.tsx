import { Layers, Code2, Zap, Palette, Route, Database, Map, Shapes, Type } from "lucide-react"
import type { ComponentType } from "react"
import NavBar from "../components/ui/NavBar"
import Footer from "../components/ui/Footer"
import { Link } from "react-router-dom"
import floresta from "../assets/pages/home/floresta.png"

type Tech = {
  n: string
  nome: string
  pacote: string
  descricao: string
  Icone: ComponentType<{ size?: number; className?: string }>
}

const stack: Tech[] = [
  { n: "01", nome: "React", pacote: "react ^19.3 · react-dom", descricao: "Componentes funcionais e hooks customizados (useAuth, useNovaDenuncia, useMapaDenuncias).", Icone: Layers },
  { n: "02", nome: "TypeScript", pacote: "typescript ^6.0", descricao: "Todo o código em .ts e .tsx, com configs separadas para app e Node.", Icone: Code2 },
  { n: "03", nome: "Vite", pacote: "vite ^8.3", descricao: "Dev server e bundler, com plugin-react e o plugin oficial do Tailwind.", Icone: Zap },
  { n: "04", nome: "Tailwind CSS", pacote: "tailwindcss ^4.3", descricao: "Versão 4 via @tailwindcss/vite, importada com @import \"tailwindcss\".", Icone: Palette },
  { n: "05", nome: "React Router", pacote: "react-router-dom ^7.18", descricao: "Navegação SPA com rotas públicas, privadas e página 404.", Icone: Route },
  { n: "06", nome: "Supabase", pacote: "@supabase/supabase-js ^2.119", descricao: "Cliente em services/supabase.ts para autenticação, denúncias e usuários.", Icone: Database },
  { n: "07", nome: "Leaflet", pacote: "leaflet ^1.9", descricao: "Seleção do ponto da ocorrência e visualização das denúncias no mapa.", Icone: Map },
  { n: "08", nome: "Lucide React", pacote: "lucide-react ^1.69", descricao: "Ícones usados em navegação, cards, modais e tabelas.", Icone: Shapes },
  { n: "09", nome: "Google Fonts", pacote: "League Spartan 900", descricao: "Fonte da marca Terra Viva; demais textos em sans-serif.", Icone: Type },
]

const fluxo = [
  { titulo: "Pages", texto: "Home, NovaDenuncia, Dashboard…" },
  { titulo: "Hooks", texto: "Estado, filtros, paginação e mapa" },
  { titulo: "Services", texto: "authService, denuncias, denunciasPublicas" },
  { titulo: "Supabase", texto: "Auth e banco de dados" },
]

const rotas = [
  { rota: "/", pagina: "Home", acesso: "Público" },
  { rota: "/login · /register", pagina: "Login e cadastro", acesso: "Público" },
  { rota: "/denuncias", pagina: "Denúncias públicas", acesso: "Público" },
  { rota: "/como-funciona", pagina: "Como funciona", acesso: "Público" },
  { rota: "Nova denúncia, minhas denúncias, acompanhar", pagina: "Área do usuário", acesso: "user · admin" },
  { rota: "Dashboard, denúncias, usuários", pagina: "Painel administrativo", acesso: "admin" },
  { rota: "*", pagina: "Erro 404", acesso: "Público" },
]

const scripts = [
  { cmd: "npm install", desc: "instalar dependências" },
  { cmd: "npm run dev", desc: "ambiente de desenvolvimento" },
  { cmd: "npm run build", desc: "tsc -b && vite build" },
  { cmd: "npm run lint", desc: "análise estática com ESLint" },
  { cmd: "npm run preview", desc: "pré-visualizar o build" },
]

const badge: Record<string, string> = {
  "Público": "bg-[#f29c1f]/20 text-[#f29c1f]",
  "user · admin": "bg-[#c98b45]/25 text-[#e6b57a]",
  admin: "bg-[#e8442f]/25 text-[#ff8c7a]",
}

export default function Projeto() {
  return (
    <div className="min-h-screen bg-[#0a1510] text-[#f3e9d8]">
      <NavBar />

      <header className="bg-gradient-to-b from-[#0a1510] to-[#12231c] px-6 pt-40 pb-14">
        <div className="mx-auto max-w-6xl">
        <div className="flex justify-between">
            <nav aria-label="Você está em" className="text-sm text-[#d7dccf]">
                      <Link to="/" className="hover:underline">
                        Início
                      </Link>{' '}
                      / <span>Sobre</span>
                    </nav>
                    <a href="https://github.com/GS-Terra-Viva"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
            </svg></a>
        </div>
          <h1 className="mt-8 mb-5 text-6xl font-black uppercase leading-[.9] tracking-[-0.04em] text-[#FAF0D4] md:text-8xl" style={{ fontFamily: "'League Spartan', sans-serif" }}>
            Tecnologias<br />do <span className="text-[#e8442f]">projeto</span>
          </h1>
          <div className="flex items-center">
              <p className="max-w-xl text-lg text-[#9fb0a6]">
                A stack que sustenta a plataforma de denúncias Terra Viva: do build à autenticação, do mapa de São Paulo ao painel administrativo.
              </p>
          </div>
          <div className="mt-10 flex h-1">
            <i className="flex-1 bg-[#c0392b]" /><i className="flex-1 bg-[#c98b45]" /><i className="flex-1 bg-[#c0392b]" />
          </div>
        </div>
      </header>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-[#f29c1f]">Stack em resumo.</h2>
          <p className="mt-1 mb-8 text-xs uppercase tracking-[.12em] text-[#9fb0a6]">Extraído do package.json</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stack.map(({ n, nome, pacote, descricao, Icone }) => (
              <article key={n} className="rounded-lg border border-white/10 bg-[#2f5043] p-5">
                <div className="flex items-center justify-between text-xs font-semibold opacity-80">
                  <span>{n}</span>
                  <Icone size={18} />
                </div>
                <h3 className="mt-6 mb-1.5 text-xl font-semibold">{nome}</h3>
                <p className="text-sm text-[#b9c9bf]">{descricao}</p>
                <span className="mt-3.5 inline-block rounded-full bg-black/30 px-2.5 py-0.5 text-xs font-semibold text-[#f29c1f]">{pacote}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#12231c] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-[#f29c1f]">Como as peças se conectam.</h2>
          <p className="mt-1 mb-8 text-xs uppercase tracking-[.12em] text-[#9fb0a6]">Fluxo de uma denúncia</p>
          <div className="flex flex-col items-stretch gap-3 md:flex-row">
            {fluxo.map((f, i) => (
              <div key={f.titulo} className="flex flex-1 items-center gap-3">
                <div className="flex-1 self-stretch rounded-lg border border-white/10 bg-black/30 p-4">
                  <b className="block">{f.titulo}</b>
                  <span className="text-sm text-[#9fb0a6]">{f.texto}</span>
                </div>
                {i < fluxo.length - 1 && <span className="hidden text-2xl text-[#c98b45] md:block">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-[#f29c1f]">Rotas e acesso.</h2>
          <p className="mt-1 mb-8 text-xs uppercase tracking-[.12em] text-[#9fb0a6]">Definidas em App.tsx · protegidas por PrivateRoute</p>
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-black/25 text-[11px] uppercase tracking-widest text-[#c98b45]">
                <tr><th className="p-3">Rota</th><th className="p-3">Página</th><th className="p-3">Acesso</th></tr>
              </thead>
              <tbody>
                {rotas.map((r) => (
                  <tr key={r.rota} className="border-t border-white/10">
                    <td className="p-3 font-mono text-[13px] text-[#f29c1f]">{r.rota}</td>
                    <td className="p-3">{r.pagina}</td>
                    <td className="p-3"><span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${badge[r.acesso]}`}>{r.acesso}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#6e130b] px-6 py-16">
        {/* imagem de fundo */}
        <img
          src={floresta}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* camada vermelha com opacidade */}
        <div className="absolute inset-0 bg-[#6e130b]/85 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[#6e130b]/60" />

        <div className="relative mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-[#c98b45]">Qualidade de código</p>
            <h2 className="mt-2 mb-3 text-3xl font-bold text-[#f29c1f]">Ferramentas de apoio.</h2>
            <p className="text-[#e9c9bd]">ESLint 10 com typescript-eslint e plugins de hooks e React Refresh.</p>
          </div>
          <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black/35 p-5 text-[13px] leading-7">
            {scripts.map((s) => (
              <div key={s.cmd}>
                <span className="text-[#9fb0a6]"># {s.desc}</span>{"\n"}{s.cmd}{"\n"}
              </div>
            ))}
          </pre>
        </div>
      </section>

      <section className="bg-[#12231c] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-[#f29c1f]">Configuração do ambiente.</h2>
          <p className="mt-1 mb-6 text-xs uppercase tracking-[.12em] text-[#9fb0a6]">Arquivo .env na pasta frontend</p>
          <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black/35 p-5 text-[13px] leading-7">
{`VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica`}
          </pre>
          <p className="mt-6 border-l-[3px] border-[#e8442f] pl-4 text-sm text-[#9fb0a6]">
            Use apenas a chave pública no frontend e nunca versione chaves secretas.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}