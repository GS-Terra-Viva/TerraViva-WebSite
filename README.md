<div align="center">
    <h1>
        <picture>
        <img src="./frontend/src/assets/pages/home/Logotipo Terra Viva.png" alt="Logo do Terra Viva" width="320">
        </picture><br>
    </h1>
    <p><em>Pelos territórios. Pelos direitos. Pela vida.</em></p>
</div>

<div align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white">
    <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white">
    <img src="https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white">
</div>

## 📖 Sobre o Projeto

O **Terra Viva** é uma plataforma web para **registro e acompanhamento de denúncias** de violações aos territórios e aos direitos dos povos indígenas, como invasões, desmatamento, queimadas, contaminação e conflitos fundiários. O ponto de partida é o estado de **São Paulo**, e a proposta é ampliar a defesa para todos os territórios.

A pessoa localiza a ocorrência no mapa, descreve o que aconteceu e recebe um **protocolo** para acompanhar o andamento. A equipe responsável analisa cada relato por um painel administrativo, que mostra estatísticas, gráficos e permite alterar o status da denúncia.

A plataforma tem cuidado com a segurança de quem relata: a localização exata **não aparece em lista pública** (as coordenadas são arredondadas) e o formulário orienta a registrar apenas o que for possível com segurança.

> Projeto acadêmico. O código-fonte do frontend está na pasta `frontend/` e a estrutura do banco de dados na pasta `backend/`.

## 🌐 Links

