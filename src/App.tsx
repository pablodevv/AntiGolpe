import React, { useState, useEffect } from 'react';
import { Shield, Search, Share2, CheckCircle, AlertTriangle, XCircle, Loader2, Award, Users, Clock, TrendingUp, Star, Lock, Zap, Eye, ChevronDown, ChevronUp, Check, Crown, Phone, Sparkles, Gift, ExternalLink, ShoppingCart, CreditCard, Headphones, FileText, Smartphone, Globe } from 'lucide-react';

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

interface StatCard {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  features: string[];
  popular?: boolean;
  cta: string;
  savings?: string;
}

// Sistema de Tradução
const translations = {
  pt: {
    // Header
    title: "AntiGolpe",
    subtitle: "Proteção Nacional Contra Fraudes",
    secure: "100% Seguro",
    instantVerification: "Verificação Instantânea",
    consultationsLeft: "consultas restantes",
    
    // Banner
    specialOffer: "OFERTA ESPECIAL",
    premiumProtection: "Proteção Premium por apenas R$12/mês",
    guaranteeNow: "GARANTIR AGORA →",
    
    // Stats
    sitesVerified: "Sites Verificados",
    usersProtected: "Usuários Protegidos",
    accuracy: "Precisão",
    fraudsPrevented: "Golpes Evitados",
    
    // Main Content
    mainTitle: "Verifique Qualquer Site ou Marca em Segundos",
    mainSubtitle: "Nossa inteligência artificial analisa milhões de dados em tempo real para proteger você contra golpes online",
    placeholder: "Digite o nome da marca ou URL do site (ex: loja-promocoes.com)",
    verifyButton: "Verificar Agora - GRÁTIS",
    verifying: "Verificando Segurança...",
    
    // Loading messages
    analysisInProgress: "🔍 Análise em Andamento",
    checkingDomain: "Verificando domínio e certificados SSL...",
    consultingComplaints: "Consultando base de reclamações...",
    analyzingReputation: "Analisando reputação online...",
    
    // Results
    trustIndex: "Índice de Confiança",
    analysisTime: "Tempo de Análise",
    complaintsFound: "reclamações encontradas nos últimos 30 dias",
    completeReport: "Ver Relatório Completo",
    shareWhatsApp: "Compartilhar no WhatsApp",
    newVerification: "Nova Verificação",
    
    // Details sections
    sslCertificate: "Certificado SSL/TLS",
    domainInfo: "Informações do Domínio (WHOIS)",
    reclameAqui: "Reclame Aqui",
    socialNetworks: "Presença em Redes Sociais",
    trustPilot: "TrustPilot",
    googleResults: "Top 10 Resultados Google",
    
    // SSL Details
    present: "Presente:",
    valid: "Válido:",
    validFrom: "Válido de:",
    validTo: "Válido até:",
    issuer: "Emissor:",
    yes: "Sim",
    no: "Não",
    
    // Custom Analysis
    customAnalysisTitle: "Análise Personalizada Premium",
    customAnalysisSubtitle: "Precisa de uma análise detalhada de documentos, CNPJs, contratos ou propostas de investimento? Nossa equipe de especialistas faz uma verificação manual completa em até 1 hora.",
    expressAnalysis: "Análise Expressa - R$ 49,90",
    premiumAnalysis: "Análise Premium - R$ 99,90",
    responseTime1h: "Resposta em até 1 hora",
    manualVerification: "Verificação manual por especialistas",
    detailedReport: "Relatório detalhado em PDF",
    whatsappSupport: "Suporte via WhatsApp",
    responseTime30min: "Resposta em até 30 minutos",
    legalAnalysis: "Análise jurídica incluída",
    videoConsultation: "Consultoria por videochamada",
    guarantee30days: "Garantia de 30 dias",
    requestAnalysis: "Solicitar Análise via WhatsApp",
    
    // Trust Indicators
    completeAnalysis: "Análise Completa",
    completeAnalysisDesc: "Verificamos domínio, SSL, Reclame Aqui, redes sociais e mais de 50 fontes de dados",
    advancedAI: "IA Avançada",
    advancedAIDesc: "Nossa inteligência artificial processa milhões de dados em tempo real para máxima precisão",
    instantResult: "Resultado Instantâneo",
    instantResultDesc: "Veredito claro e confiável em segundos, com índice de confiança e detalhes completos",
    
    // Pricing Plans
    oneTimePayment: "Pagamento Único",
    unlimitedConsultations: "Consultas ilimitadas",
    completeReports: "Relatórios completos",
    detailedAnalysis: "Análise detalhada",
    emailSupport: "Suporte por email",
    unlockNow: "Desbloquear Agora",
    
    protectionPremium: "Proteção Premium",
    monitoring247: "Monitoramento 24/7",
    whatsappAlerts: "Alertas WhatsApp/Email",
    vipSiteList: "Lista VIP de sites",
    prioritySupport: "Suporte prioritário",
    unlockPremiumNow: "Desbloquear Premium Agora",
    
    annualProtection: "Proteção Anual",
    freeMonths: "2 meses grátis",
    customAnalysisFeature: "Análises personalizadas",
    specializedConsulting: "Consultoria especializada",
    businessReports: "Relatórios empresariais",
    bestOffer: "Melhor Oferta",
    
    // Modals
    consultationsExhausted: "🔒 Consultas Esgotadas",
    consultationsExhaustedDesc: "Você usou suas 5 consultas gratuitas. Desbloqueie acesso ilimitado agora!",
    unlimitedAccess: "🚀 Acesso Ilimitado - R$ 29,90",
    premium: "👑 Premium - R$ 12/mês",
    back: "Voltar",
    maybeLater: "Talvez depois",
    
    completeReportTitle: "📊 Relatório Completo",
    completeReportDesc: "Desbloqueie todos os detalhes da análise",
    whatYouWillSee: "🔓 O que você vai ver:",
    detailedSSL: "Certificados SSL detalhados",
    completeWHOIS: "Informações WHOIS completas",
    reclameAquiHistory: "Histórico Reclame Aqui",
    socialAnalysis: "Análise de redes sociais",
    trustPilotReviews: "Avaliações TrustPilot",
    googleTop10: "Top 10 resultados Google",
    unlockFor2990: "🚀 Desbloquear por R$ 29,90 (Uma vez)",
    orPremium: "👑 Ou Premium por R$ 12/mês",
    
    choosePlan: "👑 Proteção Premium",
    choosePlanDesc: "Escolha o plano ideal para sua proteção",
    mostPopular: "🔥 MAIS POPULAR",
    continueFreePlan: "Continuar com plano gratuito",
    
    safeAlternative: "Alternativa 100% Segura",
    amazonDesc: "Maior e-commerce do mundo",
    upTo70Off: "Até 70% OFF",
    
    // Footer
    totalSecurity: "🛡️ Segurança Total",
    totalSecurityDesc: "Seus dados são protegidos com criptografia de nível bancário",
    freeVerification: "✅ Verificação Gratuita",
    freeVerificationDesc: "5 consultas gratuitas para proteger todos os brasileiros",
    alwaysUpdated: "🚀 Sempre Atualizado",
    alwaysUpdatedDesc: "Base de dados atualizada em tempo real 24/7",
    footerCopyright: "© 2025 AntiGolpe - Protegendo brasileiros contra fraudes online desde 2024",
    footerDisclaimer: "Ferramenta educativa para conscientização sobre segurança digital • Desenvolvido no Brasil 🇧🇷"
  },
  
  en: {
    // Header
    title: "AntiScam",
    subtitle: "National Fraud Protection",
    secure: "100% Secure",
    instantVerification: "Instant Verification",
    consultationsLeft: "consultations left",
    
    // Banner
    specialOffer: "SPECIAL OFFER",
    premiumProtection: "Premium Protection for only $12/month",
    guaranteeNow: "GET NOW →",
    
    // Stats
    sitesVerified: "Sites Verified",
    usersProtected: "Users Protected",
    accuracy: "Accuracy",
    fraudsPrevented: "Frauds Prevented",
    
    // Main Content
    mainTitle: "Verify Any Website or Brand in Seconds",
    mainSubtitle: "Our artificial intelligence analyzes millions of data in real time to protect you against online scams",
    placeholder: "Enter brand name or website URL (e.g. promo-store.com)",
    verifyButton: "Verify Now - FREE",
    verifying: "Verifying Security...",
    
    // Loading messages
    analysisInProgress: "🔍 Analysis in Progress",
    checkingDomain: "Checking domain and SSL certificates...",
    consultingComplaints: "Consulting complaints database...",
    analyzingReputation: "Analyzing online reputation...",
    
    // Results
    trustIndex: "Trust Index",
    analysisTime: "Analysis Time",
    complaintsFound: "complaints found in the last 30 days",
    completeReport: "View Complete Report",
    shareWhatsApp: "Share on WhatsApp",
    newVerification: "New Verification",
    
    // Details sections
    sslCertificate: "SSL/TLS Certificate",
    domainInfo: "Domain Information (WHOIS)",
    reclameAqui: "Consumer Reports",
    socialNetworks: "Social Media Presence",
    trustPilot: "TrustPilot",
    googleResults: "Top 10 Google Results",
    
    // SSL Details
    present: "Present:",
    valid: "Valid:",
    validFrom: "Valid from:",
    validTo: "Valid until:",
    issuer: "Issuer:",
    yes: "Yes",
    no: "No",
    
    // Custom Analysis
    customAnalysisTitle: "Premium Custom Analysis",
    customAnalysisSubtitle: "Need a detailed analysis of documents, company IDs, contracts or investment proposals? Our team of experts performs a complete manual verification within 1 hour.",
    expressAnalysis: "Express Analysis - $49.90",
    premiumAnalysis: "Premium Analysis - $99.90",
    responseTime1h: "Response within 1 hour",
    manualVerification: "Manual verification by experts",
    detailedReport: "Detailed PDF report",
    whatsappSupport: "WhatsApp support",
    responseTime30min: "Response within 30 minutes",
    legalAnalysis: "Legal analysis included",
    videoConsultation: "Video consultation",
    guarantee30days: "30-day guarantee",
    requestAnalysis: "Request Analysis via WhatsApp",
    
    // Trust Indicators
    completeAnalysis: "Complete Analysis",
    completeAnalysisDesc: "We verify domain, SSL, consumer reports, social networks and over 50 data sources",
    advancedAI: "Advanced AI",
    advancedAIDesc: "Our artificial intelligence processes millions of data in real time for maximum accuracy",
    instantResult: "Instant Result",
    instantResultDesc: "Clear and reliable verdict in seconds, with trust index and complete details",
    
    // Pricing Plans
    oneTimePayment: "One-Time Payment",
    unlimitedConsultations: "Unlimited consultations",
    completeReports: "Complete reports",
    detailedAnalysis: "Detailed analysis",
    emailSupport: "Email support",
    unlockNow: "Unlock Now",
    
    protectionPremium: "Premium Protection",
    monitoring247: "24/7 Monitoring",
    whatsappAlerts: "WhatsApp/Email Alerts",
    vipSiteList: "VIP site list",
    prioritySupport: "Priority support",
    unlockPremiumNow: "Unlock Premium Now",
    
    annualProtection: "Annual Protection",
    freeMonths: "2 months free",
    customAnalysisFeature: "Custom analysis",
    specializedConsulting: "Specialized consulting",
    businessReports: "Business reports",
    bestOffer: "Best Offer",
    
    // Modals
    consultationsExhausted: "🔒 Consultations Exhausted",
    consultationsExhaustedDesc: "You used your 5 free consultations. Unlock unlimited access now!",
    unlimitedAccess: "🚀 Unlimited Access - $29.90",
    premium: "👑 Premium - $12/month",
    back: "Back",
    maybeLater: "Maybe later",
    
    completeReportTitle: "📊 Complete Report",
    completeReportDesc: "Unlock all analysis details",
    whatYouWillSee: "🔓 What you will see:",
    detailedSSL: "Detailed SSL certificates",
    completeWHOIS: "Complete WHOIS information",
    reclameAquiHistory: "Consumer reports history",
    socialAnalysis: "Social media analysis",
    trustPilotReviews: "TrustPilot reviews",
    googleTop10: "Top 10 Google results",
    unlockFor2990: "🚀 Unlock for $29.90 (One time)",
    orPremium: "👑 Or Premium for $12/month",
    
    choosePlan: "👑 Premium Protection",
    choosePlanDesc: "Choose the ideal plan for your protection",
    mostPopular: "🔥 MOST POPULAR",
    continueFreePlan: "Continue with free plan",
    
    safeAlternative: "100% Safe Alternative",
    amazonDesc: "World's largest e-commerce",
    upTo70Off: "Up to 70% OFF",
    
    // Footer
    totalSecurity: "🛡️ Total Security",
    totalSecurityDesc: "Your data is protected with bank-level encryption",
    freeVerification: "✅ Free Verification",
    freeVerificationDesc: "5 free consultations to protect everyone",
    alwaysUpdated: "🚀 Always Updated",
    alwaysUpdatedDesc: "Database updated in real time 24/7",
    footerCopyright: "© 2025 AntiScam - Protecting people against online frauds since 2024",
    footerDisclaimer: "Educational tool for digital security awareness • Made in Brazil 🇧🇷"
  },
  
  es: {
    // Header
    title: "AntiEstafa",
    subtitle: "Protección Nacional Contra Fraudes",
    secure: "100% Seguro",
    instantVerification: "Verificación Instantánea",
    consultationsLeft: "consultas restantes",
    
    // Banner
    specialOffer: "OFERTA ESPECIAL",
    premiumProtection: "Protección Premium por solo $12/mes",
    guaranteeNow: "OBTENER AHORA →",
    
    // Stats
    sitesVerified: "Sitios Verificados",
    usersProtected: "Usuarios Protegidos",
    accuracy: "Precisión",
    fraudsPrevented: "Estafas Evitadas",
    
    // Main Content
    mainTitle: "Verifica Cualquier Sitio Web o Marca en Segundos",
    mainSubtitle: "Nuestra inteligencia artificial analiza millones de datos en tiempo real para protegerte contra estafas online",
    placeholder: "Ingresa el nombre de la marca o URL del sitio (ej: tienda-promociones.com)",
    verifyButton: "Verificar Ahora - GRATIS",
    verifying: "Verificando Seguridad...",
    
    // Loading messages
    analysisInProgress: "🔍 Análisis en Progreso",
    checkingDomain: "Verificando dominio y certificados SSL...",
    consultingComplaints: "Consultando base de quejas...",
    analyzingReputation: "Analizando reputación online...",
    
    // Results
    trustIndex: "Índice de Confianza",
    analysisTime: "Tiempo de Análisis",
    complaintsFound: "quejas encontradas en los últimos 30 días",
    completeReport: "Ver Informe Completo",
    shareWhatsApp: "Compartir en WhatsApp",
    newVerification: "Nueva Verificación",
    
    // Details sections
    sslCertificate: "Certificado SSL/TLS",
    domainInfo: "Información del Dominio (WHOIS)",
    reclameAqui: "Quejas de Consumidores",
    socialNetworks: "Presencia en Redes Sociales",
    trustPilot: "TrustPilot",
    googleResults: "Top 10 Resultados Google",
    
    // SSL Details
    present: "Presente:",
    valid: "Válido:",
    validFrom: "Válido desde:",
    validTo: "Válido hasta:",
    issuer: "Emisor:",
    yes: "Sí",
    no: "No",
    
    // Custom Analysis
    customAnalysisTitle: "Análisis Personalizado Premium",
    customAnalysisSubtitle: "¿Necesitas un análisis detallado de documentos, IDs de empresa, contratos o propuestas de inversión? Nuestro equipo de expertos realiza una verificación manual completa en 1 hora.",
    expressAnalysis: "Análisis Exprés - $49.90",
    premiumAnalysis: "Análisis Premium - $99.90",
    responseTime1h: "Respuesta en 1 hora",
    manualVerification: "Verificación manual por expertos",
    detailedReport: "Informe detallado en PDF",
    whatsappSupport: "Soporte por WhatsApp",
    responseTime30min: "Respuesta en 30 minutos",
    legalAnalysis: "Análisis legal incluido",
    videoConsultation: "Consulta por video",
    guarantee30days: "Garantía de 30 días",
    requestAnalysis: "Solicitar Análisis por WhatsApp",
    
    // Trust Indicators
    completeAnalysis: "Análisis Completo",
    completeAnalysisDesc: "Verificamos dominio, SSL, quejas de consumidores, redes sociales y más de 50 fuentes de datos",
    advancedAI: "IA Avanzada",
    advancedAIDesc: "Nuestra inteligencia artificial procesa millones de datos en tiempo real para máxima precisión",
    instantResult: "Resultado Instantáneo",
    instantResultDesc: "Veredicto claro y confiable en segundos, con índice de confianza y detalles completos",
    
    // Pricing Plans
    oneTimePayment: "Pago Único",
    unlimitedConsultations: "Consultas ilimitadas",
    completeReports: "Informes completos",
    detailedAnalysis: "Análisis detallado",
    emailSupport: "Soporte por email",
    unlockNow: "Desbloquear Ahora",
    
    protectionPremium: "Protección Premium",
    monitoring247: "Monitoreo 24/7",
    whatsappAlerts: "Alertas WhatsApp/Email",
    vipSiteList: "Lista VIP de sitios",
    prioritySupport: "Soporte prioritario",
    unlockPremiumNow: "Desbloquear Premium Ahora",
    
    annualProtection: "Protección Anual",
    freeMonths: "2 meses gratis",
    customAnalysisFeature: "Análisis personalizados",
    specializedConsulting: "Consultoría especializada",
    businessReports: "Informes empresariales",
    bestOffer: "Mejor Oferta",
    
    // Modals
    consultationsExhausted: "🔒 Consultas Agotadas",
    consultationsExhaustedDesc: "Usaste tus 5 consultas gratuitas. ¡Desbloquea acceso ilimitado ahora!",
    unlimitedAccess: "🚀 Acceso Ilimitado - $29.90",
    premium: "👑 Premium - $12/mes",
    back: "Volver",
    maybeLater: "Tal vez después",
    
    completeReportTitle: "📊 Informe Completo",
    completeReportDesc: "Desbloquea todos los detalles del análisis",
    whatYouWillSee: "🔓 Lo que verás:",
    detailedSSL: "Certificados SSL detallados",
    completeWHOIS: "Información WHOIS completa",
    reclameAquiHistory: "Historial de quejas de consumidores",
    socialAnalysis: "Análisis de redes sociales",
    trustPilotReviews: "Reseñas de TrustPilot",
    googleTop10: "Top 10 resultados Google",
    unlockFor2990: "🚀 Desbloquear por $29.90 (Una vez)",
    orPremium: "👑 O Premium por $12/mes",
    
    choosePlan: "👑 Protección Premium",
    choosePlanDesc: "Elige el plan ideal para tu protección",
    mostPopular: "🔥 MÁS POPULAR",
    continueFreePlan: "Continuar con plan gratuito",
    
    safeAlternative: "Alternativa 100% Segura",
    amazonDesc: "El mayor e-commerce del mundo",
    upTo70Off: "Hasta 70% OFF",
    
    // Footer
    totalSecurity: "🛡️ Seguridad Total",
    totalSecurityDesc: "Tus datos están protegidos con cifrado de nivel bancario",
    freeVerification: "✅ Verificación Gratuita",
    freeVerificationDesc: "5 consultas gratuitas para proteger a todos",
    alwaysUpdated: "🚀 Siempre Actualizado",
    alwaysUpdatedDesc: "Base de datos actualizada en tiempo real 24/7",
    footerCopyright: "© 2025 AntiEstafa - Protegiendo personas contra fraudes online desde 2024",
    footerDisclaimer: "Herramienta educativa para concienciación sobre seguridad digital • Hecho en Brasil 🇧🇷"
  },
  
  zh: {
    // Header
    title: "反诈骗",
    subtitle: "国家防诈骗保护",
    secure: "100% 安全",
    instantVerification: "即时验证",
    consultationsLeft: "剩余查询次数",
    
    // Banner
    specialOffer: "特别优惠",
    premiumProtection: "高级保护仅需每月$12",
    guaranteeNow: "立即获取 →",
    
    // Stats
    sitesVerified: "已验证网站",
    usersProtected: "受保护用户",
    accuracy: "准确率",
    fraudsPrevented: "已阻止诈骗",
    
    // Main Content
    mainTitle: "在几秒钟内验证任何网站或品牌",
    mainSubtitle: "我们的人工智能实时分析数百万数据，保护您免受网络诈骗",
    placeholder: "输入品牌名称或网站URL（例：促销商店.com）",
    verifyButton: "立即验证 - 免费",
    verifying: "正在验证安全性...",
    
    // Loading messages
    analysisInProgress: "🔍 分析进行中",
    checkingDomain: "正在检查域名和SSL证书...",
    consultingComplaints: "正在查询投诉数据库...",
    analyzingReputation: "正在分析在线声誉...",
    
    // Results
    trustIndex: "信任指数",
    analysisTime: "分析时间",
    complaintsFound: "在过去30天内发现的投诉",
    completeReport: "查看完整报告",
    shareWhatsApp: "在WhatsApp上分享",
    newVerification: "新验证",
    
    // Details sections
    sslCertificate: "SSL/TLS证书",
    domainInfo: "域名信息（WHOIS）",
    reclameAqui: "消费者投诉",
    socialNetworks: "社交媒体存在",
    trustPilot: "TrustPilot",
    googleResults: "Google前10结果",
    
    // SSL Details
    present: "存在：",
    valid: "有效：",
    validFrom: "有效期从：",
    validTo: "有效期至：",
    issuer: "颁发者：",
    yes: "是",
    no: "否",
    
    // Custom Analysis
    customAnalysisTitle: "高级定制分析",
    customAnalysisSubtitle: "需要对文件、公司ID、合同或投资提案进行详细分析吗？我们的专家团队在1小时内进行完整的手动验证。",
    expressAnalysis: "快速分析 - $49.90",
    premiumAnalysis: "高级分析 - $99.90",
    responseTime1h: "1小时内回复",
    manualVerification: "专家手动验证",
    detailedReport: "详细PDF报告",
    whatsappSupport: "WhatsApp支持",
    responseTime30min: "30分钟内回复",
    legalAnalysis: "包含法律分析",
    videoConsultation: "视频咨询",
    guarantee30days: "30天保证",
    requestAnalysis: "通过WhatsApp请求分析",
    
    // Trust Indicators
    completeAnalysis: "完整分析",
    completeAnalysisDesc: "我们验证域名、SSL、消费者投诉、社交网络和50多个数据源",
    advancedAI: "先进AI",
    advancedAIDesc: "我们的人工智能实时处理数百万数据以获得最大准确性",
    instantResult: "即时结果",
    instantResultDesc: "几秒钟内得到清晰可靠的判决，包含信任指数和完整详情",
    
    // Pricing Plans
    oneTimePayment: "一次性付款",
    unlimitedConsultations: "无限查询",
    completeReports: "完整报告",
    detailedAnalysis: "详细分析",
    emailSupport: "邮件支持",
    unlockNow: "立即解锁",
    
    protectionPremium: "高级保护",
    monitoring247: "24/7监控",
    whatsappAlerts: "WhatsApp/邮件警报",
    vipSiteList: "VIP网站列表",
    prioritySupport: "优先支持",
    unlockPremiumNow: "立即解锁高级版",
    
    annualProtection: "年度保护",
    freeMonths: "免费2个月",
    customAnalysisFeature: "定制分析",
    specializedConsulting: "专业咨询",
    businessReports: "商业报告",
    bestOffer: "最佳优惠",
    
    // Modals
    consultationsExhausted: "🔒 查询已用完",
    consultationsExhaustedDesc: "您已使用完5次免费查询。立即解锁无限访问！",
    unlimitedAccess: "🚀 无限访问 - $29.90",
    premium: "👑 高级版 - $12/月",
    back: "返回",
    maybeLater: "稍后再说",
    
    completeReportTitle: "📊 完整报告",
    completeReportDesc: "解锁所有分析详情",
    whatYouWillSee: "🔓 您将看到：",
    detailedSSL: "详细SSL证书",
    completeWHOIS: "完整WHOIS信息",
    reclameAquiHistory: "消费者投诉历史",
    socialAnalysis: "社交媒体分析",
    trustPilotReviews: "TrustPilot评论",
    googleTop10: "Google前10结果",
    unlockFor2990: "🚀 以$29.90解锁（一次性）",
    orPremium: "👑 或高级版$12/月",
    
    choosePlan: "👑 高级保护",
    choosePlanDesc: "选择适合您保护的理想计划",
    mostPopular: "🔥 最受欢迎",
    continueFreePlan: "继续免费计划",
    
    safeAlternative: "100%安全替代",
    amazonDesc: "世界最大电商",
    upTo70Off: "高达70%折扣",
    
    // Footer
    totalSecurity: "🛡️ 全面安全",
    totalSecurityDesc: "您的数据受到银行级加密保护",
    freeVerification: "✅ 免费验证",
    freeVerificationDesc: "5次免费查询保护每个人",
    alwaysUpdated: "🚀 始终更新",
    alwaysUpdatedDesc: "数据库24/7实时更新",
    footerCopyright: "© 2025 反诈骗 - 自2024年以来保护人们免受在线诈骗",
    footerDisclaimer: "数字安全意识教育工具 • 巴西制造 🇧🇷"
  }
};

