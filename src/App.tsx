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

const translations = {
  pt: {
    title: "Fraudara",
    subtitle: "Proteção Nacional Contra Fraudes",
    secure: "100% Seguro",
    instantVerification: "Verificação Instantânea",
    consultationsLeft: "consultas restantes",
    
    specialOffer: "OFERTA ESPECIAL",
    premiumProtection: "Proteção Premium por apenas R$12/mês",
    guaranteeNow: "GARANTIR AGORA →",
    
    sitesVerified: "Sites Verificados",
    usersProtected: "Usuários Protegidos",
    accuracy: "Precisão",
    fraudsPrevented: "Golpes Evitados",
    
    mainTitle: "Verifique Qualquer Site ou Marca em Segundos",
    mainSubtitle: "Nossa inteligência artificial analisa milhões de dados em tempo real para proteger você contra golpes online",
    placeholder: "Digite o URL do site ou nome da marca (ex: loja-promocoes.com)",
    verifyButton: "Verificar Agora - GRÁTIS",
    verifying: "Verificando Segurança...",
    
    analysisInProgress: "🔍 Análise em Andamento",
    checkingDomain: "Verificando domínio e certificados SSL...",
    consultingComplaints: "Consultando base de reclamações...",
    analyzingReputation: "Analisando reputação online...",
    
    trustIndex: "Índice de Confiança",
    analysisTime: "Tempo de Análise",
    complaintsFound: "reclamações encontradas nos últimos 30 dias",
    completeReport: "Ver Relatório Completo",
    shareWhatsApp: "Compartilhar no WhatsApp",
    newVerification: "Nova Verificação",
    
    sslCertificate: "Certificado SSL/TLS",
    domainInfo: "Informações do Domínio (WHOIS)",
    reclameAqui: "Reclame Aqui",
    socialNetworks: "Presença em Redes Sociais",
    trustPilot: "TrustPilot",
    googleResults: "Top 10 Resultados Google",
    
    present: "Presente:",
    valid: "Válido:",
    validFrom: "Válido de:",
    validTo: "Válido até:",
    issuer: "Emissor:",
    yes: "Sim",
    no: "Não",
    
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
    
    completeAnalysis: "Análise Completa",
    completeAnalysisDesc: "Verificamos domínio, SSL, Reclame Aqui, redes sociais e mais de 50 fontes de dados",
    advancedAI: "IA Avançada",
    advancedAIDesc: "Nossa inteligência artificial processa milhões de dados em tempo real para máxima precisão",
    instantResult: "Resultado Instantâneo",
    instantResultDesc: "Veredito claro e confiável em segundos, com índice de confiança e detalhes completos",
    
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
    
    choosePlan: "Proteção Premium",
    choosePlanDesc: "Escolha o plano ideal para sua proteção",
    mostPopular: "🔥 MAIS POPULAR",
    continueFreePlan: "Continuar com plano gratuito",
    
    safeAlternative: "Alternativa 100% Segura",
    amazonDesc: "Maior e-commerce do mundo",
    upTo70Off: "Até 70% OFF",
    
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
    title: "Fraudara",
    subtitle: "National Fraud Protection",
    secure: "100% Secure",
    instantVerification: "Instant Verification",
    consultationsLeft: "free checks remaining",
    
    specialOffer: "SPECIAL OFFER",
    premiumProtection: "Premium Protection for only $12/month",
    guaranteeNow: "GET NOW →",
    
    sitesVerified: "Sites Verified",
    usersProtected: "Users Protected",
    accuracy: "Accuracy",
    fraudsPrevented: "Frauds Prevented",
    
    mainTitle: "Verify Any Website or Brand in Seconds",
    mainSubtitle: "Our artificial intelligence analyzes millions of data in real time to protect you against online scams",
    placeholder: "Enter website URL or brand name (e.g. promo-store.com)",
    verifyButton: "Verify Now - FREE",
    verifying: "Verifying Security...",
    
    analysisInProgress: "🔍 Analysis in Progress",
    checkingDomain: "Checking domain and SSL certificates...",
    consultingComplaints: "Consulting complaints database...",
    analyzingReputation: "Analyzing online reputation...",
    
    trustIndex: "Trust Index",
    analysisTime: "Analysis Time",
    complaintsFound: "complaints found in the last 30 days",
    completeReport: "View Complete Report",
    shareWhatsApp: "Share on WhatsApp",
    newVerification: "New Verification",
    
    sslCertificate: "SSL/TLS Certificate",
    domainInfo: "Domain Information (WHOIS)",
    reclameAqui: "Consumer Reports",
    socialNetworks: "Social Media Presence",
    trustPilot: "TrustPilot",
    googleResults: "Top 10 Google Results",
    
    present: "Present:",
    valid: "Valid:",
    validFrom: "Valid from:",
    validTo: "Valid until:",
    issuer: "Issuer:",
    yes: "Yes",
    no: "No",
    
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
    
    completeAnalysis: "Complete Analysis",
    completeAnalysisDesc: "We verify domain, SSL, consumer reports, social networks and over 50 data sources",
    advancedAI: "Advanced AI",
    advancedAIDesc: "Our artificial intelligence processes millions of data in real time for maximum accuracy",
    instantResult: "Instant Result",
    instantResultDesc: "Clear and reliable verdict in seconds, with trust index and complete details",
    
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
    
    choosePlan: "Premium Protection",
    choosePlanDesc: "Choose the ideal plan for your protection",
    mostPopular: "🔥 MOST POPULAR",
    continueFreePlan: "Continue with free plan",
    
    safeAlternative: "100% Safe Alternative",
    amazonDesc: "World's largest e-commerce",
    upTo70Off: "Up to 70% OFF",
    
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
    title: "Fraudara",
    subtitle: "Protección Nacional Contra Fraudes",
    secure: "100% Seguro",
    instantVerification: "Verificación Instantánea",
    consultationsLeft: "consultas restantes",
    
    specialOffer: "OFERTA ESPECIAL",
    premiumProtection: "Protección Premium por solo $12/mes",
    guaranteeNow: "OBTENER AHORA →",
    
    sitesVerified: "Sitios Verificados",
    usersProtected: "Usuarios Protegidos",
    accuracy: "Precisión",
    fraudsPrevented: "Estafas Evitadas",
    
    mainTitle: "Verifica Cualquier Sitio Web o Marca en Segundos",
    mainSubtitle: "Nuestra inteligencia artificial analiza millones de datos en tiempo real para protegerte contra estafas online",
    placeholder: "Ingresa el URL del sitio o el nombre de la marca (ej: tienda-promociones.com)",
    verifyButton: "Verificar Ahora - GRATIS",
    verifying: "Verificando Seguridad...",
    
    analysisInProgress: "🔍 Análisis en Progreso",
    checkingDomain: "Verificando dominio y certificados SSL...",
    consultingComplaints: "Consultando base de quejas...",
    analyzingReputation: "Analizando reputación online...",
    
    trustIndex: "Índice de Confianza",
    analysisTime: "Tiempo de Análisis",
    complaintsFound: "quejas encontradas en los últimos 30 días",
    completeReport: "Ver Informe Completo",
    shareWhatsApp: "Compartir en WhatsApp",
    newVerification: "Nueva Verificación",
    
    sslCertificate: "Certificado SSL/TLS",
    domainInfo: "Información del Dominio (WHOIS)",
    reclameAqui: "Quejas de Consumidores",
    socialNetworks: "Presencia en Redes Sociales",
    trustPilot: "TrustPilot",
    googleResults: "Top 10 Resultados Google",
    
    present: "Presente:",
    valid: "Válido:",
    validFrom: "Válido desde:",
    validTo: "Válido hasta:",
    issuer: "Emisor:",
    yes: "Sí",
    no: "No",
    
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
    
    completeAnalysis: "Análisis Completo",
    completeAnalysisDesc: "Verificamos dominio, SSL, quejas de consumidores, redes sociales y más de 50 fuentes de datos",
    advancedAI: "IA Avanzada",
    advancedAIDesc: "Nuestra inteligencia artificial procesa millones de datos en tiempo real para máxima precisión",
    instantResult: "Resultado Instantáneo",
    instantResultDesc: "Veredicto claro y confiable en segundos, con índice de confianza y detalles completos",
    
    oneTimePayment: "Pago Único",
    unlimited: "Consultas ilimitadas",
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
    
    Exhausted: "🔒 Consultas Agotadas",
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
    
    choosePlan: "Protección Premium",
    choosePlanDesc: "Elige el plan ideal para tu protección",
    mostPopular: "🔥 MÁS POPULAR",
    continueFreePlan: "Continuar con plan gratuito",
    
    safeAlternative: "Alternativa 100% Segura",
    amazonDesc: "El mayor e-commerce del mundo",
    upTo70Off: "Hasta 70% OFF",
    
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
    title: "反诈骗",
    subtitle: "国家防诈骗保护",
    secure: "100% 安全",
    instantVerification: "即时验证",
    consultationsLeft: "剩余查询次数",
    
    specialOffer: "特别优惠",
    premiumProtection: "高级保护仅需每月$12",
    guaranteeNow: "立即获取 →",
    
    sitesVerified: "已验证网站",
    usersProtected: "受保护用户",
    accuracy: "准确率",
    fraudsPrevented: "已阻止诈骗",
    
    mainTitle: "在几秒钟内验证任何网站或品牌",
    mainSubtitle: "我们的人工智能实时分析数百万数据，保护您免受网络诈骗",
    placeholder: "输入品牌名称或网站URL（例：促销商店.com）",
    verifyButton: "立即验证 - 免费",
    verifying: "正在验证安全性...",
    
    analysisInProgress: "🔍 分析进行中",
    checkingDomain: "正在检查域名和SSL证书...",
    consultingComplaints: "正在查询投诉数据库...",
    analyzingReputation: "正在分析在线声誉...",
    
    trustIndex: "信任指数",
    analysisTime: "分析时间",
    complaintsFound: "在过去30天内发现的投诉",
    completeReport: "查看完整报告",
    shareWhatsApp: "在WhatsApp上分享",
    newVerification: "新验证",
    
    sslCertificate: "SSL/TLS证书",
    domainInfo: "域名信息（WHOIS）",
    reclameAqui: "消费者投诉",
    socialNetworks: "社交媒体存在",
    trustPilot: "TrustPilot",
    googleResults: "Google前10结果",
    
    present: "存在：",
    valid: "有效：",
    validFrom: "有效期从：",
    validTo: "有效期至：",
    issuer: "颁发者：",
    yes: "是",
    no: "否",
    
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
    
    completeAnalysis: "完整分析",
    completeAnalysisDesc: "我们验证域名、SSL、消费者投诉、社交网络和50多个数据源",
    advancedAI: "先进AI",
    advancedAIDesc: "我们的人工智能实时处理数百万数据以获得最大准确性",
    instantResult: "即时结果",
    instantResultDesc: "几秒钟内得到清晰可靠的判决，包含信任指数和完整详情",
    
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
    
    totalSecurity: "🛡️ 全面安全",
    totalSecurityDesc: "您的数据受到银行级加密保护",
    freeVerification: "✅ 免费验证",
    freeVerificationDesc: "5次免费查询保护每个人",
    alwaysUpdated: "🚀 始终更新",
    alwaysUpdatedDesc: "数据库24/7实时更新",
    footerCopyright: "© 2025 反诈骗 - 自2024年以来保护人们免受在线诈骗",
    footerDisclaimer: "数字安全意识教育工具 • 巴西制造 🇧🇷"
  },

  fr: {
    title: "Fraudara",
    subtitle: "Protection Nationale Contre les Fraudes",
    secure: "100% Sécurisé",
    instantVerification: "Vérification Instantanée",
    consultationsLeft: "consultations restantes",
    
    specialOffer: "OFFRE SPÉCIALE",
    premiumProtection: "Protection Premium pour seulement 12€/mois",
    guaranteeNow: "OBTENIR MAINTENANT →",
    
    sitesVerified: "Sites Vérifiés",
    usersProtected: "Utilisateurs Protégés",
    accuracy: "Précision",
    fraudsPrevented: "Arnaques Évitées",
    
    mainTitle: "Vérifiez N'importe Quel Site ou Marque en Secondes",
    mainSubtitle: "Notre intelligence artificielle analyse des millions de données en temps réel pour vous protéger contre les arnaques en ligne",
    placeholder: "Entrez le nom de la marque ou l'URL du site (ex: boutique-promos.com)",
    verifyButton: "Vérifier Maintenant - GRATUIT",
    verifying: "Vérification de la Sécurité...",
    
    analysisInProgress: "🔍 Analyse en Cours",
    checkingDomain: "Vérification du domaine et des certificats SSL...",
    consultingComplaints: "Consultation de la base de plaintes...",
    analyzingReputation: "Analyse de la réputation en ligne...",
    
    trustIndex: "Indice de Confiance",
    analysisTime: "Temps d'Analyse",
    complaintsFound: "plaintes trouvées dans les 30 derniers jours",
    completeReport: "Voir le Rapport Complet",
    shareWhatsApp: "Partager sur WhatsApp",
    newVerification: "Nouvelle Vérification",
    
    sslCertificate: "Certificat SSL/TLS",
    domainInfo: "Informations du Domaine (WHOIS)",
    reclameAqui: "Rapports de Consommateurs",
    socialNetworks: "Présence sur les Réseaux Sociaux",
    trustPilot: "TrustPilot",
    googleResults: "Top 10 Résultats Google",
    
    present: "Présent:",
    valid: "Valide:",
    validFrom: "Valide de:",
    validTo: "Valide jusqu'à:",
    issuer: "Émetteur:",
    yes: "Oui",
    no: "Non",
    
    customAnalysisTitle: "Analyse Personnalisée Premium",
    customAnalysisSubtitle: "Besoin d'une analyse détaillée de documents, d'IDs d'entreprise, de contrats ou de propositions d'investissement? Notre équipe d'experts effectue une vérification manuelle complète en 1 heure.",
    expressAnalysis: "Analyse Express - 49,90€",
    premiumAnalysis: "Analyse Premium - 99,90€",
    responseTime1h: "Réponse en 1 heure",
    manualVerification: "Vérification manuelle par des experts",
    detailedReport: "Rapport détaillé en PDF",
    whatsappSupport: "Support par WhatsApp",
    responseTime30min: "Réponse en 30 minutes",
    legalAnalysis: "Analyse juridique incluse",
    videoConsultation: "Consultation par vidéo",
    guarantee30days: "Garantie de 30 jours",
    requestAnalysis: "Demander une Analyse via WhatsApp",
    
    completeAnalysis: "Analyse Complète",
    completeAnalysisDesc: "Nous vérifions le domaine, SSL, les rapports de consommateurs, les réseaux sociaux et plus de 50 sources de données",
    advancedAI: "IA Avancée",
    advancedAIDesc: "Notre intelligence artificielle traite des millions de données en temps réel pour une précision maximale",
    instantResult: "Résultat Instantané",
    instantResultDesc: "Verdict clair et fiable en secondes, avec indice de confiance et détails complets",
    
    oneTimePayment: "Paiement Unique",
    unlimitedConsultations: "Consultations illimitées",
    completeReports: "Rapports complets",
    detailedAnalysis: "Analyse détaillée",
    emailSupport: "Support par email",
    unlockNow: "Débloquer Maintenant",
    
    protectionPremium: "Protection Premium",
    monitoring247: "Surveillance 24/7",
    whatsappAlerts: "Alertes WhatsApp/Email",
    vipSiteList: "Liste VIP de sites",
    prioritySupport: "Support prioritaire",
    unlockPremiumNow: "Débloquer Premium Maintenant",
    
    annualProtection: "Protection Annuelle",
    freeMonths: "2 mois gratuits",
    customAnalysisFeature: "Analyses personnalisées",
    specializedConsulting: "Conseil spécialisé",
    businessReports: "Rapports d'entreprise",
    bestOffer: "Meilleure Offre",
    
    consultationsExhausted: "🔒 Consultations Épuisées",
    consultationsExhaustedDesc: "Vous avez utilisé vos 5 consultations gratuites. Débloquez l'accès illimité maintenant!",
    unlimitedAccess: "🚀 Accès Illimité - 29,90€",
    premium: "👑 Premium - 12€/mois",
    back: "Retour",
    maybeLater: "Peut-être plus tard",
    
    completeReportTitle: "📊 Rapport Complet",
    completeReportDesc: "Débloquer tous les détails de l'analyse",
    whatYouWillSee: "🔓 Ce que vous verrez:",
    detailedSSL: "Certificats SSL détaillés",
    completeWHOIS: "Informations WHOIS complètes",
    reclameAquiHistory: "Historique des rapports de consommateurs",
    socialAnalysis: "Analyse des réseaux sociaux",
    trustPilotReviews: "Avis TrustPilot",
    googleTop10: "Top 10 résultats Google",
    unlockFor2990: "🚀 Débloquer pour 29,90€ (Une fois)",
    orPremium: "👑 Ou Premium pour 12€/mois",
    
    choosePlan: "👑 Protection Premium",
    choosePlanDesc: "Choisissez le plan idéal pour votre protection",
    mostPopular: "🔥 LE PLUS POPULAIRE",
    continueFreePlan: "Continuer avec le plan gratuit",
    
    safeAlternative: "Alternative 100% Sûre",
    amazonDesc: "Le plus grand e-commerce du monde",
    upTo70Off: "Jusqu'à 70% DE RÉDUCTION",
    
    totalSecurity: "🛡️ Sécurité Totale",
    totalSecurityDesc: "Vos données sont protégées avec un chiffrement de niveau bancaire",
    freeVerification: "✅ Vérification Gratuite",
    freeVerificationDesc: "5 consultations gratuites pour protéger tout le monde",
    alwaysUpdated: "🚀 Toujours À Jour",
    alwaysUpdatedDesc: "Base de données mise à jour en temps réel 24/7",
    footerCopyright: "© 2025 AntiArnaque - Protégeant les gens contre les fraudes en ligne depuis 2024",
    footerDisclaimer: "Outil éducatif pour la sensibilisation à la sécurité numérique • Fabriqué au Brésil 🇧🇷"
  },

  de: {
    title: "Fraudara",
    subtitle: "Nationaler Betrugsschutz",
    secure: "100% Sicher",
    instantVerification: "Sofortige Überprüfung",
    consultationsLeft: "Beratungen übrig",
    
    specialOffer: "SONDERANGEBOT",
    premiumProtection: "Premium-Schutz für nur 12€/Monat",
    guaranteeNow: "JETZT SICHERN →",
    
    sitesVerified: "Überprüfte Websites",
    usersProtected: "Geschützte Nutzer",
    accuracy: "Genauigkeit",
    fraudsPrevented: "Verhinderte Betrügereien",
    
    mainTitle: "Überprüfen Sie Jede Website oder Marke in Sekunden",
    mainSubtitle: "Unsere künstliche Intelligenz analysiert Millionen von Daten in Echtzeit, um Sie vor Online-Betrug zu schützen",
    placeholder: "Geben Sie den Markennamen oder die Website-URL ein (z.B. shop-angebote.com)",
    verifyButton: "Jetzt Überprüfen - KOSTENLOS",
    verifying: "Sicherheit wird überprüft...",
    
    analysisInProgress: "🔍 Analyse läuft",
    checkingDomain: "Überprüfung von Domain und SSL-Zertifikaten...",
    consultingComplaints: "Beschwerdeunterlagen werden konsultiert...",
    analyzingReputation: "Online-Reputation wird analysiert...",
    
    trustIndex: "Vertrauensindex",
    analysisTime: "Analysezeit",
    complaintsFound: "Beschwerden in den letzten 30 Tagen gefunden",
    completeReport: "Vollständigen Bericht anzeigen",
    shareWhatsApp: "Auf WhatsApp teilen",
    newVerification: "Neue Überprüfung",
    
    sslCertificate: "SSL/TLS-Zertifikat",
    domainInfo: "Domain-Informationen (WHOIS)",
    reclameAqui: "Verbraucherberichte",
    socialNetworks: "Präsenz in sozialen Medien",
    trustPilot: "TrustPilot",
    googleResults: "Top 10 Google-Ergebnisse",
    
    present: "Vorhanden:",
    valid: "Gültig:",
    validFrom: "Gültig von:",
    validTo: "Gültig bis:",
    issuer: "Aussteller:",
    yes: "Ja",
    no: "Nein",
    
    customAnalysisTitle: "Premium Maßgeschneiderte Analyse",
    customAnalysisSubtitle: "Benötigen Sie eine detaillierte Analyse von Dokumenten, Unternehmens-IDs, Verträgen oder Investitionsvorschlägen? Unser Expertenteam führt eine vollständige manuelle Überprüfung innerhalb von 1 Stunde durch.",
    expressAnalysis: "Express-Analyse - 49,90€",
    premiumAnalysis: "Premium-Analyse - 99,90€",
    responseTime1h: "Antwort innerhalb von 1 Stunde",
    manualVerification: "Manuelle Überprüfung durch Experten",
    detailedReport: "Detaillierter PDF-Bericht",
    whatsappSupport: "WhatsApp-Support",
    responseTime30min: "Antwort innerhalb von 30 Minuten",
    legalAnalysis: "Rechtliche Analyse enthalten",
    videoConsultation: "Video-Beratung",
    guarantee30days: "30-Tage-Garantie",
    requestAnalysis: "Analyse über WhatsApp anfordern",
    
    completeAnalysis: "Vollständige Analyse",
    completeAnalysisDesc: "Wir überprüfen Domain, SSL, Verbraucherberichte, soziale Netzwerke und über 50 Datenquellen",
    advancedAI: "Fortgeschrittene KI",
    advancedAIDesc: "Unsere künstliche Intelligenz verarbeitet Millionen von Daten in Echtzeit für maximale Genauigkeit",
    instantResult: "Sofortiges Ergebnis",
    instantResultDesc: "Klares und zuverlässiges Urteil in Sekunden, mit Vertrauensindex und vollständigen Details",
    
    oneTimePayment: "Einmalige Zahlung",
    unlimitedConsultations: "Unbegrenzte Beratungen",
    completeReports: "Vollständige Berichte",
    detailedAnalysis: "Detaillierte Analyse",
    emailSupport: "E-Mail-Support",
    unlockNow: "Jetzt freischalten",
    
    protectionPremium: "Premium-Schutz",
    monitoring247: "24/7-Überwachung",
    whatsappAlerts: "WhatsApp/E-Mail-Benachrichtigungen",
    vipSiteList: "VIP-Site-Liste",
    prioritySupport: "Prioritäts-Support",
    unlockPremiumNow: "Premium jetzt freischalten",
    
    annualProtection: "Jahresschutz",
    freeMonths: "2 Monate gratis",
    customAnalysisFeature: "Maßgeschneiderte Analysen",
    specializedConsulting: "Spezialisierte Beratung",
    businessReports: "Geschäftsberichte",
    bestOffer: "Bestes Angebot",
    
    consultationsExhausted: "🔒 Beratungen Erschöpft",
    consultationsExhaustedDesc: "Sie haben Ihre 5 kostenlosen Beratungen genutzt. Schalten Sie jetzt unbegrenzten Zugang frei!",
    unlimitedAccess: "🚀 Unbegrenzter Zugang - 29,90€",
    premium: "👑 Premium - 12€/Monat",
    back: "Zurück",
    maybeLater: "Vielleicht später",
    
    completeReportTitle: "📊 Vollständiger Bericht",
    completeReportDesc: "Alle Analysedetails freischalten",
    whatYouWillSee: "🔓 Was Sie sehen werden:",
    detailedSSL: "Detaillierte SSL-Zertifikate",
    completeWHOIS: "Vollständige WHOIS-Informationen",
    reclameAquiHistory: "Verbraucherberichtsverlauf",
    socialAnalysis: "Social-Media-Analyse",
    trustPilotReviews: "TrustPilot-Bewertungen",
    googleTop10: "Top 10 Google-Ergebnisse",
    unlockFor2990: "🚀 Für 29,90€ freischalten (Einmalig)",
    orPremium: "👑 Oder Premium für 12€/Monat",
    
    choosePlan: "👑 Premium-Schutz",
    choosePlanDesc: "Wählen Sie den idealen Plan für Ihren Schutz",
    mostPopular: "🔥 AM BELIEBTESTEN",
    continueFreePlan: "Mit kostenlosem Plan fortfahren",
    
    safeAlternative: "100% Sichere Alternative",
    amazonDesc: "Weltgrößter E-Commerce",
    upTo70Off: "Bis zu 70% RABATT",
    
    totalSecurity: "🛡️ Totale Sicherheit",
    totalSecurityDesc: "Ihre Daten sind mit bankentauglicher Verschlüsselung geschützt",
    freeVerification: "✅ Kostenlose Überprüfung",
    freeVerificationDesc: "5 kostenlose Beratungen zum Schutz aller",
    alwaysUpdated: "🚀 Immer Aktuell",
    alwaysUpdatedDesc: "Datenbank 24/7 in Echtzeit aktualisiert",
    footerCopyright: "© 2025 AntiBetrug - Schutz von Menschen vor Online-Betrug seit 2024",
    footerDisclaimer: "Bildungswerkzeug für digitale Sicherheit • Hergestellt in Brasilien 🇧🇷"
  },

  ar: {
    title: "مكافح الاحتيال",
    subtitle: "الحماية الوطنية ضد الاحتيال",
    secure: "100% آمن",
    instantVerification: "التحقق الفوري",
    consultationsLeft: "استشارات متبقية",
    
    specialOffer: "عرض خاص",
    premiumProtection: "الحماية المميزة بـ 12$ فقط شهرياً",
    guaranteeNow: "احصل عليها الآن ←",
    
    sitesVerified: "المواقع المتحققة",
    usersProtected: "المستخدمون المحميون",
    accuracy: "الدقة",
    fraudsPrevented: "الاحتيال المنع",
    
    mainTitle: "تحقق من أي موقع أو علامة تجارية في ثوانٍ",
    mainSubtitle: "يحلل ذكاؤنا الاصطناعي ملايين البيانات في الوقت الفعلي لحمايتك من الاحتيال عبر الإنترنت",
    placeholder: "أدخل اسم العلامة التجارية أو رابط الموقع (مثل: متجر-العروض.com)",
    verifyButton: "تحقق الآن - مجاناً",
    verifying: "جاري التحقق من الأمان...",
    
    analysisInProgress: "🔍 التحليل جارٍ",
    checkingDomain: "فحص النطاق وشهادات SSL...",
    consultingComplaints: "استشارة قاعدة الشكاوى...",
    analyzingReputation: "تحليل السمعة عبر الإنترنت...",
    
    trustIndex: "مؤشر الثقة",
    analysisTime: "وقت التحليل",
    complaintsFound: "شكاوى وجدت في آخر 30 يوماً",
    completeReport: "عرض التقرير الكامل",
    shareWhatsApp: "مشاركة على واتساب",
    newVerification: "تحقق جديد",
    
    sslCertificate: "شهادة SSL/TLS",
    domainInfo: "معلومات النطاق (WHOIS)",
    reclameAqui: "تقارير المستهلكين",
    socialNetworks: "الحضور في وسائل التواصل الاجتماعي",
    trustPilot: "TrustPilot",
    googleResults: "أفضل 10 نتائج جوجل",
    
    present: "موجود:",
    valid: "صالح:",
    validFrom: "صالح من:",
    validTo: "صالح حتى:",
    issuer: "المُصدر:",
    yes: "نعم",
    no: "لا",
    
    customAnalysisTitle: "التحليل المخصص المميز",
    customAnalysisSubtitle: "تحتاج إلى تحليل مفصل للوثائق أو معرفات الشركة أو العقود أو مقترحات الاستثمار؟ يقوم فريق الخبراء لدينا بإجراء تحقق يدوي كامل خلال ساعة واحدة.",
    expressAnalysis: "التحليل السريع - 49.90$",
    premiumAnalysis: "التحليل المميز - 99.90$",
    responseTime1h: "الرد خلال ساعة واحدة",
    manualVerification: "التحقق اليدوي من قبل الخبراء",
    detailedReport: "تقرير مفصل بصيغة PDF",
    whatsappSupport: "دعم عبر واتساب",
    responseTime30min: "الرد خلال 30 دقيقة",
    legalAnalysis: "التحليل القانوني مشمول",
    videoConsultation: "استشارة بالفيديو",
    guarantee30days: "ضمان لمدة 30 يوماً",
    requestAnalysis: "طلب التحليل عبر واتساب",
    
    completeAnalysis: "التحليل الكامل",
    completeAnalysisDesc: "نتحقق من النطاق وSSL وتقارير المستهلكين ووسائل التواصل الاجتماعي وأكثر من 50 مصدر بيانات",
    advancedAI: "الذكاء الاصطناعي المتقدم",
    advancedAIDesc: "يعالج ذكاؤنا الاصطناعي ملايين البيانات في الوقت الفعلي للحصول على أقصى دقة",
    instantResult: "النتيجة الفورية",
    instantResultDesc: "حكم واضح وموثوق في ثوانٍ، مع مؤشر الثقة والتفاصيل الكاملة",
    
    oneTimePayment: "دفعة واحدة",
    unlimitedConsultations: "استشارات غير محدودة",
    completeReports: "تقارير كاملة",
    detailedAnalysis: "تحليل مفصل",
    emailSupport: "دعم عبر البريد الإلكتروني",
    unlockNow: "فتح الآن",
    
    protectionPremium: "الحماية المميزة",
    monitoring247: "مراقبة على مدار الساعة",
    whatsappAlerts: "تنبيهات واتساب/البريد الإلكتروني",
    vipSiteList: "قائمة VIP للمواقع",
    prioritySupport: "دعم أولوية",
    unlockPremiumNow: "فتح المميز الآن",
    
    annualProtection: "الحماية السنوية",
    freeMonths: "شهران مجاناً",
    customAnalysisFeature: "تحليلات مخصصة",
    specializedConsulting: "استشارة متخصصة",
    businessReports: "تقارير الأعمال",
    bestOffer: "أفضل عرض",
    
    consultationsExhausted: "🔒 نفدت الاستشارات",
    consultationsExhaustedDesc: "لقد استخدمت استشاراتك المجانية الـ5. افتح الوصول غير المحدود الآن!",
    unlimitedAccess: "🚀 وصول غير محدود - 29.90$",
    premium: "👑 مميز - 12$/شهر",
    back: "العودة",
    maybeLater: "ربما لاحقاً",
    
    completeReportTitle: "📊 التقرير الكامل",
    completeReportDesc: "فتح جميع تفاصيل التحليل",
    whatYouWillSee: "🔓 ما ستراه:",
    detailedSSL: "شهادات SSL مفصلة",
    completeWHOIS: "معلومات WHOIS كاملة",
    reclameAquiHistory: "تاريخ تقارير المستهلكين",
    socialAnalysis: "تحليل وسائل التواصل الاجتماعي",
    trustPilotReviews: "مراجعات TrustPilot",
    googleTop10: "أفضل 10 نتائج جوجل",
    unlockFor2990: "🚀 فتح بـ 29.90$ (مرة واحدة)",
    orPremium: "👑 أو المميز بـ 12$/شهر",
    
    choosePlan: "👑 الحماية المميزة",
    choosePlanDesc: "اختر الخطة المثالية لحمايتك",
    mostPopular: "🔥 الأكثر شعبية",
    continueFreePlan: "المتابعة مع الخطة المجانية",
    
    safeAlternative: "البديل الآمن 100%",
    amazonDesc: "أكبر متجر إلكتروني في العالم",
    upTo70Off: "خصم يصل إلى 70%",
    
    totalSecurity: "🛡️ الأمان التام",
    totalSecurityDesc: "بياناتك محمية بتشفير على مستوى البنوك",
    freeVerification: "✅ التحقق المجاني",
    freeVerificationDesc: "5 استشارات مجانية لحماية الجميع",
    alwaysUpdated: "🚀 محدث دائماً",
    alwaysUpdatedDesc: "قاعدة البيانات محدثة في الوقت الفعلي 24/7",
    footerCopyright: "© 2025 مكافح الاحتيال - حماية الناس ضد الاحتيال عبر الإنترنت منذ 2024",
    footerDisclaimer: "أداة تعليمية للتوعية بالأمان الرقمي • صنع في البرازيل 🇧🇷"
  },

  ja: {
    title: "詐欺対策",
    subtitle: "国家詐欺防止保護",
    secure: "100% 安全",
    instantVerification: "即時検証",
    consultationsLeft: "相談回数残り",
    
    specialOffer: "特別オファー",
    premiumProtection: "プレミアム保護が月額わずか$12",
    guaranteeNow: "今すぐ入手 →",
    
    sitesVerified: "検証済みサイト",
    usersProtected: "保護されたユーザー",
    accuracy: "精度",
    fraudsPrevented: "防止された詐欺",
    
    mainTitle: "数秒でウェブサイトやブランドを検証",
    mainSubtitle: "私たちの人工知能は、オンライン詐欺からあなたを守るために、数百万のデータをリアルタイムで分析します",
    placeholder: "ブランド名またはサイトのURLを入力してください（例：店舗-プロモーション.com）",
    verifyButton: "今すぐ検証 - 無料",
    verifying: "セキュリティを検証中...",
    
    analysisInProgress: "🔍 分析進行中",
    checkingDomain: "ドメインとSSL証明書を確認中...",
    consultingComplaints: "苦情データベースを照会中...",
    analyzingReputation: "オンライン評判を分析中...",
    
    trustIndex: "信頼指数",
    analysisTime: "分析時間",
    complaintsFound: "過去30日間に見つかった苦情",
    completeReport: "完全なレポートを表示",
    shareWhatsApp: "WhatsAppで共有",
    newVerification: "新しい検証",
    
    sslCertificate: "SSL/TLS証明書",
    domainInfo: "ドメイン情報（WHOIS）",
    reclameAqui: "消費者レポート",
    socialNetworks: "ソーシャルメディアでの存在",
    trustPilot: "TrustPilot",
    googleResults: "Google上位10結果",
    
    present: "存在:",
    valid: "有効:",
    validFrom: "有効期間開始:",
    validTo: "有効期間終了:",
    issuer: "発行者:",
    yes: "はい",
    no: "いいえ",
    
    customAnalysisTitle: "プレミアムカスタム分析",
    customAnalysisSubtitle: "文書、会社ID、契約書、投資提案の詳細分析が必要ですか？当社の専門家チームが1時間以内に完全な手動検証を行います。",
    expressAnalysis: "エクスプレス分析 - $49.90",
    premiumAnalysis: "プレミアム分析 - $99.90",
    responseTime1h: "1時間以内に回答",
    manualVerification: "専門家による手動検証",
    detailedReport: "詳細なPDFレポート",
    whatsappSupport: "WhatsAppサポート",
    responseTime30min: "30分以内に回答",
    legalAnalysis: "法的分析を含む",
    videoConsultation: "ビデオ相談",
    guarantee30days: "30日間保証",
    requestAnalysis: "WhatsAppで分析を依頼",
    
    completeAnalysis: "完全な分析",
    completeAnalysisDesc: "ドメイン、SSL、消費者レポート、ソーシャルネットワーク、50以上のデータソースを検証します",
    advancedAI: "高度なAI",
    advancedAIDesc: "私たちの人工知能は、最大の精度のためにリアルタイムで数百万のデータを処理します",
    instantResult: "即時結果",
    instantResultDesc: "数秒で明確で信頼できる判定、信頼指数と完全な詳細付き",
    
    oneTimePayment: "一回払い",
    unlimitedConsultations: "無制限の相談",
    completeReports: "完全なレポート",
    detailedAnalysis: "詳細な分析",
    emailSupport: "メールサポート",
    unlockNow: "今すぐロック解除",
    
    protectionPremium: "プレミアム保護",
    monitoring247: "24/7監視",
    whatsappAlerts: "WhatsApp/メールアラート",
    vipSiteList: "VIPサイトリスト",
    prioritySupport: "優先サポート",
    unlockPremiumNow: "プレミアムを今すぐロック解除",
    
    annualProtection: "年間保護",
    freeMonths: "2ヶ月無料",
    customAnalysisFeature: "カスタム分析",
    specializedConsulting: "専門コンサルティング",
    businessReports: "ビジネスレポート",
    bestOffer: "最高のオファー",
    
    consultationsExhausted: "🔒 相談回数終了",
    consultationsExhaustedDesc: "5回の無料相談を使い切りました。今すぐ無制限アクセスをロック解除しましょう！",
    unlimitedAccess: "🚀 無制限アクセス - $29.90",
    premium: "👑 プレミアム - $12/月",
    back: "戻る",
    maybeLater: "後で",
    
    completeReportTitle: "📊 完全なレポート",
    completeReportDesc: "すべての分析詳細をロック解除",
    whatYouWillSee: "🔓 表示される内容:",
    detailedSSL: "詳細なSSL証明書",
    completeWHOIS: "完全なWHOIS情報",
    reclameAquiHistory: "消費者レポート履歴",
    socialAnalysis: "ソーシャルメディア分析",
    trustPilotReviews: "TrustPilotレビュー",
    googleTop10: "Google上位10結果",
    unlockFor2990: "🚀 $29.90でロック解除（一回）",
    orPremium: "👑 またはプレミアム$12/月",
    
    choosePlan: "👑 プレミアム保護",
    choosePlanDesc: "あなたの保護に最適なプランを選択",
    mostPopular: "🔥 最も人気",
    continueFreePlan: "無料プランで続行",
    
    safeAlternative: "100%安全な代替案",
    amazonDesc: "世界最大のeコマース",
    upTo70Off: "最大70%オフ",
    
    totalSecurity: "🛡️ 完全なセキュリティ",
    totalSecurityDesc: "あなたのデータは銀行レベルの暗号化で保護されています",
    freeVerification: "✅ 無料検証",
    freeVerificationDesc: "皆を守るための5回の無料相談",
    alwaysUpdated: "🚀 常に更新",
    alwaysUpdatedDesc: "データベースは24/7リアルタイムで更新",
    footerCopyright: "© 2025 詐欺対策 - 2024年からオンライン詐欺から人々を保護",
    footerDisclaimer: "デジタルセキュリティ意識のための教育ツール • ブラジル製 🇧🇷"
  },

  ru: {
    title: "АнтиМошенничество",
    subtitle: "Национальная Защита от Мошенничества",
    secure: "100% Безопасно",
    instantVerification: "Мгновенная Проверка",
    consultationsLeft: "консультаций осталось",
    
    specialOffer: "СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ",
    premiumProtection: "Премиум Защита всего за $12/месяц",
    guaranteeNow: "ПОЛУЧИТЬ СЕЙЧАС →",
    
    sitesVerified: "Проверенных Сайтов",
    usersProtected: "Защищенных Пользователей",
    accuracy: "Точность",
    fraudsPrevented: "Предотвращено Мошенничества",
    
    mainTitle: "Проверьте Любой Сайт или Бренд за Секунды",
    mainSubtitle: "Наш искусственный интеллект анализирует миллионы данных в реальном времени, чтобы защитить вас от онлайн-мошенничества",
    placeholder: "Введите название бренда или URL сайта (например: магазин-акции.com)",
    verifyButton: "Проверить Сейчас - БЕСПЛАТНО",
    verifying: "Проверка Безопасности...",
    
    analysisInProgress: "🔍 Анализ в Процессе",
    checkingDomain: "Проверка домена и SSL сертификатов...",
    consultingComplaints: "Консультация базы жалоб...",
    analyzingReputation: "Анализ онлайн репутации...",
    
    trustIndex: "Индекс Доверия",
    analysisTime: "Время Анализа",
    complaintsFound: "жалоб найдено за последние 30 дней",
    completeReport: "Посмотреть Полный Отчет",
    shareWhatsApp: "Поделиться в WhatsApp",
    newVerification: "Новая Проверка",
    
    sslCertificate: "SSL/TLS Сертификат",
    domainInfo: "Информация о Домене (WHOIS)",
    reclameAqui: "Отчеты Потребителей",
    socialNetworks: "Присутствие в Социальных Сетях",
    trustPilot: "TrustPilot",
    googleResults: "Топ 10 Результатов Google",
    
    present: "Присутствует:",
    valid: "Действителен:",
    validFrom: "Действителен с:",
    validTo: "Действителен до:",
    issuer: "Издатель:",
    yes: "Да",
    no: "Нет",
    
    customAnalysisTitle: "Премиум Персонализированный Анализ",
    customAnalysisSubtitle: "Нужен детальный анализ документов, ID компаний, контрактов или инвестиционных предложений? Наша команда экспертов проводит полную ручную проверку в течение 1 часа.",
    expressAnalysis: "Экспресс Анализ - $49.90",
    premiumAnalysis: "Премиум Анализ - $99.90",
    responseTime1h: "Ответ в течение 1 часа",
    manualVerification: "Ручная проверка экспертами",
    detailedReport: "Детальный PDF отчет",
    whatsappSupport: "Поддержка через WhatsApp",
    responseTime30min: "Ответ в течение 30 минут",
    legalAnalysis: "Правовой анализ включен",
    videoConsultation: "Видео консультация",
    guarantee30days: "Гарантия 30 дней",
    requestAnalysis: "Запросить Анализ через WhatsApp",
    
    completeAnalysis: "Полный Анализ",
    completeAnalysisDesc: "Мы проверяем домен, SSL, отчеты потребителей, социальные сети и более 50 источников данных",
    advancedAI: "Продвинутый ИИ",
    advancedAIDesc: "Наш искусственный интеллект обрабатывает миллионы данных в реальном времени для максимальной точности",
    instantResult: "Мгновенный Результат",
    instantResultDesc: "Четкий и надежный вердикт за секунды, с индексом доверия и полными деталями",
    
    oneTimePayment: "Единовременный Платеж",
    unlimitedConsultations: "Неограниченные консультации",
    completeReports: "Полные отчеты",
    detailedAnalysis: "Детальный анализ",
    emailSupport: "Поддержка по email",
    unlockNow: "Разблокировать Сейчас",
    
    protectionPremium: "Премиум Защита",
    monitoring247: "Мониторинг 24/7",
    whatsappAlerts: "Уведомления WhatsApp/Email",
    vipSiteList: "VIP список сайтов",
    prioritySupport: "Приоритетная поддержка",
    unlockPremiumNow: "Разблокировать Премиум Сейчас",
    
    annualProtection: "Годовая Защита",
    freeMonths: "2 месяца бесплатно",
    customAnalysisFeature: "Персонализированные анализы",
    specializedConsulting: "Специализированные консультации",
    businessReports: "Бизнес отчеты",
    bestOffer: "Лучшее Предложение",
    
    consultationsExhausted: "🔒 Консультации Исчерпаны",
    consultationsExhaustedDesc: "Вы использовали свои 5 бесплатных консультаций. Разблокируйте неограниченный доступ сейчас!",
    unlimitedAccess: "🚀 Неограниченный Доступ - $29.90",
    premium: "👑 Премиум - $12/месяц",
    back: "Назад",
    maybeLater: "Может быть позже",
    
    completeReportTitle: "📊 Полный Отчет",
    completeReportDesc: "Разблокировать все детали анализа",
    whatYouWillSee: "🔓 Что вы увидите:",
    detailedSSL: "Детальные SSL сертификаты",
    completeWHOIS: "Полная WHOIS информация",
    reclameAquiHistory: "История отчетов потребителей",
    socialAnalysis: "Анализ социальных сетей",
    trustPilotReviews: "Отзывы TrustPilot",
    googleTop10: "Топ 10 результатов Google",
    unlockFor2990: "🚀 Разблокировать за $29.90 (Единовременно)",
    orPremium: "👑 Или Премиум за $12/месяц",
    
    choosePlan: "👑 Премиум Защита",
    choosePlanDesc: "Выберите идеальный план для вашей защиты",
    mostPopular: "🔥 САМЫЙ ПОПУЛЯРНЫЙ",
    continueFreePlan: "Продолжить с бесплатным планом",
    
    safeAlternative: "100% Безопасная Альтернатива",
    amazonDesc: "Крупнейший интернет-магазин в мире",
    upTo70Off: "До 70% СКИДКА",
    
    totalSecurity: "🛡️ Полная Безопасность",
    totalSecurityDesc: "Ваши данные защищены шифрованием банковского уровня",
    freeVerification: "✅ Бесплатная Проверка",
    freeVerificationDesc: "5 бесплатных консультаций для защиты всех",
    alwaysUpdated: "🚀 Всегда Обновлено",
    alwaysUpdatedDesc: "База данных обновляется в реальном времени 24/7",
    footerCopyright: "© 2025 АнтиМошенничество - Защищаем людей от онлайн мошенничества с 2024",
    footerDisclaimer: "Образовательный инструмент для повышения осведомленности о цифровой безопасности • Сделано в Бразилии 🇧🇷"
  },

  hi: {
    title: "धोखाधड़ी विरोधी",
    subtitle: "राष्ट्रीय धोखाधड़ी संरक्षण",
    secure: "100% सुरक्षित",
    instantVerification: "तत्काल सत्यापन",
    consultationsLeft: "परामर्श शेष",
    
    specialOffer: "विशेष प्रस्ताव",
    premiumProtection: "प्रीमियम सुरक्षा केवल $12/माह में",
    guaranteeNow: "अभी प्राप्त करें →",
    
    sitesVerified: "सत्यापित साइटें",
    usersProtected: "संरक्षित उपयोगकर्ता",
    accuracy: "सटीकता",
    fraudsPrevented: "रोकी गई धोखाधड़ी",
    
    mainTitle: "कुछ ही सेकंड में किसी भी वेबसाइट या ब्रांड की जांच करें",
    mainSubtitle: "हमारी कृत्रिम बुद्धिमत्ता आपको ऑनलाइन धोखाधड़ी से बचाने के लिए वास्तविक समय में लाखों डेटा का विश्लेषण करती है",
    placeholder: "ब्रांड का नाम या वेबसाइट URL दर्ज करें (उदाहरण: दुकान-प्रमोशन.com)",
    verifyButton: "अभी सत्यापित करें - मुफ्त",
    verifying: "सुरक्षा सत्यापन...",
    
    analysisInProgress: "🔍 विश्लेषण प्रगति में",
    checkingDomain: "डोमेन और SSL प्रमाणपत्र जांच रहे हैं...",
    consultingComplaints: "शिकायत डेटाबेस से परामर्श...",
    analyzingReputation: "ऑनलाइन प्रतिष्ठा का विश्लेषण...",
    
    trustIndex: "विश्वास सूचकांक",
    analysisTime: "विश्लेषण समय",
    complaintsFound: "पिछले 30 दिनों में मिली शिकायतें",
    completeReport: "पूरी रिपोर्ट देखें",
    shareWhatsApp: "WhatsApp पर साझा करें",
    newVerification: "नया सत्यापन",
    
    sslCertificate: "SSL/TLS प्रमाणपत्र",
    domainInfo: "डोमेन जानकारी (WHOIS)",
    reclameAqui: "उपभोक्ता रिपोर्ट",
    socialNetworks: "सामाजिक मीडिया उपस्थिति",
    trustPilot: "TrustPilot",
    googleResults: "टॉप 10 Google परिणाम",
    
    present: "उपस्थित:",
    valid: "वैध:",
    validFrom: "से वैध:",
    validTo: "तक वैध:",
    issuer: "जारीकर्ता:",
    yes: "हाँ",
    no: "नहीं",
    
    customAnalysisTitle: "प्रीमियम कस्टम विश्लेषण",
    customAnalysisSubtitle: "दस्तावेज़ों, कंपनी आईडी, अनुबंधों या निवेश प्रस्तावों के विस्तृत विश्लेषण की आवश्यकता है? हमारी विशेषज्ञ टीम 1 घंटे के भीतर पूर्ण मैनुअल सत्यापन करती है।",
    expressAnalysis: "एक्सप्रेस विश्लेषण - $49.90",
    premiumAnalysis: "प्रीमियम विश्लेषण - $99.90",
    responseTime1h: "1 घंटे में जवाब",
    manualVerification: "विशेषज्ञों द्वारा मैनुअल सत्यापन",
    detailedReport: "विस्तृत PDF रिपोर्ट",
    whatsappSupport: "WhatsApp सहायता",
    responseTime30min: "30 मिनट में जवाब",
    legalAnalysis: "कानूनी विश्लेषण शामिल",
    videoConsultation: "वीडियो परामर्श",
    guarantee30days: "30 दिन की गारंटी",
    requestAnalysis: "WhatsApp के माध्यम से विश्लेषण का अनुरोध करें",
    
    completeAnalysis: "पूर्ण विश्लेषण",
    completeAnalysisDesc: "हम डोमेन, SSL, उपभोक्ता रिपोर्ट, सामाजिक नेटवर्क और 50+ डेटा स्रोतों को सत्यापित करते हैं",
    advancedAI: "उन्नत एआई",
    advancedAIDesc: "हमारी कृत्रिम बुद्धिमत्ता अधिकतम सटीकता के लिए वास्तविक समय में लाखों डेटा प्रोसेस करती है",
    instantResult: "तत्काल परिणाम",
    instantResultDesc: "सेकंडों में स्पष्ट और विश्वसनीय फैसला, विश्वास सूचकांक और पूर्ण विवरण के साथ",
    
    oneTimePayment: "एक बार भुगतान",
    unlimitedConsultations: "असीमित परामर्श",
    completeReports: "पूर्ण रिपोर्ट",
    detailedAnalysis: "विस्तृत विश्लेषण",
    emailSupport: "ईमेल सहायता",
    unlockNow: "अभी अनलॉक करें",
    
    protectionPremium: "प्रीमियम सुरक्षा",
    monitoring247: "24/7 निगरानी",
    whatsappAlerts: "WhatsApp/ईमेल अलर्ट",
    vipSiteList: "VIP साइट सूची",
    prioritySupport: "प्राथमिकता सहायता",
    unlockPremiumNow: "प्रीमियम अभी अनलॉक करें",
    
    annualProtection: "वार्षिक सुरक्षा",
    freeMonths: "2 महीने मुफ्त",
    customAnalysisFeature: "कस्टम विश्लेषण",
    specializedConsulting: "विशेष परामर्श",
    businessReports: "व्यापारिक रिपोर्ट",
    bestOffer: "सर्वोत्तम प्रस्ताव",
    
    consultationsExhausted: "🔒 परामर्श समाप्त",
    consultationsExhaustedDesc: "आपने अपने 5 मुफ्त परामर्श का उपयोग कर लिया है। अभी असीमित पहुंच अनलॉक करें!",
    unlimitedAccess: "🚀 असीमित पहुंच - $29.90",
    premium: "👑 प्रीमियम - $12/माह",
    back: "वापस",
    maybeLater: "शायद बाद में",
    
    completeReportTitle: "📊 पूरी रिपोर्ट",
    completeReportDesc: "सभी विश्लेषण विवरण अनलॉक करें",
    whatYouWillSee: "🔓 आप क्या देखेंगे:",
    detailedSSL: "विस्तृत SSL प्रमाणपत्र",
    completeWHOIS: "पूर्ण WHOIS जानकारी",
    reclameAquiHistory: "उपभोक्ता रिपोर्ट इतिहास",
    socialAnalysis: "सामाजिक मीडिया विश्लेषण",
    trustPilotReviews: "TrustPilot समीक्षाएं",
    googleTop10: "टॉप 10 Google परिणाम",
    unlockFor2990: "🚀 $29.90 में अनलॉक करें (एक बार)",
    orPremium: "👑 या प्रीमियम $12/माह में",
    
    choosePlan: "👑 प्रीमियम सुरक्षा",
    choosePlanDesc: "अपनी सुरक्षा के लिए आदर्श योजना चुनें",
    mostPopular: "🔥 सबसे लोकप्रिय",
    continueFreePlan: "मुफ्त योजना के साथ जारी रखें",
    
    safeAlternative: "100% सुरक्षित विकल्प",
    amazonDesc: "दुनिया का सबसे बड़ा ई-कॉमर्स",
    upTo70Off: "70% तक छूट",
    
    totalSecurity: "🛡️ संपूर्ण सुरक्षा",
    totalSecurityDesc: "आपका डेटा बैंक-स्तरीय एन्क्रिप्शन से सुरक्षित है",
    freeVerification: "✅ मुफ्त सत्यापन",
    freeVerificationDesc: "सभी की सुरक्षा के लिए 5 मुफ्त परामर्श",
    alwaysUpdated: "🚀 हमेशा अपडेटेड",
    alwaysUpdatedDesc: "डेटाबेस 24/7 वास्तविक समय में अपडेटेड",
    footerCopyright: "© 2025 धोखाधड़ी विरोधी - 2024 से ऑनलाइन धोखाधड़ी से लोगों की सुरक्षा",
    footerDisclaimer: "डिजिटल सुरक्षा जागरूकता के लिए शिक्षा उपकरण • ब्राजील में निर्मित 🇧🇷"
  },

  it: {
    title: "Fraudara",
    subtitle: "Protezione Nazionale Contro le Frodi",
    secure: "100% Sicuro",
    instantVerification: "Verifica Istantanea",
    consultationsLeft: "consultazioni rimanenti",
    
    specialOffer: "OFFERTA SPECIALE",
    premiumProtection: "Protezione Premium per soli €12/mese",
    guaranteeNow: "OTTIENI ORA →",
    
    sitesVerified: "Siti Verificati",
    usersProtected: "Utenti Protetti",
    accuracy: "Precisione",
    fraudsPrevented: "Truffe Prevenute",
    
    mainTitle: "Verifica Qualsiasi Sito Web o Marchio in Secondi",
    mainSubtitle: "La nostra intelligenza artificiale analizza milioni di dati in tempo reale per proteggerti dalle truffe online",
    placeholder: "Inserisci il nome del marchio o l'URL del sito (es: negozio-promozioni.com)",
    verifyButton: "Verifica Ora - GRATUITO",
    verifying: "Verifica della Sicurezza...",
    
    analysisInProgress: "🔍 Analisi in Corso",
    checkingDomain: "Verifica dominio e certificati SSL...",
    consultingComplaints: "Consultazione database reclami...",
    analyzingReputation: "Analisi della reputazione online...",
    
    trustIndex: "Indice di Fiducia",
    analysisTime: "Tempo di Analisi",
    complaintsFound: "reclami trovati negli ultimi 30 giorni",
    completeReport: "Visualizza Rapporto Completo",
    shareWhatsApp: "Condividi su WhatsApp",
    newVerification: "Nuova Verifica",
    
    sslCertificate: "Certificato SSL/TLS",
    domainInfo: "Informazioni Dominio (WHOIS)",
    reclameAqui: "Rapporti Consumatori",
    socialNetworks: "Presenza sui Social Media",
    trustPilot: "TrustPilot",
    googleResults: "Top 10 Risultati Google",
    
    present: "Presente:",
    valid: "Valido:",
    validFrom: "Valido da:",
    validTo: "Valido fino a:",
    issuer: "Emittente:",
    yes: "Sì",
    no: "No",
    
    customAnalysisTitle: "Analisi Personalizzata Premium",
    customAnalysisSubtitle: "Hai bisogno di un'analisi dettagliata di documenti, ID aziendali, contratti o proposte di investimento? Il nostro team di esperti esegue una verifica manuale completa entro 1 ora.",
    expressAnalysis: "Analisi Express - €49,90",
    premiumAnalysis: "Analisi Premium - €99,90",
    responseTime1h: "Risposta entro 1 ora",
    manualVerification: "Verifica manuale da parte di esperti",
    detailedReport: "Rapporto dettagliato in PDF",
    whatsappSupport: "Supporto via WhatsApp",
    responseTime30min: "Risposta entro 30 minuti",
    legalAnalysis: "Analisi legale inclusa",
    videoConsultation: "Consulenza video",
    guarantee30days: "Garanzia di 30 giorni",
    requestAnalysis: "Richiedi Analisi via WhatsApp",
    
    completeAnalysis: "Analisi Completa",
    completeAnalysisDesc: "Verifichiamo dominio, SSL, rapporti consumatori, social network e oltre 50 fonti di dati",
    advancedAI: "IA Avanzata",
    advancedAIDesc: "La nostra intelligenza artificiale elabora milioni di dati in tempo reale per la massima precisione",
    instantResult: "Risultato Istantaneo",
    instantResultDesc: "Verdetto chiaro e affidabile in secondi, con indice di fiducia e dettagli completi",
    
    oneTimePayment: "Pagamento Unico",
    unlimitedConsultations: "Consultazioni illimitate",
    completeReports: "Rapporti completi",
    detailedAnalysis: "Analisi dettagliata",
    emailSupport: "Supporto via email",
    unlockNow: "Sblocca Ora",
    
    protectionPremium: "Protezione Premium",
    monitoring247: "Monitoraggio 24/7",
    whatsappAlerts: "Avvisi WhatsApp/Email",
    vipSiteList: "Lista VIP siti",
    prioritySupport: "Supporto prioritario",
    unlockPremiumNow: "Sblocca Premium Ora",
    
    annualProtection: "Protezione Annuale",
    freeMonths: "2 mesi gratis",
    customAnalysisFeature: "Analisi personalizzate",
    specializedConsulting: "Consulenza specializzata",
    businessReports: "Rapporti aziendali",
    bestOffer: "Migliore Offerta",
    
    consultationsExhausted: "🔒 Consultazioni Esaurite",
    consultationsExhaustedDesc: "Hai utilizzato le tue 5 consultazioni gratuite. Sblocca l'accesso illimitato ora!",
    unlimitedAccess: "🚀 Accesso Illimitato - €29,90",
    premium: "👑 Premium - €12/mese",
    back: "Indietro",
    maybeLater: "Forse più tardi",
    
    completeReportTitle: "📊 Rapporto Completo",
    completeReportDesc: "Sblocca tutti i dettagli dell'analisi",
    whatYouWillSee: "🔓 Cosa vedrai:",
    detailedSSL: "Certificati SSL dettagliati",
    completeWHOIS: "Informazioni WHOIS complete",
    reclameAquiHistory: "Cronologia rapporti consumatori",
    socialAnalysis: "Analisi social media",
    trustPilotReviews: "Recensioni TrustPilot",
    googleTop10: "Top 10 risultati Google",
    unlockFor2990: "🚀 Sblocca per €29,90 (Una volta)",
    orPremium: "👑 O Premium per €12/mese",
    
    choosePlan: "👑 Protezione Premium",
    choosePlanDesc: "Scegli il piano ideale per la tua protezione",
    mostPopular: "🔥 PIÙ POPOLARE",
    continueFreePlan: "Continua con piano gratuito",
    
    safeAlternative: "Alternativa 100% Sicura",
    amazonDesc: "Il più grande e-commerce del mondo",
    upTo70Off: "Fino al 70% DI SCONTO",
    
    totalSecurity: "🛡️ Sicurezza Totale",
    totalSecurityDesc: "I tuoi dati sono protetti con crittografia di livello bancario",
    freeVerification: "✅ Verifica Gratuita",
    freeVerificationDesc: "5 consultazioni gratuite per proteggere tutti",
    alwaysUpdated: "🚀 Sempre Aggiornato",
    alwaysUpdatedDesc: "Database aggiornato in tempo reale 24/7",
    footerCopyright: "© 2025 AntiTruffa - Proteggendo le persone dalle truffe online dal 2024",
    footerDisclaimer: "Strumento educativo per la consapevolezza della sicurezza digitale • Realizzato in Brasile 🇧🇷"
  }
};

