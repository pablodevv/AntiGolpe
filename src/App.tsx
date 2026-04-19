import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, Search, Share2, CheckCircle, AlertTriangle, XCircle,
  Loader2, Award, Users, Clock, TrendingUp, Star, Lock, Zap,
  ChevronDown, Crown, Gift, ExternalLink, ShoppingCart,
  FileText, Globe, ArrowRight, Sparkles, Eye, Bell, Check,
  Twitter, Instagram, Linkedin, MessageCircle, Mail, Phone,
  Code, Cpu, Target, BarChart3, ShieldCheck, BadgeCheck,
  Flame, Rocket, Infinity, RefreshCw, ChevronRight, X
} from 'lucide-react';

interface VerificationResult {
  status: 'safe' | 'suspicious' | 'danger';
  title: string;
  message: string;
  complaints: number;
  trustScore: number;
  verificationTime: string;
  debug?: any;
  ssl?: any;
  whois?: any;
  reclameAqui?: any;
  googleResults?: any[];
  social?: any;
  trustPilot?: any;
}

// ─── TRANSLATIONS ────────────────────────────────────────────────
const translations: Record<string, Record<string, string>> = {
  pt: {
    // Brand
    title: "Fraudara",
    subtitle: "Verificador Global de Fraudes #1",
    tagline: "Proteja-se contra golpes em segundos",
    secure: "100% Seguro",
    instantVerification: "Verificação Instantânea",
    consultationsLeft: "consultas gratuitas restantes",
    freeBadge: "GRÁTIS",

    // Announcement bar
    specialOffer: "🔥 OFERTA LIMITADA",
    premiumProtection: "Acesso Premium por apenas R$12/mês — economize R$5/mês",
    guaranteeNow: "GARANTIR AGORA",

    // Stats
    sitesVerified: "Sites Verificados",
    usersProtected: "Usuários Protegidos",
    accuracy: "Precisão da IA",
    fraudsPrevented: "Golpes Evitados",

    // Hero
    heroTitle: "Antes de Comprar, Verifique.",
    heroTitleAccent: "Instantaneamente.",
    heroSubtitle: "Nossa IA analisa mais de 50 fontes de dados em segundos — SSL, WHOIS, Reclame Aqui, TrustPilot, Google e redes sociais — para te dizer se um site é seguro ou não.",
    placeholder: "Digite o URL ou nome da marca (ex: loja-oferta.com)",
    verifyButton: "Verificar Agora — É Grátis",
    verifying: "Analisando com IA...",
    verifiedBy: "Verificado por mais de 3,1M de usuários",

    // Loading
    analysisInProgress: "Análise em Andamento",
    checkingDomain: "Verificando domínio e certificados SSL...",
    consultingComplaints: "Consultando base de reclamações global...",
    analyzingReputation: "Analisando reputação online com IA...",
    crossChecking: "Cruzando dados de 50+ fontes...",

    // Result
    trustIndex: "Índice de Confiança",
    analysisTime: "Tempo de Análise",
    complaintsFound: "reclamações nos últimos 30 dias",
    completeReport: "Ver Relatório Completo",
    shareWhatsApp: "Compartilhar no WhatsApp",
    newVerification: "Nova Verificação",

    // Details
    sslCertificate: "Certificado SSL/TLS",
    domainInfo: "Informações do Domínio (WHOIS)",
    reclameAqui: "Reclame Aqui",
    socialNetworks: "Presença em Redes Sociais",
    trustPilot: "TrustPilot",
    googleResults: "Top 10 Resultados Google",
    present: "Presente:", valid: "Válido:", validFrom: "Válido de:",
    validTo: "Válido até:", issuer: "Emissor:", yes: "Sim", no: "Não",

    // Paywall
    unlockReport: "🔓 Desbloquear Relatório Completo",
    unlockReportDesc: "Acesse todos os detalhes da análise de segurança",
    whatYouGet: "O que você vai ver:",
    detailedSSL: "Certificado SSL detalhado",
    completeWHOIS: "WHOIS completo com datas",
    reclameAquiHistory: "Histórico completo Reclame Aqui",
    socialAnalysis: "Análise de redes sociais",
    trustPilotReviews: "Avaliações TrustPilot",
    googleTop10: "Top 10 resultados Google",
    unlockOneTime: "Desbloquear por R$ 29,90 (único)",
    orSubscribe: "Ou assinar por R$ 12/mês",
    maybeLater: "Agora não",

    // Pricing
    pricingTitle: "Proteção Completa para Cada Necessidade",
    pricingSubtitle: "Milhões de pessoas escolhem o Fraudara para se proteger online. Qual é o seu plano?",
    mostPopular: "MAIS POPULAR",
    bestValue: "MELHOR CUSTO",
    planFree: "Gratuito",
    planStarter: "Starter",
    planPro: "Pro",
    planBusiness: "Business",
    freePeriod: "para sempre",
    monthly: "/mês",
    yearly: "/ano",
    continueFreePlan: "Continuar grátis",
    upgradePlan: "Começar agora",
    guarantee: "Garantia de 30 dias ou seu dinheiro de volta",

    // Features
    featureUnlimited: "Verificações ilimitadas",
    featureReports: "Relatórios completos",
    featureMonitoring: "Monitoramento 24/7",
    featureAlerts: "Alertas em tempo real",
    featurePriority: "Suporte prioritário",
    featureAPI: "Acesso à API",
    featureWhatsapp: "Alertas WhatsApp",
    featureCustom: "Análises personalizadas",

    // Exhausted
    consultationsExhausted: "Consultas Gratuitas Esgotadas",
    consultationsExhaustedDesc: "Você usou todas as suas 5 consultas gratuitas. Continue protegido com acesso ilimitado:",
    unlimitedAccess: "Acesso Ilimitado — R$ 29,90",
    premiumMonthly: "Premium — R$ 12/mês",
    back: "Voltar",

    // Footer
    footerTagline: "Protegendo milhões de pessoas contra fraudes online.",
    footerProduct: "Produto",
    footerCompany: "Empresa",
    footerSupport: "Suporte",
    footerLegal: "Legal",
    footerHowItWorks: "Como funciona",
    footerPricing: "Preços",
    footerAPI: "API para empresas",
    footerAbout: "Sobre nós",
    footerCreator: "Sobre o criador",
    footerBlog: "Blog",
    footerHelp: "Central de ajuda",
    footerContact: "Contato",
    footerReport: "Reportar fraude",
    footerPrivacy: "Privacidade",
    footerTerms: "Termos de uso",
    footerCookies: "Cookies",
    footerCopyright: "© 2026 Fraudara. Todos os direitos reservados.",
    footerDisclaimer: "Ferramenta educativa para conscientização sobre segurança digital.",
    footerEmail: "contato@fraudara.com",
    footerMadeWith: "Feito com 🛡️ para proteger o mundo",

    // Creator
    creatorTitle: "Sobre o Criador",
    creatorName: "Pablo Eduardo",
    creatorBio: "Empresário, empreendedor digital e desenvolvedor de apps, jogos e sistemas há mais de 11 anos. Especialista em marketing digital, inteligência artificial, copywriting e viralização online. Criador de múltiplos negócios digitais de sucesso e projetos virais ao redor do mundo.",
    creatorRole: "Fundador & CEO do Fraudara",

    // Safe alternative
    safeAlternative: "✅ Alternativa 100% Segura",
    amazonDesc: "Maior e-commerce do mundo com garantia total",
    upTo70Off: "Até 70% OFF",

    // Trust badges
    totalSecurity: "Segurança Total",
    totalSecurityDesc: "Criptografia de nível bancário",
    freeVerification: "Verificação Gratuita",
    freeVerificationDesc: "5 consultas sem cadastro",
    alwaysUpdated: "Sempre Atualizado",
    alwaysUpdatedDesc: "Base de dados em tempo real 24/7",

    // How it works
    howItWorks: "Como Funciona",
    stepStep: "PASSO",
    step1Title: "Digite o site ou marca",
    step1Desc: "Cole o URL ou digite o nome da empresa que quer verificar",
    step2Title: "Nossa IA analisa tudo",
    step2Desc: "Verificamos 50+ fontes de dados em segundos com inteligência artificial",
    step3Title: "Resultado instantâneo",
    step3Desc: "Receba um relatório completo com índice de confiança e recomendações",

    // Social proof
    testimonials: "O que dizem nossos usuários",
  },

  en: {
    title: "Fraudara",
    subtitle: "The #1 Global Fraud Checker",
    tagline: "Protect yourself from scams in seconds",
    secure: "100% Secure",
    instantVerification: "Instant Verification",
    consultationsLeft: "free checks remaining",
    freeBadge: "FREE",
    specialOffer: "🔥 LIMITED OFFER",
    premiumProtection: "Premium access for only $12/mo — save $5/mo",
    guaranteeNow: "GET NOW",
    sitesVerified: "Sites Verified",
    usersProtected: "Users Protected",
    accuracy: "AI Accuracy",
    fraudsPrevented: "Frauds Prevented",
    heroTitle: "Before You Buy, Verify.",
    heroTitleAccent: "Instantly.",
    heroSubtitle: "Our AI analyzes 50+ data sources in seconds — SSL, WHOIS, consumer reports, TrustPilot, Google and social media — to tell you if a site is safe or not.",
    placeholder: "Enter website URL or brand name (e.g. promo-store.com)",
    verifyButton: "Verify Now — It's Free",
    verifying: "AI Analyzing...",
    verifiedBy: "Trusted by 3.1M+ users worldwide",
    analysisInProgress: "Analysis in Progress",
    checkingDomain: "Checking domain and SSL certificates...",
    consultingComplaints: "Consulting global complaints database...",
    analyzingReputation: "AI analyzing online reputation...",
    crossChecking: "Cross-referencing 50+ data sources...",
    trustIndex: "Trust Index",
    analysisTime: "Analysis Time",
    complaintsFound: "complaints in the last 30 days",
    completeReport: "View Complete Report",
    shareWhatsApp: "Share on WhatsApp",
    newVerification: "New Verification",
    sslCertificate: "SSL/TLS Certificate",
    domainInfo: "Domain Info (WHOIS)",
    reclameAqui: "Consumer Reports",
    socialNetworks: "Social Media Presence",
    trustPilot: "TrustPilot",
    googleResults: "Top 10 Google Results",
    present: "Present:", valid: "Valid:", validFrom: "Valid from:",
    validTo: "Valid until:", issuer: "Issuer:", yes: "Yes", no: "No",
    unlockReport: "🔓 Unlock Full Report",
    unlockReportDesc: "Access all security analysis details",
    whatYouGet: "What you will see:",
    detailedSSL: "Detailed SSL certificate",
    completeWHOIS: "Complete WHOIS with dates",
    reclameAquiHistory: "Full consumer report history",
    socialAnalysis: "Social media analysis",
    trustPilotReviews: "TrustPilot reviews",
    googleTop10: "Top 10 Google results",
    unlockOneTime: "Unlock for $29.90 (one-time)",
    orSubscribe: "Or subscribe for $12/month",
    maybeLater: "Not now",
    pricingTitle: "Complete Protection for Every Need",
    pricingSubtitle: "Millions of people choose Fraudara to stay safe online. Which plan is yours?",
    mostPopular: "MOST POPULAR",
    bestValue: "BEST VALUE",
    planFree: "Free",
    planStarter: "Starter",
    planPro: "Pro",
    planBusiness: "Business",
    freePeriod: "forever",
    monthly: "/month",
    yearly: "/year",
    continueFreePlan: "Continue free",
    upgradePlan: "Get started",
    guarantee: "30-day money-back guarantee",
    featureUnlimited: "Unlimited verifications",
    featureReports: "Complete reports",
    featureMonitoring: "24/7 monitoring",
    featureAlerts: "Real-time alerts",
    featurePriority: "Priority support",
    featureAPI: "API access",
    featureWhatsapp: "WhatsApp alerts",
    featureCustom: "Custom analyses",
    consultationsExhausted: "Free Checks Exhausted",
    consultationsExhaustedDesc: "You've used all 5 free checks. Stay protected with unlimited access:",
    unlimitedAccess: "Unlimited Access — $29.90",
    premiumMonthly: "Premium — $12/month",
    back: "Back",
    footerTagline: "Protecting millions of people from online fraud.",
    footerProduct: "Product",
    footerCompany: "Company",
    footerSupport: "Support",
    footerLegal: "Legal",
    footerHowItWorks: "How it works",
    footerPricing: "Pricing",
    footerAPI: "API for businesses",
    footerAbout: "About us",
    footerCreator: "About the creator",
    footerBlog: "Blog",
    footerHelp: "Help center",
    footerContact: "Contact",
    footerReport: "Report fraud",
    footerPrivacy: "Privacy policy",
    footerTerms: "Terms of use",
    footerCookies: "Cookies",
    footerCopyright: "© 2026 Fraudara. All rights reserved.",
    footerDisclaimer: "Educational tool for digital security awareness.",
    footerEmail: "contactfraudara@gmail.com",
    footerMadeWith: "Made with 🛡️ to protect the world",
    creatorTitle: "About the Creator",
    creatorName: "Pablo Eduardo",
    creatorBio: "Entrepreneur, digital business developer and app/game creator for 11+ years. Expert in digital marketing, artificial intelligence, copywriting and online viralization. Creator of multiple successful digital businesses and viral projects worldwide.",
    creatorRole: "Founder & CEO of Fraudara",
    safeAlternative: "✅ 100% Safe Alternative",
    amazonDesc: "World's largest e-commerce with full guarantee",
    upTo70Off: "Up to 70% OFF",
    totalSecurity: "Total Security",
    totalSecurityDesc: "Bank-level encryption",
    freeVerification: "Free Verification",
    freeVerificationDesc: "5 checks, no sign-up needed",
    alwaysUpdated: "Always Updated",
    alwaysUpdatedDesc: "Real-time database 24/7",
    howItWorks: "How It Works",
    stepStep: "STEP",
    step1Title: "Enter the site or brand",
    step1Desc: "Paste the URL or type the company name you want to verify",
    step2Title: "Our AI analyzes everything",
    step2Desc: "We check 50+ data sources in seconds with artificial intelligence",
    step3Title: "Instant result",
    step3Desc: "Get a complete report with a trust index and recommendations",
    testimonials: "What our users say",
  },

  es: {
    title: "Fraudara",
    subtitle: "El Verificador Global de Fraudes #1",
    tagline: "Protégete de estafas en segundos",
    secure: "100% Seguro",
    instantVerification: "Verificación Instantánea",
    consultationsLeft: "consultas gratuitas restantes",
    freeBadge: "GRATIS",
    specialOffer: "🔥 OFERTA LIMITADA",
    premiumProtection: "Acceso Premium por solo $12/mes",
    guaranteeNow: "OBTENER AHORA",
    sitesVerified: "Sitios Verificados",
    usersProtected: "Usuarios Protegidos",
    accuracy: "Precisión IA",
    fraudsPrevented: "Estafas Evitadas",
    heroTitle: "Antes de Comprar, Verifica.",
    heroTitleAccent: "Instantáneamente.",
    heroSubtitle: "Nuestra IA analiza más de 50 fuentes de datos en segundos para decirte si un sitio es seguro o no.",
    placeholder: "Ingresa el URL o nombre de la marca (ej: tienda-oferta.com)",
    verifyButton: "Verificar Ahora — Es Gratis",
    verifying: "IA Analizando...",
    verifiedBy: "Confiado por más de 3,1M de usuarios",
    analysisInProgress: "Análisis en Progreso",
    checkingDomain: "Verificando dominio y certificados SSL...",
    consultingComplaints: "Consultando base de quejas global...",
    analyzingReputation: "IA analizando reputación online...",
    crossChecking: "Cruzando datos de 50+ fuentes...",
    trustIndex: "Índice de Confianza",
    analysisTime: "Tiempo de Análisis",
    complaintsFound: "quejas en los últimos 30 días",
    completeReport: "Ver Informe Completo",
    shareWhatsApp: "Compartir en WhatsApp",
    newVerification: "Nueva Verificación",
    sslCertificate: "Certificado SSL/TLS",
    domainInfo: "Información del Dominio (WHOIS)",
    reclameAqui: "Reportes de Consumidores",
    socialNetworks: "Presencia en Redes Sociales",
    trustPilot: "TrustPilot",
    googleResults: "Top 10 Resultados Google",
    present: "Presente:", valid: "Válido:", validFrom: "Válido desde:",
    validTo: "Válido hasta:", issuer: "Emisor:", yes: "Sí", no: "No",
    unlockReport: "🔓 Desbloquear Informe Completo",
    unlockReportDesc: "Accede a todos los detalles del análisis",
    whatYouGet: "Lo que verás:",
    detailedSSL: "Certificado SSL detallado",
    completeWHOIS: "WHOIS completo con fechas",
    reclameAquiHistory: "Historial completo de quejas",
    socialAnalysis: "Análisis de redes sociales",
    trustPilotReviews: "Reseñas de TrustPilot",
    googleTop10: "Top 10 resultados Google",
    unlockOneTime: "Desbloquear por $29.90 (único)",
    orSubscribe: "O suscribirse por $12/mes",
    maybeLater: "Ahora no",
    pricingTitle: "Protección Completa para Cada Necesidad",
    pricingSubtitle: "Millones de personas eligen Fraudara para estar seguros online.",
    mostPopular: "MÁS POPULAR",
    bestValue: "MEJOR VALOR",
    planFree: "Gratis",
    planStarter: "Starter",
    planPro: "Pro",
    planBusiness: "Business",
    freePeriod: "para siempre",
    monthly: "/mes",
    yearly: "/año",
    continueFreePlan: "Continuar gratis",
    upgradePlan: "Comenzar ahora",
    guarantee: "Garantía de devolución de 30 días",
    featureUnlimited: "Verificaciones ilimitadas",
    featureReports: "Informes completos",
    featureMonitoring: "Monitoreo 24/7",
    featureAlerts: "Alertas en tiempo real",
    featurePriority: "Soporte prioritario",
    featureAPI: "Acceso a API",
    featureWhatsapp: "Alertas WhatsApp",
    featureCustom: "Análisis personalizados",
    consultationsExhausted: "Consultas Gratuitas Agotadas",
    consultationsExhaustedDesc: "Usaste tus 5 consultas gratuitas. Continúa protegido con acceso ilimitado:",
    unlimitedAccess: "Acceso Ilimitado — $29.90",
    premiumMonthly: "Premium — $12/mes",
    back: "Volver",
    footerTagline: "Protegiendo millones de personas del fraude online.",
    footerProduct: "Producto",
    footerCompany: "Empresa",
    footerSupport: "Soporte",
    footerLegal: "Legal",
    footerHowItWorks: "Cómo funciona",
    footerPricing: "Precios",
    footerAPI: "API para empresas",
    footerAbout: "Sobre nosotros",
    footerCreator: "Sobre el creador",
    footerBlog: "Blog",
    footerHelp: "Centro de ayuda",
    footerContact: "Contacto",
    footerReport: "Reportar fraude",
    footerPrivacy: "Privacidad",
    footerTerms: "Términos de uso",
    footerCookies: "Cookies",
    footerCopyright: "© 2026 Fraudara. Todos los derechos reservados.",
    footerDisclaimer: "Herramienta educativa para la concienciación sobre seguridad digital.",
    footerEmail: "contactfraudara@gmail.com",
    footerMadeWith: "Hecho con 🛡️ para proteger el mundo",
    creatorTitle: "Sobre el Creador",
    creatorName: "Pablo Eduardo",
    creatorBio: "Emprendedor digital y desarrollador de apps y juegos por más de 11 años. Especialista en marketing digital, inteligencia artificial, copywriting y viralización online. Creador de múltiples negocios digitales exitosos y proyectos virales en todo el mundo.",
    creatorRole: "Fundador & CEO de Fraudara",
    safeAlternative: "✅ Alternativa 100% Segura",
    amazonDesc: "El mayor e-commerce del mundo con garantía total",
    upTo70Off: "Hasta 70% OFF",
    totalSecurity: "Seguridad Total",
    totalSecurityDesc: "Cifrado nivel bancario",
    freeVerification: "Verificación Gratuita",
    freeVerificationDesc: "5 consultas sin registro",
    alwaysUpdated: "Siempre Actualizado",
    alwaysUpdatedDesc: "Base de datos en tiempo real 24/7",
    howItWorks: "Cómo Funciona",
    stepStep: "PASO",
    step1Title: "Ingresa el sitio o marca",
    step1Desc: "Pega el URL o escribe el nombre de la empresa",
    step2Title: "Nuestra IA analiza todo",
    step2Desc: "Verificamos 50+ fuentes de datos en segundos",
    step3Title: "Resultado instantáneo",
    step3Desc: "Recibe un informe completo con índice de confianza",
    testimonials: "Lo que dicen nuestros usuarios",
  },

  zh: {
    title: "Fraudara",
    subtitle: "全球第一反诈骗验证平台",
    tagline: "几秒钟内保护您免受诈骗",
    secure: "100% 安全",
    instantVerification: "即时验证",
    consultationsLeft: "剩余免费查询次数",
    freeBadge: "免费",
    specialOffer: "🔥 限时优惠",
    premiumProtection: "高级访问仅需每月$12",
    guaranteeNow: "立即获取",
    sitesVerified: "已验证网站",
    usersProtected: "受保护用户",
    accuracy: "AI准确率",
    fraudsPrevented: "已阻止诈骗",
    heroTitle: "购买前，先验证。",
    heroTitleAccent: "即时完成。",
    heroSubtitle: "我们的AI在几秒钟内分析50多个数据源，告诉您网站是否安全。",
    placeholder: "输入网站URL或品牌名称",
    verifyButton: "立即验证 — 免费",
    verifying: "AI分析中...",
    verifiedBy: "全球310万+用户信赖",
    analysisInProgress: "分析进行中",
    checkingDomain: "检查域名和SSL证书...",
    consultingComplaints: "查询全球投诉数据库...",
    analyzingReputation: "AI分析在线声誉...",
    crossChecking: "交叉核对50+数据源...",
    trustIndex: "信任指数",
    analysisTime: "分析时间",
    complaintsFound: "过去30天内的投诉",
    completeReport: "查看完整报告",
    shareWhatsApp: "在WhatsApp上分享",
    newVerification: "新验证",
    sslCertificate: "SSL/TLS证书",
    domainInfo: "域名信息（WHOIS）",
    reclameAqui: "消费者投诉",
    socialNetworks: "社交媒体存在",
    trustPilot: "TrustPilot",
    googleResults: "Google前10结果",
    present: "存在：", valid: "有效：", validFrom: "有效期从：",
    validTo: "有效期至：", issuer: "颁发者：", yes: "是", no: "否",
    unlockReport: "🔓 解锁完整报告",
    unlockReportDesc: "访问所有安全分析详情",
    whatYouGet: "您将看到：",
    detailedSSL: "详细SSL证书",
    completeWHOIS: "完整WHOIS信息",
    reclameAquiHistory: "消费者投诉历史",
    socialAnalysis: "社交媒体分析",
    trustPilotReviews: "TrustPilot评论",
    googleTop10: "Google前10结果",
    unlockOneTime: "以$29.90解锁（一次性）",
    orSubscribe: "或每月$12订阅",
    maybeLater: "暂不",
    pricingTitle: "满足每种需求的完整保护",
    pricingSubtitle: "数百万人选择Fraudara保持在线安全。",
    mostPopular: "最受欢迎",
    bestValue: "最佳性价比",
    planFree: "免费",
    planStarter: "入门版",
    planPro: "专业版",
    planBusiness: "商业版",
    freePeriod: "永久",
    monthly: "/月",
    yearly: "/年",
    continueFreePlan: "继续免费使用",
    upgradePlan: "立即开始",
    guarantee: "30天退款保证",
    featureUnlimited: "无限次验证",
    featureReports: "完整报告",
    featureMonitoring: "24/7监控",
    featureAlerts: "实时警报",
    featurePriority: "优先支持",
    featureAPI: "API访问",
    featureWhatsapp: "WhatsApp警报",
    featureCustom: "定制分析",
    consultationsExhausted: "免费查询已用完",
    consultationsExhaustedDesc: "您已使用完5次免费查询。继续使用无限访问保持安全：",
    unlimitedAccess: "无限访问 — $29.90",
    premiumMonthly: "高级版 — $12/月",
    back: "返回",
    footerTagline: "保护数百万人免受在线诈骗。",
    footerProduct: "产品",
    footerCompany: "公司",
    footerSupport: "支持",
    footerLegal: "法律",
    footerHowItWorks: "工作原理",
    footerPricing: "定价",
    footerAPI: "企业API",
    footerAbout: "关于我们",
    footerCreator: "关于创始人",
    footerBlog: "博客",
    footerHelp: "帮助中心",
    footerContact: "联系我们",
    footerReport: "举报诈骗",
    footerPrivacy: "隐私政策",
    footerTerms: "使用条款",
    footerCookies: "Cookie政策",
    footerCopyright: "© 2026 Fraudara. 保留所有权利。",
    footerDisclaimer: "数字安全意识教育工具。",
    footerEmail: "contactfraudara@gmail.com",
    footerMadeWith: "用🛡️守护世界",
    creatorTitle: "关于创始人",
    creatorName: "Pablo Eduardo",
    creatorBio: "数字企业家，应用和游戏开发者，拥有超过11年经验。数字营销、人工智能、文案写作和在线病毒传播专家。在全球创建了多个成功的数字业务和病毒式项目。",
    creatorRole: "Fraudara 创始人兼CEO",
    safeAlternative: "✅ 100%安全替代方案",
    amazonDesc: "全球最大电商，完全保障",
    upTo70Off: "高达70%折扣",
    totalSecurity: "全面安全",
    totalSecurityDesc: "银行级加密",
    freeVerification: "免费验证",
    freeVerificationDesc: "5次查询无需注册",
    alwaysUpdated: "实时更新",
    alwaysUpdatedDesc: "24/7实时数据库",
    howItWorks: "工作原理",
    stepStep: "步骤",
    step1Title: "输入网站或品牌",
    step1Desc: "粘贴URL或输入要验证的公司名称",
    step2Title: "我们的AI分析一切",
    step2Desc: "几秒内检查50多个数据源",
    step3Title: "即时结果",
    step3Desc: "获得包含信任指数的完整报告",
    testimonials: "用户评价",
  },

  fr: {
    title: "Fraudara",
    subtitle: "Le Vérificateur Anti-Fraude #1 Mondial",
    tagline: "Protégez-vous des arnaques en quelques secondes",
    secure: "100% Sécurisé",
    instantVerification: "Vérification Instantanée",
    consultationsLeft: "consultations gratuites restantes",
    freeBadge: "GRATUIT",
    specialOffer: "🔥 OFFRE LIMITÉE",
    premiumProtection: "Accès Premium pour seulement 12€/mois",
    guaranteeNow: "OBTENIR MAINTENANT",
    sitesVerified: "Sites Vérifiés",
    usersProtected: "Utilisateurs Protégés",
    accuracy: "Précision IA",
    fraudsPrevented: "Arnaques Évitées",
    heroTitle: "Avant d'acheter, Vérifiez.",
    heroTitleAccent: "Instantanément.",
    heroSubtitle: "Notre IA analyse plus de 50 sources de données en secondes pour vous dire si un site est sûr ou non.",
    placeholder: "Entrez l'URL ou le nom de la marque",
    verifyButton: "Vérifier Maintenant — C'est Gratuit",
    verifying: "IA en cours d'analyse...",
    verifiedBy: "Approuvé par plus de 3,1M d'utilisateurs",
    analysisInProgress: "Analyse en Cours",
    checkingDomain: "Vérification du domaine et des certificats SSL...",
    consultingComplaints: "Consultation de la base mondiale de plaintes...",
    analyzingReputation: "IA analysant la réputation en ligne...",
    crossChecking: "Recoupement de 50+ sources de données...",
    trustIndex: "Indice de Confiance",
    analysisTime: "Temps d'Analyse",
    complaintsFound: "plaintes dans les 30 derniers jours",
    completeReport: "Voir le Rapport Complet",
    shareWhatsApp: "Partager sur WhatsApp",
    newVerification: "Nouvelle Vérification",
    sslCertificate: "Certificat SSL/TLS",
    domainInfo: "Informations du Domaine (WHOIS)",
    reclameAqui: "Rapports Consommateurs",
    socialNetworks: "Présence sur les Réseaux Sociaux",
    trustPilot: "TrustPilot",
    googleResults: "Top 10 Résultats Google",
    present: "Présent:", valid: "Valide:", validFrom: "Valide de:",
    validTo: "Valide jusqu'à:", issuer: "Émetteur:", yes: "Oui", no: "Non",
    unlockReport: "🔓 Débloquer le Rapport Complet",
    unlockReportDesc: "Accédez à tous les détails de l'analyse",
    whatYouGet: "Ce que vous verrez:",
    detailedSSL: "Certificat SSL détaillé",
    completeWHOIS: "WHOIS complet avec dates",
    reclameAquiHistory: "Historique complet des plaintes",
    socialAnalysis: "Analyse des réseaux sociaux",
    trustPilotReviews: "Avis TrustPilot",
    googleTop10: "Top 10 résultats Google",
    unlockOneTime: "Débloquer pour 29,90€ (unique)",
    orSubscribe: "Ou s'abonner pour 12€/mois",
    maybeLater: "Pas maintenant",
    pricingTitle: "Protection Complète pour Chaque Besoin",
    pricingSubtitle: "Des millions de personnes choisissent Fraudara pour rester en sécurité en ligne.",
    mostPopular: "LE PLUS POPULAIRE",
    bestValue: "MEILLEUR RAPPORT",
    planFree: "Gratuit",
    planStarter: "Starter",
    planPro: "Pro",
    planBusiness: "Business",
    freePeriod: "pour toujours",
    monthly: "/mois",
    yearly: "/an",
    continueFreePlan: "Continuer gratuitement",
    upgradePlan: "Commencer maintenant",
    guarantee: "Garantie de remboursement 30 jours",
    featureUnlimited: "Vérifications illimitées",
    featureReports: "Rapports complets",
    featureMonitoring: "Surveillance 24/7",
    featureAlerts: "Alertes en temps réel",
    featurePriority: "Support prioritaire",
    featureAPI: "Accès API",
    featureWhatsapp: "Alertes WhatsApp",
    featureCustom: "Analyses personnalisées",
    consultationsExhausted: "Consultations Gratuites Épuisées",
    consultationsExhaustedDesc: "Vous avez utilisé vos 5 consultations gratuites. Restez protégé avec un accès illimité:",
    unlimitedAccess: "Accès Illimité — 29,90€",
    premiumMonthly: "Premium — 12€/mois",
    back: "Retour",
    footerTagline: "Protégeant des millions de personnes contre la fraude en ligne.",
    footerProduct: "Produit", footerCompany: "Entreprise", footerSupport: "Support", footerLegal: "Légal",
    footerHowItWorks: "Comment ça marche", footerPricing: "Tarifs", footerAPI: "API pour entreprises",
    footerAbout: "À propos", footerCreator: "Le créateur", footerBlog: "Blog",
    footerHelp: "Centre d'aide", footerContact: "Contact", footerReport: "Signaler une fraude",
    footerPrivacy: "Confidentialité", footerTerms: "Conditions d'utilisation", footerCookies: "Cookies",
    footerCopyright: "© 2026 Fraudara. Tous droits réservés.",
    footerDisclaimer: "Outil éducatif pour la sensibilisation à la sécurité numérique.",
    footerEmail: "contactfraudara@gmail.com",
    footerMadeWith: "Fait avec 🛡️ pour protéger le monde",
    creatorTitle: "À propos du Créateur",
    creatorName: "Pablo Eduardo",
    creatorBio: "Entrepreneur digital et développeur d'apps et jeux depuis plus de 11 ans. Expert en marketing digital, intelligence artificielle, copywriting et viralisation en ligne. Créateur de multiples entreprises digitales à succès et projets viraux dans le monde entier.",
    creatorRole: "Fondateur & PDG de Fraudara",
    safeAlternative: "✅ Alternative 100% Sûre",
    amazonDesc: "Le plus grand e-commerce du monde avec garantie totale",
    upTo70Off: "Jusqu'à 70% OFF",
    totalSecurity: "Sécurité Totale", totalSecurityDesc: "Chiffrement niveau bancaire",
    freeVerification: "Vérification Gratuite", freeVerificationDesc: "5 consultations sans inscription",
    alwaysUpdated: "Toujours À Jour", alwaysUpdatedDesc: "Base de données en temps réel 24/7",
    howItWorks: "Comment Ça Marche",
    stepStep: "ÉTAPE",
    step1Title: "Entrez le site ou la marque", step1Desc: "Collez l'URL ou tapez le nom de l'entreprise",
    step2Title: "Notre IA analyse tout", step2Desc: "Nous vérifions 50+ sources de données en secondes",
    step3Title: "Résultat instantané", step3Desc: "Recevez un rapport complet avec indice de confiance",
    testimonials: "Ce que disent nos utilisateurs",
  },

  de: {
    title: "Fraudara",
    subtitle: "Der weltweite #1 Betrugsschutz-Prüfer",
    tagline: "Schützen Sie sich in Sekunden vor Betrug",
    secure: "100% Sicher",
    instantVerification: "Sofortige Überprüfung",
    consultationsLeft: "kostenlose Prüfungen verbleibend",
    freeBadge: "KOSTENLOS",
    specialOffer: "🔥 BEGRENZTESS ANGEBOT",
    premiumProtection: "Premium-Zugang für nur 12€/Monat",
    guaranteeNow: "JETZT SICHERN",
    sitesVerified: "Überprüfte Websites",
    usersProtected: "Geschützte Nutzer",
    accuracy: "KI-Genauigkeit",
    fraudsPrevented: "Betrügereien Verhindert",
    heroTitle: "Vor dem Kauf, Überprüfen.",
    heroTitleAccent: "Sofort.",
    heroSubtitle: "Unsere KI analysiert 50+ Datenquellen in Sekunden und sagt Ihnen, ob eine Website sicher ist.",
    placeholder: "URL oder Markenname eingeben",
    verifyButton: "Jetzt Prüfen — Kostenlos",
    verifying: "KI analysiert...",
    verifiedBy: "Von 3,1M+ Nutzern weltweit vertraut",
    analysisInProgress: "Analyse läuft",
    checkingDomain: "Domain und SSL-Zertifikate prüfen...",
    consultingComplaints: "Globale Beschwerden-Datenbank konsultieren...",
    analyzingReputation: "KI analysiert Online-Reputation...",
    crossChecking: "50+ Datenquellen abgleichen...",
    trustIndex: "Vertrauensindex",
    analysisTime: "Analysezeit",
    complaintsFound: "Beschwerden in den letzten 30 Tagen",
    completeReport: "Vollständigen Bericht anzeigen",
    shareWhatsApp: "Auf WhatsApp teilen",
    newVerification: "Neue Überprüfung",
    sslCertificate: "SSL/TLS-Zertifikat",
    domainInfo: "Domain-Informationen (WHOIS)",
    reclameAqui: "Verbraucherberichte",
    socialNetworks: "Präsenz in sozialen Medien",
    trustPilot: "TrustPilot",
    googleResults: "Top 10 Google-Ergebnisse",
    present: "Vorhanden:", valid: "Gültig:", validFrom: "Gültig von:",
    validTo: "Gültig bis:", issuer: "Aussteller:", yes: "Ja", no: "Nein",
    unlockReport: "🔓 Vollständigen Bericht freischalten",
    unlockReportDesc: "Alle Sicherheitsanalyse-Details abrufen",
    whatYouGet: "Was Sie sehen werden:",
    detailedSSL: "Detailliertes SSL-Zertifikat",
    completeWHOIS: "Vollständige WHOIS-Informationen",
    reclameAquiHistory: "Vollständiger Beschwerdeverlauf",
    socialAnalysis: "Social-Media-Analyse",
    trustPilotReviews: "TrustPilot-Bewertungen",
    googleTop10: "Top 10 Google-Ergebnisse",
    unlockOneTime: "Für 29,90€ freischalten (einmalig)",
    orSubscribe: "Oder für 12€/Monat abonnieren",
    maybeLater: "Jetzt nicht",
    pricingTitle: "Kompletter Schutz für jeden Bedarf",
    pricingSubtitle: "Millionen wählen Fraudara für ihre Online-Sicherheit.",
    mostPopular: "AM BELIEBTESTEN",
    bestValue: "BESTES ANGEBOT",
    planFree: "Kostenlos", planStarter: "Starter", planPro: "Pro", planBusiness: "Business",
    freePeriod: "für immer", monthly: "/Monat", yearly: "/Jahr",
    continueFreePlan: "Kostenlos fortfahren",
    upgradePlan: "Jetzt starten",
    guarantee: "30-Tage-Geld-zurück-Garantie",
    featureUnlimited: "Unbegrenzte Prüfungen",
    featureReports: "Vollständige Berichte",
    featureMonitoring: "24/7-Überwachung",
    featureAlerts: "Echtzeit-Benachrichtigungen",
    featurePriority: "Prioritäts-Support",
    featureAPI: "API-Zugang",
    featureWhatsapp: "WhatsApp-Benachrichtigungen",
    featureCustom: "Individuelle Analysen",
    consultationsExhausted: "Kostenlose Prüfungen Erschöpft",
    consultationsExhaustedDesc: "Sie haben Ihre 5 kostenlosen Prüfungen verwendet. Bleiben Sie mit unbegrenztem Zugang geschützt:",
    unlimitedAccess: "Unbegrenzter Zugang — 29,90€",
    premiumMonthly: "Premium — 12€/Monat",
    back: "Zurück",
    footerTagline: "Millionen von Menschen vor Online-Betrug schützen.",
    footerProduct: "Produkt", footerCompany: "Unternehmen", footerSupport: "Support", footerLegal: "Rechtliches",
    footerHowItWorks: "Wie es funktioniert", footerPricing: "Preise", footerAPI: "API für Unternehmen",
    footerAbout: "Über uns", footerCreator: "Der Gründer", footerBlog: "Blog",
    footerHelp: "Hilfezentrum", footerContact: "Kontakt", footerReport: "Betrug melden",
    footerPrivacy: "Datenschutz", footerTerms: "Nutzungsbedingungen", footerCookies: "Cookies",
    footerCopyright: "© 2026 Fraudara. Alle Rechte vorbehalten.",
    footerDisclaimer: "Bildungswerkzeug für digitale Sicherheit.",
    footerEmail: "contactfraudara@gmail.com",
    footerMadeWith: "Mit 🛡️ gemacht, um die Welt zu schützen",
    creatorTitle: "Über den Gründer",
    creatorName: "Pablo Eduardo",
    creatorBio: "Digitaler Unternehmer und App-/Spieleentwickler seit über 11 Jahren. Experte für digitales Marketing, künstliche Intelligenz, Copywriting und Online-Viralisierung. Gründer mehrerer erfolgreicher digitaler Unternehmen und viraler Projekte weltweit.",
    creatorRole: "Gründer & CEO von Fraudara",
    safeAlternative: "✅ 100% Sichere Alternative",
    amazonDesc: "Weltgrößter E-Commerce mit Vollgarantie",
    upTo70Off: "Bis zu 70% RABATT",
    totalSecurity: "Totale Sicherheit", totalSecurityDesc: "Verschlüsselung auf Bankenniveau",
    freeVerification: "Kostenlose Prüfung", freeVerificationDesc: "5 Prüfungen ohne Anmeldung",
    alwaysUpdated: "Immer Aktuell", alwaysUpdatedDesc: "Echtzeit-Datenbank 24/7",
    howItWorks: "Wie Es Funktioniert",
    stepStep: "SCHRITT",
    step1Title: "Website oder Marke eingeben", step1Desc: "URL einfügen oder Firmennamen eingeben",
    step2Title: "Unsere KI analysiert alles", step2Desc: "Wir prüfen 50+ Datenquellen in Sekunden",
    step3Title: "Sofortiges Ergebnis", step3Desc: "Vollständigen Bericht mit Vertrauensindex erhalten",
    testimonials: "Was unsere Nutzer sagen",
  },

  ar: {
    title: "Fraudara",
    subtitle: "المنصة العالمية الأولى لمكافحة الاحتيال",
    tagline: "احمِ نفسك من عمليات الاحتيال في ثوانٍ",
    secure: "100% آمن",
    instantVerification: "التحقق الفوري",
    consultationsLeft: "استشارات مجانية متبقية",
    freeBadge: "مجاني",
    specialOffer: "🔥 عرض محدود",
    premiumProtection: "وصول مميز بـ 12$ فقط شهرياً",
    guaranteeNow: "احصل عليه الآن",
    sitesVerified: "المواقع المتحققة",
    usersProtected: "المستخدمون المحميون",
    accuracy: "دقة الذكاء الاصطناعي",
    fraudsPrevented: "الاحتيال المنع",
    heroTitle: "قبل الشراء، تحقق.",
    heroTitleAccent: "فوراً.",
    heroSubtitle: "يحلل ذكاؤنا الاصطناعي أكثر من 50 مصدر بيانات في ثوانٍ ليخبرك إذا كان الموقع آمناً أم لا.",
    placeholder: "أدخل رابط الموقع أو اسم العلامة التجارية",
    verifyButton: "تحقق الآن — مجاناً",
    verifying: "الذكاء الاصطناعي يحلل...",
    verifiedBy: "موثوق به من أكثر من 3.1 مليون مستخدم",
    analysisInProgress: "التحليل جارٍ",
    checkingDomain: "فحص النطاق وشهادات SSL...",
    consultingComplaints: "الاستعلام من قاعدة الشكاوى العالمية...",
    analyzingReputation: "الذكاء الاصطناعي يحلل السمعة عبر الإنترنت...",
    crossChecking: "التحقق من أكثر من 50 مصدر بيانات...",
    trustIndex: "مؤشر الثقة",
    analysisTime: "وقت التحليل",
    complaintsFound: "شكاوى في آخر 30 يوماً",
    completeReport: "عرض التقرير الكامل",
    shareWhatsApp: "مشاركة على واتساب",
    newVerification: "تحقق جديد",
    sslCertificate: "شهادة SSL/TLS",
    domainInfo: "معلومات النطاق (WHOIS)",
    reclameAqui: "تقارير المستهلكين",
    socialNetworks: "الحضور على وسائل التواصل",
    trustPilot: "TrustPilot",
    googleResults: "أفضل 10 نتائج جوجل",
    present: "موجود:", valid: "صالح:", validFrom: "صالح من:", validTo: "صالح حتى:", issuer: "المُصدر:", yes: "نعم", no: "لا",
    unlockReport: "🔓 فتح التقرير الكامل",
    unlockReportDesc: "الوصول إلى جميع تفاصيل تحليل الأمان",
    whatYouGet: "ما ستراه:",
    detailedSSL: "شهادة SSL مفصلة",
    completeWHOIS: "معلومات WHOIS كاملة",
    reclameAquiHistory: "سجل الشكاوى الكامل",
    socialAnalysis: "تحليل وسائل التواصل الاجتماعي",
    trustPilotReviews: "مراجعات TrustPilot",
    googleTop10: "أفضل 10 نتائج جوجل",
    unlockOneTime: "فتح بـ 29.90$ (مرة واحدة)",
    orSubscribe: "أو الاشتراك بـ 12$/شهر",
    maybeLater: "ليس الآن",
    pricingTitle: "حماية كاملة لكل احتياج",
    pricingSubtitle: "يختار ملايين الأشخاص Fraudara للبقاء آمنين عبر الإنترنت.",
    mostPopular: "الأكثر شعبية",
    bestValue: "أفضل قيمة",
    planFree: "مجاني", planStarter: "مبتدئ", planPro: "محترف", planBusiness: "أعمال",
    freePeriod: "للأبد", monthly: "/شهر", yearly: "/سنة",
    continueFreePlan: "متابعة مجاناً",
    upgradePlan: "ابدأ الآن",
    guarantee: "ضمان استرداد المال لمدة 30 يوماً",
    featureUnlimited: "تحققات غير محدودة",
    featureReports: "تقارير كاملة",
    featureMonitoring: "مراقبة 24/7",
    featureAlerts: "تنبيهات في الوقت الفعلي",
    featurePriority: "دعم أولوية",
    featureAPI: "وصول API",
    featureWhatsapp: "تنبيهات واتساب",
    featureCustom: "تحليلات مخصصة",
    consultationsExhausted: "نفدت الاستشارات المجانية",
    consultationsExhaustedDesc: "لقد استخدمت استشاراتك المجانية الـ5. ابقَ محمياً مع وصول غير محدود:",
    unlimitedAccess: "وصول غير محدود — 29.90$",
    premiumMonthly: "مميز — 12$/شهر",
    back: "العودة",
    footerTagline: "حماية ملايين الأشخاص من الاحتيال الإلكتروني.",
    footerProduct: "المنتج", footerCompany: "الشركة", footerSupport: "الدعم", footerLegal: "القانونية",
    footerHowItWorks: "كيف يعمل", footerPricing: "الأسعار", footerAPI: "API للشركات",
    footerAbout: "معلومات عنا", footerCreator: "عن المنشئ", footerBlog: "المدونة",
    footerHelp: "مركز المساعدة", footerContact: "التواصل", footerReport: "الإبلاغ عن احتيال",
    footerPrivacy: "الخصوصية", footerTerms: "شروط الاستخدام", footerCookies: "ملفات تعريف الارتباط",
    footerCopyright: "© 2026 Fraudara. جميع الحقوق محفوظة.",
    footerDisclaimer: "أداة تعليمية للتوعية بالأمان الرقمي.",
    footerEmail: "contactfraudara@gmail.com",
    footerMadeWith: "صنع بـ 🛡️ لحماية العالم",
    creatorTitle: "عن المنشئ",
    creatorName: "Pablo Eduardo",
    creatorBio: "رجل أعمال رقمي ومطور تطبيقات وألعاب لأكثر من 11 عاماً. خبير في التسويق الرقمي والذكاء الاصطناعي وكتابة الإعلانات والانتشار الفيروسي عبر الإنترنت. أنشأ العديد من الأعمال الرقمية الناجحة والمشاريع الفيروسية حول العالم.",
    creatorRole: "المؤسس والرئيس التنفيذي لـ Fraudara",
    safeAlternative: "✅ بديل آمن 100%",
    amazonDesc: "أكبر متجر إلكتروني في العالم مع ضمان كامل",
    upTo70Off: "خصم يصل إلى 70%",
    totalSecurity: "أمان كامل", totalSecurityDesc: "تشفير على مستوى البنوك",
    freeVerification: "تحقق مجاني", freeVerificationDesc: "5 استشارات بدون تسجيل",
    alwaysUpdated: "دائماً محدث", alwaysUpdatedDesc: "قاعدة بيانات في الوقت الفعلي 24/7",
    howItWorks: "كيف يعمل",
    stepStep: "الخطوة",
    step1Title: "أدخل الموقع أو العلامة التجارية", step1Desc: "الصق الرابط أو اكتب اسم الشركة",
    step2Title: "ذكاؤنا الاصطناعي يحلل كل شيء", step2Desc: "نتحقق من 50+ مصدر بيانات في ثوانٍ",
    step3Title: "نتيجة فورية", step3Desc: "احصل على تقرير كامل مع مؤشر الثقة",
    testimonials: "ما يقوله مستخدمونا",
  },

  ja: {
    title: "Fraudara",
    subtitle: "世界No.1 詐欺防止チェッカー",
    tagline: "数秒で詐欺から身を守る",
    secure: "100% 安全",
    instantVerification: "即時検証",
    consultationsLeft: "無料チェック残り回数",
    freeBadge: "無料",
    specialOffer: "🔥 期間限定オファー",
    premiumProtection: "プレミアムアクセスが月額$12から",
    guaranteeNow: "今すぐ入手",
    sitesVerified: "検証済みサイト",
    usersProtected: "保護されたユーザー",
    accuracy: "AI精度",
    fraudsPrevented: "防止された詐欺",
    heroTitle: "購入前に、確認。",
    heroTitleAccent: "即座に。",
    heroSubtitle: "私たちのAIは数秒で50以上のデータソースを分析し、サイトが安全かどうかを教えてくれます。",
    placeholder: "URLまたはブランド名を入力",
    verifyButton: "今すぐ確認 — 無料",
    verifying: "AI分析中...",
    verifiedBy: "310万人以上のユーザーに信頼",
    analysisInProgress: "分析進行中",
    checkingDomain: "ドメインとSSL証明書を確認中...",
    consultingComplaints: "グローバル苦情データベースを照会中...",
    analyzingReputation: "AIがオンライン評判を分析中...",
    crossChecking: "50以上のデータソースを照合中...",
    trustIndex: "信頼指数",
    analysisTime: "分析時間",
    complaintsFound: "過去30日間の苦情",
    completeReport: "完全なレポートを表示",
    shareWhatsApp: "WhatsAppで共有",
    newVerification: "新しい検証",
    sslCertificate: "SSL/TLS証明書",
    domainInfo: "ドメイン情報（WHOIS）",
    reclameAqui: "消費者レポート",
    socialNetworks: "ソーシャルメディアの存在",
    trustPilot: "TrustPilot",
    googleResults: "Google上位10結果",
    present: "存在:", valid: "有効:", validFrom: "有効期間開始:", validTo: "有効期間終了:", issuer: "発行者:", yes: "はい", no: "いいえ",
    unlockReport: "🔓 完全レポートを解除",
    unlockReportDesc: "すべてのセキュリティ分析の詳細にアクセス",
    whatYouGet: "表示される内容:",
    detailedSSL: "詳細なSSL証明書",
    completeWHOIS: "完全なWHOIS情報",
    reclameAquiHistory: "消費者レポートの全履歴",
    socialAnalysis: "ソーシャルメディア分析",
    trustPilotReviews: "TrustPilotレビュー",
    googleTop10: "Google上位10結果",
    unlockOneTime: "$29.90でアンロック（一回限り）",
    orSubscribe: "または月額$12で購読",
    maybeLater: "後で",
    pricingTitle: "あらゆるニーズに完全な保護",
    pricingSubtitle: "何百万人もの人々がFraudaraでオンラインの安全を守っています。",
    mostPopular: "最も人気",
    bestValue: "最高コスパ",
    planFree: "無料", planStarter: "スターター", planPro: "プロ", planBusiness: "ビジネス",
    freePeriod: "永久", monthly: "/月", yearly: "/年",
    continueFreePlan: "無料で続ける",
    upgradePlan: "今すぐ始める",
    guarantee: "30日間返金保証",
    featureUnlimited: "無制限の検証",
    featureReports: "完全なレポート",
    featureMonitoring: "24/7監視",
    featureAlerts: "リアルタイムアラート",
    featurePriority: "優先サポート",
    featureAPI: "APIアクセス",
    featureWhatsapp: "WhatsAppアラート",
    featureCustom: "カスタム分析",
    consultationsExhausted: "無料チェック終了",
    consultationsExhaustedDesc: "5回の無料チェックを使い切りました。無制限アクセスで保護を継続:",
    unlimitedAccess: "無制限アクセス — $29.90",
    premiumMonthly: "プレミアム — $12/月",
    back: "戻る",
    footerTagline: "何百万人もの人々をオンライン詐欺から守っています。",
    footerProduct: "製品", footerCompany: "会社", footerSupport: "サポート", footerLegal: "法的事項",
    footerHowItWorks: "仕組み", footerPricing: "料金", footerAPI: "企業向けAPI",
    footerAbout: "会社概要", footerCreator: "創設者について", footerBlog: "ブログ",
    footerHelp: "ヘルプセンター", footerContact: "お問い合わせ", footerReport: "詐欺を報告",
    footerPrivacy: "プライバシー", footerTerms: "利用規約", footerCookies: "クッキー",
    footerCopyright: "© 2026 Fraudara. 全著作権所有。",
    footerDisclaimer: "デジタルセキュリティ意識向上のための教育ツール。",
    footerEmail: "contactfraudara@gmail.com",
    footerMadeWith: "🛡️で世界を守るために作成",
    creatorTitle: "創設者について",
    creatorName: "Pablo Eduardo",
    creatorBio: "11年以上のアプリ・ゲーム開発者兼デジタル起業家。デジタルマーケティング、人工知能、コピーライティング、オンラインバイラライゼーションの専門家。世界中で複数の成功したデジタルビジネスとバイラルプロジェクトを作成。",
    creatorRole: "Fraudara 創設者 & CEO",
    safeAlternative: "✅ 100%安全な代替案",
    amazonDesc: "完全保証付き世界最大のeコマース",
    upTo70Off: "最大70%オフ",
    totalSecurity: "完全なセキュリティ", totalSecurityDesc: "銀行レベルの暗号化",
    freeVerification: "無料検証", freeVerificationDesc: "登録なしで5回チェック",
    alwaysUpdated: "常に更新", alwaysUpdatedDesc: "24/7リアルタイムデータベース",
    howItWorks: "仕組み",
    stepStep: "ステップ",
    step1Title: "サイトまたはブランドを入力", step1Desc: "URLを貼り付けるか企業名を入力",
    step2Title: "AIがすべてを分析", step2Desc: "50以上のデータソースを数秒で確認",
    step3Title: "即時結果", step3Desc: "信頼指数と完全なレポートを受け取る",
    testimonials: "ユーザーの声",
  },

  ru: {
    title: "Fraudara",
    subtitle: "Мировой Верификатор Мошенничества №1",
    tagline: "Защитите себя от мошенников за секунды",
    secure: "100% Безопасно",
    instantVerification: "Мгновенная Проверка",
    consultationsLeft: "бесплатных проверок осталось",
    freeBadge: "БЕСПЛАТНО",
    specialOffer: "🔥 ОГРАНИЧЕННОЕ ПРЕДЛОЖЕНИЕ",
    premiumProtection: "Премиум доступ всего за $12/месяц",
    guaranteeNow: "ПОЛУЧИТЬ СЕЙЧАС",
    sitesVerified: "Проверенных Сайтов",
    usersProtected: "Защищённых Пользователей",
    accuracy: "Точность ИИ",
    fraudsPrevented: "Предотвращено Мошенничеств",
    heroTitle: "Перед покупкой, Проверьте.",
    heroTitleAccent: "Мгновенно.",
    heroSubtitle: "Наш ИИ анализирует более 50 источников данных за секунды, чтобы сказать вам, безопасен ли сайт.",
    placeholder: "Введите URL или название бренда",
    verifyButton: "Проверить Сейчас — Бесплатно",
    verifying: "ИИ анализирует...",
    verifiedBy: "Доверяют более 3,1М пользователей по всему миру",
    analysisInProgress: "Анализ Выполняется",
    checkingDomain: "Проверка домена и SSL сертификатов...",
    consultingComplaints: "Запрос глобальной базы жалоб...",
    analyzingReputation: "ИИ анализирует онлайн репутацию...",
    crossChecking: "Перекрёстная проверка 50+ источников...",
    trustIndex: "Индекс Доверия",
    analysisTime: "Время Анализа",
    complaintsFound: "жалоб за последние 30 дней",
    completeReport: "Посмотреть Полный Отчёт",
    shareWhatsApp: "Поделиться в WhatsApp",
    newVerification: "Новая Проверка",
    sslCertificate: "SSL/TLS Сертификат",
    domainInfo: "Информация о Домене (WHOIS)",
    reclameAqui: "Отчёты Потребителей",
    socialNetworks: "Присутствие в Соцсетях",
    trustPilot: "TrustPilot",
    googleResults: "Топ 10 Результатов Google",
    present: "Есть:", valid: "Действителен:", validFrom: "С:", validTo: "До:", issuer: "Издатель:", yes: "Да", no: "Нет",
    unlockReport: "🔓 Разблокировать Полный Отчёт",
    unlockReportDesc: "Получить все детали анализа безопасности",
    whatYouGet: "Что вы увидите:",
    detailedSSL: "Детальный SSL сертификат",
    completeWHOIS: "Полная информация WHOIS",
    reclameAquiHistory: "Полная история жалоб",
    socialAnalysis: "Анализ социальных сетей",
    trustPilotReviews: "Отзывы TrustPilot",
    googleTop10: "Топ 10 Google",
    unlockOneTime: "Разблокировать за $29.90 (разово)",
    orSubscribe: "Или подписка за $12/месяц",
    maybeLater: "Не сейчас",
    pricingTitle: "Полная Защита для Каждой Потребности",
    pricingSubtitle: "Миллионы людей выбирают Fraudara для онлайн-безопасности.",
    mostPopular: "САМЫЙ ПОПУЛЯРНЫЙ",
    bestValue: "ЛУЧШАЯ ЦЕНА",
    planFree: "Бесплатно", planStarter: "Стартер", planPro: "Про", planBusiness: "Бизнес",
    freePeriod: "навсегда", monthly: "/месяц", yearly: "/год",
    continueFreePlan: "Продолжить бесплатно",
    upgradePlan: "Начать сейчас",
    guarantee: "Гарантия возврата денег 30 дней",
    featureUnlimited: "Неограниченные проверки",
    featureReports: "Полные отчёты",
    featureMonitoring: "Мониторинг 24/7",
    featureAlerts: "Уведомления в реальном времени",
    featurePriority: "Приоритетная поддержка",
    featureAPI: "Доступ к API",
    featureWhatsapp: "Уведомления WhatsApp",
    featureCustom: "Персональные анализы",
    consultationsExhausted: "Бесплатные Проверки Исчерпаны",
    consultationsExhaustedDesc: "Вы использовали все 5 бесплатных проверок. Оставайтесь под защитой с неограниченным доступом:",
    unlimitedAccess: "Неограниченный Доступ — $29.90",
    premiumMonthly: "Премиум — $12/месяц",
    back: "Назад",
    footerTagline: "Защищаем миллионы людей от онлайн-мошенничества.",
    footerProduct: "Продукт", footerCompany: "Компания", footerSupport: "Поддержка", footerLegal: "Правовое",
    footerHowItWorks: "Как это работает", footerPricing: "Цены", footerAPI: "API для бизнеса",
    footerAbout: "О нас", footerCreator: "О создателе", footerBlog: "Блог",
    footerHelp: "Центр помощи", footerContact: "Контакт", footerReport: "Сообщить о мошенничестве",
    footerPrivacy: "Конфиденциальность", footerTerms: "Условия использования", footerCookies: "Cookies",
    footerCopyright: "© 2026 Fraudara. Все права защищены.",
    footerDisclaimer: "Образовательный инструмент для цифровой безопасности.",
    footerEmail: "contactfraudara@gmail.com",
    footerMadeWith: "Создано с 🛡️ для защиты мира",
    creatorTitle: "О Создателе",
    creatorName: "Pablo Eduardo",
    creatorBio: "Цифровой предприниматель и разработчик приложений/игр на протяжении 11+ лет. Эксперт в цифровом маркетинге, искусственном интеллекте, копирайтинге и вирусном распространении контента. Создатель нескольких успешных цифровых бизнесов и вирусных проектов по всему миру.",
    creatorRole: "Основатель и CEO Fraudara",
    safeAlternative: "✅ 100% Безопасная Альтернатива",
    amazonDesc: "Крупнейший e-commerce мира с полной гарантией",
    upTo70Off: "До 70% СКИДКИ",
    totalSecurity: "Полная Безопасность", totalSecurityDesc: "Шифрование банковского уровня",
    freeVerification: "Бесплатная Проверка", freeVerificationDesc: "5 проверок без регистрации",
    alwaysUpdated: "Всегда Актуально", alwaysUpdatedDesc: "База данных 24/7 в реальном времени",
    howItWorks: "Как Это Работает",
    stepStep: "ШАГ",
    step1Title: "Введите сайт или бренд", step1Desc: "Вставьте URL или введите название компании",
    step2Title: "Наш ИИ анализирует всё", step2Desc: "Проверяем 50+ источников данных за секунды",
    step3Title: "Мгновенный результат", step3Desc: "Получите полный отчёт с индексом доверия",
    testimonials: "Что говорят наши пользователи",
  },

  hi: {
    title: "Fraudara",
    subtitle: "विश्व का #1 धोखाधड़ी रक्षक प्लेटफ़ॉर्म",
    tagline: "सेकंडों में ऑनलाइन घोटालों से खुद को बचाएं",
    secure: "100% सुरक्षित",
    instantVerification: "तत्काल सत्यापन",
    consultationsLeft: "मुफ़्त जांच शेष",
    freeBadge: "मुफ़्त",
    specialOffer: "🔥 सीमित प्रस्ताव",
    premiumProtection: "प्रीमियम एक्सेस केवल $12/माह में",
    guaranteeNow: "अभी पाएं",
    sitesVerified: "सत्यापित साइटें",
    usersProtected: "संरक्षित उपयोगकर्ता",
    accuracy: "AI सटीकता",
    fraudsPrevented: "रोकी गई धोखाधड़ी",
    heroTitle: "खरीदने से पहले, सत्यापित करें।",
    heroTitleAccent: "तुरंत।",
    heroSubtitle: "हमारी AI सेकंडों में 50+ डेटा स्रोतों का विश्लेषण करती है और बताती है कि साइट सुरक्षित है या नहीं।",
    placeholder: "URL या ब्रांड नाम दर्ज करें",
    verifyButton: "अभी सत्यापित करें — मुफ़्त",
    verifying: "AI विश्लेषण कर रही है...",
    verifiedBy: "3.1M+ उपयोगकर्ताओं का भरोसा",
    analysisInProgress: "विश्लेषण जारी",
    checkingDomain: "डोमेन और SSL प्रमाणपत्र जांच रहे हैं...",
    consultingComplaints: "वैश्विक शिकायत डेटाबेस से परामर्श...",
    analyzingReputation: "AI ऑनलाइन प्रतिष्ठा का विश्लेषण कर रही है...",
    crossChecking: "50+ डेटा स्रोतों की जांच हो रही है...",
    trustIndex: "विश्वास सूचकांक",
    analysisTime: "विश्लेषण समय",
    complaintsFound: "पिछले 30 दिनों में शिकायतें",
    completeReport: "पूरी रिपोर्ट देखें",
    shareWhatsApp: "WhatsApp पर साझा करें",
    newVerification: "नया सत्यापन",
    sslCertificate: "SSL/TLS प्रमाणपत्र",
    domainInfo: "डोमेन जानकारी (WHOIS)",
    reclameAqui: "उपभोक्ता रिपोर्ट",
    socialNetworks: "सोशल मीडिया उपस्थिति",
    trustPilot: "TrustPilot",
    googleResults: "Google के शीर्ष 10 परिणाम",
    present: "उपस्थित:", valid: "वैध:", validFrom: "से वैध:", validTo: "तक वैध:", issuer: "जारीकर्ता:", yes: "हाँ", no: "नहीं",
    unlockReport: "🔓 पूरी रिपोर्ट अनलॉक करें",
    unlockReportDesc: "सभी सुरक्षा विश्लेषण विवरण एक्सेस करें",
    whatYouGet: "आप क्या देखेंगे:",
    detailedSSL: "विस्तृत SSL प्रमाणपत्र",
    completeWHOIS: "पूर्ण WHOIS जानकारी",
    reclameAquiHistory: "शिकायत इतिहास",
    socialAnalysis: "सोशल मीडिया विश्लेषण",
    trustPilotReviews: "TrustPilot समीक्षाएं",
    googleTop10: "Google के शीर्ष 10 परिणाम",
    unlockOneTime: "$29.90 में अनलॉक करें (एकबार)",
    orSubscribe: "या $12/माह में सदस्यता",
    maybeLater: "अभी नहीं",
    pricingTitle: "हर जरूरत के लिए पूर्ण सुरक्षा",
    pricingSubtitle: "लाखों लोग ऑनलाइन सुरक्षित रहने के लिए Fraudara चुनते हैं।",
    mostPopular: "सबसे लोकप्रिय",
    bestValue: "सर्वोत्तम मूल्य",
    planFree: "मुफ़्त", planStarter: "स्टार्टर", planPro: "प्रो", planBusiness: "बिजनेस",
    freePeriod: "हमेशा के लिए", monthly: "/माह", yearly: "/वर्ष",
    continueFreePlan: "मुफ़्त में जारी रखें",
    upgradePlan: "अभी शुरू करें",
    guarantee: "30 दिन की मनी-बैक गारंटी",
    featureUnlimited: "असीमित सत्यापन",
    featureReports: "पूर्ण रिपोर्ट",
    featureMonitoring: "24/7 निगरानी",
    featureAlerts: "रियल-टाइम अलर्ट",
    featurePriority: "प्राथमिकता सहायता",
    featureAPI: "API एक्सेस",
    featureWhatsapp: "WhatsApp अलर्ट",
    featureCustom: "कस्टम विश्लेषण",
    consultationsExhausted: "मुफ़्त जांच समाप्त",
    consultationsExhaustedDesc: "आपने 5 मुफ़्त जांचें उपयोग कर लीं। असीमित एक्सेस से सुरक्षित रहें:",
    unlimitedAccess: "असीमित एक्सेस — $29.90",
    premiumMonthly: "प्रीमियम — $12/माह",
    back: "वापस",
    footerTagline: "लाखों लोगों को ऑनलाइन धोखाधड़ी से बचाते हैं।",
    footerProduct: "उत्पाद", footerCompany: "कंपनी", footerSupport: "सहायता", footerLegal: "कानूनी",
    footerHowItWorks: "यह कैसे काम करता है", footerPricing: "मूल्य निर्धारण", footerAPI: "व्यवसाय API",
    footerAbout: "हमारे बारे में", footerCreator: "संस्थापक के बारे में", footerBlog: "ब्लॉग",
    footerHelp: "सहायता केंद्र", footerContact: "संपर्क", footerReport: "धोखाधड़ी रिपोर्ट करें",
    footerPrivacy: "गोपनीयता", footerTerms: "उपयोग की शर्तें", footerCookies: "Cookies",
    footerCopyright: "© 2026 Fraudara. सर्वाधिकार सुरक्षित।",
    footerDisclaimer: "डिजिटल सुरक्षा जागरूकता के लिए शैक्षिक उपकरण।",
    footerEmail: "contactfraudara@gmail.com",
    footerMadeWith: "🛡️ के साथ दुनिया की रक्षा के लिए बनाया गया",
    creatorTitle: "संस्थापक के बारे में",
    creatorName: "Pablo Eduardo",
    creatorBio: "11+ वर्षों से डिजिटल उद्यमी और ऐप/गेम डेवलपर। डिजिटल मार्केटिंग, आर्टिफिशियल इंटेलिजेंस, कॉपीराइटिंग और ऑनलाइन वायरलाइजेशन के विशेषज्ञ। दुनिया भर में कई सफल डिजिटल व्यवसायों और वायरल परियोजनाओं के निर्माता।",
    creatorRole: "Fraudara के संस्थापक और CEO",
    safeAlternative: "✅ 100% सुरक्षित विकल्प",
    amazonDesc: "पूर्ण गारंटी के साथ दुनिया का सबसे बड़ा ई-कॉमर्स",
    upTo70Off: "70% तक छूट",
    totalSecurity: "संपूर्ण सुरक्षा", totalSecurityDesc: "बैंक-स्तरीय एन्क्रिप्शन",
    freeVerification: "मुफ़्त सत्यापन", freeVerificationDesc: "बिना पंजीकरण 5 जांचें",
    alwaysUpdated: "हमेशा अपडेट", alwaysUpdatedDesc: "24/7 रियल-टाइम डेटाबेस",
    howItWorks: "यह कैसे काम करता है",
    stepStep: "चरण",
    step1Title: "साइट या ब्रांड दर्ज करें", step1Desc: "URL चिपकाएं या कंपनी का नाम टाइप करें",
    step2Title: "हमारी AI सब कुछ विश्लेषण करती है", step2Desc: "सेकंडों में 50+ डेटा स्रोत जांचते हैं",
    step3Title: "तत्काल परिणाम", step3Desc: "विश्वास सूचकांक के साथ पूरी रिपोर्ट प्राप्त करें",
    testimonials: "हमारे उपयोगकर्ता क्या कहते हैं",
  },

  it: {
    title: "Fraudara",
    subtitle: "Il Verificatore Anti-Frode #1 al Mondo",
    tagline: "Proteggiti dalle truffe in pochi secondi",
    secure: "100% Sicuro",
    instantVerification: "Verifica Istantanea",
    consultationsLeft: "verifiche gratuite rimanenti",
    freeBadge: "GRATIS",
    specialOffer: "🔥 OFFERTA LIMITATA",
    premiumProtection: "Accesso Premium per soli €12/mese",
    guaranteeNow: "OTTIENI ORA",
    sitesVerified: "Siti Verificati",
    usersProtected: "Utenti Protetti",
    accuracy: "Precisione IA",
    fraudsPrevented: "Truffe Prevenute",
    heroTitle: "Prima di Acquistare, Verifica.",
    heroTitleAccent: "Istantaneamente.",
    heroSubtitle: "La nostra IA analizza oltre 50 fonti di dati in secondi per dirti se un sito è sicuro o meno.",
    placeholder: "Inserisci URL o nome del marchio",
    verifyButton: "Verifica Ora — È Gratuito",
    verifying: "IA in analisi...",
    verifiedBy: "Scelto da oltre 3,1M di utenti",
    analysisInProgress: "Analisi in Corso",
    checkingDomain: "Verifica dominio e certificati SSL...",
    consultingComplaints: "Consultazione database globale reclami...",
    analyzingReputation: "IA analizza reputazione online...",
    crossChecking: "Incrocio dati da 50+ fonti...",
    trustIndex: "Indice di Fiducia",
    analysisTime: "Tempo di Analisi",
    complaintsFound: "reclami negli ultimi 30 giorni",
    completeReport: "Visualizza Rapporto Completo",
    shareWhatsApp: "Condividi su WhatsApp",
    newVerification: "Nuova Verifica",
    sslCertificate: "Certificato SSL/TLS",
    domainInfo: "Informazioni Dominio (WHOIS)",
    reclameAqui: "Rapporti Consumatori",
    socialNetworks: "Presenza sui Social Media",
    trustPilot: "TrustPilot",
    googleResults: "Top 10 Risultati Google",
    present: "Presente:", valid: "Valido:", validFrom: "Valido da:", validTo: "Valido fino a:", issuer: "Emittente:", yes: "Sì", no: "No",
    unlockReport: "🔓 Sblocca Rapporto Completo",
    unlockReportDesc: "Accedi a tutti i dettagli dell'analisi di sicurezza",
    whatYouGet: "Cosa vedrai:",
    detailedSSL: "Certificato SSL dettagliato",
    completeWHOIS: "WHOIS completo con date",
    reclameAquiHistory: "Storico reclami completo",
    socialAnalysis: "Analisi social media",
    trustPilotReviews: "Recensioni TrustPilot",
    googleTop10: "Top 10 risultati Google",
    unlockOneTime: "Sblocca per €29,90 (una volta)",
    orSubscribe: "O abbonati per €12/mese",
    maybeLater: "Non ora",
    pricingTitle: "Protezione Completa per Ogni Esigenza",
    pricingSubtitle: "Milioni di persone scelgono Fraudara per stare al sicuro online.",
    mostPopular: "PIÙ POPOLARE",
    bestValue: "MIGLIOR VALORE",
    planFree: "Gratuito", planStarter: "Starter", planPro: "Pro", planBusiness: "Business",
    freePeriod: "per sempre", monthly: "/mese", yearly: "/anno",
    continueFreePlan: "Continua gratuitamente",
    upgradePlan: "Inizia ora",
    guarantee: "Garanzia rimborso 30 giorni",
    featureUnlimited: "Verifiche illimitate",
    featureReports: "Rapporti completi",
    featureMonitoring: "Monitoraggio 24/7",
    featureAlerts: "Avvisi in tempo reale",
    featurePriority: "Supporto prioritario",
    featureAPI: "Accesso API",
    featureWhatsapp: "Avvisi WhatsApp",
    featureCustom: "Analisi personalizzate",
    consultationsExhausted: "Verifiche Gratuite Esaurite",
    consultationsExhaustedDesc: "Hai usato le tue 5 verifiche gratuite. Rimani protetto con accesso illimitato:",
    unlimitedAccess: "Accesso Illimitato — €29,90",
    premiumMonthly: "Premium — €12/mese",
    back: "Indietro",
    footerTagline: "Proteggendo milioni di persone dalle frodi online.",
    footerProduct: "Prodotto", footerCompany: "Azienda", footerSupport: "Supporto", footerLegal: "Legale",
    footerHowItWorks: "Come funziona", footerPricing: "Prezzi", footerAPI: "API per aziende",
    footerAbout: "Chi siamo", footerCreator: "Il creatore", footerBlog: "Blog",
    footerHelp: "Centro assistenza", footerContact: "Contatto", footerReport: "Segnala una frode",
    footerPrivacy: "Privacy", footerTerms: "Termini d'uso", footerCookies: "Cookie",
    footerCopyright: "© 2026 Fraudara. Tutti i diritti riservati.",
    footerDisclaimer: "Strumento educativo per la consapevolezza della sicurezza digitale.",
    footerEmail: "contactfraudara@gmail.com",
    footerMadeWith: "Fatto con 🛡️ per proteggere il mondo",
    creatorTitle: "Il Creatore",
    creatorName: "Pablo Eduardo",
    creatorBio: "Imprenditore digitale e sviluppatore di app e giochi da oltre 11 anni. Esperto di marketing digitale, intelligenza artificiale, copywriting e viralizzazione online. Creatore di molteplici aziende digitali di successo e progetti virali in tutto il mondo.",
    creatorRole: "Fondatore & CEO di Fraudara",
    safeAlternative: "✅ Alternativa 100% Sicura",
    amazonDesc: "Il più grande e-commerce del mondo con garanzia totale",
    upTo70Off: "Fino al 70% DI SCONTO",
    totalSecurity: "Sicurezza Totale", totalSecurityDesc: "Crittografia livello bancario",
    freeVerification: "Verifica Gratuita", freeVerificationDesc: "5 verifiche senza registrazione",
    alwaysUpdated: "Sempre Aggiornato", alwaysUpdatedDesc: "Database in tempo reale 24/7",
    howItWorks: "Come Funziona",
    stepStep: "PASSO",
    step1Title: "Inserisci il sito o marchio", step1Desc: "Incolla l'URL o digita il nome dell'azienda",
    step2Title: "La nostra IA analizza tutto", step2Desc: "Verifichiamo 50+ fonti di dati in secondi",
    step3Title: "Risultato istantaneo", step3Desc: "Ricevi un rapporto completo con indice di fiducia",
    testimonials: "Cosa dicono i nostri utenti",
  },
};

