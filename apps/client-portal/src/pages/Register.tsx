import { useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { User, Mail, Lock, Building, Phone, MapPin, FileText, ArrowRight, CheckCircle2, Smartphone, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { withBasePath } from '../utils/basePath'
import { getApiBaseUrl } from '../utils/apiBaseUrl'

const apiBaseUrl = getApiBaseUrl()

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    tradingName: '',
    registrationNo: '',
    address: '',
    city: '',
    country: 'Angola',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }

    if (formData.password.length < 8) {
      toast.error('A senha deve ter no mínimo 8 caracteres')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          tradingName: formData.tradingName,
          registrationNo: formData.registrationNo,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta')
      }

      toast.success(data.message || 'Conta criada com sucesso! Aguarde a aprovação do administrador.')
      navigate({ to: '/login' })
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar conta')
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
              to="/login"
              className="text-sm text-gray-600 hover:text-red-600 transition font-medium"
            >
              Já tem conta? Entrar
            </Link>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-20">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Benefits */}
            <div className="hidden lg:block space-y-8">
              <div>
                <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  Junte-se ao<br />
                  <span className="text-red-600">CheckServ</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Crie sua conta e tenha acesso completo à plataforma de monitoramento
                </p>
              </div>

              {/* Mobile App Section */}
              <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-8 text-white">
                <div className="flex items-start gap-4 mb-6">
                  <Smartphone className="w-12 h-12 flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold mb-2">CheckServ Online & Mobile App</h3>
                    <p className="text-red-100">Resultados de análise. A qualquer momento, em qualquer lugar...</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <p className="text-sm text-red-50">
                    Nossa Aplicação de Monitoramento de Condições está disponível.
                  </p>
                  <p className="text-sm font-semibold">
                    CheckServ Mobile é GRATUITO e compatível com dispositivos Android e Apple.
                  </p>
                </div>
                <div className="flex gap-3">
                  <a 
                    href="https://play.google.com/store" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black hover:bg-gray-900 transition px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    Google Play
                  </a>
                  <a 
                    href="https://apps.apple.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black hover:bg-gray-900 transition px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                    </svg>
                    App Store
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <p className="text-gray-700">Acesso instantâneo aos seus relatórios</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <p className="text-gray-700">Dashboard personalizado com métricas relevantes</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <p className="text-gray-700">Gestão completa de equipamentos e amostras</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <p className="text-gray-700">Aplicativo móvel gratuito para análises em movimento</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <p className="text-sm text-gray-700">
                  <strong className="text-red-600">Nota:</strong> Após o registro, sua conta será 
                  analisada pela nossa equipe. Você receberá um email de confirmação em até 24 horas.
                </p>
              </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
                  <h2 className="text-2xl font-bold text-white">Criar Nova Conta</h2>
                  <p className="text-red-100 text-sm mt-1">Preencha os dados para começar</p>
                </div>

                {/* Card Body */}
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="João Silva"
                          required
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    {/* Email and Phone - Same Line */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="joao@empresa.com"
                            required
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Telefone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+244 923 456 789"
                            required
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Company Name and Trading Name - Same Line */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nome da Empresa *
                        </label>
                        <div className="relative">
                          <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Nome Oficial da Empresa Lda"
                            required
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nome Comercial
                        </label>
                        <div className="relative">
                          <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="tradingName"
                            value={formData.tradingName}
                            onChange={handleChange}
                            placeholder="Nome comercial (se diferente)"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Registration Number and Address - Same Line */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Número de Registo Comercial
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="registrationNo"
                            value={formData.registrationNo}
                            onChange={handleChange}
                            placeholder="NIF / Número de registo"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Endereço *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Rua, Avenida, Bairro"
                            required
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                          />
                        </div>
                      </div>
                    </div>

                    {/* City and Country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Cidade *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Luanda"
                            required
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          País *
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                        >
                          <option value="Angola">Angola</option>
                          <option value="Moçambique">Moçambique</option>
                          <option value="África do Sul">África do Sul</option>
                          <option value="Outro">Outro</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-5 mt-2">
                      <p className="text-sm font-semibold text-gray-700 mb-4">Dados de Acesso</p>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Senha *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Mínimo 8 caracteres"
                          required
                          minLength={8}
                          className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
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

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirmar Senha *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Repita a senha"
                          required
                          minLength={8}
                          className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Terms */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" required className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                      <span className="text-sm text-gray-600">
                        Concordo com os <a href="#" className="text-red-600 hover:underline">Termos de Uso</a> e{' '}
                        <a href="#" className="text-red-600 hover:underline">Política de Privacidade</a>
                      </span>
                    </label>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3.5 rounded-xl hover:from-red-700 hover:to-red-800 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Criando conta...
                        </>
                      ) : (
                        <>
                          Criar Conta
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
