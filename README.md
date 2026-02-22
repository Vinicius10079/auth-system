# Auth System - Next.js + NextAuth + Prisma

Sistema completo de autenticação construído com:

- Next.js (App Router)
- NextAuth (Credentials Provider)
- Prisma ORM
- MySQL
- JWT Session Strategy
- Recuperação de senha com token
- Verificação de email

---

## Funcionalidades

- Registro de usuário
- Verificação de email via token
- Login com email e senha
- Sessão via JWT
- Proteção de rotas com middleware
- Recuperação de senha
- Reset de senha com token expirável
- Exclusão automática de tokens usados

---

## Tecnologias

- Next.js 15
- NextAuth
- Prisma 6
- bcrypt
- MySQL Server 8
- Docker

---

## Instalação

Clone o projeto:

```bash
git clone <repo-url>
cd auth-system
```
Certifique-se de ter Docker e Docker Compose instalados.

```bash
docker compose up --build
```

Ou em versão antiga:

```bash
docker-compose up --build
```

Execute as migrações do Prisma.

```bash
docker compose exec app npx prisma migrate deploy
```

Se tiver em ambiente de desenvolvimento:

```bash
docker compose exec app npx prisma migrate dev
```

A Aplicação estará disponível em:

http://localhost:3000

## OBSERVAÇÕES

- Para parar os containers:

```bash
docker compose down
```

- Funcionalidades de envio e verificação de existência de endereço de e-mail não estão implementadas.
- Endereços fictícios podem ser utilizados para cadastro.
- Os links que normalmente seriam enviados por e-mail são exibidos no console da aplicação.