const useLanguage = () => {
  const [language, setLanguage] = useState('pt');
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('antigolpe_language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
      return;
    }
    
    const browserLang = navigator.language.toLowerCase();
    let detectedLang = 'pt'; 
    
    if (browserLang.includes('en')) detectedLang = 'en';
    else if (browserLang.includes('es')) detectedLang = 'es';
    else if (browserLang.includes('zh') || browserLang.includes('cn')) detectedLang = 'zh';
    else if (browserLang.includes('fr')) detectedLang = 'fr';
    else if (browserLang.includes('de')) detectedLang = 'de';
    else if (browserLang.includes('ar')) detectedLang = 'ar';
    else if (browserLang.includes('ja')) detectedLang = 'ja';
    else if (browserLang.includes('ru')) detectedLang = 'ru';
    else if (browserLang.includes('hi')) detectedLang = 'hi';
    else if (browserLang.includes('it')) detectedLang = 'it';
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

const LanguageSelector = ({ language, onLanguageChange }: { language: string, onLanguageChange: (lang: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷', short: 'PT' },
    { code: 'en', name: 'English', flag: '🇺🇸', short: 'EN' },
    { code: 'es', name: 'Español', flag: '🇪🇸', short: 'ES' },
    { code: 'zh', name: '中文', flag: '🇨🇳', short: '中文' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', short: 'FR' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', short: 'DE' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', short: 'AR' },
    { code: 'ja', name: '日本語', flag: '🇯🇵', short: '日本' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', short: 'RU' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', short: 'HI' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', short: 'IT' },
  ];
  
  const currentLang = languages.find(lang => lang.code === language) || languages[0];
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm"
      >
        <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
        <span className="hidden sm:inline text-sm font-medium text-gray-700">{currentLang.flag} {currentLang.name}</span>
        <span className="sm:hidden text-xs font-medium text-gray-700">{currentLang.flag} {currentLang.short}</span>
        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-600 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          {}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {}
          <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 w-48 max-h-64 overflow-y-auto">
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
                  <span className="text-lg flex-shrink-0">{lang.flag}</span>
                  <span className="text-sm truncate">{lang.name}</span>
                </span>
              </button>
            ))}
          </div>
        </>
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

    const path = window.location.pathname;

    if (path === "/premium-ativar") {
      setIsPremium(true);
      localStorage.setItem('antigolpe_premium', 'true');
      alert("✅ Proteção Premium ativada com sucesso!");
      window.location.href = "/"; 
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
      window.location.href = "/"; 
    }
  }, []);

  const stats: StatCard[] = [
    {
      icon: <Shield className="w-6 h-6" />,
      value: "7.2M+",
      label: t('sitesVerified'),
      color: "text-blue-600"
    },
    {
      icon: <Users className="w-6 h-6" />,
      value: "3.1M+",
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
      value: "R$ 173M",
      label: t('fraudsPrevented'),
      color: "text-orange-600"
    }
  ];

  const pricingPlans: PricingPlan[] = [
    {
      id: "unlimited",
      name: t('oneTimePayment'),
      price: "R$ 29,90",
      period: language === 'en' ? "once" : language === 'es' ? "una vez" : language === 'zh' ? "一次" : language === 'fr' ? "une fois" : language === 'de' ? "einmal" : language === 'ar' ? "مرة واحدة" : language === 'ja' ? "一回" : language === 'ru' ? "один раз" : language === 'hi' ? "एक बार" : language === 'it' ? "una volta" : "uma vez",
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
      period: language === 'en' ? "/month" : language === 'es' ? "/mes" : language === 'zh' ? "/月" : language === 'fr' ? "/mois" : language === 'de' ? "/Monat" : language === 'ar' ? "/شهر" : language === 'ja' ? "/月" : language === 'ru' ? "/месяц" : language === 'hi' ? "/माह" : language === 'it' ? "/mese" : "/mês",
      popular: true,
      savings: "31% OFF",
      features: [
        language === 'en' ? "Everything from previous plan" : 
        language === 'es' ? "Todo del plan anterior" : 
        language === 'zh' ? "前一个计划的所有功能" : 
        language === 'fr' ? "Tout du plan précédent" :
        language === 'de' ? "Alles vom vorherigen Plan" :
        language === 'ar' ? "كل شيء من الخطة السابقة" :
        language === 'ja' ? "前プランのすべて" :
        language === 'ru' ? "Всё из предыдущего плана" :
        language === 'hi' ? "पिछली योजना की सब चीजें" :
        language === 'it' ? "Tutto dal piano precedente" :
        "Tudo do plano anterior",
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
      period: language === 'en' ? "/year" : language === 'es' ? "/año" : language === 'zh' ? "/年" : language === 'fr' ? "/an" : language === 'de' ? "/Jahr" : language === 'ar' ? "/سنة" : language === 'ja' ? "/年" : language === 'ru' ? "/год" : language === 'hi' ? "/वर्ष" : language === 'it' ? "/anno" : "/ano",
      savings: language === 'en' ? "Save R$ 45" : language === 'es' ? "Ahorra R$ 45" : language === 'zh' ? "节省 R$ 45" : language === 'fr' ? "Économisez R$ 45" : language === 'de' ? "Sparen Sie R$ 45" : language === 'ar' ? "وفر R$ 45" : language === 'ja' ? "R$ 45節約" : language === 'ru' ? "Экономия R$ 45" : language === 'hi' ? "R$ 45 बचत" : language === 'it' ? "Risparmia R$ 45" : "Economize R$ 45",
      features: [
        language === 'en' ? "Everything from Premium" : 
        language === 'es' ? "Todo del Premium" : 
        language === 'zh' ? "高级版的所有功能" : 
        language === 'fr' ? "Tout du Premium" :
        language === 'de' ? "Alles vom Premium" :
        language === 'ar' ? "كل شيء من البريميوم" :
        language === 'ja' ? "プレミアムのすべて" :
        language === 'ru' ? "Всё из Премиум" :
        language === 'hi' ? "प्रीमियम की सब चीजें" :
        language === 'it' ? "Tutto dal Premium" :
        "Tudo do Premium",
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
        body: JSON.stringify({ query: searchQuery, language }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || "Falha na verificação");

      let adjustedTrustScore = data.trustScore || 75;
      
      if (data.status === 'safe' && adjustedTrustScore < 75) {
        adjustedTrustScore = Math.max(75, adjustedTrustScore + 15);
      }
      else if (data.status === 'danger' && adjustedTrustScore > 40) {
        adjustedTrustScore = Math.min(40, adjustedTrustScore - 10);
      }
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

      if (!isPremium && !hasUnlimitedAccess) {
        const newCount = Math.max(0, freeSearches - 1);
        setFreeSearches(newCount);
        localStorage.setItem('antigolpe_searches', newCount.toString());
      }

    } catch (e: any) {
      setResult({
        status: "suspicious",
        title: language === 'en' ? "⚠️ PARTIAL VERIFICATION" : 
               language === 'es' ? "⚠️ VERIFICACIÓN PARCIAL" : 
               language === 'zh' ? "⚠️ 部分验证" : 
               language === 'fr' ? "⚠️ VÉRIFICATION PARTIELLE" :
               language === 'de' ? "⚠️ TEILWEISE ÜBERPRÜFUNG" :
               language === 'ar' ? "⚠️ التحقق الجزئي" :
               language === 'ja' ? "⚠️ 部分検証" :
               language === 'ru' ? "⚠️ ЧАСТИЧНАЯ ПРОВЕРКА" :
               language === 'hi' ? "⚠️ आंशिक सत्यापन" :
               language === 'it' ? "⚠️ VERIFICA PARZIALE" :
               "⚠️ VERIFICAÇÃO PARCIAL",
        message: language === 'en' ? "Could not complete all analysis. We recommend caution and additional verification." : 
                 language === 'es' ? "No se pudo completar todo el análisis. Recomendamos precaución y verificación adicional." : 
                 language === 'zh' ? "无法完成所有分析。我们建议谨慎并进行额外验证。" : 
                 language === 'fr' ? "Impossible de terminer toute l'analyse. Nous recommandons la prudence et une vérification supplémentaire." :
                 language === 'de' ? "Konnte nicht alle Analysen abschließen. Wir empfehlen Vorsicht und zusätzliche Überprüfung." :
                 language === 'ar' ? "لم نتمكن من إكمال جميع التحليلات. نوصي بالحذر والتحقق الإضافي." :
                 language === 'ja' ? "すべての分析を完了できませんでした。注意と追加の検証をお勧めします。" :
                 language === 'ru' ? "Не удалось завершить весь анализ. Рекомендуем осторожность и дополнительную проверку." :
                 language === 'hi' ? "सभी विश्लेषण पूरा नहीं कर सके। हम सावधानी और अतिरिक्त सत्यापन की सिफारिश करते हैं।" :
                 language === 'it' ? "Impossibile completare tutta l'analisi. Raccomandiamo cautela e verifica aggiuntiva." :
                 "Não foi possível concluir toda a análise. Recomendamos cautela e verificação adicional.",
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
    const message = `${emoji} *${t('title')} ${language === 'en' ? 'Verified' : language === 'es' ? 'Verificó' : language === 'zh' ? '已验证' : language === 'fr' ? 'Vérifié' : language === 'de' ? 'Verifiziert' : language === 'ar' ? 'تم التحقق' : language === 'ja' ? '検証済み' : language === 'ru' ? 'Проверено' : language === 'hi' ? 'सत्यापित' : language === 'it' ? 'Verificato' : 'Verificou'}*\n\n🔍 *${language === 'en' ? 'Site/Brand' : language === 'es' ? 'Sitio/Marca' : language === 'zh' ? '网站/品牌' : language === 'fr' ? 'Site/Marque' : language === 'de' ? 'Website/Marke' : language === 'ar' ? 'الموقع/العلامة التجارية' : language === 'ja' ? 'サイト/ブランド' : language === 'ru' ? 'Сайт/Бренд' : language === 'hi' ? 'साइट/ब्रांड' : language === 'it' ? 'Sito/Marchio' : 'Site/Marca'}:* ${searchQuery}\n📊 *${language === 'en' ? 'Result' : language === 'es' ? 'Resultado' : language === 'zh' ? '结果' : language === 'fr' ? 'Résultat' : language === 'de' ? 'Ergebnis' : language === 'ar' ? 'النتيجة' : language === 'ja' ? '結果' : language === 'ru' ? 'Результат' : language === 'hi' ? 'परिणाम' : language === 'it' ? 'Risultato' : 'Resultado'}:* ${result.title}\n\n💬 *${language === 'en' ? 'Details' : language === 'es' ? 'Detalles' : language === 'zh' ? '详情' : language === 'fr' ? 'Détails' : language === 'de' ? 'Details' : language === 'ar' ? 'التفاصيل' : language === 'ja' ? '詳細' : language === 'ru' ? 'Детали' : language === 'hi' ? 'विवरण' : language === 'it' ? 'Dettagli' : 'Detalhes'}:* ${result.message}\n\n🛡️ ${language === 'en' ? 'Verify yourself too' : language === 'es' ? 'Verifica tú también' : language === 'zh' ? '您也来验证' : language === 'fr' ? 'Vérifiez-vous aussi' : language === 'de' ? 'Überprüfen Sie sich auch' : language === 'ar' ? 'تحقق أنت أيضاً' : language === 'ja' ? 'あなたも確認してください' : language === 'ru' ? 'Проверьте сами тоже' : language === 'hi' ? 'आप भी सत्यापित करें' : language === 'it' ? 'Verifica anche tu' : 'Verifique você também'}: ${window.location.href}\n\n_${t('title')} - ${language === 'en' ? 'Your protection against online scams' : language === 'es' ? 'Tu protección contra estafas online' : language === 'zh' ? '您的网络诈骗保护' : language === 'fr' ? 'Votre protection contre les arnaques en ligne' : language === 'de' ? 'Ihr Schutz vor Online-Betrug' : language === 'ar' ? 'حمايتك ضد الاحتيال عبر الإنترنت' : language === 'ja' ? 'オンライン詐欺に対するあなたの保護' : language === 'ru' ? 'Ваша защита от онлайн мошенничества' : language === 'hi' ? 'ऑनलाइन धोखाधड़ी के खिलाफ आपकी सुरक्षा' : language === 'it' ? 'La tua protezione contro le truffe online' : 'Sua proteção contra golpes online'}_`;
    
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
        description: language === 'en' ? "Protect your browsing" : language === 'es' ? "Protege tu navegación" : language === 'zh' ? "保护您的浏览" : language === 'fr' ? "Protégez votre navigation" : language === 'de' ? "Schützen Sie Ihr Surfen" : language === 'ar' ? "احم تصفحك" : language === 'ja' ? "ブラウジングを保護" : language === 'ru' ? "Защитите ваш просмотр" : language === 'hi' ? "अपने ब्राउज़िंग की सुरक्षा करें" : language === 'it' ? "Proteggi la tua navigazione" : "Proteja sua navegação",
        price: "R$ 12,99/" + (language === 'en' ? "month" : language === 'es' ? "mes" : language === 'zh' ? "月" : language === 'fr' ? "mois" : language === 'de' ? "Monat" : language === 'ar' ? "شهر" : language === 'ja' ? "月" : language === 'ru' ? "месяц" : language === 'hi' ? "माह" : language === 'it' ? "mese" : "mês"),
        discount: "68% OFF"
      }
    ];

    return services;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {}
      {!isPremium && !hasUnlimitedAccess && (
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 sm:py-3 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <p className="font-bold text-xs sm:text-sm md:text-base">
              🔥 <span className="animate-pulse">{t('specialOffer')}</span> - {t('premiumProtection')} • 
              <button 
                onClick={() => setShowPremiumModal(true)}
                className="ml-1 sm:ml-2 underline hover:no-underline font-black text-xs sm:text-sm"
              >
                {t('guaranteeNow')}
              </button>
            </p>
          </div>
        </div>
      )}

      {}
      <header className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {}
            <div className="flex items-center justify-center space-x-3 sm:space-x-4 flex-1 min-w-0">
              
              
              <div className="relative flex-shrink-0">
  {/* Container da Logo Principal */}
  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
    <img 
      src="/Fraudara_Logo.png" 
      alt="Fraudara Logo" 
      className="w-8 h-8 sm:w-10 sm:h-10 object-contain" // Ajuste o tamanho da logo aqui se necessário
    />
  </div>
  </div>



              
              <div className="text-center min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight truncate">{t('title')}</h1>
                <p className="text-sm sm:text-lg font-semibold text-blue-600 mt-1 truncate">{t('subtitle')}</p>
                <div className="flex items-center justify-center space-x-2 sm:space-x-4 mt-2 flex-wrap gap-1">
                  <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600">
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="font-medium">{t('secure')}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="font-medium truncate">{t('instantVerification')}</span>
                  </div>
                  {!isPremium && !hasUnlimitedAccess && (
                    <div className="flex items-center space-x-1 text-xs sm:text-sm text-orange-600">
                      <Gift className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="font-medium whitespace-nowrap">{freeSearches} {t('consultationsLeft')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {}
            <div className="flex-shrink-0">
              <LanguageSelector language={language} onLanguageChange={changeLanguage} />
            </div>
          </div>
        </div>
      </header>

      {}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-all duration-300">
              <div className={`flex justify-center mb-2 ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {}
      <main className="max-w-3xl mx-auto px-4 pb-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {t('mainTitle')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {t('mainSubtitle')}
          </p>
        </div>

        {}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 mb-10 border border-gray-100">
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('placeholder')}
                className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-6 text-lg sm:text-xl border-3 border-gray-200 rounded-xl sm:rounded-2xl focus:border-blue-500 focus:ring-4 sm:focus:ring-6 focus:ring-blue-100 transition-all duration-300 outline-none font-medium placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && handleVerification()}
              />
            </div>
            
            <button
              onClick={handleVerification}
              disabled={!searchQuery.trim() || isVerifying}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 sm:py-6 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 text-lg sm:text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                  <span>{t('verifying')}</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>{t('verifyButton')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {}
        {isVerifying && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 text-center border border-gray-100">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 animate-spin" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-pulse"></div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{t('analysisInProgress')}</h3>
                <div className="space-y-2 text-gray-600 text-sm sm:text-base">
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

        {}
        {result && !isVerifying && (
          <div className={`bg-white rounded-3xl shadow-2xl border-4 ${getResultColors()} p-8 sm:p-10`}>
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                {getResultIcon()}
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  {result.title}
                </h3>
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
                  {result.message}
                </p>
                
                {}
                <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 space-y-4">
                  <div className="flex items-center justify-center space-x-4 sm:space-x-8">
                    <div className="text-center">
                      <div className={`text-3xl sm:text-4xl font-black ${getTrustScoreColor()}`}>
                        {result.trustScore}%
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 font-semibold">{t('trustIndex')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">
                        {result.verificationTime}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 font-semibold">{t('analysisTime')}</div>
                    </div>
                  </div>
                  
                  {result.complaints > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-red-800 font-semibold text-center text-sm sm:text-base">
                        ⚠️ <strong>{result.complaints} {t('complaintsFound')}</strong>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {}
              {(result.ssl || result.whois || result.reclameAqui || result.googleResults?.length || result.social || result.trustPilot) && (
                <button
                  onClick={handleViewDetails}
                  className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{t('completeReport')}</span>
                  {!isPremium && !hasUnlimitedAccess && <Lock className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />}
                </button>
              )}

              {}
              {showDetails && (isPremium || hasUnlimitedAccess) && (
                <div className="mt-6 text-left space-y-6 p-4 sm:p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  {}
                  {result.ssl && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-lg mb-3 flex items-center">
                        <Lock className="w-5 h-5 mr-2 text-blue-600" />
                        {t('sslCertificate')}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
                        <div className="col-span-1 sm:col-span-2">
                          <span className="font-semibold">{t('issuer')}</span> {result.ssl.issuer?.CN || "—"}
                        </div>
                      </div>
                    </div>
                  )}

                  {}
                  {result.whois && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-lg mb-3 flex items-center">
                        <Search className="w-5 h-5 mr-2 text-green-600" />
                        {t('domainInfo')}
                      </h4>
                      <p className="text-sm">
                        <span className="font-semibold">Status:</span> {result.whois.hasData ? `✅ ${language === 'en' ? 'Data available' : language === 'es' ? 'Datos disponibles' : language === 'zh' ? '数据可用' : language === 'fr' ? 'Données disponibles' : language === 'de' ? 'Daten verfügbar' : language === 'ar' ? 'البيانات متاحة' : language === 'ja' ? 'データ利用可能' : language === 'ru' ? 'Данные доступны' : language === 'hi' ? 'डेटा उपलब्ध' : language === 'it' ? 'Dati disponibili' : 'Dados disponíveis'}` : `❌ ${language === 'en' ? 'Data not available' : language === 'es' ? 'Datos no disponibles' : language === 'zh' ? '数据不可用' : language === 'fr' ? 'Données non disponibles' : language === 'de' ? 'Daten nicht verfügbar' : language === 'ar' ? 'البيانات غير متاحة' : language === 'ja' ? 'データ利用不可' : language === 'ru' ? 'Данные недоступны' : language === 'hi' ? 'डेटा उपलब्ध नहीं' : language === 'it' ? 'Dati non disponibili' : 'Dados não disponíveis'}`}
                      </p>
                    </div>
                  )}

                  {}
                  {result.reclameAqui && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-lg mb-3 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                        {t('reclameAqui')}
                      </h4>
                      {result.reclameAqui.found ? (
                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <span className="font-semibold">Score RA:</span> {result.reclameAqui.score ?? "—"}
                            </div>
                            <div>
                              <span className="font-semibold">{language === 'en' ? 'Total Complaints' : language === 'es' ? 'Total Quejas' : language === 'zh' ? '总投诉数' : language === 'fr' ? 'Total Plaintes' : language === 'de' ? 'Gesamtbeschwerden' : language === 'ar' ? 'إجمالي الشكاوى' : language === 'ja' ? '総苦情数' : language === 'ru' ? 'Всего жалоб' : language === 'hi' ? 'कुल शिकायतें' : language === 'it' ? 'Reclami Totali' : 'Total Reclamações'}:</span> {result.reclameAqui.totalComplaints ?? "—"}
                            </div>
                            <div>
                              <span className="font-semibold">{language === 'en' ? 'Last 30 days' : language === 'es' ? 'Últimos 30 días' : language === 'zh' ? '最近30天' : language === 'fr' ? 'Derniers 30 jours' : language === 'de' ? 'Letzten 30 Tage' : language === 'ar' ? 'آخر 30 يوماً' : language === 'ja' ? '過去30日間' : language === 'ru' ? 'Последние 30 дней' : language === 'hi' ? 'पिछले 30 दिन' : language === 'it' ? 'Ultimi 30 giorni' : 'Últimos 30 dias'}:</span> {result.reclameAqui.last30d ?? "—"}
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
                                🔗 {language === 'en' ? 'View page on Consumer Reports' : language === 'es' ? 'Ver página en Quejas de Consumidores' : language === 'zh' ? '查看消费者投诉页面' : language === 'fr' ? 'Voir la page sur les Rapports de Consommateurs' : language === 'de' ? 'Seite in Verbraucherberichten anzeigen' : language === 'ar' ? 'عرض الصفحة في تقارير المستهلكين' : language === 'ja' ? '消費者レポートでページを表示' : language === 'ru' ? 'Посмотреть страницу в Отчетах Потребителей' : language === 'hi' ? 'उपभोक्ता रिपोर्ट में पेज देखें' : language === 'it' ? 'Visualizza pagina sui Rapporti Consumatori' : 'Ver página no Reclame Aqui'}
                              </a>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">{language === 'en' ? 'Company not found in Consumer Reports.' : language === 'es' ? 'Empresa no encontrada en Quejas de Consumidores.' : language === 'zh' ? '在消费者投诉中未找到该公司。' : language === 'fr' ? 'Entreprise non trouvée dans les Rapports de Consommateurs.' : language === 'de' ? 'Unternehmen nicht in Verbraucherberichten gefunden.' : language === 'ar' ? 'الشركة غير موجودة في تقارير المستهلكين.' : language === 'ja' ? '消費者レポートで会社が見つかりませんでした。' : language === 'ru' ? 'Компания не найдена в Отчетах Потребителей.' : language === 'hi' ? 'कंपनी उपभोक्ता रिपोर्ट में नहीं मिली।' : language === 'it' ? 'Azienda non trovata nei Rapporti Consumatori.' : 'Empresa não encontrada no Reclame Aqui.'}</p>
                      )}
                    </div>
                  )}

                  {}
                  {result.social && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-lg mb-3 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-purple-600" />
                        {t('socialNetworks')}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold">{language === 'en' ? 'Total mentions' : language === 'es' ? 'Total de menciones' : language === 'zh' ? '总提及次数' : language === 'fr' ? 'Total des mentions' : language === 'de' ? 'Gesamterwähnungen' : language === 'ar' ? 'إجمالي الإشارات' : language === 'ja' ? '総メンション数' : language === 'ru' ? 'Всего упоминаний' : language === 'hi' ? 'कुल उल्लेख' : language === 'it' ? 'Menzioni totali' : 'Total de menções'}:</span> {result.social.mentions || 0}
                        </div>
                        {result.social.instagram && (
                          <div>
                            <span className="font-semibold">Instagram:</span> 
                            <a href={result.social.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                              {language === 'en' ? 'View profile' : language === 'es' ? 'Ver perfil' : language === 'zh' ? '查看资料' : language === 'fr' ? 'Voir le profil' : language === 'de' ? 'Profil anzeigen' : language === 'ar' ? 'عرض الملف الشخصي' : language === 'ja' ? 'プロフィールを見る' : language === 'ru' ? 'Посмотреть профиль' : language === 'hi' ? 'प्रोफ़ाइल देखें' : language === 'it' ? 'Visualizza profilo' : 'Ver perfil'}
                            </a>
                          </div>
                        )}
                        {result.social.twitter && (
                          <div>
                            <span className="font-semibold">Twitter:</span> 
                            <a href={result.social.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                              {language === 'en' ? 'View profile' : language === 'es' ? 'Ver perfil' : language === 'zh' ? '查看资料' : language === 'fr' ? 'Voir le profil' : language === 'de' ? 'Profil anzeigen' : language === 'ar' ? 'عرض الملف الشخصي' : language === 'ja' ? 'プロフィールを見る' : language === 'ru' ? 'Посмотреть профиль' : language === 'hi' ? 'प्रोफ़ाइल देखें' : language === 'it' ? 'Visualizza profilo' : 'Ver perfil'}
                            </a>
                          </div>
                        )}
                        {result.social.linkedin && (
                          <div>
                            <span className="font-semibold">LinkedIn:</span> 
                            <a href={result.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                              {language === 'en' ? 'View profile' : language === 'es' ? 'Ver perfil' : language === 'zh' ? '查看资料' : language === 'fr' ? 'Voir le profil' : language === 'de' ? 'Profil anzeigen' : language === 'ar' ? 'عرض الملف الشخصي' : language === 'ja' ? 'プロフィールを見る' : language === 'ru' ? 'Посмотреть профиль' : language === 'hi' ? 'प्रोफ़ाइल देखें' : language === 'it' ? 'Visualizza profilo' : 'Ver perfil'}
                            </a>
                          </div>
                        )}
                        {result.social.reddit && (
                          <div>
                            <span className="font-semibold">Reddit:</span> 
                            <a href={result.social.reddit} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                              {language === 'en' ? 'View discussion' : language === 'es' ? 'Ver discusión' : language === 'zh' ? '查看讨论' : language === 'fr' ? 'Voir la discussion' : language === 'de' ? 'Diskussion anzeigen' : language === 'ar' ? 'عرض النقاش' : language === 'ja' ? 'ディスカッションを見る' : language === 'ru' ? 'Посмотреть обсуждение' : language === 'hi' ? 'चर्चा देखें' : language === 'it' ? 'Visualizza discussione' : 'Ver discussão'}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {}
                  {result.trustPilot?.found && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-lg mb-3 flex items-center">
                        <Star className="w-5 h-5 mr-2 text-yellow-600" />
                        {t('trustPilot')}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold">{language === 'en' ? 'Rating' : language === 'es' ? 'Calificación' : language === 'zh' ? '评分' : language === 'fr' ? 'Note' : language === 'de' ? 'Bewertung' : language === 'ar' ? 'التقييم' : language === 'ja' ? '評価' : language === 'ru' ? 'Рейтинг' : language === 'hi' ? 'रेटिंग' : language === 'it' ? 'Valutazione' : 'Avaliação'}:</span> {result.trustPilot.rating ? `${result.trustPilot.rating}/5 ⭐` : "—"}
                        </div>
                        <div>
                          <span className="font-semibold">{language === 'en' ? 'Total Reviews' : language === 'es' ? 'Total Reseñas' : language === 'zh' ? '总评论数' : language === 'fr' ? 'Total Avis' : language === 'de' ? 'Gesamtbewertungen' : language === 'ar' ? 'إجمالي المراجعات' : language === 'ja' ? '総レビュー数' : language === 'ru' ? 'Всего отзывов' : language === 'hi' ? 'कुल समीक्षाएं' : language === 'it' ? 'Recensioni Totali' : 'Total Reviews'}:</span> {result.trustPilot.reviewCount ?? "—"}
                        </div>
                      </div>
                      <div className="mt-3">
                        <a 
                          href={result.trustPilot.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 underline font-medium"
                        >
                          🔗 {language === 'en' ? 'View on TrustPilot' : language === 'es' ? 'Ver en TrustPilot' : language === 'zh' ? '在TrustPilot上查看' : language === 'fr' ? 'Voir sur TrustPilot' : language === 'de' ? 'Auf TrustPilot anzeigen' : language === 'ar' ? 'عرض على TrustPilot' : language === 'ja' ? 'TrustPilotで見る' : language === 'ru' ? 'Посмотреть на TrustPilot' : language === 'hi' ? 'TrustPilot पर देखें' : language === 'it' ? 'Visualizza su TrustPilot' : 'Ver no TrustPilot'}
                        </a>
                      </div>
                    </div>
                  )}

                  {}
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
                              <p className="text-xs text-red-500 mt-1">⚠️ {language === 'en' ? 'Error analyzing content' : language === 'es' ? 'Error al analizar contenido' : language === 'zh' ? '分析内容时出错' : language === 'fr' ? 'Erreur lors de l\'analyse du contenu' : language === 'de' ? 'Fehler beim Analysieren des Inhalts' : language === 'ar' ? 'خطأ في تحليل المحتوى' : language === 'ja' ? 'コンテンツ分析エラー' : language === 'ru' ? 'Ошибка анализа контента' : language === 'hi' ? 'सामग्री विश्लेषण त्रुटि' : language === 'it' ? 'Errore nell\'analisi del contenuto' : 'Erro ao analisar conteúdo'}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {}
              {result.status === 'danger' && (
                <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-2xl">
                  <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                    <ShoppingCart className="w-6 h-6 mr-2" />
                    {t('safeAlternative')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              {}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center justify-center space-x-2 sm:space-x-3 bg-green-600 hover:bg-green-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{t('shareWhatsApp')}</span>
                </button>
                
                <button
                  onClick={() => {setResult(null); setSearchQuery(''); setShowDetails(false);}}
                  className="inline-flex items-center justify-center space-x-2 sm:space-x-3 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{t('newVerification')}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        
        
        
        
     

        {}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{t('completeAnalysis')}</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {t('completeAnalysisDesc')}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{t('advancedAI')}</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {t('advancedAIDesc')}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{t('instantResult')}</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {t('instantResultDesc')}
            </p>
          </div>
        </div>
      </main>

      {}
      {showPaywall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('completeReportTitle')}</h3>
                <p className="text-base sm:text-lg text-gray-600">{t('completeReportDesc')}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 sm:p-6 mb-6">
                <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-4">{t('whatYouWillSee')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span>{t('detailedSSL')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span>{t('completeWHOIS')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span>{t('reclameAquiHistory')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span>{t('socialAnalysis')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span>{t('trustPilotReviews')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span>{t('googleTop10')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleUpgrade('unlimited')}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 sm:py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                >
                  {t('unlockFor2990')}
                </button>
                
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 sm:py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                >
                  {t('orPremium')}
                </button>
              </div>

              <button
                onClick={() => setShowPaywall(false)}
                className="w-full mt-4 text-gray-500 hover:text-gray-700 font-medium py-2 text-sm sm:text-base"
              >
                {t('maybeLater')}
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{t('choosePlan')}</h3>
                <p className="text-lg sm:text-xl text-gray-600">{t('choosePlanDesc')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {pricingPlans.map((plan, index) => (
                  <div
                    key={index}
                    className={`relative bg-white rounded-2xl border-2 p-4 sm:p-6 ${
                      plan.popular
                        ? 'border-orange-500 shadow-2xl transform scale-105'
                        : 'border-gray-200 shadow-lg'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="inline-block whitespace-nowrap bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold">
                          {t('mostPopular')}
                        </span>
                      </div>
                    )}
                    
                    {plan.savings && (
                      <div className="absolute -top-2 -right-2">
                        <span className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
                          {plan.savings}
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                      <div className="mb-2">
                        <span className="text-2xl sm:text-3xl font-black text-gray-900">{plan.price}</span>
                        <span className="text-gray-600 text-sm sm:text-base">{plan.period}</span>
                      </div>
                      {plan.originalPrice && (
                        <div className="text-sm text-gray-500">
                          <span className="line-through">{plan.originalPrice}</span>
                        </div>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start space-x-2 text-xs sm:text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      className={`w-full font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-all duration-300 text-xs sm:text-sm ${
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
                  className="text-gray-500 hover:text-gray-700 font-medium text-sm sm:text-base"
                >
                  {t('continueFreePlan')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full">
            <div className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{t('consultationsExhausted')}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                {t('consultationsExhaustedDesc')}
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => handleUpgrade('unlimited')}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 sm:py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                >
                  {t('unlimitedAccess')}
                </button>
                
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 sm:py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                >
                  {t('premium')}
                </button>
              </div>

              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full mt-4 text-gray-500 hover:text-gray-700 font-medium py-2 text-sm sm:text-base"
              >
                {t('back')}
              </button>
            </div>
          </div>
        </div>
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
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold">{t('title')}</h3>
                <p className="text-sm sm:text-base text-gray-300">{t('subtitle')}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
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
