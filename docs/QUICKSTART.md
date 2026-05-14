# 🚀 Quick Start - WearCheck Platform

## ⚡ Instalação Rápida (5 minutos)

### 1. Pré-requisitos

```bash
# Verificar versões
node --version   # Deve ser >= 20.0.0
pnpm --version   # Deve ser >= 9.0.0
docker --version # Para serviços locais
```

### 2. Setup

```bash
# Instalar dependências
pnpm install

# Copiar variáveis de ambiente
cp .env.example .env

# Iniciar serviços (PostgreSQL, Redis, etc.)
docker-compose up -d

# Aguardar serviços iniciarem (30 segundos)
sleep 30

# Gerar Prisma Client
pnpm db:generate

# Executar migrações
pnpm db:migrate

# Seed dados demo (opcional)
pnpm --filter @wearcheck/database db:seed
```

### 3. Rodar

```bash
# Iniciar todos os apps
pnpm dev
```

### 4. Acessar

- **Client Portal** (e `/admin`): http://localhost:3101
- **API**: http://localhost:3103
- **Prisma Studio**: http://localhost:5555 (executar: `pnpm db:studio`)

### 5. Login (após seed)

**Cliente Demo:**
- Email: `user@demomining.co.za`
- Password: `Admin@123`

---

## 📋 Comandos Essenciais

```bash
# Desenvolvimento (sem o app legado backoffice)
pnpm dev                          # Iniciar apps ativos
pnpm --filter @wearcheck/api dev  # Apenas API

# Database
pnpm db:generate                  # Gerar Prisma Client
pnpm db:studio                    # Abrir Prisma Studio
pnpm db:migrate                   # Executar migrations

# Build (sem backoffice)
pnpm build                        # Build de produção dos apps ativos
pnpm build:backoffice-legacy      # Só se precisar do pacote legado

# Limpeza
pnpm clean                        # Limpar tudo
docker-compose down -v            # Reset Docker
```

---

## 🏗️ Estrutura do Projeto

```
wearcheck-platform/
├── apps/
│   ├── client-portal/      # Portal do Cliente (React + Vite)
│   └── api/                # Backend API (Next.js)
│
├── packages/
│   ├── database/           # Prisma Schema + Seeds
│   └── types/              # TypeScript Types
│
├── docker-compose.yml      # Serviços locais
└── turbo.json             # Turborepo config
```

---

## 🧪 Testar a API

```bash
# Health check
curl http://localhost:3003/api/health

# Listar amostras
curl http://localhost:3003/api/v1/samples

# Listar equipamentos
curl http://localhost:3003/api/v1/equipment
```

---

## 🐛 Troubleshooting

### Porta em uso

```bash
# Encontrar e matar processo
lsof -ti:3001 | xargs kill -9
```

### Problema com Prisma

```bash
# Regenerar client
rm -rf node_modules/.prisma
pnpm db:generate
```

### Docker não inicia

```bash
# Reset completo
docker-compose down -v
docker-compose up -d
```

---

## 📚 Próximos Passos

1. ✅ Explorar **Client Portal** em http://localhost:3001
2. ✅ Ver dados no **Prisma Studio**: `pnpm db:studio`
3. ✅ Testar **API endpoints** com Postman/Insomnia
4. ✅ Ler [DEVELOPMENT.md](./DEVELOPMENT.md) para detalhes
5. ✅ Ler [ARCHITECTURE.md](./ARCHITECTURE.md) para arquitetura

---

## 🎯 Funcionalidades Principais

### Portal do Cliente

- ✅ **Dashboard** - Métricas e visão geral
- ✅ **Amostras** - Submissão e tracking
- ✅ **Relatórios** - Visualização de PDFs
- ✅ **Equipamentos** - Gestão de frota
- ✅ **Análises** - Trends e gráficos

### API Backend

- ✅ **REST API** completa
- ✅ **Autenticação** JWT
- ✅ **Multi-tenant** por cliente
- ✅ **Validação** com Zod
- ✅ **TypeScript** end-to-end

---

## 📞 Ajuda

- **Documentação**: Ver pasta `/docs`
- **Issues**: GitHub Issues
- **Email**: softwaresupport@wearcheck.co.za
- **Tel**: +27 31 700 5460

---

## ✨ Stack Tecnológico

- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: Next.js 14 (App Router)
- **Database**: PostgreSQL 15 + Prisma ORM
- **UI**: TailwindCSS
- **Monorepo**: Turborepo + pnpm
- **Containers**: Docker Compose

---

## 🎉 Pronto!

Seu ambiente está configurado. Comece a desenvolver!

```bash
pnpm dev
```
