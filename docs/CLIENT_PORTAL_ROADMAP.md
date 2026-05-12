# Plano de Implementação - Portal de Cliente WearCheck

**Prioridade**: ALTA  
**Status**: Em Desenvolvimento  
**Data**: 10 de fevereiro de 2026

---

## ✅ JÁ IMPLEMENTADO (Fase 1)

### Infraestrutura
- ✅ Monorepo Turborepo + pnpm
- ✅ PostgreSQL + Prisma ORM
- ✅ 4 Apps criados (web, client-portal, backoffice, api)
- ✅ 7 Packages utilitários
- ✅ Sistema de autenticação (NextAuth.js)
- ✅ Componentes UI reutilizáveis

### Portal de Cliente (Básico)
- ✅ Login/Logout
- ✅ Dashboard com métricas
- ✅ Listagem de amostras
- ✅ Formulário de submissão de amostras
- ✅ Rotas protegidas
- ✅ Navegação entre páginas

---

## 🚧 A IMPLEMENTAR (Fase 2)

### 1. Relatórios (PRIORIDADE MÁXIMA)

#### Backend (API)
```typescript
// packages/pdf/src/report-generator.ts
- Geração de PDF com PDFKit
- Templates de relatórios
- Gráficos e tabelas
- Logos e assinaturas digitais
```

#### Endpoints
```
GET  /api/v1/reports - Listar relatórios
GET  /api/v1/reports/:id - Ver relatório
GET  /api/v1/reports/:id/download - Download PDF
POST /api/v1/reports/:id/email - Enviar por email
```

#### Frontend
```typescript
// apps/client-portal/src/pages/Reports.tsx
- Tabela com filtros (data, status, equipamento)
- Preview de PDF inline
- Botão de download
- Envio por email
- Histórico de downloads
```

### 2. Gestão Completa de Equipamentos

#### Funcionalidades
- CRUD de equipamentos
- Gestão de componentes (associar múltiplos)
- Sites/Localizações
- Upload de fotos
- Histórico de manutenção
- Tags e categorização
- QR Codes para identificação

#### Páginas
```
/equipamentos - Lista
/equipamentos/novo - Criar
/equipamentos/:id - Ver detalhes
/equipamentos/:id/editar - Editar
/equipamentos/:id/componentes - Componentes
/equipamentos/:id/historico - Histórico
```

### 3. Sistema de Notificações

#### Tipos de Notificações
- Amostra recebida no laboratório
- Análise concluída
- Relatório disponível
- Ação crítica detectada
- Feedback recebido
- Avisos do sistema

#### Canais
- In-app (Centro de notificações)
- Email
- SMS (futuro)
- Push notifications (futuro)

#### Componentes
```typescript
// apps/client-portal/src/components/NotificationCenter.tsx
- Badge com contador
- Dropdown com lista
- Marcar como lida
- Filtros por tipo
- Histórico completo
```

### 4. Analytics e Dashboards

#### Gráficos Principais
- Tendência de contaminação ao longo do tempo
- Comparação entre equipamentos
- Desgaste de componentes
- Consumo de óleo
- Custos de manutenção
- Previsão de falhas

#### Bibliotecas
- Recharts (já instalado)
- Date-fns para manipulação de datas
- Export para Excel/CSV

### 5. Sistema de Feedback

#### Funcionalidades
- Feedback sobre amostras específicas
- Comunicação com laboratório
- Rating de serviços
- Histórico de conversas
- Anexos (fotos, documentos)

#### Tipos
- COMPLAINT (Reclamação)
- QUESTION (Questão)
- SUGGESTION (Sugestão)
- COMPLIMENT (Elogio)
- OTHER (Outro)

---

## 📋 TAREFAS DETALHADAS

### Tarefa 1: Implementar Geração de PDF
**Tempo estimado**: 2-3 dias

1. Criar serviço de PDF no package @wearcheck/pdf
2. Template de relatório baseado no design atual
3. Incluir gráficos (usar canvas + chart.js)
4. Endpoint de download
5. Endpoint de envio por email
6. Testes com dados reais

### Tarefa 2: Completar Página de Relatórios
**Tempo estimado**: 1-2 dias

1. Tabela com colunas: Nº, Data, Equipamento, Status, Ações
2. Filtros: Data (range), Equipamento, Status
3. Preview de PDF (iframe ou PDF.js)
4. Botões de ação (Download, Email, Imprimir)
5. Paginação
6. Loading states

