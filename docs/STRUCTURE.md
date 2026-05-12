# WearCheck Platform - Estrutura Completa

## 📦 Aplicações

### 1. **apps/api** (porta 3003)
Backend Next.js 14 (API-only)
- Autenticação NextAuth.js
- Endpoints REST
- Integração com Prisma

### 2. **apps/client-portal** (porta 3001)
Portal do Cliente - React + Vite
- Login autenticado
- Submissão de amostras
- Visualização de relatórios
- Dashboard com métricas

### 3. **apps/web** (porta 3000)
Site Público - Next.js 14
- Landing page
- Informações sobre serviços
- Formulário de contacto
- SEO otimizado

### 4. **apps/backoffice** (porta 3002)
Painel Administrativo - React + Vite
- Gestão de usuários
- Gestão de clientes
- Processamento de amostras
- Geração de relatórios
- Configurações do sistema

## 📚 Packages

### Core
- **@wearcheck/database** - Prisma ORM + Schema + Seed
- **@wearcheck/types** - TypeScript types compartilhados
- **@wearcheck/auth** - NextAuth.js configuration
- **@wearcheck/ui** - Componentes React reutilizáveis

### Utilitários
- **@wearcheck/email** - Serviço de emails (Nodemailer)
- **@wearcheck/pdf** - Geração de PDFs (PDFKit)
- **@wearcheck/analytics** - Métricas e análises

## 🚀 Como Executar

```bash
# Instalar dependências
pnpm install

# Iniciar Docker (PostgreSQL)
docker-compose up -d

# Rodar migrações
pnpm db:migrate

# Iniciar todos os apps
pnpm dev
```

## 🌐 URLs

- **API**: http://localhost:3003
- **Client Portal**: http://localhost:3001
- **Site Público**: http://localhost:3000
- **Backoffice**: http://localhost:3002

## 🔐 Credenciais de Teste

**Cliente:**
- Email: user@demomining.co.za
- Senha: Demo@123

**Admin:**
- Email: admin@wearcheck.co.za
- Senha: Admin@123

## 📊 Banco de Dados

PostgreSQL rodando em Docker na porta 5433
- Database: wearcheck
- User: wearcheck
- Password: wearcheck_dev_password

## 🎯 Próximos Passos

1. ✅ Fundação completa criada
2. Implementar funcionalidades restantes
3. Testes unitários e integração
4. Deploy em produção
