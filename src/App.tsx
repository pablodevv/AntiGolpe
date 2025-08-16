import React, { useState, useEffect } from 'react';
import { Shield, Search, Share2, CheckCircle, AlertTriangle, XCircle, Loader2, Award, Users, Clock, TrendingUp, Star, Lock, Zap, Eye, ChevronDown, ChevronUp, Check, Crown, Phone, Sparkles, Gift, ExternalLink, ShoppingCart, CreditCard, Headphones, FileText, Smartphone } from 'lucide-react';

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
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  features: string[];
  popular?: boolean;
  cta: string;
  savings?: string;
}

function App() {
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
    alert("✅ Premium ativado com sucesso!");
    window.location.href = "/"; // redireciona para a home
  }

  if (path === "/unlimited-ativar") {
    setHasUnlimitedAccess(true);
    localStorage.setItem('antigolpe_unlimited', 'true');
    alert("✅ Pagamento Único ativado com sucesso!");
    window.location.href = "/";
  }





    
  }, []);



  

  
  // Estatísticas impressionantes para credibilidade
  const stats: StatCard[] = [
    {
      icon: <Shield className="w-6 h-6" />,
      value: "2.8M+",
      label: "Sites Verificados",
      color: "text-blue-600"
    },
    {
      icon: <Users className="w-6 h-6" />,
      value: "1.2M+",
      label: "Usuários Protegidos",
      color: "text-green-600"
    },
    {
      icon: <Award className="w-6 h-6" />,
      value: "99.8%",
      label: "Precisão",
      color: "text-purple-600"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      value: "R$ 67M",
      label: "Golpes Evitados",
      color: "text-orange-600"
    }
  ];

  // Planos de preços
  const pricingPlans: PricingPlan[] = [
    {
      id: "unlimited",
      name: "Pagamento Único",
      price: "R$ 29,90",
      period: "uma vez",
      features: [
        "Consultas ilimitadas",
        "Relatórios completos",
        "Análise detalhada",
        "Suporte por email"
      ],
      cta: "Desbloquear Agora"
    },
    {
      id: "premium",
      name: "Proteção Premium",
      price: "R$ 12",
      originalPrice: "R$ 17",
      period: "/mês",
      popular: true,
      savings: "31% OFF",
      features: [
        "Tudo do plano anterior",
        "Monitoramento 24/7",
        "Alertas WhatsApp/Email",
        "Lista VIP de sites",
        "Suporte prioritário"
      ],
      cta: "Começar Trial Grátis"
    },
    {
      id: "annual",
      name: "Proteção Anual",
      price: "R$ 99",
      originalPrice: "R$ 144",
      period: "/ano",
      savings: "Economize R$ 45",
      features: [
        "Tudo do Premium",
        "2 meses grátis",
        "Análises personalizadas",
        "Consultoria especializada",
        "Relatórios empresariais"
      ],
      cta: "Melhor Oferta"
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
    const message = `${emoji} *AntiGolpe Verificou*\n\n🔍 *Site/Marca:* ${searchQuery}\n📊 *Resultado:* ${result.title}\n\n💬 *Detalhes:* ${result.message}\n\n🛡️ Verifique você também: ${window.location.href}\n\n_AntiGolpe - Sua proteção contra golpes online_`;
    
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
      
      //setHasUnlimitedAccess(true);
      //localStorage.setItem('antigolpe_unlimited', 'true');
      //setShowUpgradeModal(false);
      //setShowPaywall(false);
    } else if (plan === 'premium') {


      window.location.href = "https://app.pushinpay.com.br/service/pay/9fa66120-1b0d-4b0d-aafc-65784e333b2d";

        
      //setIsPremium(true);
      //localStorage.setItem('antigolpe_premium', 'true');
      //setShowPremiumModal(false);
      //setShowPaywall(false);
    } else if (plan === 'annual') {
    window.location.href = "https://app.pushinpay.com.br/service/pay/9fa6663e-a37d-4ba4-b042-f0e81df19aa9";
  }



    
  };

  const getSafeAlternatives = () => {
    const alternatives = [
      {
        name: "Amazon",
        url: "https://amzn.to/4mujivi",
        description: "Maior e-commerce do mundo",
        discount: "Até 70% OFF"
      }
    ];

    return alternatives;
  };

  const getSecurityServices = () => {
    const services = [
      {
        name: "NordVPN",
        url: "https://nordvpn.com/?utm_source=antigolpe",
        description: "Proteja sua navegação",
        price: "R$ 12,99/mês",
        discount: "68% OFF"
      },
      {
        name: "Serasa Premium",
        url: "https://serasa.com.br/?utm_source=antigolpe",
        description: "Monitore seu CPF 24h",
        price: "R$ 16,90/mês",
        discount: "1º mês grátis"
      },
      {
        name: "Kaspersky",
        url: "https://kaspersky.com.br/?utm_source=antigolpe",
        description: "Antivírus premium",
        price: "R$ 89,90/ano",
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
              🔥 <span className="animate-pulse">OFERTA ESPECIAL</span> - Proteção Premium por apenas R$12/mês • 
              <button 
                onClick={() => setShowPremiumModal(true)}
                className="ml-2 underline hover:no-underline font-black"
              >
                GARANTIR AGORA →
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Header Premium */}
      <header className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
                <Shield className="w-9 h-9 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">AntiGolpe</h1>
              <p className="text-lg font-semibold text-blue-600 mt-1">Proteção Nacional Contra Fraudes</p>
              <div className="flex items-center justify-center space-x-4 mt-2">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Lock className="w-4 h-4" />
                  <span className="font-medium">100% Seguro</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">Verificação Instantânea</span>
                </div>
                {!isPremium && !hasUnlimitedAccess && (
                  <div className="flex items-center space-x-1 text-sm text-orange-600">
                    <Gift className="w-4 h-4" />
                    <span className="font-medium">{freeSearches} consultas restantes</span>
                  </div>
                )}
              </div>
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
            Verifique Qualquer Site ou Marca em Segundos
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Nossa inteligência artificial analisa milhões de dados em tempo real para proteger você contra golpes online
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
                placeholder="Digite o nome da marca ou URL do site (ex: loja-promocoes.com)"
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
                  <span>Verificando Segurança...</span>
                </>
              ) : (
                <>
                  <Shield className="w-6 h-6" />
                  <span>Verificar Agora - GRÁTIS</span>
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
                <h3 className="text-2xl font-bold text-gray-900">🔍 Análise em Andamento</h3>
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Verificando domínio e certificados SSL...</span>
                  </p>
                  <p className="flex items-center justify-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>Consultando base de reclamações...</span>
                  </p>
                  <p className="flex items-center justify-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Analisando reputação online...</span>
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
                      <div className="text-sm text-gray-600 font-semibold">Índice de Confiança</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {result.verificationTime}
                      </div>
                      <div className="text-sm text-gray-600 font-semibold">Tempo de Análise</div>
                    </div>
                  </div>
                  
                  {result.complaints > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-red-800 font-semibold text-center">
                        ⚠️ <strong>{result.complaints} reclamações</strong> encontradas nos últimos 30 dias
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
                  <span>Ver Relatório Completo</span>
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
                        Certificado SSL/TLS
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold">Presente:</span> {result.ssl.present ? "✅ Sim" : "❌ Não"}
                        </div>
                        <div>
                          <span className="font-semibold">Válido:</span> {result.ssl.validNow ? "✅ Sim" : "❌ Não"}
                        </div>
                        <div>
                          <span className="font-semibold">Válido de:</span> {result.ssl.validFrom || "—"}
                        </div>
                        <div>
                          <span className="font-semibold">Válido até:</span> {result.ssl.validTo || "—"}
                        </div>
                        <div className="col-span-2">
                          <span className="font-semibold">Emissor:</span> {result.ssl.issuer?.CN || "—"}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WHOIS */}
                  {result.whois && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-lg mb-3 flex items-center">
                        <Search className="w-5 h-5 mr-2 text-green-600" />
                        Informações do Domínio (WHOIS)
                      </h4>
                      <p className="text-sm">
                        <span className="font-semibold">Status:</span> {result.whois.hasData ? "✅ Dados disponíveis" : "❌ Dados não disponíveis"}
                      </p>
                    </div>
                  )}

                  {/* Reclame Aqui */}
                  {result.reclameAqui && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-lg mb-3 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                        Reclame Aqui
                      </h4>
                      {result.reclameAqui.found ? (
                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="font-semibold">Score RA:</span> {result.reclameAqui.score ?? "—"}
                            </div>
                            <div>
                              <span className="font-semibold">Total Reclamações:</span> {result.reclameAqui.totalComplaints ?? "—"}
                            </div>
                            <div>
                              <span className="font-semibold">Últimos 30 dias:</span> {result.reclameAqui.last30d ?? "—"}
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
                                🔗 Ver página no Reclame Aqui
                              </a>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">Empresa não encontrada no Reclame Aqui.</p>
                      )}
                    </div>
                  )}

                  {/* Redes Sociais */}
                  {result.social && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-lg mb-3 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-purple-600" />
                        Presença em Redes Sociais
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold">Total de menções:</span> {result.social.mentions || 0}
                        </div>
                        {result.social.instagram && (
                          <div>
                            <span className="font-semibold">Instagram:</span> 
                            <a href={result.social.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                              Ver perfil
                            </a>
                          </div>
                        )}
                        {result.social.twitter && (
                          <div>
                            <span className="font-semibold">Twitter:</span> 
                            <a href={result.social.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                              Ver perfil
                            </a>
                          </div>
                        )}
                        {result.social.linkedin && (
                          <div>
                            <span className="font-semibold">LinkedIn:</span> 
                            <a href={result.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                              Ver perfil
                            </a>
                          </div>
                        )}
                        {result.social.reddit && (
                          <div>
                            <span className="font-semibold">Reddit:</span> 
                            <a href={result.social.reddit} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                              Ver discussão
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
                        TrustPilot
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold">Avaliação:</span> {result.trustPilot.rating ? `${result.trustPilot.rating}/5 ⭐` : "—"}
                        </div>
                        <div>
                          <span className="font-semibold">Total Reviews:</span> {result.trustPilot.reviewCount ?? "—"}
                        </div>
                      </div>
                      <div className="mt-3">
                        <a 
                          href={result.trustPilot.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 underline font-medium"
                        >
                          🔗 Ver no TrustPilot
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Top 10 Google */}
                  {result.googleResults?.length > 0 && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-lg mb-3 flex items-center">
                        <Search className="w-5 h-5 mr-2 text-red-600" />
                        Top 10 Resultados Google
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
                              <p className="text-xs text-red-500 mt-1">⚠️ Erro ao analisar conteúdo</p>
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
                    Alternativa 100% Segura
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
                  <span>Compartilhar no WhatsApp</span>
                </button>
                
                <button
                  onClick={() => {setResult(null); setSearchQuery(''); setShowDetails(false);}}
                  className="inline-flex items-center justify-center space-x-3 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Search className="w-5 h-5" />
                  <span>Nova Verificação</span>
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
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Análise Personalizada Premium</h3>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Precisa de uma análise detalhada de documentos, CNPJs, contratos ou propostas de investimento? 
              Nossa equipe de especialistas faz uma verificação manual completa em até 1 hora.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-green-600" />
                Análise Expressa - R$ 49,90
              </h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  Resposta em até 1 hora
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  Verificação manual por especialistas
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  Relatório detalhado em PDF
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  Suporte via WhatsApp
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-purple-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Crown className="w-6 h-6 mr-2 text-purple-600" />
                Análise Premium - R$ 99,90
              </h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-purple-600 mr-2" />
                  Resposta em até 30 minutos
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-purple-600 mr-2" />
                  Análise jurídica incluída
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-purple-600 mr-2" />
                  Consultoria por videochamada
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-purple-600 mr-2" />
                  Garantia de 30 dias
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <a
              href="https://wa.me/5524999325986?text=Olá! Preciso de uma análise personalizada pelo AntiGolpe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Phone className="w-5 h-5" />
              <span>Solicitar Análise via WhatsApp</span>
            </a>
          </div>
        </div>

        





        

        

        {/* Trust Indicators */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Análise Completa</h3>
            <p className="text-gray-600 leading-relaxed">
              Verificamos domínio, SSL, Reclame Aqui, redes sociais e mais de 50 fontes de dados
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">IA Avançada</h3>
            <p className="text-gray-600 leading-relaxed">
              Nossa inteligência artificial processa milhões de dados em tempo real para máxima precisão
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Resultado Instantâneo</h3>
            <p className="text-gray-600 leading-relaxed">
              Veredito claro e confiável em segundos, com índice de confiança e detalhes completos
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
                <h3 className="text-3xl font-bold text-gray-900 mb-2">📊 Relatório Completo</h3>
                <p className="text-lg text-gray-600">Desbloqueie todos os detalhes da análise</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 mb-6">
                <h4 className="font-bold text-lg text-gray-900 mb-4">🔓 O que você vai ver:</h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-purple-600" />
                    <span>Certificados SSL detalhados</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-purple-600" />
                    <span>Informações WHOIS completas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-purple-600" />
                    <span>Histórico Reclame Aqui</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Análise de redes sociais</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-purple-600" />
                    <span>Avaliações TrustPilot</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-purple-600" />
                    <span>Top 10 resultados Google</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleUpgrade('unlimited')}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  🚀 Desbloquear por R$ 29,90 (Uma vez)
                </button>
                
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  👑 Ou Premium por R$ 12/mês
                </button>
              </div>

              <button
                onClick={() => setShowPaywall(false)}
                className="w-full mt-4 text-gray-500 hover:text-gray-700 font-medium py-2"
              >
                Talvez depois
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
                <h3 className="text-4xl font-bold text-gray-900 mb-2">👑 Proteção Premium</h3>
                <p className="text-xl text-gray-600">Escolha o plano ideal para sua proteção</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {pricingPlans.map((plan, index) => (
                  <div
                    key={index}
                    className={`relative bg-white rounded-2xl border-2 p-6 ${
  plan.popular
    ? 'border-orange-500 shadow-2xl transform scale-105'
    : 'border-gray-200 shadow-lg'
}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                          🔥 MAIS POPULAR
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
                      className={`w-full font-bold py-3 px-4 rounded-xl transition-all duration-300 ${
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
                  Continuar com plano gratuito
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">🔒 Consultas Esgotadas</h3>
              <p className="text-gray-600 mb-6">
                Você usou suas 5 consultas gratuitas. Desbloqueie acesso ilimitado agora!
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => handleUpgrade('unlimited')}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  🚀 Acesso Ilimitado - R$ 29,90
                </button>
                
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  👑 Premium - R$ 12/mês
                </button>
              </div>

              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full mt-4 text-gray-500 hover:text-gray-700 font-medium py-2"
              >
                Voltar
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
                <h3 className="text-2xl font-bold">AntiGolpe</h3>
                <p className="text-gray-300">Proteção Nacional Contra Fraudes</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-blue-400">🛡️ Segurança Total</h4>
                <p className="text-gray-300">Seus dados são protegidos com criptografia de nível bancário</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-green-400">✅ Verificação Gratuita</h4>
                <p className="text-gray-300">5 consultas gratuitas para proteger todos os brasileiros</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-purple-400">🚀 Sempre Atualizado</h4>
                <p className="text-gray-300">Base de dados atualizada em tempo real 24/7</p>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400 text-sm">
                © 2025 AntiGolpe - Protegendo brasileiros contra fraudes online desde 2024
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Ferramenta educativa para conscientização sobre segurança digital • Desenvolvido no Brasil 🇧🇷
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
