import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Building, Mail, Phone, MapPin, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Customer {
  id: string
  name: string
  tradingName?: string
  email: string
  phone?: string
  city?: string
  country?: string
}

interface PendingUser {
  id: string
  name: string
  email: string
  phone?: string
  createdAt: string
  customer?: Customer
}

export function PendingUsers() {
  const [users, setUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState<string | null>(null)

  const fetchPendingUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users/pending', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar usuários pendentes')
      }

      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      toast.error('Erro ao carregar usuários pendentes')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleActivate = async (userId: string) => {
    if (!confirm('Tem certeza que deseja ativar este usuário?')) {
      return
    }

    try {
      setActivating(userId)
      const response = await fetch(`/api/users/${userId}/activate`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Erro ao ativar usuário')
      }

      toast.success('Usuário ativado com sucesso!')
      // Recarregar lista
      fetchPendingUsers()
    } catch (error) {
      toast.error('Erro ao ativar usuário')
      console.error(error)
    } finally {
      setActivating(null)
    }
  }

  useEffect(() => {
    fetchPendingUsers()
  }, [])

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Aprovação de Usuários</h1>
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600" />
          <p className="text-gray-600 mt-4">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Aprovação de Usuários</h1>
          <p className="text-gray-600 mt-1">
            {users.length} {users.length === 1 ? 'usuário aguardando' : 'usuários aguardando'} aprovação
          </p>
        </div>
        <button
          onClick={fetchPendingUsers}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
        >
          Atualizar
        </button>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum usuário pendente
          </h3>
          <p className="text-gray-600">
            Todos os registros foram processados.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">
                        Registrado em {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Dados do Usuário */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Dados do Usuário</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Dados da Empresa */}
                    {user.customer && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Dados da Empresa</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="font-medium">{user.customer.name}</div>
                            {user.customer.tradingName && user.customer.tradingName !== user.customer.name && (
                              <div className="text-xs text-gray-500">({user.customer.tradingName})</div>
                            )}
                          </div>
                        </div>
                        {(user.customer.city || user.customer.country) && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>
                              {[user.customer.city, user.customer.country].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="ml-6">
                  <button
                    onClick={() => handleActivate(user.id)}
                    disabled={activating === user.id}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition flex items-center gap-2 font-medium"
                  >
                    {activating === user.id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Ativando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Aprovar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
