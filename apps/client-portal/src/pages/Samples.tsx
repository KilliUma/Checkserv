import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@wearcheck/ui'
import { SampleForm } from '../components/SampleForm'
import { FlaskConical, Search, Filter, Download, Plus, Clock, CheckCircle } from 'lucide-react'
import { portalApi } from '../lib/apiClient'
import { sampleStatusBadgeClass, sampleStatusLabel } from '../utils/sampleStatus'
import { useAuthStore } from '../stores/authStore'

interface Sample {
  id: string
  sampleNumber: string
  status: string
  equipment: {
    equipmentNo: string
    description: string
  }
  createdAt: string
}

export function Samples() {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3">
                Bem-vindo, {session?.user?.name?.split(' ')[0] || 'Usuário'}
              </h1>
              <p className="text-red-100 text-lg mb-6">
                Gerencie suas amostras de óleo e acompanhe resultados de análises em tempo real
              </p>
              <Button 
                variant="primary" 
                onClick={() => setShowForm(true)}
                className="bg-white text-red-600 hover:bg-red-50 shadow-lg"
              >
                <Plus size={20} className="mr-2" />
                Registrar Nova Amostra
              </Button>
            </div>
            <div className="hidden lg:block">
              <FlaskConical size={120} className="text-red-300 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-8 pb-12">
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
          <div className="flex gap-4">
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
            <Button variant="secondary" className="border-red-600 text-red-600 hover:bg-red-50">
              <Filter size={18} className="mr-2" />
              Filtros
            </Button>
            <Button variant="secondary" className="border-red-600 text-red-600 hover:bg-red-50">
              <Download size={18} className="mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              <p className="text-gray-600">Carregando amostras...</p>
            </div>
          </div>
        ) : !samples?.data?.length ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FlaskConical className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhuma amostra encontrada</h3>
            <p className="text-gray-600 mb-6">Comece registrando sua primeira amostra</p>
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
                {samples?.data?.map((sample) => (
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
                      <button className="text-red-600 hover:text-red-700 transition mr-3 font-medium">
                        Ver Detalhes
                      </button>
                      <button className="text-gray-600 hover:text-gray-700 transition font-medium">
                        Editar
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
                  Mostrando <span className="font-medium">{samples?.data?.length || 0}</span> amostras
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Anterior
                  </button>
                  <button className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                    Próxima
                  </button>
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
    </div>
  )
}
