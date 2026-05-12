#!/bin/bash

# Script para preparar deploy no cPanel
# Uso: ./scripts/export-for-cpanel.sh

set -e

echo "🚀 Preparando deploy para cPanel..."

# 1. Build
echo "📦 Building applications..."
pnpm build

# 2. Gerar SQL
echo "🗄️ Gerando SQL do schema..."
cd packages/database
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > ../../cpanel-deploy/database-schema.sql

# 3. Criar diretório de deploy
echo "📁 Criando pasta de deploy..."
cd ../..
mkdir -p cpanel-deploy

# 4. Copiar arquivos necessários
echo "📋 Copiando arquivos..."
cp -r apps/api/.next cpanel-deploy/api-next
cp -r apps/client-portal/dist cpanel-deploy/client-portal
cp -r apps/backoffice/dist cpanel-deploy/backoffice
cp package.json cpanel-deploy/
cp pnpm-lock.yaml cpanel-deploy/

# 5. Criar .env.example
cat > cpanel-deploy/.env.production << EOF
# Configuração para cPanel
DATABASE_URL="mysql://USUARIO_CPANEL:SENHA@localhost:3306/wearcheck_prod"
NEXTAUTH_SECRET="GERE_UM_SECRET_SEGURO"
NEXTAUTH_URL="https://seudominio.com"
NODE_ENV="production"
EOF

# 6. Criar instruções
cat > cpanel-deploy/INSTRUCOES.md << EOF
# Instruções de Deploy no cPanel

## 1. Banco de Dados
1. No cPanel, vá em **MySQL Databases**
2. Crie banco: \`wearcheck_prod\`
3. Crie usuário com senha forte
4. Vincule usuário ao banco (ALL PRIVILEGES)
5. Abra **phpMyAdmin**
6. Importe o arquivo: \`database-schema.sql\`

## 2. Upload de Arquivos
1. No cPanel, abra **File Manager**
2. Navegue até o diretório da aplicação
3. Faça upload de todos os arquivos desta pasta
4. Ou use FTP (FileZilla, etc.)

## 3. Configurar Node.js (se disponível)
1. No cPanel, procure **Setup Node.js App**
2. Crie nova aplicação
3. Defina:
   - Node version: 18.x ou superior
   - Application root: /home/usuario/wearcheck
   - Application URL: seu domínio
4. Adicione variáveis de ambiente do arquivo \`.env.production\`

## 4. Instalar Dependências
Via terminal SSH (se disponível):
\`\`\`bash
cd ~/wearcheck
npm install --production
\`\`\`

## 5. Iniciar Aplicação
No cPanel Node.js App, clique em "Restart"

## Connection String
\`\`\`
DATABASE_URL="mysql://usuario_cpanel:senha@localhost:3306/wearcheck_prod"
\`\`\`

Substitua:
- \`usuario_cpanel\`: seu usuário MySQL do cPanel
- \`senha\`: senha do usuário MySQL
- \`wearcheck_prod\`: nome do banco criado
EOF

echo "✅ Deploy preparado em: ./cpanel-deploy/"
echo "📖 Leia as instruções em: ./cpanel-deploy/INSTRUCOES.md"
echo ""
echo "Próximos passos:"
echo "1. Faça upload da pasta cpanel-deploy/ para o servidor"
echo "2. No cPanel, importe database-schema.sql via phpMyAdmin"
echo "3. Configure as variáveis de ambiente"
echo "4. Inicie a aplicação"
