import { FlaskConical, FileText, Cog, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react'

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#003366] to-[#004488] text-white rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Bem-vindo ao CheckServ Online</h1>
        <p className="text-blue-100">Acesse os resultados das suas análises e gerencie o seu programa de monitoramento</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#FF6600] hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FlaskConical className="text-[#FF6600]" size={24} />
            </div>
            <span className="text-3xl font-bold text-[#003366]">12</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Amostras Pendentes</h3>
          <p className="text-xs text-gray-500 mt-1">Em análise no laboratório</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="text-green-600" size={24} />
            </div>
            <span className="text-3xl font-bold text-[#003366]">8</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Relatórios Prontos</h3>
          <p className="text-xs text-gray-500 mt-1">Disponíveis para download</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Cog className="text-blue-600" size={24} />
            </div>
            <span className="text-3xl font-bold text-[#003366]">45</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Equipamentos</h3>
          <p className="text-xs text-gray-500 mt-1">Na sua frota</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="text-yellow-600" size={24} />
            </div>
            <span className="text-3xl font-bold text-[#003366]">3</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Alertas Ativos</h3>
          <p className="text-xs text-gray-500 mt-1">Requerem atenção</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas Amostras */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-[#003366]">Últimas Amostras</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { id: 'WCK-2026-000005', status: 'READY', date: '09/02/2026' },
                { id: 'WCK-2026-000004', status: 'GENERATING', date: '08/02/2026' },
                { id: 'WCK-2026-000003', status: 'READY', date: '07/02/2026' },
              ].map((sample) => (
                <div key={sample.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div>
                    <div className="font-medium text-[#003366]">{sample.id}</div>
                    <div className="text-xs text-gray-500">{sample.date}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    sample.status === 'READY' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {sample.status === 'READY' ? 'Pronto' : 'Em Análise'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-[#003366]">Acesso Rápido</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <a href="/amostras" className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow-md transition">
                <FlaskConical className="text-[#003366] mb-2" size={32} />
                <span className="text-sm font-medium text-[#003366]">Ver Amostras</span>
              </a>
              <a href="/relatorios" className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg hover:shadow-md transition">
                <FileText className="text-[#FF6600] mb-2" size={32} />
                <span className="text-sm font-medium text-[#003366]">Relatórios</span>
              </a>
              <a href="/equipamentos" className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-md transition">
                <Cog className="text-green-600 mb-2" size={32} />
                <span className="text-sm font-medium text-[#003366]">Equipamentos</span>
              </a>
              <a href="#" className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:shadow-md transition">
                <TrendingUp className="text-purple-600 mb-2" size={32} />
                <span className="text-sm font-medium text-[#003366]">Análises</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-l-4 border-[#003366] p-6 rounded-lg">
        <div className="flex items-start gap-4">
          <CheckCircle className="text-[#003366] flex-shrink-0" size={24} />
          <div>
            <h3 className="font-semibold text-[#003366] mb-2">Sistema de Monitoramento de Condições</h3>
            <p className="text-sm text-gray-700">
              O CheckServ Online permite que você gerencie o seu programa de análise de óleo e acesse resultados através da internet. 
              Utilize os menus de navegação acima para acessar diferentes funcionalidades do sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
