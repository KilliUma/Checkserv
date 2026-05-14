import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { portalApi } from '../lib/apiClient'
import { Bell, CheckCheck } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

interface Notification {
  id: string
  title: string
  message: string
  actionUrl?: string
  read: boolean
  createdAt: string
}

interface NotificationsResponse {
  data: Notification[]
  unreadCount: number
}

export function NotificationsMenu({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data } = useQuery<NotificationsResponse>({
    queryKey: ['notifications'],
    queryFn: async () => (await portalApi.get('/notifications?limit=8')).data,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  })

  const notifications = data?.data || []
  const unreadCount = data?.unreadCount || 0

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }

  const markRead = async (notification: Notification) => {
    if (!notification.read) {
      await portalApi.patch('/notifications', { id: notification.id })
      refresh()
    }

    if (notification.actionUrl) {
      navigate({ to: notification.actionUrl })
      setOpen(false)
    }
  }

  const markAllRead = async () => {
    await portalApi.patch('/notifications', { markAllRead: true })
    refresh()
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`relative inline-flex items-center justify-center rounded-full transition ${
          compact
            ? 'h-10 w-10 border border-gray-300 text-gray-700 hover:bg-gray-50'
            : 'h-10 w-10 bg-white/90 text-red-600 shadow-md hover:bg-white'
        }`}
        aria-label="Notificações"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <div className="font-semibold text-gray-900">Notificações</div>
              <div className="text-xs text-gray-500">{unreadCount} não lida(s)</div>
            </div>
            <button
              type="button"
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:text-gray-400 disabled:hover:bg-transparent"
            >
              <CheckCheck size={14} />
              Marcar todas
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {!notifications.length ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                Sem notificações.
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => markRead(notification)}
                  className="block w-full border-b border-gray-100 px-4 py-3 text-left last:border-0 hover:bg-gray-50"
                >
                  <div className="flex gap-3">
                    <span className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${notification.read ? 'bg-gray-300' : 'bg-red-600'}`} />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-gray-900">{notification.title}</span>
                      <span className="mt-1 block text-sm text-gray-600">{notification.message}</span>
                      <span className="mt-1 block text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleString('pt-PT')}
                      </span>
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
