import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Download, Eye, FileText, Filter } from 'lucide-react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Button, Input, Select, Card, Badge, Spinner } from '@wearcheck/ui'
import { portalApi, reportDownloadAbsoluteUrl } from '../../lib/apiClient'
import { withBasePath } from '../../utils/basePath'
import { PageHeader, RefreshButton, type AdminReportRow } from './shared'

const statusOptions = [
  { value: 'QUEUED', label: 'Na fila' },
  { value: 'GENERATING', label: 'A gerar' },
  { value: 'READY', label: 'Pronto' },
  { value: 'SENT', label: 'Enviado' },
  { value: 'READ', label: 'Lido' },
  { value: 'ARCHIVED', label: 'Arquivado' },
]

function reportStatusBadge(status: string) {
  const statusMap: Record<string, { variant: 'default' | 'warning' | 'success' | 'info'; label: string }> = {
    QUEUED: { variant: 'default', label: 'Na fila' },
    GENERATING: { variant: 'warning', label: 'A gerar' },
    READY: { variant: 'success', label: 'Pronto' },
    SENT: { variant: 'info', label: 'Enviado' },
    READ: { variant: 'default', label: 'Lido' },
    ARCHIVED: { variant: 'default', label: 'Arquivado' },
  }
  const config = statusMap[status] || { variant: 'default' as const, label: status }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function AdminReports() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [busy, setBusy] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
  })
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reports', page, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '')),
      })
      return (await portalApi.get(`/v1/reports?${params}`)).data as {
        data: AdminReportRow[]
        pagination?: { page: number; totalPages: number; total: number }
      }
    },
  })

  const refresh = async () => {
    setBusy(true)
    try {
      await queryClient.invalidateQueries({ queryKey: ['admin-reports'] })
    } finally {
      setBusy(false)
    }
  }

  const handleDownload = async (reportId: string, reportNumber: string) => {
    try {
      const response = await portalApi.get(`/v1/reports/${reportId}/download`, {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `CheckServ_Report_${reportNumber}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      window.alert('Não foi possível transferir o PDF (pode ainda estar em desenvolvimento no servidor).')
    }
  }

  return (
    <div>
      <PageHeader
        title="Relatórios"
        description="Relatórios laboratoriais em toda a plataforma. Utilizadores cliente continuam a usar a mesma listagem com filtros na área cliente."
        icon={FileText}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter size={16} className="mr-2" />
              Filtros
            </Button>
            <a
              href={withBasePath('/relatorios')}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Vista cliente
            </a>
            <RefreshButton onClick={refresh} busy={busy} />
          </div>
        }
      />

      {showFilters && (
        <Card className="mb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Select
              label="Estado"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              options={statusOptions}
            />
            <Input
              label="Data início"
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
            <Input
              label="Data fim"
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
            <div className="flex items-end">
              <Button variant="secondary" onClick={() => setFilters({ status: '', startDate: '', endDate: '' })}>
                Limpar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {isLoading ? (
        <Card>
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        </Card>
      ) : !data?.data?.length ? (
        <Card>
          <div className="py-12 text-center text-gray-600">Nenhum relatório encontrado.</div>
        </Card>
      ) : (
        <>
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Relatório</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Cliente</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Amostra</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Equipamento</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Data</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {data.data.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{report.reportNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{report.customer?.name || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{report.sample?.sampleNumber || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{report.sample?.equipment?.equipmentNo || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {format(new Date(report.reportDate), 'dd/MM/yyyy', { locale: pt })}
                      </td>
                      <td className="px-4 py-3">{reportStatusBadge(report.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            type="button"
                            onClick={() => window.open(reportDownloadAbsoluteUrl(report.id), '_blank')}
                            title="Pré-visualizar"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            type="button"
                            onClick={() => handleDownload(report.id, report.reportNumber)}
                            title="Download PDF"
                          >
                            <Download size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {data.pagination && data.pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                Anterior
              </Button>
              <span className="text-sm text-gray-600">
                Página {page} de {data.pagination.totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= data.pagination.totalPages}
              >
                Seguinte
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
