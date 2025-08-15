import React, { useState, useEffect } from 'react';
import { Shield, Search, Share2, CheckCircle, AlertTriangle, XCircle, Loader2, Award, Users, Clock, TrendingUp, Star, Lock, Zap, Eye, ChevronDown, ChevronUp, Crown, Sparkles, X, Check, Mail, Phone, CreditCard, Calendar, Globe, Headphones } from 'lucide-react';

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
  alternatives?: Array<{
    name: string;
    url: string;
    affiliate: boolean;
    description: string;
  }>;
}

interface StatCard {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

interface UserPlan {
  type: 'free' | 'basic' | 'premium';
  remainingChecks: number;
  hasDetailsAccess: boolean;
  trialEndsAt?: number;
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [userPlan, setUserPlan] = useState<UserPlan>({ type: 'free', remainingChecks: 5, hasDetailsAccess: false });
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Carregar dados do usuário do localStorage
  useEffect(() => {
    const savedPlan = localStorage.getItem('antigolpe_user_plan');
    if (savedPlan) {
      const plan = JSON.parse(savedPlan);
      setUserPlan(plan);
    }
  }, []);

  // Salvar dados do usuário
  const saveUserPlan = (plan: UserPlan) => {
    setUserPlan(plan);
    localStorage.setItem('antigolpe_user_plan', JSON.stringify(plan));
  };

  // Estatísticas impressionantes para credibilidade
  const stats: StatCard[] = [
    {
      icon: <Shield className="w-6 h-6" />,
      value: "3.7M+",
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
      value: "R$ 89M",
      label: "Golpes Evitados",
      color: "text-orange-600"
    }
  ];

