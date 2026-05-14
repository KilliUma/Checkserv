import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Building2 } from 'lucide-react'
import { portalApi } from '../../lib/apiClient'
import {
  EmptyState,
  LoadingState,
  PageHeader,
  RefreshButton,
  SearchBox,
  adminStatusBadge,
  type ApiList,
  type Customer,
} from './shared'

export function AdminCustomers() {
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()
  const [busy, setBusy] = useState(false)
  const { data, isLoading } = useQuery<ApiList<Customer>>({
    queryKey: ['admin-customers'],
    queryFn: async () => (await portalApi.get('/customers')).data,
  })

  const customers = useMemo(
    () =>
      (data?.data || []).filter((customer) => {
        const haystack = `${customer.name} ${customer.tradingName || ''} ${customer.email} ${customer.city || ''}`.toLowerCase()
        return haystack.includes(search.toLowerCase())
      }),
    [data, search],
  )

  const refresh = async () => {
    setBusy(true)
    try {
      await queryClient.invalidateQueries({ queryKey: ['admin-customers'] })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Empresas e contas cliente da plataforma"
        icon={Building2}
        actions={<RefreshButton onClick={refresh} busy={busy} />}
      />
      <SearchBox value={search} onChange={setSearch} placeholder="Pesquisar por empresa, email ou cidade..." />
      {isLoading ? (
        <LoadingState />
      ) : !customers.length ? (
        <EmptyState label="Nenhum cliente encontrado." />
      ) : (
        <div className="overflow-hidden rounded-md bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Empresa', 'Contacto', 'Estado', 'Utilizadores', 'Amostras', 'Relatórios'].map((header) => (
                  <th key={header} className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900">{customer.name}</div>
                    <div className="text-sm text-gray-500">
                      {customer.tradingName || [customer.city, customer.country].filter(Boolean).join(', ')}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm text-gray-700">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.phone || '—'}</div>
                  </td>
                  <td className="px-5 py-4">{adminStatusBadge(customer.status)}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{customer._count?.users ?? 0}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{customer._count?.samples ?? 0}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{customer._count?.reports ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
