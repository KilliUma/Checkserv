import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Bell, Building2, Mail, Shield, User } from 'lucide-react'
import { portalApi } from '../lib/apiClient'
import { useAuthStore } from '../stores/authStore'

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super administrador',
  ADMIN: 'Administrador',
  LAB_TECHNICIAN: 'Técnico de laboratório',
  CUSTOMER_ADMIN: 'Administrador do cliente',
  CUSTOMER_USER: 'Utilizador do cliente',
}

export function Profile() {
  const { session } = useAuthStore()
  const { data } = useQuery({
    queryKey: ['auth-profile'],
    queryFn: async () => (await portalApi.get('/auth/profile')).data,
  })
  const user = session?.user
  const profile = data?.data
  const firstName = user?.name?.split(' ')[0] || 'Utilizador'
  const initial = user?.name?.trim()?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-6">
          <Link
            to="/dashboard"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-red-600 transition hover:text-red-700"
          >
            <ArrowLeft size={16} />
            Voltar ao dashboard
          </Link>

          <div className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
                Meu Perfil
              </p>
              <h1 className="text-3xl font-bold text-gray-900">Olá, {firstName}</h1>
              <p className="mt-3 max-w-2xl text-gray-600">
                Consulte os dados associados à sua conta CheckServ Online.
              </p>
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-700 text-3xl font-bold text-white shadow-xl shadow-red-500/25">
              {initial}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-900/5">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Informação pessoal</h2>
                <p className="text-sm text-gray-500">Dados principais da sua sessão.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-500">
                  <User size={16} />
                  Nome
                </div>
                <div className="font-bold text-gray-900">{profile?.name || user?.name || 'Não definido'}</div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-500">
                  <Mail size={16} />
                  Email
                </div>
                <div className="break-all font-bold text-gray-900">{profile?.email || user?.email || 'Não definido'}</div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-500">
                  <Shield size={16} />
                  Tipo de conta
                </div>
                <div className="font-bold text-gray-900">
                  {ROLE_LABELS[profile?.role || user?.role || ''] || profile?.role || user?.role || 'Não definido'}
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-500">
                  <Building2 size={16} />
                  Cliente
                </div>
                <div className="break-all font-mono text-sm font-bold text-gray-900">
                  {profile?.customer?.tradingName || profile?.customer?.name || user?.customerId || 'Plataforma'}
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-900/5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <Bell size={24} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Notificações</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                As notificações da conta estão disponíveis no sino do cabeçalho.
              </p>
              <Link
                to="/configuracoes"
                className="mt-5 inline-flex rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Gerir configurações
              </Link>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 text-white shadow-xl">
              <h2 className="text-lg font-bold">Precisa atualizar dados?</h2>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Contacte o suporte para alterações de perfil, permissões ou empresa associada.
              </p>
              <a
                href="mailto:suporte@checkserv.co.ao"
                className="mt-5 inline-flex rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition hover:from-red-700 hover:to-red-800"
              >
                Contactar suporte
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
