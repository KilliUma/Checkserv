import { NextResponse } from 'next/server'
import { prisma } from '@wearcheck/database'
import { getAuthTokenPayload } from '../../../../../../lib/auth'
// import { generatePdfReport, type ReportData } from '@wearcheck/pdf'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const decoded = getAuthTokenPayload()
    if (!decoded) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // TODO: Implementar geração de PDF
    // Por enquanto, retorna um erro informando que a funcionalidade está em desenvolvimento
    return NextResponse.json(
      { error: 'Geração de PDF em desenvolvimento' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    return NextResponse.json({ error: 'Erro ao gerar PDF' }, { status: 500 })
  }
}
