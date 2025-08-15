// App.tsx
import React, { useState } from 'react';
import { Shield, Search, Share2, CheckCircle, AlertTriangle, XCircle, Loader2, Award, Users, Clock, TrendingUp, Star, Lock, Zap, Eye } from 'lucide-react';

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
    { icon: <TrendingUp className="w-6 h-6" />, value: "R$ 45M", label: "Golpes Evitados", color: "text-orange-600" },
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
        debug: data.debug,
        ssl: data.ssl,
        whois: data.whois,
        reclameAqui: data.reclameAqui,
        googleResults: data.googleResults ?? [],
      });
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
      {/* Header & Stats... (mantidos iguais) */}

      {/* Search e Result */}
      <main className="max-w-3xl mx-auto px-4 pb-12">
        {/* Search Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10 border border-gray-100">
          <div className="relative mb-6">
            <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="w-6 h-6" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Digite o nome da marca ou URL do site"
              className="w-full pl-16 pr-6 py-6 text-xl border-3 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-6 focus:ring-blue-100 transition-all duration-300 outline-none font-medium placeholder-gray-400"
              onKeyPress={e => e.key === 'Enter' && handleVerification()}
            />
          </div>
          <button
            onClick={handleVerification}
            disabled={!searchQuery.trim() || isVerifying}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-6 px-8 rounded-2xl flex items-center justify-center space-x-3 text-xl shadow-xl"
          >
            {isVerifying ? <Loader2 className="w-6 h-6 animate-spin" /> : <Shield className="w-6 h-6" />}
            <span>{isVerifying ? "Verificando Segurança..." : "🔍 Verificar Agora - GRÁTIS"}</span>
          </button>
        </div>

        {/* Result */}
        {result && !isVerifying && (
          <div className={`bg-white rounded-3xl shadow-2xl border-4 ${getResultColors()} p-10`}>
            <div className="text-center space-y-6">
              {getResultIcon()}
              <h3 className="text-3xl font-black">{result.title}</h3>
              <p className="text-xl text-gray-700">{result.message}</p>
              <div className="flex justify-center gap-8">
                <div className={`text-4xl font-black ${getTrustScoreColor()}`}>{result.trustScore}%</div>
                <div className="text-2xl font-bold">{result.verificationTime}</div>
              </div>

              {/* Botão detalhes */}
              {result.ssl || result.whois || result.reclameAqui || result.googleResults?.length ? (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="mt-4 inline-flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-xl"
                >
                  <Eye className="w-5 h-5" />
                  <span>{showDetails ? "Ocultar Detalhes" : "Ver Detalhes da Análise"}</span>
                </button>
              ) : null}

              {/* Detalhes */}
              {showDetails && (
                <div className="mt-6 text-left space-y-4 p-4 bg-gray-50 rounded-2xl">
                  {/* SSL */}
                  {result.ssl && (
                    <div>
                      <h4 className="font-bold">🔒 SSL</h4>
                      <p>Presente: {result.ssl.present ? "✅" : "❌"}</p>
                      <p>Validade: {result.ssl.validFrom ?? "—"} → {result.ssl.validTo ?? "—"}</p>
                      <p>Valido agora: {result.ssl.validNow ? "✅" : "❌"}</p>
                      <p>Emissor: {result.ssl.issuer?.CN ?? "—"}</p>
                    </div>
                  )}

                  {/* WHOIS */}
                  {result.whois && (
                    <div>
                      <h4 className="font-bold">📝 WHOIS</h4>
                      <p>Dados disponíveis: {result.whois.hasData ? "✅" : "❌"}</p>
                    </div>
                  )}

                  {/* Reclame Aqui */}
                  {result.reclameAqui && (
                    <div>
                      <h4 className="font-bold">📌 Reclame Aqui</h4>
                      {result.reclameAqui.found ? (
                        <>
                          <p>Score: {result.reclameAqui.score ?? "—"}</p>
                          <p>Total Reclamações: {result.reclameAqui.totalComplaints ?? "—"}</p>
                          <p>Últimos 30 dias: {result.reclameAqui.last30d ?? "—"}</p>
                          <p>
                            Link: <a href={result.reclameAqui.companyLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Abrir Reclame Aqui</a>
                          </p>
                        </>
                      ) : <p>Empresa não encontrada no Reclame Aqui.</p>}
                    </div>
                  )}

                  {/* Top 10 Google */}
                  {result.googleResults?.length > 0 && (
                    <div>
                      <h4 className="font-bold">🔗 Top 10 Links Google</h4>
                      <ul className="list-disc list-inside">
                        {result.googleResults.map((r, i) => (
                          <li key={i}>
                            <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                              {r.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
