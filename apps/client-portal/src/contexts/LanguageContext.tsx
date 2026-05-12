import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'pt'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language')
    return (saved === 'pt' || saved === 'en') ? saved : 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

const translations = {
  en: {
    header: {
      phone: '+27 31 700 5460',
      email: 'marketing@wearcheck.co.za',
      home: 'HOME',
      about: 'ABOUT',
      aboutCompany: 'Our Company',
      aboutPeople: 'Our People',
      accreditations: 'Accreditations',
      services: 'SERVICES',
      servicesAnalysis: 'Testing & Analysis',
      servicesReliability: 'Asset Reliability Care',
      servicesLubricant: 'Lubricant Enabled Reliability',
      online: 'ONLINE',
      onlinePortal: 'Client Portal',
      onlineSubmit: 'Submit Samples',
      onlineTrack: 'Track Results',
      training: 'TRAINING',
      trainingCourses: 'Courses',
      trainingSchedule: 'Schedule',
      trainingRegister: 'Register',
      press: 'PRESS',
      info: 'INFO',
      infoResources: 'Resources',
      infoDownloads: 'Downloads',
      infoFaqs: 'FAQs',
      blog: 'BLOG',
      contacts: 'CONTACTS',
      contactsUs: 'Contact Us',
      contactsLocations: 'Locations',
      contactsSupport: 'Support'
    },
    hero: {
      slide1Title: 'Condition Monitoring is at the core of aircraft reliability',
      slide1Desc: 'Our specialist aviation oil and filter testing programme allow customers to reduce maintenance costs, avoid unexpected mechanical failures and ultimately reduce unscheduled downtime.',
      slide2Title: 'Equipment Reliability is at the Heart of the Harvest',
      slide2Desc: 'We analyse data from condition monitoring as well as oil, fuel and other fluid analysis to schedule maintenance and avoid a loss in production due to unexpected machine failure.',
      slide3Title: 'Clean water is pivotal to industrial health',
      slide3Desc: 'CheckServ has an ISO17025 accredited Testing laboratory specialising in water analysis. We analyse samples taken from water sources - drinking, irrigation, ground, effluent etc.',
      exploreServices: 'Explore Services',
      watchVideo: 'Watch Video',
      offices: 'Offices',
      officesDesc: '16 labs and offices worldwide',
      samples: 'Samples',
      samplesDesc: 'Processes 845 000+ samples per year',
      experience: 'Experience',
      experienceDesc: 'Over 45 years servicing industry',
      accreditation: 'Accreditation',
      accreditationDesc: 'ISO 9001, ISO 14001, ISO 17025'
    },
    about: {
      badge: 'About CheckServ',
      title: 'Leading Condition Monitoring',
      titleBold: 'Specialists',
      paragraph1: 'CheckServ is a leading provider of condition monitoring services, offering predictive maintenance solutions to industries worldwide. With over 45 years of experience, we help organizations maximize equipment reliability and minimize downtime through comprehensive oil analysis, vibration monitoring, and other diagnostic services.',
      paragraph2: 'Our state-of-the-art laboratories are equipped with the latest technology and staffed by highly trained technicians and engineers. We are ISO 9001, ISO 14001, and ISO 17025 accredited, ensuring the highest standards of quality and accuracy in every analysis we perform.',
      paragraph3: 'Operating from 16 locations globally, CheckServ processes more than 845,000 samples annually, serving industries including mining, manufacturing, power generation, marine, aviation, and agriculture. Our commitment to excellence and innovation has made us the trusted partner for businesses seeking to optimize their asset management strategies.',
      stat1: 'Years of Excellence',
      stat2: 'Global Locations',
      stat3: 'Annual Samples',
      stat4: 'ISO Accreditations'
    },
    services: {
      badge: 'Our Services',
      title: 'Comprehensive',
      titleBold: 'Solutions',
      service1Title: 'Testing and Analysis',
      service1Desc: 'Comprehensive analysis of lubricants, fuels, coolants and other fluids to detect potential issues before they become failures.',
      service2Title: 'Asset Reliability Care (ARC)',
      service2Desc: 'Holistic approach to asset management, combining condition monitoring data with expert analysis to maximize equipment lifespan.',
      service3Title: 'Lubricant Enabled Reliability (LER)',
      service3Desc: 'Expert guidance on lubricant selection, storage, and handling to optimize performance and reduce total cost of ownership.',
      learnMore: 'Learn More'
    },
    video: {
      badge: 'CheckServ International',
      title: 'Global Network of',
      titleBold: 'Excellence',
      description: 'With 16 laboratories and offices strategically located across the globe, CheckServ delivers world-class condition monitoring services to industries worldwide. Our international network ensures rapid sample turnaround times and expert local support, backed by decades of experience and ISO accreditations.',
      point1Title: 'Global Coverage',
      point1Desc: '16 laboratories worldwide',
      point2Title: 'Expert Analysis',
      point2Desc: 'Certified technicians',
      point3Title: 'Fast Turnaround',
      point3Desc: '24-48 hour reporting',
      point4Title: 'ISO Certified',
      point4Desc: 'Quality assured'
    },
    tour360: {
      badge: 'Virtual Tour',
      title: 'Experience Our',
      titleBold: 'Laboratory',
      description: 'Take a 360° virtual tour of our state-of-the-art facilities and discover the advanced technology and processes that make CheckServ a leader in condition monitoring.',
      badge1: 'ISO Certified',
      badge2: 'Advanced Equipment',
      badge3: '24/7 Operations',
      info1Title: 'Modern Facilities',
      info1Desc: 'State-of-the-art laboratory equipment and technology',
      info2Title: 'Expert Team',
      info2Desc: 'Highly trained technicians and engineers',
      info3Title: 'Quality Assurance',
      info3Desc: 'ISO 9001, 14001, and 17025 accredited processes'
    },
    events: {
      badge: 'Events in Africa',
      title: 'Latest',
      titleBold: 'Events & News',
      event1Title: 'CheckServ attends Africa Mining Indaba 2024',
      event1Date: 'February 5-8, 2024',
      event1Location: 'Cape Town, South Africa',
      event2Title: 'Condition Monitoring Workshop Series',
      event2Date: 'March 15, 2024',
      event2Location: 'Johannesburg, SA',
      event3Title: 'Mining Equipment Reliability Summit',
      event3Date: 'April 22-23, 2024',
      event3Location: 'Durban, South Africa',
      event4Title: 'Oil Analysis Training Course',
      event4Date: 'May 10-12, 2024',
      event4Location: 'Multiple Locations',
      readMore: 'Read More'
    },
    blog: {
      badge: 'News & Insights',
      title: 'Latest',
      titleBold: 'Blog Posts',
      featuredBadge: 'Featured Article',
      post1Title: 'The Importance of Regular Oil Analysis in Mining Operations',
      post1Excerpt: 'Discover how consistent oil analysis can prevent costly equipment failures and extend machinery life in mining applications.',
      post1Date: 'January 28, 2024',
      post2Title: 'Understanding Vibration Monitoring',
      post2Excerpt: 'Learn the fundamentals of vibration analysis and its role in predictive maintenance.',
      post2Date: 'January 15, 2024',
      post3Title: 'Water Quality Testing for Industrial Applications',
      post3Excerpt: 'Essential guidelines for maintaining water quality in industrial cooling systems.',
      post3Date: 'January 8, 2024',
      readMore: 'Read More',
      viewAll: 'View All Articles'
    }
  },
  pt: {
    header: {
      phone: '+27 31 700 5460',
      email: 'marketing@wearcheck.co.za',
      home: 'INÍCIO',
      about: 'SOBRE',
      aboutCompany: 'Nossa Empresa',
      aboutPeople: 'Nossa Equipe',
      accreditations: 'Acreditações',
      services: 'SERVIÇOS',
      servicesAnalysis: 'Testes e Análises',
      servicesReliability: 'Cuidados com Confiabilidade de Ativos',
      servicesLubricant: 'Confiabilidade Habilitada por Lubrificantes',
      online: 'ONLINE',
      onlinePortal: 'Portal do Cliente',
      onlineSubmit: 'Enviar Amostras',
      onlineTrack: 'Rastrear Resultados',
      training: 'TREINAMENTO',
      trainingCourses: 'Cursos',
      trainingSchedule: 'Agenda',
      trainingRegister: 'Registrar',
      press: 'IMPRENSA',
      info: 'INFO',
      infoResources: 'Recursos',
      infoDownloads: 'Downloads',
      infoFaqs: 'Perguntas Frequentes',
      blog: 'BLOG',
      contacts: 'CONTATOS',
      contactsUs: 'Contacte-nos',
      contactsLocations: 'Localizações',
      contactsSupport: 'Suporte'
    },
    hero: {
      slide1Title: 'Monitoramento de Condições está no centro da confiabilidade de aeronaves',
      slide1Desc: 'Nosso programa especializado de testes de óleo e filtros de aviação permite que os clientes reduzam custos de manutenção, evitem falhas mecânicas inesperadas e, em última análise, reduzam o tempo de inatividade não programado.',
      slide2Title: 'Confiabilidade do Equipamento está no Coração da Colheita',
      slide2Desc: 'Analisamos dados de monitoramento de condições, bem como análise de óleo, combustível e outros fluidos para agendar manutenção e evitar perda de produção devido a falhas inesperadas de máquinas.',
      slide3Title: 'Água limpa é fundamental para a saúde industrial',
      slide3Desc: 'A CheckServ possui um laboratório de testes credenciado ISO17025 especializado em análise de água. Analisamos amostras retiradas de fontes de água - potável, irrigação, subterrânea, efluentes etc.',
      exploreServices: 'Explorar Serviços',
      watchVideo: 'Assistir Vídeo',
      offices: 'Escritórios',
      officesDesc: '16 laboratórios e escritórios em todo o mundo',
      samples: 'Amostras',
      samplesDesc: 'Processa 845 000+ amostras por ano',
      experience: 'Experiência',
      experienceDesc: 'Mais de 45 anos atendendo a indústria',
      accreditation: 'Acreditação',
      accreditationDesc: 'ISO 9001, ISO 14001, ISO 17025'
    },
    about: {
      badge: 'Sobre a CheckServ',
      title: 'Especialistas Líderes em',
      titleBold: 'Monitoramento de Condições',
      paragraph1: 'A CheckServ é uma provedora líder de serviços de monitoramento de condições, oferecendo soluções de manutenção preditiva para indústrias em todo o mundo. Com mais de 45 anos de experiência, ajudamos organizações a maximizar a confiabilidade dos equipamentos e minimizar o tempo de inatividade por meio de análise abrangente de óleo, monitoramento de vibração e outros serviços de diagnóstico.',
      paragraph2: 'Nossos laboratórios de última geração estão equipados com a mais recente tecnologia e são operados por técnicos e engenheiros altamente treinados. Somos credenciados ISO 9001, ISO 14001 e ISO 17025, garantindo os mais altos padrões de qualidade e precisão em cada análise que realizamos.',
      paragraph3: 'Operando em 16 locais globalmente, a CheckServ processa mais de 845.000 amostras anualmente, atendendo indústrias incluindo mineração, manufatura, geração de energia, marítima, aviação e agricultura. Nosso compromisso com a excelência e inovação nos tornou o parceiro confiável para empresas que buscam otimizar suas estratégias de gerenciamento de ativos.',
      stat1: 'Anos de Excelência',
      stat2: 'Localizações Globais',
      stat3: 'Amostras Anuais',
      stat4: 'Acreditações ISO'
    },
    services: {
      badge: 'Nossos Serviços',
      title: 'Soluções',
      titleBold: 'Abrangentes',
      service1Title: 'Testes e Análises',
      service1Desc: 'Análise abrangente de lubrificantes, combustíveis, refrigerantes e outros fluidos para detectar problemas potenciais antes que se tornem falhas.',
      service2Title: 'Cuidados com Confiabilidade de Ativos (ARC)',
      service2Desc: 'Abordagem holística para gestão de ativos, combinando dados de monitoramento de condições com análise especializada para maximizar a vida útil dos equipamentos.',
      service3Title: 'Confiabilidade Habilitada por Lubrificantes (LER)',
      service3Desc: 'Orientação especializada sobre seleção, armazenamento e manuseio de lubrificantes para otimizar o desempenho e reduzir o custo total de propriedade.',
      learnMore: 'Saiba Mais'
    },
    video: {
      badge: 'CheckServ Internacional',
      title: 'Rede Global de',
      titleBold: 'Excelência',
      description: 'Com 16 laboratórios e escritórios estrategicamente localizados em todo o mundo, a CheckServ oferece serviços de monitoramento de condições de classe mundial para indústrias em todo o mundo. Nossa rede internacional garante tempos de resposta rápidos de amostras e suporte local especializado, apoiado por décadas de experiência e acreditações ISO.',
      point1Title: 'Cobertura Global',
      point1Desc: '16 laboratórios mundialmente',
      point2Title: 'Análise Especializada',
      point2Desc: 'Técnicos certificados',
      point3Title: 'Resposta Rápida',
      point3Desc: 'Relatórios em 24-48h',
      point4Title: 'Certificado ISO',
      point4Desc: 'Qualidade assegurada'
    },
    tour360: {
      badge: 'Tour Virtual',
      title: 'Conheça Nosso',
      titleBold: 'Laboratório',
      description: 'Faça um tour virtual de 360° das nossas instalações de ponta e descubra a tecnologia avançada e os processos que fazem da CheckServ líder em monitoramento de condições.',
      badge1: 'Certificado ISO',
      badge2: 'Equipamento Avançado',
      badge3: 'Operações 24/7',
      info1Title: 'Instalações Modernas',
      info1Desc: 'Equipamentos e tecnologia laboratorial de ponta',
      info2Title: 'Equipe Especializada',
      info2Desc: 'Técnicos e engenheiros altamente treinados',
      info3Title: 'Garantia de Qualidade',
      info3Desc: 'Processos acreditados ISO 9001, 14001 e 17025'
    },
    events: {
      badge: 'Eventos em África',
      title: 'Últimos',
      titleBold: 'Eventos e Notícias',
      event1Title: 'CheckServ participa do Africa Mining Indaba 2024',
      event1Date: '5-8 de Fevereiro, 2024',
      event1Location: 'Cidade do Cabo, África do Sul',
      event2Title: 'Série de Workshops de Monitoramento de Condições',
      event2Date: '15 de Março, 2024',
      event2Location: 'Joanesburgo, AS',
      event3Title: 'Cúpula de Confiabilidade de Equipamentos de Mineração',
      event3Date: '22-23 de Abril, 2024',
      event3Location: 'Durban, África do Sul',
      event4Title: 'Curso de Treinamento em Análise de Óleo',
      event4Date: '10-12 de Maio, 2024',
      event4Location: 'Múltiplas Localizações',
      readMore: 'Ler Mais'
    },
    blog: {
      badge: 'Notícias e Insights',
      title: 'Últimas',
      titleBold: 'Publicações do Blog',
      featuredBadge: 'Artigo em Destaque',
      post1Title: 'A Importância da Análise Regular de Óleo em Operações de Mineração',
      post1Excerpt: 'Descubra como a análise consistente de óleo pode prevenir falhas de equipamentos dispendiosas e estender a vida útil de máquinas em aplicações de mineração.',
      post1Date: '28 de Janeiro, 2024',
      post2Title: 'Entendendo o Monitoramento de Vibração',
      post2Excerpt: 'Aprenda os fundamentos da análise de vibração e seu papel na manutenção preditiva.',
      post2Date: '15 de Janeiro, 2024',
      post3Title: 'Testes de Qualidade da Água para Aplicações Industriais',
      post3Excerpt: 'Diretrizes essenciais para manter a qualidade da água em sistemas de resfriamento industrial.',
      post3Date: '8 de Janeiro, 2024',
      readMore: 'Ler Mais',
      viewAll: 'Ver Todos os Artigos'
    }
  }
}
