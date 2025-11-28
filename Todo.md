📝 TODO - Synapse (Roadmap de Melhorias)

Este documento lista as pendências, melhorias técnicas e refatorações necessárias para elevar o nível do projeto de "Protótipo Acadêmico" para "Produto Profissional".

🎨 Frontend & UI/UX (Prioridade Alta)

[ ] CSS Profissional:

[ ] Remover todos os estilos inline (style={{...}}) restantes no código.

[ ] Padronizar o Design System (Cores, Tipografia, Espaçamentos).

[ ] Criar arquivo de variáveis CSS globais (:root) para facilitar temas (Dark/Light Mode).

[ ] Melhorar o feedback visual dos botões (efeito hover, active e disabled).

[ ] Responsividade:

[ ] Garantir que o Dashboard e o Painel Admin funcionem perfeitamente em Tablets e Celulares.

[ ] Ajustar o layout do Totem para telas verticais (modo quiosque).

[ ] Feedback de Carregamento:

[ ] Adicionar Spinners (giratórios) dentro dos botões durante requisições (loading state).

[ ] Adicionar Skeletons (esqueletos de carregamento) nas tabelas enquanto os dados não chegam.

🔐 Backend & Segurança (Crítico)

[ ] Autenticação Real (JWT):

[ ] Atualmente o login é validado no Frontend (Inseguro). Implementar Passport + JWT no NestJS.

[ ] Criar Guards (@UseGuards) para proteger rotas críticas (ex: DELETE /ticket só para ADMIN).

[ ] Validação de Dados (DTOs):

[ ] Adicionar Regex para validar formato de CPF e Telefone no Backend.

[ ] Sanitizar inputs para evitar injeção de código.

[ ] Documentação da API:

[ ] Implementar @nestjs/swagger para gerar a documentação automática das rotas (/api/docs).

⚙️ Funcionalidades & Regras de Negócio

[ ] Configurações:

[ ] Finalizar a integração da tela de "Meu Perfil" com o Backend (Rota PATCH de usuário).

[ ] Impressão:

[ ] Adicionar funcionalidade no Totem para imprimir a senha (integração com impressora térmica ou gerar PDF).

[ ] Auditoria:

[ ] Criar tabela de Logs para registrar quem apagou ou cancelou tickets importantes.

🏗️ DevOps & Infraestrutura

[ ] Dockerização:

[ ] Criar Dockerfile para o Backend e Frontend.

[ ] Criar docker-compose.yml para subir Banco + Back + Front com um comando.

[ ] Testes:

[ ] Escrever testes unitários (Jest) para o TicketService (garantir que a lógica de prioridade nunca quebre).

[ ] Escrever testes E2E (Cypress ou Playwright) para o fluxo de atendimento.

Este projeto foi desenvolvido como parte de um desafio técnico.