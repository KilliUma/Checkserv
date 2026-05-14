import { NextResponse } from 'next/server'
import { compare, hash } from 'bcryptjs'
import { prisma } from '@wearcheck/database'
import { getAuthTokenPayload } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const decoded = getAuthTokenPayload()

    if (!decoded) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Senha atual e nova senha são obrigatórias' }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'A nova senha deve ter no mínimo 8 caracteres' }, { status: 400 })
    }

    if (currentPassword === newPassword) {
      return NextResponse.json({ error: 'A nova senha deve ser diferente da senha atual' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        password: true,
        status: true,
      },
    })

    if (!user || user.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Utilizador não encontrado ou inativo' }, { status: 404 })
    }

    const validPassword = await compare(currentPassword, user.password)
    if (!validPassword) {
      return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 401 })
    }

    const hashedPassword = await hash(newPassword, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ success: true, message: 'Senha atualizada com sucesso' })
  } catch (error) {
    console.error('Erro ao alterar senha:', error)
    return NextResponse.json({ error: 'Erro ao alterar senha' }, { status: 500 })
  }
}
