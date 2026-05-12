import { Router, Route, RootRoute, RouterProvider, Outlet } from '@tanstack/react-router'
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
import { LanguageProvider } from './contexts/LanguageContext'
import { useAuthStore } from './stores/authStore'

const queryClient = new QueryClient()

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
    window.location.href = '/checkserv/login'
    return null
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Página não encontrada</p>
        <a 
          href="/checkserv/" 
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
])

const router = new Router({ 
  routeTree,
  basepath: '/checkserv'
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

