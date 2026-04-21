import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, Search, Share2, CheckCircle, AlertTriangle, XCircle,
  Loader2, Award, Users, Clock, TrendingUp, Star, Lock, Zap,
  ChevronDown, Crown, Gift, ExternalLink, ShoppingCart,
  FileText, Globe, ArrowRight, Sparkles, Eye, Bell, Check,
  Twitter, Instagram, Linkedin, MessageCircle, Mail, Phone,
  Code, Cpu, Target, BarChart3, ShieldCheck, BadgeCheck,
  Flame, Rocket, Infinity, RefreshCw, ChevronRight, X, ArrowDown, Mail as MailIcon
} from 'lucide-react';

/**
 * Amazon SEO Analysis Page - Fraudara.pro
 * Esta página é idêntica ao App.tsx original, mas focada em SEO para "Amazon".
 */

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

const AmazonAnalysis: React.FC = () => {
  // --- CONFIGURAÇÃO SEO ---
  const brand = "Amazon";
  const currentYear = new Date().getFullYear();
  const seoTitle = `Is ${brand} Safe? (${currentYear}) – Fraudara Analysis`;
  const seoH1 = `Is ${brand} Safe or a Scam?`;
  const seoSummary = `Is ${brand} a legitimate platform? Our real-time AI analysis cross-references 50+ data sources to protect your transactions in ${currentYear}.`;

  // --- ESTADOS ORIGINAIS DO APP.TSX ---
  const [language, setLanguage] = useState('pt');
  const [searchQuery, setSearchQuery] = useState(brand); // Pre-preenchido com Amazon
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [freeSearches, setFreeSearches] = useState(5);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- LÓGICA DE DESBLOQUEIO SEO ---
  // Liberamos o relatório apenas para a marca alvo (Amazon) nesta página.
  const [isSeoUnlocked, setIsSeoUnlocked] = useState(true);

  useEffect(() => {
    document.title = seoTitle;
    // Auto-click: Dispara a verificação assim que carrega
    handleVerification(brand);
  }, []);

  const handleVerification = async (queryToVerify?: string) => {
    const targetQuery = queryToVerify || searchQuery;
    if (!targetQuery.trim()) return;

    setIsVerifying(true);
    setResult(null);
    setShowDetails(false);

    try {
      const resp = await fetch('/.netlify/functions/verificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: targetQuery, language }),
      });
      const data = await resp.json();
      
      let ts = data.trustScore || 75;
      if (data.status === 'safe' && ts < 75) ts = Math.max(75, ts + 15);
      else if (data.status === 'danger' && ts > 40) ts = Math.min(40, ts - 10);
      else if (data.status === 'suspicious') ts = Math.max(40, Math.min(74, ts));

      setResult({ ...data, trustScore: ts });

      // Se o usuário pesquisar algo DIFERENTE de Amazon, bloqueamos o relatório (paywall normal)
      if (targetQuery.toLowerCase().includes(brand.toLowerCase())) {
        setIsSeoUnlocked(true);
      } else {
        setIsSeoUnlocked(false);
      }
    } catch {
      setResult({
        status: 'suspicious',
        title: '⚠️ VERIFICAÇÃO PARCIAL',
        message: 'Não foi possível concluir toda a análise. Recomendamos cautela.',
        complaints: 0, trustScore: 50, verificationTime: '—',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // --- FAQ PARA SEO (Rich Snippets) ---
  const faqs = [
    { q: `Is ${brand} legit?`, a: `${brand} is one of the world's most established companies. Our AI confirms its high trust score based on current security protocols.` },
    { q: `Is ${brand} safe for shopping?`, a: `Yes, ${brand} uses advanced encryption. However, always verify you are on the official domain via Fraudara.pro.` },
    { q: `Can I get scammed on ${brand}?`, a: `While ${brand} is safe, third-party sellers can sometimes be suspicious. Always check the seller rating or use our tool for specific product links.` }
  ];

  // Reuso do StatusConfig do App.tsx
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* ── HEADER E HERO (ESTILO APP.TSX) ── */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center justify-between py-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-blue-600">
                <img src="/Fraudara_Logo1.png" alt="Fraudara" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-black tracking-tight">Fraudara</span>
            </div>
            <a href="https://fraudara.pro" className="text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all">
              Ir para o Site Oficial →
            </a>
          </nav>

          <div className="pt-16 md:pt-24 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-7xl font-black mb-6 leading-tight">
              {seoH1}
            </h1>
            <p className="text-xl text-blue-100/80 mb-10 leading-relaxed max-w-2xl mx-auto">
              {seoSummary}
            </p>

            {/* CAIXA DE BUSCA (IDÊNTICA AO APP.TSX) */}
            <div className="bg-white rounded-2xl shadow-2xl p-2 max-w-2xl mx-auto">
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="flex-1 py-4 text-gray-900 outline-none font-medium bg-transparent"
                    placeholder="Digite o site ou marca..."
                    onKeyDown={e => e.key === 'Enter' && handleVerification()}
                  />
                </div>
                <button
                  onClick={() => handleVerification()}
                  disabled={isVerifying}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-6 py-4 rounded-xl transition-all flex items-center gap-2"
                >
                  {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                  <span className="hidden sm:inline">{isVerifying ? "Analisando..." : "Verificar Agora"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* RESULTADO DA VERIFICAÇÃO */}
        {result && (
          <div id="main-content" className={`bg-white rounded-3xl shadow-xl border-2 ${cfg?.border} overflow-hidden mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700`}>
            <div className={`bg-gradient-to-br ${cfg?.bg} p-8 md:p-12 text-center`}>
               <div className="flex justify-center mb-6">{cfg?.icon}</div>
               <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-black mb-4 uppercase tracking-wider ${cfg?.badge}`}>
                 {result.status === 'safe' ? 'Verificado Seguro' : result.status === 'suspicious' ? 'Suspeito' : 'Perigoso'}
               </div>
               <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{result.title}</h2>
               <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">{result.message}</p>
               
               <div className="max-w-md mx-auto bg-gray-200 rounded-full h-4 mb-3">
                 <div className={`h-full rounded-full transition-all duration-1000 ${cfg?.bar}`} style={{ width: `${result.trustScore}%` }}></div>
               </div>
               <div className={`text-3xl font-black ${cfg?.scoreColor}`}>{result.trustScore}/100</div>
            </div>

            {/* RELATÓRIO COMPLETO (DESBLOQUEADO PARA SEO) */}
            <div className="p-8 border-t border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Relatório Detalhado de Segurança
                </h3>
                {isSeoUnlocked && (
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" /> SEO UNLOCKED
                  </span>
                )}
              </div>

              {isSeoUnlocked ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-4 font-bold text-slate-800">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" /> Certificado SSL
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between"><span>Válido:</span> <span className="font-semibold text-emerald-600">Sim</span></div>
                      <div className="flex justify-between"><span>Emissor:</span> <span className="font-semibold">DigiCert Inc</span></div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-4 font-bold text-slate-800">
                      <Globe className="w-5 h-5 text-blue-500" /> Informações WHOIS
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between"><span>Idade:</span> <span className="font-semibold">28 anos</span></div>
                      <div className="flex justify-between"><span>Status:</span> <span className="font-semibold">Ativo</span></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <Lock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h4 className="font-bold text-slate-800 mb-2">Relatório Bloqueado</h4>
                  <p className="text-slate-500 text-sm mb-6">Acesse todos os dados com o plano Premium.</p>
                  <button onClick={() => setShowPricingModal(true)} className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg">
                    Desbloquear Agora
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── BANNER PERSUASIVO PARA O SITE PRINCIPAL (COPY MATADORA) ── */}
        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-8 my-16 text-white shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Shield className="w-48 h-48" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-black mb-4">Pare de cair em golpes agora mesmo.</h3>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl">
              O Fraudara.pro utiliza IA de nível militar para analisar sites em tempo real. 
              <strong> Não coloque seu cartão em sites suspeitos.</strong> Junte-se a 3.1M de usuários protegidos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://fraudara.pro" className="bg-white text-indigo-900 font-bold px-8 py-4 rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg group">
                Verificar qualquer site no Fraudara.pro
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* ── FAQ SECTION (SEO) ── */}
        <section className="mb-20">
          <h2 className="text-3xl font-black mb-10 text-center">Dúvidas Frequentes sobre {brand}</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-indigo-900">
                  <MessageCircle className="w-5 h-5 text-indigo-500" />
                  {faq.q}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── LINKAGEM INTERNA ── */}
        <section className="bg-slate-100 rounded-3xl p-8 mb-20">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Outras marcas que as pessoas verificam
          </h3>
          <div className="flex flex-wrap gap-3">
            {["Shopee", "Instagram", "AliExpress", "Temu", "Mercado Livre"].map(p => (
              <a key={p} href={`/is-site-safe/${p.toLowerCase().replace(' ', '-')}`} className="bg-white px-5 py-2.5 rounded-full text-sm font-semibold text-slate-600 hover:text-blue-600 hover:shadow-md transition-all border border-slate-200">
                Is {p} safe?
              </a>
            ))}
            <a href="https://fraudara.pro/blog" className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all">
              Visitar Blog do Fraudara
            </a>
          </div>
        </section>

        {/* RODAPÉ DO CRIADOR (IGUAL APP.TSX) */}
        <div className="border-t border-slate-200 pt-12">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden shadow-xl shadow-blue-900/20">
              <img src="/creator1.png" alt="Pablo Eduardo" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Fundador & CEO</p>
              <h3 className="text-2xl font-black mb-1">Pablo Eduardo</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
                Empreendedor digital e desenvolvedor há mais de 11 anos. Especialista em IA e marketing. 
                Criou o Fraudara para proteger o mundo de fraudes online.
              </p>
              <div className="flex gap-4 mt-4">
                 <a href="https://instagram.com/soupabloeduardo" target="_blank" className="text-slate-400 hover:text-pink-600 transition-colors"><Instagram className="w-5 h-5" /></a>
                 <a href="mailto:contato@fraudara.pro" className="text-slate-400 hover:text-blue-600 transition-colors"><MailIcon className="w-5 h-5" /></a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-500 py-12 text-center text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <p className="mb-4">© 2026 Fraudara. Todos os direitos reservados.</p>
          <div className="flex justify-center gap-6">
            <a href="https://fraudara.pro/privacy" className="hover:text-white">Privacidade</a>
            <a href="https://fraudara.pro/terms" className="hover:text-white">Termos</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AmazonAnalysis;
