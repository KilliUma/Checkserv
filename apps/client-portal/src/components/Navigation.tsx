import { Link, useRouterState } from '@tanstack/react-router'
import { Home, FlaskConical, FileText, Cog } from 'lucide-react'

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/amostras', label: 'Amostras', icon: FlaskConical },
  { path: '/relatorios', label: 'Relatórios', icon: FileText },
  { path: '/equipamentos', label: 'Equipamentos', icon: Cog },
]

export function Navigation() {
  const router = useRouterState()
  const currentPath = router.location.pathname

  return (
    <nav className="bg-white border-b-2 border-gray-200 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-6 py-4 border-b-4 transition-all ${
                  isActive
                    ? 'border-[#FF6600] text-[#003366] font-semibold bg-orange-50'
                    : 'border-transparent text-gray-600 hover:text-[#003366] hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
