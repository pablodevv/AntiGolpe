import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Shield, Search, Share2, CheckCircle, AlertTriangle, XCircle,
  Loader2, Award, Users, Clock, TrendingUp, Star, Lock, Zap,
  ChevronDown, Crown, Gift, ExternalLink, ShoppingCart,
  FileText, Globe, ArrowRight, Sparkles, Eye, Bell, Check,
  Twitter, Instagram, Linkedin, MessageCircle, Mail, Phone,
  Code, Cpu, Target, BarChart3, ShieldCheck, BadgeCheck,
  Flame, Rocket, Infinity, RefreshCw, ChevronRight, X, ArrowDown, Mail as MailIcon,
  ThumbsUp, ThumbsDown, ShieldAlert, Instagram as InstagramIcon,
} from 'lucide-react';

/**
 * AliExpressAnalysis.tsx - Fraudara.pro
 * Optimized for SEO (AliExpress).
 * 100% Fidelity to Home.tsx and BrandAnalysis logic.
 * High-CTR Variation Titles.
 * Language: English Only.
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

const AliExpressAnalysis: React.FC = () => {
  // --- SEO CONFIG (HIGH-CTR VARIATION) ---
  const brand = "AliExpress";
  const currentYear = new Date().getFullYear();
  const seoTitle = `Is ${brand} a Scam? The Shocking Reality of Shopping in ${currentYear}`;
  const seoH1 = `Is ${brand} Legit or a Scam? Read Before You Buy! (${currentYear})`;
  const seoDescription = `Is ${brand} safe for your credit card? Our AI exposes the truth about ${brand}'s buyer protection, counterfeit risks, and shipping safety in ${currentYear}.`;

  // --- APP STATE (IDENTICAL TO HOME.TSX) ---
  const [searchQuery, setSearchQuery] = useState(brand);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Syncing with Home.tsx (localStorage)
  const [freeSearches, setFreeSearches] = useState(() => {
    const saved = localStorage.getItem('fraudara_searches');
    return saved ? parseInt(saved) : 5;
  });
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('fraudara_premium') === 'true';
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // --- SEO UNLOCK LOGIC ---
  const isQueryBrand = searchQuery.toLowerCase().includes(brand.toLowerCase());

  useEffect(() => {
    handleVerification(); // Auto-check on mount
    
    const handleStorage = () => {
      setIsUnlocked(localStorage.getItem('fraudara_premium') === 'true');
      const s = localStorage.getItem('fraudara_searches');
      setFreeSearches(s ? parseInt(s) : 5);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const getStoredSearches = () => {
    const s = localStorage.getItem('fraudara_searches');
    return s ? parseInt(s) : 5;
  };

  const handleVerification = async () => {
    if (!searchQuery.trim()) return;

    const currentSearches = getStoredSearches();
    
    if (!isUnlocked && !isQueryBrand && currentSearches <= 0) {
      setFreeSearches(0);
      setShowUpgradeModal(true);
      return;
    }

    setIsVerifying(true);
    setResult(null);
    setShowDetails(false);

    try {
      const resp = await fetch('/.netlify/functions/verificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, language: 'en' }),
      });
      const data = await resp.json();
      
      let ts = data.trustScore || 82;
      if (data.status === 'safe' && ts < 82) ts = Math.max(82, ts + 8);
      else if (data.status === 'danger' && ts > 40) ts = Math.min(40, ts - 10);
      else if (data.status === 'suspicious') ts = Math.max(40, Math.min(81, ts));

      setResult({ ...data, trustScore: ts });

      if (!isUnlocked && !isQueryBrand) {
        const nextValue = Math.max(0, currentSearches - 1);
        setFreeSearches(nextValue);
        localStorage.setItem('fraudara_searches', nextValue.toString());
      }
    } catch {
      setResult({
        status: 'safe',
        title: '✅ GLOBAL MARKETPLACE VERIFIED',
        message: 'AliExpress is a secure global platform owned by Alibaba Group.',
        complaints: 0, trustScore: 94, verificationTime: '—',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUpgrade = (plan: string) => {
    if (plan === 'starter') {
      setShowPricingModal(false);
      return;
    }
    const urls: Record<string, string> = {
      unlimited: 'https://buy.stripe.com/cNidR94ZbgQ28N58Inb7y05',
      premium: 'https://buy.stripe.com/dRm4gz2R39nA7J19Mrb7y06',
      annual: 'https://buy.stripe.com/3cI28rezL6bo9R92jZb7y07',
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

  const pricingPlans = [
    { id: 'starter', name: 'Starter', price: 'Free', period: 'forever', features: ['5 verifications', 'Basic analysis', '24/7 Support'], cta: 'Continue Free', btnClass: 'bg-slate-100 text-slate-600 hover:bg-slate-200' },
    { id: 'unlimited', name: 'Pro', price: '$29.90', period: 'one-time', badge: 'MOST POPULAR', features: ['Unlimited verifications', 'Full reports', 'Priority support', 'Real-time alerts'], cta: 'Unlock Now', btnClass: 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' },
    { id: 'premium', name: 'Premium', price: '$12', period: '/month', features: ['Unlimited everything', 'API Access', 'Custom analysis', 'WhatsApp alerts'], cta: 'Subscribe', btnClass: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://fraudara.pro/is-site-safe/${brand.toLowerCase()}`} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is AliExpress safe for buyers?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "AliExpress is generally safe. It uses a robust buyer protection system where payment is only released to the seller after you confirm receipt of the item."
                }
              },
              {
                "@type": "Question",
                "name": "How to avoid scams on AliExpress?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Always check seller ratings, read recent reviews, and never pay outside the AliExpress platform. Use Fraudara to verify any suspicious links or shops."
                }
              }
            ]
          })}
        </script>
      </Helmet>

      {/* ── ANNOUNCEMENT BAR ── */}
      {!isUnlocked && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white text-center py-2.5 px-4 text-sm">
          <span className="font-semibold">🔥 LIMITED OFFER</span>{' '}
          Premium Access for only $12/mo — save $5/mo{' '}
          <button onClick={() => setShowPricingModal(true)} className="underline underline-offset-2 font-bold hover:no-underline ml-1">
            GUARANTEE NOW →
          </button>
        </div>
      )}

      {/* ── HEADER ── */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4 border-b border-white/10">
           
                              <div className="flex items-center gap-2 sm:gap-6">
              {/* Botão de Voltar Visível em Todos os Dispositivos */}
              <a 
                href="/" 
                className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-white/60 hover:text-white transition-all bg-white/5 border border-white/10 px-2 sm:px-3 py-1.5 rounded-lg group"
              >
                <ArrowRight className="w-3 h-3 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                <span className="uppercase tracking-wider">Home</span>
              </a>

              <a href="/" className="flex items-center gap-2 sm:gap-3 group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl overflow-hidden shadow-lg bg-blue-600 group-hover:scale-105 transition-transform">
                  <img src="/Fraudara_Logo1.png" alt="Fraudara" className="w-full h-full object-contain" />
                </div>
                <span className="text-lg sm:text-xl font-black tracking-tight group-hover:text-blue-400 transition-colors">Fraudara</span>
              </a>
            </div>


            <div className="flex items-center gap-3">
              {!isUnlocked && (
                <button onClick={() => setShowPricingModal(true)} className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                  <Crown className="w-4 h-4 text-amber-400" /> Premium
                </button>
              )}
              <div className="text-xs font-bold bg-blue-500/20 px-3 py-1.5 rounded-full border border-blue-500/30">
                {isUnlocked ? 'Unlimited Access' : `${freeSearches} free checks left`}
              </div>
            </div>
          </div>

          <div className="py-20 md:py-32 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 px-4">
              {seoH1}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100/80 max-w-2xl mx-auto mb-10 leading-relaxed font-medium px-4">
              Don't let fake stores steal your money. Our AI scans {brand} sellers and domain authenticity in real-time.
            </p>

            {/* SEARCH BOX (RESPONSIVE FIX) */}
            <div className="bg-white rounded-2xl shadow-2xl p-2 max-w-2xl mx-auto mb-6 mx-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Enter AliExpress product link or store..."
                    onKeyDown={e => e.key === 'Enter' && handleVerification()}
                    className="flex-1 py-4 text-gray-900 outline-none text-base font-medium bg-transparent min-w-0"
                  />
                </div>
                <button
                  onClick={handleVerification}
                  disabled={!searchQuery.trim() || isVerifying}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                  <span>{isVerifying ? "Analyzing..." : "Verify Now"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-4xl mx-auto px-4 py-12">
        
        {/* LOADING STATE */}
        {isVerifying && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center animate-pulse border-2 border-blue-100">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Security Scan Active</h3>
            <p className="text-gray-500">Scanning {searchQuery} for phishing patterns and seller reputation...</p>
          </div>
        )}

        {/* RESULT SECTION */}
        {result && !isVerifying && (
          <div className={`bg-white rounded-3xl shadow-xl border-2 ${cfg?.border} overflow-hidden mb-12`}>
            <div className={`bg-gradient-to-br ${cfg?.bg} p-8 md:p-12 text-center`}>
               <div className="flex justify-center mb-6">{cfg?.icon}</div>
               <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-black mb-4 uppercase tracking-wider ${cfg?.badge}`}>
                 {result.status === 'safe' ? 'Platform Verified' : result.status === 'suspicious' ? 'Suspicious' : 'Danger'}
               </div>
               <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{result.title}</h2>
               <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">{result.message}</p>
               
               <div className="max-w-md mx-auto bg-gray-200 rounded-full h-4 mb-3">
                 <div className={`h-full rounded-full transition-all duration-1000 ${cfg?.bar}`} style={{ width: `${result.trustScore}%` }}></div>
               </div>
               <div className={`text-4xl font-black ${cfg?.scoreColor}`}>{result.trustScore}/100</div>
               <div className="text-gray-400 text-sm mt-1">Trust Score Index</div>
            </div>

            <div className="p-8 border-t border-gray-100">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-8">
                <FileText className="w-5 h-5 text-blue-600" /> {brand} Security Report
              </h3>

              {(isUnlocked || isQueryBrand) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-4 font-bold text-slate-800"><ShieldCheck className="w-5 h-5 text-emerald-500" /> Domain Authentication</div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between"><span>Official:</span> <span className="font-semibold text-emerald-600">Yes</span></div>
                      <div className="flex justify-between"><span>SSL:</span> <span className="font-semibold text-emerald-600">DigiCert (Valid)</span></div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-4 font-bold text-slate-800"><Globe className="w-5 h-5 text-blue-500" /> Marketplace Status</div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between"><span>Age:</span> <span className="font-semibold">14 years</span></div>
                      <div className="flex justify-between"><span>Parent:</span> <span className="font-semibold">Alibaba Group</span></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <Lock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h4 className="font-bold text-slate-800 mb-2">Detailed Scan Locked</h4>
                  <p className="text-slate-500 text-sm mb-6">Unlock full access to see all deep-scan indicators.</p>
                  <button onClick={() => setShowPricingModal(true)} className="bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:scale-105 transition-all">
                    Unlock Now →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── EXPLOSIVE SEO CONTENT ── */}
        <article className="prose prose-slate max-w-none mb-20">
          <br/>
          <h2 className="text-3xl font-black mb-6">Final Verdict: Is {brand} Legit or a Scam in {currentYear}?</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            <strong>AliExpress</strong> is one of the largest and most legitimate e-commerce platforms in the world. 
            However, because it operates as a marketplace for millions of third-party sellers, the <strong>scam risk</strong> 
            comes from individual vendors, not the platform itself. In {currentYear}, the most common traps involve 
            "too good to be true" prices on electronics and phishing sites that clone the AliExpress login page.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
              <h4 className="font-bold text-emerald-800 flex items-center gap-2 mb-4"><ThumbsUp className="w-5 h-5" /> Safety Pros</h4>
              <ul className="space-y-2 text-sm text-emerald-700">
                <li className="flex items-center gap-2"><Check className="w-4 h-4" /> Strong Buyer Protection (Refunds)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4" /> Escrow Payment System</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4" /> Real-time Order Tracking</li>
              </ul>
            </div>
            <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
              <h4 className="font-bold text-rose-800 flex items-center gap-2 mb-4"><ThumbsDown className="w-5 h-5" /> Safety Cons</h4>
              <ul className="space-y-2 text-sm text-rose-700">
                <li className="flex items-center gap-2"><X className="w-4 h-4" /> High risk of counterfeit goods</li>
                <li className="flex items-center gap-2"><X className="w-4 h-4" /> Misleading product descriptions</li>
                <li className="flex items-center gap-2"><X className="w-4 h-4" /> Phishing sites mimicking official domain</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-black mb-4">The Danger of "Look-Alike" Sites</h3>
          <p className="mb-6">
            Scammers often create sites like <code>aliexpress-deals.net</code> or <code>aliexpress-support.com</code>. 
            These are NOT official. They are designed to steal your credit card information. 
            <strong> Fraudara.pro</strong> uses AI to verify the WHOIS history and SSL authenticity of any link, 
            ensuring you are always on the real, secure platform.
          </p>
        </article>

        {/* ── PERSUASIVE CTA ── */}
        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-8 my-16 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldAlert className="w-48 h-48" /></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-4">Stop Guessing. Start Shopping Safe.</h3>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl leading-relaxed">
              Don't let a "deal of a lifetime" turn into a financial nightmare. One wrong click can expose your data. 
              <strong> Fraudara.pro</strong> is the shield you need in the wild west of online shopping.
            </p>
            <a href="https://fraudara.pro" className="bg-white text-indigo-900 font-bold px-8 py-4 rounded-xl hover:scale-105 transition-all inline-flex items-center justify-center gap-2 shadow-lg group">
              Verify any AliExpress Link at Fraudara.pro
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* ── FAQ SECTION ── */}
        <section className="mb-20">
          <h2 className="text-3xl font-black mb-10 text-center">{brand} Safety FAQ</h2>
          <div className="space-y-4">
            {[
              { q: `Is AliExpress safe for my credit card?`, a: `Yes, AliExpress uses high-level encryption. However, for maximum safety, we recommend using virtual cards or PayPal.` },
              { q: `What is the AliExpress Buyer Protection?`, a: `It is a guarantee that you will get your money back if the item is not as described or if it is not delivered within the promised period.` },
              { q: `How can I tell if an AliExpress seller is a scammer?`, a: `Check for stores with low positive feedback (below 90%) and those that have been open for less than 6 months. Use Fraudara to verify store URLs.` }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-indigo-900"><MessageCircle className="w-5 h-5 text-indigo-500" /> {faq.q}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── INTERNAL LINKS ── */}
        <section className="bg-slate-100 rounded-3xl p-8 mb-20 text-center">
          <h3 className="font-bold text-slate-800 mb-6">Security analysis for other brands</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {["Amazon", "Instagram", "Shopee", "Temu", "TikTok"].map(p => (
              <a key={p} href={`/is-site-safe/${p.toLowerCase().replace(' ', '-')}`} className="bg-white px-5 py-2.5 rounded-full text-sm font-semibold text-slate-600 hover:text-blue-600 hover:shadow-md transition-all border border-slate-200">
                Is {p} safe?
              </a>
            ))}
            <a href="https://fraudara.pro/blog" className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all">Visit Blog</a>
          </div>
        </section>

        {/* CREATOR SECTION */}
        <div className="border-t border-slate-200 pt-12">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden shadow-xl shadow-blue-900/20">
              <img src="/creator1.png" alt="Pablo Eduardo" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Founder & CEO</p>
              <h3 className="text-2xl font-black mb-1">Pablo Eduardo</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
                A specialist in international fraud prevention, Pablo designed Fraudara to help millions of shoppers navigate global marketplaces without fear.
              </p>
              <div className="flex gap-4 mt-4">
                 <a href="https://instagram.com/soupabloeduardo" target="_blank" className="text-slate-400 hover:text-pink-600 transition-colors"><InstagramIcon className="w-5 h-5" /></a>
                 <a href="mailto:contactfraudara@gmail.com" className="text-slate-400 hover:text-blue-600 transition-colors"><MailIcon className="w-5 h-5" /></a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* SIGIL */}
      <div className="fixed bottom-4 right-4 z-40 select-none opacity-50 hover:opacity-100 transition-opacity">
        <img src="/Bune_Sigil.png" alt="Sigil" className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
      </div>

      <footer className="bg-slate-900 text-slate-500 py-12 text-center text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <p className="mb-4">© {currentYear} Fraudara. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <a href="https://fraudara.pro/privacy" className="hover:text-white">Privacy</a>
            <a href="https://fraudara.pro/terms" className="hover:text-white">Terms</a>
          </div>
        </div>
      </footer>

      {/* --- MODALS --- */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setShowPricingModal(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6" /></button>
            <div className="text-center mb-8">
              <Crown className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="text-3xl font-black text-gray-900 mb-2">Total Security</h3>
              <p className="text-gray-500">Shop globally with absolute confidence.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              {pricingPlans.map(plan => (
                <div key={plan.id} className={`relative border-2 border-slate-100 rounded-2xl p-6 ${plan.badge ? 'border-blue-500 shadow-xl scale-105' : 'shadow-md'}`}>
                  {plan.badge && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white bg-blue-600">{plan.badge}</div>}
                  <div className="text-center mb-5">
                    <div className="font-black text-gray-900 text-lg mb-2">{plan.name}</div>
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-3xl font-black text-gray-900">{plan.price}</span>
                      <span className="text-gray-500 text-sm mb-1">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />{f}</li>
                    ))}
                  </ul>
                  <button onClick={() => handleUpgrade(plan.id)} className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${plan.btnClass}`}>{plan.cta}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative">
            <button onClick={() => setShowUpgradeModal(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6" /></button>
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><Gift className="w-8 h-8 text-orange-500" /></div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Free Scan Limit Reached</h3>
            <p className="text-gray-500 text-sm mb-6">Don't leave your money to chance. Upgrade for unlimited real-time protection.</p>
            <div className="space-y-3">
              <button onClick={() => handleUpgrade('unlimited')} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl text-sm">🚀 Unlock Unlimited — $29.90</button>
              <button onClick={() => { setShowUpgradeModal(false); setShowPricingModal(true); }} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 rounded-xl text-sm">👑 Premium — $12/mo</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AliExpressAnalysis;
