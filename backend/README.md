# 🏥 Synepse - Sistema de Gestão de Atendimento Inteligente

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

> API robusta para gerenciamento de filas, triagem de tickets e controle de fluxo de atendimento em tempo real.

## 📌 Sobre o Projeto

O **Synepse** é uma solução de Backend desenvolvida para resolver o problema de desorganização em filas de atendimento presencial. O sistema gerencia todo o ciclo de vida de um atendimento, desde a emissão da senha até a finalização no guichê, com suporte a múltiplas categorias de prioridade.

O diferencial técnico deste projeto é a implementação de regras de negócio complexas para a geração de identificadores únicos e a orquestração de filas via WebSockets para painéis de TV.

## ⚙️ Funcionalidades Principais

- **Emissão Inteligente de Senhas**:
  - Geração de identificadores únicos seguindo o padrão estrito `YYMMDD-PPSQ` (Ano, Mês, Dia, Prioridade, Sequência).
  - Controle de reinício diário da sequência numérica.
- **Gestão de Filas e Prioridades**:
  - Algoritmo de distribuição baseado em pesos: Normal (N), Preferencial (P) e Idoso (+80).
  - Redirecionamento dinâmico entre guichês disponíveis.
- **Painel em Tempo Real**:
  - Integração com **Socket.io** para atualizar painéis de TV instantaneamente quando uma senha é chamada.
- **Relatórios Gerenciais**:
  - Estatísticas de senhas emitidas vs. atendidas e tempo médio de espera.

## 🛠️ Stack Tecnológica

- **Linguagem**: TypeScript
- **Framework**: NestJS (Arquitetura Modular)
- **Banco de Dados**: PostgreSQL
- **ORM**: TypeORM (com Migrations)
- **Containerização**: Docker & Docker Compose
- **Real-time**: Socket.io / Gateway

## 📐 Regra de Negócio: O Algoritmo de Senha

Um dos maiores desafios deste projeto foi implementar a especificação técnica para a geração do ID da senha:

```typescript
// Padrão: YYMMDD-PPSQ
// Exemplo: 251223-NM01 (23 de Dez de 2025, Normal, Senha 01)

````
O sistema valida a data atual, verifica a última sequência do dia para aquele tipo de prioridade (PP) e incrementa a sequência (SQ), garantindo unicidade e rastreabilidade.

🚀 Como Rodar o Projeto
Pré-requisitos
Node.js v18+

Docker e Docker Compose

Passo a Passo
Clone o repositório

Bash

git clone [https://github.com/Klaudio0707/synepse-backend.git](https://github.com/Klaudio0707/synepse-backend.git)
cd synepse-backend
Configure as variáveis de ambiente

Bash

cp .env.example .env
# Ajuste as credenciais do banco no arquivo .env

Bash

npm install
npm run migration:run
Inicie o servidor

Bash

npm run start:dev
A API estará disponível em: http://localhost:3000


🗂️ Estrutura do Banco de Dados
O projeto utiliza PostgreSQL com as seguintes principais entidades:

Tickets: Armazena o ID, status (Aguardando, Atendendo, Finalizado) e Timestamps.

Queues: Definições das filas e suas prioridades.

ServiceDesks (Guichês): Pontos de atendimento vinculados a usuários.

🤝 Autor
Cláudio Roberto
