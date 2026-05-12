import Link from 'next/link'
import { Button } from '@wearcheck/ui'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-blue-900">WearCheck</h1>
              <div className="hidden md:flex space-x-6">
                <a href="#servicos" className="text-gray-700 hover:text-blue-600">Serviços</a>
                <a href="#sobre" className="text-gray-700 hover:text-blue-600">Sobre</a>
                <a href="#contacto" className="text-gray-700 hover:text-blue-600">Contacto</a>
              </div>
            </div>
            <Link href="http://localhost:3001/login">
              <Button variant="primary">Portal do Cliente</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Análise de Óleo & Monitoramento de Condições
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Proteja seus equipamentos com análises laboratoriais avançadas e relatórios detalhados
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="primary" size="lg">
              Solicitar Análise
            </Button>
            <Button variant="secondary" size="lg">
              Saber Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="servicos" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Nossos Serviços</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Análise de Óleo',
                description: 'Análise completa de óleos lubrificantes e fluidos hidráulicos',
                icon: '🔬',
              },
              {
                title: 'Monitoramento de Condições',
                description: 'Acompanhamento contínuo do estado dos equipamentos',
                icon: '📊',
              },
              {
                title: 'Relatórios Técnicos',
                description: 'Relatórios detalhados com recomendações de ação',
                icon: '📋',
              },
            ].map((service, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{service.title}</h4>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h5 className="font-bold mb-4">WearCheck Africa</h5>
              <p className="text-gray-400">
                Líder em análise de fluidos e monitoramento de condições na África do Sul
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Contacto</h5>
              <p className="text-gray-400">Tel: +27 31 700 5460</p>
              <p className="text-gray-400">Email: info@wearcheck.co.za</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Links Rápidos</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Portal do Cliente</a></li>
                <li><a href="#" className="hover:text-white">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white">Termos de Serviço</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 WearCheck Africa. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
