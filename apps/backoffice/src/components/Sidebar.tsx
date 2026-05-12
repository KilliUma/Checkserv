import { Link, useRouterState } from '@tanstack/react-router'
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FlaskConical, 
  FileText, 
  Settings,
  UserCheck
} from 'lucide-react'

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/aprovacao', label: 'Aprovação', icon: UserCheck },
  { path: '/usuarios', label: 'Usuários', icon: Users },
  { path: '/clientes', label: 'Clientes', icon: Building2 },
  { path: '/amostras', label: 'Amostras', icon: FlaskConical },
  { path: '/relatorios', label: 'Relatórios', icon: FileText },
  { path: '/configuracoes', label: 'Configurações', icon: Settings },
]

export function Sidebar() {
  const router = useRouterState()
  const currentPath = router.location.pathname

  return (
    <aside className="w-64 bg-wearcheck-blue text-white flex-shrink-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold">CheckServ</h1>
        <p className="text-sm text-gray-300">Backoffice</p>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPath === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-6 py-3 transition ${
                isActive
                  ? 'bg-wearcheck-orange text-white'
                  : 'text-gray-300 hover:bg-blue-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
