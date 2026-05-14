import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download, Eye, FileText, Filter, Search, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { portalApi, reportDownloadAbsoluteUrl } from '../lib/apiClient'

interface Report {
  id: string
  reportNumber: string
  reportDate: string
  status: string
  diagnosticComment?: string | null
  laboratoryComment?: string | null
  recommendation?: string | null
  problemType?: string | null
  actionRequired?: string | null
  approvedBy?: string | null
  sample: {
    sampleNumber: string
    equipment: {
      equipmentNo: string
      description: string
    }
    component?: {
      componentNo: string
      type: string
    } | null
  }
}

interface ReportsResponse {
  data: Report[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface EquipmentOption {
  id: string
  equipmentNo: string
  description: string
}

const statusLabels: Record<string, string> = {
  QUEUED: 'Na fila',
  GENERATING: 'Gerando',
  READY: 'Pronto',
  SENT: 'Enviado',
  READ: 'Lido',
  ARCHIVED: 'Arquivado',
}

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    QUEUED: 'bg-gray-100 text-gray-700',
    GENERATING: 'bg-yellow-100 text-yellow-700',
    READY: 'bg-green-100 text-green-700',
    SENT: 'bg-blue-100 text-blue-700',
    READ: 'bg-purple-100 text-purple-700',
    ARCHIVED: 'bg-slate-100 text-slate-700',
  }

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {statusLabels[status] || status}
    </span>
  )
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-PT')
}