// ─── HOOK: LANGUAGE ──────────────────────────────────────────────
const useLanguage = () => {
  const [language, setLanguage] = useState('pt');

  useEffect(() => {
    const saved = localStorage.getItem('fraudara_language');
    if (saved && translations[saved]) { setLanguage(saved); return; }
    const bl = navigator.language.toLowerCase();
    let d = 'pt';
    if (bl.startsWith('en')) d = 'en';
    else if (bl.startsWith('es')) d = 'es';
    else if (bl.startsWith('zh') || bl.startsWith('cn')) d = 'zh';
    else if (bl.startsWith('fr')) d = 'fr';
    else if (bl.startsWith('de')) d = 'de';
    else if (bl.startsWith('ar')) d = 'ar';
    else if (bl.startsWith('ja')) d = 'ja';
    else if (bl.startsWith('ru')) d = 'ru';
    else if (bl.startsWith('hi')) d = 'hi';
    else if (bl.startsWith('it')) d = 'it';
    setLanguage(d);
  }, []);

  const changeLanguage = (l: string) => {
    setLanguage(l);
    localStorage.setItem('fraudara_language', l);
  };

  const t = (key: string) => translations[language]?.[key] || translations.pt[key] || key;
  const isBR = language === 'pt';

  return { language, changeLanguage, t, isBR };
};

