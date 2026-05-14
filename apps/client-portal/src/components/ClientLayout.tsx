import { Link, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  FileText,
  FlaskConical,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  Wrench,
  X,
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { isStaffRole } from '../utils/roles'
import { withBasePath } from '../utils/basePath'
import { NotificationsMenu } from './NotificationsMenu'

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/amostras', label: 'Amostras', icon: FlaskConical },
  { path: '/relatorios', label: 'Relatórios', icon: FileText },
  { path: '/equipamentos', label: 'Equipamentos', icon: Wrench },
  { path: '/perfil', label: 'Meu Perfil', icon: User },
  { path: '/configuracoes', label: 'Configurações', icon: Settings },
]

export function ClientLayout() {
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouterState()
  const navigate = useNavigate()
  const { session, logout } = useAuthStore()
  const currentPath = router.location.pathname
  const activeItem = menuItems.find((item) => item.path === currentPath)
  const userInitial = session?.user.name?.trim()?.charAt(0).toUpperCase() || session?.user.email?.charAt(0).toUpperCase() || 'U'

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/login' })
  }

  const renderNavigation = () => (
    <nav className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mb-3 px-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-500">
        Portal
      </div>
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPath === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
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

      {isStaffRole(session?.user.role) && (
        <div className="mt-8">
          <div className="mb-3 px-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-500">
            Interno
          </div>
          <Link
            to="/admin/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex h-12 items-center gap-3 rounded-xl px-4 text-sm font-semibold text-gray-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <Settings size={19} />
            Administração
          </Link>
        </div>
      )}
    </nav>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 text-gray-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] flex-col border-r border-gray-200 bg-white/95 shadow-sm backdrop-blur-xl lg:flex">
        <a href={withBasePath('/dashboard')} className="flex h-[82px] items-center border-b border-gray-200 bg-gradient-to-br from-gray-50 via-white to-red-50 px-8">
          <img
            src={withBasePath('/wearcheck-logo.png')}
            alt="CheckServ"
            className="h-14 w-44 object-contain object-left"
          />
        </a>
        {renderNavigation()}
        <div className="border-t border-gray-200 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-700 text-sm font-bold text-white shadow-lg shadow-red-500/25">
              {userInitial}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-gray-900">{session?.user.name || 'Utilizador'}</div>
              <div className="truncate text-xs text-gray-500">Portal do cliente</div>
            </div>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute inset-0 bg-gray-900/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-[285px] flex-col bg-white shadow-2xl">
            <div className="flex h-[82px] items-center justify-between border-b border-gray-200 px-6">
              <img
                src={withBasePath('/wearcheck-logo.png')}
                alt="CheckServ"
                className="h-12 w-40 object-contain object-left"
              />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                aria-label="Fechar navegação"
              >
                <X size={20} />
              </button>
            </div>
            {renderNavigation()}
          </aside>
        </div>
      )}

      <div className="min-w-0 lg:ml-[272px]">
        <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-gray-200 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 lg:hidden"
              aria-label="Abrir navegação"
            >
              <Menu size={20} />
            </button>
            <Home size={18} className="hidden text-red-600 sm:block" />
            <ChevronRight size={16} className="hidden text-gray-400 sm:block" />
            <span className="truncate text-lg font-bold text-gray-900">{activeItem?.label || 'Portal do cliente'}</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
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
                <ChevronDown size={16} className="hidden text-gray-500 sm:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <div className="truncate text-sm font-bold text-gray-900">{session?.user.name}</div>
                    <div className="truncate text-xs text-gray-500">{session?.user.email}</div>
                  </div>
                  <Link
                    to="/perfil"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600"
                  >
                    Meu Perfil
                  </Link>
                  <Link
                    to="/configuracoes"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600"
                  >
                    Configurações
                  </Link>
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

        <main className="min-h-[calc(100vh-82px)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
