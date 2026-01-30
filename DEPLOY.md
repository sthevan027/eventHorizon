# Deploy - stubticket. (eventHorizon)

## Visão geral

- **Frontend (React/Vite):** pode ser publicado na **Vercel**.
- **Backend (Laravel/PHP):** precisa de servidor com PHP, PostgreSQL e Redis (Vercel **não** roda PHP). Use Railway, Render, Coolify, Hetzner, etc.

---

## 1. Frontend na Vercel

### Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Repositório do projeto no GitHub/GitLab/Bitbucket

### Passos

1. **Importar o projeto**
   - Em [vercel.com/new](https://vercel.com/new), importe o repositório.
   - **Root Directory:** defina como `frontend` (a raiz do projeto Vite/React fica em `frontend/`).

2. **Build**
   - **Framework Preset:** Vite
   - **Build Command:** `pnpm run build` (ou `pnpm run build:csr` para build estático sem SSR)
   - **Output Directory:** `dist/client` (SSR) ou `dist` (CSR)
   - **Install Command:** `pnpm install`

3. **Variáveis de ambiente (Environment Variables)**

   | Nome | Descrição | Exemplo |
   |------|-----------|---------|
   | `VITE_FRONTEND_URL` | URL pública do frontend na Vercel | `https://seu-app.vercel.app` |
   | `VITE_API_URL_CLIENT` | URL da API para o browser | `https://api.seudominio.com/api` |
   | `VITE_API_URL_SERVER` | URL da API para o servidor (SSR) | `https://api.seudominio.com/api` |
   | `VITE_APP_NAME` | Nome da aplicação | `stubticket.` |

   Todas devem ter o prefixo `VITE_` para o Vite expor no build.

4. **Deploy**
   - Faça o deploy. A Vercel usa o `vercel.json` do `frontend` (rewrites para SPA).

### Observação sobre SSR

- Se usar o build completo (`pnpm run build`), o projeto usa SSR. Na Vercel isso roda como **serverless function** (Node).
- Para apenas site estático, use `pnpm run build:csr` e ajuste o **Output Directory** para `dist`.

---

## 2. Backend (fora da Vercel)

O backend é Laravel (PHP). Ele precisa de:

- PHP 8.2+
- PostgreSQL
- Redis (filas/cache)
- Servidor web (nginx/Apache) ou runtime PHP (e.g. Laravel Octane)

### Opções de hospedagem

| Serviço | Uso típico |
|---------|------------|
| **Coolify** (self-hosted) | Docker no seu servidor (ex.: Hetzner) |
| **Railway** | Backend + Postgres + Redis em um lugar |
| **Render** | Backend + Postgres; Redis em plano pago ou externo |
| **Hetzner + Docker** | `docker-compose` na raiz do projeto (all-in-one) |

### Variáveis de ambiente do backend

- Copie o `.env.example` da **raiz** do projeto para `.env`.
- Defina pelo menos:
  - `APP_KEY`, `JWT_SECRET`
  - `DATABASE_URL` (PostgreSQL)
  - `REDIS_HOST`, `REDIS_PORT`
  - `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_PUBLIC_KEY`, `MERCADOPAGO_WEBHOOK_SECRET`
  - `APP_FRONTEND_URL` = URL do frontend na Vercel (ex.: `https://seu-app.vercel.app`)

### Webhook Mercado Pago

- No painel do Mercado Pago, configure a URL de notificação:
  - `https://SEU-BACKEND.com/api/public/webhooks/mercadopago`
- O backend deve estar acessível por HTTPS na internet.

### Migrations

No servidor do backend:

```bash
cd backend
php artisan migrate
```

---

## 3. Habilitar Mercado Pago no evento

- No painel do organizador, em **Evento → Configurações**, em **Provedores de pagamento** inclua **MERCADOPAGO**.
- Assim o checkout passa a mostrar PIX e “Pagar com cartão” (Checkout Pro).

---

## 4. Deploy all-in-one (Docker)

Se quiser tudo em um único servidor (frontend + backend + Postgres + Redis):

1. Na **raiz** do projeto, configure o `.env` (copie de `.env.example`).
2. Gere as chaves:
   ```bash
   # Windows (PowerShell)
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
   ```
   Defina `APP_KEY=base64:...` e `JWT_SECRET=...`.
3. Suba os serviços:
   ```bash
   docker compose up -d
   ```
4. Acesse em `http://localhost:8123` (ou o IP do servidor).

Nesse modo, **não** é necessário publicar o frontend na Vercel; ele é servido pelo container all-in-one.

---

## Resumo

| Onde publicar | O que |
|---------------|--------|
| **Vercel** | Frontend (pasta `frontend`) – sim. |
| **Outro serviço** | Backend Laravel + Banco + Redis – necessário. |
| **Mercado Pago** | Webhook apontando para a URL do backend. |

Sim, **conseguimos postar na Vercel** o frontend; o backend precisa ficar em um serviço que rode PHP (e banco/Redis).
