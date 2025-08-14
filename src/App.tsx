import React, { useState } from 'react';
import { Shield, Search, Share2, CheckCircle, AlertTriangle, XCircle, Loader2, Award, Users, Clock, TrendingUp, Star, Lock, Zap, ChevronDown, ChevronUp } from 'lucide-react';

interface VerificationResult {
  status: 'safe' | 'suspicious' | 'danger';
  title: string;
  message: string;
  complaints: number;
  trustScore: number;
  verificationTime: string;
  ssl?: string;
  whois?: string;
  googleResults?: string[];
  reclameAqui?: string;
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
  const [showDetails, setShowDetails] = useState(false);

  const stats: StatCard[] = [
    { icon: <Shield className="w-6 h-6" />, value: "2.3M+", label: "Sites Verificados", color: "text-blue-600" },
    { icon: <Users className="w-6 h-6" />, value: "850K+", label: "Usuários Protegidos", color: "text-green-600" },
    { icon: <Award className="w-6 h-6" />, value: "99.7%", label: "Precisão", color: "text-purple-600" },
    { icon: <TrendingUp className="w-6 h-6" />, value: "R$ 45M", label: "Golpes Evitados", color: "text-orange-600" }
  ];

  const handleVerification = async () => {
    if (!searchQuery.trim()) return;
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

      setResult({
        status: data.status,
        title: data.title,
        message: data.message,
        complaints: data.complaints ?? 0,
        trustScore: data.trustScore ?? 0,
        verificationTime: data.verificationTime ?? "—",
        ssl: data.ssl,
        whois: data.whois,
        googleResults: data.googleResults?.slice(0, 10),
        reclameAqui: data.reclameAqui,
      });

      console.log("Detalhes:", data);
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
      case 'safe': return <CheckCircle className="w-12 h-12 text-green-600" />;
      case 'suspicious': return <AlertTriangle className="w-12 h-12 text-yellow-600" />;
      case 'danger': return <XCircle className="w-12 h-12 text-red-600" />;
    }
  };

  const getResultColors = () => {
    if (!result) return '';
    switch (result.status) {
      case 'safe': return 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-green-100';
      case 'suspicious': return 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-yellow-100';
      case 'danger': return 'border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-red-100';
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
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-center space-x-4">
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
              <div className="flex items-center space-x-1 text-sm text-gray-600"><Lock className="w-4 h-4" /><span className="font-medium">100% Seguro</span></div>
              <div className="flex items-center space-x-1 text-sm text-gray-600"><Zap className="w-4 h-4" /><span className="font-medium">Verificação Instantânea</span></div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-all duration-300">
            <div className={`flex justify-center mb-2 ${stat.color}`}>{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-4 pb-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Verifique Qualquer Site ou Marca em Segundos</h2>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">Nossa inteligência artificial analisa milhões de dados em tempo real para proteger você contra golpes online</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10 border border-gray-100">
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400"><Search className="w-6 h-6" /></div>
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
              {isVerifying ? (<><Loader2 className="w-6 h-6 animate-spin" /><span>Verificando Segurança...</span></>) :
              (<><Shield className="w-6 h-6" /><span>🔍 Verificar Agora - GRÁTIS</span></>)}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && !isVerifying && (
          <div className={`bg-white rounded-3xl shadow-2xl border-4 ${getResultColors()} p-10 space-y-6`}>
            <div className="text-center space-y-6">
              {getResultIcon()}
              <h3 className="text-3xl font-black text-gray-900 leading-tight">{result.title}</h3>
              <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">{result.message}</p>

              {/* Trust Score */}
              <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <div className={`text-4xl font-black ${getTrustScoreColor()}`}>{result.trustScore}%</div>
                    <div className="text-sm text-gray-600 font-semibold">Índice de Confiança</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{result.verificationTime}</div>
                    <div className="text-sm text-gray-600 font-semibold">Tempo de Análise</div>
                  </div>
                </div>
                {result.complaints > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-800 font-semibold text-center">⚠️ <strong>{result.complaints} reclamações</strong> encontradas nos últimos 30 dias</p>
                  </div>
                )}
              </div>

              {/* Details Toggle */}
              { (result.ssl || result.whois || result.googleResults || result.reclameAqui) && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center justify-center space-x-2 text-blue-600 font-bold underline mt-4 mx-auto"
                >
                  <span>{showDetails ? 'Ocultar Detalhes da Análise' : 'Ver Detalhes da Análise'}</span>
                  {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              )}

              {/* Details Content */}
              {showDetails && (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mt-4 space-y-4 text-left text-gray-700">
                  {result.ssl && <p>🔒 <strong>SSL:</strong> {result.ssl}</p>}
                  {result.whois && <p>📋 <strong>WHOIS:</strong> {result.whois}</p>}
                  {result.googleResults && result.googleResults.length > 0 && (
                    <div>
                      <strong>🔗 Top 10 links:</strong>
                      <ol className="list-decimal list-inside mt-1 space-y-1">
                        {result.googleResults.map((link, i) => <li key={i}><a href={link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{link}</a></li>)}
                      </ol>
                    </div>
                  )}
                  {result.reclameAqui && <p>⚠️ <strong>Reclame Aqui:</strong> <a href={result.reclameAqui} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{result.reclameAqui}</a></p>}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                <button onClick={handleShare} className="inline-flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <Share2 className="w-5 h-5" /><span>📱 Compartilhar no WhatsApp</span>
                </button>
                <button onClick={() => {setResult(null); setSearchQuery(''); setShowDetails(false);}} className="inline-flex items-center justify-center space-x-3 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <Search className="w-5 h-5" /><span>🔍 Nova Verificação</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
