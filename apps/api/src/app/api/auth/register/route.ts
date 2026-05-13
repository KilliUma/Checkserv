import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@wearcheck/database'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const {
      name,
      email,
      phone,
      company,
      tradingName,
      registrationNo,
      address,
      city,
      country,
      password,
    } = data

    // Validações básicas
    if (!name || !email || !password || !company) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'A senha deve ter no mínimo 8 caracteres' },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 409 }
      )
    }

    // Hash da senha
    const hashedPassword = await hash(password, 12)

    // Criar ou buscar customer (empresa)
    let customer = await prisma.customer.findFirst({
      where: {
        OR: [
          { email },
          { name: company },
        ],
      },
    })

    if (!customer) {
      const customerData: any = {
        name: company,
        tradingName: tradingName || company,
        email,
        country: country || 'Angola',
        status: 'TRIAL', // Status trial para novos registros
      }

      // Adicionar campos opcionais apenas se tiverem valor
      if (registrationNo) customerData.registrationNo = registrationNo
      if (phone) customerData.phone = phone
      if (address) customerData.addressLine1 = address
      if (city) customerData.city = city

      customer = await prisma.customer.create({
        data: customerData,
      })
    }

    // Criar usuário
    const userData: any = {
      name,
      email,
      password: hashedPassword,
      role: 'CUSTOMER_USER',
      status: 'PENDING',
      customerId: customer.id,
    }

    if (phone) userData.phone = phone

    const user = await prisma.user.create({
      data: userData,
    })

    return NextResponse.json(
      {
        message: 'Conta criada com sucesso! Aguarde a aprovação do administrador para fazer login.',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Erro no registro:', error)
    console.error('Detalhes do erro:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
    })

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
        { status: 500 }
      )
    }

    if (errorMessage.includes("Can't reach database server") || errorMessage.includes('P1001')) {
      return NextResponse.json(
        { error: 'Base de dados indisponivel. Tente novamente em instantes.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
