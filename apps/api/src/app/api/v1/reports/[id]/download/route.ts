import { NextResponse } from 'next/server'
import { prisma } from '@wearcheck/database'
import { getAuthTokenPayload } from '../../../../../../lib/auth'
import { ReportGenerator, type ReportData } from '@wearcheck/pdf'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const decoded = getAuthTokenPayload()
    if (!decoded) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const reportWhere: any = {
      id: params.id,
      sample: {},
    }

    if (decoded.customerId) {
      reportWhere.sample.customerId = decoded.customerId
    }

    const report = await prisma.report.findFirst({
      where: reportWhere,
      include: {
        customer: true,
        sample: {
          include: {
            equipment: true,
            component: true,
            testResults: {
              orderBy: { testName: 'asc' },
            },
          },
        },
      },
    })

    if (!report) {
      return NextResponse.json({ error: 'Relatório não encontrado' }, { status: 404 })
    }

    const data: ReportData = {
      reportNumber: report.reportNumber,
      sampleNumber: report.sample.sampleNumber,
      reportDate: report.reportDate,
      sampleDate: report.sample.createdAt,
      customer: {
        name: report.customer.name,
        code: report.customer.registrationNo || report.customer.id,
      },
      equipment: {
        equipmentNo: report.sample.equipment.equipmentNo,
        description: report.sample.equipment.description,
        make: report.sample.equipment.manufacturer || undefined,
        model: report.sample.equipment.model || undefined,
      },
      component: {
        componentNo: report.sample.component?.componentNo || 'N/A',
        type: report.sample.component?.type || 'OTHER',
        fluidType: report.sample.component?.fluidType || report.sample.fluidType || undefined,
        fluidGrade: report.sample.component?.fluidGrade || report.sample.fluidGrade || undefined,
      },
      reading: report.sample.equipmentReading || 0,
      hoursSinceChange: report.sample.hoursSinceChange || undefined,
      testResults: report.sample.testResults.map((result) => ({
        testType: result.testName || result.testType,
        value: result.value?.toString() || result.textResult || '-',
        unit: result.unit || '',
        limit: result.normalMax?.toString(),
        severity: result.severity,
      })),
      diagnosticComment: report.diagnosticComment || undefined,
      recommendation: report.recommendation || undefined,
      laboratoryComment: report.laboratoryComment || undefined,
      analyst: report.approvedBy || undefined,
    }

    const pdfBuffer = await new ReportGenerator().generateReport(data)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="CheckServ_Report_${report.reportNumber}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    return NextResponse.json({ error: 'Erro ao gerar PDF' }, { status: 500 })
  }
}