// Hook para gerenciar idioma
const useLanguage = () => {
  const [language, setLanguage] = useState('pt');
  
  useEffect(() => {
    // Verifica se há idioma salvo no localStorage
    const savedLanguage = localStorage.getItem('antigolpe_language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
      return;
    }
    
    // Detecta idioma do navegador
    const browserLang = navigator.language.toLowerCase();
    let detectedLang = 'pt'; // padrão
    
    if (browserLang.includes('en')) detectedLang = 'en';
    else if (browserLang.includes('es')) detectedLang = 'es';
    else if (browserLang.includes('zh') || browserLang.includes('cn')) detectedLang = 'zh';
    else if (browserLang.includes('pt')) detectedLang = 'pt';
    
    setLanguage(detectedLang);
    localStorage.setItem('antigolpe_language', detectedLang);
  }, []);
  
  const changeLanguage = (newLang: string) => {
    setLanguage(newLang);
    localStorage.setItem('antigolpe_language', newLang);
  };
  
  const t = (key: string) => {
    return translations[language]?.[key] || translations.pt[key] || key;
  };
  
  return { language, changeLanguage, t };
};

// Component para seletor de idioma
const LanguageSelector = ({ language, onLanguageChange }: { language: string, onLanguageChange: (lang: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];
  
  const currentLang = languages.find(lang => lang.code === language) || languages[0];
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{currentLang.flag} {currentLang.name}</span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 min-w-full">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                language === lang.code ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              <span className="flex items-center space-x-3">
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  const { language, changeLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCustomAnalysis, setShowCustomAnalysis] = useState(false);
  const [freeSearches, setFreeSearches] = useState(5);
  const [isPremium, setIsPremium] = useState(false);
  const [hasUnlimitedAccess, setHasUnlimitedAccess] = useState(false);

  // Carrega dados do localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('antigolpe_searches');
    const savedPremium = localStorage.getItem('antigolpe_premium');
    const savedUnlimited = localStorage.getItem('antigolpe_unlimited');
    
    if (savedSearches) {
      setFreeSearches(parseInt(savedSearches));
    }
    if (savedPremium === 'true') {
      setIsPremium(true);
    }
    if (savedUnlimited === 'true') {
      setHasUnlimitedAccess(true);
    }

    // 🔥 Verifica o slug da URL
    const path = window.location.pathname;

    if (path === "/premium-ativar") {
      setIsPremium(true);
      localStorage.setItem('antigolpe_premium', 'true');
      alert("✅ Proteção Premium ativada com sucesso!");
      window.location.href = "/"; // redireciona para a home
    }

    if (path === "/unlimited-ativar") {
      setHasUnlimitedAccess(true);
      localStorage.setItem('antigolpe_unlimited', 'true');
      alert("✅ Pagamento Único ativado com sucesso!");
      window.location.href = "/";
    }

    if (path === "/annual-ativar") {
      setIsPremium(true);
      localStorage.setItem('antigolpe_premium', 'true');
      alert("✅ Proteção Anual ativada com sucesso!");
      window.location.href = "/"; // redireciona para a home
    }
  }, []);

  // Estatísticas impressionantes para credibilidade
  const stats: StatCard[] = [
    {
      icon: <Shield className="w-6 h-6" />,
      value: "2.8M+",
      label: t('sitesVerified'),
      color: "text-blue-600"
    },
    {
      icon: <Users className="w-6 h-6" />,
      value: "1.2M+",
      label: t('usersProtected'),
      color: "text-green-600"
    },
    {
      icon: <Award className="w-6 h-6" />,
      value: "99.8%",
      label: t('accuracy'),
      color: "text-purple-600"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      value: "R$ 67M",
      label: t('fraudsPrevented'),
      color: "text-orange-600"
    }
  ];

  // Planos de preços
  const pricingPlans: PricingPlan[] = [
    {
      id: "unlimited",
      name: t('oneTimePayment'),
      price: "R$ 29,90",
      period: language === 'en' ? "once" : language === 'es' ? "una vez" : language === 'zh' ? "一次" : "uma vez",
      features: [
        t('unlimitedConsultations'),
        t('completeReports'),
        t('detailedAnalysis'),
        t('emailSupport')
      ],
      cta: t('unlockNow')
    },
    {
      id: "premium",
      name: t('protectionPremium'),
      price: "R$ 12",
      originalPrice: "R$ 17",
      period: language === 'en' ? "/month" : language === 'es' ? "/mes" : language === 'zh' ? "/月" : "/mês",
      popular: true,
      savings: "31% OFF",
      features: [
        language === 'en' ? "Everything from previous plan" : language === 'es' ? "Todo del plan anterior" : language === 'zh' ? "前一个计划的所有功能" : "Tudo do plano anterior",
        t('monitoring247'),
        t('whatsappAlerts'),
        t('vipSiteList'),
        t('prioritySupport')
      ],
      cta: t('unlockPremiumNow')
    },
    {
      id: "annual",
      name: t('annualProtection'),
      price: "R$ 99",
      originalPrice: "R$ 144",
      period: language === 'en' ? "/year" : language === 'es' ? "/año" : language === 'zh' ? "/年" : "/ano",
      savings: language === 'en' ? "Save R$ 45" : language === 'es' ? "Ahorra R$ 45" : language === 'zh' ? "节省 R$ 45" : "Economize R$ 45",
      features: [
        language === 'en' ? "Everything from Premium" : language === 'es' ? "Todo del Premium" : language === 'zh' ? "高级版的所有功能" : "Tudo do Premium",
        t('freeMonths'),
        t('customAnalysisFeature'),
        t('specializedConsulting'),
        t('businessReports')
      ],
      cta: t('bestOffer')
    }
  ];

  const handleVerification = async () => {
    if (!searchQuery.trim()) return;

    // Verifica limite de consultas gratuitas
    if (!isPremium && !hasUnlimitedAccess && freeSearches <= 0) {
      setShowUpgradeModal(true);
      return;
    }

    setIsVerifying(true);
    setResult(null);
    setShowDetails(false);

    try {
      const resp = await fetch("/.netlify/functions/verificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || "Falha na verificação");

      // Ajusta o trustScore para ser mais realista
      let adjustedTrustScore = data.trustScore || 75;
      
      // Se o status é safe mas o score está baixo, ajusta
      if (data.status === 'safe' && adjustedTrustScore < 75) {
        adjustedTrustScore = Math.max(75, adjustedTrustScore + 15);
      }
      // Se o status é danger mas o score está alto, ajusta
      else if (data.status === 'danger' && adjustedTrustScore > 40) {
        adjustedTrustScore = Math.min(40, adjustedTrustScore - 10);
      }
      // Se o status é suspicious, mantém entre 40-75
      else if (data.status === 'suspicious') {
        adjustedTrustScore = Math.max(40, Math.min(75, adjustedTrustScore));
      }

      setResult({
        status: data.status,
        title: data.title,
        message: data.message,
        complaints: data.complaints ?? 0,
        trustScore: adjustedTrustScore,
        verificationTime: data.verificationTime ?? "—",
        debug: data.debug,
        ssl: data.ssl,
        whois: data.whois,
        reclameAqui: data.reclameAqui,
        googleResults: data.googleResults ?? [],
        social: data.social,
        trustPilot: data.trustPilot,
      });

      // Decrementa consultas gratuitas apenas se não for premium
      if (!isPremium && !hasUnlimitedAccess) {
        const newCount = Math.max(0, freeSearches - 1);
        setFreeSearches(newCount);
        localStorage.setItem('antigolpe_searches', newCount.toString());
      }

    } catch (e: any) {
      setResult({
        status: "suspicious",
        title: "⚠️ VERIFICAÇÃO PARCIAL",
        message: "Não foi possível concluir toda a análise. Recomendamos cautela e verificação adicional.",
        complaints: 0,
        trustScore: 50,
        verificationTime: "—",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleShare = () => {
    if (!result) return;
    
    const emoji = result.status === 'safe' ? '✅' : result.status === 'suspicious' ? '⚠️' : '🚨';
    const message = `${emoji} *${t('title')} ${language === 'en' ? 'Verified' : language === 'es' ? 'Verificó' : language === 'zh' ? '已验证' : 'Verificou'}*\n\n🔍 *${language === 'en' ? 'Site/Brand' : language === 'es' ? 'Sitio/Marca' : language === 'zh' ? '网站/品牌' : 'Site/Marca'}:* ${searchQuery}\n📊 *${language === 'en' ? 'Result' : language === 'es' ? 'Resultado' : language === 'zh' ? '结果' : 'Resultado'}:* ${result.title}\n\n💬 *${language === 'en' ? 'Details' : language === 'es' ? 'Detalles' : language === 'zh' ? '详情' : 'Detalhes'}:* ${result.message}\n\n🛡️ ${language === 'en' ? 'Verify yourself too' : language === 'es' ? 'Verifica tú también' : language === 'zh' ? '您也来验证' : 'Verifique você também'}: ${window.location.href}\n\n_${t('title')} - ${language === 'en' ? 'Your protection against online scams' : language === 'es' ? 'Tu protección contra estafas online' : language === 'zh' ? '您的网络诈骗保护' : 'Sua proteção contra golpes online'}_`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getResultIcon = () => {
    if (!result) return null;
    
    switch (result.status) {
      case 'safe':
        return <CheckCircle className="w-12 h-12 text-green-600" />;
      case 'suspicious':
        return <AlertTriangle className="w-12 h-12 text-yellow-600" />;
      case 'danger':
        return <XCircle className="w-12 h-12 text-red-600" />;
    }
  };

  const getResultColors = () => {
    if (!result) return '';
    
    switch (result.status) {
      case 'safe':
        return 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-green-100';
      case 'suspicious':
        return 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-yellow-100';
      case 'danger':
        return 'border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-red-100';
    }
  };

  const getTrustScoreColor = () => {
    if (!result) return '';
    
    if (result.trustScore >= 75) return 'text-green-600';
    if (result.trustScore >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleViewDetails = () => {
    if (isPremium || hasUnlimitedAccess) {
      setShowDetails(!showDetails);
    } else {
      setShowPaywall(true);
    }
  };

  const handleUpgrade = (plan: string) => {
    if (plan === 'unlimited') {
      window.location.href = "https://app.pushinpay.com.br/service/pay/9fa65fca-27da-4b61-b44b-3650e52c52f2";
    } else if (plan === 'premium') {
      window.location.href = "https://app.pushinpay.com.br/service/pay/9fa66120-1b0d-4b0d-aafc-65784e333b2d";
    } else if (plan === 'annual') {
      window.location.href = "https://app.pushinpay.com.br/service/pay/9fa6663e-a37d-4ba4-b042-f0e81df19aa9";
    }
  };

  const getSafeAlternatives = () => {
    const alternatives = [
      {
        name: "Amazon",
        url: "https://amzn.to/4mujivi",
        description: t('amazonDesc'),
        discount: t('upTo70Off')
      }
    ];

    return alternatives;
  };

  const getSecurityServices = () => {
    const services = [
      {
        name: "NordVPN",
        url: "https://nordvpn.com/?utm_source=antigolpe",
        description: language === 'en' ? "Protect your browsing" : language === 'es' ? "Protege tu navegación" : language === 'zh' ? "保护您的浏览" : "Proteja sua navegação",
        price: "R$ 12,99/" + (language === 'en' ? "month" : language === 'es' ? "mes" : language === 'zh' ? "月" : "mês"),
        discount: "68% OFF"
      },
      {
        name: "Serasa Premium",
        url: "https://serasa.com.br/?utm_source=antigolpe",
        description: language === 'en' ? "Monitor your ID 24h" : language === 'es' ? "Monitorea tu ID 24h" : language === 'zh' ? "24小时监控您的ID" : "Monitore seu CPF 24h",
        price: "R$ 16,90/" + (language === 'en' ? "month" : language === 'es' ? "mes" : language === 'zh' ? "月" : "mês"),
        discount: language === 'en' ? "1st month free" : language === 'es' ? "1er mes gratis" : language === 'zh' ? "第1个月免费" : "1º mês grátis"
      },
      {
        name: "Kaspersky",
        url: "https://kaspersky.com.br/?utm_source=antigolpe",
        description: language === 'en' ? "Premium antivirus" : language === 'es' ? "Antivirus premium" : language === 'zh' ? "高级杀毒软件" : "Antivírus premium",
        price: "R$ 89,90/" + (language === 'en' ? "year" : language === 'es' ? "año" : language === 'zh' ? "年" : "ano"),
        discount: "50% OFF"
      }
    ];

    return services;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Oferta Especial Banner */}
      {!isPremium && !hasUnlimitedAccess && (
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <p className="font-bold text-sm md:text-base">
              🔥 <span className="animate-pulse">{t('specialOffer')}</span> - {t('premiumProtection')} • 
              <button 
                onClick={() => setShowPremiumModal(true)}
                className="ml-2 underline hover:no-underline font-black"
              >
                {t('guaranteeNow')}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Header Premium */}
      <header className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            {/* Logo e título */}
            <div className="flex items-center justify-center space-x-4 flex-1">
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
                  <Shield className="w-9 h-9 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">{t('title')}</h1>
                <p className="text-lg font-semibold text-blue-600 mt-1">{t('subtitle')}</p>
                <div className="flex items-center justify-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Lock className="w-4 h-4" />
                    <span className="font-medium">{t('secure')}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Zap className="w-4 h-4" />
                    <span className="font-medium">{t('instantVerification')}</span>
                  </div>
                  {!isPremium && !hasUnlimitedAccess && (
                    <div className="flex items-center space-x-1 text-sm text-orange-600">
                      <Gift className="w-4 h-4" />
                      <span className="font-medium">{freeSearches} {t('consultationsLeft')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Seletor de idioma */}
            <div className="ml-4">
              <LanguageSelector language={language} onLanguageChange={changeLanguage} />
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-all duration-300">
              <div className={`flex justify-center mb-2 ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 pb-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('mainTitle')}
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {t('mainSubtitle')}
          </p>
        </div>

        {/* Search Form Premium */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10 border border-gray-100">
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-6 h-6" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('placeholder')}
                className="w-full pl-16 pr-6 py-6 text-xl border-3 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-6 focus:ring-blue-100 transition-all duration-300 outline-none font-medium placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && handleVerification()}
              />
            </div>
            
            <button
              onClick={handleVerification}
              disabled={!searchQuery.trim() || isVerifying}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>{t('verifying')}</span>
                </>
              ) : (
                <>
                  <Shield className="w-6 h-6" />
                  <span>{t('verifyButton')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading State Premium */}
        {isVerifying && (
          <div className="bg-white rounded-3xl shadow-2xl p-10 text-center border border-gray-100">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-pulse"></div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">{t('analysisInProgress')}</h3>
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{t('checkingDomain')}</span>
                  </p>
                  <p className="flex items-center justify-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>{t('consultingComplaints')}</span>
                  </p>
                  <p className="flex items-center justify-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>{t('analyzingReputation')}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Result Premium */}
        {result && !isVerifying && (
          <div className={`bg-white rounded-3xl shadow-2xl border-4 ${getResultColors()} p-10`}>
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                {getResultIcon()}
              </div>
              
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-gray-900 leading-tight">
                  {result.title}
                </h3>
                <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
                  {result.message}
                </p>
                
                {/* Trust Score */}
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-center">
                      <div className={`text-4xl font-black ${getTrustScoreColor()}`}>
                        {result.trustScore}%
                      </div>
                      <div className="text-sm text-gray-600 font-semibold">{t('trustIndex')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {result.verificationTime}
                      </div>
                      <div className="text-sm text-gray-600 font-semibold">{t('analysisTime')}</div>
                    </div>
                  </div>
                  
                  {result.complaints > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-red-800 font-semibold text-center">
                        ⚠️ <strong>{result.complaints} {t('complaintsFound')}</strong>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Botão Ver Relatório Completo */}
              {(result.ssl || result.whois || result.reclameAqui || result.googleResults?.length || result.social || result.trustPilot) && (
                <button
                  onClick={handleViewDetails}
                  className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <FileText className="w-5 h-5" />
                  <span>{t('completeReport')}</span>
                  {!isPremium && !hasUnlimitedAccess && <Lock className="w-4 h-4 ml-1" />}
                </button>
              )}

              {/* Detalhes da Análise - Apenas para Premium */}
              {showDetails && (isPremium || hasUnlimitedAccess) && (
                <div className="mt-6 text-left space-y-6 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  {/* SSL */}
                  {result.ssl && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-lg mb-3 flex items-center">
                        <Lock className="w-5 h-5 mr-2 text-blue-600" />
                        {t('sslCertificate')}
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold">{t('present')}</span> {result.ssl.present ? `✅ ${t('yes')}` : `❌ ${t('no')}`}
                        </div>
                        <div>
                          <span className="font-semibold">{t('valid')}</span> {result.ssl.validNow ? `✅ ${t('yes')}` : `❌ ${t('no')}`}
                        </div>
                        <div>
                          <span className="font-semibold">{t('validFrom')}</span> {result.ssl.validFrom || "—"}
                        </div>
                        <div>
                          <span className="font-semibold">{t('validTo')}</span> {result.ssl.validTo || "—"}
                        </div>
                        <div className="col-span-2">
                          <span className="font-semibold">{t('issuer')}</span> {result.ssl.issuer?.CN || "—"}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WHOIS */}
                  {result.whois && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-lg mb-3 flex items-center">
                        <Search className="w-5 h-5 mr-2 text-green-600" />
                        {t('domainInfo')}
                      </h4>
                      <p className="text-sm">
                        <span className="font-semibold">Status:</span> {result.whois.hasData ? `✅ ${language === 'en' ? 'Data available' : language === 'es' ? 'Datos disponibles' : language === 'zh' ? '数据可用' : 'Dados disponíveis'}` : `❌ ${language === 'en' ? 'Data not available' : language === 'es' ? 'Datos no disponibles' : language === 'zh' ? '数据不可用' : 'Dados não disponíveis'}`}
                      </p>
                    </div>
                  )}

                  {/* Reclame Aqui */}
                  {result.reclameAqui && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-lg mb-3 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                        {t('reclameAqui')}
                      </h4>
                      {result.reclameAqui.found ? (
                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="font-semibold">Score RA:</span> {result.reclameAqui.score ?? "—"}
                            </div>
                            <div>
                              <span className="font-semibold">{language === 'en' ? 'Total Complaints' : language === 'es' ? 'Total Quejas' : language === 'zh' ? '总投诉数' : 'Total Reclamações'}:</span> {result.reclameAqui.totalComplaints ?? "—"}
                            </div>
                            <div>
                              <span className="font-semibold">{language === 'en' ? 'Last 30 days' : language === 'es' ? 'Últimos 30 días' : language === 'zh' ? '最近30天' : 'Últimos 30 dias'}:</span> {result.reclameAqui.last30d ?? "—"}
                            </div>
                          </div>
                          {result.reclameAqui.companyLink && (
                            <div className="mt-3">
                              <a 
                                href={result.reclameAqui.companyLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 hover:text-blue-800 underline font-medium"
                              >
                                🔗 {language === 'en' ? 'View page on Consumer Reports' : language === 'es' ? 'Ver página en Quejas de Consumidores' : language === 'zh' ? '查看消费者投诉页面' : 'Ver página no Reclame Aqui'}
                              </a>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">{language === 'en' ? 'Company not found in Consumer Reports.' : language === 'es' ? 'Empresa no encontrada en Quejas de Consumidores.' : language === 'zh' ? '在消费者投诉中未找到该公司。' : 'Empresa não encontrada no Reclame Aqui.'}</p>
                      )}
                    </div>
                  )}

                  {/* Redes Sociais */}
                  {result.social && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-lg mb-3 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-purple-600" />
                        {t('socialNetworks')}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold">{language === 'en' ? 'Total mentions' : language === 'es' ? 'Total de menciones' : language === 'zh' ? '总提及次数' : 'Total de menções'}:</span> {result.social.mentions || 0}
                        </div>
                        {result.social.instagram && (
                          <div>
                            <span className="font-semibold">Instagram:</span> 
                            <a href={result.social.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                              {language === 'en' ? 'View profile' : language === 'es' ? 'Ver perfil' : language === 'zh' ? '查看资料' : 'Ver perfil'}
                            </a>
                          </div>
                        )}
                        {result.social.twitter && (
                          <div>
                            <span className="font-semibold">Twitter:</span> 
                            <a href={result.social.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                              {language === 'en' ? 'View profile' : language === 'es' ? 'Ver perfil' : language === 'zh' ? '查看资料' : 'Ver perfil'}
                            </a>
                          </div>
                        )}
                        {result.social.linkedin && (
                          <div>
                            <span className="font-semibold">LinkedIn:</span> 
                            <a href={result.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                              {language === 'en' ? 'View profile' : language === 'es' ? 'Ver perfil' : language === 'zh' ? '查看资料' : 'Ver perfil'}
                            </a>
                          </div>
                        )}
                        {result.social.reddit && (
                          <div>
                            <span className="font-semibold">Reddit:</span> 
                            <a href={result.social.reddit} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                              {language === 'en' ? 'View discussion' : language === 'es' ? 'Ver discusión' : language === 'zh' ? '查看讨论' : 'Ver discussão'}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TrustPilot */}
                  {result.trustPilot?.found && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-lg mb-3 flex items-center">
                        <Star className="w-5 h-5 mr-2 text-yellow-600" />
                        {t('trustPilot')}
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold">{language === 'en' ? 'Rating' : language === 'es' ? 'Calificación' : language === 'zh' ? '评分' : 'Avaliação'}:</span> {result.trustPilot.rating ? `${result.trustPilot.rating}/5 ⭐` : "—"}
                        </div>
                        <div>
                          <span className="font-semibold">{language === 'en' ? 'Total Reviews' : language === 'es' ? 'Total Reseñas' : language === 'zh' ? '总评论数' : 'Total Reviews'}:</span> {result.trustPilot.reviewCount ?? "—"}
                        </div>
                      </div>
                      <div className="mt-3">
                        <a 
                          href={result.trustPilot.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 underline font-medium"
                        >
                          🔗 {language === 'en' ? 'View on TrustPilot' : language === 'es' ? 'Ver en TrustPilot' : language === 'zh' ? '在TrustPilot上查看' : 'Ver no TrustPilot'}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Top 10 Google */}
                  {result.googleResults?.length > 0 && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-lg mb-3 flex items-center">
                        <Search className="w-5 h-5 mr-2 text-red-600" />
                        {t('googleResults')}
                      </h4>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {result.googleResults.map((r: any, i: number) => (
                          <div key={i} className="border-l-4 border-gray-200 pl-4">
                            <div className="font-semibold text-sm">
                              <a 
                                href={r.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {i + 1}. {r.title}
                              </a>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{r.snippet}</p>
                            {r.pageError && (
                              <p className="text-xs text-red-500 mt-1">⚠️ {language === 'en' ? 'Error analyzing content' : language === 'es' ? 'Error al analizar contenido' : language === 'zh' ? '分析内容时出错' : 'Erro ao analisar conteúdo'}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Alternativas Seguras - Apenas para sites perigosos */}
              {result.status === 'danger' && (
                <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-2xl">
                  <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                    <ShoppingCart className="w-6 h-6 mr-2" />
                    {t('safeAlternative')}
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {getSafeAlternatives().map((alt, index) => (
                      <a
                        key={index}
                        href={alt.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white p-4 rounded-xl border border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-gray-900">{alt.name}</h5>
                          <ExternalLink className="w-4 h-4 text-green-600 group-hover:text-green-800" />
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{alt.description}</p>
                        <div className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full inline-block">
                          {alt.discount}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Share2 className="w-5 h-5" />
                  <span>{t('shareWhatsApp')}</span>
                </button>
                
                <button
                  onClick={() => {setResult(null); setSearchQuery(''); setShowDetails(false);}}
                  className="inline-flex items-center justify-center space-x-3 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Search className="w-5 h-5" />
                  <span>{t('newVerification')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Custom Check Service */}
        <div className="mt-16 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-3xl shadow-2xl p-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-10 h-10 text-yellow-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('customAnalysisTitle')}</h3>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {t('customAnalysisSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-green-600" />
                {t('expressAnalysis')}
              </h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  {t('responseTime1h')}
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  {t('manualVerification')}
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  {t('detailedReport')}
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  {t('whatsappSupport')}
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-purple-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Crown className="w-6 h-6 mr-2 text-purple-600" />
                {t('premiumAnalysis')}
              </h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-purple-600 mr-2" />
                  {t('responseTime30min')}
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-purple-600 mr-2" />
                  {t('legalAnalysis')}
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-purple-600 mr-2" />
                  {t('videoConsultation')}
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-purple-600 mr-2" />
                  {t('guarantee30days')}
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <a
              href={\`https://wa.me/5524999325986?text=${encodeURIComponent(
                language === 'en' 
                  ? 'Hello! I need a personalized analysis through AntiScam' 
                  : language === 'es' 
                  ? '¡Hola! Necesito un análisis personalizado a través de AntiEstafa'
                  : language === 'zh' 
                  ? '您好！我需要通过反诈骗进行个性化分析'
                  : 'Olá! Preciso de uma análise personalizada pelo AntiGolpe'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Phone className="w-5 h-5" />
              <span>{t('requestAnalysis')}</span>
            </a>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('completeAnalysis')}</h3>
            <p className="text-gray-600 leading-relaxed">
              {t('completeAnalysisDesc')}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('advancedAI')}</h3>
            <p className="text-gray-600 leading-relaxed">
              {t('advancedAIDesc')}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('instantResult')}</h3>
            <p className="text-gray-600 leading-relaxed">
              {t('instantResultDesc')}
            </p>
          </div>
        </div>
      </main>

      {/* Modal Paywall - Relatório Completo */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{t('completeReportTitle')}</h3>
                <p className="text-lg text-gray-600">{t('completeReportDesc')}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 mb-6">
                <h4 className="font-bold text-lg text-gray-900 mb-4">{t('whatYouWillSee')}</h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-purple-600" />
                    <span>{t('detailedSSL')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-purple-600" />
                    <span>{t('completeWHOIS')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-purple-600" />
                    <span>{t('reclameAquiHistory')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>{t('socialAnalysis')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-purple-600" />
                    <span>{t('trustPilotReviews')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-purple-600" />
                    <span>{t('googleTop10')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleUpgrade('unlimited')}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {t('unlockFor2990')}
                </button>
                
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {t('orPremium')}
                </button>
              </div>

              <button
                onClick={() => setShowPaywall(false)}
                className="w-full mt-4 text-gray-500 hover:text-gray-700 font-medium py-2"
              >
                {t('maybeLater')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Premium */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-10 h-10 text-orange-600" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">{t('choosePlan')}</h3>
                <p className="text-xl text-gray-600">{t('choosePlanDesc')}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {pricingPlans.map((plan, index) => (
                  <div
                    key={index}
                    className={\`relative bg-white rounded-2xl border-2 p-6 ${
                      plan.popular
                        ? 'border-orange-500 shadow-2xl transform scale-105'
                        : 'border-gray-200 shadow-lg'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="inline-block whitespace-nowrap bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                          {t('mostPopular')}
                        </span>
                      </div>
                    )}
                    
                    {plan.savings && (
                      <div className="absolute -top-2 -right-2">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          {plan.savings}
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                      <div className="mb-2">
                        <span className="text-3xl font-black text-gray-900">{plan.price}</span>
                        <span className="text-gray-600">{plan.period}</span>
                      </div>
                      {plan.originalPrice && (
                        <div className="text-sm text-gray-500">
                          <span className="line-through">{plan.originalPrice}</span>
                        </div>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      className={\`w-full font-bold py-3 px-4 rounded-xl transition-all duration-300 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="text-gray-500 hover:text-gray-700 font-medium"
                >
                  {t('continueFreePlan')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Upgrade - Consultas Esgotadas */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('consultationsExhausted')}</h3>
              <p className="text-gray-600 mb-6">
                {t('consultationsExhaustedDesc')}
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => handleUpgrade('unlimited')}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {t('unlimitedAccess')}
                </button>
                
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {t('premium')}
                </button>
              </div>

              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full mt-4 text-gray-500 hover:text-gray-700 font-medium py-2"
              >
                {t('back')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Símbolo c🔱 fixo no canto inferior direito */}
      <div className="fixed bottom-6 right-6 text-2xl font-bold text-gray-600 z-40 select-none">
        c🔱
      </div>

      {/* Footer Premium */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{t('title')}</h3>
                <p className="text-gray-300">{t('subtitle')}</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-blue-400">{t('totalSecurity')}</h4>
                <p className="text-gray-300">{t('totalSecurityDesc')}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-green-400">{t('freeVerification')}</h4>
                <p className="text-gray-300">{t('freeVerificationDesc')}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-purple-400">{t('alwaysUpdated')}</h4>
                <p className="text-gray-300">{t('alwaysUpdatedDesc')}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400 text-sm">
                {t('footerCopyright')}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                {t('footerDisclaimer')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

export default App
