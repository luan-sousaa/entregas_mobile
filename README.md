# Mobile CLI — Gestão de UF / Cidade / Região

CLI interativa em TypeScript para gerenciar entidades geográficas (UF, Cidade e Região), com persistência em SQLite via Drizzle ORM.

---

## Como rodar

### Pré-requisitos

- Node.js 18+
- npm

### Instalação

```bash
npm install
```

### Executar

```bash
npm run dev
```

O banco de dados (`database.db`) é criado automaticamente na primeira execução — nenhum passo de migração é necessário.

---

## O que faz

A aplicação oferece um menu interativo no terminal para gerenciar três entidades relacionadas geograficamente:

- **UF** — Unidade Federativa (ex: SP, DF, RJ)
- **Cidade** — vinculada a uma UF
- **Região** — vinculada a uma Cidade

Para cada entidade é possível:

- Listar
- Criar
- Editar
- Deletar (com remoção em cascata dos dependentes)

Além disso, o menu principal oferece uma **listagem relacional** que exibe todos os dados no formato:

```
SIGLA_UF - NOME_CIDADE - NOME_REGIAO
```

Exemplo:

```
DF - Brasília - Asa Norte
DF - Brasília - Esplanada
SP - São Paulo - Praça da Sé
```

---

## Como funciona

### Tecnologias

| Camada | Tecnologia |
|---|---|
| Linguagem | TypeScript |
| Banco de dados | SQLite |
| ORM | Drizzle ORM |
| Driver SQLite | better-sqlite3 |
| Execução | tsx |
| Interface CLI | readline (Node.js nativo) |

### Estrutura do projeto

```
src/
├── index.ts              # Entry point — menu principal
├── db/
│   ├── schema.ts         # Definição das tabelas com Drizzle
│   └── index.ts          # Conexão com o banco + bootstrap das tabelas
├── services/
│   ├── uf.service.ts     # CRUD de UF
│   ├── cidade.service.ts # CRUD de Cidade (com join em UF)
│   └── regiao.service.ts # CRUD de Região (com join em Cidade e UF)
└── cli/
    ├── menu.ts           # Helpers de terminal (ask, showMenu)
    ├── uf.cli.ts         # Menu interativo de UF
    ├── cidade.cli.ts     # Menu interativo de Cidade
    └── regiao.cli.ts     # Menu interativo de Região
```

### Modelagem de dados

```
UF (1) ──< Cidade (1) ──< Região
```

- Deletar uma UF remove suas Cidades e Regiões em cascata
- Deletar uma Cidade remove suas Regiões em cascata

Os IDs são gerados automaticamente pelo SQLite via `INTEGER PRIMARY KEY AUTOINCREMENT`.

### Integridade referencial

O SQLite tem suporte a chaves estrangeiras desativado por padrão. A aplicação ativa explicitamente via:

```ts
sqlite.pragma('foreign_keys = ON');
```

---

## Enunciado original

> **Especificação do Problema — CLI em TypeScript com Drizzle + SQLite**
>
> **Objetivo:** Desenvolver uma aplicação CLI minimalista utilizando TypeScript, com persistência de dados, CRUD completo, uso de ORM (Drizzle) e banco de dados SQLite. A aplicação deve permitir gerenciar entidades relacionadas geograficamente.
>
> **Requisitos Técnicos:**
> - Linguagem obrigatória: TypeScript
> - Banco de dados: SQLite
> - ORM: Drizzle ORM
> - Execução via terminal (CLI)
>
> **Modelagem de Dados:**
> - UF: id, nome, sigla
> - Cidade: id, nome, uf_id (FK → UF)
> - Região: id, nome, cidade_id (FK → Cidade)
>
> **Relacionamentos:**
> - UF 1:N Cidade
> - Cidade 1:N Região
>
> **Funcionalidades:** CRUD completo para cada entidade via menu interativo no terminal.
>
> **Regra de Listagem:** A listagem principal deve exibir os dados de forma relacional no formato `SIGLA_UF - NOME_CIDADE - NOME_REGIAO`.
>
> **Regras de Implementação:**
> - Garantir integridade referencial (FKs)
> - Utilizar tipagem forte do TypeScript
> - Separar responsabilidades (camada de dados, serviços, CLI)
> - Código simples e legível (projeto minimalista)
