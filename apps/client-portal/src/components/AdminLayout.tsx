import { Link, Outlet, useRouterState, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  Building2,
  ChevronDown,
  ChevronRight,
  FileText,
  FlaskConical,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCheck,
  Users,
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { isAdminRole } from '../utils/roles'
import { withBasePath } from '../utils/basePath'
import { NotificationsMenu } from './NotificationsMenu'

const staffItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Core' },
  { path: '/admin/amostras', label: 'Amostras', icon: FlaskConical, group: 'Operação' },
  { path: '/admin/relatorios', label: 'Relatórios', icon: FileText, group: 'Operação' },
]

const adminItems = [
  { path: '/admin/aprovacao', label: 'Aprovação', icon: UserCheck, group: 'Gestão' },
  { path: '/admin/usuarios', label: 'Utilizadores', icon: Users, group: 'Gestão' },
  { path: '/admin/clientes', label: 'Clientes', icon: Building2, group: 'Gestão' },
  { path: '/admin/configuracoes', label: 'Configurações', icon: Settings, group: 'Conta' },
]

export function AdminLayout() {
  const [profileOpen, setProfileOpen] = useState(false)
  const router = useRouterState()
  const navigate = useNavigate()
  const { session, logout } = useAuthStore()
  const currentPath = router.location.pathname
  const canManage = isAdminRole(session?.user.role)
  const menuItems = canManage ? [...staffItems, ...adminItems] : staffItems
  const activeItem = menuItems.find((item) => item.path === currentPath)
  const groupedItems = useMemo(
    () =>
      menuItems.reduce<Record<string, typeof menuItems>>((groups, item) => {
        groups[item.group] = [...(groups[item.group] || []), item]
        return groups
      }, {}),
    [menuItems]
  )
  const userInitial = session?.user.name?.trim()?.charAt(0).toUpperCase() || session?.user.email?.charAt(0).toUpperCase() || 'A'

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/login' })
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 text-gray-900">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col border-r border-gray-200 bg-white/95 shadow-sm backdrop-blur-xl">
        <a href={withBasePath('/admin/dashboard')} className="flex h-[86px] items-center border-b border-gray-200 bg-gradient-to-br from-gray-50 via-white to-red-50 px-8">
          <img
            src={withBasePath('/wearcheck-logo.png')}
            alt="CheckServ"
            className="h-14 w-44 object-contain object-left"
          />
        </a>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          {Object.entries(groupedItems).map(([group, items]) => (
            <div key={group} className="mb-7 last:mb-0">
              <div className="mb-3 px-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-500">
                {group}
              </div>
              <div className="space-y-2">
                {items.map((item) => {
                  const Icon = item.icon
                  const isActive = currentPath === item.path

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex h-12 items-center justify-between rounded-xl px-4 text-sm font-semibold transition ${
                        isActive
                          ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30'
                          : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={19} strokeWidth={2} />
                        <span>{item.label}</span>
                      </span>
                      {isActive && <ChevronRight size={16} />}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-gray-200 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-700 text-sm font-bold text-white shadow-lg shadow-red-500/25">
              {userInitial}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-gray-900">{session?.user.name || 'Administrador'}</div>
              <div className="truncate text-xs text-gray-500">Administração</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="ml-[272px] flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[86px] items-center justify-between border-b border-gray-200 bg-white/90 px-8 backdrop-blur-xl">
          <div className="flex items-center gap-3 text-sm">
            <Home size={18} className="text-red-600" />
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-lg font-bold text-gray-900">{activeItem?.label || 'Administração'}</span>
          </div>

          <div className="flex items-center gap-5">
            <NotificationsMenu compact />
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 rounded-full py-1 pl-1 pr-2 transition hover:bg-red-50"
                aria-label="Menu do utilizador"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-700 text-sm font-bold text-white shadow-lg shadow-red-500/25">
                  {userInitial}
                </span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <div className="truncate text-sm font-bold text-gray-900">{session?.user.name}</div>
                    <div className="truncate text-xs text-gray-500">{session?.user.email}</div>
                  </div>
                  <a
                    href={withBasePath('/dashboard')}
                    className="block px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600"
                  >
                    Ver área do cliente
                  </a>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut size={16} />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
