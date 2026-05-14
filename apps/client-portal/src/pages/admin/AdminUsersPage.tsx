import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Users } from 'lucide-react'
import { portalApi } from '../../lib/apiClient'
import {
  EmptyState,
  LoadingState,
  PageHeader,
  RefreshButton,
  ROLE_LABELS,
  SearchBox,
  adminStatusBadge,
  type AdminUser,
  type ApiList,
} from './shared'

export function AdminUsers() {
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()
  const [busy, setBusy] = useState(false)
  const { data, isLoading } = useQuery<ApiList<AdminUser>>({
    queryKey: ['admin-users'],
    queryFn: async () => (await portalApi.get('/users')).data,
  })

  const users = useMemo(
    () =>
      (data?.data || []).filter((user) => {
        const haystack = `${user.name} ${user.email} ${user.role} ${user.customer?.name || ''}`.toLowerCase()
        return haystack.includes(search.toLowerCase())
      }),
    [data, search],
  )

  const refresh = async () => {
    setBusy(true)
    try {
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Utilizadores"
        description="Contas internas e utilizadores de clientes"
        icon={Users}
        actions={<RefreshButton onClick={refresh} busy={busy} />}
      />
      <SearchBox value={search} onChange={setSearch} placeholder="Pesquisar por nome, email, função ou cliente..." />
      {isLoading ? (
        <LoadingState />
      ) : !users.length ? (
        <EmptyState label="Nenhum utilizador encontrado." />
      ) : (
        <div className="overflow-hidden rounded-md bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Nome', 'Cliente', 'Função', 'Estado', 'Último acesso'].map((header) => (
                  <th key={header} className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{user.customer?.name || 'Plataforma'}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{ROLE_LABELS[user.role] || user.role}</td>
                  <td className="px-5 py-4">{adminStatusBadge(user.status)}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('pt-PT') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