| Item | Link |
|------|------|
| Deploy (Vercel) | [Terra Viva](https://terra-viva-web-site.vercel.app/) |
| Repositório (GitHub) | [Terra Viva](https://github.com/GS-Terra-Viva/TerraViva-WebSite) |
| Wireframe (Figma) | [Terra Viva](https://www.figma.com/design/1W4Yn6NcyE4U3OsfXjuoc5/TERRA-VIVA?node-id=0-1&t=OiL68bkxyJPkbeuI-1) |

## ✨ Funcionalidades

**Público (sem login)**
- Página inicial (Home) com apresentação do projeto e chamada para denunciar
- Página **Como funciona** e página **Sobre** (tecnologias do projeto)
- Mapa público de denúncias, com coordenadas arredondadas para proteger o local exato
- Filtros nas denúncias públicas

**Usuário logado**
- Cadastro e login
- **Nova denúncia**: tipo de ocorrência, data, título, comunidade, descrição, município e ponto no mapa
- Lista de municípios de São Paulo carregada da API do IBGE
- **Minhas denúncias** e acompanhamento por protocolo, com as etapas do andamento e as mensagens da equipe
- Cópia do protocolo com um clique

**Administrador**
- Dashboard com estatísticas e gráficos (denúncias por status, por dia e por tipo)
- Gerenciamento de denúncias: filtros, paginação, alteração de status com mensagem, arquivamento e exportação em **CSV**
- Gerenciamento de usuários: listagem, filtros, paginação e exclusão

**Geral**
- Layout responsivo e identidade visual própria
- Página de erro 404

## 🛠️ Tecnologias Utilizadas

**Frontend:** React 19, TypeScript, Vite, React Router DOM, Tailwind CSS 4, Lucide React, Leaflet, React Hooks, Custom Hooks, LocalStorage

**Backend / Banco de dados:** Supabase (PostgreSQL), funções SQL chamadas por RPC, Row Level Security (RLS)

**APIs externas:**
- API de localidades do **IBGE** (lista de municípios de SP)
- **Nominatim / OpenStreetMap** (centro aproximado do município)
- **OpenStreetMap** (camada de mapa do Leaflet)

**Qualidade de código:** ESLint com `typescript-eslint`

**Fontes:** League Spartan (marca) via Google Fonts

## 🏗️ Estrutura do Projeto

```bash
TerraViva-WebSite/
├── README.md
├── .gitignore
│
backend/                   <-- scripts SQL do Supabase
├── README.md              # passo a passo para rodar
├── 01_tabelas.sql         # usuarios e denuncias
├── 02_funcoes.sql         # as 12 funções RPC
├── 03_permissoes.sql      # RLS e permissões (grant execute)
└── 04_seed.sql            # opcional: admin e denúncias de exemplo                      
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── eslint.config.js
    ├── tsconfig*.json
    └── src/
        ├── assets/                <-- imagens e logotipos por página
        ├── components/
        │   ├── layout/            <-- AdminLayout, AdminSidebar
        │   ├── ui/                <-- NavBar, Footer, modais, tabelas, gráficos, badges
        │   └── PrivateRoute.tsx   <-- proteção de rotas por papel
        ├── hooks/                 <-- lógica separada da parte visual
        ├── pages/                 <-- uma página por rota
        ├── services/              <-- comunicação com Supabase e APIs externas
        ├── utils/                 <-- validação, formatação, estatísticas, CSV, erros
        ├── App.tsx                <-- definição das rotas
        ├── main.tsx
        └── index.css
```

## 🧭 Rotas

| Rota | Tipo | Descrição |
|------|------|-----------|
| `/` | Pública | Página inicial |
| `/login` | Pública | Login |
| `/register` | Pública | Cadastro de usuário |
| `/denuncias` | Pública | Mapa e lista pública de denúncias |
| `/como-funciona` | Pública | Explicação do fluxo da plataforma |
| `/sobre` | Pública | Tecnologias do projeto |
| `/nova-denuncia` | **Privada** (`user`, `admin`) | Registrar uma denúncia |
| `/minhas-denuncias` | **Privada** (`user`, `admin`) | Denúncias do usuário |
| `/minhas-denuncias/:protocolo` | **Privada** (`user`, `admin`) | Acompanhamento de uma denúncia |
| `/dashboard` | **Privada** (`admin`) | Painel com estatísticas e gráficos |
| `/dashboard/denuncias` | **Privada** (`admin`) | Gestão das denúncias |
| `/dashboard/usuarios` | **Privada** (`admin`) | Gestão dos usuários |
| `*` | Pública | Página de erro 404 |

A proteção é feita pelo componente `PrivateRoute`, que recebe a lista de papéis permitidos (`allowedRoles`) e o conteúdo protegido por `children`:

```tsx
<PrivateRoute allowedRoles={['admin']}>
    <Dashboard />
</PrivateRoute>
```

## 🧩 Conceitos de React Aplicados

- **Componentização:** o código é dividido em componentes com responsabilidades específicas (`NavBar`, `Footer`, `StatCard`, `StatusBadge`, modais, tabelas, `PrivateRoute`, `AdminLayout`), o que facilita a reutilização e a manutenção.
- **Props:** componentes como `StatCard`, `StatusBadge` e os modais recebem props para customizar conteúdo e comportamento. O `PrivateRoute` usa `children` e `allowedRoles`.
- **Rotas públicas e privadas:** configuradas com React Router DOM, com controle de acesso por papel (`user` e `admin`).
- **Tipagem com TypeScript:** tipos como `DenunciaLista`, `DenunciaPublica`, `TipoOcorrencia` e `StatusDenuncia` descrevem os dados que vêm do banco.
- **Hooks nativos:** `useState`, `useEffect` e outros controlam estado e efeitos colaterais.
- **Hooks customizados**, que separam a lógica da parte visual:

| Hook | Responsabilidade |
|------|------------------|
| `useAuth` | Login, logout, cadastro e verificação da sessão |
| `useNovaDenuncia` | Estado e envio do formulário de denúncia |
| `useMunicipios` | Carrega os municípios de SP (IBGE) |
| `useMapaSelecao` | Mapa em que o usuário marca o ponto da ocorrência |
| `useMapaDenuncias` | Mapa público com as denúncias |
| `useDenuncias`, `useDenunciasPublicas`, `useDenunciaPorProtocolo` | Busca de denúncias |
| `useUsuarios` | Lista e exclusão de usuários |
| `useFiltroDenunciasAdmin`, `useFiltroDenunciasPublicas`, `useFiltroUsuarios` | Filtros das listagens |
| `usePaginacao` | Paginação reutilizável de qualquer lista |
| `useCopiarTexto` | Copiar texto (ex.: protocolo) para a área de transferência |

## 🔐 Autenticação e Banco de Dados

O projeto **não tem servidor próprio**. O frontend se comunica direto com o **Supabase**, e a regra de negócio (login, sessão, permissões e validações) fica em **funções SQL** chamadas por `supabase.rpc(...)`.

- O **login** chama a função `login_usuario`, que valida nome e senha (senha guardada com hash bcrypt) e devolve um **token de sessão**.
- O frontend guarda os dados do usuário e o token no `localStorage` (chave `gs_user`) e envia o token em cada operação protegida.
- As funções de administrador conferem o **papel** e a **validade da sessão** a cada chamada.
- As tabelas têm **RLS ligado**: o acesso é feito apenas pelas funções.
- Os papéis são `user` e `admin`. O cadastro pela tela cria apenas usuários comuns; administradores são criados manualmente no banco.

> A estrutura completa do banco, a lista de funções e as **limitações conhecidas** (como nomes de usuário repetidos) estão em [`backend/README.md`](./backend/README.md).

## 💾 LocalStorage

| Chave | Conteúdo |
|-------|----------|
| `gs_user` | Dados do usuário logado e token da sessão |

Os dados ficam **apenas no navegador utilizado**.

## 📱 Responsividade e Tailwind CSS

O **Tailwind CSS 4** (via plugin `@tailwindcss/vite`) foi usado para estilizar a interface e criar layouts responsivos.

## 🚀 Como Instalar

**Pré-requisitos:** [Node.js](https://nodejs.org/) (versão **22 LTS ou superior** recomendada, exigência do Vite), Git e uma conta no [Supabase](https://supabase.com).

```bash
# 1. Clonar o repositório
git clone https://github.com/GS-Terra-Viva/TerraViva-WebSite

# 2. Entrar na pasta do frontend
cd TerraViva-WebSite/frontend

# 3. Instalar as dependências
npm install
```

### Configurar o banco de dados

1. Crie um projeto no Supabase.
2. Execute os scripts da pasta `backend/` no **SQL Editor**, na ordem indicada em [`backend/README.md`](./backend/README.md).
3. Em *Project Settings → API*, copie a **Project URL** e a **Publishable key**.
4. Na pasta `frontend`, crie um arquivo `.env`:

```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
```

> O `.env` está no `.gitignore` e **não deve ser versionado**. Nunca use a chave `service_role` no frontend.

## ▶️ Como Executar

Na pasta `frontend`:

```bash
npm run dev
```

O Vite exibirá no terminal o endereço local (geralmente `http://localhost:5173`).

### Passo a passo para testar

Considerando que o banco foi criado com o `04_seed.sql`:

1. Inicie o frontend e acesse o endereço do Vite
2. Em `/denuncias`, veja o mapa público e os filtros
3. Em `/login`, entre como usuário comum (`maria` / `Maria@123`)
4. Em `/nova-denuncia`, registre uma denúncia e anote o **protocolo**
5. Em `/minhas-denuncias`, acompanhe o andamento
6. Saia e entre como administrador (`admin` / `Admin@123`)
7. Em `/dashboard`, veja as estatísticas e, em `/dashboard/denuncias`, altere o status da denúncia criada (as etapas avançam uma por vez, e as etapas *encaminhada* e *concluída* exigem uma mensagem)
8. Em `/dashboard/usuarios`, teste a listagem de usuários
9. Teste o botão de sair e tente abrir `/dashboard` novamente: você deve ser barrado

> Essas contas são de demonstração. O login é feito pelo **nome**, não pelo e-mail.

Os detalhes do backend estão em [`backend/README.md`](./backend/README.md).

## 👥 Integrantes

<ul>
  <li><strong>Flávia Camerim de Sousa</strong> — RM: 570979</li>
  <li><strong>João Pedro Nóbrega Pereira</strong> — RM: 570322</li>
  <li><strong>Kevin Simões de Souza Lima</strong> — RM: 571942</li>
  <li><strong>Luan Sá Muniz dos Santos</strong> — RM: 569136</li>
</ul>