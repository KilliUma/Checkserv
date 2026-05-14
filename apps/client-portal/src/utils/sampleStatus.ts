/** Rótulos PT para estados de amostra (área cliente + admin). */
export const SAMPLE_STATUS_LABELS: Record<string, string> = {
  REGISTERED: 'Registada',
  IN_TRANSIT: 'Em trânsito',
  RECEIVED: 'Recebida',
  TESTING: 'Em análise',
  COMPLETED: 'Completa',
  SUBMITTED: 'Submetida',
  CANCELLED: 'Cancelada',
}

export function sampleStatusBadgeClass(status: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    REGISTERED: { bg: 'bg-blue-100', text: 'text-blue-700' },
    IN_TRANSIT: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    RECEIVED: { bg: 'bg-purple-100', text: 'text-purple-700' },
    TESTING: { bg: 'bg-orange-100', text: 'text-orange-700' },
    COMPLETED: { bg: 'bg-green-100', text: 'text-green-700' },
    SUBMITTED: { bg: 'bg-blue-100', text: 'text-blue-700' },
    CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-600' },
  }
  return map[status] || { bg: 'bg-gray-100', text: 'text-gray-700' }
}

export function sampleStatusLabel(status: string): string {
  return SAMPLE_STATUS_LABELS[status] || status
}
