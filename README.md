# 🧪 WearCheck Online System

Plataforma modular de análise de fluidos e monitoramento de condições para equipamentos industriais.

## 📋 Visão Geral do Sistema

O WearCheck é um sistema completo que permite:

- ✅ **Dashboard & Relatórios** - Visualização de resultados, PDFs, envio de emails
- ✅ **Gestão de Amostras** - Submissão individual/lote, histórico, tracking
- ✅ **Análise de Equipamentos** - Trends, severity analysis, pivot tables
- ✅ **Gestão de Ativos** - Estados, etiquetas, calibração, impressão de labels
- ✅ **Autenticação & Permissões** - RBAC, multi-tenant
- ✅ **Configurações** - Perfil, preferências, notificações

## 🏗️ Arquitetura

### Monorepo Estrutura

```
wearcheck-platform/
├── apps/
│   ├── web/                 # Frontend público (React + Vite)
│   ├── client-portal/       # Portal do cliente + área /admin (React + Vite)
│   ├── backoffice/          # [Legado] antigo painel admin — não entra em `pnpm dev`; usar `pnpm dev:legacy` nesta pasta
│   └── api/                 # Backend API (Next.js 14+)
│
├── packages/
│   ├── ui/                  # Componentes compartilhados (shadcn/ui)
│   ├── database/            # Prisma schema + migrations
│   ├── types/               # TypeScript types
│   ├── utils/               # Funções utilitárias
│   ├── config/              # Configs ESLint, Tailwind, TS
│   └── auth/                # NextAuth.js + RBAC
│
└── services/
    └── wordpress/           # WordPress Headless CMS
```

### Stack Tecnológico

- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: Next.js 14 (App Router)
- **Database**: PostgreSQL 15+ + Prisma ORM
- **UI**: TailwindCSS + shadcn/ui
- **Auth**: NextAuth.js (Auth.js)
- **Monorepo**: Turborepo + pnpm
- **CMS**: WordPress Headless

## 🚀 Quick Start

### ⚡ Setup Automático (Recomendado)

```bash
# Executar script de setup
./setup.sh
```

O script irá:
- ✅ Verificar Node.js e pnpm
- ✅ Instalar dependências
- ✅ Configurar .env
- ✅ Iniciar Docker (PostgreSQL)
- ✅ Executar migrations
- ✅ Seed dados demo (opcional)

### 🔧 Setup Manual

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar ambiente
cp .env.example .env
nano .env  # Editar com suas configurações

# 3. Iniciar Docker
docker-compose up -d

# 4. Setup database
pnpm db:generate
pnpm db:migrate

# 5. (Opcional) Seed
pnpm --filter @wearcheck/database db:seed

# 6. Iniciar desenvolvimento (web, client-portal, api; **sem** o app legado `backoffice`)
pnpm dev
```

Para o antigo painel `apps/backoffice` apenas: `pnpm --filter @wearcheck/backoffice dev:legacy` (porta 3102).

### URLs de Desenvolvimento

| Aplicação | URL | Porta |
|-----------|-----|-------|
| Portal do Cliente (e `/admin`) | http://localhost:3101 | 3101 |
| API Backend | http://localhost:3103 | 3103 |
| Prisma Studio | http://localhost:5555 | 5555 |
| Adminer (DB) | http://localhost:8080 | 8080 |
| WordPress (CMS) | http://localhost:8000 | 8000 |

### 🔐 Credenciais Demo (após seed)

**Super Admin:**
- Email: `admin@checkserv.co.ao`
- Password: `Admin@123`

**Cliente Demo:**
- Email: `user@demomining.co.za`
- Password: `Admin@123`

## 📦 Apps & Packages

### Apps

#### `web` - Frontend Público
- Landing page institucional
- Páginas de serviços
- Blog (integrado com WordPress)
- Formulários de contacto

#### `client-portal` - Portal do Cliente e Administração
- Dashboard com métricas
- Submissão de amostras
- Visualização de relatórios (PDF)
- Gestão de equipamentos
- Análises técnicas (trends, pivot tables)
- Gestão de ativos
- **Área interna `/admin`** — aprovação de contas, utilizadores, clientes, amostras e relatórios (substitui o deploy separado do backoffice)

#### `backoffice` - [Legado]
- Mantido no monorepo apenas para referência ou migração pontual
- **Não** é iniciado por `pnpm dev` no root; para arrancar localmente: `pnpm --filter @wearcheck/backoffice dev:legacy`
- Novo desenvolvimento administrativo deve usar **client-portal → `/admin`**

#### `api` - Backend API
- API REST completa
- Autenticação JWT
- Integração com PostgreSQL
- Geração de PDFs
- Sistema de notificações
- File uploads

### Packages

#### `@wearcheck/ui`
Componentes React reutilizáveis baseados em shadcn/ui

#### `@wearcheck/database`
Schema Prisma, migrations e seeds

#### `@wearcheck/types`
Types TypeScript compartilhados

#### `@wearcheck/auth`
Lógica de autenticação e autorização

#### `@wearcheck/utils`
Funções utilitárias compartilhadas

#### `@wearcheck/config`
Configurações compartilhadas (ESLint, TypeScript, Tailwind)

## 🗄️ Database Schema

O schema cobre:

- **Users & Auth** - Utilizadores, roles, sessions
- **Customers** - Clientes/empresas multi-tenant
- **Samples** - Amostras (individual/lote)
- **Equipment & Components** - Ativos e componentes
- **Test Results** - Resultados de análises
- **Reports** - Relatórios PDF
- **Notifications** - Sistema de notificações
- **Audit Logs** - Logs de auditoria

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento (exclui o app legado @wearcheck/backoffice)
pnpm dev              # Iniciar todos os apps em modo dev
pnpm dev --filter=api # Iniciar apenas a API

# Build (exclui @wearcheck/backoffice)
pnpm build            # Build de produção dos apps ativos
pnpm build --filter=web # Build apenas do web

# App backoffice legado (se precisar)
pnpm build:backoffice-legacy
pnpm lint:backoffice-legacy
pnpm type-check:backoffice-legacy
pnpm --filter @wearcheck/backoffice dev:legacy

# Database
pnpm db:generate      # Gerar Prisma Client
pnpm db:push          # Push schema para DB (dev)
pnpm db:migrate       # Executar migrations
pnpm db:studio        # Abrir Prisma Studio

# Qualidade de Código (exclui @wearcheck/backoffice)
pnpm lint             # Lint dos packages ativos
pnpm format           # Format código com Prettier
pnpm type-check       # Verificar tipos TypeScript

# Git
pnpm git:auto -- "mensagem do commit"  # Add + commit + push automático

# Limpeza
pnpm clean            # Limpar todos os builds e node_modules
```

## 🐳 Docker

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Reset completo
docker-compose down -v
```

## 📚 Documentação

- [Guia de Desenvolvimento](./docs/DEVELOPMENT.md)
- [Guia de Deploy na Vercel](./docs/VERCEL_DEPLOY.md)
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🤝 Contribuir

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Propriedade de WearCheck Africa. Todos os direitos reservados.

## 📞 Suporte

- Email: softwaresupport@wearcheck.co.za
- Tel: +27 31 700 5460
- Website: https://wearcheck.co.za
