-- 02_funcoes.sql · Terra Viva
-- Execute DEPOIS do 01_tabelas.sql

-- ============================================================
-- TRIGGER: hash de senha (bcrypt)
-- ============================================================
create or replace function public.hash_senha_usuario()
returns trigger
language plpgsql
set search_path = public, extensions
as $$
begin
  if tg_op = 'INSERT' or new.password is distinct from old.password then
    new.password := crypt(new.password, gen_salt('bf'));
  end if;
  return new;
end;
$$;

drop trigger if exists trg_hash_senha_usuario on public.usuarios;
create trigger trg_hash_senha_usuario
  before insert or update of password on public.usuarios
  for each row execute function public.hash_senha_usuario();

-- ============================================================
-- AUTENTICAÇÃO
-- ============================================================
create or replace function public.login_usuario(p_name text, p_password text)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  u public.usuarios;
  t uuid;
begin
  delete from public.sessoes where expires_at < now();   -- limpa sessões vencidas

  select * into u
    from public.usuarios
   where name = p_name
     and password = crypt(p_password, password);

  if not found then
    return null;
  end if;

  insert into public.sessoes (user_id) values (u.id) returning token into t;

  return json_build_object(
    'id', u.id, 'name', u.name, 'email', u.email, 'role', u.role, 'token', t
  );
end;
$$;

create or replace function public.logout_usuario(p_token uuid)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.sessoes where token = p_token;
$$;

create or replace function public.sessao_atual(p_token uuid)
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object('id', u.id, 'name', u.name, 'email', u.email, 'role', u.role)
    from public.sessoes s
    join public.usuarios u on u.id = s.user_id
   where s.token = p_token
     and s.expires_at > now();
$$;

-- ============================================================
-- USUÁRIOS (admin)
-- ============================================================
create or replace function public.listar_usuarios(p_token uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
      from public.sessoes s
      join public.usuarios u on u.id = s.user_id
     where s.token = p_token and s.expires_at > now() and u.role = 'admin'
  ) then
    raise exception 'sessao_invalida';
  end if;

  return coalesce(
    (select json_agg(
              json_build_object('id', id, 'name', name, 'email', email, 'role', role)
              order by id desc)
       from public.usuarios),
    '[]'::json
  );
end;
$$;

