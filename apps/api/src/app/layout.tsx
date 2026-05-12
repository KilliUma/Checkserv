import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WearCheck API',
  description: 'WearCheck Oil Analysis Platform API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  )
}
