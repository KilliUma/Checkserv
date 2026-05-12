import { FlaskConical, Cog, Building2, Award, Globe, TestTube, Briefcase, Medal, ArrowUp } from 'lucide-react'
import { PannellumViewer } from '../components/PannellumViewer'
import { useState, useEffect } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useLanguage } from '../contexts/LanguageContext'
import { withBasePath } from '../utils/basePath'

export function PublicHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { t } = useLanguage();

  // Scroll animations para cada seção
  const aboutSection = useScrollAnimation();
  const servicesSection = useScrollAnimation();
  const videoSection = useScrollAnimation();
  const tourSection = useScrollAnimation();
  const eventsSection = useScrollAnimation();
  const blogSection = useScrollAnimation();

  const slides = [
    {
      title: t('hero.slide1Title'),
      description: t('hero.slide1Desc'),
      image: "heart"
    },
    {
      title: t('hero.slide2Title'),
      description: t('hero.slide2Desc'),
      image: "water"
    },
    {
      title: t('hero.slide3Title'),
      description: t('hero.slide3Desc'),
      image: "oil"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(timer);
  }, [slides.length]);

  // Back to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="w-full bg-white">
      {/* Hero Carousel - Modern Redesign */}
      <section className="relative h-screen max-h-[900px] flex items-center overflow-hidden">
        {/* Dynamic Background with Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-red-950 transition-all duration-1000">
          {slides[currentSlide].image === "heart" && (
            <div className="absolute inset-0" style={{
              backgroundImage: `url(${withBasePath('/pilot-cockpit.jpg')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}></div>
          )}
          {slides[currentSlide].image === "water" && (
            <div className="absolute inset-0" style={{
              backgroundImage: `url(${withBasePath('/thumbs-002.jpg')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}></div>
          )}
          {slides[currentSlide].image === "oil" && (
            <div className="absolute inset-0" style={{
              backgroundImage: `url(${withBasePath('/thumbs-003.jpg')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}></div>
          )}
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>

        {/* Animated Glow Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-red-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 h-full flex items-center">
          <div className="flex items-center justify-between w-full gap-8 lg:gap-12">
            {/* Main Content - Left Side */}
            <div className="max-w-4xl mt-5 w-full py-20">
              {/* Content with Fade Animation */}
              <div key={currentSlide} className="space-y-8 md:space-y-12 animate-fadeIn">
                {/* Modern Badge */}
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs md:text-sm font-medium text-white tracking-wide">Industry Leading Since 1977</span>
                </div>

                {/* Hero Title - Maior destaque */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                  {slides[currentSlide].title}
                </h1>

                {/* Description - Refined */}
                <p className="text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-3xl font-light">
                  {slides[currentSlide].description}
                </p>

                {/* Modern CTA Buttons */}
                <div className="flex flex-wrap gap-3 md:gap-4 pt-4">
                  <button className="group px-6 md:px-8 py-3 md:py-4 bg-red-600 text-white text-sm md:text-base font-medium rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-500/50 hover:shadow-xl hover:shadow-red-500/60 hover:scale-105 transform flex items-center gap-2">
                    {t('hero.exploreServices')}
                    <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                  <button className="px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-sm text-white text-sm md:text-base font-medium rounded-full border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300">
                    {t('hero.watchVideo')}
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards - Grid 2 Colunas */}
            <div className="hidden lg:grid grid-cols-2 gap-4 min-w-[420px]">
              {[
                { Icon: Globe, titleKey: 'hero.offices', subtitleKey: 'hero.officesDesc' },
                { Icon: TestTube, titleKey: 'hero.samples', subtitleKey: 'hero.samplesDesc' },
                { Icon: Briefcase, titleKey: 'hero.experience', subtitleKey: 'hero.experienceDesc' },
                { Icon: Medal, titleKey: 'hero.accreditation', subtitleKey: 'hero.accreditationDesc' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="relative">
                    <stat.Icon className="w-10 h-10 text-red-500 mb-3" strokeWidth={1.5} />
                    <h4 className="text-sm font-bold text-white mb-1">{t(stat.titleKey)}</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">{t(stat.subtitleKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modern Vertical Navigation - Right Side */}
        <div className="absolute right-6 md:right-12 top-1/2 transform -translate-y-1/2 z-20 flex flex-col items-center gap-6">
          {/* Up Button */}
          <button 
            onClick={prevSlide}
            className="group bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 transform border border-white/20 hover:border-white/40"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          
          {/* Vertical Progress Indicators */}
          <div className="flex flex-col gap-3 py-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className="relative group"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div className={`w-1 rounded-full transition-all duration-500 ${
                  currentSlide === index 
                    ? 'bg-red-500 h-16' 
                    : 'bg-white/30 h-8 hover:bg-white/50 hover:h-12'
                }`}>
                  {currentSlide === index && (
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                {/* Slide Number */}
                <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                  currentSlide === index 
                    ? 'text-white opacity-100 translate-x-0' 
                    : 'text-white/50 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                }`}>
                  0{index + 1}
                </span>
              </button>
            ))}
          </div>

          {/* Down Button */}
          <button 
            onClick={nextSlide}
            className="group bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 transform border border-white/20 hover:border-white/40"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Scroll Indicator - Bottom Center */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 text-white/60 animate-bounce">
          <span className="text-xs uppercase tracking-wider font-medium">Scroll Down</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Section - Modern Two-Column Layout */}
      <section 
        ref={aboutSection.elementRef as React.RefObject<HTMLElement>}
        className={`relative bg-white py-24 md:py-32 overflow-hidden transition-all duration-700 ${
          aboutSection.isVisible ? 'opacity-100 animate-slideInUp' : 'opacity-0'
        }`}
      >
        {/* Geometric Pattern Background */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        {/* Subtle Gradient Orb */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-60"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            {/* Left Column - Visual Element */}
            <div className="relative">
              {/* Section Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-red-50 rounded-full border border-red-100 mb-8">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-600 tracking-wide">{t('about.badge')}</span>
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-tight tracking-tight mb-6">
                {t('about.title')}{' '}
                <span className="relative font-semibold text-red-600">
                  {t('about.titleBold')}
                </span>
              </h2>

              {/* Decorative Image/Visual */}
              <div className="relative mt-12 rounded-2xl overflow-hidden shadow-2xl shadow-gray-900/10">
                <img 
                  src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop" 
                  alt="Laboratory Analysis" 
                  className="w-full h-auto"
                />
                {/* Overlay Badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-600 p-3 rounded-full">
                      <FlaskConical className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">45+</p>
                      <p className="text-sm text-gray-600">{t('about.stat1')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Icons */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-full shadow-xl hidden lg:block">
                <Cog className="w-8 h-8 text-red-600 animate-spin-slow" />
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="space-y-8">
              {/* Paragraph 1 - Main Introduction */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <div className="w-1.5 h-12 bg-gradient-to-b from-red-600 to-red-400 rounded-full"></div>
                  </div>
                  <p className="text-lg md:text-lg text-gray-700 leading-relaxed">
                    {t('about.paragraph1')}
                  </p>
                </div>
              </div>

              {/* Paragraph 2 - Industries */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <Building2 className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="text-lg md:text-lg text-gray-700 leading-relaxed">
                    {t('about.paragraph2')}
                  </p>
                </div>
              </div>

              {/* Paragraph 3 - Services */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <Award className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="text-lg md:text-lg text-gray-700 leading-relaxed">
                    {t('about.paragraph3')}
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                <div>
                  <p className="text-3xl font-bold text-red-600">16</p>
                  <p className="text-sm text-gray-600 mt-1">{t('about.stat2')}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-red-600">845K+</p>
                  <p className="text-sm text-gray-600 mt-1">{t('about.stat3')}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-red-600">ISO</p>
                  <p className="text-sm text-gray-600 mt-1">{t('about.stat4')}</p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <button className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white text-base font-medium rounded-full hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform">
                  Learn More About Us
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Cards Section */}
      <section 
        ref={servicesSection.elementRef as React.RefObject<HTMLElement>}
        className={`relative bg-gradient-to-br from-gray-50 via-white to-gray-50 py-24 md:py-32 overflow-hidden transition-all duration-700 ${
          servicesSection.isVisible ? 'opacity-100 animate-slideInUp' : 'opacity-0'
        }`}
      >
        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gray-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-red-50 rounded-full border border-red-100 mb-6">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              <span className="text-sm font-medium text-red-600 tracking-wide">{t('services.badge')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
              {t('services.title')} <span className="font-semibold text-red-600">{t('services.titleBold')}</span>
            </h2>
          </div>

          {/* Service Cards - 3 Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Card 1 - Testing and Analysis */}
            <div 
              className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-900/5 hover:shadow-2xl hover:shadow-gray-900/10 transition-all duration-500 ${
                servicesSection.isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0'
              }`}
              style={{perspective: '1000px', animationDelay: '0.1s'}}
            >
              <div className="relative h-64 overflow-hidden">
                {/* Red Tint Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/30 group-hover:to-red-700/40 transition-all duration-500 z-10"></div>
                
                <img 
                  src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop" 
                  alt="Testing and Analysis" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Animated Icon */}
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg z-20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <FlaskConical className="w-6 h-6 text-red-600" />
                </div>
              </div>
              
              <div className="p-6 group-hover:bg-gray-50/50 transition-colors duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                  {t('services.service1Title')}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                  {t('services.service1Desc')}
                </p>
                
                {/* Expandable Arrow */}
                <button className="inline-flex items-center gap-2 text-red-600 font-medium text-sm group-hover:gap-4 transition-all duration-300">
                  {t('services.learnMore')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Card 2 - Asset Reliability Care */}
            <div 
              className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-900/5 hover:shadow-2xl hover:shadow-gray-900/10 transition-all duration-500 ${
                servicesSection.isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0'
              }`}
              style={{perspective: '1000px', animationDelay: '0.2s'}}
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/30 group-hover:to-red-700/40 transition-all duration-500 z-10"></div>
                
                <img 
                  src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop" 
                  alt="Asset Reliability" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg z-20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <Cog className="w-6 h-6 text-red-600" />
                </div>
              </div>
              
              <div className="p-6 group-hover:bg-gray-50/50 transition-colors duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                  {t('services.service2Title')}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                  {t('services.service2Desc')}
                </p>
                
                <button className="inline-flex items-center gap-2 text-red-600 font-medium text-sm group-hover:gap-4 transition-all duration-300">
                  {t('services.learnMore')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Card 3 - Lubricant-Enabled Reliability */}
            <div 
              className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-900/5 hover:shadow-2xl hover:shadow-gray-900/10 transition-all duration-500 ${
                servicesSection.isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0'
              }`}
              style={{perspective: '1000px', animationDelay: '0.3s'}}
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/30 group-hover:to-red-700/40 transition-all duration-500 z-10"></div>
                
                <img 
                  src="https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&h=600&fit=crop" 
                  alt="Lubricant Reliability" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg z-20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <Award className="w-6 h-6 text-red-600" />
                </div>
              </div>
              
              <div className="p-6 group-hover:bg-gray-50/50 transition-colors duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                  {t('services.service3Title')}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                  {t('services.service3Desc')}
                </p>
                
                <button className="inline-flex items-center gap-2 text-red-600 font-medium text-sm group-hover:gap-4 transition-all duration-300">
                  {t('services.learnMore')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CheckServ International Video - Modern Redesign */}
      <section 
        ref={videoSection.elementRef as React.RefObject<HTMLElement>}
        className={`relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 py-24 md:py-32 overflow-hidden transition-all duration-700 ${
          videoSection.isVisible ? 'opacity-100 animate-slideInLeft' : 'opacity-0'
        }`}
      >
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Gradient Accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start max-w-7xl mx-auto">
            {/* Left Column - Content */}
            <div className="lg:sticky lg:top-24 space-y-8">
              {/* Section Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-white tracking-wide">{t('video.badge')}</span>
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
                {t('video.title')} <span className="font-semibold text-red-500">{t('video.titleBold')}</span>
              </h2>

              {/* Description */}
              <div className="space-y-6">
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                  {t('video.description')}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white">{t('video.point1Title')}</p>
                      <p className="text-xs text-gray-400">{t('video.point1Desc')}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white">{t('video.point2Title')}</p>
                      <p className="text-xs text-gray-400">{t('video.point2Desc')}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FlaskConical className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white">{t('video.point3Title')}</p>
                      <p className="text-xs text-gray-400">{t('video.point3Desc')}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Medal className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white">{t('video.point4Title')}</p>
                      <p className="text-xs text-gray-400">{t('video.point4Desc')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              {/* <div className="pt-4">
                <button className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 text-base font-medium rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform">
                  Learn More
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div> */}
            </div>

            {/* Right Column - Video (Sticky on scroll) */}
            <div className="lg:sticky lg:top-24">
              <div className="relative group">
                {/* White Frame */}
                <div className="absolute -inset-4 bg-white rounded-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                
                {/* Video Container */}
                <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border-4 border-white/20">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    {/* Loading indicator */}
                    <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center z-10" id="video-loading">
                      <div className="text-white mb-4">
                        <svg className="animate-spin h-12 w-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-sm">Loading video...</p>
                      </div>
                    </div>
                    
                    {/* YouTube iframe */}
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src="https://www.youtube.com/embed/nx5yYjgqf3Q?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0"
                      title="CheckServ International"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={() => {
                        const loading = document.getElementById('video-loading');
                        if (loading) loading.style.display = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Play Badge Indicator */}
                <div className="absolute -bottom-4 -right-4 bg-red-600 text-white px-6 py-3 rounded-full shadow-xl border-4 border-slate-900">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold">Watch Now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
   {/*    <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <img 
              src="https://images.unsplash.com/photo-1581092160607-ee67ecaa06ee?w=400&h=300&fit=crop" 
              alt="Laboratory" 
              className="rounded-lg w-full h-64 object-cover shadow-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop" 
              alt="Equipment" 
              className="rounded-lg w-full h-64 object-cover shadow-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop" 
              alt="Industry" 
              className="rounded-lg w-full h-64 object-cover shadow-lg"
            />
          </div>
        </div>
      </section> */}

      {/* We Build Partnerships - Removed, now integrated in CheckServ International section */}

      {/* 360° View Section - Modern Redesign */}
      <section 
        ref={tourSection.elementRef as React.RefObject<HTMLElement>}
        className={`relative bg-white py-24 md:py-32 overflow-hidden transition-all duration-700 ${
          tourSection.isVisible ? 'opacity-100 animate-scaleIn' : 'opacity-0'
        }`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        {/* Gradient Accent */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-40"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-red-50 rounded-full border border-red-100 mb-6">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-600 tracking-wide">{t('tour360.badge')}</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                {t('tour360.title')} <span className="font-semibold text-red-600">{t('tour360.titleBold')}</span>
              </h2>
              
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {t('tour360.description')}
              </p>
            </div>

            {/* Main 360 Viewer Container */}
            <div className="relative">
              {/* Decorative Frame */}
              <div className="absolute -inset-4 bg-gradient-to-br from-red-100 to-gray-100 rounded-3xl opacity-30 blur-xl"></div>
              
              {/* 360 Viewer */}
              <div className="relative bg-white rounded-2xl shadow-2xl shadow-gray-900/10 overflow-hidden border-4 border-white">
                <div className="relative">
                  {/* Interactive Hint Badge */}
                  <div className="absolute top-6 left-6 z-20 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    {t('tour360.badge1')}
                  </div>

                  {/* Auto-rotate Indicator */}
                  <div className="absolute top-6 right-6 z-20 bg-red-600 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    {t('tour360.badge3')}
                  </div>

                  <PannellumViewer
                    imageUrl="https://pannellum.org/images/alma.jpg"
                    autoRotate={true}
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Corner Accent Elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-red-600/20 rounded-full blur-2xl"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-gray-900/10 rounded-full blur-2xl"></div>
            </div>

            {/* Laboratory Info & CTA Cards */}
            <div className="grid md:grid-cols-2 gap-8 mt-16">
              {/* Laboratory Details Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-red-50 p-3 rounded-xl">
                    <Building2 className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">Laboratory: Head Office</h3>
                    <p className="text-gray-600">South Africa</p>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  A high degree of automation in our laboratories ensure reliability of results and has virtually eliminated time-consuming paper work.
                </p>

                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2.5 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                    <span>ISO 17025 Accredited</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                    <span>State-of-the-art Equipment</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                    <span>Automated Testing Systems</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                    <span>24/7 Monitoring</span>
                  </li>
                </ul>
              </div>

              {/* Explore More Locations CTA */}
              <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-8 text-white flex flex-col justify-between shadow-xl">
                <div>
                  <h3 className="text-3xl font-bold mb-4">Explore More Locations</h3>
                  <p className="text-red-50 text-lg leading-relaxed mb-8">
                    Take virtual tours of our 16 laboratories around the globe and see our advanced testing capabilities firsthand.
                  </p>
                </div>

                <a 
                  href="#"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-red-600 rounded-full font-bold text-lg hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
                >
                  View All 360° Tours
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section - Where to Find Us - Modern Redesign */}
      <section 
        ref={eventsSection.elementRef as React.RefObject<HTMLElement>}
        className={`relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 py-24 md:py-32 overflow-hidden transition-all duration-700 ${
          eventsSection.isVisible ? 'opacity-100 animate-slideInRight' : 'opacity-0'
        }`}
      >
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Gradient Accents */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-white tracking-wide">{t('events.badge')}</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
              {t('events.title')} <span className="font-semibold text-red-500">{t('events.titleBold')}</span>
            </h2>

            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Meet the CheckServ team at major industry events across Africa
            </p>
          </div>

          {/* Events Grid - Modern Timeline Style */}
          <div className="max-w-6xl mx-auto">
            {/* Featured Events - Side by Side */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Event 1 - Mining Indaba */}
              <div 
                className={`group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 hover:border-red-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-red-900/30 ${
                  eventsSection.isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0'
                }`}
                style={{animationDelay: '0.1s'}}
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop" 
                    alt="Mining Indaba" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Date Badge */}
                  <div className="absolute top-4 right-4 bg-red-600 rounded-2xl px-4 py-3 shadow-2xl z-20 text-center">
                    <p className="text-2xl font-bold text-white leading-none">9-12</p>
                    <p className="text-xs font-semibold text-red-100 mt-1">FEB 2026</p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-red-600/20 text-red-400 text-xs font-bold rounded-full uppercase tracking-wider">Mining</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                    {t('events.event1Title')}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{t('events.event1Location')}</span>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    Africa's largest mining investment conference connecting stakeholders across the mining value chain.
                  </p>

                  <a 
                    href="#"
                    className="inline-flex items-center gap-2 text-red-500 font-semibold text-sm hover:gap-3 transition-all"
                  >
                    {t('events.readMore')}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Event 2 - Enlit */}
              <div 
                className={`group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 hover:border-red-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-red-900/30 ${
                  eventsSection.isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0'
                }`}
                style={{animationDelay: '0.2s'}}
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop" 
                    alt="Enlit Energy" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Date Badge */}
                  <div className="absolute top-4 right-4 bg-red-600 rounded-2xl px-4 py-3 shadow-2xl z-20 text-center">
                    <p className="text-2xl font-bold text-white leading-none">19-21</p>
                    <p className="text-xs font-semibold text-red-100 mt-1">MAY 2026</p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-red-600/20 text-red-400 text-xs font-bold rounded-full uppercase tracking-wider">Energy</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                    {t('events.event2Title')}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{t('events.event2Location')}</span>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    Europe's premier energy transition event bringing together power, utilities, and renewables sectors.
                  </p>

                  <a 
                    href="#"
                    className="inline-flex items-center gap-2 text-red-500 font-semibold text-sm hover:gap-3 transition-all"
                  >
                    {t('events.readMore')}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* View All Events CTA */}
            <div className="text-center">
              <a 
                href="#"
                className="group inline-flex items-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-full font-bold text-lg hover:bg-red-600 hover:border-red-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-red-900/30 hover:scale-105 transform"
              >
                View All Events
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* News & Insights - Minimalist Redesign */}
      <section 
        ref={blogSection.elementRef as React.RefObject<HTMLElement>}
        className={`relative bg-gradient-to-br from-gray-50 via-white to-gray-50 py-24 md:py-32 overflow-hidden transition-all duration-700 ${
          blogSection.isVisible ? 'opacity-100 animate-slideInUp' : 'opacity-0'
        }`}
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        {/* Gradient Accent */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-40"></div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-red-50 rounded-full border border-red-100 mb-6">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-600 tracking-wide">{t('blog.badge')}</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
              {t('blog.title')} <span className="font-semibold text-red-600">{t('blog.titleBold')}</span>
            </h2>
          </div>

          {/* Blog Grid - Clean & Simple */}
          <div className="max-w-6xl mx-auto">
            {/* Featured Post */}
            <div 
              className={`group mb-12 ${
                blogSection.isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0'
              }`}
              style={{animationDelay: '0.1s'}}
            >
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-900/5 hover:shadow-2xl hover:shadow-gray-900/10 transition-all duration-500">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative h-80 md:h-auto overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=800&h=600&fit=crop" 
                      alt="When Good Oils Go Bad" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6 bg-red-600 px-4 py-2 rounded-full">
                      <span className="text-xs font-semibold text-white uppercase tracking-wider">{t('blog.featuredBadge')}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <span className="text-xs text-gray-500 uppercase tracking-wider mb-4">{t('blog.post1Date')}</span>
                    
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                      {t('blog.post1Title')}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {t('blog.post1Excerpt')}
                    </p>

                    <button className="inline-flex items-center gap-2 text-red-600 font-semibold group-hover:gap-3 transition-all">
                      {t('blog.readMore')}
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Posts - 3 Column Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Post 1 */}
              <div 
                className={`group ${
                  blogSection.isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0'
                }`}
                style={{animationDelay: '0.2s'}}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-900/5 hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-500 h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1504672281656-e4981d70414b?w=600&h=400&fit=crop" 
                      alt="Mining Indaba 2026" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">January 26, 2026</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-3 mb-3 group-hover:text-red-600 transition-colors">
                      Mining Indaba 2026
                    </h3>
                    <button className="inline-flex items-center gap-2 text-red-600 font-medium text-sm group-hover:gap-3 transition-all">
                      Read More
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Post 2 */}
              <div 
                className={`group ${
                  blogSection.isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0'
                }`}
                style={{animationDelay: '0.3s'}}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-900/5 hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-500 h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop" 
                      alt="The Monitor Newsletter" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">December 09, 2025</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-3 mb-3 group-hover:text-red-600 transition-colors">
                      Monitor Newsletter
                    </h3>
                    <button className="inline-flex items-center gap-2 text-red-600 font-medium text-sm group-hover:gap-3 transition-all">
                      Read More
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Post 3 */}
              <div 
                className={`group ${
                  blogSection.isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0'
                }`}
                style={{animationDelay: '0.4s'}}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-900/5 hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-500 h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop" 
                      alt="AI in Maintenance" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">November 15, 2025</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-3 mb-3 group-hover:text-red-600 transition-colors">
                      AI & Predictive Maintenance
                    </h3>
                    <button className="inline-flex items-center gap-2 text-red-600 font-medium text-sm group-hover:gap-3 transition-all">
                      Read More
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* View All CTA */}
            <div className="text-center mt-16">
              <button className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform">
                View All Articles
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-4 bg-red-600 text-white rounded-full shadow-2xl hover:bg-red-700 transition-all duration-300 hover:scale-110 transform ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  )
}
