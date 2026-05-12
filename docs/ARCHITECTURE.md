# 📐 Arquitetura do Sistema WearCheck

## 🎯 Visão Geral

A plataforma WearCheck é um sistema modular de análise de fluidos e monitoramento de condições para equipamentos industriais, construído como um monorepo usando Turborepo.

## 🏗️ Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Web App    │  │Client Portal │  │  Backoffice  │          │
│  │ (React+Vite) │  │ (React+Vite) │  │(React+Vite)  │          │
│  │              │  │              │  │              │          │
│  │ - Homepage   │  │ - Dashboard  │  │ - Admin      │          │
│  │ - Services   │  │ - Samples    │  │ - Lab Mgmt   │          │
│  │ - Blog (WP)  │  │ - Reports    │  │ - Analytics  │          │
│  │ - Contact    │  │ - Equipment  │  │ - Settings   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                 │                    │                 │
└─────────┼─────────────────┼────────────────────┼─────────────────┘
          │                 │                    │
          └─────────────────┴────────────────────┘
                            │
          ┌─────────────────▼────────────────────────┐
          │          API GATEWAY / BACKEND           │
          │         (Next.js 14 App Router)          │
          ├──────────────────────────────────────────┤
          │                                           │
          │  /api/v1/                                │
          │    ├─ /auth        (Login, JWT)         │
          │    ├─ /samples     (CRUD Samples)       │
          │    ├─ /reports     (PDF Reports)        │
          │    ├─ /equipment   (Fleet Mgmt)         │
          │    ├─ /customers   (Multi-tenant)       │
          │    ├─ /feedback    (Feedback System)    │
          │    └─ /notifications (Email/SMS)        │
          │                                           │
          └─────────────────┬────────────────────────┘
                            │
          ┌─────────────────▼────────────────────────┐
          │          PACKAGES LAYER                   │
          ├──────────────────────────────────────────┤
          │                                           │
          │  @wearcheck/database (Prisma ORM)        │
          │  @wearcheck/types    (TypeScript Types)  │
          │  @wearcheck/ui       (Shared Components) │
          │  @wearcheck/auth     (Auth Logic)        │
          │  @wearcheck/utils    (Utilities)         │
          │                                           │
          └─────────────────┬────────────────────────┘
                            │
          ┌─────────────────▼────────────────────────┐
          │          DATABASE LAYER                   │
          ├──────────────────────────────────────────┤
          │                                           │
          │  PostgreSQL 15+                          │
          │    ├─ users                              │
          │    ├─ customers (Multi-tenant)           │
          │    ├─ equipment                          │
          │    ├─ components                         │
          │    ├─ samples                            │
          │    ├─ test_results                       │
          │    ├─ reports                            │
          │    ├─ notifications                      │
          │    └─ audit_logs                         │
          │                                           │
          └───────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  WordPress   │  │   Email      │  │   Storage    │          │
│  │  Headless    │  │   (SMTP)     │  │   (S3/R2)    │          │
│  │   CMS        │  │              │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Dados

### 1. Autenticação

```
User → Login Form → API /auth/login → Verify Credentials → Generate JWT → Return Token → Store in Client → Authenticated Requests
```

### 2. Submissão de Amostra

```
Client Portal → Sample Form → API /samples (POST) → Validate → Save to DB → Generate Sample Number → Trigger Notification → Return Response
```

### 3. Geração de Relatório

```
Lab System → Complete Analysis → API /reports (POST) → Generate PDF → Save to Storage → Update Sample Status → Send Email → Notify Customer
```

## 📦 Estrutura de Packages

### @wearcheck/database

Gerencia toda a camada de dados usando Prisma ORM:

- **Schema Prisma**: Define todas as entidades e relações
- **Migrations**: Versionamento do schema
- **Seeds**: Dados iniciais para desenvolvimento
- **Prisma Client**: Cliente type-safe para queries

### @wearcheck/types

Types TypeScript compartilhados:

- User, Customer, Sample types
- API Response types
- Form types
- Enum types

### @wearcheck/ui

Componentes React reutilizáveis:

- Button, Input, Select
- Table, Card, Modal
- Charts, Graphs
- Layout components

### @wearcheck/auth

Lógica de autenticação:

- NextAuth.js configuration
- JWT handling
- Role-based access control (RBAC)
- Session management

