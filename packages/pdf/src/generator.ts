import PDFDocument from 'pdfkit'

export interface ReportData {
  sampleNumber: string
  customer: {
    name: string
    contact: string
  }
  equipment: {
    equipmentNo: string
    description: string
    make: string
    model: string
  }
  sample: {
    type: string
    dateReceived: Date
    dateTested: Date
    reading: number
    fluidType: string
    fluidGrade: string
  }
  testResults: Array<{
    testType: string
    value: number
    unit: string
    limit: number
    severity: string
  }>
  recommendation: string
  comments: string
}

export class PDFGenerator {
  generateReport(data: ReportData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 50 })
        const buffers: Buffer[] = []

        doc.on('data', buffers.push.bind(buffers))
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers)
          resolve(pdfBuffer)
        })

        // Header
        doc
          .fontSize(20)
          .fillColor('#003366')
          .text('WearCheck Africa', { align: 'center' })
        
        doc
          .fontSize(16)
          .text('Relatório de Análise de Fluidos', { align: 'center' })
          .moveDown(2)

        // Sample Information
        doc
          .fontSize(12)
          .fillColor('#000000')
          .text(`Número da Amostra: ${data.sampleNumber}`, { bold: true })
          .text(`Data de Recebimento: ${data.sample.dateReceived.toLocaleDateString('pt-BR')}`)
          .text(`Data de Teste: ${data.sample.dateTested.toLocaleDateString('pt-BR')}`)
          .moveDown()

        // Customer Information
        doc
          .fontSize(14)
          .fillColor('#003366')
          .text('Informações do Cliente')
          .fontSize(12)
          .fillColor('#000000')
          .text(`Nome: ${data.customer.name}`)
          .text(`Contacto: ${data.customer.contact}`)
          .moveDown()

        // Equipment Information
        doc
          .fontSize(14)
          .fillColor('#003366')
          .text('Informações do Equipamento')
          .fontSize(12)
          .fillColor('#000000')
          .text(`Número: ${data.equipment.equipmentNo}`)
          .text(`Descrição: ${data.equipment.description}`)
          .text(`Marca/Modelo: ${data.equipment.make} ${data.equipment.model}`)
          .text(`Leitura: ${data.sample.reading} horas`)
          .moveDown()

        // Test Results
        doc
          .fontSize(14)
          .fillColor('#003366')
          .text('Resultados dos Testes')
          .moveDown(0.5)

        // Table header
        const tableTop = doc.y
        const col1X = 50
        const col2X = 200
        const col3X = 300
        const col4X = 400
        const col5X = 480

        doc
          .fontSize(10)
          .fillColor('#FFFFFF')
          .rect(col1X, tableTop, 530, 20)
          .fill('#003366')
          .fillColor('#FFFFFF')
          .text('Teste', col1X + 5, tableTop + 5, { width: 140 })
          .text('Valor', col2X + 5, tableTop + 5, { width: 90 })
          .text('Unidade', col3X + 5, tableTop + 5, { width: 90 })
          .text('Limite', col4X + 5, tableTop + 5, { width: 70 })
          .text('Severidade', col5X + 5, tableTop + 5, { width: 90 })

        let currentY = tableTop + 25

        data.testResults.forEach((result, index) => {
          const bgColor = index % 2 === 0 ? '#F3F4F6' : '#FFFFFF'
          
          doc
            .rect(col1X, currentY, 530, 20)
            .fill(bgColor)
            .fillColor('#000000')
            .fontSize(9)
            .text(result.testType, col1X + 5, currentY + 5, { width: 140 })
            .text(result.value.toString(), col2X + 5, currentY + 5, { width: 90 })
            .text(result.unit, col3X + 5, currentY + 5, { width: 90 })
            .text(result.limit.toString(), col4X + 5, currentY + 5, { width: 70 })

          // Severity color
          const severityColor = 
            result.severity === 'CRITICAL' ? '#EF4444' :
            result.severity === 'WARNING' ? '#F59E0B' :
            result.severity === 'CAUTION' ? '#FCD34D' : '#10B981'

          doc
            .fillColor(severityColor)
            .text(result.severity, col5X + 5, currentY + 5, { width: 90 })

          currentY += 20
        })

        doc.moveDown(2)

        // Recommendation
        doc
          .fontSize(14)
          .fillColor('#003366')
          .text('Recomendação')
          .fontSize(12)
          .fillColor('#000000')
          .text(data.recommendation)
          .moveDown()

        // Comments
        if (data.comments) {
          doc
            .fontSize(14)
            .fillColor('#003366')
            .text('Comentários')
            .fontSize(12)
            .fillColor('#000000')
            .text(data.comments)
        }

        // Footer
        doc
          .fontSize(8)
          .fillColor('#6B7280')
          .text(
            'WearCheck Africa - Tel: +27 31 700 5460 - Email: info@wearcheck.co.za',
            50,
            doc.page.height - 50,
            { align: 'center' }
          )

        doc.end()
      } catch (error) {
        reject(error)
      }
    })
  }
}
