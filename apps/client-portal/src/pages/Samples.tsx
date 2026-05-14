import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@wearcheck/ui'
import { SampleForm } from '../components/SampleForm'
import { FlaskConical, Search, Filter, Download, Plus, Clock, CheckCircle, X } from 'lucide-react'
import { portalApi } from '../lib/apiClient'
import { sampleStatusBadgeClass, sampleStatusLabel } from '../utils/sampleStatus'
import { useAuthStore } from '../stores/authStore'

interface Sample {
  id: string
  sampleNumber: string
  status: string
  type?: string
  priority?: string
  equipmentReading?: number
  fluidType?: string
  fluidGrade?: string
  customerComment?: string
  equipment: {
    equipmentNo: string
    description: string
  }
  component?: {
    componentNo: string
    type: string
  } | null
  createdAt: string
}

export function Samples() {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null)
  const { session } = useAuthStore()

  const { data: samples, isLoading } = useQuery<{ data: Sample[] }>({
    queryKey: ['samples'],
    queryFn: async () => {
      const response = await portalApi.get('/v1/samples')
      return response.data
    },
  })

  const getStatusBadge = (status: string) => {
    const { bg, text } = sampleStatusBadgeClass(status)
    const label = sampleStatusLabel(status)
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
        {label}
      </span>
    )
  }

  const stats = [
    { icon: FlaskConical, label: 'Total de Amostras', value: samples?.data?.length || 0, color: 'bg-blue-500' },
    { icon: Clock, label: 'Em Análise', value: samples?.data?.filter(s => s.status === 'TESTING').length || 0, color: 'bg-orange-500' },
    { icon: CheckCircle, label: 'Completas', value: samples?.data?.filter(s => s.status === 'COMPLETED').length || 0, color: 'bg-green-500' },
  ]

  const filteredSamples = (samples?.data || []).filter((sample) => {
    const haystack = `${sample.sampleNumber} ${sample.equipment?.equipmentNo || ''} ${sample.equipment?.description || ''} ${sample.status}`.toLowerCase()
    const matchesSearch = haystack.includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || sample.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const exportCsv = () => {
    const rows = filteredSamples.map((sample) => ({
      amostra: sample.sampleNumber,
      equipamento: sample.equipment?.equipmentNo || '',
      descricao: sample.equipment?.description || '',
      estado: sampleStatusLabel(sample.status),
      data: new Date(sample.createdAt).toLocaleDateString('pt-PT'),
    }))
    const header = ['Amostra', 'Equipamento', 'Descrição', 'Estado', 'Data']
    const csv = [
      header.join(','),
      ...rows.map((row) =>
        [row.amostra, row.equipamento, row.descricao, row.estado, row.data]
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(',')
      ),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'amostras-checkserv.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-8">
            <div className="flex-1">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Bem-vindo, {session?.user?.name?.split(' ')[0] || 'Usuário'}
              </h1>
              <p className="mb-5 text-gray-600">
                Gerencie suas amostras de óleo e acompanhe resultados de análises em tempo real
              </p>
              <Button 
                variant="primary" 
                onClick={() => setShowForm(true)}
                className="!bg-red-600 !text-white hover:!bg-red-700 shadow-lg shadow-red-500/20"
              >
                <Plus size={20} className="mr-2" />
                Registrar Nova Amostra
              </Button>
            </div>
            <div className="hidden lg:block">
              <FlaskConical size={72} className="text-red-100" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <stat.icon className="text-white" size={28} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Pesquisar por número de amostra ou equipamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              <Filter size={18} className="mr-2" />
              Filtros
            </Button>
            <Button
              variant="secondary"
              onClick={exportCsv}
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              <Download size={18} className="mr-2" />
              Exportar
            </Button>
          </div>
          {showFilters && (
            <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-end">
              <label className="block min-w-56">
                <span className="mb-1 block text-sm font-semibold text-gray-700">Estado</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                >
                  <option value="">Todos</option>
                  <option value="SUBMITTED">Submetida</option>
                  <option value="RECEIVED">Recebida</option>
                  <option value="IN_PROGRESS">Em análise</option>
                  <option value="COMPLETED">Completa</option>
                  <option value="REPORTED">Reportada</option>
                  <option value="CANCELLED">Cancelada</option>
                </select>
              </label>
              <Button
                variant="secondary"
                onClick={() => {
                  setStatusFilter('')
                  setSearchTerm('')
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              <p className="text-gray-600">Carregando amostras...</p>
            </div>
          </div>
        ) : !filteredSamples.length ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FlaskConical className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhuma amostra encontrada</h3>
            <p className="text-gray-600 mb-6">
              {samples?.data?.length ? 'Ajuste os filtros para ver mais resultados' : 'Comece registrando sua primeira amostra'}
            </p>
            <Button 
              variant="primary" 
              onClick={() => setShowForm(true)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Plus size={18} className="mr-2" />
              Registrar Amostra
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Número da Amostra
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Equipamento
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Data de Registro
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSamples.map((sample) => (
                  <tr key={sample.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FlaskConical size={16} className="text-red-600 mr-2" />
                        <span className="text-sm font-semibold text-gray-900">{sample.sampleNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{sample.equipment.equipmentNo}</div>
                      <div className="text-xs text-gray-500">{sample.equipment.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(sample.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(sample.createdAt).toLocaleDateString('pt-PT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedSample(sample)}
                        className="text-red-600 hover:text-red-700 transition mr-3 font-medium"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{filteredSamples.length}</span> de{' '}
                  <span className="font-medium">{samples?.data?.length || 0}</span> amostras
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <SampleForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false)
          }}
        />
      )}

      {selectedSample && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-white">
              <div>
                <h2 className="text-xl font-bold">{selectedSample.sampleNumber}</h2>
                <p className="text-sm text-red-100">Detalhes da amostra</p>
              </div>
              <button onClick={() => setSelectedSample(null)} className="rounded-full p-1 hover:bg-white/10">
                <X size={22} />
              </button>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-sm text-gray-500">Equipamento</div>
                <div className="font-semibold text-gray-900">{selectedSample.equipment?.equipmentNo}</div>
                <div className="text-sm text-gray-600">{selectedSample.equipment?.description}</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-sm text-gray-500">Estado</div>
                <div className="mt-2">{getStatusBadge(selectedSample.status)}</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-sm text-gray-500">Tipo / Prioridade</div>
                <div className="font-semibold text-gray-900">{selectedSample.type || '—'} / {selectedSample.priority || '—'}</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-sm text-gray-500">Leitura</div>
                <div className="font-semibold text-gray-900">{selectedSample.equipmentReading ?? '—'}</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-sm text-gray-500">Fluido</div>
                <div className="font-semibold text-gray-900">
                  {[selectedSample.fluidType, selectedSample.fluidGrade].filter(Boolean).join(' · ') || '—'}
                </div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-sm text-gray-500">Criada em</div>
                <div className="font-semibold text-gray-900">{new Date(selectedSample.createdAt).toLocaleString('pt-PT')}</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 md:col-span-2">
                <div className="text-sm text-gray-500">Observações</div>
                <div className="font-semibold text-gray-900">{selectedSample.customerComment || 'Sem observações.'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