// ─── LANGUAGE SELECTOR ───────────────────────────────────────────
const LANGS = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

const LanguageSelector = ({ language, onLanguageChange }: { language: string; onLanguageChange: (l: string) => void }) => {
  const [open, setOpen] = useState(false);
  const cur = LANGS.find(l => l.code === language) || LANGS[0];
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all">
        <Globe className="w-4 h-4" />
        <span>{cur.flag} {cur.name.split(' ')[0]}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 w-52 max-h-72 overflow-y-auto py-2">
            {LANGS.map(l => (
              <button key={l.code} onClick={() => { onLanguageChange(l.code); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-sm ${language === l.code ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-700'}`}>
                <span className="text-base">{l.flag}</span>
                <span>{l.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── PRICING DATA ────────────────────────────────────────────────
const getPricingPlans = (t: (k: string) => string, isBR: boolean) => [
  {
    id: 'unlimited',
    name: t('planStarter'),
    price: isBR ? 'R$ 29,90' : '$29.90',
    period: t('freePeriod'),
    badge: null,
    color: 'border-gray-200',
    btnClass: 'bg-gray-900 hover:bg-gray-800 text-white',
    features: [
      t('featureUnlimited'),
      t('featureReports'),
      t('detailedSSL'),
      t('completeWHOIS'),
      'Email ' + t('footerSupport'),
    ],
    cta: t('upgradePlan'),
  },
  {
    id: 'premium',
    name: t('planPro'),
    price: isBR ? 'R$ 12' : '$12',
    originalPrice: isBR ? 'R$ 17' : '$17',
    period: t('monthly'),
    badge: t('mostPopular'),
    color: 'border-blue-500',
    btnClass: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-200',
    features: [
      t('featureUnlimited'),
      t('featureReports'),
      t('featureMonitoring'),
      t('featureAlerts'),
      t('featureWhatsapp'),
      t('featurePriority'),
    ],
    cta: t('upgradePlan'),
    savings: '29% OFF',
  },
  {
    id: 'annual',
    name: t('planBusiness'),
    price: isBR ? 'R$ 99' : '$99',
    originalPrice: isBR ? 'R$ 144' : '$144',
    period: t('yearly'),
    badge: t('bestValue'),
    color: 'border-emerald-500',
    btnClass: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-200',
    features: [
      t('featureUnlimited'),
      t('featureReports'),
      t('featureMonitoring'),
      t('featureAlerts'),
      t('featureWhatsapp'),
      t('featureAPI'),
      t('featureCustom'),
      t('featurePriority'),
    ],
    cta: t('upgradePlan'),
    savings: isBR ? 'Economize R$45' : 'Save $45',
  },
];

// ─── TESTIMONIALS ────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Sarah K.", location: "London, UK", flag: "🇬🇧", text: "Used it before buying from an unfamiliar online store. The AI caught 12 red flags instantly. Total lifesaver!", stars: 5 },

  { name: "Carlos M.", location: "Buenos Aires, AR", flag: "🇦🇷", text: "Increíble herramienta. Verifiqué 3 tiendas sospechosas y todas salieron como peligrosas. Imprescindible.", stars: 5 },
  
  { name: "Mariana S.", location: "São Paulo, BR", flag: "🇧🇷", text: "Salvou minha vida! Ia cair num golpe de R$2.800. Fraudara apontou que o site tinha só 3 dias de existência.", stars: 5 }, 
  
  { name: "Liu W.", location: "Shanghai, CN", flag: "🇨🇳", text: "非常好用！在网购之前总会用Fraudara检查，已经帮我避免了多次诈骗。强烈推荐！", stars: 5 },
  { name: "Ahmad R.", location: "Dubai, AE", flag: "🇦🇪", text: "أداة رائعة! كشفت عن موقع احتيالي كنت على وشك الشراء منه. أنقذت مالي!", stars: 5 },
  { name: "Yuki T.", location: "Tokyo, JP", flag: "🇯🇵", text: "素晴らしいツール！詐欺サイトを即座に検出してくれます。毎回使っています。", stars: 5 },
];

// ─── MAIN APP ─────────────────────────────────────────────────────
export default function App() {
  const { language, changeLanguage, t, isBR } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [freeSearches, setFreeSearches] = useState(5);
  const [isPremium, setIsPremium] = useState(false);
  const [hasUnlimitedAccess, setHasUnlimitedAccess] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const isUnlocked = isPremium || hasUnlimitedAccess;
  const pricingPlans = getPricingPlans(t, isBR);

  useEffect(() => {
    const s = localStorage.getItem('fraudara_searches');
    const p = localStorage.getItem('fraudara_premium');
    const u = localStorage.getItem('fraudara_unlimited');
    if (s) setFreeSearches(parseInt(s));
    if (p === 'true') setIsPremium(true);
    if (u === 'true') setHasUnlimitedAccess(true);

    const path = window.location.pathname;
    if (path === '/premium-ativar') { setIsPremium(true); localStorage.setItem('fraudara_premium', 'true'); window.location.href = '/'; }
    if (path === '/unlimited-ativar') { setHasUnlimitedAccess(true); localStorage.setItem('fraudara_unlimited', 'true'); window.location.href = '/'; }
    if (path === '/annual-ativar') { setIsPremium(true); localStorage.setItem('fraudara_premium', 'true'); window.location.href = '/'; }

    const timer = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const handleVerification = async () => {
    if (!searchQuery.trim()) return;
    if (!isUnlocked && freeSearches <= 0) { setShowUpgradeModal(true); return; }

    setIsVerifying(true);
    document
    .getElementById('main-content')
    ?.scrollIntoView({ behavior: 'smooth' });
    setResult(null);
    setShowDetails(false);

    try {
      const resp = await fetch('/.netlify/functions/verificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, language }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Falha na verificação');

      let ts = data.trustScore || 75;
      if (data.status === 'safe' && ts < 75) ts = Math.max(75, ts + 15);
      else if (data.status === 'danger' && ts > 40) ts = Math.min(40, ts - 10);
      else if (data.status === 'suspicious') ts = Math.max(40, Math.min(74, ts));

      setResult({ ...data, trustScore: ts });

      if (!isUnlocked) {
        const n = Math.max(0, freeSearches - 1);
        setFreeSearches(n);
        localStorage.setItem('fraudara_searches', n.toString());
      }
    } catch {
      setResult({
        status: 'suspicious',
        title: '⚠️ VERIFICAÇÃO PARCIAL',
        message: 'Não foi possível concluir toda a análise. Recomendamos cautela e verificação adicional.',
        complaints: 0, trustScore: 50, verificationTime: '—',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleShare = () => {
    if (!result) return;
    const emoji = result.status === 'safe' ? '✅' : result.status === 'suspicious' ? '⚠️' : '🚨';
    const msg = `${emoji} *Fraudara verificou: ${searchQuery}*\n\n📊 ${result.title}\n\n${result.message}\n\n🛡️ Verifique você também: ${window.location.href}\n\n_Fraudara — Proteção Global Contra Fraudes_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleUpgrade = (plan: string) => {
    const urls: Record<string, string> = {
      unlimited: 'https://app.pushinpay.com.br/service/pay/9fa65fca-27da-4b61-b44b-3650e52c52f2',
      premium: 'https://app.pushinpay.com.br/service/pay/9fa66120-1b0d-4b0d-aafc-65784e333b2d',
      annual: 'https://app.pushinpay.com.br/service/pay/9fa6663e-a37d-4ba4-b042-f0e81df19aa9',
    };
    if (urls[plan]) window.location.href = urls[plan];
  };

  const statusConfig = {
    safe: {
      icon: <CheckCircle className="w-14 h-14 text-emerald-500" />,
      border: 'border-emerald-400',
      bg: 'from-emerald-50 to-teal-50',
      badge: 'bg-emerald-100 text-emerald-800',
      bar: 'bg-emerald-500',
      scoreColor: 'text-emerald-600',
    },
    suspicious: {
      icon: <AlertTriangle className="w-14 h-14 text-amber-500" />,
      border: 'border-amber-400',
      bg: 'from-amber-50 to-orange-50',
      badge: 'bg-amber-100 text-amber-800',
      bar: 'bg-amber-500',
      scoreColor: 'text-amber-600',
    },
    danger: {
      icon: <XCircle className="w-14 h-14 text-red-500" />,
      border: 'border-red-400',
      bg: 'from-red-50 to-rose-50',
      badge: 'bg-red-100 text-red-800',
      bar: 'bg-red-500',
      scoreColor: 'text-red-600',
    },
  };
  const cfg = result ? statusConfig[result.status] : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── ANNOUNCEMENT BAR ── */}
      {!isUnlocked && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white text-center py-2.5 px-4 text-sm">
          <span className="font-semibold">{t('specialOffer')}</span>{' '}
          {t('premiumProtection')}{' '}
          <button onClick={() => setShowPricingModal(true)}
            className="underline underline-offset-2 font-bold hover:no-underline ml-1">
            {t('guaranteeNow')} →
          </button>
        </div>
      )}

      {/* ── HEADER ── */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Nav */}
          <div className="flex items-center justify-between py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-blue-900/40">
                <img src="/Fraudara_Logo1.png" alt="Fraudara" className="w-full h-full object-contain bg-blue-600" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight">Fraudara</span>
                <span className="ml-2 text-xs bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full font-medium">
                  {t('freeBadge')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isUnlocked && (
                <button onClick={() => setShowPricingModal(true)}
                  className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                  <Crown className="w-4 h-4 text-amber-400" />
                  Premium
                </button>
              )}
              <LanguageSelector language={language} onLanguageChange={changeLanguage} />
            </div>
          </div>

          {/* Hero */}
          <div className="py-16 md:py-24 text-center max-w-4xl mx-auto">
            
            
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-blue-100 mb-8"> <div className="flex -space-x-1"> {['🇧🇷','🇺🇸','🇨🇳','🇮🇳','🇷🇺'].map((f,i) => <span key={i} className="text-base">{f}</span>)} </div> <span className="font-medium">{t('verifiedBy')}</span> </div>

            

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
              <span className="text-white">{t('heroTitle')}</span>
              {' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {t('heroTitleAccent')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('heroSubtitle')}
            </p>

            {/* Search box */}
            <div className="bg-white rounded-2xl shadow-2xl shadow-black/30 p-2 max-w-2xl mx-auto mb-6">
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={t('placeholder')}
                    onKeyDown={e => e.key === 'Enter' && handleVerification()}
                    className="flex-1 py-4 text-gray-900 placeholder-gray-400 outline-none text-base font-medium bg-transparent"
                  />
                </div>
                <button onClick={handleVerification} disabled={!searchQuery.trim() || isVerifying} className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold px-6 py-4 rounded-xl transition-all flex items-center gap-2 text-sm">
                  {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                  <span className="hidden sm:inline">{isVerifying ? t('verifying') : t('verifyButton')}</span>
                  <span className="sm:hidden">{isVerifying ? '...' : t('freeBadge')}</span>
                </button>
              </div>
            </div>

            {/* Free counter */}
            {!isUnlocked && (
              <p className="text-blue-200 text-sm">
                <Gift className="w-4 h-4 inline mr-1" />
                {freeSearches} {t('consultationsLeft')}
              </p>
            )}
            {isUnlocked && (
              <p className="text-emerald-400 text-sm font-semibold">
                <Infinity className="w-4 h-4 inline mr-1" />
                {language === 'pt' ? 'Acesso ilimitado ativo' : 'Unlimited access active'}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* ── STATS BAR ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Shield className="w-5 h-5 text-blue-600" />, value: '7.2M+', label: t('sitesVerified') },
              { icon: <Users className="w-5 h-5 text-emerald-600" />, value: '3.1M+', label: t('usersProtected') },
              { icon: <BadgeCheck className="w-5 h-5 text-violet-600" />, value: '99.8%', label: t('accuracy') },
              { icon: <TrendingUp className="w-5 h-5 text-orange-500" />, value: '$173M', label: t('fraudsPrevented') },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">{s.icon}</div>
                <div>
                  <div className="text-xl font-black text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-500 font-medium">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main id="main-content" className="max-w-3xl mx-auto px-4 py-12">

        {/* LOADING STATE */}
        {isVerifying && (
          <div id="verifying-true" className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-50" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <Cpu className="w-10 h-10 text-blue-600 animate-pulse" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('analysisInProgress')}</h3>
            <div className="space-y-3 text-sm text-gray-500 max-w-xs mx-auto">
              {[t('checkingDomain'), t('consultingComplaints'), t('analyzingReputation'), t('crossChecking')].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULT CARD */}
        {result && !isVerifying && cfg && (
          <div className={`bg-gradient-to-br ${cfg.bg} rounded-3xl border-2 ${cfg.border} shadow-xl p-8 mb-8`}>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">{cfg.icon}</div>
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">{result.title}</h3>
              <p className="text-base text-gray-700 leading-relaxed max-w-lg mx-auto">{result.message}</p>
            </div>

            {/* Metrics */}
            <div className="bg-white/70 backdrop-blur rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-600">{t('trustIndex')}</span>
                <span className={`text-3xl font-black ${cfg.scoreColor}`}>{result.trustScore}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${cfg.bar} rounded-full transition-all duration-1000`}
                  style={{ width: `${result.trustScore}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0%</span>
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-3 h-3" />
                  {result.verificationTime}
                </div>
                <span>100%</span>
              </div>
              {result.complaints > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-center">
                  <p className="text-red-700 font-bold text-sm">
                    ⚠️ {result.complaints} {t('complaintsFound')}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {/* View Report */}
              {(result.ssl || result.whois || result.reclameAqui || result.googleResults?.length || result.social || result.trustPilot) && (
                <button onClick={() => isUnlocked ? setShowDetails(!showDetails) : setShowPaywall(true)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition-all text-sm">
                  <FileText className="w-4 h-4" />
                  {t('completeReport')}
                  {!isUnlocked && <Lock className="w-3.5 h-3.5 ml-1 text-gray-400" />}
                </button>
              )}

              <div className="flex gap-3"> <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all text-sm"> <Share2 className="w-4 h-4" /> {t('shareWhatsApp')} </button> <button onClick={() => { setResult(null); setSearchQuery(''); setShowDetails(false); inputRef.current?.focus(); }} className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl border border-gray-200 transition-all text-sm"> <RefreshCw className="w-4 h-4" /> {t('newVerification')} </button> </div>
            </div>

            {/* Detailed Report */}
            {showDetails && isUnlocked && (
              <div className="mt-6 space-y-4">
                <div className="h-px bg-gray-200" />

                {result.ssl && (
                  <DetailSection icon={<Lock className="w-4 h-4 text-blue-600" />} title={t('sslCertificate')}>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <Kv label={t('present')} val={result.ssl.present ? '✅' : '❌'} />
                      <Kv label={t('valid')} val={result.ssl.validNow ? '✅' : '❌'} />
                      <Kv label={t('validFrom')} val={result.ssl.validFrom || '—'} />
                      <Kv label={t('validTo')} val={result.ssl.validTo || '—'} />
                      <Kv label={t('issuer')} val={result.ssl.issuer?.CN || '—'} span />
                    </div>
                  </DetailSection>
                )}

                {result.whois && (
                  <DetailSection icon={<Search className="w-4 h-4 text-emerald-600" />} title={t('domainInfo')}>
                    <p className="text-sm text-gray-700">
                      {result.whois.hasData ? `✅ ${language === 'pt' ? 'Dados disponíveis' : 'Data available'}` : `❌ ${language === 'pt' ? 'Dados não disponíveis' : 'Data not available'}`}
                    </p>
                  </DetailSection>
                )}

                {result.reclameAqui && (
                  <DetailSection icon={<AlertTriangle className="w-4 h-4 text-orange-500" />} title={t('reclameAqui')}>
                    {result.reclameAqui.found ? (
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-3">
                          <Kv label="Score RA" val={result.reclameAqui.score ?? '—'} />
                          <Kv label={language === 'pt' ? 'Total' : 'Total'} val={result.reclameAqui.totalComplaints ?? '—'} />
                          <Kv label={language === 'pt' ? 'Últimos 30 dias' : 'Last 30 days'} val={result.reclameAqui.last30d ?? '—'} />
                          <Kv label="Status" val={result.reclameAqui.verified ? '✅ Verificada' : '—'} />
                        </div>
                        {result.reclameAqui.companyLink && (
                          <a href={result.reclameAqui.companyLink} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:underline text-xs mt-2">
                            <ExternalLink className="w-3.5 h-3.5" />
                            {language === 'pt' ? 'Ver no Reclame Aqui' : 'View page'}
                          </a>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">{language === 'pt' ? 'Empresa não encontrada.' : 'Company not found.'}</p>
                    )}
                  </DetailSection>
                )}

                {result.social && (
                  <DetailSection icon={<Users className="w-4 h-4 text-violet-600" />} title={t('socialNetworks')}>
                    <div className="text-sm space-y-1.5">
                      <Kv label={language === 'pt' ? 'Menções' : 'Mentions'} val={result.social.mentions || 0} />
                      {result.social.instagram && <SocialLink href={result.social.instagram} label="Instagram" />}
                      {result.social.twitter && <SocialLink href={result.social.twitter} label="Twitter/X" />}
                      {result.social.linkedin && <SocialLink href={result.social.linkedin} label="LinkedIn" />}
                      {result.social.reddit && <SocialLink href={result.social.reddit} label="Reddit" />}
                    </div>
                  </DetailSection>
                )}

                {result.trustPilot?.found && (
                  <DetailSection icon={<Star className="w-4 h-4 text-yellow-500" />} title={t('trustPilot')}>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <Kv label={language === 'pt' ? 'Nota' : 'Rating'} val={result.trustPilot.rating ? `${result.trustPilot.rating}/5 ⭐` : '—'} />
                      <Kv label={language === 'pt' ? 'Reviews' : 'Reviews'} val={result.trustPilot.reviewCount ?? '—'} />
                    </div>
                    <a href={result.trustPilot.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline text-xs mt-2">
                      <ExternalLink className="w-3.5 h-3.5" />
                      {language === 'pt' ? 'Ver no TrustPilot' : 'View on TrustPilot'}
                    </a>
                  </DetailSection>
                )}

                {result.googleResults && result.googleResults.length > 0 && (
                  <DetailSection icon={<Search className="w-4 h-4 text-red-500" />} title={t('googleResults')}>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {result.googleResults.slice(0, 10).map((r: any, i: number) => (
                        <div key={i} className="border-l-2 border-gray-200 pl-3">
                          <a href={r.link} target="_blank" rel="noopener noreferrer"
                            className="text-sm font-semibold text-blue-700 hover:underline line-clamp-1">
                            {i + 1}. {r.title}
                          </a>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{r.snippet}</p>
                        </div>
                      ))}
                    </div>
                  </DetailSection>
                )}
              </div>
            )}

            {/* Danger alternative */}
            {result.status === 'danger' && (
              <div className="mt-6 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  {t('safeAlternative')}
                </h4>
                <a href="https://amzn.to/4mujivi" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between bg-white p-4 rounded-xl border border-emerald-200 hover:border-emerald-400 transition-all group">
                  <div>
                    <div className="font-bold text-gray-900">Amazon</div>
                    <div className="text-sm text-gray-500">{t('amazonDesc')}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">{t('upTo70Off')}</span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
                  </div>
                </a>
              </div>
            )}
          </div>
        )}

        {/* HOW IT WORKS */}
        {!result && !isVerifying && (
          <>
            <div id="how-it-works" className="mb-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('howItWorks')}</h2>
              <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {[
                { num: '1', icon: <Search className="w-7 h-7 text-blue-600" />, title: t('step1Title'), desc: t('step1Desc') },
                { num: '2', icon: <Cpu className="w-7 h-7 text-indigo-600" />, title: t('step2Title'), desc: t('step2Desc') },
                { num: '3', icon: <BadgeCheck className="w-7 h-7 text-emerald-600" />, title: t('step3Title'), desc: t('step3Desc') },
              ].map((step, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all text-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    {step.icon}
                  </div>
                  <div className="text-xs font-bold text-gray-400 mb-1">{t('stepStep')} {step.num}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t('testimonials')}</h2>
              <div className="relative overflow-hidden">
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                  {TESTIMONIALS.map((tm, i) => (
                    <div key={i} className="flex-none w-72 snap-center bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                      <div className="flex mb-3">
                        {Array(tm.stars).fill(0).map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                      </div>
                      <p className="text-sm text-gray-700 mb-4 leading-relaxed">"{tm.text}"</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{tm.flag}</span>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{tm.name}</div>
                          <div className="text-xs text-gray-500">{tm.location}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-center text-white mb-8">
              <Crown className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
              <h3 className="text-2xl font-black mb-2">{t('pricingTitle')}</h3>
              <p className="text-blue-100 mb-6 text-sm">{t('pricingSubtitle')}</p>
              <button onClick={() => setShowPricingModal(true)}
                className="bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-all shadow-lg text-sm">
                {language === 'pt' ? 'Ver Planos →' : 'See Plans →'}
              </button>
            </div>
          </>
        )}
      </main>

      {/* ── PAYWALL MODAL ── */}
      {showPaywall && (
        <Modal onClose={() => setShowPaywall(false)}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-1">{t('unlockReport')}</h3>
            <p className="text-gray-500 text-sm">{t('unlockReportDesc')}</p>
          </div>

          <div className="bg-indigo-50 rounded-2xl p-5 mb-6">
            <h4 className="font-bold text-gray-800 mb-3 text-sm">{t('whatYouGet')}</h4>
            <div className="grid grid-cols-2 gap-2">
              {[t('detailedSSL'), t('completeWHOIS'), t('reclameAquiHistory'), t('socialAnalysis'), t('trustPilotReviews'), t('googleTop10')].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button onClick={() => { handleUpgrade('unlimited'); setShowPaywall(false); }}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg text-sm">
              {t('unlockOneTime')}
            </button>
            <button onClick={() => { setShowPaywall(false); setShowPricingModal(true); }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg text-sm">
              {t('orSubscribe')}
            </button>
            <button onClick={() => setShowPaywall(false)} className="w-full text-gray-400 hover:text-gray-600 py-2 text-sm">{t('maybeLater')}</button>
          </div>
        </Modal>
      )}

      {/* ── PRICING MODAL ── */}
      {showPricingModal && (
        <Modal onClose={() => setShowPricingModal(false)} wide>
          <div className="text-center mb-8">
            <Crown className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h3 className="text-3xl font-black text-gray-900 mb-2">{t('pricingTitle')}</h3>
            <p className="text-gray-500">{t('pricingSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {pricingPlans.map(plan => (
              <div key={plan.id}
                className={`relative border-2 ${plan.color} rounded-2xl p-6 ${plan.badge === t('mostPopular') ? 'shadow-xl scale-105' : 'shadow-md'}`}>
                {plan.badge && (
                  <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap ${plan.badge === t('mostPopular') ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                    {plan.badge}
                  </div>
                )}
                {plan.savings && (
                  <div className="absolute -top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {plan.savings}
                  </div>
                )}
                <div className="text-center mb-5">
                  <div className="font-black text-gray-900 text-lg mb-2">{plan.name}</div>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-3xl font-black text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 text-sm mb-1">{plan.period}</span>
                  </div>
                  {plan.originalPrice && (
                    <div className="text-xs text-gray-400 line-through">{plan.originalPrice}</div>
                  )}
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleUpgrade(plan.id)}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${plan.btnClass}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400 mb-3">
              <Shield className="w-4 h-4 inline mr-1 text-emerald-500" />
              {t('guarantee')}
            </p>
            <button onClick={() => setShowPricingModal(false)} className="text-gray-400 hover:text-gray-600 text-sm">
              {t('continueFreePlan')}
            </button>
          </div>
        </Modal>
      )}

      {/* ── EXHAUSTED MODAL ── */}
      {showUpgradeModal && (
        <Modal onClose={() => setShowUpgradeModal(false)}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">{t('consultationsExhausted')}</h3>
            <p className="text-gray-500 text-sm">{t('consultationsExhaustedDesc')}</p>
          </div>
          <div className="space-y-3">
            <button onClick={() => handleUpgrade('unlimited')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl text-sm">
              🚀 {t('unlimitedAccess')}
            </button>
            <button onClick={() => { setShowUpgradeModal(false); setShowPricingModal(true); }}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 rounded-xl text-sm">
              👑 {t('premiumMonthly')}
            </button>
            <button onClick={() => setShowUpgradeModal(false)} className="w-full text-gray-400 py-2 text-sm">{t('back')}</button>
          </div>
        </Modal>
      )}

       {}
      <div className="fixed bottom-4 right-4 z-40 select-none opacity-50 hover:opacity-100 transition-opacity">
  <img 
    src="/Bune_Sigil.png" 
    alt="Sigil" 
    className="w-12 h-12 sm:w-16 sm:h-16 object-contain" 
  />
</div>
      {}


      {/* ── FOOTER ── */}
      <footer className="bg-gray-950 text-white mt-16">
        {/* Creator Section */}
        <div className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-start gap-8 max-w-3xl">
              <div className="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden shadow-xl shadow-blue-900/50">
  <img
    src="/creator1.png" // caminho da sua imagem
    alt="Sua foto"
    className="w-full h-full object-cover"
  />
</div>
              <div>
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">{t('creatorTitle')}</p>
                <h3 className="text-2xl font-black text-white mb-1">{t('creatorName')}</h3>
                <p className="text-sm text-blue-400 font-medium mb-3">{t('creatorRole')}</p>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xl">{t('creatorBio')}</p>
                <div className="flex gap-3 mt-4">
                  <a href="mailto:eupablorodriguez@gmail.com" className="w-8 h-8 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                    <Mail className="w-4 h-4" />
                  </a>
                  <a href="https://instagram.com/soupabloeduardo" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand col */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img src="/Fraudara_Logo1.png" alt="Fraudara" className="w-full h-full object-contain bg-blue-600" />
                </div>
                <span className="font-black text-lg">Fraudara</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{t('footerTagline')}</p>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${t('footerEmail')}`} className="hover:text-white transition-colors">{t('footerEmail')}</a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4 text-gray-300">{t('footerProduct')}</h4>
             <ul className="space-y-2.5 text-sm text-gray-500">
  {[t('footerHowItWorks'), t('footerPricing'), t('footerAPI')].map((l, i) => {
    if (i === 0) {
      return (
        <li key={i}>
          <button
            onClick={() => {
              document
                .getElementById('how-it-works')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors"
          >
            {l}
          </button>
        </li>
      );
    }

    if (i === 1) {
      return (
        <li key={i}>
          <button
            onClick={() => setShowPricingModal(true)}
            className="hover:text-white transition-colors"
          >
            {l}
          </button>
        </li>
      );
    }

    return (
      <li key={i}>
        <a href="#" className="hover:text-white transition-colors">
          {l}
        </a>
      </li>
    );
  })}
</ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4 text-gray-300">{t('footerCompany')}</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                {[t('footerAbout'), t('footerCreator'), t('footerBlog')].map((l, i) => (
                  <li key={i}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4 text-gray-300">{t('footerSupport')}</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                {[t('footerHelp'), t('footerContact'), t('footerReport')].map((l, i) => (
                  <li key={i}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4 text-gray-300">{t('footerLegal')}</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                {[t('footerPrivacy'), t('footerTerms'), t('footerCookies')].map((l, i) => (
                  <li key={i}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-600">
            <p>{t('footerCopyright')}</p>
            <p>{t('footerMadeWith')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────
function Modal({ children, onClose, wide = false }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-3xl shadow-2xl w-full max-h-[90vh] overflow-y-auto ${wide ? 'max-w-4xl' : 'max-w-lg'}`}>
        <div className="p-6 md:p-8 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}

function DetailSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm">
        {icon} {title}
      </h4>
      {children}
    </div>
  );
}

function Kv({ label, val, span = false }: { label: string; val: any; span?: boolean }) {
  return (
    <div className={span ? 'col-span-2' : ''}>
      <span className="font-semibold text-gray-600">{label} </span>
      <span className="text-gray-800">{val}</span>
    </div>
  );
}

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-gray-600">{label}:</span>
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 text-xs">
        Ver perfil <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
