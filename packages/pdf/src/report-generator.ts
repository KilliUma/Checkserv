import PDFDocument from 'pdfkit'
import { Readable } from 'stream'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'

export interface ReportData {
  reportNumber: string
  sampleNumber: string
  reportDate: Date
  sampleDate: Date
  customer: {
    name: string
    code: string
  }
  equipment: {
    equipmentNo: string
    description: string
    make?: string
    model?: string
  }
  component: {
    componentNo: string
    type: string
    fluidType?: string
    fluidGrade?: string
  }
  reading: number
  hoursSinceChange?: number
  testResults: Array<{
    testType: string
    value: string
    unit: string
    limit?: string
    severity?: 'NORMAL' | 'CAUTION' | 'CRITICAL' | 'SEVERE'
  }>
  diagnosticComment?: string
  recommendation?: string
  laboratoryComment?: string
  analyst?: string
}

export class ReportGenerator {
  private doc: PDFKit.PDFDocument
  private yPosition: number = 0

  constructor() {
    this.doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: 'WearCheck Oil Analysis Report',
        Author: 'WearCheck Africa',
      },
    })
  }

  async generateReport(data: ReportData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = []

      this.doc.on('data', (chunk: Buffer) => chunks.push(chunk))
      this.doc.on('end', () => resolve(Buffer.concat(chunks)))
      this.doc.on('error', reject)

      try {
        this.buildReport(data)
        this.doc.end()
      } catch (error) {
        reject(error)
      }
    })
  }

  private buildReport(data: ReportData) {
    this.addHeader(data)
    this.addCustomerInfo(data)
    this.addEquipmentInfo(data)
    this.addTestResults(data)
    this.addComments(data)
    this.addFooter(data)
  }

  private addHeader(data: ReportData) {
    // Logo placeholder (você pode adicionar uma imagem real)
    this.doc
      .fontSize(20)
      .fillColor('#003366')
      .text('WearCheck Africa', 50, 50)
      .fontSize(10)
      .fillColor('#666666')
      .text('Condition Monitoring Specialists', 50, 75)

    // Report title and number
    this.doc
      .fontSize(16)
      .fillColor('#003366')
      .text('OIL ANALYSIS REPORT', 350, 50, { align: 'right' })
      .fontSize(10)
      .fillColor('#666666')
      .text(`Report No: ${data.reportNumber}`, 350, 75, { align: 'right' })
      .text(
        `Date: ${format(data.reportDate, 'dd/MM/yyyy', { locale: pt })}`,
        350,
        90,
        { align: 'right' }
      )

    // Line separator
    this.doc
      .moveTo(50, 110)
      .lineTo(545, 110)
      .strokeColor('#003366')
      .lineWidth(2)
      .stroke()

    this.yPosition = 130
  }

  private addCustomerInfo(data: ReportData) {
    this.doc.fontSize(12).fillColor('#003366').text('CUSTOMER INFORMATION', 50, this.yPosition)

    this.yPosition += 20

    this.addInfoRow('Customer:', data.customer.name)
    this.addInfoRow('Customer Code:', data.customer.code)
    this.addInfoRow(
      'Sample Date:',
      format(data.sampleDate, 'dd/MM/yyyy HH:mm', { locale: pt })
    )
    this.addInfoRow('Sample Number:', data.sampleNumber)

    this.yPosition += 10
  }

  private addEquipmentInfo(data: ReportData) {
    this.doc.fontSize(12).fillColor('#003366').text('EQUIPMENT INFORMATION', 50, this.yPosition)

    this.yPosition += 20

    this.addInfoRow('Equipment No:', data.equipment.equipmentNo)
    this.addInfoRow('Description:', data.equipment.description)
    if (data.equipment.make) {
      this.addInfoRow('Make:', data.equipment.make)
    }
    if (data.equipment.model) {
      this.addInfoRow('Model:', data.equipment.model)
    }
    this.addInfoRow('Component:', `${data.component.componentNo} - ${data.component.type}`)
    if (data.component.fluidType) {
      this.addInfoRow('Fluid Type:', data.component.fluidType)
    }
    if (data.component.fluidGrade) {
      this.addInfoRow('Fluid Grade:', data.component.fluidGrade)
    }
    this.addInfoRow('Reading:', `${data.reading} hours`)
    if (data.hoursSinceChange) {
      this.addInfoRow('Hours Since Change:', `${data.hoursSinceChange} hours`)
    }

    this.yPosition += 10
  }

  private addTestResults(data: ReportData) {
    this.doc.fontSize(12).fillColor('#003366').text('TEST RESULTS', 50, this.yPosition)

    this.yPosition += 20

    // Table header
    const tableTop = this.yPosition
    const colWidths = [200, 80, 60, 80, 70]
    const colPositions = [50, 250, 330, 390, 470]

    this.doc
      .fontSize(10)
      .fillColor('#FFFFFF')
      .rect(50, tableTop, 495, 20)
      .fillAndStroke('#003366', '#003366')

    this.doc
      .fillColor('#FFFFFF')
      .text('Test Type', colPositions[0] + 5, tableTop + 5)
      .text('Value', colPositions[1] + 5, tableTop + 5)
      .text('Unit', colPositions[2] + 5, tableTop + 5)
      .text('Limit', colPositions[3] + 5, tableTop + 5)
      .text('Status', colPositions[4] + 5, tableTop + 5)

    this.yPosition = tableTop + 25

    // Table rows
    data.testResults.forEach((result, index) => {
      const rowColor = index % 2 === 0 ? '#F5F5F5' : '#FFFFFF'
      const severityColor = this.getSeverityColor(result.severity)

      this.doc
        .rect(50, this.yPosition, 495, 20)
        .fillAndStroke(rowColor, '#CCCCCC')

      this.doc
        .fontSize(9)
        .fillColor('#000000')
        .text(result.testType, colPositions[0] + 5, this.yPosition + 5, {
          width: colWidths[0] - 10,
        })
        .text(result.value, colPositions[1] + 5, this.yPosition + 5)
        .text(result.unit, colPositions[2] + 5, this.yPosition + 5)
        .text(result.limit || '-', colPositions[3] + 5, this.yPosition + 5)

      this.doc
        .circle(colPositions[4] + 15, this.yPosition + 10, 6)
        .fillAndStroke(severityColor, severityColor)

      this.yPosition += 20
    })

    this.yPosition += 15

    // Legend
    this.doc.fontSize(8).fillColor('#666666').text('Status Legend:', 50, this.yPosition)

    const legendY = this.yPosition
    this.doc
      .circle(150, legendY + 4, 4)
      .fillAndStroke('#4CAF50', '#4CAF50')
      .fillColor('#666666')
      .text('Normal', 160, legendY)

    this.doc
      .circle(220, legendY + 4, 4)
      .fillAndStroke('#FFC107', '#FFC107')
      .fillColor('#666666')
      .text('Caution', 230, legendY)

    this.doc
      .circle(310, legendY + 4, 4)
      .fillAndStroke('#FF9800', '#FF9800')
      .fillColor('#666666')
      .text('Critical', 320, legendY)

    this.doc
      .circle(380, legendY + 4, 4)
      .fillAndStroke('#F44336', '#F44336')
      .fillColor('#666666')
      .text('Severe', 390, legendY)

    this.yPosition += 25
  }

  private addComments(data: ReportData) {
    if (data.diagnosticComment || data.recommendation || data.laboratoryComment) {
      this.doc.fontSize(12).fillColor('#003366').text('COMMENTS', 50, this.yPosition)

      this.yPosition += 20

      if (data.diagnosticComment) {
        this.addCommentSection('Diagnostic Comment:', data.diagnosticComment)
      }

      if (data.recommendation) {
        this.addCommentSection('Recommendation:', data.recommendation)
      }

      if (data.laboratoryComment) {
        this.addCommentSection('Laboratory Comment:', data.laboratoryComment)
      }
    }
  }

  private addCommentSection(title: string, content: string) {
    this.doc.fontSize(10).fillColor('#003366').text(title, 50, this.yPosition)

    this.yPosition += 15

    this.doc
      .fontSize(9)
      .fillColor('#000000')
      .text(content, 50, this.yPosition, {
        width: 495,
        align: 'justify',
      })

    this.yPosition += this.doc.heightOfString(content, { width: 495 }) + 10
  }

  private addFooter(data: ReportData) {
    const footerY = 750

    // Analyst signature
    if (data.analyst) {
      this.doc
        .fontSize(9)
        .fillColor('#666666')
        .text(`Analyst: ${data.analyst}`, 50, footerY)
    }

    // Company info
    this.doc
      .fontSize(8)
      .fillColor('#666666')
      .text('WearCheck Africa (Pty) Ltd', 50, footerY + 20)
      .text('ISO 9001, ISO 14001, ISO 17025 Certified', 50, footerY + 32)
      .text('Tel: +27 31 700 5460', 50, footerY + 44)
      .text('www.wearcheck.co.za', 50, footerY + 56)

    // Page number
    this.doc
      .fontSize(8)
      .fillColor('#666666')
      .text('Page 1 of 1', 490, footerY + 56, { align: 'right' })

    // Disclaimer
    this.doc
      .fontSize(7)
      .fillColor('#999999')
      .text(
        'This report is issued in accordance with the general terms and conditions available on our website.',
        50,
        footerY + 70,
        { width: 495, align: 'center' }
      )
  }

  private addInfoRow(label: string, value: string) {
    this.doc
      .fontSize(9)
      .fillColor('#666666')
      .text(label, 50, this.yPosition, { width: 120 })
      .fillColor('#000000')
      .text(value, 180, this.yPosition, { width: 365 })

    this.yPosition += 15
  }

  private getSeverityColor(severity?: string): string {
    switch (severity) {
      case 'NORMAL':
        return '#4CAF50'
      case 'CAUTION':
        return '#FFC107'
      case 'CRITICAL':
        return '#FF9800'
      case 'SEVERE':
        return '#F44336'
      default:
        return '#4CAF50'
    }
  }
}

export async function generatePdfReport(data: ReportData): Promise<Buffer> {
  const generator = new ReportGenerator()
  return generator.generateReport(data)
}
