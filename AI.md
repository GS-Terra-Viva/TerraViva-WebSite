# Uso de IA no projeto Terra Viva

## 1. Ferramenta

- **Claude (Anthropic)**, via claude.ai. Nenhuma outra ferramenta de IA foi usada nas interações documentadas para o desenvolvimento do projeto.

## 2. Interações realizadas

A seguir, estão alguns exemplos representativos das solicitações feitas à IA e das respostas obtidas durante o desenvolvimento.

### 2.1. Desenvolvimento do login e controle de acesso

**Solicitação:** desenvolver um formulário de login e implementar o controle de acesso às páginas privadas do sistema.

**Resposta da IA:** apresentou uma estrutura de login, serviço de autenticação (`authService.ts`) e componente `PrivateRoute`. Durante a análise de um problema em que usuários comuns conseguiam acessar o dashboard, sugeriu utilizar hash bcrypt para as senhas e implementar uma tabela de sessões com tokens para controlar os acessos.

**Ajustes realizados:** o grupo adaptou a solução à estrutura real do banco de dados, utilizando a tabela `usuarios` e os papéis `user` e `admin`. Também foi reutilizado um componente de login desenvolvido em outra entrega (Sprint 2).

### 2.2. Desenvolvimento do painel administrativo

**Solicitação:** criar um painel para gerenciamento dos usuários cadastrados, com recursos de consulta e administração.

**Resposta da IA:** sugeriu as funções SQL `listar_usuarios` e `excluir_usuario`, além de uma tabela com busca, filtros, paginação e confirmação antes da exclusão. Também apresentou sugestões de indicadores para o painel.

**Ajustes realizados:** o grupo integrou as funções ao banco de dados e ao painel administrativo, adaptando a implementação às tabelas existentes e verificando as operações de listagem e exclusão.

### 2.3. Análise e refatoração do projeto

**Solicitação:** analisar a estrutura do projeto em relação aos requisitos da disciplina e identificar oportunidades de melhoria na organização do código.

**Resposta da IA:** sugeriu separar responsabilidades por meio de hooks, services e utils, extraindo lógicas relacionadas a denúncias, filtros, paginação, mapas e formulários. Também recomendou reorganizar funções que estavam concentradas nos componentes das páginas.

**Ajustes realizados:** o grupo avaliou as sugestões, integrou as alterações ao projeto existente e ajustou importações e responsabilidades dos arquivos.

### 2.4. Registro de denúncias e seleção no mapa

**Solicitação:** implementar o registro de novas denúncias com seleção de localização em um mapa e integração com o banco de dados.

**Resposta da IA:** apresentou uma implementação utilizando Leaflet, validação de token e inserção de dados no Supabase. Também identificou um fallback que simulava o sucesso do envio mesmo quando o banco apresentava falha, sugerindo sua remoção.

**Ajustes realizados:** uma implementação anterior de registro de denúncia e seleção de localização no mapa foi utilizada como referência inicial. O grupo adaptou a solução ao contexto ambiental e indígena do Terra Viva e à estrutura atual do banco de dados. Não há confirmação de que todo o código anterior tenha sido reaproveitado literalmente.

### 2.5. Acompanhamento de denúncias por protocolo

**Solicitação:** desenvolver uma funcionalidade para que os usuários pudessem consultar o andamento de suas denúncias.

**Resposta da IA:** sugeriu as telas `MinhasDenuncias` e `AcompanharDenuncias`, além de uma consulta por protocolo. Também alertou que disponibilizar uma listagem geral de denúncias poderia facilitar a descoberta de protocolos previsíveis.

**Ajustes realizados:** o grupo adaptou a consulta ao banco de dados e às rotas do projeto, integrando o acompanhamento ao fluxo de denúncias.

### 2.6. Página "Como funciona"

**Solicitação:** desenvolver uma página explicativa utilizando uma imagem de referência como base visual.