export function Reports() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [filters, setFilters] = useState({
    status: '',
    equipmentId: '',
    startDate: '',
    endDate: '',
  })

  const { data, isLoading } = useQuery<ReportsResponse>({
    queryKey: ['reports', page, filters, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      })

      if (searchTerm.trim()) params.set('q', searchTerm.trim())
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value)
      })

      return (await portalApi.get(`/v1/reports?${params}`)).data
    },
  })

  const { data: equipmentData } = useQuery<{ data: EquipmentOption[] }>({
    queryKey: ['equipment'],
    queryFn: async () => (await portalApi.get('/v1/equipment')).data,
  })

  const reports = data?.data || []
  const pagination = data?.pagination
  const readyCount = reports.filter((report) => report.status === 'READY').length
  const sentCount = reports.filter((report) => report.status === 'SENT' || report.status === 'READ').length

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setPage(1)
    setFilters((current) => ({ ...current, [key]: value }))
  }

  const handleSearch = (value: string) => {
    setPage(1)
    setSearchTerm(value)
  }

  const handleDownload = async (reportId: string, reportNumber: string) => {
    try {
      const response = await portalApi.get(`/v1/reports/${reportId}/download`, {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `CheckServ_Report_${reportNumber}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao baixar relatório')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-red-600">Análises</p>
              <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
              <p className="mt-3 max-w-2xl text-gray-600">
                Consulte, filtre, visualize e descarregue os relatórios de análise da sua frota.
              </p>
            </div>
            <FileText size={72} className="hidden text-red-100 lg:block" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: 'Relatórios encontrados', value: pagination?.total || 0, tone: 'from-red-600 to-red-700' },
            { label: 'Prontos nesta página', value: readyCount, tone: 'from-green-600 to-green-700' },
            { label: 'Enviados/Lidos nesta página', value: sentCount, tone: 'from-gray-800 to-gray-900' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xl shadow-gray-900/5">
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white ${stat.tone}`}>
                <FileText size={22} />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-xl shadow-gray-900/5">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Pesquisar por relatório, amostra ou equipamento..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <Filter size={18} />
              Filtros
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 grid gap-4 border-t border-gray-100 pt-4 md:grid-cols-4">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-gray-700">Estado</span>
                <select
                  value={filters.status}
                  onChange={(event) => updateFilter('status', event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                >
                  <option value="">Todos</option>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-gray-700">Equipamento</span>
                <select
                  value={filters.equipmentId}
                  onChange={(event) => updateFilter('equipmentId', event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                >
                  <option value="">Todos</option>
                  {(equipmentData?.data || []).map((equipment) => (
                    <option key={equipment.id} value={equipment.id}>
                      {equipment.equipmentNo} - {equipment.description}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-gray-700">Data início</span>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(event) => updateFilter('startDate', event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-gray-700">Data fim</span>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(event) => updateFilter('endDate', event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </label>

              <div className="md:col-span-4">
                <button
                  type="button"
                  onClick={() => {
                    setPage(1)
                    setSearchTerm('')
                    setFilters({ status: '', equipmentId: '', startDate: '', endDate: '' })
                  }}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="rounded-2xl bg-white p-12 text-center text-gray-600 shadow-xl">A carregar relatórios...</div>
        ) : !reports.length ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-xl">
            <FileText className="mx-auto mb-4 text-gray-300" size={64} />
            <h3 className="text-xl font-semibold text-gray-900">Nenhum relatório encontrado</h3>
            <p className="mt-2 text-gray-600">Quando o laboratório emitir relatórios, eles aparecerão aqui.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-900/5">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Relatório</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Amostra</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Equipamento</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Data</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Estado</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {reports.map((report) => (
                    <tr key={report.id} className="transition hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-red-600" />
                          <span className="text-sm font-semibold text-gray-900">{report.reportNumber}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{report.sample.sampleNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="font-semibold text-gray-900">{report.sample.equipment.equipmentNo}</div>
                        <div className="text-xs text-gray-500">{report.sample.equipment.description}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{formatDate(report.reportDate)}</td>
                      <td className="whitespace-nowrap px-6 py-4">{statusBadge(report.status)}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedReport(report)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-red-600"
                            title="Ver detalhes"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => window.open(reportDownloadAbsoluteUrl(report.id), '_blank')}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-red-600"
                            title="Visualizar PDF"
                          >
                            <FileText size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownload(report.id, report.reportNumber)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white transition hover:bg-red-700"
                            title="Download PDF"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
                <div className="text-sm text-gray-600">
                  Página {pagination.page} de {pagination.totalPages} · {pagination.total} relatório(s)
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page === 1}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.min(pagination.totalPages, current + 1))}
                    disabled={page === pagination.totalPages}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-white">
              <div>
                <h2 className="text-xl font-bold">{selectedReport.reportNumber}</h2>
                <p className="text-sm text-red-100">Detalhes do relatório</p>
              </div>
              <button onClick={() => setSelectedReport(null)} className="rounded-full p-1 hover:bg-white/10">
                <X size={22} />
              </button>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-sm text-gray-500">Amostra</div>
                <div className="font-semibold text-gray-900">{selectedReport.sample.sampleNumber}</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-sm text-gray-500">Estado</div>
                <div className="mt-2">{statusBadge(selectedReport.status)}</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-sm text-gray-500">Equipamento</div>
                <div className="font-semibold text-gray-900">{selectedReport.sample.equipment.equipmentNo}</div>
                <div className="text-sm text-gray-600">{selectedReport.sample.equipment.description}</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-sm text-gray-500">Componente</div>
                <div className="font-semibold text-gray-900">
                  {selectedReport.sample.component
                    ? `${selectedReport.sample.component.componentNo} · ${selectedReport.sample.component.type}`
                    : '—'}
                </div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 md:col-span-2">
                <div className="text-sm text-gray-500">Diagnóstico</div>
                <div className="font-semibold text-gray-900">{selectedReport.diagnosticComment || 'Sem comentário de diagnóstico.'}</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 md:col-span-2">
                <div className="text-sm text-gray-500">Recomendação</div>
                <div className="font-semibold text-gray-900">{selectedReport.recommendation || selectedReport.actionRequired || 'Sem recomendação.'}</div>
              </div>
              <div className="flex justify-end gap-2 md:col-span-2">
                <button
                  type="button"
                  onClick={() => window.open(reportDownloadAbsoluteUrl(selectedReport.id), '_blank')}
                  className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Visualizar PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(selectedReport.id, selectedReport.reportNumber)}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
