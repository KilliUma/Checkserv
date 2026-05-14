import { Router, Route, RootRoute, RouterProvider, Outlet, Navigate } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Spinner } from '@wearcheck/ui'
import { PublicHome } from './pages/PublicHome'
import { Dashboard } from './pages/Dashboard'
import { Samples } from './pages/Samples'
import { Reports } from './pages/Reports'
import { Equipment } from './pages/Equipment'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { AdminLayout } from './components/AdminLayout'
import { LanguageProvider } from './contexts/LanguageContext'
import { useAuthStore } from './stores/authStore'
import { routerBasePath, withBasePath } from './utils/basePath'
import { getDefaultRouteForRole, isStaffRole } from './utils/roles'
import {
  AdminApprovals,
  AdminCustomers,
  AdminDashboard,
  AdminReports,
  AdminSamples,
  AdminSettings,
  AdminUsers,
} from './pages/admin/AdminPages'

const queryClient = new QueryClient()

function AdminOnly({ children }: { children: React.ReactNode }) {
  const { session } = useAuthStore()

  if (session?.user.role !== 'SUPER_ADMIN' && session?.user.role !== 'ADMIN') {
    return (
      <div className="rounded-md bg-white p-8 text-center shadow-sm">
        <h1 className="mb-2 text-xl font-bold text-red-600">Acesso restrito</h1>
        <p className="text-sm text-gray-600">Esta página está disponível apenas para administradores.</p>
      </div>
    )
  }

  return <>{children}</>
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}

function ProtectedLayout() {
  const { isAuthenticated, isLoading, checkSession } = useAuthStore()

  useEffect(() => {
    checkSession()
  }, [checkSession])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    window.location.href = withBasePath('/login')
    return null
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

function AdminProtectedLayout() {
  const { isAuthenticated, isLoading, checkSession, session } = useAuthStore()

  useEffect(() => {
    checkSession()
  }, [checkSession])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    window.location.href = withBasePath('/login')
    return null
  }

  if (!isStaffRole(session?.user.role)) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-32">
          <div className="mx-auto max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
            <h1 className="mb-3 text-2xl font-bold text-red-600">Acesso negado</h1>
            <p className="mb-6 text-gray-600">A sua conta não tem permissão para aceder à administração.</p>
            <Navigate to={getDefaultRouteForRole(session?.user.role)} replace />
          </div>
        </div>
      </Layout>
    )
  }

  return <AdminLayout />
}

function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Página não encontrada</p>
        <a 
          href={withBasePath('/')} 
          className="px-6 py-3 bg-wearcheck-blue text-white rounded-lg hover:bg-blue-800 transition"
        >
          Voltar ao Dashboard
        </a>
      </div>
    </Layout>
  )
}

const rootRoute = new RootRoute({
  notFoundComponent: NotFound,
})

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <Layout>
      <PublicHome />
    </Layout>
  ),
})

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
})

const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/registro',
  component: Register,
})

const protectedRoute = new Route({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: ProtectedLayout,
})

const adminProtectedRoute = new Route({
  getParentRoute: () => rootRoute,
  id: 'admin',
  component: AdminProtectedLayout,
})

const dashboardRoute = new Route({
  getParentRoute: () => protectedRoute,
  path: '/dashboard',
  component: Dashboard,
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

const equipmentRoute = new Route({
  getParentRoute: () => protectedRoute,
  path: '/equipamentos',
  component: Equipment,
})

const adminIndexRoute = new Route({
  getParentRoute: () => adminProtectedRoute,
  path: '/admin',
  component: () => <Navigate to="/admin/dashboard" replace />,
})

const adminDashboardRoute = new Route({
  getParentRoute: () => adminProtectedRoute,
  path: '/admin/dashboard',
  component: AdminDashboard,
})

const adminApprovalsRoute = new Route({
  getParentRoute: () => adminProtectedRoute,
  path: '/admin/aprovacao',
  component: () => (
    <AdminOnly>
      <AdminApprovals />
    </AdminOnly>
  ),
})

const adminUsersRoute = new Route({
  getParentRoute: () => adminProtectedRoute,
  path: '/admin/usuarios',
  component: () => (
    <AdminOnly>
      <AdminUsers />
    </AdminOnly>
  ),
})

const adminCustomersRoute = new Route({
  getParentRoute: () => adminProtectedRoute,
  path: '/admin/clientes',
  component: () => (
    <AdminOnly>
      <AdminCustomers />
    </AdminOnly>
  ),
})

const adminSamplesRoute = new Route({
  getParentRoute: () => adminProtectedRoute,
  path: '/admin/amostras',
  component: AdminSamples,
})

const adminReportsRoute = new Route({
  getParentRoute: () => adminProtectedRoute,
  path: '/admin/relatorios',
  component: AdminReports,
})

const adminSettingsRoute = new Route({
  getParentRoute: () => adminProtectedRoute,
  path: '/admin/configuracoes',
  component: () => (
    <AdminOnly>
      <AdminSettings />
    </AdminOnly>
  ),
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  protectedRoute.addChildren([
    dashboardRoute,
    samplesRoute,
    reportsRoute,
    equipmentRoute,
  ]),
  adminProtectedRoute.addChildren([
    adminIndexRoute,
    adminDashboardRoute,
    adminApprovalsRoute,
    adminUsersRoute,
    adminCustomersRoute,
    adminSamplesRoute,
    adminReportsRoute,
    adminSettingsRoute,
  ]),
])

const router = new Router({ 
  routeTree,
  basepath: routerBasePath
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </LanguageProvider>
    </QueryClientProvider>
  )
}

export default App
