import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Search, RefreshCw } from 'lucide-react'

export type ApiList<T> = { data: T[]; count?: number }

export interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  status: string
  phone?: string
  createdAt: string
  lastLoginAt?: string
  customer?: {
    name: string
    status: string
    tradingName?: string
    email?: string
    phone?: string
    city?: string
    country?: string
  }
}

export interface Customer {
  id: string
  name: string
  tradingName?: string
  email: string
  phone?: string
  city?: string
  country?: string
  status: string
  createdAt: string
  _count?: {
    users: number
    equipment: number
    samples: number
    reports: number
  }
}

export interface AdminSampleRow {
  id: string
  sampleNumber: string
  status: string
  priority: string
  createdAt: string
  customer?: { name: string }
  equipment?: { equipmentNo: string; description: string }
}

export interface AdminReportRow {
  id: string
  reportNumber: string
  reportDate: string
  status: string
  customer?: { name: string }
  sample?: {
    sampleNumber: string
    equipment?: { equipmentNo: string; description: string }
    component?: { componentNo: string; type: string }
  }
}

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super administrador',
  ADMIN: 'Administrador',
  LAB_TECHNICIAN: 'Técnico de laboratório',
  CUSTOMER_ADMIN: 'Admin do cliente',
  CUSTOMER_USER: 'Utilizador do cliente',
}

export function adminStatusBadge(status: string) {
  const styles: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-800',
    TRIAL: 'bg-blue-100 text-blue-700',
    SUSPENDED: 'bg-red-100 text-red-700',
    INACTIVE: 'bg-gray-100 text-gray-700',
    SUBMITTED: 'bg-blue-100 text-blue-700',
    TESTING: 'bg-orange-100 text-orange-700',
    COMPLETED: 'bg-green-100 text-green-700',
    READY: 'bg-green-100 text-green-700',
    QUEUED: 'bg-gray-100 text-gray-700',
    GENERATING: 'bg-blue-100 text-blue-700',
    SENT: 'bg-purple-100 text-purple-700',
    READ: 'bg-slate-100 text-slate-700',
    ARCHIVED: 'bg-gray-100 text-gray-600',
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-700'}`}
    >
      {status}
    </span>
  )
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
}: {
  title: string
  description: string
  icon: LucideIcon
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-wearcheck-orange/15 text-wearcheck-orange">
          <Icon size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {actions}
    </div>
  )
}

export function RefreshButton({ onClick, busy }: { onClick: () => void; busy?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
    >
      <RefreshCw size={16} className={busy ? 'animate-spin' : ''} />
      Atualizar
    </button>
  )
}

export function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <div className="mb-4 max-w-md relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm focus:border-wearcheck-orange focus:outline-none focus:ring-2 focus:ring-orange-100"
      />
    </div>
  )
}

export function EmptyState({ label }: { label: string }) {
  return <div className="rounded-md bg-white p-10 text-center text-sm text-gray-600 shadow-sm">{label}</div>
}

export function LoadingState() {
  return (
    <div className="rounded-md bg-white p-10 text-center text-sm text-gray-600 shadow-sm">
      <RefreshCw className="mx-auto mb-3 animate-spin text-wearcheck-orange" size={24} />
      A carregar dados...
    </div>
  )
}