### @wearcheck/utils

Funções utilitárias:

- Date formatting
- Number formatting
- Validation helpers
- API helpers

## 🔐 Segurança

### Autenticação

- **JWT Tokens**: Access token (15min) + Refresh token (7 days)
- **NextAuth.js**: Gerenciamento de sessões
- **Password**: Bcrypt hashing (rounds: 12)
- **Email Verification**: Obrigatório para novos users

### Autorização (RBAC)

| Role | Permissions |
|------|-------------|
| SUPER_ADMIN | Acesso total ao sistema |
| ADMIN | Gestão completa do cliente |
| LAB_TECHNICIAN | Processar amostras e relatórios |
| CUSTOMER_USER | Submeter amostras, ver relatórios |
| READONLY | Apenas visualização |

### Multi-Tenancy

- Customer ID em todas as queries
- Row-Level Security no Prisma
- Isolamento de dados por cliente

## 📊 Database Schema

### Core Entities

1. **Users**: Utilizadores do sistema
2. **Customers**: Clientes (multi-tenant)
3. **Sites**: Localizações dos clientes
4. **Equipment**: Equipamentos/máquinas
5. **Components**: Componentes dos equipamentos
6. **Samples**: Amostras submetidas
7. **TestResults**: Resultados das análises
8. **Reports**: Relatórios PDF
9. **Notifications**: Sistema de notificações
10. **AuditLogs**: Logs de auditoria

### Relationships

```
Customer
  ├─ Users (1:N)
  ├─ Sites (1:N)
  ├─ Equipment (1:N)
  └─ Samples (1:N)

Equipment
  ├─ Components (1:N)
  └─ Samples (1:N)

Sample
  ├─ TestResults (1:N)
  └─ Report (1:1)
```

## 🚀 Deployment

### Development

```bash
# Docker Compose
docker-compose up -d
pnpm dev
```

### Production Options

#### Option 1: Cloud Native

- **Frontend**: Vercel
- **API**: Vercel/Railway
- **Database**: Supabase/Neon
- **Storage**: Cloudflare R2
- **CDN**: Cloudflare

#### Option 2: Self-Hosted

- **Infrastructure**: Kubernetes
- **Database**: PostgreSQL (RDS)
- **Load Balancer**: Nginx
- **Cache**: Redis
- **Monitoring**: Grafana + Prometheus

## 🔄 CI/CD Pipeline

```
GitHub Push → GitHub Actions → Run Tests → Build → Deploy to Staging → Manual Approval → Deploy to Production
```

### Environments

- **Development**: Local machine
- **Staging**: Pre-production testing
- **Production**: Live system

## 📈 Monitoring & Observability

### Metrics

- API Response Times
- Database Query Performance
- Error Rates
- User Activity

### Logging

- Application Logs (Structured JSON)
- Database Logs
- Access Logs
- Audit Logs

### Alerts

- Critical Errors
- Performance Degradation
- Security Events
- System Health

## 🧪 Testing Strategy

### Unit Tests

- Functions and utilities
- React components
- API endpoints

### Integration Tests

- API routes with database
- Authentication flows
- File uploads

### E2E Tests

- User workflows
- Critical paths
- Multi-tenant isolation

## 📚 API Documentation

API documentation auto-generated usando:

- **OpenAPI/Swagger**: API specs
- **Postman Collection**: Import ready
- **Examples**: Request/Response samples

## 🤝 Integration Points

### WordPress Headless CMS

```
WordPress REST API → Next.js API → Frontend Components
```

### Email Service

```
System Event → Email Queue → SMTP Service → Customer Email
```

### PDF Generation

```
Report Data → PDF Template → Puppeteer/PDFKit → S3 Storage → Customer Download
```

## 📱 Future Enhancements

- [ ] Mobile App (React Native)
- [ ] Real-time Dashboard (WebSockets)
- [ ] AI/ML Predictive Maintenance
- [ ] IoT Sensor Integration
- [ ] Advanced Analytics Dashboard
- [ ] Multi-language Support
- [ ] Offline Mode (PWA)

## 📞 Support & Maintenance

- **Monitoring**: 24/7 automated monitoring
- **Backups**: Daily database backups
- **Updates**: Monthly dependency updates
- **Security**: Quarterly security audits
