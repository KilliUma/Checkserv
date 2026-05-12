import nodemailer from 'nodemailer'

export interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
}

export class EmailService {
  private transporter: nodemailer.Transporter

  constructor(config: EmailConfig) {
    this.transporter = nodemailer.createTransport(config)
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: '"WearCheck" <noreply@wearcheck.co.za>',
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        attachments: options.attachments,
      })
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      throw error
    }
  }

  async sendReportEmail(to: string, reportData: {
    sampleNumber: string
    customerName: string
    pdfBuffer: Buffer
  }): Promise<void> {
    const html = `
      <h2>Relatório de Análise Disponível</h2>
      <p>Olá,</p>
      <p>O relatório da amostra <strong>${reportData.sampleNumber}</strong> está disponível.</p>
      <p>Cliente: ${reportData.customerName}</p>
      <p>Por favor, consulte o PDF em anexo.</p>
      <br>
      <p>Atenciosamente,<br>Equipe WearCheck</p>
    `

    await this.sendEmail({
      to,
      subject: `Relatório ${reportData.sampleNumber} - WearCheck`,
      html,
      attachments: [
        {
          filename: `${reportData.sampleNumber}.pdf`,
          content: reportData.pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    })
  }

  async sendNotificationEmail(to: string, notification: {
    title: string
    message: string
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL'
  }): Promise<void> {
    const priorityColors = {
      LOW: '#6B7280',
      NORMAL: '#3B82F6',
      HIGH: '#F59E0B',
      CRITICAL: '#EF4444',
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: ${priorityColors[notification.priority]}; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2>${notification.title}</h2>
        </div>
        <div style="padding: 20px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
          <p>${notification.message}</p>
          <p style="color: #6B7280; font-size: 12px; margin-top: 20px;">
            Esta é uma mensagem automática do sistema WearCheck.
          </p>
        </div>
      </div>
    `

    await this.sendEmail({
      to,
      subject: `[${notification.priority}] ${notification.title}`,
      html,
    })
  }
}
