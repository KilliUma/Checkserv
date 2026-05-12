import { useAuthStore } from '../stores/authStore'
import { Button } from '@wearcheck/ui'
import { useNavigate } from '@tanstack/react-router'
import { LogOut, User } from 'lucide-react'

export function Header() {
  const { session, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/login' })
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-8 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Painel Administrativo
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-700">
            <User size={20} />
            <div className="text-sm">
              <p className="font-medium">{session?.user.name}</p>
              <p className="text-gray-500 text-xs">{session?.user.role}</p>
            </div>
          </div>
          <Button 
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2"
          >
            <LogOut size={16} />
            <span>Sair</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
