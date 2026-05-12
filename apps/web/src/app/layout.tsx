import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WearCheck Africa - Oil Analysis & Condition Monitoring',
  description: 'Líder em análise de fluidos e monitoramento de condições na África',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className="antialiased">{children}</body>
    </html>
  )
}
