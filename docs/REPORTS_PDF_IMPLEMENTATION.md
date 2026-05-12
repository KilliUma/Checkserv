# Sistema de Geração de PDF e Relatórios

## ✅ O que foi implementado

### 1. Package PDF (@wearcheck/pdf)

Gerador completo de relatórios PDF com:
- **Classe ReportGenerator**: Geração de PDFs profissionais usando PDFKit
- **Template customizado**: Layout com cores da marca WearCheck (azul #003366, laranja #FF6600)
- **Cabeçalho**: Logo, título, número do relatório e data
- **Informações do cliente**: Nome, código, data da amostra, número da amostra
- **Informações do equipamento**: Número, descrição, marca, modelo, componente, fluido
- **Tabela de resultados**: Testes com valores, unidades, limites e status (cores por severidade)
- **Legenda de status**: Normal (verde), Caution (amarelo), Critical (laranja), Severe (vermelho)
- **Comentários**: Diagnóstico, recomendações e comentários do laboratório
- **Rodapé**: Analista, informações da empresa, certificações ISO, disclaimer

**Arquivo principal**: [packages/pdf/src/report-generator.ts](packages/pdf/src/report-generator.ts)

### 2. API Endpoints

#### GET /api/v1/reports
Lista relatórios com paginação e filtros:
- Filtros: status, equipmentId, startDate, endDate
- Paginação: page, limit
- Retorna: dados + meta de paginação
- Autenticação: JWT (NextAuth)
- Permissões: Apenas relatórios do customer do usuário

#### GET /api/v1/reports/:id
Busca detalhes de um relatório específico:
- Includes: sample, equipment, component, customer, testResults
- Validação: Apenas relatórios do customer do usuário
- Retorna: relatório completo com todos os relacionamentos

#### GET /api/v1/reports/:id/download
Gera e faz download do PDF do relatório:
- Busca dados do relatório e testes
- Formata dados para o gerador de PDF
- Gera PDF em memório (Buffer)
- Registra download no audit log
- Retorna: arquivo PDF com Content-Disposition attachment

**Arquivos**:
- [apps/api/src/app/api/v1/reports/route.ts](apps/api/src/app/api/v1/reports/route.ts)
- [apps/api/src/app/api/v1/reports/[id]/route.ts](apps/api/src/app/api/v1/reports/[id]/route.ts)
- [apps/api/src/app/api/v1/reports/[id]/download/route.ts](apps/api/src/app/api/v1/reports/[id]/download/route.ts)

### 3. Página de Relatórios (Client Portal)

Interface completa para visualização e gerenciamento de relatórios:
- **Listagem**: Tabela com número, amostra, equipamento, data, status
- **Filtros**: Status, data início/fim, equipamento
- **Botão de filtros**: Mostra/esconde painel de filtros
- **Paginação**: Navegação entre páginas com contador
- **Badges de status**: Cores diferentes por status (Pronto, Gerando, Enviado, etc.)
- **Ações por relatório**:
  - 👁️ Visualizar (abre PDF em nova aba)
  - ⬇️ Download PDF
- **Estados vazios**: Mensagem quando não há relatórios
- **Loading states**: Spinner durante carregamento

**Arquivo**: [apps/client-portal/src/pages/Reports.tsx](apps/client-portal/src/pages/Reports.tsx)

### 4. Database Schema Updates

Campos adicionados ao modelo Report:
```prisma
reportDate      DateTime     @default(now())
diagnosticComment  String?
laboratoryComment  String?
approvedBy      String?
approvedAt      DateTime?
```

**Migration**: `20260210070412_add_report_fields`

### 5. Dados de Teste

Script de seed criado: [packages/database/prisma/seed-reports.ts](packages/database/prisma/seed-reports.ts)

**Relatórios criados**:
- **REP-2026-000001** (Status: READY)
  - Amostra: WCK-2026-000003
  - 8 testes: Viscosidade (2), TBN, Água, Ferro, Cobre, Cromo, Silício
  - Todos resultados normais (exceto Silício em CAUTION)
  
- **REP-2026-000002** (Status: GENERATING)
  - Amostra: WCK-2026-000004
  - 3 testes: Ferro (CRITICAL - 85ppm), Viscosidade (NORMAL), Água (CAUTION)
  - Diagnóstico: "Níveis elevados de ferro detectados"

## 📦 Dependências Instaladas

```json
{
  "pdfkit": "^0.15.0",
  "chartjs-node-canvas": "^4.1.6",
  "date-fns": "^3.6.0",
  "@types/pdfkit": "^0.13.4"
}
```

## 🚀 Como Usar

### 1. Iniciar os serviços
```bash
pnpm dev
```

### 2. Acessar o portal
```
http://localhost:3001/login
```

**Credenciais de teste**:
- Email: `user@demomining.co.za`
- Senha: `Demo@123`

### 3. Navegar para Relatórios
- Click em "Relatórios" no menu lateral
- Visualize a lista de relatórios disponíveis
- Use filtros para buscar relatórios específicos
- Click no botão de olho para visualizar o PDF
- Click no botão de download para baixar o PDF

### 4. Estrutura do PDF Gerado

```
┌─────────────────────────────────────────┐
│  WearCheck Africa                       │
│  Condition Monitoring Specialists       │
│                                         │
│  OIL ANALYSIS REPORT                    │
│  Report No: REP-2026-000001             │
│  Date: 10/02/2026                       │
├─────────────────────────────────────────┤
│  CUSTOMER INFORMATION                   │
│  Customer: Demo Mining Company          │
│  Sample Number: WCK-2026-000003         │
├─────────────────────────────────────────┤
│  EQUIPMENT INFORMATION                  │
│  Equipment: CAT-789D-001                │
│  Description: Caterpillar 789D Dump...  │
├─────────────────────────────────────────┤
│  TEST RESULTS                           │
│  ┌──────────────────────────────────┐  │
│  │Test     │Value│Unit│Limit│Status│  │
│  ├──────────────────────────────────┤  │
│  │Viscosity│146.5│cSt │...  │ 🟢  │  │
│  │...                              │  │
│  └──────────────────────────────────┘  │
│  Legend: 🟢Normal 🟡Caution 🟠Critical │
├─────────────────────────────────────────┤
│  COMMENTS                               │
│  Diagnostic Comment: ...                │
│  Recommendation: ...                    │
│  Laboratory Comment: ...                │
├─────────────────────────────────────────┤
│  Analyst: João Silva - Analista Sênior  │
│  WearCheck Africa (Pty) Ltd             │
│  ISO 9001, ISO 14001, ISO 17025         │
└─────────────────────────────────────────┘
```

## 🔍 Funcionalidades Testadas

- ✅ Geração de PDF com dados reais do banco
- ✅ Formatação correta de datas (PT-BR)
- ✅ Cores de severidade nas tabelas
- ✅ Paginação na listagem de relatórios
- ✅ Filtros por status e data
- ✅ Download de PDF funcional
- ✅ Visualização em nova aba
- ✅ Autenticação e permissões
- ✅ Audit log de downloads

## 📝 Próximas Melhorias (Não Implementadas Ainda)

1. **Email**: Enviar relatório por email
2. **Charts**: Adicionar gráficos de tendência ao PDF
3. **QR Code**: Código QR com link para visualização online
4. **Multi-página**: Suporte para relatórios com 2+ páginas
5. **Assinatura digital**: Assinatura do analista no PDF
6. **Logo customizado**: Upload de logo do cliente
7. **Watermark**: Marca d'água para relatórios draft
8. **Comparação**: Comparar múltiplos relatórios
9. **Export Excel**: Exportar dados em formato Excel
10. **Print optimized**: Versão otimizada para impressão

## 🐛 Issues Conhecidas

- N/A (nenhuma issue conhecida no momento)

## 📊 Status dos Relatórios

| Status | Descrição | Badge |
|--------|-----------|-------|
| QUEUED | Na fila para processamento | Cinza |
| GENERATING | Gerando PDF | Amarelo |
| READY | Pronto para visualização | Verde |
| SENT | Enviado por email | Azul |
| READ | Lido pelo cliente | Cinza |
| ARCHIVED | Arquivado | Cinza |

## 🎨 Cores da Severidade

| Severidade | Cor | Hex | Uso |
|-----------|-----|-----|-----|
| NORMAL | Verde | #4CAF50 | Valores dentro do esperado |
| CAUTION | Amarelo | #FFC107 | Atenção necessária |
| CRITICAL | Laranja | #FF9800 | Crítico - ação requerida |
| SEVERE | Vermelho | #F44336 | Severo - ação imediata |

## 📱 Screenshots

### Listagem de Relatórios
![Listagem](./docs/screenshots/reports-list.png)

### PDF Gerado
![PDF](./docs/screenshots/report-pdf.png)

### Filtros
![Filtros](./docs/screenshots/reports-filters.png)

---

**Data de Implementação**: 10 de Fevereiro de 2026  
**Desenvolvedor**: GitHub Copilot  
**Tempo de Implementação**: ~2-3 horas  
**Complexidade**: Média-Alta