### Tarefa 3: CRUD de Equipamentos
**Tempo estimado**: 2-3 dias

1. Formulário de criação com validação
2. Upload de imagens (logo, fotos)
3. Seleção de site/localização
4. Gestão de componentes inline
5. Página de detalhes completa
6. Edição e exclusão
7. Geração de QR Code

### Tarefa 4: Sistema de Componentes
**Tempo estimado**: 1-2 dias

1. Modal de adição de componente
2. Especificações de fluido
3. Campos personalizáveis
4. Histórico de trocas
5. Alertas de manutenção

### Tarefa 5: Centro de Notificações
**Tempo estimado**: 2 dias

1. Componente de badge com contador
2. Dropdown com lista de notificações
3. Página completa de notificações
4. Filtros (lidas/não lidas, tipo)
5. Ações (marcar como lida, excluir)
6. API endpoints

### Tarefa 6: Email Service
**Tempo estimado**: 1 dia

1. Templates de email (Nodemailer)
2. Serviço de envio assíncrono
3. Fila de emails (opcional)
4. Tracking de envios
5. Logs de erros

### Tarefa 7: Analytics Dashboard
**Tempo estimado**: 3-4 dias

1. Componentes de gráfico reutilizáveis
2. API de agregação de dados
3. Filtros de período
4. Comparações
5. Export de dados
6. Gráficos:
   - Linha (tendências)
   - Barra (comparações)
   - Pizza (distribuições)
   - Área (volumes)

### Tarefa 8: Feedback System
**Tempo estimado**: 2 dias

1. Formulário de feedback
2. Rating com estrelas
3. Upload de anexos
4. API endpoints
5. Página de histórico
6. Status tracking (Aberto, Em análise, Resolvido)

### Tarefa 9: Perfil de Usuário
**Tempo estimado**: 1 dia

1. Página de perfil
2. Edição de dados
3. Troca de senha
4. Preferências (idioma, notificações)
5. Avatar/foto de perfil

### Tarefa 10: Melhorias de UX
**Tempo estimado**: Contínuo

1. Loading skeletons
2. Error boundaries
3. Toast notifications (react-hot-toast)
4. Confirmações de ações destrutivas
5. Animações suaves
6. Responsividade mobile
7. Dark mode (opcional)

---

## 🎯 CRONOGRAMA SUGERIDO

### Semana 1
- Dias 1-2: Geração de PDF + Templates
- Dias 3-4: Página de Relatórios
- Dia 5: Email Service

### Semana 2
- Dias 1-3: CRUD de Equipamentos
- Dias 4-5: Sistema de Componentes

### Semana 3
- Dias 1-2: Centro de Notificações
- Dias 3-5: Analytics Dashboard

### Semana 4
- Dias 1-2: Sistema de Feedback
- Dia 3: Perfil de Usuário
- Dias 4-5: Polimento e testes

---

## 🧪 TESTING

### Testes Necessários
- [ ] Testes unitários (Vitest)
- [ ] Testes de integração
- [ ] Testes E2E (Playwright)
- [ ] Testes de carga
- [ ] Testes de segurança

### Validações
- [ ] Validação com usuários reais
- [ ] Comparação com portal atual
- [ ] Performance benchmarks
- [ ] Compatibilidade de browsers

---

## 📚 RECURSOS NECESSÁRIOS

### Dependências Adicionais
```json
{
  "pdfkit": "^0.15.0",
  "canvas": "^2.11.2",
  "chartjs-node-canvas": "^4.1.6",
  "react-hot-toast": "^2.4.1",
  "react-dropzone": "^14.2.3",
  "qrcode": "^1.5.3",
  "xlsx": "^0.18.5"
}
```

### Assets
- Logo WearCheck (SVG)
- Ícones dos serviços
- Imagens de laboratórios
- Templates de email

### Documentação
- API documentation (Swagger/OpenAPI)
- User manual
- Developer guide
- Deployment guide

---

## 🚀 DEPLOYMENT

### Ambientes
1. **Development** - localhost
2. **Staging** - staging.wearcheck.co.za
3. **Production** - online.wearcheck.co.za

### Checklist de Deploy
- [ ] Build sem erros
- [ ] Migrations aplicadas
- [ ] Seed data (se necessário)
- [ ] Environment variables configuradas
- [ ] SSL certificates
- [ ] Backup do banco de dados
- [ ] Testes de smoke
- [ ] Monitoramento ativo

---

**Nota**: Este é um plano vivo que será atualizado conforme o progresso do projeto.
