# 🚀 Guia de Desenvolvimento - WearCheck Platform

## 📋 Pré-requisitos

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Docker & Docker Compose
- Git

## 🛠️ Configuração Inicial

### 1. Clonar e Instalar

```bash
# Clonar repositório
git clone <repo-url>
cd wearcheck-platform

# Instalar dependências
pnpm install
```

### 2. Configurar Ambiente

```bash
# Copiar variáveis de ambiente
cp .env.example .env

# Editar .env com suas configurações
nano .env
```

### 3. Iniciar Serviços

```bash
# Iniciar Docker (PostgreSQL, Redis, etc.)
docker-compose up -d

# Verificar que os containers estão rodando
docker-compose ps

# Gerar Prisma Client
pnpm db:generate

# Executar migrações
pnpm db:migrate

# (Opcional) Seed dados demo
pnpm --filter @wearcheck/database db:seed
```

### 4. Iniciar Desenvolvimento

```bash
# Iniciar todos os apps
pnpm dev

# Ou iniciar apps individuais
pnpm --filter @wearcheck/api dev
pnpm --filter @wearcheck/client-portal dev

# Backoffice legado (app separada; administração preferível em client-portal /admin)
# pnpm --filter @wearcheck/backoffice dev:legacy
```

## 📁 Estrutura do Projeto

```
wearcheck-platform/
├── apps/
│   ├── web/              # Frontend público
│   ├── client-portal/    # Portal do cliente + /admin (staff)
│   ├── backoffice/       # [Legado] painel admin antigo — `pnpm dev:legacy` neste package
│   └── api/              # Backend API (Next.js)
│
├── packages/
│   ├── ui/               # Componentes compartilhados
│   ├── database/         # Prisma + seeds
│   ├── types/            # TypeScript types
│   └── auth/             # Autenticação
│
└── docker-compose.yml    # Serviços Docker
```

## 🗄️ Database

### Prisma Commands

```bash
# Gerar Prisma Client
pnpm db:generate

# Push schema (dev only)
pnpm db:push

# Criar migration
pnpm db:migrate

# Abrir Prisma Studio
pnpm db:studio

# Seed database
pnpm --filter @wearcheck/database db:seed
```

### Acessar Database

- **Prisma Studio**: http://localhost:5555
- **Adminer**: http://localhost:8080
  - System: PostgreSQL
  - Server: postgres
  - Username: wearcheck
  - Password: wearcheck_dev_password
  - Database: wearcheck

## 🌐 URLs de Desenvolvimento

| App | URL | Porta |
|-----|-----|-------|
| Web (Público) | http://localhost:3000 | 3000 |
| Client Portal | http://localhost:3001 | 3001 |
| Backoffice | http://localhost:3002 | 3002 |
| API | http://localhost:3003 | 3003 |
| Prisma Studio | http://localhost:5555 | 5555 |
| Adminer | http://localhost:8080 | 8080 |
| WordPress | http://localhost:8000 | 8000 |

## 🔐 Credenciais Demo

Após executar o seed:

**Super Admin:**
- Email: admin@checkserv.co.ao
- Password: Admin@123

**Cliente Demo:**
- Email: user@demomining.co.za
- Password: Admin@123

## 📦 Adicionar Dependência

```bash
# Adicionar ao workspace root
pnpm add -w <package>

# Adicionar a um app específico
pnpm --filter @wearcheck/api add <package>

# Adicionar a um package
pnpm --filter @wearcheck/database add <package>
```

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Executar testes em watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

## 🔨 Build

```bash
# Build dos apps ativos (exclui @wearcheck/backoffice legado)
pnpm build

# Build app específico
pnpm --filter @wearcheck/api build

# Pacote legado backoffice, se necessário
pnpm build:backoffice-legacy
```

## 🐛 Debugging

### VS Code

1. Abrir Debug Panel (Cmd/Ctrl + Shift + D)
2. Selecionar configuração
3. Pressionar F5

### API Debugging

```bash
# Iniciar API em debug mode
pnpm --filter @wearcheck/api dev -- --inspect
```

## 📝 Convenções de Código

### Git Commit Messages

```
feat: Adicionar nova funcionalidade
fix: Corrigir bug
docs: Atualizar documentação
style: Formatação, missing semi colons, etc
refactor: Refatoração de código
test: Adicionar testes
chore: Manutenção, updates de dependências
```

### Branch Naming

```
feature/nome-da-feature
bugfix/nome-do-bug
hotfix/nome-do-hotfix
release/v1.0.0
```

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Encontrar processo usando porta
lsof -ti:3001

# Matar processo
kill -9 <PID>
```

### Prisma Issues

```bash
# Reset database
pnpm --filter @wearcheck/database db:push --force-reset

# Regenerar client
rm -rf node_modules/.prisma
pnpm db:generate
```

### Docker Issues

```bash
# Parar todos os containers
docker-compose down

# Remover volumes (ATENÇÃO: apaga dados)
docker-compose down -v

# Rebuild containers
docker-compose up -d --build
```

### pnpm Issues

```bash
# Limpar cache
pnpm store prune

# Reinstalar tudo
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

## 📚 Recursos

- [Turborepo Docs](https://turbo.build/repo/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

## 🤝 Contribuir

1. Fork o projeto
2. Criar branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📞 Suporte

- Email: softwaresupport@wearcheck.co.za
- Tel: +27 31 700 5460
