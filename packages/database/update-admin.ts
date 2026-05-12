import { PrismaClient, UserRole, UserStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('Admin@123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@checkserv.co.ao' },
    update: {
      password: passwordHash,
    },
    create: {
      email: 'admin@checkserv.co.ao',
      name: 'System Admin',
      password: passwordHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
    },
  })
  
  console.log('✅ Admin atualizado:', admin.email)
  console.log('   Email: admin@checkserv.co.ao')
  console.log('   Senha: Admin@123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
