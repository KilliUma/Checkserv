#!/bin/bash

# 🚀 WearCheck Platform - Setup Script
# Este script instala todas as dependências necessárias para o projeto

set -e

echo "🧪 WearCheck Platform - Setup"
echo "=============================="
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado!"
    echo "📥 Instalar Node.js >= 20.0.0"
    echo "   https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "⚠️  Node.js $NODE_VERSION detectado. Necessário >= 20.0.0"
    exit 1
fi
echo "✅ Node.js $(node -v) detectado"

# Verificar pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📥 Instalando pnpm..."
    npm install -g pnpm@latest
fi
echo "✅ pnpm $(pnpm -v) detectado"

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker não encontrado (opcional para desenvolvimento)"
    echo "   Instalar: https://www.docker.com/products/docker-desktop"
else
    echo "✅ Docker $(docker -v | cut -d ' ' -f 3 | tr -d ',') detectado"
fi

echo ""
echo "📦 Instalando dependências..."
pnpm install

echo ""
echo "🔧 Configurando ambiente..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Arquivo .env criado"
    echo "⚠️  IMPORTANTE: Editar .env com suas configurações!"
else
    echo "✅ Arquivo .env já existe"
fi

echo ""
echo "🐳 Iniciando serviços Docker..."
if command -v docker &> /dev/null; then
    docker-compose up -d postgres redis
    echo "⏳ Aguardando PostgreSQL iniciar..."
    sleep 10
    echo "✅ Serviços Docker iniciados"
else
    echo "⚠️  Docker não disponível - configurar PostgreSQL manualmente"
fi

echo ""
echo "🗄️  Configurando database..."
pnpm db:generate
echo "✅ Prisma Client gerado"

echo ""
echo "📊 Executando migrations..."
pnpm db:migrate
echo "✅ Migrations executadas"

echo ""
read -p "🌱 Deseja executar o seed (dados demo)? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    pnpm --filter @wearcheck/database db:seed
    echo "✅ Seed executado"
    echo ""
    echo "🔐 Credenciais Demo:"
    echo "   Email: user@demomining.co.za"
    echo "   Password: Demo@123"
fi

echo ""
echo "🎉 Setup completo!"
echo ""
echo "🚀 Para iniciar o desenvolvimento:"
echo "   pnpm dev"
echo ""
echo "📚 Documentação:"
echo "   - README.md"
echo "   - docs/QUICKSTART.md"
echo "   - docs/DEVELOPMENT.md"
echo ""
echo "🌐 URLs:"
echo "   - Client Portal: http://localhost:3001"
echo "   - API: http://localhost:3003"
echo "   - Prisma Studio: pnpm db:studio"
echo ""
