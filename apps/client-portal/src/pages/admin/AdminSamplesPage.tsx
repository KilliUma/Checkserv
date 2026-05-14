import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Clock, FlaskConical } from 'lucide-react'
import { portalApi } from '../../lib/apiClient'
import { withBasePath } from '../../utils/basePath'
import { sampleStatusBadgeClass, sampleStatusLabel } from '../../utils/sampleStatus'
import {
  EmptyState,
  LoadingState,
  PageHeader,
  RefreshButton,
  SearchBox,
  type AdminSampleRow,
  type ApiList,
} from './shared'

export function AdminSamples() {
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()
  const [busy, setBusy] = useState(false)
  const { data, isLoading } = useQuery<ApiList<AdminSampleRow>>({
    queryKey: ['admin-samples'],
    queryFn: async () => (await portalApi.get('/v1/samples')).data,
  })

  const list = data?.data || []
  const samples = useMemo(
    () =>
      list.filter((sample) => {
        const haystack = `${sample.sampleNumber} ${sample.customer?.name || ''} ${sample.equipment?.equipmentNo || ''} ${sample.status}`.toLowerCase()
        return haystack.includes(search.toLowerCase())
      }),
    [list, search],
  )

  const stats = [
    { icon: FlaskConical, label: 'Total', value: list.length, color: 'bg-blue-600' },
    { icon: Clock, label: 'Em análise', value: list.filter((s) => s.status === 'TESTING').length, color: 'bg-orange-500' },
    { icon: CheckCircle, label: 'Completas', value: list.filter((s) => s.status === 'COMPLETED').length, color: 'bg-green-600' },
  ]

  const refresh = async () => {
    setBusy(true)
    try {
      await queryClient.invalidateQueries({ queryKey: ['admin-samples'] })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Amostras"
        description="Todas as amostras da plataforma. A submissão de novas amostras mantém-se na área do cliente."
        icon={FlaskConical}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={withBasePath('/amostras')}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Ir para submissão (área cliente)
            </a>
            <RefreshButton onClick={refresh} busy={busy} />
          </div>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="rounded-md bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                </div>
                <div className={`rounded-md p-3 text-white ${s.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <SearchBox value={search} onChange={setSearch} placeholder="Pesquisar por amostra, cliente, equipamento ou estado..." />
      {isLoading ? (
        <LoadingState />
      ) : !samples.length ? (
        <EmptyState label="Nenhuma amostra encontrada." />
      ) : (
        <div className="overflow-hidden rounded-md bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Amostra', 'Cliente', 'Equipamento', 'Prioridade', 'Estado', 'Criada em'].map((header) => (
                  <th key={header} className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {samples.map((sample) => {
                const badge = sampleStatusBadgeClass(sample.status)
                return (
                  <tr key={sample.id}>
                    <td className="px-5 py-4 font-medium text-gray-900">{sample.sampleNumber}</td>
                    <td className="px-5 py-4 text-sm text-gray-700">{sample.customer?.name || '—'}</td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-medium text-gray-800">{sample.equipment?.equipmentNo || '—'}</div>
                      <div className="text-xs text-gray-500">{sample.equipment?.description || ''}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">{sample.priority}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badge.bg} ${badge.text}`}>
                        {sampleStatusLabel(sample.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{new Date(sample.createdAt).toLocaleDateString('pt-PT')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
