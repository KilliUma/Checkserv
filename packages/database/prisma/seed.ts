import { PrismaClient, UserRole, UserStatus, CustomerStatus } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // 1. Criar cliente demo
  const demoCustomer = await prisma.customer.upsert({
    where: { registrationNo: 'DEMO-001' },
    update: {},
    create: {
      name: 'Demo Mining Company',
      tradingName: 'Demo Mining',
      registrationNo: 'DEMO-001',
      status: CustomerStatus.ACTIVE,
      email: 'contact@demomining.co.za',
      phone: '+27 11 123 4567',
      addressLine1: '123 Mining Street',
      city: 'Johannesburg',
      state: 'Gauteng',
      postalCode: '2000',
      country: 'ZA',
    },
  })

  console.log('✅ Cliente demo criado')

  // 2. Criar site
  const demoSite = await prisma.site.create({
    data: {
      name: 'Main Mine Site',
      code: 'JHB-01',
      customerId: demoCustomer.id,
      addressLine1: 'Mine Location 1',
      city: 'Johannesburg',
      country: 'ZA',
      contactName: 'John Doe',
      contactEmail: 'john@demomining.co.za',
    },
  })

  console.log('✅ Site criado')

  // 3. Criar utilizadores
  const passwordHash = await hash('Admin@123', 12)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@checkserv.co.ao' },
    update: {},
    create: {
      email: 'admin@checkserv.co.ao',
      name: 'System Admin',
      password: passwordHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
    },
  })

  const customerUser = await prisma.user.upsert({
    where: { email: 'user@demomining.co.za' },
    update: {},
    create: {
      email: 'user@demomining.co.za',
      name: 'Demo User',
      password: passwordHash,
      role: UserRole.CUSTOMER_USER,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      customerId: demoCustomer.id,
      preferences: {
        notifications: { email: true, inApp: true },
        language: 'pt',
        timezone: 'Africa/Johannesburg',
      },
    },
  })

  console.log('✅ Utilizadores criados')
  console.log('   Admin: admin@checkserv.co.ao / Admin@123')
  console.log('   User: user@demomining.co.za / Admin@123')

  // 4. Criar equipamento
  const equipment = await prisma.equipment.create({
    data: {
      equipmentNo: 'CAT-789D-001',
      description: 'Caterpillar 789D Mining Truck',
      manufacturer: 'Caterpillar',
      model: '789D',
      year: 2020,
      serialNumber: 'CAT123456789',
      status: 'ACTIVE',
      customerId: demoCustomer.id,
      siteId: demoSite.id,
      currentReading: 5420.5,
      readingUnit: 'hours',
      tags: ['Mining', 'Heavy Equipment', 'Fleet-A'],
    },
  })

  console.log('✅ Equipamento criado')

  // 5. Criar componentes
  const engineComponent = await prisma.component.create({
    data: {
      componentNo: 'ENG-001',
      type: 'ENGINE',
      description: 'Main Engine',
      manufacturer: 'Caterpillar',
      model: '3516B',
      equipmentId: equipment.id,
      compartment: 'Engine',
      fluidType: 'Engine Oil',
      fluidGrade: '15W-40',
      fluidCapacity: 95.0,
      serviceInterval: 500,
      isActive: true,
    },
  })

  await prisma.component.create({
    data: {
      componentNo: 'HYD-001',
      type: 'HYDRAULIC_SYSTEM',
      description: 'Hydraulic System',
      equipmentId: equipment.id,
      compartment: 'Hydraulics',
      fluidType: 'Hydraulic Oil',
      fluidGrade: 'ISO 68',
      fluidCapacity: 200.0,
      serviceInterval: 1000,
      isActive: true,
    },
  })

  console.log('✅ Componentes criados')

  // 6. Criar amostra demo
  const sample = await prisma.sample.create({
    data: {
      sampleNumber: 'WCK-2026-000001',
      customerId: demoCustomer.id,
      siteId: demoSite.id,
      equipmentId: equipment.id,
      componentId: engineComponent.id,
      type: 'ROUTINE',
      status: 'COMPLETED',
      priority: 'NORMAL',
      equipmentReading: 5420.5,
      fluidType: 'Engine Oil',
      fluidGrade: '15W-40',
      hoursSinceChange: 420,
      submittedBy: customerUser.id,
      receivedAt: new Date(),
      analyzedAt: new Date(),
    },
  })

  console.log('✅ Amostra criada')

  // 7. Criar resultados de teste
  await prisma.testResult.createMany({
    data: [
      {
        sampleId: sample.id,
        testType: 'SPECTROMETRIC',
        testName: 'Iron (Fe)',
        value: 45,
        unit: 'ppm',
        normalMax: 50,
        cautionMax: 100,
        criticalMax: 150,
        severity: 'NORMAL',
      },
      {
        sampleId: sample.id,
        testType: 'SPECTROMETRIC',
        testName: 'Copper (Cu)',
        value: 12,
        unit: 'ppm',
        normalMax: 20,
        cautionMax: 40,
        criticalMax: 60,
        severity: 'NORMAL',
      },
      {
        sampleId: sample.id,
        testType: 'VISCOSITY',
        testName: 'Viscosity @ 40°C',
        value: 105.2,
        unit: 'cSt',
        normalMin: 95,
        normalMax: 115,
        severity: 'NORMAL',
      },
      {
        sampleId: sample.id,
        testType: 'WATER_CONTENT',
        testName: 'Water Content',
        value: 0.05,
        unit: '%',
        normalMax: 0.1,
        cautionMax: 0.2,
        severity: 'NORMAL',
      },
    ],
  })

  console.log('✅ Resultados de teste criados')

  // 8. Criar relatório
  await prisma.report.create({
    data: {
      sampleId: sample.id,
      customerId: demoCustomer.id,
      reportNumber: 'RPT-2026-000001',
      status: 'READY',
      pdfPages: 2,
      recommendation: 'Continue Sampling',
      problemType: 'None',
      summary: {
        overallStatus: 'NORMAL',
        criticalFindings: 0,
        cautionFindings: 0,
        normalFindings: 4,
      },
    },
  })

  console.log('✅ Relatório criado')

  // 9. System settings
  await prisma.systemSetting.createMany({
    data: [
      {
        key: 'email.smtp.enabled',
        value: true,
        category: 'email',
        description: 'Enable SMTP email sending',
      },
      {
        key: 'pdf.default.pages',
        value: 2,
        category: 'pdf',
        description: 'Default PDF pages for reports',
      },
      {
        key: 'limits.iron.normal',
        value: 50,
        category: 'limits',
        description: 'Normal limit for Iron (ppm)',
      },
    ],
  })

  console.log('✅ System settings criados')
  console.log('🎉 Seed completo!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
