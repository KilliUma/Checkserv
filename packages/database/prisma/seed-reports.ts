import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedReports() {
  console.log('🌱 Criando relatórios de exemplo...')

  // Deletar relatórios e amostras de teste anteriores
  await prisma.testResult.deleteMany({ where: { sample: { sampleNumber: { startsWith: 'WCK-2026-0000' } } } })
  await prisma.report.deleteMany({ where: { reportNumber: { startsWith: 'REP-2026-' } } })
  await prisma.sample.deleteMany({ where: { sampleNumber: { in: ['WCK-2026-000003', 'WCK-2026-000004'] } } })

  // Buscar amostra existente
  const existingSample = await prisma.sample.findFirst({
    where: { sampleNumber: 'WCK-2026-000001' },
    include: { customer: true, equipment: true, component: true },
  })

  if (!existingSample) {
    console.log('❌ Amostra não encontrada')
    return
  }

  // Criar nova amostra para o relatório
  const sample = await prisma.sample.create({
    data: {
      sampleNumber: 'WCK-2026-000003',
      customer: { connect: { id: existingSample.customerId } },
      equipment: { connect: { id: existingSample.equipmentId } },
      component: existingSample.componentId
        ? { connect: { id: existingSample.componentId } }
        : undefined,
      submittedUser: { connect: { id: existingSample.submittedBy } },
      equipmentReading: 1500,
      hoursSinceChange: 250,
      status: 'COMPLETED',
    },
  })

  // Criar relatório
  const report = await prisma.report.create({
    data: {
      reportNumber: 'REP-2026-000001',
      sampleId: sample.id,
      customerId: sample.customerId,
      reportDate: new Date(),
      status: 'READY',
      diagnosticComment:
        'A análise da amostra indica níveis normais de contaminação. Viscosidade dentro dos parâmetros esperados. Não foram detectadas partículas de desgaste significativas.',
      recommendation:
        'Continue com o programa de monitoramento regular. Próxima amostra recomendada em 250 horas de operação.',
      laboratoryComment: 'Análise realizada conforme ISO 17025. Todas as medições dentro da tolerância.',
      approvedBy: 'João Silva - Analista Sênior',
      approvedAt: new Date(),
    },
  })

  console.log(`✅ Relatório criado: ${report.reportNumber}`)

  // Criar resultados de testes
  const testResults = [
    {
      sampleId: sample.id,
      testType: 'VISCOSITY',
      testName: 'Viscosidade @ 40°C',
      value: 146.5,
      unit: 'cSt',
      normalMin: 130,
      normalMax: 170,
      severity: 'NORMAL',
    },
    {
      sampleId: sample.id,
      testType: 'VISCOSITY',
      testName: 'Viscosidade @ 100°C',
      value: 14.8,
      unit: 'cSt',
      normalMin: 12,
      normalMax: 16,
      severity: 'NORMAL',
    },
    {
      sampleId: sample.id,
      testType: 'TBN',
      testName: 'TBN (Total Base Number)',
      value: 8.5,
      unit: 'mgKOH/g',
      normalMin: 6.0,
      severity: 'NORMAL',
    },
    {
      sampleId: sample.id,
      testType: 'WATER_CONTENT',
      testName: 'Teor de Água',
      value: 0.05,
      unit: '%',
      normalMax: 0.2,
      severity: 'NORMAL',
    },
    {
      sampleId: sample.id,
      testType: 'SPECTROMETRIC',
      testName: 'Ferro (Fe)',
      value: 12,
      unit: 'ppm',
      normalMax: 30,
      severity: 'NORMAL',
    },
    {
      sampleId: sample.id,
      testType: 'SPECTROMETRIC',
      testName: 'Cobre (Cu)',
      value: 5,
      unit: 'ppm',
      normalMax: 15,
      severity: 'NORMAL',
    },
    {
      sampleId: sample.id,
      testType: 'SPECTROMETRIC',
      testName: 'Cromo (Cr)',
      value: 2,
      unit: 'ppm',
      normalMax: 10,
      severity: 'NORMAL',
    },
    {
      sampleId: sample.id,
      testType: 'SPECTROMETRIC',
      testName: 'Silício (Si)',
      value: 18,
      unit: 'ppm',
      normalMax: 25,
      severity: 'CAUTION',
    },
  ]

  await prisma.testResult.createMany({
    data: testResults,
  })

  console.log(`✅ ${testResults.length} resultados de testes criados`)

  // Criar mais alguns relatórios com diferentes status
  const sample2 = await prisma.sample.create({
    data: {
      sampleNumber: 'WCK-2026-000004',
      customer: { connect: { id: existingSample.customerId } },
      equipment: { connect: { id: existingSample.equipmentId } },
      component: existingSample.componentId
        ? { connect: { id: existingSample.componentId } }
        : undefined,
      submittedUser: { connect: { id: existingSample.submittedBy } },
      equipmentReading: 1850,
      hoursSinceChange: 375,
      status: 'COMPLETED',
    },
  })

  const report2 = await prisma.report.create({
    data: {
      reportNumber: 'REP-2026-000002',
      sampleId: sample2.id,
      customerId: existingSample.customerId,
      reportDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
      status: 'GENERATING',
      diagnosticComment:
        'Níveis elevados de ferro detectados. Possível desgaste nos rolamentos.',
      recommendation:
        'AÇÃO IMEDIATA: Inspecionar rolamentos. Coletar nova amostra em 50 horas.',
    },
  })

  await prisma.testResult.createMany({
    data: [
      {
        sampleId: sample2.id,
        testType: 'SPECTROMETRIC',
        testName: 'Ferro (Fe)',
        value: 85,
        unit: 'ppm',
        normalMax: 30,
        severity: 'CRITICAL',
      },
      {
        sampleId: sample2.id,
        testType: 'VISCOSITY',
        testName: 'Viscosidade @ 40°C',
        value: 152,
        unit: 'cSt',
        normalMin: 130,
        normalMax: 170,
        severity: 'NORMAL',
      },
      {
        sampleId: sample2.id,
        testType: 'WATER_CONTENT',
        testName: 'Teor de Água',
        value: 0.35,
        unit: '%',
        normalMax: 0.2,
        severity: 'CAUTION',
      },
    ],
  })

  console.log(`✅ Relatório 2 criado: ${report2.reportNumber}`)

  console.log('✅ Seed de relatórios concluído!')
}

seedReports()
  .catch((e) => {
    console.error('❌ Erro ao criar relatórios:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
