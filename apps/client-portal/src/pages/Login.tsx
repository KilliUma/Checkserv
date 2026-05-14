import { useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { Lock, Mail, ArrowRight, Shield, Zap, BarChart3, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'
import { withBasePath } from '../utils/basePath'
import { getDefaultRouteForRole } from '../utils/roles'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      const session = useAuthStore.getState().session
      toast.success('Login realizado com sucesso!')
      navigate({ to: getDefaultRouteForRole(session?.user.role) })
    } catch (err: any) {
      toast.error(err.message || 'Não foi possível iniciar sessão')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href={withBasePath('/')}>
              <img 
                src={withBasePath('/wearcheck-logo.png')}
                alt="CheckServ" 
                className="h-12 w-auto object-contain"
              />
            </a>
            <Link 
              to="/"
              className="text-sm text-gray-600 hover:text-red-600 transition font-medium"
            >
              ← Voltar ao site
            </Link>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-20">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Branding & Features */}
            <div className="hidden lg:block space-y-8">
              <div>
                <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  Bem-vindo ao<br />
                  <span className="text-red-600">CheckServ Online</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Plataforma inteligente de monitoramento de condições e análise de fluidos
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Análises em Tempo Real</h3>
                    <p className="text-sm text-gray-600">Acesse resultados e relatórios instantaneamente</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Segurança Garantida</h3>
                    <p className="text-sm text-gray-600">Seus dados protegidos com criptografia avançada</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Gestão Eficiente</h3>
                    <p className="text-sm text-gray-600">Acompanhe equipamentos e amostras de forma simplificada</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
                  <h2 className="text-2xl font-bold text-white">Acesso à Área do Cliente</h2>
                  <p className="text-red-100 text-sm mt-1">Entre com suas credenciais para continuar</p>
                </div>

                {/* Card Body */}
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="seu@email.com"
                          required
                          autoComplete="email"
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Senha
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          autoComplete="current-password"
                          className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember & Forgot */}
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                        <span className="text-gray-600">Lembrar-me</span>
                      </label>
                      <Link to="/recuperar-senha" className="text-red-600 hover:text-red-700 font-medium">
                        Esqueceu a senha?
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3.5 rounded-xl hover:from-red-700 hover:to-red-800 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Entrando...
                        </>
                      ) : (
                        <>
                          Entrar na Plataforma
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Novo por aqui?</span>
                    </div>
                  </div>

                  {/* Register Link */}
                  <Link
                    to="/registro"
                    className="block w-full text-center py-3.5 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    Criar Nova Conta
                  </Link>

                  {/* Support Info */}
                  <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-600 mb-2">Precisa de ajuda?</p>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                      <a href="mailto:suporte@checkserv.co.ao" className="text-red-600 hover:underline font-medium">
                        suporte@checkserv.co.ao
                      </a>
                      <span className="text-gray-300">|</span>
                      <a href="tel:+244923456789" className="text-red-600 hover:underline font-medium">
                        +244 923 456 789
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Features */}
              <div className="lg:hidden mt-8 text-center text-sm text-gray-600">
                <p>✓ Análises em tempo real &nbsp;•&nbsp; ✓ Dados seguros &nbsp;•&nbsp; ✓ Gestão simplificada</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
