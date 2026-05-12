import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Criar empresa cliente (ou buscar se já existe)
  let customer = await prisma.customer.findFirst({
    where: { email: 'contato@empresateste.co.ao' },
  })

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        name: 'Empresa Teste Lda',
        tradingName: 'Empresa Teste',
        email: 'contato@empresateste.co.ao',
        phone: '+244 923 456 789',
        status: 'ACTIVE',
        country: 'Angola',
      },
    })
  } else {
    customer = await prisma.customer.update({
      where: { id: customer.id },
      data: { status: 'ACTIVE' },
    })
  }

  console.log('✅ Empresa criada:', customer.name)

  // Hash da senha
  const hashedPassword = await bcrypt.hash('Cliente@123', 12)

  // Criar ou atualizar usuário cliente
  const user = await prisma.user.upsert({
    where: { email: 'cliente@empresateste.co.ao' },
    update: {
      password: hashedPassword,
      status: 'ACTIVE',
      role: 'CUSTOMER_USER',
      customerId: customer.id,
    },
    create: {
      email: 'cliente@empresateste.co.ao',
      name: 'João Silva',
      password: hashedPassword,
      role: 'CUSTOMER_USER',
      status: 'ACTIVE',
      customerId: customer.id,
      phone: '+244 923 456 789',
    },
  })

  console.log('✅ Usuário cliente criado:', user.email)
  console.log('📧 Email:', user.email)
  console.log('🔑 Senha: Cliente@123')
  console.log('🏢 Empresa:', customer.name)
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