create or replace function public.excluir_usuario(p_token uuid, p_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_id bigint;
begin
  select u.id into admin_id
    from public.sessoes s
    join public.usuarios u on u.id = s.user_id
   where s.token = p_token and s.expires_at > now() and u.role = 'admin';

  if admin_id is null then
    raise exception 'sessao_invalida';
  end if;

  if admin_id = p_id then
    raise exception 'nao_pode_excluir_a_si_mesmo';
  end if;

  delete from public.sessoes  where user_id = p_id;
  delete from public.usuarios where id = p_id;
end;
$$;

-- ============================================================
-- DENÚNCIAS (usuário logado)
-- ============================================================
create or replace function public.criar_denuncia(
  p_token          uuid,
  p_tipo           text,
  p_data_ocorrido  date,
  p_titulo         text,
  p_comunidade     text,
  p_descricao      text,
  p_municipio      text,
  p_municipio_ibge int4,
  p_lat            float8,
  p_lng            float8
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id bigint;
  v_nome    text;
  v_email   text;
  v_row     public.denuncias;
  v_prot    text;
begin
  select u.id, u.name, u.email
    into v_user_id, v_nome, v_email
    from public.sessoes s
    join public.usuarios u on u.id = s.user_id
   where s.token = p_token
     and s.expires_at > now();

  if v_user_id is null then
    raise exception 'sessao_invalida';
  end if;

  if p_tipo is null or p_tipo not in (
    'invasao_territorio','desmatamento','exploracao_ilegal','violencia',
    'conflito_fundiario','contaminacao','acesso_servicos','outro'
  ) then
    raise exception 'Tipo de ocorrência inválido.';
  end if;

  if p_data_ocorrido is null or p_data_ocorrido > current_date then
    raise exception 'Data do ocorrido inválida.';
  end if;

  if char_length(trim(coalesce(p_titulo, ''))) not between 1 and 120 then
    raise exception 'Título inválido (1 a 120 caracteres).';
  end if;

  if char_length(trim(coalesce(p_descricao, ''))) not between 1 and 3000 then
    raise exception 'Descrição inválida (1 a 3000 caracteres).';
  end if;

  if char_length(trim(coalesce(p_municipio, ''))) = 0 then
    raise exception 'Município obrigatório.';
  end if;

  if (p_lat is null) <> (p_lng is null)
     or (p_lat is not null and (p_lat not between -90 and 90 or p_lng not between -180 and 180)) then
    raise exception 'Coordenadas inválidas.';
  end if;

  insert into public.denuncias
    (tipo, data_ocorrido, titulo, comunidade, descricao,
     municipio, municipio_ibge, lat, lng,
     usuario_id, usuario_nome, usuario_email)
  values
    (p_tipo, p_data_ocorrido, trim(p_titulo), left(trim(coalesce(p_comunidade, '')), 150), trim(p_descricao),
     trim(p_municipio), p_municipio_ibge, p_lat, p_lng,
     v_user_id, v_nome, v_email)
  returning * into v_row;

  v_prot := 'DEN-' || to_char(v_row.created_at, 'YYYY') || '-' || lpad(v_row.id::text, 6, '0');
  update public.denuncias set protocolo = v_prot where id = v_row.id;

  return json_build_object('id', v_row.id, 'protocolo', v_prot, 'status', v_row.status);
end;
$$;

-- ============================================================
-- DENÚNCIAS (admin)
-- ============================================================
create or replace function public.listar_denuncias(p_token uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
      from public.sessoes s
      join public.usuarios u on u.id = s.user_id
     where s.token = p_token and s.expires_at > now() and u.role = 'admin'
  ) then
    raise exception 'sessao_invalida';
  end if;

  return coalesce(
    (select json_agg(to_json(d) order by d.created_at desc)
       from public.denuncias d
      where d.arquivada = false),
    '[]'::json
  );
end;
$$;

create or replace function public.arquivar_denuncia(p_token uuid, p_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
      from public.sessoes s
      join public.usuarios u on u.id = s.user_id
     where s.token = p_token and s.expires_at > now() and u.role = 'admin'
  ) then
    raise exception 'sessao_invalida';
  end if;

  update public.denuncias set arquivada = true where id = p_id;
end;
$$;

-- troca de status sem regra de ordem (admin)
create or replace function public.atualizar_status_denuncia(p_token uuid, p_id bigint, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_linhas integer;
begin
  if not exists (
    select 1
      from public.sessoes s
      join public.usuarios u on u.id = s.user_id
     where s.token = p_token and s.expires_at > now() and u.role = 'admin'
  ) then
    raise exception 'sessao_invalida';
  end if;

  if p_status is null or p_status not in ('recebida','em_analise','encaminhada','concluida') then
    raise exception 'status_invalido';
  end if;

  update public.denuncias set status = p_status where id = p_id;
  get diagnostics v_linhas = row_count;

  if v_linhas = 0 then
    raise exception 'denuncia_nao_encontrada';
  end if;
end;
$$;

-- avanço de etapa com mensagem (admin)
create or replace function public.alterar_status_denuncia(
  p_token    uuid,
  p_id       bigint,
  p_status   text,
  p_mensagem text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ordem text[] := array['recebida', 'em_analise', 'encaminhada', 'concluida'];
  v_atual text;
  v_msg   text := nullif(btrim(coalesce(p_mensagem, '')), '');
begin
  if not exists (
    select 1
      from public.sessoes s
      join public.usuarios u on u.id = s.user_id
     where s.token = p_token and s.expires_at > now() and u.role = 'admin'
  ) then
    raise exception 'sessao_invalida';
  end if;

  select status into v_atual from public.denuncias where id = p_id for update;
  if not found then
    raise exception 'denuncia_nao_encontrada';
  end if;

  -- só avança para a próxima etapa da ordem
  if array_position(v_ordem, p_status) is distinct from array_position(v_ordem, v_atual) + 1 then
    raise exception 'transicao_invalida';
  end if;

  if p_status in ('encaminhada', 'concluida') and (v_msg is null or length(v_msg) < 10) then
    raise exception 'mensagem_obrigatoria';
  end if;

  update public.denuncias
     set status = p_status,
         mensagem_encaminhamento = case when p_status = 'encaminhada' then v_msg else mensagem_encaminhamento end,
         mensagem_conclusao      = case when p_status = 'concluida'   then v_msg else mensagem_conclusao end
   where id = p_id;
end;
$$;

-- ============================================================
-- CONSULTA PÚBLICA (sem login)
-- ============================================================
create or replace function public.listar_denuncias_publicas()
returns table (
  id text, protocolo text, tipo text, data_ocorrido text, titulo text,
  comunidade text, municipio text, lat double precision, lng double precision,
  status text, created_at text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    d.id::text,
    d.protocolo::text,
    d.tipo::text,
    d.data_ocorrido::text,
    d.titulo::text,
    d.comunidade::text,
    d.municipio::text,
    round(d.lat::numeric, 2)::double precision,   -- arredonda para não expor o ponto exato
    round(d.lng::numeric, 2)::double precision,
    d.status::text,
    d.created_at::text
  from public.denuncias d
  where coalesce(d.arquivada, false) = false
  order by d.created_at desc;
$$;

create or replace function public.buscar_denuncia_por_protocolo(p_protocolo text)
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'id',                     d.id::text,
    'protocolo',              d.protocolo,
    'tipo',                   d.tipo,
    'dataOcorrido',           d.data_ocorrido::text,
    'titulo',                 d.titulo,
    'comunidade',             coalesce(d.comunidade, ''),
    'municipio',              d.municipio,
    'status',                 d.status,
    'recebidaEm',             d.created_at::text,
    'mensagemEncaminhamento', coalesce(d.mensagem_encaminhamento, ''),
    'mensagemConclusao',      coalesce(d.mensagem_conclusao, '')
  )
  from public.denuncias d
  where upper(d.protocolo) = upper(btrim(p_protocolo))
    and coalesce(d.arquivada, false) = false
  limit 1;
$$;