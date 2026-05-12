import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Input, Button, Card } from '@wearcheck/ui'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      toast.success('Login realizado com sucesso!')
      navigate({ to: '/' })
    } catch (err) {
      toast.error('Credenciais inválidas')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">CheckServ</h1>
          <p className="text-blue-200">Backoffice Administrativo</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Login Admin</h2>
              <p className="text-gray-600 text-sm">Acesso restrito a administradores</p>
            </div>

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@checkserv.co.ao"
              required
              autoComplete="email"
            />

            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Entrar
            </Button>
          </form>
        </Card>

        <div className="mt-6 text-center text-white text-sm">
          <p>Credenciais Admin: admin@checkserv.co.ao / Admin@123</p>
        </div>
      </div>
    </div>
  )
}
