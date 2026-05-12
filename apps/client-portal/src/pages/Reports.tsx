import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button, Input, Select, Card, Badge, Spinner } from '@wearcheck/ui'
import { Download, Eye, FileText, Filter } from 'lucide-react'
import axios from 'axios'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'

interface Report {
  id: string
  reportNumber: string
  reportDate: string
  status: string
  sample: {
    sampleNumber: string
    equipment: {
      equipmentNo: string
      description: string
    }
    component: {
      componentNo: string
      type: string
    }
  }
}

export function Reports() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    status: '',
    equipmentId: '',
    startDate: '',
    endDate: '',
  })
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['reports', page, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        ),
      })
      const response = await axios.get(`/api/v1/reports?${params}`)
      return response.data
    },
  })

  const handleDownload = async (reportId: string, reportNumber: string) => {
    try {
      const response = await axios.get(`/api/v1/reports/${reportId}/download`, {
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
    } catch (error) {
      console.error('Erro ao baixar relatório:', error)
      alert('Erro ao baixar relatório')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; label: string }> = {
      QUEUED: { variant: 'default', label: 'Na Fila' },
      GENERATING: { variant: 'warning', label: 'Gerando' },
      READY: { variant: 'success', label: 'Pronto' },
      SENT: { variant: 'info', label: 'Enviado' },
      READ: { variant: 'default', label: 'Lido' },
      ARCHIVED: { variant: 'default', label: 'Arquivado' },
    }
    const config = statusMap[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Relatórios</h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} className="mr-2" />
          Filtros
        </Button>
      </div>

      {showFilters && (
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label="Status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              options={[
                { value: 'QUEUED', label: 'Na Fila' },
                { value: 'GENERATING', label: 'Gerando' },
                { value: 'READY', label: 'Pronto' },
                { value: 'SENT', label: 'Enviado' },
                { value: 'READ', label: 'Lido' },
                { value: 'ARCHIVED', label: 'Arquivado' },
              ]}
            />
            <Input
              label="Data Início"
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
            <Input
              label="Data Fim"
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={() =>
                  setFilters({ status: '', equipmentId: '', startDate: '', endDate: '' })
                }
              >
                Limpar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {isLoading ? (
        <Card>
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        </Card>
      ) : !data?.data?.length ? (
        <Card>
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Nenhum relatório encontrado</p>
          </div>
        </Card>
      ) : (
        <>
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nº Relatório
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nº Amostra
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Equipamento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.data.map((report: Report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {report.reportNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.sample.sampleNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div className="font-medium">
                            {report.sample.equipment.equipmentNo}
                          </div>
                          <div className="text-xs text-gray-400">
                            {report.sample.equipment.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(report.reportDate), 'dd/MM/yyyy', {
                          locale: pt,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(report.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              window.open(
                                `/api/v1/reports/${report.id}/download`,
                                '_blank'
                              )
                            }
                            title="Visualizar"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() =>
                              handleDownload(report.id, report.reportNumber)
                            }
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
            <div className="flex justify-center items-center space-x-2 mt-6">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-600">
                Página {page} de {data.pagination.totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === data.pagination.totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
