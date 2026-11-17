-- 04_seed.sql · Terra Viva
-- Dados FICTÍCIOS para demonstração. Execute DEPOIS do 03_permissoes.sql.
-- Pode ser executado mais de uma vez (não duplica registros).
-- Não depende de constraints UNIQUE nas tabelas.

-- ===== USUÁRIOS =====
-- O trigger trg_hash_senha_usuario converte as senhas em hash automaticamente.
-- Login é pelo NOME:  admin / Admin@123   e   maria / Maria@123
insert into public.usuarios (name, email, password, role)
select v.name, v.email, v.password, v.role
from (values
  ('admin', 'admin@terraviva.demo', 'Admin@123', 'admin'),
  ('maria', 'maria@terraviva.demo', 'Maria@123', 'user')
) as v(name, email, password, role)
where not exists (select 1 from public.usuarios u where u.email = v.email);

-- ===== DENÚNCIAS =====
insert into public.denuncias
  (protocolo, tipo, data_ocorrido, titulo, comunidade, descricao,
   municipio, municipio_ibge, lat, lng,
   usuario_id, usuario_nome, usuario_email,
   status, created_at, arquivada, mensagem_encaminhamento, mensagem_conclusao)
select
  v.protocolo, v.tipo, v.data_ocorrido::date, v.titulo, v.comunidade, v.descricao,
  v.municipio, v.municipio_ibge, v.lat, v.lng,
  u.id, u.name, u.email,
  v.status, v.created_at::timestamptz, v.arquivada, v.msg_enc, v.msg_conc
from (values
  ('DEN-2026-900001', 'desmatamento', '2026-09-12',
   'Abertura de clareira próxima à aldeia', 'Aldeia Boa Vista',
   'Moradores relataram máquinas abrindo uma clareira na borda da mata, a poucos quilômetros da aldeia.',
   'Ubatuba', 3555406, -23.43::float8, -45.08::float8,
   'recebida', '2026-09-14 10:20:00-03', false, null::text, null::text),

  ('DEN-2026-900002', 'invasao_territorio', '2026-08-30',
   'Cercas instaladas dentro da área da comunidade', 'Aldeia Rio Silveira',
   'Foram encontradas cercas novas e placas de propriedade em área tradicionalmente usada pela comunidade.',
   'Peruíbe', 3537305, -24.32::float8, -47.00::float8,
   'em_analise', '2026-09-02 15:45:00-03', false, null, null),

  ('DEN-2026-900003', 'contaminacao', '2026-08-15',
   'Mudança na cor e no cheiro da água do rio', 'Comunidade Ribeirinha do Vale',
   'A água do rio que abastece a comunidade apresentou odor forte e manchas após chuva intensa.',
   'Eldorado', 3514106, -24.52::float8, -48.11::float8,
   'encaminhada', '2026-08-18 09:10:00-03', false,
   'Caso encaminhado à vigilância sanitária e ao órgão ambiental estadual para coleta de amostras.', null),

  ('DEN-2026-900004', 'exploracao_ilegal', '2026-07-05',
   'Extração irregular de palmito na mata', 'Aldeia Tekoa Porã',
   'Foram vistos homens retirando palmito em área de preservação durante a madrugada.',
   'Itanhaém', 3522109, -24.18::float8, -46.79::float8,
   'concluida', '2026-07-08 08:30:00-03', false,
   'Caso encaminhado à Polícia Ambiental para fiscalização da área.',
   'A fiscalização foi realizada e a extração irregular foi interrompida. Caso encerrado.'),

  ('DEN-2026-900005', 'acesso_servicos', '2026-09-20',
   'Falta de atendimento de saúde na aldeia', 'Aldeia Jaguapiru',
   'A equipe de saúde não visita a aldeia há meses e há crianças com febre persistente.',
   'São Paulo', 3550308, null::float8, null::float8,
   'recebida', '2026-09-21 11:00:00-03', false, null, null),

  ('DEN-2026-900006', 'outro', '2026-06-10',
   'Denúncia duplicada', 'Não informada',
   'Registro duplicado, arquivado pela equipe.',
   'Iguape', 3520400, -24.70::float8, -47.55::float8,
   'recebida', '2026-06-11 14:00:00-03', true, null, null)
) as v(protocolo, tipo, data_ocorrido, titulo, comunidade, descricao,
       municipio, municipio_ibge, lat, lng,
       status, created_at, arquivada, msg_enc, msg_conc)
cross join (
  select id, name, email
    from public.usuarios
   order by (email = 'maria@terraviva.demo') desc, id
   limit 1
) u
where not exists (select 1 from public.denuncias d where d.protocolo = v.protocolo);

-- ===== CONFERÊNCIA =====
select name, email, role from public.usuarios;
select protocolo, status, arquivada, usuario_nome from public.denuncias order by id;