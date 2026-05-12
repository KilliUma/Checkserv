import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Input, Select, Button } from '@wearcheck/ui'
import axios from 'axios'
import { X } from 'lucide-react'

interface Equipment {
  id: string
  equipmentNo: string
  description: string
  components: Array<{
    id: string
    componentNo: string
    type: string
  }>
}

interface SampleFormProps {
  onClose: () => void
  onSuccess: () => void
}

export function SampleForm({ onClose, onSuccess }: SampleFormProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    equipmentId: '',
    componentId: '',
    type: 'ROUTINE',
    priority: 'NORMAL',
    reading: '',
    fluidType: '',
    fluidGrade: '',
    hoursSinceChange: '',
    customerComment: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Buscar equipamentos
  const { data: equipmentData } = useQuery<{ data: Equipment[] }>({
    queryKey: ['equipment'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/equipment')
      return response.data
    },
  })

  const equipment = equipmentData?.data || []
  const selectedEquipment = equipment.find((e) => e.id === formData.equipmentId)

  // Mutation para criar amostra
  const createSample = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await axios.post('/api/v1/samples', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['samples'] })
      onSuccess()
    },
    onError: (error: any) => {
      console.error('Erro ao criar amostra:', error)
      setErrors({ submit: error.response?.data?.error || 'Erro ao criar amostra' })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    // Validações
    if (!formData.equipmentId) newErrors.equipmentId = 'Selecione um equipamento'
    if (!formData.componentId) newErrors.componentId = 'Selecione um componente'
    if (!formData.reading) newErrors.reading = 'Informe a leitura'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    createSample.mutate(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Nova Amostra</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Equipamento"
              required
              value={formData.equipmentId}
              onChange={(e) =>
                setFormData({ ...formData, equipmentId: e.target.value, componentId: '' })
              }
              options={equipment.map((e) => ({
                value: e.id,
                label: `${e.equipmentNo} - ${e.description}`,
              }))}
              error={errors.equipmentId}
            />

            <Select
              label="Componente"
              required
              value={formData.componentId}
              onChange={(e) =>
                setFormData({ ...formData, componentId: e.target.value })
              }
              options={
                selectedEquipment?.components.map((c) => ({
                  value: c.id,
                  label: `${c.componentNo} - ${c.type}`,
                })) || []
              }
              error={errors.componentId}
              disabled={!formData.equipmentId}
            />

            <Select
              label="Tipo de Amostra"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: 'ROUTINE', label: 'Rotina' },
                { value: 'RESAMPLE', label: 'Reamostragem' },
                { value: 'EMERGENCY', label: 'Emergência' },
                { value: 'CORRECTIVE', label: 'Corretiva' },
                { value: 'COMMISSIONING', label: 'Comissionamento' },
              ]}
            />

            <Select
              label="Prioridade"
              required
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              options={[
                { value: 'LOW', label: 'Baixa' },
                { value: 'NORMAL', label: 'Normal' },
                { value: 'HIGH', label: 'Alta' },
              ]}
            />

            <Input
              label="Leitura (km/horas)"
              type="number"
              required
              value={formData.reading}
              onChange={(e) => setFormData({ ...formData, reading: e.target.value })}
              error={errors.reading}
            />

            <Input
              label="Horas desde troca"
              type="number"
              value={formData.hoursSinceChange}
              onChange={(e) =>
                setFormData({ ...formData, hoursSinceChange: e.target.value })
              }
            />

            <Input
              label="Tipo de Fluido"
              value={formData.fluidType}
              onChange={(e) => setFormData({ ...formData, fluidType: e.target.value })}
              placeholder="Ex: Óleo de motor"
            />

            <Input
              label="Grau do Fluido"
              value={formData.fluidGrade}
              onChange={(e) => setFormData({ ...formData, fluidGrade: e.target.value })}
              placeholder="Ex: SAE 15W-40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comentários
            </label>
            <textarea
              value={formData.customerComment}
              onChange={(e) =>
                setFormData({ ...formData, customerComment: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observações sobre a amostra..."
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createSample.isPending}
            >
              Criar Amostra
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
