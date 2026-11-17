-- 01_tabelas.sql · Terra Viva
-- Execute no SQL Editor do Supabase

create extension if not exists pgcrypto;

-- ===== USUARIOS =====
create table if not exists public.usuarios (
  id        bigint generated always as identity primary key,
  name      text not null,
  email     text not null unique,
  password  text,                          -- guardar HASH (crypt), nunca texto puro
  role      text not null default 'user'
            check (role in ('user', 'admin'))
);

-- ===== SESSOES =====
create table if not exists public.sessoes (
  token       uuid primary key default gen_random_uuid(),
  user_id     bigint not null references public.usuarios(id) on delete cascade,
  expires_at  timestamptz not null default (now() + interval '7 days')
);

-- ===== DENUNCIAS =====
create table if not exists public.denuncias (
  id                      bigint generated always as identity primary key,
  protocolo               text unique,     -- gerado pela função criar_denuncia
  tipo                    text not null,
  data_ocorrido           date not null,
  titulo                  text not null,
  comunidade              text not null,
  descricao               text not null,
  municipio               text not null,
  municipio_ibge          int4,
  lat                     float8,
  lng                     float8,
  usuario_id              bigint references public.usuarios(id) on delete set null,
  usuario_nome            text not null,
  usuario_email           text not null,
  status                  text not null default 'recebida'
                          check (status in ('recebida','em_analise','encaminhada','concluida')),
  created_at              timestamptz not null default now(),
  arquivada               boolean not null default false,
  mensagem_encaminhamento text,
  mensagem_conclusao      text
);

-- ===== ÍNDICES =====
create index if not exists idx_denuncias_usuario  on public.denuncias(usuario_id);
create index if not exists idx_denuncias_status   on public.denuncias(status);
create index if not exists idx_sessoes_user       on public.sessoes(user_id);

-- ===== SEGURANÇA =====
-- Tudo passa pelas funções RPC; bloqueia acesso direto às tabelas.
alter table public.usuarios  enable row level security;
alter table public.sessoes   enable row level security;
alter table public.denuncias enable row level security;