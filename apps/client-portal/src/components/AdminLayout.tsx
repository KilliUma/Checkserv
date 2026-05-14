import { Link, Outlet, useRouterState, useNavigate } from '@tanstack/react-router'
import {
  BarChart3,
  Building2,
  FileText,
  FlaskConical,
  LogOut,
  Settings,
  UserCheck,
  Users,
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { isAdminRole } from '../utils/roles'
import { withBasePath } from '../utils/basePath'

const staffItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/admin/amostras', label: 'Amostras', icon: FlaskConical },
  { path: '/admin/relatorios', label: 'Relatórios', icon: FileText },
]

const adminItems = [
  { path: '/admin/aprovacao', label: 'Aprovação', icon: UserCheck },
  { path: '/admin/usuarios', label: 'Utilizadores', icon: Users },
  { path: '/admin/clientes', label: 'Clientes', icon: Building2 },
  { path: '/admin/configuracoes', label: 'Configurações', icon: Settings },
]

export function AdminLayout() {
  const router = useRouterState()
  const navigate = useNavigate()
  const { session, logout } = useAuthStore()
  const currentPath = router.location.pathname
  const canManage = isAdminRole(session?.user.role)
  const menuItems = canManage ? [...staffItems, ...adminItems] : staffItems

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/login' })
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 flex-shrink-0 bg-wearcheck-blue text-white">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="text-xl font-bold">CheckServ</div>
          <div className="text-sm text-white/70">Administração</div>
        </div>

        <nav className="space-y-0.5 px-2 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-wearcheck-orange text-white shadow-sm'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
          <div>
            <div className="text-sm text-gray-500">Área administrativa</div>
            <div className="font-semibold text-gray-900">{session?.user.name}</div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={withBasePath('/dashboard')}
              className="text-sm font-medium text-gray-600 hover:text-wearcheck-orange"
            >
              Ver área do cliente
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </header>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
