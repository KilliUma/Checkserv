import { Clock, ExternalLink, Server, Settings, Shield } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { getApiBaseUrl } from '../../utils/apiBaseUrl'
import { withBasePath } from '../../utils/basePath'
import { PageHeader, ROLE_LABELS } from './shared'

export function AdminSettings() {
  const { session } = useAuthStore()
  const apiRoot = getApiBaseUrl() || '(mesmo domínio — proxy em desenvolvimento)'

  return (
    <div>
      <PageHeader title="Configurações" description="Informações da sessão e da ligação à API" icon={Settings} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
            <Shield size={18} className="text-wearcheck-orange" />
            Sessão atual
          </div>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-gray-500">Nome</dt>
              <dd className="font-medium text-gray-900">{session?.user.name || '—'}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-gray-500">Email</dt>
              <dd className="max-w-[60%] truncate text-right font-medium text-gray-900">{session?.user.email || '—'}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-gray-500">Função</dt>
              <dd className="font-medium text-gray-900">{ROLE_LABELS[session?.user.role || ''] || session?.user.role || '—'}</dd>
            </div>
            <div className="flex justify-between pb-2">
              <dt className="text-gray-500">Cliente (tenant)</dt>
              <dd className="max-w-[55%] truncate text-right font-mono text-xs text-gray-800">{session?.user.customerId || '—'}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
            <Server size={18} className="text-wearcheck-orange" />
            API
          </div>
          <p className="mb-3 text-sm text-gray-600">
            O portal usa pedidos autenticados com cookie HTTP-only. Em produção, defina{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">VITE_API_URL</code> apontando para o host da API.
          </p>
          <div className="rounded-md border border-gray-200 bg-gray-50 p-3 font-mono text-xs text-gray-800 break-all">
            {apiRoot}
          </div>
          <p className="mt-3 text-xs text-gray-500">Ambiente de build: {import.meta.env.MODE}</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
            <Clock size={18} className="text-wearcheck-orange" />
            Operação e políticas
          </div>
          <ul className="list-inside list-disc space-y-2 text-sm text-gray-600">
            <li>Aprovação de novas contas é manual (área Aprovação).</li>
            <li>Administradores da plataforma gerem utilizadores e clientes; técnicos de laboratório acedem a amostras e relatórios.</li>
            <li>O painel clássico em aplicação separada pode ser descontinuado quando esta área cobrir todo o fluxo interno.</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={withBasePath('/dashboard')}
              className="inline-flex items-center gap-2 text-sm font-medium text-wearcheck-orange hover:underline"
            >
              Área do cliente
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