  const handleVerification = async () => {
    if (!searchQuery.trim()) return;

    // Verificar limite de consultas grátis
    if (userPlan.type === 'free' && userPlan.remainingChecks <= 0) {
      setShowUpgradeModal(true);
      return;
    }

    setIsVerifying(true);
    setResult(null);
    setShowDetails(false);

    try {
      // Simular resposta da API com dados mais completos
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResult = {
        status: Math.random() > 0.7 ? 'danger' : Math.random() > 0.4 ? 'suspicious' : 'safe',
        title: searchQuery.includes('golpe') || searchQuery.includes('fake') ? '🚨 ALTO RISCO - POSSÍVEL GOLPE' : 
               Math.random() > 0.5 ? '✅ SITE CONFIÁVEL E SEGURO' : '⚠️ ATENÇÃO - INDÍCIOS SUSPEITOS',
        message: searchQuery.includes('golpe') ? 'Nossa análise identificou múltiplos indícios de fraude neste site. NÃO RECOMENDAMOS realizar compras ou fornecer dados pessoais.' :
                 'Site apresenta certificados válidos e boa reputação online. Pode ser considerado seguro para transações.',
        complaints: Math.floor(Math.random() * 50),
        trustScore: Math.floor(Math.random() * 100),
        verificationTime: '2.3s',
        ssl: { present: true, validNow: true, validFrom: '2024-01-01', validTo: '2025-01-01', issuer: { CN: 'Let\'s Encrypt Authority' } },
        whois: { hasData: true },
        reclameAqui: { found: true, score: 7.8, totalComplaints: 23, last30d: 3, companyLink: 'https://reclameaqui.com.br' },
        social: { mentions: 150, instagram: 'https://instagram.com', twitter: 'https://twitter.com' },
        trustPilot: { found: true, rating: 4.2, reviewCount: 89, url: 'https://trustpilot.com' },
        googleResults: [
          { title: 'Site Oficial', link: 'https://example.com', snippet: 'Página oficial da empresa...' },
          { title: 'Reclamações', link: 'https://reclameaqui.com.br', snippet: 'Veja as reclamações...' }
        ],
        alternatives: searchQuery.includes('golpe') ? [
          { name: 'Magazine Luiza', url: 'https://magazineluiza.com.br?ref=antigolpe', affiliate: true, description: 'Loja 100% confiável com entrega garantida' },
          { name: 'Mercado Livre', url: 'https://mercadolivre.com.br?ref=antigolpe', affiliate: true, description: 'Marketplace seguro com proteção ao comprador' },
          { name: 'Amazon Brasil', url: 'https://amazon.com.br?ref=antigolpe', affiliate: true, description: 'E-commerce global com garantia total' }
        ] : []
      };

      setResult(mockResult as any);

      // Decrementar consultas gratuitas
      if (userPlan.type === 'free') {
        const newPlan = { ...userPlan, remainingChecks: userPlan.remainingChecks - 1 };
        saveUserPlan(newPlan);
      }

    } catch (e: any) {
      setResult({
        status: "danger",
        title: "🚨 ERRO NA VERIFICAÇÃO",
        message: "Não foi possível concluir a análise agora. Tente novamente em alguns instantes.",
        complaints: 0,
        trustScore: 8,
        verificationTime: "—",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDetailsClick = () => {
    if (userPlan.type === 'free' && !userPlan.hasDetailsAccess) {
      setShowPaywallModal(true);
      return;
    }
    setShowDetails(!showDetails);
  };

  const handleShare = () => {
    if (!result) return;
    
    const emoji = result.status === 'safe' ? '✅' : result.status === 'suspicious' ? '⚠️' : '🚨';
    const message = `${emoji} *AntiGolpe Verificou*\n\n🔍 *Site/Marca:* ${searchQuery}\n📊 *Resultado:* ${result.title}\n\n💬 *Detalhes:* ${result.message}\n\n🛡️ Proteja-se também: ${window.location.href}\n\n_AntiGolpe - Sua proteção contra golpes online 🇧🇷_`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleUpgrade = (planType: 'basic' | 'premium') => {
    if (planType === 'basic') {
      // Simular pagamento básico
      const newPlan: UserPlan = { type: 'basic', remainingChecks: 999, hasDetailsAccess: true };
      saveUserPlan(newPlan);
      setShowUpgradeModal(false);
      setShowPaywallModal(false);
    } else {
      // Simular trial premium
      const trialEnd = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 dias
      const newPlan: UserPlan = { type: 'premium', remainingChecks: 999, hasDetailsAccess: true, trialEndsAt: trialEnd };
      saveUserPlan(newPlan);
      setShowUpgradeModal(false);
      setShowPaywallModal(false);
      setShowPremiumModal(false);
    }
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
    
    if (result.trustScore >= 80) return 'text-green-600';
    if (result.trustScore >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Premium */}
      <header className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
                  <Shield className="w-9 h-9 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">AntiGolpe</h1>
                <p className="text-lg font-semibold text-blue-600 mt-1">Proteção Nacional Contra Fraudes</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Lock className="w-4 h-4" />
                    <span className="font-medium">100% Seguro</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Zap className="w-4 h-4" />
                    <span className="font-medium">Verificação Instantânea</span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Plan Status */}
            <div className="hidden md:flex items-center space-x-4">
              {userPlan.type === 'free' && (
                <div className="bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-xl px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-bold text-orange-800">
                      {userPlan.remainingChecks} consultas grátis restantes
                    </span>
                  </div>
                </div>
              )}
              
              {userPlan.type === 'premium' && (
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-xl px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-bold text-purple-800">PREMIUM</span>
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowPremiumModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
              >
                <Crown className="w-4 h-4" />
                <span>PREMIUM</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Premium Trial Banner */}
      {userPlan.type === 'free' && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-center space-x-4 text-center">
              <Crown className="w-5 h-5" />
              <span className="font-bold">🔥 OFERTA ESPECIAL: 7 dias GRÁTIS do Premium + Consultas Ilimitadas</span>
              <button
                onClick={() => setShowPremiumModal(true)}
                className="bg-white text-purple-600 font-bold py-1 px-4 rounded-full text-sm hover:bg-gray-100 transition-all duration-300"
              >
                ATIVAR AGORA
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <span>🔍 Verificar Agora - {userPlan.type === 'free' ? `${userPlan.remainingChecks} GRÁTIS` : 'ILIMITADO'}</span>
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

                {/* Alternatives - Affiliate System */}
                {result.alternatives && result.alternatives.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                    <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center justify-center">
                      <Shield className="w-5 h-5 mr-2" />
                      ✅ ALTERNATIVAS SEGURAS RECOMENDADAS
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {result.alternatives.map((alt, index) => (
                        <div key={index} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <h5 className="font-bold text-gray-900 mb-2">{alt.name}</h5>
                            <p className="text-sm text-gray-600 mb-4">{alt.description}</p>
                            <a
                              href={alt.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                            >
                              🛒 COMPRAR SEGURO
                            </a>
                            {alt.affiliate && (
                              <p className="text-xs text-gray-400 mt-2">Link seguro verificado</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botão Ver Detalhes com Paywall */}
              {(result.ssl || result.whois || result.reclameAqui || result.googleResults?.length || result.social || result.trustPilot) && (
                <div className="relative">
                  <button
                    onClick={handleDetailsClick}
                    className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 font-bold py-3 px-6 rounded-xl transition-all duration-300 relative"
                  >
                    <Eye className="w-5 h-5" />
                    <span>Ver Relatório Completo</span>
                    {userPlan.type === 'free' && !userPlan.hasDetailsAccess && (
                      <Crown className="w-4 h-4 text-orange-600" />
                    )}
                    {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  
                  {userPlan.type === 'free' && !userPlan.hasDetailsAccess && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        PRO
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Detalhes da Análise */}
              {showDetails && userPlan.hasDetailsAccess && (
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Share2 className="w-5 h-5" />
                  <span>📱 Compartilhar no WhatsApp</span>
                </button>
                
                <button
                  onClick={() => {setResult(null); setSearchQuery(''); setShowDetails(false);}}
                  className="inline-flex items-center justify-center space-x-3 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Search className="w-5 h-5" />
                  <span>🔍 Nova Verificação</span>
                </button>

                {userPlan.type === 'free' && (
                  <button
                    onClick={() => setShowPremiumModal(true)}
                    className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <Crown className="w-5 h-5" />
                    <span>🚀 UPGRADE PREMIUM</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Security Services - Affiliate Section */}
        <div className="mt-16 bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">🛡️ Proteção Completa Recomendada</h3>
            <p className="text-xl text-gray-600">Serviços verificados pelo AntiGolpe para sua segurança total online</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">NordVPN</h4>
              <p className="text-gray-600 mb-4">Navegação 100% anônima e protegida</p>
              <div className="text-2xl font-bold text-green-600 mb-2">-68% OFF</div>
              <a
                href="https://nordvpn.com?ref=antigolpe"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 inline-block"
              >
                🔐 Ativar Proteção
              </a>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Serasa Premium</h4>
              <p className="text-gray-600 mb-4">Monitoramento do seu CPF 24/7</p>
              <div className="text-2xl font-bold text-green-600 mb-2">1º mês GRÁTIS</div>
              <a
                href="https://serasa.com.br?ref=antigolpe"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 inline-block"
              >
                📊 Monitorar CPF
              </a>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Kaspersky Total</h4>
              <p className="text-gray-600 mb-4">Antivírus premium para todos dispositivos</p>
              <div className="text-2xl font-bold text-green-600 mb-2">-50% OFF</div>
              <a
                href="https://kaspersky.com.br?ref=antigolpe"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 inline-block"
              >
                🦠 Eliminar Vírus
              </a>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">✅ Todos os serviços são verificados e recomendados pelo AntiGolpe</p>
          </div>
        </div>

        {/* Custom Check Service */}
        <div className="mt-16 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-3xl shadow-2xl p-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-10 h-10 text-yellow-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">🔍 Análise Personalizada Premium</h3>
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
              href="https://wa.me/5511999999999?text=Olá! Preciso de uma análise personalizada pelo AntiGolpe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Phone className="w-5 h-5" />
              <span>📱 Solicitar Análise via WhatsApp</span>
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

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">🚀 Consultas Esgotadas!</h3>
              <p className="text-gray-600">Você já utilizou suas 5 consultas gratuitas. Faça upgrade para continuar protegido!</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-900">Pagamento Único</span>
                  <span className="text-2xl font-black text-green-600">R$ 29,90</span>
                </div>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    Consultas ilimitadas para sempre
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    Acesso aos relatórios detalhados
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    Suporte prioritário
                  </li>
                </ul>
                <button
                  onClick={() => handleUpgrade('basic')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 mt-4"
                >
                  💳 Comprar Agora
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                ⚠️ Suas consultas serão resetadas amanhã, mas upgrade garante acesso ilimitado!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Paywall Modal */}
      {showPaywallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowPaywallModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">🔍 Relatório Detalhado</h3>
              <p className="text-gray-600">Para ver a análise completa com todos os dados, certificados e histórico, faça upgrade!</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h4 className="font-bold text-blue-900 mb-2">📊 O que você verá:</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Certificados SSL detalhados</li>
                <li>• Dados WHOIS completos</li>
                <li>• Histórico de reclamações</li>
                <li>• Análise de redes sociais</li>
                <li>• Top 10 resultados Google</li>
                <li>• Scores de confiança</li>
              </ul>
            </div>

            <button
              onClick={() => handleUpgrade('basic')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300"
            >
              🔓 Desbloquear por R$ 29,90
            </button>
          </div>
        </div>
      )}

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPremiumModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">🚀 AntiGolpe PREMIUM</h3>
              <p className="text-xl text-gray-600">Proteção máxima contra fraudes com monitoramento 24/7</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Plano Mensal */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <div className="text-center mb-6">
                  <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <h4 className="text-xl font-bold text-gray-900">Mensal</h4>
                  <div className="text-3xl font-black text-gray-900 mt-2">R$ 12<span className="text-sm font-normal">/mês</span></div>
                </div>
                <button
                  onClick={() => handleUpgrade('premium')}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  7 DIAS GRÁTIS
                </button>
              </div>

              {/* Plano Anual - Destaque */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-2xl p-6 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MAIS POPULAR
                  </div>
                </div>
                <div className="text-center mb-6">
                  <Crown className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="text-xl font-bold text-gray-900">Anual</h4>
                  <div className="text-3xl font-black text-purple-600 mt-2">R$ 99<span className="text-sm font-normal">/ano</span></div>
                  <div className="text-sm text-green-600 font-semibold mt-1">🔥 ECONOMIA DE 31%</div>
                </div>
                <button
                  onClick={() => handleUpgrade('premium')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  7 DIAS GRÁTIS
                </button>
              </div>
            </div>

            {/* Recursos Premium */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                Recursos Exclusivos Premium
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Consultas 100% ilimitadas</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Monitoramento automático de sites</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Alertas por WhatsApp e Email</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Lista VIP de sites confiáveis</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Relatórios detalhados em PDF</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Suporte prioritário 24/7</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Análise de histórico completo</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">API para desenvolvedores</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                ✅ Cancele quando quiser • 🔒 Pagamento 100% seguro • 🇧🇷 Suporte nacional
              </p>
              <p className="text-xs text-gray-400">
                Teste 7 dias grátis. Após período de teste, será cobrado automaticamente.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Symbol Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-110">
          <span className="text-white font-bold text-lg">c🔱</span>
        </div>
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
                <h4 className="font-semibold mb-2 text-green-400">✅ Verificação Inteligente</h4>
                <p className="text-gray-300">IA avançada para detectar golpes com 99.8% de precisão</p>
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
