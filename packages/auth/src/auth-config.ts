import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '@wearcheck/database'
import type { User } from '@wearcheck/types'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e password são obrigatórios')
        }

        // Buscar usuário
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
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
          throw new Error('Credenciais inválidas')
        }

        // Verificar status
        if (user.status !== 'ACTIVE') {
          throw new Error('Conta inativa ou suspensa')
        }

        // Verificar customer status (se houver)
        if (user.customer && user.customer.status !== 'ACTIVE') {
          throw new Error('Conta da empresa inativa')
        }

        // Verificar password
        const isPasswordValid = await compare(credentials.password, user.password)
        if (!isPasswordValid) {
          throw new Error('Credenciais inválidas')
        }

        // Atualizar lastLoginAt
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        // Retornar dados do user para session
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          customerId: user.customerId,
          avatar: user.avatar,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.customerId = (user as any).customerId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).role = token.role as string
        (session.user as any).customerId = token.customerId as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}
