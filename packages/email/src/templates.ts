export const emailTemplates = {
  welcome: (userName: string) => `
    <h2>Bem-vindo ao WearCheck!</h2>
    <p>Olá ${userName},</p>
    <p>Sua conta foi criada com sucesso.</p>
    <p>Faça login no portal para acessar todos os recursos.</p>
  `,

  passwordReset: (resetLink: string) => `
    <h2>Redefinição de Senha</h2>
    <p>Você solicitou a redefinição de senha.</p>
    <p><a href="${resetLink}">Clique aqui para redefinir sua senha</a></p>
    <p>Este link expira em 24 horas.</p>
  `,

  sampleReceived: (sampleNumber: string) => `
    <h2>Amostra Recebida</h2>
    <p>A amostra ${sampleNumber} foi recebida em nosso laboratório.</p>
    <p>O processamento começará em breve.</p>
  `,
}
