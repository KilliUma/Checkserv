import { Button } from '@wearcheck/ui'
import { Cog, Search, Filter, Plus, Edit, Trash2, Activity } from 'lucide-react'

// Dados mock para demonstração visual
const mockEquipment = [
  {
    id: '1',
    equipmentNo: 'CAT-793D-001',
    description: 'Camião Mineiro CAT 793D',
    manufacturer: 'Caterpillar',
    model: '793D',
    serialNumber: 'CAT00X793DXXXXXX001',
    location: 'Mina Norte - Setor A',
    status: 'ACTIVE',
    lastSample: '05/02/2026',
    totalSamples: 24,
  },
  {
    id: '2',
    equipmentNo: 'KOM-PC1250-002',
    description: 'Escavadora Komatsu PC1250',
    manufacturer: 'Komatsu',
    model: 'PC1250-8',
    serialNumber: 'KMTXXXXPC1250008002',
    location: 'Mina Sul - Setor B',
    status: 'ACTIVE',
    lastSample: '07/02/2026',
    totalSamples: 18,
  },
  {
    id: '3',
    equipmentNo: 'VOL-A40G-003',
    description: 'Dumper Articulado Volvo A40G',
    manufacturer: 'Volvo',
    model: 'A40G',
    serialNumber: 'VOLXXXXA40GXXXXXX003',
    location: 'Mina Norte - Setor C',
    status: 'MAINTENANCE',
    lastSample: '01/02/2026',
    totalSamples: 32,
  },
]

export function Equipment() {
  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      ACTIVE: { bg: 'bg-green-100', text: 'text-green-700', label: 'Ativo' },
      MAINTENANCE: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Manutenção' },
      INACTIVE: { bg: 'bg-red-100', text: 'text-red-700', label: 'Inativo' },
      RETIRED: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Retirado' },
    }
    const badge = badges[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#003366] rounded-lg">
              <Cog className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#003366]">Gestão de Equipamentos</h1>
              <p className="text-sm text-gray-600">Visualize e gerencie a sua frota de equipamentos</p>
            </div>
          </div>
          <Button 
            variant="primary" 
            className="bg-[#FF6600] hover:bg-[#E55A00] text-white"
          >
            <Plus size={16} className="mr-2" />
            Novo Equipamento
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Pesquisar por número, fabricante ou modelo..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent"
            />
          </div>
          <Button variant="secondary" className="border-[#003366] text-[#003366]">
            <Filter size={18} className="mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Equipment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockEquipment.map((equipment) => (
          <div key={equipment.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border-t-4 border-[#FF6600]">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Cog className="text-[#003366]" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#003366]">{equipment.equipmentNo}</h3>
                    <p className="text-xs text-gray-600">{equipment.manufacturer}</p>
                  </div>
                </div>
                {getStatusBadge(equipment.status)}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">{equipment.description}</h4>
                <p className="text-xs text-gray-500">Modelo: {equipment.model}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-gray-600 mb-1">Série</div>
                  <div className="font-mono font-semibold text-[#003366] truncate">{equipment.serialNumber}</div>
                </div>
                <div className="bg-orange-50 p-2 rounded">
                  <div className="text-gray-600 mb-1">Localização</div>
                  <div className="font-semibold text-[#FF6600] truncate">{equipment.location}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Activity size={14} />
                    <span>{equipment.totalSamples} amostras</span>
                  </div>
                  <div>
                    Última: {equipment.lastSample}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="bg-gray-50 px-4 py-3 border-t flex justify-end gap-2">
              <button className="p-2 text-[#003366] hover:bg-white rounded transition">
                <Edit size={16} />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded transition">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <div className="text-2xl font-bold text-[#003366]">45</div>
          <div className="text-sm text-gray-600">Total de Equipamentos</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <div className="text-2xl font-bold text-[#003366]">42</div>
          <div className="text-sm text-gray-600">Ativos</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
          <div className="text-2xl font-bold text-[#003366]">3</div>
          <div className="text-sm text-gray-600">Em Manutenção</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-[#FF6600]">
          <div className="text-2xl font-bold text-[#003366]">156</div>
          <div className="text-sm text-gray-600">Amostras este Mês</div>
        </div>
      </div>
    </div>
  )
}
