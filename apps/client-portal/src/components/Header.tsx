import { Search, Facebook, Youtube, Twitter, Linkedin, Menu, ChevronDown, Globe, User, LogOut, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuthStore } from '../stores/authStore'
import { useNavigate } from '@tanstack/react-router'
import { withBasePath } from '../utils/basePath'
import { isStaffRole } from '../utils/roles'
import { NotificationsMenu } from './NotificationsMenu'

export function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, session, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/' })
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-md' 
        : 'backdrop-blur-md shadow-sm'
    }`}>
      {/* Top Bar - Administrative/Contact Info */}
      <div className={`border-b transition-colors duration-300 ${
        isScrolled ? 'bg-gray-100 border-gray-200' : 'bg-black/20 border-white/10'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-10 text-xs">
            {/* Contact Info */}
            <div className="flex items-center gap-6">
              <a href="tel:+27317005460" className={`flex items-center gap-2 transition ${
                isScrolled ? 'text-gray-600 hover:text-red-600' : 'text-white/90 hover:text-red-400'
              }`}>
                <span>+27 31 700 5460</span>
              </a>
              <a href="mailto:marketing@checkserv.co.ao" className={`flex items-center gap-2 transition ${
                isScrolled ? 'text-gray-600 hover:text-red-600' : 'text-white/90 hover:text-red-400'
              }`}>
                <span>marketing@checkserv.co.ao</span>
              </a>
            </div>

            {/* Social Media & Search */}
            <div className="flex items-center gap-3">
              <button className={`transition ${
                isScrolled ? 'text-gray-500 hover:text-red-600' : 'text-white/80 hover:text-red-400'
              }`}>
                <Search size={16} />
              </button>
              <div className={`w-px h-4 ${
                isScrolled ? 'bg-gray-300' : 'bg-white/20'
              }`}></div>
              <a href="#" className={`transition ${
                isScrolled ? 'text-gray-500 hover:text-red-600' : 'text-white/80 hover:text-red-400'
              }`}>
                <Facebook size={16} />
              </a>
              <a href="#" className={`transition ${
                isScrolled ? 'text-gray-500 hover:text-red-600' : 'text-white/80 hover:text-red-400'
              }`}>
                <Youtube size={16} />
              </a>
              <a href="#" className={`transition ${
                isScrolled ? 'text-gray-500 hover:text-red-600' : 'text-white/80 hover:text-red-400'
              }`}>
                <Twitter size={16} />
              </a>
              <a href="#" className={`transition ${
                isScrolled ? 'text-gray-500 hover:text-red-600' : 'text-white/80 hover:text-red-400'
              }`}>
                <Linkedin size={16} />
              </a>
              <div className={`w-px h-4 ${
                isScrolled ? 'bg-gray-300' : 'bg-white/20'
              }`}></div>
              {/* Language Selector */}
              <div className="flex items-center gap-1">
                <Globe size={14} className={isScrolled ? 'text-gray-500' : 'text-white/80'} />
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-1.5 py-0.5 rounded text-xs font-medium transition ${
                    language === 'en'
                      ? (isScrolled ? 'text-red-600' : 'text-red-400')
                      : (isScrolled ? 'text-gray-500 hover:text-red-600' : 'text-white/60 hover:text-white')
                  }`}
                >
                  EN
                </button>
                <span className={isScrolled ? 'text-gray-400' : 'text-white/40'}>|</span>
                <button 
                  onClick={() => setLanguage('pt')}
                  className={`px-1.5 py-0.5 rounded text-xs font-medium transition ${
                    language === 'pt'
                      ? (isScrolled ? 'text-red-600' : 'text-red-400')
                      : (isScrolled ? 'text-gray-500 hover:text-red-600' : 'text-white/60 hover:text-white')
                  }`}
                >
                  PT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <a href={withBasePath('/')}>
              <img 
                src={isScrolled ? withBasePath('/wearcheck-logo.png') : withBasePath('/checkserv.png')}
                alt="CheckServ - Condition Monitoring Specialists" 
                className="h-16 w-48 object-contain cursor-pointer transition-all duration-300"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {isAuthenticated ? (
              /* Authenticated Client Navigation */
              <>
                <a href={withBasePath('/dashboard')} className={`px-4 py-2 text-sm font-semibold transition relative group ${
                  isScrolled ? 'text-gray-700 hover:text-red-600' : 'text-white hover:text-red-400'
                }`}>
                  Dashboard
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all ${
                    isScrolled ? 'bg-red-600' : 'bg-white'
                  }`}></span>
                </a>
                
                <a href={withBasePath('/amostras')} className={`px-4 py-2 text-sm font-semibold transition relative group ${
                  isScrolled ? 'text-gray-700 hover:text-red-600' : 'text-white hover:text-red-400'
                }`}>
                  Amostras
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all ${
                    isScrolled ? 'bg-red-600' : 'bg-white'
                  }`}></span>
                </a>
                
                <a href={withBasePath('/relatorios')} className={`px-4 py-2 text-sm font-semibold transition relative group ${
                  isScrolled ? 'text-gray-700 hover:text-red-600' : 'text-white hover:text-red-400'
                }`}>
                  Relatórios
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all ${
                    isScrolled ? 'bg-red-600' : 'bg-white'
                  }`}></span>
                </a>
                
                <a href={withBasePath('/equipamentos')} className={`px-4 py-2 text-sm font-semibold transition relative group ${
                  isScrolled ? 'text-gray-700 hover:text-red-600' : 'text-white hover:text-red-400'
                }`}>
                  Equipamentos
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all ${
                    isScrolled ? 'bg-red-600' : 'bg-white'
                  }`}></span>
                </a>
                
                {isStaffRole(session?.user?.role) && (
                  <a href={withBasePath('/admin/dashboard')} className={`px-4 py-2 text-sm font-semibold transition relative group ${
                    isScrolled ? 'text-gray-700 hover:text-red-600' : 'text-white hover:text-red-400'
                  }`}>
                    Administração
                    <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all ${
                      isScrolled ? 'bg-red-600' : 'bg-white'
                    }`}></span>
                  </a>
                )}

                <div className="ml-2">
                  <NotificationsMenu />
                </div>

                {/* User Menu */}
                <div className="relative ml-4"
                     onMouseEnter={() => setOpenDropdown('user')}
                     onMouseLeave={() => setOpenDropdown(null)}>
                  <button className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition shadow-md hover:shadow-lg ${
                    isScrolled 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-white text-red-600 hover:bg-red-50'
                  }`}>
                    <User size={18} />
                    <span>{session?.user?.name?.split(' ')[0] || 'Usuário'}</span>
                    <ChevronDown size={14} className={`transition-transform ${openDropdown === 'user' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'user' && (
                    <div className="absolute top-full right-0 mt-0 bg-white shadow-xl rounded-lg py-2 min-w-[200px] z-50 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-5 py-2.5 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Logado como</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{session?.user?.email}</p>
                      </div>
                      <a href={withBasePath('/perfil')} className="flex items-center gap-2 px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition">
                        <User size={16} />
                        Meu Perfil
                      </a>
                      <a href={withBasePath('/configuracoes')} className="flex items-center gap-2 px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition">
                        <Settings size={16} />
                        Configurações
                      </a>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                      >
                        <LogOut size={16} />
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Public Website Navigation */
              <>
                <a href={withBasePath('/')} className={`px-3 py-2 text-sm font-medium transition relative group ${
                  isScrolled ? 'text-red-600 hover:text-red-700' : 'text-white hover:text-red-400'
                }`}>
                  {t('header.home')}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 transform scale-x-100 group-hover:scale-x-100 transition ${
                    isScrolled ? 'bg-red-600' : 'bg-white'
                  }`}></span>
                </a>
                
                {/* ABOUT Dropdown */}
                <div className="relative"
                     onMouseEnter={() => setOpenDropdown('about')}
                     onMouseLeave={() => setOpenDropdown(null)}>
                  <button className={`px-3 py-2 text-sm font-medium transition flex items-center gap-1 ${
                    isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'
                  }`}>
                    {t('header.about')} <ChevronDown size={14} className={`transition-transform ${openDropdown === 'about' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'about' && (
                    <div className="absolute top-full left-0 mt-0 bg-white shadow-xl rounded-lg py-2 min-w-[220px] z-50 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                      <a href="#" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition">{t('header.aboutCompany')}</a>
                      <a href="#" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition">{t('header.aboutPeople')}</a>
                      <a href="#" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition">{t('header.accreditations')}</a>
                    </div>
                  )}
                </div>

                {/* SERVICES Dropdown */}
                <div className="relative"
                     onMouseEnter={() => setOpenDropdown('services')}
                     onMouseLeave={() => setOpenDropdown(null)}>
                  <button className={`px-3 py-2 text-sm font-medium transition flex items-center gap-1 ${
                    isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'
                  }`}>
                    {t('header.services')} <ChevronDown size={14} className={`transition-transform ${openDropdown === 'services' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'services' && (
                    <div className="absolute top-full left-0 mt-0 bg-white shadow-xl rounded-lg py-2 min-w-[240px] z-50 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                      <a href="#" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition">{t('header.servicesAnalysis')}</a>
                      <a href="#" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition">{t('header.servicesReliability')}</a>
                      <a href="#" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition">{t('header.servicesLubricant')}</a>
                    </div>
                  )}
                </div>

                {/* TRAINING Dropdown */}
                <div className="relative"
                     onMouseEnter={() => setOpenDropdown('training')}
                     onMouseLeave={() => setOpenDropdown(null)}>
                  <button className={`px-3 py-2 text-sm font-medium transition flex items-center gap-1 ${
                    isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'
                  }`}>
                    {t('header.training')} <ChevronDown size={14} className={`transition-transform ${openDropdown === 'training' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'training' && (
                    <div className="absolute top-full left-0 mt-0 bg-white shadow-xl rounded-lg py-2 min-w-[220px] z-50 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                      <a href="#" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition">{t('header.trainingCourses')}</a>
                      <a href="#" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition">{t('header.trainingSchedule')}</a>
                      <a href="#" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition">{t('header.trainingRegister')}</a>
                    </div>
                  )}
                </div>

                <a href="#" className={`px-3 py-2 text-sm font-medium transition ${
                  isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'
                }`}>{t('header.press')}</a>

                {/* INFO Dropdown */}
                <div className="relative"
                     onMouseEnter={() => setOpenDropdown('info')}
                     onMouseLeave={() => setOpenDropdown(null)}>
                  <button className={`px-3 py-2 text-sm font-medium transition flex items-center gap-1 ${
                    isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'
                  }`}>
                    {t('header.info')} <ChevronDown size={14} className={`transition-transform ${openDropdown === 'info' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'info' && (
                    <div className="absolute top-full left-0 mt-0 bg-white shadow-xl rounded-lg py-2 min-w-[220px] z-50 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                      <a href="#" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition">{t('header.infoResources')}</a>
                      <a href="#" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition">{t('header.infoDownloads')}</a>
                      <a href="#" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition">{t('header.infoFaqs')}</a>
                    </div>
                  )}
                </div>

                <a href="#" className={`px-3 py-2 text-sm font-medium transition ${
                  isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'
                }`}>{t('header.blog')}</a>

                {/* CONTACTS Dropdown */}
                <div className="relative"
                     onMouseEnter={() => setOpenDropdown('contacts')}
                     onMouseLeave={() => setOpenDropdown(null)}>
                  <button className={`px-3 py-2 text-sm font-medium transition flex items-center gap-1 ${
                    isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'
                  }`}>
                    {t('header.contacts')} <ChevronDown size={14} className={`transition-transform ${openDropdown === 'contacts' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'contacts' && (
                    <div className="absolute top-full left-0 mt-0 bg-white shadow-xl rounded-lg py-2 min-w-[220px] z-50 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                      <a href="#" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition">{t('header.contactsUs')}</a>
                      <a href="#" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition">{t('header.contactsLocations')}</a>
                      <a href="#" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition">{t('header.contactsSupport')}</a>
                    </div>
                  )}
                </div>
                
                <a 
                  href={withBasePath('/login')} 
                  className={`ml-4 px-6 py-2.5 rounded-full text-sm font-semibold transition shadow-md hover:shadow-lg ${
                    isScrolled 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-white text-red-600 hover:bg-red-50'
                  }`}
                >
                  Área do Cliente
                </a>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`xl:hidden p-2 rounded-lg transition ${
              isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  )
}
