import { useEffect } from 'react'
import { Router, Route, RootRoute, RouterProvider, Outlet, Navigate } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './stores/authStore'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { PendingUsers } from './pages/PendingUsers'
import { Users, Customers, Samples, Reports, Settings } from './pages'
import { Spinner } from '@wearcheck/ui'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'

const queryClient = new QueryClient()

function ProtectedLayout() {
  const { isAuthenticated, isLoading, session } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  // Verificar se é admin
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'LAB_TECHNICIAN']
  if (!allowedRoles.includes(session?.user.role || '')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h2>
          <p className="text-gray-600">Você não tem permissão para acessar o backoffice.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

const rootRoute = new RootRoute()

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    const { isAuthenticated, isLoading } = useAuthStore()
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )
    }
    
    return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
  },
})

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
})

const protectedRoute = new Route({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: ProtectedLayout,
})

const dashboardRoute = new Route({
  getParentRoute: () => protectedRoute,
  path: '/dashboard',
  component: Dashboard,
})

const usersRoute = new Route({
  getParentRoute: () => protectedRoute,
  path: '/usuarios',
  component: Users,
})

const pendingUsersRoute = new Route({
  getParentRoute: () => protectedRoute,
  path: '/aprovacao',
  component: PendingUsers,
})

const customersRoute = new Route({
  getParentRoute: () => protectedRoute,
  path: '/clientes',
  component: Customers,
})

const samplesRoute = new Route({
  getParentRoute: () => protectedRoute,
  path: '/amostras',
  component: Samples,
})

const reportsRoute = new Route({
  getParentRoute: () => protectedRoute,
  path: '/relatorios',
  component: Reports,
})

const settingsRoute = new Route({
  getParentRoute: () => protectedRoute,
  path: '/configuracoes',
  component: Settings,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  protectedRoute.addChildren([
    dashboardRoute,
    pendingUsersRoute,
    usersRoute,
    customersRoute,
    samplesRoute,
    reportsRoute,
    settingsRoute,
  ]),
])

const router = new Router({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  const checkSession = useAuthStore((state) => state.checkSession)

  useEffect(() => {
    checkSession()
  }, [checkSession])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </QueryClientProvider>
  )
}

export default App
