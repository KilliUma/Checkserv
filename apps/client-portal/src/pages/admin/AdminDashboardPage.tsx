import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Activity, Building2, FileText, FlaskConical, Users } from 'lucide-react'
import { portalApi } from '../../lib/apiClient'
import { useAuthStore } from '../../stores/authStore'
import { isAdminRole } from '../../utils/roles'
import {
  PageHeader,
  RefreshButton,
  adminStatusBadge,
  type AdminReportRow,
  type AdminSampleRow,
  type AdminUser,
  type ApiList,
  type Customer,
} from './shared'

export function AdminDashboard() {
  const queryClient = useQueryClient()
  const { session } = useAuthStore()
  const canManage = isAdminRole(session?.user.role)
  const [busy, setBusy] = useState(false)

  const { data: users } = useQuery<ApiList<AdminUser>>({
    queryKey: ['admin-users'],
    queryFn: async () => (await portalApi.get('/users')).data,
    enabled: canManage,
  })
  const { data: customers } = useQuery<ApiList<Customer>>({
    queryKey: ['admin-customers'],
    queryFn: async () => (await portalApi.get('/customers')).data,
    enabled: canManage,
  })
  const { data: samples } = useQuery<ApiList<AdminSampleRow>>({
    queryKey: ['admin-samples'],
    queryFn: async () => (await portalApi.get('/v1/samples')).data,
  })
  const { data: reports } = useQuery<{ data: AdminReportRow[] }>({
    queryKey: ['admin-reports-summary'],
    queryFn: async () => (await portalApi.get('/v1/reports?limit=50')).data,
  })

  const refreshAll = async () => {
    setBusy(true)
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-customers'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-samples'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-reports-summary'] }),
      ])
    } finally {
      setBusy(false)
    }
  }

  const cards = [
    { label: 'Utilizadores', value: users?.count || users?.data?.length || 0, icon: Users, tone: 'bg-blue-600' },
    { label: 'Clientes', value: customers?.count || customers?.data?.length || 0, icon: Building2, tone: 'bg-emerald-600' },
    { label: 'Amostras', value: samples?.count || samples?.data?.length || 0, icon: FlaskConical, tone: 'bg-orange-600' },
    { label: 'Relatórios', value: reports?.data?.length || 0, icon: FileText, tone: 'bg-purple-600' },
  ]

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Resumo operacional da plataforma"
        icon={Activity}
        actions={<RefreshButton onClick={refreshAll} busy={busy} />}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="rounded-md bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">{card.label}</div>
                  <div className="mt-1 text-3xl font-bold text-gray-900">{card.value}</div>
                </div>
                <div className={`rounded-md p-3 text-white ${card.tone}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-md bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Amostras recentes</h2>
          <div className="space-y-3">
            {(samples?.data || []).slice(0, 6).map((sample) => (
              <div key={sample.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div>
                  <div className="font-medium text-gray-900">{sample.sampleNumber}</div>
                  <div className="text-sm text-gray-500">{sample.customer?.name || sample.equipment?.equipmentNo || 'Sem cliente'}</div>
                </div>
                {adminStatusBadge(sample.status)}
              </div>
            ))}
            {!samples?.data?.length && <div className="text-sm text-gray-500">Sem amostras recentes.</div>}
          </div>
        </div>
        <div className="rounded-md bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Utilizadores pendentes</h2>
          {!canManage ? (
            <div className="text-sm text-gray-500">Reservado a administradores da plataforma.</div>
          ) : (
            <div className="space-y-3">
              {(users?.data || [])
                .filter((user) => user.status === 'PENDING')
                .slice(0, 6)
                .map((user) => (
                  <div key={user.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    {adminStatusBadge(user.status)}
                  </div>
                ))}
              {!users?.data?.some((user) => user.status === 'PENDING') && (
                <div className="text-sm text-gray-500">Sem aprovações pendentes.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
