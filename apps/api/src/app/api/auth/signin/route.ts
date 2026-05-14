import { NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import { prisma } from '@wearcheck/database'
import { sign } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { getCorsHeaders } from '@/lib/cors'

export const dynamic = 'force-dynamic'

function hasSupportedBcryptHash(passwordHash: string): boolean {
  return /^\$2[aby]\$\d{2}\$/.test(passwordHash)
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request.headers.get('origin')),
  })
}

export async function POST(request: Request) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin'))

  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e password são obrigatórios' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401, headers: corsHeaders }
      )
    }

    // Verificar status
    if (user.status !== 'ACTIVE') {
      const message = user.status === 'PENDING' 
        ? 'Sua conta está aguardando aprovação do administrador'
        : 'Conta inativa ou suspensa'
      
      return NextResponse.json(
        { error: message },
        { status: 403, headers: corsHeaders }
      )
    }

    // Verificar customer status (se houver)
    if (user.customer && user.customer.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Conta da empresa inativa' },
        { status: 403, headers: corsHeaders }
      )
    }

    // Verificar password
    if (!user.password || !hasSupportedBcryptHash(user.password)) {
      console.error('Hash de password invalido para utilizador', { userId: user.id })

      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401, headers: corsHeaders }
      )
    }

    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401, headers: corsHeaders }
      )
    }

    // Atualizar lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // Criar token JWT
    const token = sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        customerId: user.customerId,
        status: user.status,
      },
      process.env.NEXTAUTH_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    // Definir cookie
    const cookieStore = await cookies()
    const isProduction = process.env.NODE_ENV === 'production'

    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: '/',
    })

    // Retornar sessão
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        customerId: user.customerId,
      },
    }, { headers: corsHeaders })
  } catch (error) {
    console.error('Erro no login:', error)

    const errorMessage = error instanceof Error ? error.message : String(error)
    if (
      errorMessage.includes('Environment variable not found: DATABASE_URL') ||
      errorMessage.includes('Environment variable not found: DIRECT_URL')
    ) {
      return NextResponse.json(
        {
          error: 'Configuração do servidor incompleta. Contacte o suporte.',
          code: 'SERVER_MISCONFIGURATION',
        },
        { status: 500, headers: corsHeaders }
      )
    }

    if (errorMessage.includes("Can't reach database server") || errorMessage.includes('P1001')) {
      return NextResponse.json(
        { error: 'Base de dados indisponivel. Inicie o PostgreSQL e tente novamente.' },
        { status: 503, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500, headers: corsHeaders }
    )
  }
}
