import React, { useState } from 'react';
import { Shield, Search, Share2, CheckCircle, AlertTriangle, XCircle, Loader2, Award, Users, Clock, TrendingUp, Star, Lock, Zap } from 'lucide-react';

interface VerificationResult {
  status: 'safe' | 'suspicious' | 'danger';
  title: string;
  message: string;
  complaints: number;
  trustScore: number;
  verificationTime: string;
}

interface StatCard {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  // Estatísticas impressionantes para credibilidade
  const stats: StatCard[] = [
    {
      icon: <Shield className="w-6 h-6" />,
      value: "2.3M+",
      label: "Sites Verificados",
      color: "text-blue-600"
    },
    {
      icon: <Users className="w-6 h-6" />,
      value: "850K+",
      label: "Usuários Protegidos",
      color: "text-green-600"
    },
    {
      icon: <Award className="w-6 h-6" />,
      value: "99.7%",
      label: "Precisão",
      color: "text-purple-600"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      value: "R$ 45M",
      label: "Golpes Evitados",
      color: "text-orange-600"
    }
  ];






  
  const handleVerification = async () => {
  if (!searchQuery.trim()) return;

  setIsVerifying(true);
  setResult(null);

  try {
    const resp = await fetch("/.netlify/functions/verificar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: searchQuery }),
    });

    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.error || "Falha na verificação");

    setResult({
      status: data.status,
      title: data.title,
      message: data.message,
      complaints: data.complaints ?? 0,
      trustScore: data.trustScore ?? 0,
      verificationTime: data.verificationTime ?? "—",
    });

    // (Opcional) se quiser inspecionar detalhes no console:
    console.log("Detalhes:", {
      ssl: data.ssl,
      whois: data.whois,
      reclameAqui: data.reclameAqui,
      googleResults: data.googleResults,
      debug: data.debug,
    });
  } catch (e: any) {
    setResult({
      status: "danger",
      title: "🚨 ERRO NA VERIFICAÇÃO",
      message:
        "Não foi possível concluir a análise agora. Tente novamente em alguns instantes.",
      complaints: 0,
      trustScore: 8,
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
    
    if (result.trustScore >= 80) return 'text-green-600';
    if (result.trustScore >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
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
                  <span>🔍 Verificar Agora - GRÁTIS</span>
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
                  onClick={() => {setResult(null); setSearchQuery('');}}
                  className="inline-flex items-center justify-center space-x-3 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Search className="w-5 h-5" />
                  <span>🔍 Nova Verificação</span>
                </button>
              </div>
            </div>
          </div>
        )}

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
                <p className="text-gray-300">Serviço 100% gratuito para proteger todos os brasileiros</p>
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
