# Deploy na Vercel (Site + Sistema)

Este guia deixa o monorepo pronto para publicar:
- Site institucional: apps/web
- Sistema administrativo: apps/backoffice
- API: apps/api

Opcional:
- Portal do cliente: apps/client-portal

## 1) Pré-requisitos

- Repositório no GitHub conectado na Vercel
- Banco PostgreSQL em produção
- Variáveis de ambiente configuradas por projeto

## 2) Criar os projetos na Vercel

Crie projetos separados, todos apontando para o mesmo repositório:

1. Projeto API
- Root Directory: apps/api
- Framework Preset: Next.js

2. Projeto Site
- Root Directory: apps/web
- Framework Preset: Next.js

3. Projeto Sistema (Backoffice)
- Root Directory: apps/backoffice
- Framework Preset: Vite

4. Opcional: Portal do cliente
- Root Directory: apps/client-portal
- Framework Preset: Vite

## 3) Variáveis de ambiente

### API (apps/api)

Obrigatórias:
- DATABASE_URL
- DIRECT_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL

Recomendadas:
- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASSWORD
- EMAIL_FROM

NEXTAUTH_URL deve ser a URL final da API na Vercel.

Se estiver a usar Neon:
- DATABASE_URL deve apontar para a connection string pooled, normalmente com `-pooler` ou a URL indicada para aplicações serverless
- DIRECT_URL deve apontar para a connection string direta do banco, usada pelo Prisma em migrações e tarefas administrativas
- Se o Neon exigir SSL explícito, mantenha `?sslmode=require` na URL fornecida pela plataforma

Exemplo:
- DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.us-east-1.aws.neon.tech/wearcheck?sslmode=require
- DIRECT_URL=postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/wearcheck?sslmode=require

### Site (apps/web)

- NEXT_PUBLIC_CLIENT_PORTAL_URL

Use a URL pública do sistema/portal que vai receber login do cliente.

### Sistema Backoffice (apps/backoffice)

- VITE_API_URL

Use a URL pública da API (sem barra no final).
Exemplo: https://checkserv-api.vercel.app

### Portal do cliente (apps/client-portal)

- VITE_API_URL
- VITE_BASE_PATH (opcional)

Para Vercel use VITE_BASE_PATH=/
Para cPanel em subpasta use VITE_BASE_PATH=/checkserv/

## 4) Ordem recomendada de deploy

1. Deploy da API
2. Configurar URL da API nos projetos Vite (VITE_API_URL)
3. Deploy do Site
4. Deploy do Sistema (Backoffice)
5. Deploy opcional do Portal do cliente

## 5) Checklist pós-deploy

- API responde em /api/auth/session
- Login do sistema funciona
- Site redireciona corretamente para o portal/sistema
- Cookies de sessão funcionando em produção

## 6) Observações importantes

- O app apps/api já está configurado para transpilar pacotes do monorepo na build.
- Os apps Vite já usam VITE_API_URL para comunicação com a API.
- Se houver bloqueio de autenticação por cookies entre domínios, valide CORS e política de cookies no backend.
- **Canvas e gráficos**: O pacote `canvas` é opcional na Vercel. Se a geração de gráficos em PDFs falhar, é porque a compilação nativa não conseguiu em ambiente Linux. Isso não afeta o funcionamento da API, apenas a renderização de gráficos complexos em relatórios. A API continua a funcionar normalmente.
