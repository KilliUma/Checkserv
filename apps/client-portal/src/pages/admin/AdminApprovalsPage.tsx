import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Building, CheckCircle, Clock, Loader2, Mail, MapPin, Phone, UserCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { portalApi } from '../../lib/apiClient'
import { EmptyState, LoadingState, PageHeader, RefreshButton, type AdminUser } from './shared'

interface PendingResponse {
  users: AdminUser[]
  count: number
}

export function AdminApprovals() {
  const queryClient = useQueryClient()
  const [busy, setBusy] = useState(false)
  const { data, isLoading, refetch } = useQuery<PendingResponse>({
    queryKey: ['admin-pending-users'],
    queryFn: async () => (await portalApi.get('/users/pending')).data,
  })

  const activateMutation = useMutation({
    mutationFn: async (userId: string) => {
      await portalApi.post(`/users/${userId}/activate`)
    },
    onSuccess: () => {
      toast.success('Utilizador aprovado com sucesso.')
      queryClient.invalidateQueries({ queryKey: ['admin-pending-users'] })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => {
      toast.error('Não foi possível aprovar o utilizador.')
    },
  })

  const approve = (userId: string) => {
    if (!window.confirm('Aprovar esta conta? O utilizador e a empresa associada passarão a estado ativo.')) {
      return
    }
    activateMutation.mutate(userId)
  }

  const refresh = async () => {
    setBusy(true)
    try {
      await refetch()
    } finally {
      setBusy(false)
    }
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Aprovação" description="Novas contas aguardando validação administrativa" icon={UserCheck} />
        <LoadingState />
      </div>
    )
  }

  const users = data?.users || []

  return (
    <div>
      <PageHeader
        title="Aprovação de utilizadores"
        description={`${users.length} ${users.length === 1 ? 'conta pendente' : 'contas pendentes'}`}
        icon={UserCheck}
        actions={<RefreshButton onClick={refresh} busy={busy} />}
      />

      {!users.length ? (
        <EmptyState label="Não há utilizadores pendentes." />
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="rounded-lg bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                      <Clock className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">
                        Pedido em{' '}
                        {new Date(user.createdAt).toLocaleString('pt-PT', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="mb-2 text-sm font-semibold text-gray-700">Utilizador</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4 flex-shrink-0 text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>

                    {user.customer && (
                      <div className="space-y-2">
                        <h4 className="mb-2 text-sm font-semibold text-gray-700">Empresa</h4>
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <Building className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-800">{user.customer.name}</div>
                          </div>
                        </div>
                        {(user.customer.city || user.customer.country) && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />
                            <span>{[user.customer.city, user.customer.country].filter(Boolean).join(', ')}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-shrink-0 lg:ml-4">
                  <button
                    type="button"
                    onClick={() => approve(user.id)}
                    disabled={activateMutation.isPending && activateMutation.variables === user.id}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:bg-gray-400 lg:w-auto"
                  >
                    {activateMutation.isPending && activateMutation.variables === user.id ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        A processar…
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Aprovar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
