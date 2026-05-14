import { FormEvent, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Bell, Building2, Lock, Mail, Save, Shield, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { portalApi } from '../lib/apiClient'
import { useAuthStore } from '../stores/authStore'

interface ProfileResponse {
  data: {
    id: string
    email: string
    name: string
    phone?: string | null
    role: string
    customerId?: string | null
    preferences: {
      notifications: {
        email: boolean
        inApp: boolean
      }
      language: string
      timezone: string
    }
    customer?: {
      name: string
      tradingName?: string | null
      email: string
      phone?: string | null
      city?: string | null
      country?: string | null
      status: string
    } | null
  }
}

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super administrador',
  ADMIN: 'Administrador',
  LAB_TECHNICIAN: 'Técnico de laboratório',
  CUSTOMER_USER: 'Utilizador do cliente',
  READONLY: 'Apenas leitura',
}

export function Settings() {
  const queryClient = useQueryClient()
  const { checkSession } = useAuthStore()
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    emailNotifications: true,
    inAppNotifications: true,
    language: 'pt',
    timezone: 'Africa/Luanda',
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const { data, isLoading } = useQuery<ProfileResponse>({
    queryKey: ['auth-profile'],
    queryFn: async () => (await portalApi.get('/auth/profile')).data,
  })

  const profile = data?.data

  useEffect(() => {
    if (!profile) return

    setProfileForm({
      name: profile.name || '',
      phone: profile.phone || '',
      emailNotifications: profile.preferences.notifications.email,
      inAppNotifications: profile.preferences.notifications.inApp,
      language: profile.preferences.language || 'pt',
      timezone: profile.preferences.timezone || 'Africa/Luanda',
    })
  }, [profile])

  const updateProfile = useMutation({
    mutationFn: async () =>
      portalApi.patch('/auth/profile', {
        name: profileForm.name,
        phone: profileForm.phone,
        preferences: {
          notifications: {
            email: profileForm.emailNotifications,
            inApp: profileForm.inAppNotifications,
          },
          language: profileForm.language,
          timezone: profileForm.timezone,
        },
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['auth-profile'] }),
        checkSession(),
      ])
      toast.success('Configurações atualizadas com sucesso')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Não foi possível atualizar as configurações')
    },
  })

  const changePassword = useMutation({
    mutationFn: async () =>
      portalApi.post('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }),
    onSuccess: () => {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      toast.success('Senha atualizada com sucesso')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Não foi possível alterar a senha')
    },
  })

  const handleProfileSubmit = (event: FormEvent) => {
    event.preventDefault()
    updateProfile.mutate()
  }

  const handlePasswordSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('As novas senhas não coincidem')
      return
    }

    changePassword.mutate()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-6">
          <div className="py-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
              Conta
            </p>
            <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
            <p className="mt-3 max-w-2xl text-gray-600">
              Gerencie os seus dados, preferências e segurança da conta.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-900/5">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Dados e preferências</h2>
                <p className="text-sm text-gray-500">Atualize os dados visíveis na sua conta.</p>
              </div>
            </div>

            {isLoading ? (
              <div className="rounded-xl bg-gray-50 p-8 text-center text-sm text-gray-500">A carregar configurações...</div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-gray-700">Nome</span>
                    <input
                      value={profileForm.name}
                      onChange={(event) => setProfileForm((form) => ({ ...form, name: event.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-gray-700">Telefone</span>
                    <input
                      value={profileForm.phone}
                      onChange={(event) => setProfileForm((form) => ({ ...form, phone: event.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                      placeholder="+244..."
                    />
                  </label>

                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-500">
                      <Mail size={16} />
                      Email
                    </div>
                    <div className="break-all font-bold text-gray-900">{profile?.email}</div>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-500">
                      <Shield size={16} />
                      Perfil
                    </div>
                    <div className="font-bold text-gray-900">{ROLE_LABELS[profile?.role || ''] || profile?.role}</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <Bell className="text-red-600" size={20} />
                    <h3 className="font-bold text-gray-900">Preferências de notificação</h3>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="flex cursor-pointer items-center justify-between rounded-xl bg-white p-4 shadow-sm">
                      <span>
                        <span className="block font-semibold text-gray-900">Email</span>
                        <span className="text-sm text-gray-500">Receber avisos por email</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={profileForm.emailNotifications}
                        onChange={(event) => setProfileForm((form) => ({ ...form, emailNotifications: event.target.checked }))}
                        className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </label>
                    <label className="flex cursor-pointer items-center justify-between rounded-xl bg-white p-4 shadow-sm">
                      <span>
                        <span className="block font-semibold text-gray-900">No portal</span>
                        <span className="text-sm text-gray-500">Mostrar notificações internas</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={profileForm.inAppNotifications}
                        onChange={(event) => setProfileForm((form) => ({ ...form, inAppNotifications: event.target.checked }))}
                        className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={updateProfile.isPending}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition hover:from-red-700 hover:to-red-800 disabled:opacity-50"
                  >
                    <Save size={18} />
                    {updateProfile.isPending ? 'A guardar...' : 'Guardar configurações'}
                  </button>
                </div>
              </form>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-900/5">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <Lock size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Alterar senha</h2>
              <p className="mt-2 text-sm text-gray-500">Use uma senha com pelo menos 8 caracteres.</p>

              <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) => setPasswordForm((form) => ({ ...form, currentPassword: event.target.value }))}
                  placeholder="Senha atual"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                  required
                />
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) => setPasswordForm((form) => ({ ...form, newPassword: event.target.value }))}
                  placeholder="Nova senha"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                  required
                  minLength={8}
                />
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) => setPasswordForm((form) => ({ ...form, confirmPassword: event.target.value }))}
                  placeholder="Confirmar nova senha"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                  required
                  minLength={8}
                />
                <button
                  type="submit"
                  disabled={changePassword.isPending}
                  className="w-full rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
                >
                  {changePassword.isPending ? 'A alterar...' : 'Alterar senha'}
                </button>
              </form>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-900/5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <Building2 size={22} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Empresa</h2>
                  <p className="text-sm text-gray-500">Dados associados</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="block text-gray-500">Nome</span>
                  <span className="font-semibold text-gray-900">{profile?.customer?.tradingName || profile?.customer?.name || 'Plataforma'}</span>
                </div>
                <div>
                  <span className="block text-gray-500">Email</span>
                  <span className="font-semibold text-gray-900">{profile?.customer?.email || profile?.email}</span>
                </div>
                <div>
                  <span className="block text-gray-500">Localização</span>
                  <span className="font-semibold text-gray-900">
                    {[profile?.customer?.city, profile?.customer?.country].filter(Boolean).join(', ') || 'Não definida'}
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
