import { FormEvent, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Activity, Cog, Filter, Plus, Search, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@wearcheck/ui'
import { portalApi } from '../lib/apiClient'

interface EquipmentRow {
  id: string
  equipmentNo: string
  description: string
  manufacturer?: string | null
  model?: string | null
  serialNumber?: string | null
  status: string
  currentReading?: number | null
  readingUnit?: string | null
  site?: {
    name?: string | null
    city?: string | null
  } | null
  _count?: {
    samples: number
  }
}

const statusLabels: Record<string, string> = {
  ACTIVE: 'Ativo',
  MAINTENANCE: 'Manutenção',
  INACTIVE: 'Inativo',
  DECOMMISSIONED: 'Desativado',
}

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    MAINTENANCE: 'bg-yellow-100 text-yellow-700',
    INACTIVE: 'bg-red-100 text-red-700',
    DECOMMISSIONED: 'bg-gray-100 text-gray-700',
  }

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {statusLabels[status] || status}
    </span>
  )
}

export function Equipment() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({
    equipmentNo: '',
    description: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    currentReading: '',
    readingUnit: 'hours',
  })

  const { data, isLoading } = useQuery<{ data: EquipmentRow[]; count: number }>({
    queryKey: ['equipment'],
    queryFn: async () => (await portalApi.get('/v1/equipment')).data,
  })

  const equipment = data?.data || []

  const filteredEquipment = useMemo(
    () =>
      equipment.filter((item) => {
        const haystack = `${item.equipmentNo} ${item.description} ${item.manufacturer || ''} ${item.model || ''} ${item.serialNumber || ''}`.toLowerCase()
        const matchesSearch = haystack.includes(searchTerm.toLowerCase())
        const matchesStatus = !statusFilter || item.status === statusFilter
        return matchesSearch && matchesStatus
      }),
    [equipment, searchTerm, statusFilter]
  )

  const createEquipment = useMutation({
    mutationFn: async () =>
      portalApi.post('/v1/equipment', {
        equipmentNo: form.equipmentNo,
        description: form.description,
        manufacturer: form.manufacturer || undefined,
        model: form.model || undefined,
        serialNumber: form.serialNumber || undefined,
        currentReading: form.currentReading ? Number(form.currentReading) : undefined,
        readingUnit: form.readingUnit || undefined,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['equipment'] })
      setShowCreate(false)
      setForm({
        equipmentNo: '',
        description: '',
        manufacturer: '',
        model: '',
        serialNumber: '',
        currentReading: '',
        readingUnit: 'hours',
      })
      toast.success('Equipamento criado com sucesso')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Não foi possível criar o equipamento')
    },
  })

  const handleCreate = (event: FormEvent) => {
    event.preventDefault()
    createEquipment.mutate()
  }

  const totals = {
    all: equipment.length,
    active: equipment.filter((item) => item.status === 'ACTIVE').length,
    maintenance: equipment.filter((item) => item.status === 'MAINTENANCE').length,
    samples: equipment.reduce((sum, item) => sum + (item._count?.samples || 0), 0),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-red-600">Frota</p>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Equipamentos</h1>
              <p className="mt-3 max-w-2xl text-gray-600">
                Visualize a frota, acompanhe amostras associadas e registe novos equipamentos.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowCreate(true)}
              className="!bg-red-600 !text-white shadow-lg shadow-red-500/20 hover:!bg-red-700"
            >
              <Plus size={18} className="mr-2" />
              Novo Equipamento
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            { label: 'Total de Equipamentos', value: totals.all, color: 'from-red-600 to-red-700' },
            { label: 'Ativos', value: totals.active, color: 'from-green-600 to-green-700' },
            { label: 'Em Manutenção', value: totals.maintenance, color: 'from-yellow-500 to-yellow-600' },
            { label: 'Amostras associadas', value: totals.samples, color: 'from-gray-800 to-gray-900' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xl shadow-gray-900/5">
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white ${stat.color}`}>
                <Activity size={22} />
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
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Pesquisar por número, fabricante, modelo ou série..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
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
          </div>
          {showFilters && (
            <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-end">
              <label className="block min-w-56">
                <span className="mb-1 block text-sm font-semibold text-gray-700">Estado</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                >
                  <option value="">Todos</option>
                  <option value="ACTIVE">Ativo</option>
                  <option value="MAINTENANCE">Manutenção</option>
                  <option value="INACTIVE">Inativo</option>
                  <option value="DECOMMISSIONED">Desativado</option>
                </select>
              </label>
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('')
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="rounded-2xl bg-white p-12 text-center text-gray-600 shadow-xl">A carregar equipamentos...</div>
        ) : !filteredEquipment.length ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-xl">
            <Cog className="mx-auto mb-4 text-gray-300" size={64} />
            <h3 className="text-xl font-semibold text-gray-900">Nenhum equipamento encontrado</h3>
            <p className="mt-2 text-gray-600">
              {equipment.length ? 'Ajuste os filtros para ver mais resultados.' : 'Registe o primeiro equipamento da sua frota.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredEquipment.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-900/5 transition hover:shadow-2xl">
                <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                        <Cog size={22} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-gray-900">{item.equipmentNo}</h3>
                        <p className="truncate text-sm text-gray-500">{item.manufacturer || 'Fabricante não definido'}</p>
                      </div>
                    </div>
                    {statusBadge(item.status)}
                  </div>
                </div>
                <div className="space-y-4 p-5">
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.description}</h4>
                    <p className="text-sm text-gray-500">{item.model || 'Modelo não definido'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-gray-50 p-3">
                      <div className="text-gray-500">Série</div>
                      <div className="truncate font-semibold text-gray-900">{item.serialNumber || '—'}</div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3">
                      <div className="text-gray-500">Localização</div>
                      <div className="truncate font-semibold text-gray-900">{item.site?.name || item.site?.city || '—'}</div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3">
                      <div className="text-gray-500">Leitura</div>
                      <div className="font-semibold text-gray-900">
                        {item.currentReading ?? '—'} {item.currentReading ? item.readingUnit || '' : ''}
                      </div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3">
                      <div className="text-gray-500">Amostras</div>
                      <div className="font-semibold text-gray-900">{item._count?.samples || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-white">
              <div>
                <h2 className="text-xl font-bold">Novo Equipamento</h2>
                <p className="text-sm text-red-100">Registe um equipamento para associar amostras.</p>
              </div>
              <button onClick={() => setShowCreate(false)} className="rounded-full p-1 hover:bg-white/10">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="grid gap-4 p-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-gray-700">Número do equipamento</span>
                <input
                  value={form.equipmentNo}
                  onChange={(event) => setForm((current) => ({ ...current, equipmentNo: event.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-gray-700">Descrição</span>
                <input
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-gray-700">Fabricante</span>
                <input
                  value={form.manufacturer}
                  onChange={(event) => setForm((current) => ({ ...current, manufacturer: event.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-gray-700">Modelo</span>
                <input
                  value={form.model}
                  onChange={(event) => setForm((current) => ({ ...current, model: event.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-gray-700">Número de série</span>
                <input
                  value={form.serialNumber}
                  onChange={(event) => setForm((current) => ({ ...current, serialNumber: event.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </label>
              <div className="grid grid-cols-[1fr_120px] gap-3">
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-gray-700">Leitura atual</span>
                  <input
                    type="number"
                    value={form.currentReading}
                    onChange={(event) => setForm((current) => ({ ...current, currentReading: event.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-gray-700">Unidade</span>
                  <select
                    value={form.readingUnit}
                    onChange={(event) => setForm((current) => ({ ...current, readingUnit: event.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                  >
                    <option value="hours">Horas</option>
                    <option value="km">Km</option>
                  </select>
                </label>
              </div>
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 md:col-span-2">
                <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" isLoading={createEquipment.isPending}>
                  Criar Equipamento
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
