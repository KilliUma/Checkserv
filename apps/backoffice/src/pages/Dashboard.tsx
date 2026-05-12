export function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Clientes', value: '156', color: 'blue' },
          { label: 'Amostras Hoje', value: '23', color: 'green' },
          { label: 'Relatórios Pendentes', value: '8', color: 'yellow' },
          { label: 'Ações Críticas', value: '3', color: 'red' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Atividade Recente</h3>
          <p className="text-gray-600">Últimas ações do sistema...</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Alertas</h3>
          <p className="text-gray-600">Notificações importantes...</p>
        </div>
      </div>
    </div>
  )
}
