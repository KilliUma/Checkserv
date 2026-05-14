import { FormEvent, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, BarChart3, Mail, Shield, ShieldCheck, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { portalApi } from '../lib/apiClient'
import { withBasePath } from '../utils/basePath'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const { data } = await portalApi.post('/auth/forgot-password', { email })
      setSent(true)
      toast.success(data.message || 'Pedido enviado com sucesso')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Não foi possível solicitar recuperação')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      <div className="absolute left-0 right-0 top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href={withBasePath('/')}>
              <img
                src={withBasePath('/wearcheck-logo.png')}
                alt="CheckServ"
                className="h-12 w-auto object-contain"
              />
            </a>
            <Link to="/login" className="text-sm font-medium text-gray-600 transition hover:text-red-600">
              Voltar ao login
            </Link>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-20">
        <div className="w-full max-w-6xl">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="hidden space-y-8 lg:block">
              <div>
                <h1 className="mb-4 text-5xl font-bold leading-tight text-gray-900">
                  Acesso seguro ao<br />
                  <span className="text-red-600">CheckServ Online</span>
                </h1>
                <p className="text-xl leading-relaxed text-gray-600">
                  Recupere o acesso mantendo a proteção dos seus dados e relatórios.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-100">
                    <BarChart3 className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-900">Acesso aos seus relatórios</h3>
                    <p className="text-sm text-gray-600">Retome rapidamente o acompanhamento das suas análises.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-100">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-900">Validação segura</h3>
                    <p className="text-sm text-gray-600">O pedido é tratado pela equipa de suporte para proteger a conta.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-100">
                    <Zap className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-900">Suporte assistido</h3>
                    <p className="text-sm text-gray-600">A equipa confirma o pedido e orienta o próximo passo.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 text-white">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                    <ShieldCheck size={26} />
                  </div>
                  <h2 className="text-2xl font-bold">Recuperar senha</h2>
                  <p className="mt-1 text-sm text-red-100">
                    Envie o pedido para a equipa de suporte validar e ajudar com o acesso.
                  </p>
                </div>

                <div className="p-8">
                  {sent ? (
                    <div className="rounded-xl bg-red-50 p-5 text-sm leading-6 text-gray-700">
                      Pedido registado. Se o email existir na plataforma, a equipa de suporte receberá uma notificação e entrará em contacto.
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-gray-700">Email da conta</span>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="seu@email.com"
                            required
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                          />
                        </div>
                      </label>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 py-3.5 font-semibold text-white shadow-lg shadow-red-500/30 transition hover:from-red-700 hover:to-red-800 disabled:opacity-50"
                      >
                        {isLoading ? 'A enviar...' : 'Solicitar recuperação'}
                        <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                      </button>
                    </form>
                  )}

                  <Link
                    to="/login"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-red-600 transition hover:text-red-700"
                  >
                    <ArrowLeft size={16} />
                    Voltar ao login
                  </Link>
                </div>
              </div>

              <div className="mt-8 text-center text-sm text-gray-600 lg:hidden">
                <p>✓ Validação segura &nbsp;•&nbsp; ✓ Suporte assistido &nbsp;•&nbsp; ✓ Dados protegidos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
