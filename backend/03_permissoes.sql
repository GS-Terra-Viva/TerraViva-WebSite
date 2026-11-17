-- 03_permissoes.sql · Terra Viva
-- Execute DEPOIS do 02_funcoes.sql

-- ===== Tabelas: ninguém lê/escreve direto, exceto o cadastro =====
revoke all on public.usuarios, public.sessoes, public.denuncias from anon, authenticated;

-- O frontend cadastra com supabase.from('usuarios').insert({ name, email, password })
grant insert on public.usuarios to anon, authenticated;

drop policy if exists "cadastro_publico" on public.usuarios;
create policy "cadastro_publico" on public.usuarios
  for insert to anon, authenticated
  with check (role = 'user');          -- impede alguém de se cadastrar como admin

-- ===== Funções: só as RPCs usadas pelo frontend =====
revoke execute on all functions in schema public from public, anon, authenticated;

grant execute on function
  public.login_usuario(text, text),
  public.logout_usuario(uuid),
  public.sessao_atual(uuid),
  public.listar_usuarios(uuid),
  public.excluir_usuario(uuid, bigint),
  public.criar_denuncia(uuid, text, date, text, text, text, text, int4, float8, float8),
  public.listar_denuncias(uuid),
  public.arquivar_denuncia(uuid, bigint),
  public.atualizar_status_denuncia(uuid, bigint, text),
  public.alterar_status_denuncia(uuid, bigint, text, text),
  public.listar_denuncias_publicas(),
  public.buscar_denuncia_por_protocolo(text)
to anon, authenticated;

-- ===== Primeiro admin (troque nome, e-mail e senha) =====
-- insert into public.usuarios (name, email, password, role)
-- values ('admin', 'admin@exemplo.com', 'TroqueEstaSenha', 'admin');
-- (o trigger faz o hash; o with check acima só vale para o cadastro público,
--  então rode isto no SQL Editor, que ignora o RLS)