## Descrição

Este projeto foi desenvolvido utilizando o framework **NestJS**, com foco em criar uma aplicação escalável e eficiente para gerenciamento de tarefas. Ele foi baseado em um desafio técnico e implementa boas práticas de desenvolvimento, como autenticação JWT, integração com banco de dados PostgreSQL via Prisma ORM, e testes unitários para garantir a qualidade do código.

## Configuração do Projeto

```bash
$ npm install
```

## Configuração do Ambiente

Para configurar o ambiente de desenvolvimento:

1. Instale o Docker Desktop
2. Execute o container PostgreSQL:
```bash
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
JWT_SECRET="seu-secret-aqui"
JWT_EXPIRATION_TIME=1d
```

## Migrações

Execute o seguinte comando para criar e aplicar as migrações:

```bash
# Gerar migração
npx prisma migrate dev --name init
```


## Compilar e executar o projeto

```bash
# Ambiente de desenvolvimento
$ npm run start

# Modo de observação (hot reload)
$ npm run start:dev
```

## Executar testes

```bash
# Testes unitários
$ npm run test

# Cobertura de testes
$ npm run test:cov
```