**Resposta da IA:** apresentou a estrutura da página, com organização das seções e dos componentes.

**Ajustes realizados:** o grupo forneceu a referência visual, integrou a página ao projeto e revisou sua apresentação.

## 3. O que não foi feito com IA

A IA não foi responsável por todas as decisões e partes do Terra Viva. Entre as atividades desenvolvidas ou definidas pelo grupo estão:

- **Definição do tema e do escopo:** escolha da proposta do Terra Viva, seu objetivo ambiental e o público que o projeto pretende atender.
- **Identidade visual:** decisões sobre a identidade e a apresentação visual do projeto, incluindo a escolha e os ajustes de cores e elementos visuais.
- **Página "Sobre":** conteúdo e implementação da página institucional `Projeto.tsx` foram incorporados ao projeto pelo grupo, sem uma contribuição de IA documentada para essa funcionalidade.
- **Integrações externas:** utilização e integração das APIs do IBGE e do Nominatim ao fluxo do projeto.
- **Recursos complementares:** implementação e integração de funcionalidades como gráficos de denúncias, exportação CSV e listagem pública de denúncias com filtros.
- **Validação e decisões finais:** escolha do que seria mantido, alterado ou descartado nas sugestões da IA e verificação do comportamento do sistema.

A presença de uma funcionalidade no código não significa, por si só, que ela tenha sido criada pela IA. As contribuições foram descritas com base nas interações documentadas.

## 4. Como validamos

- Rodamos o projeto com Vite, testamos no navegador e conferimos os dados no Supabase.
- Os erros que apareceram foram enviados à IA para análise e correção.
- A IA não executou o projeto em um ambiente completo, com as dependências e a configuração necessárias. Parte das entregas foi analisada por leitura de código, sem execução funcional pela própria IA.
- **Os testes funcionais e a validação prática foram responsabilidade do grupo.**

## 5. Limitações e problemas conhecidos

- A IA partiu de suposições sobre tabelas e colunas (por exemplo, utilizou o nome `users`), sendo necessário adaptar o código à estrutura real do banco, que utiliza `usuarios`.
- **Login por nome, que não é único:** dois usuários com o mesmo nome podem gerar ambiguidade no processo de autenticação. O problema está documentado em `backend/README.md` e não foi corrigido.
- **Autenticação própria em SQL em vez de Supabase Auth:** a solução funciona, mas utiliza uma implementação própria de autenticação. O token da sessão fica armazenado no `localStorage`, o que exige atenção à segurança.
- Existem duas funções de troca de status: `atualizar_status_denuncia`, sem controle de ordem, e `alterar_status_denuncia`, com controle de ordem. A segunda representa a regra de negócio desejada. A primeira deve ser removida ou desativada após confirmação de que não possui dependências.
- **Problema de build a resolver antes da entrega:** `pages/Monitoramento.tsx` importa `SensorMonitor`, que não está presente no repositório, e a dependência `mqtt` aparece no `package.json` sem uso identificado. Essa inconsistência precisa ser resolvida e o build executado novamente.
- Há arquivos duplicados: `hooks/useUsuarios.ts` e `services/useUsuarios.ts`, além de `floresta.png` em duas pastas. A duplicidade de `useUsuarios.ts` aparenta ser um resquício de refatoração e precisa ser conferida antes de remover qualquer versão.

## 6. Conclusão

A IA acelerou a estruturação de partes do código, a organização em hooks e services, a implementação de funcionalidades administrativas e o desenho de algumas soluções para o banco de dados. Entretanto, as decisões de escopo, a integração das funcionalidades, os ajustes necessários, os testes e a validação final foram responsabilidade do grupo.

O uso da ferramenta serviu como apoio ao desenvolvimento, e não como substituição do trabalho dos integrantes. Todos os integrantes devem ser capazes de explicar as funcionalidades e as decisões técnicas presentes no código entregue.