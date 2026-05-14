import { useQuery } from '@tanstack/react-query'
import { 
  FlaskConical, 
  FileText, 
  Cog, 
  TrendingUp, 
  Clock,
  CheckCircle,
  ArrowRight,
  Activity,
  Calendar,
  Plus
} from 'lucide-react'
import { portalApi } from '../lib/apiClient'
import { useAuthStore } from '../stores/authStore'
import { Button } from '@wearcheck/ui'
import { useNavigate } from '@tanstack/react-router'

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
  }
}

export function Dashboard() {
  const { session } = useAuthStore()
  const navigate = useNavigate()

  const { data: samples, isLoading: loadingSamples } = useQuery<{ data: Sample[] }>({
    queryKey: ['samples'],
    queryFn: async () => {
      const response = await portalApi.get('/v1/samples')
      return response.data
    },
  })

  const { data: reports, isLoading: loadingReports } = useQuery<{ data: Report[] }>({
    queryKey: ['reports'],
    queryFn: async () => {
      const response = await portalApi.get('/v1/reports')
      return response.data
    },
  })

  const { data: equipment } = useQuery({
    queryKey: ['equipment'],
    queryFn: async () => {
      const response = await portalApi.get('/v1/equipment')
      return response.data
    },
  })

  // Estatísticas
  const totalSamples = samples?.data?.length || 0
  const samplesInTesting = samples?.data?.filter(s => s.status === 'TESTING').length || 0
  const completedSamples = samples?.data?.filter(s => s.status === 'COMPLETED').length || 0
  const totalReports = reports?.data?.length || 0
  const reportsReady = reports?.data?.filter(r => r.status === 'READY').length || 0
  const totalEquipment = equipment?.data?.length || 0
  const activeEquipment = equipment?.data?.filter((e: any) => e.status === 'ACTIVE').length || 0

  // Relatórios recentes (últimos 5)
  const recentReports = reports?.data?.slice(0, 5) || []

  // Amostras recentes (últimas 5)
  const recentSamples = samples?.data?.slice(0, 5) || []

  // Amostras pendentes/em análise
  const pendingSamples = samples?.data?.filter(s => 
    ['REGISTERED', 'IN_TRANSIT', 'RECEIVED', 'TESTING'].includes(s.status)
  ) || []

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      REGISTERED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Registada' },
      IN_TRANSIT: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Em Trânsito' },
      RECEIVED: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Recebida' },
      TESTING: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Em Análise' },
      COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completa' },
      QUEUED: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Na Fila' },
      GENERATING: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Gerando' },
      READY: { bg: 'bg-green-100', text: 'text-green-700', label: 'Pronto' },
      SENT: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Enviado' },
    }
    const badge = badges[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-8">
            <div className="flex-1">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Bem-vindo, {session?.user?.name?.split(' ')[0] || 'Usuário'}! 👋
              </h1>
              <p className="text-gray-600">
                Aqui está um resumo da sua atividade recente
              </p>
            </div>
            <div className="hidden lg:block">
              <Activity size={64} className="text-red-100" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Amostras */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border-t-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FlaskConical className="text-blue-600" size={24} />
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {samplesInTesting} em análise
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total de Amostras</h3>
            <p className="text-3xl font-bold text-gray-900">{totalSamples}</p>
            <button 
              onClick={() => navigate({ to: '/amostras' })}
              className="text-blue-600 text-sm font-medium mt-3 hover:underline flex items-center gap-1"
            >
              Ver todas <ArrowRight size={14} />
            </button>
          </div>

          {/* Relatórios */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border-t-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="text-green-600" size={24} />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {reportsReady} prontos
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Relatórios</h3>
            <p className="text-3xl font-bold text-gray-900">{totalReports}</p>
            <button 
              onClick={() => navigate({ to: '/relatorios' })}
              className="text-green-600 text-sm font-medium mt-3 hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowRight size={14} />
            </button>
          </div>

          {/* Equipamentos */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border-t-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Cog className="text-purple-600" size={24} />
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                {activeEquipment} ativos
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Equipamentos</h3>
            <p className="text-3xl font-bold text-gray-900">{totalEquipment}</p>
            <button 
              onClick={() => navigate({ to: '/equipamentos' })}
              className="text-purple-600 text-sm font-medium mt-3 hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowRight size={14} />
            </button>
          </div>

          {/* Quick Action */}
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition text-white">
            <div className="flex flex-col h-full justify-between">
              <div>
                <Plus size={32} className="mb-4 opacity-80" />
                <h3 className="text-lg font-semibold mb-2">Submeter Nova Amostra</h3>
                <p className="text-red-100 text-sm">
                  Registre uma nova amostra de óleo para análise
                </p>
              </div>
              <Button 
                onClick={() => navigate({ to: '/amostras' })}
                className="mt-4 !bg-white !text-red-600 hover:!bg-red-50 w-full justify-center"
              >
                Registrar Agora
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Reports & Samples */}
          <div className="lg:col-span-2 space-y-8">
            {/* Relatórios Recentes */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="text-red-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">Relatórios Recentes</h2>
                  </div>
                  <button 
                    onClick={() => navigate({ to: '/relatorios' })}
                    className="text-red-600 text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    Ver todos <ArrowRight size={14} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                {loadingReports ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  </div>
                ) : recentReports.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="mx-auto mb-2 text-gray-300" size={48} />
                    <p>Nenhum relatório disponível</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">{report.reportNumber}</span>
                            {getStatusBadge(report.status)}
                          </div>
                          <p className="text-sm text-gray-600">{report.sample.equipment.equipmentNo}</p>
                          <p className="text-xs text-gray-500">{report.sample.equipment.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(report.reportDate).toLocaleDateString('pt-PT')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Amostras Recentes */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FlaskConical className="text-red-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">Amostras Recentes</h2>
                  </div>
                  <button 
                    onClick={() => navigate({ to: '/amostras' })}
                    className="text-red-600 text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    Ver todas <ArrowRight size={14} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                {loadingSamples ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  </div>
                ) : recentSamples.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FlaskConical className="mx-auto mb-2 text-gray-300" size={48} />
                    <p>Nenhuma amostra registrada</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentSamples.map((sample) => (
                      <div key={sample.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">{sample.sampleNumber}</span>
                            {getStatusBadge(sample.status)}
                          </div>
                          <p className="text-sm text-gray-600">{sample.equipment.equipmentNo}</p>
                          <p className="text-xs text-gray-500">{sample.equipment.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(sample.createdAt).toLocaleDateString('pt-PT')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Alerts & Quick Stats */}
          <div className="space-y-8">
            {/* Amostras Pendentes */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-orange-50">
                <div className="flex items-center gap-3">
                  <Clock className="text-orange-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Amostras em Progresso</h2>
                </div>
              </div>
              <div className="p-6">
                {loadingSamples ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                  </div>
                ) : pendingSamples.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <CheckCircle className="mx-auto mb-2 text-green-400" size={40} />
                    <p className="text-sm">Todas as amostras foram processadas!</p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <p className="text-4xl font-bold text-orange-600">{pendingSamples.length}</p>
                      <p className="text-sm text-gray-600">amostras em progresso</p>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {pendingSamples.map((sample) => (
                        <div key={sample.id} className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-gray-900">{sample.sampleNumber}</span>
                            {getStatusBadge(sample.status)}
                          </div>
                          <p className="text-xs text-gray-600 truncate">{sample.equipment.equipmentNo}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="text-red-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Este Mês</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Amostras Submetidas</p>
                    <p className="text-2xl font-bold text-blue-600">{completedSamples}</p>
                  </div>
                  <FlaskConical className="text-blue-400" size={32} />
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Relatórios Gerados</p>
                    <p className="text-2xl font-bold text-green-600">{reportsReady}</p>
                  </div>
                  <FileText className="text-green-400" size={32} />
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Taxa de Processamento</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {totalSamples > 0 ? Math.round((completedSamples / totalSamples) * 100) : 0}%
                    </p>
                  </div>
                  <Activity className="text-purple-400" size={32} />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Acesso Rápido</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate({ to: '/amostras' })}
                  className="w-full text-left p-3 bg-white/10 hover:bg-white/20 rounded-lg transition flex items-center justify-between"
                >
                  <span className="text-sm">Submeter Amostra</span>
                  <ArrowRight size={16} />
                </button>
                <button 
                  onClick={() => navigate({ to: '/relatorios' })}
                  className="w-full text-left p-3 bg-white/10 hover:bg-white/20 rounded-lg transition flex items-center justify-between"
                >
                  <span className="text-sm">Ver Relatórios</span>
                  <ArrowRight size={16} />
                </button>
                <button 
                  onClick={() => navigate({ to: '/equipamentos' })}
                  className="w-full text-left p-3 bg-white/10 hover:bg-white/20 rounded-lg transition flex items-center justify-between"
                >
                  <span className="text-sm">Gerir Equipamentos</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
