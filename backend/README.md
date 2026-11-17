# Terra Viva · Backend (Supabase)

O backend do Terra Viva roda no **Supabase** (PostgreSQL). Não há servidor próprio:
o frontend conversa direto com o banco, e toda a regra de negócio (login, sessão,
permissões, validações) está em **funções SQL** chamadas por `supabase.rpc(...)`.

Esta pasta contém os scripts para recriar o banco do zero.

```
backend/
├── README.md
├── 01_tabelas.sql      # tabelas usuarios, sessoes e denuncias
├── 02_funcoes.sql      # trigger de hash de senha + 12 funções RPC
├── 03_permissoes.sql   # RLS, políticas e grants
└── 04_seed.sql         # dados de demonstração (admin, usuário e denúncias)
```

---

## Limitações conhecidas

Leia esta seção antes de avaliar ou usar o projeto.

### 1. Nomes de usuário repetidos
O login é feito pelo **nome** (`name`), e não pelo e-mail. Só o e-mail é único na
tabela. Se duas pessoas se cadastrarem com o mesmo nome, o login fica ambíguo:
o banco usa o primeiro registro que encontrar com aquele nome e senha.

Correção possível (ainda não aplicada):

```sql
alter table public.usuarios add constraint usuarios_name_unique unique (name);
```

Antes de aplicar, verifique se já existem nomes duplicados no banco.
A alternativa é trocar o login para e-mail, o que exige mudar o frontend e a
função `login_usuario`.

### 2. A tela de cadastro só cria usuários comuns, nunca administradores
Isso é proposital. A política de segurança da tabela `usuarios` só aceita
cadastro público com `role = 'user'`, para que ninguém se torne admin pela API.

Consequências:

- **Não existe tela para criar ou promover administradores.**
- Todo administrador precisa ser criado ou promovido **manualmente** pelo
  SQL Editor do Supabase:

```sql
-- promover um usuário já cadastrado
update public.usuarios set role = 'admin' where email = 'pessoa@exemplo.com';

-- ou criar um admin novo (o trigger faz o hash da senha)
insert into public.usuarios (name, email, password, role)
values ('novoadmin', 'novoadmin@exemplo.com', 'SenhaForte123', 'admin');
```

- O painel de usuários permite apenas **listar e excluir**. Não permite editar,
  rebaixar nem promover.

---

## Como rodar

### 1. Criar o projeto no Supabase
1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita.
2. Crie um novo projeto e aguarde a conclusão do provisionamento.

### 2. Executar os scripts, em ordem
No painel do projeto, abra **SQL Editor** > **New query**, cole o conteúdo de cada
arquivo e clique em **Run**, **na ordem**:

| Ordem | Arquivo | O que faz |
|-------|---------|-----------|
| 1 | `01_tabelas.sql` | Cria `usuarios`, `sessoes` e `denuncias` |
| 2 | `02_funcoes.sql` | Cria o trigger de hash e as funções RPC |
| 3 | `03_permissoes.sql` | Liga o RLS e libera só o necessário |
| 4 | `04_seed.sql` | Insere dados de demonstração |

Os scripts podem ser reexecutados sem duplicar dados. Se algum falhar, leia a
mensagem de erro e confirme que os anteriores foram executados antes.

### 3. Pegar as credenciais
Em **Connect** no topo do site, selecione o framework **React** e Variant **Vite**.

Depois é só copiar o **.env** na segunda etapa "Add files"(não precisa seguir a primeira etapa, o projeto já vem com a dependencia do supabase baixada)

- **Project URL**
- **Publishable key** (também aparece como `anon public`)

> Nunca use nem versione a chave `service_role`.

### 4. Configurar o frontend
Na pasta `frontend`, crie um arquivo `.env`:

```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
```

Depois:

```bash
cd frontend
npm install
npm run dev
```

O `.env` **não deve ir para o repositório**. Confirme que ele está no `.gitignore`.

---

## Contas de demonstração (do `04_seed.sql`)

| Nome (login) | Senha | Papel |
|--------------|-------|-------|
| `admin` | `Admin@123` | Administrador |
| `maria` | `Maria@123` | Usuário comum |

O login é feito pelo **nome**, não pelo e-mail. Essas senhas servem apenas para
teste e devem ser trocadas ou removidas fora do ambiente acadêmico.

O seed também cria 6 denúncias de exemplo: uma em cada etapa (`recebida`,
`em_analise`, `encaminhada`, `concluida`), uma sem coordenadas e uma arquivada
(que não deve aparecer em nenhuma lista). Para testar o acompanhamento público,
busque o protocolo `DEN-2026-900003`.

---

## Modelo de dados

**usuarios**: `id`, `name`, `email` (único), `password` (hash bcrypt), `role` (`user` | `admin`)

**sessoes**: `token` (uuid), `user_id` → usuarios, `expires_at`

**denuncias**: `id`, `protocolo`, `tipo`, `data_ocorrido`, `titulo`, `comunidade`,
`descricao`, `municipio`, `municipio_ibge`, `lat`, `lng`, `usuario_id` → usuarios,
`usuario_nome`, `usuario_email`, `status`, `created_at`, `arquivada`,
`mensagem_encaminhamento`, `mensagem_conclusao`

Status possíveis: `recebida` → `em_analise` → `encaminhada` → `concluida`

---

## Funções RPC

| Função | Quem pode chamar | Uso |
|--------|------------------|-----|
| `login_usuario` | Público | Autentica e devolve o token da sessão |
| `logout_usuario` | Logado | Encerra a sessão |
| `sessao_atual` | Logado | Valida o token e devolve o usuário |
| `criar_denuncia` | Logado | Registra uma denúncia e gera o protocolo |
| `listar_denuncias_publicas` | Público | Lista para o mapa, com coordenadas arredondadas |
| `buscar_denuncia_por_protocolo` | Público | Acompanhamento por protocolo |
| `listar_denuncias` | Admin | Lista completa de denúncias não arquivadas |
| `alterar_status_denuncia` | Admin | Avança a etapa, com mensagem obrigatória quando exigida |
| `atualizar_status_denuncia` | Admin | Troca de status sem regra de ordem |
| `arquivar_denuncia` | Admin | Marca a denúncia como arquivada |
| `listar_usuarios` | Admin | Lista os usuários cadastrados |
| `excluir_usuario` | Admin | Remove um usuário (não permite excluir a si mesmo) |

O cadastro de usuário é a única operação feita direto na tabela
(`supabase.from('usuarios').insert(...)`), protegida por política de RLS.

---

## Segurança

- Senhas guardadas com **bcrypt** (`pgcrypto`), via trigger.
- **RLS ligado** nas três tabelas, sem leitura direta. O acesso é só pelas
  funções `security definer`.
- Funções de admin conferem o papel e a validade da sessão a cada chamada.
- O mapa público **arredonda as coordenadas** (2 casas decimais) para não expor
  o ponto exato da ocorrência.
- Cadastro público limitado a `role = 'user'`.