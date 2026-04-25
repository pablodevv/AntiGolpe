import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import {
  Shield, Search, CheckCircle, AlertTriangle, XCircle,
  Loader2, Users, Star, Lock,
  Crown, Gift,
  FileText, Globe, ArrowRight, Check,
  Instagram, Mail,
  ShieldCheck, MessageCircle,
  X as XIcon, ThumbsUp, ThumbsDown, ShieldAlert
} from 'lucide-react';

interface BrandPageData {
  id: string;
  slug: string;
  brand: string;
  domain: string;
  seo_title: string;
  seo_h1: string;
  seo_description: string;
  status: string;
  trust_score: number;
  verification_data: any;
  ai_content: any;
  schema_data: any;
  is_indexed: boolean;
  created_at: string;
}

const BrandAnalysis: React.FC = () => {
  const { brand: brandSlug } = useParams<{ brand: string }>();
  const navigate = useNavigate();

  const [pageData, setPageData] = useState<BrandPageData | null>(null);
  const [notFound, setNotFound] = useState(false);

  const brand = pageData?.brand || brandSlug || '';
  const currentYear = new Date().getFullYear();
  const seoTitle = pageData?.seo_title || `Is ${brand} Safe? (${currentYear}) – Fraudara Analysis & Security Check`;
  const seoH1 = pageData?.seo_h1 || `Is ${brand} Safe or a Scam? The Shocking Truth (${currentYear})`;
  const seoDescription = pageData?.seo_description || `Is ${brand} a legitimate platform? Read our expert analysis on ${brand}'s safety, security indicators, and potential risks in ${currentYear}. Protect your money with Fraudara.`;

  const [searchQuery, setSearchQuery] = useState(brand);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [, setShowDetails] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const [freeSearches, setFreeSearches] = useState(() => {
    const saved = localStorage.getItem('fraudara_searches');
    return saved ? parseInt(saved) : 5;
  });
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('fraudara_premium') === 'true';
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const isQueryBrand = searchQuery.toLowerCase().includes(brand.toLowerCase());

  // Load page data from Supabase ONLY - never auto-generate
  useEffect(() => {
    const loadPageData = async () => {
      if (!brandSlug) {
        setNotFound(true);
        return;
      }

      try {
        const { data, error: dbError } = await supabase
          .from('brand_pages')
          .select('*')
          .eq('slug', brandSlug)
          .maybeSingle();

        if (dbError) throw dbError;

        if (data) {
          setPageData(data);
          setSearchQuery(data.brand);
        } else {
          // Page does not exist in DB - do NOT generate it
          // Only pages created via Home search should exist
          setNotFound(true);
        }
      } catch (err) {
        console.error('Error loading page data:', err);
        setNotFound(true);
      }
    };

    loadPageData();
  }, [brandSlug]);


  // Prerender signal - only after pageData is loaded so content is visible
useEffect(() => {
  if ((pageData && !isVerifying) || notFound) {
    window.prerenderReady = true;
  }
}, [pageData, notFound, isVerifying]);

  // Storage sync
  useEffect(() => {
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

      let ts = data.trustScore || 75;
      if (data.status === 'safe' && ts < 75) ts = Math.max(75, ts + 15);
      else if (data.status === 'danger' && ts > 40) ts = Math.min(40, ts - 10);
      else if (data.status === 'suspicious') ts = Math.max(40, Math.min(74, ts));

      setResult({ ...data, trustScore: ts });

      if (!isUnlocked && !isQueryBrand) {
        const nextValue = Math.max(0, currentSearches - 1);
        setFreeSearches(nextValue);
        localStorage.setItem('fraudara_searches', nextValue.toString());
      }
    } catch {
      setResult({
        status: 'suspicious',
        title: '⚠️ PARTIAL VERIFICATION',
        message: 'Could not complete the full analysis. We recommend caution.',
        complaints: 0, trustScore: 50, verificationTime: '—',
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

  const pageStatus = pageData?.status || result?.status || 'suspicious';
  const cfg = statusConfig[pageStatus as keyof typeof statusConfig] || statusConfig.suspicious;
  const trustScore = pageData?.trust_score || result?.trustScore || 50;

  const aiContent = pageData?.ai_content;
  const schemaData = pageData?.schema_data;
  const verificationData = pageData?.verification_data || result;

  const faqItems = aiContent?.faq || [
    { question: `Is ${brand} legit?`, answer: `${brand} is analyzed by Fraudara using multiple data sources. Our verification checks SSL, domain age, and online reputation to determine legitimacy.` },
    { question: `Is ${brand} safe for credit cards?`, answer: `We recommend always checking for valid SSL certificates and using secure payment methods when transacting on ${brand}.` },
    { question: `How to avoid scams on ${brand}?`, answer: `Always verify you are on the official domain, check seller ratings, and never share credentials via email or chat.` },
    { question: `Is ${brand} a scam or real?`, answer: `Our analysis shows ${brand} has a trust score of ${trustScore}/100. Always verify the URL and look for security indicators.` },
    { question: `Can I trust ${brand} with my personal data?`, answer: `Check the privacy policy and data handling practices. Use strong passwords and enable two-factor authentication when available.` },
  ];

  const analysisContent = aiContent?.analysis_content || {};
  const whySafe = analysisContent.why_safe || ['SSL certificate is present and valid', 'Domain has been registered for multiple years', 'Active social media presence'];
  const risks = analysisContent.risks || ['Phishing sites may impersonate this brand', 'Third-party sellers may not be verified', 'Always verify you are on the official domain'];
  const comparisonRows = analysisContent.comparison_rows || [
    { feature: 'SSL Verification', manual: 'Slow / Technical', fraudara: 'Instant (AI)' },
    { feature: 'WHOIS History', manual: 'Requires tools', fraudara: 'Full Deep Scan' },
    { feature: 'Real-time Scam Alerts', manual: 'None', fraudara: '24/7 Active' },
  ];
  const companyHistory = analysisContent.company_history || `${brand} is a well-known online platform.`;
  const countryOfOrigin = analysisContent.country_of_origin || 'Global';
  const commonScams = analysisContent.common_scams || [`Phishing emails pretending to be from ${brand}`, `Fake ${brand} login pages`];
  const recentIssues = analysisContent.recent_issues || 'No major security incidents reported recently.';

  const ctaHeading = aiContent?.cta_heading || "Don't be the next victim.";
  const ctaText = aiContent?.cta_text || 'Every single day, thousands of people lose their life savings to sophisticated digital traps. Fraudara.pro is the #1 defense against online fraud.';

  const pricingPlans = [
    { id: 'starter', name: 'Starter', price: 'Free', period: 'forever', features: ['5 verifications', 'Basic analysis', '24/7 Support'], cta: 'Continue Free', btnClass: 'bg-slate-100 text-slate-600 hover:bg-slate-200' },
    { id: 'unlimited', name: 'Pro', price: '$29.90', period: 'one-time', badge: 'MOST POPULAR', features: ['Unlimited verifications', 'Full reports', 'Priority support', 'Real-time alerts'], cta: 'Unlock Now', btnClass: 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' },
    { id: 'premium', name: 'Premium', price: '$12', period: '/month', features: ['Unlimited everything', 'API Access', 'Custom analysis', 'WhatsApp alerts'], cta: 'Subscribe', btnClass: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' },
  ];

  // NOT FOUND - redirect to home, do NOT create page
  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Shield className="w-16 h-16 text-slate-300 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-gray-900 mb-3">Analysis Not Available</h2>
          <p className="text-gray-500 mb-6">
            We haven't analyzed <span className="font-bold text-gray-700">{brandSlug}</span> yet.
            Search for it on the home page to generate a full security report.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all inline-flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Check on Fraudara Home
          </button>
        </div>
      </div>
    );
  }

  // Wait for pageData before rendering content (no loading spinner)
  if (!pageData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://fraudara.pro/check/${brandSlug}`} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={`https://fraudara.pro/check/${brandSlug}`} />
        <meta property="og:image" content="https://fraudara.pro/safe-og.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content="https://fraudara.pro/safe-og.png" />

        <script type="application/ld+json">
          {JSON.stringify(schemaData || {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://fraudara.pro/#organization",
                "name": "Fraudara",
                "url": "https://fraudara.pro",
                "logo": { "@type": "ImageObject", "url": "https://fraudara.pro/Fraudara_Logo1.png" },
                "sameAs": ["https://instagram.com/soupabloeduardo"]
              },
              {
                "@type": "WebPage",
                "url": `https://fraudara.pro/check/${brandSlug}`,
                "name": seoTitle,
                "description": seoDescription,
                "inLanguage": "en"
              },
              {
                "@type": "FAQPage",
                "mainEntity": faqItems.map((item: any) => ({
                  "@type": "Question",
                  "name": item.question,
                  "acceptedAnswer": { "@type": "Answer", "text": item.answer }
                }))
              }
            ]
          })}
        </script>
      </Helmet>

      {/* ANNOUNCEMENT BAR */}
      {!isUnlocked && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white text-center py-2.5 px-4 text-sm">
          <span className="font-semibold">LIMITED OFFER</span>{' '}
          Premium Access for only $12/mo — save $5/mo{' '}
          <button onClick={() => setShowPricingModal(true)} className="underline underline-offset-2 font-bold hover:no-underline ml-1">
            GUARANTEE NOW
          </button>
        </div>
      )}

      {/* HEADER */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4 border-b border-white/10">
            <div className="flex items-center gap-2 sm:gap-6">
              <a href="/" className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-white/60 hover:text-white transition-all bg-white/5 border border-white/10 px-2 sm:px-3 py-1.5 rounded-lg group">
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
              Before you spend a dime, let our AI scan the security indicators. Real-time protection for {currentYear}.
            </p>

            {/* SEARCH BOX */}
            <div className="bg-white rounded-2xl shadow-2xl p-2 max-w-2xl mx-auto mb-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Enter website URL..."
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
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border-2 border-blue-100">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Analysis in Progress</h3>
            <p className="text-gray-500">Our AI is checking 50+ data sources for {searchQuery}...</p>
          </div>
        )}

        {/* RESULT SECTION */}
        {(result || pageData) && !isVerifying && (
          <div className={`bg-white rounded-3xl shadow-xl border-2 ${cfg.border} overflow-hidden mb-12`}>
            <div className={`bg-gradient-to-br ${cfg.bg} p-8 md:p-12 text-center`}>
              <div className="flex justify-center mb-6">{cfg.icon}</div>
              <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-black mb-4 uppercase tracking-wider ${cfg.badge}`}>
                {pageStatus === 'safe' ? 'Verified Safe' : pageStatus === 'suspicious' ? 'Suspicious' : 'Danger'}
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                {result?.title || (pageStatus === 'safe' ? `${brand} is Safe` : pageStatus === 'danger' ? `${brand} is Dangerous` : `${brand} - Use Caution`)}
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
                {result?.message || `Our AI has analyzed ${brand} across 50+ data sources. Here is the complete security report.`}
              </p>

              <div className="max-w-md mx-auto bg-gray-200 rounded-full h-4 mb-3">
                <div className={`h-full rounded-full transition-all duration-1000 ${cfg.bar}`} style={{ width: `${trustScore}%` }}></div>
              </div>
              <div className={`text-4xl font-black ${cfg.scoreColor}`}>{trustScore}/100</div>
              <div className="text-gray-400 text-sm mt-1">Trust Score Index</div>
            </div>

            {/* DETAILS SECTION */}
            <div className="p-8 border-t border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" /> Full Security Report
                </h3>
              </div>

              {(isUnlocked || isQueryBrand) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* SSL */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-4 font-bold text-slate-800">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" /> SSL Certificate
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between"><span>Valid:</span> <span className="font-semibold text-emerald-600">{verificationData?.ssl?.validNow ? 'Yes' : verificationData?.ssl?.present ? 'Yes' : 'Unknown'}</span></div>
                      <div className="flex justify-between"><span>Issuer:</span> <span className="font-semibold">{verificationData?.ssl?.issuer?.CN || 'N/A'}</span></div>
                      <div className="flex justify-between"><span>Expiration:</span> <span className="font-semibold">{verificationData?.ssl?.validTo || 'N/A'}</span></div>
                    </div>
                  </div>
                  {/* WHOIS */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-4 font-bold text-slate-800">
                      <Globe className="w-5 h-5 text-blue-500" /> Domain Information
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between"><span>Domain:</span> <span className="font-semibold">{pageData?.domain || brandSlug}</span></div>
                      <div className="flex justify-between"><span>Owner:</span> <span className="font-semibold">{verificationData?.whois?.hasData ? 'Available' : 'Protected'}</span></div>
                      <div className="flex justify-between"><span>Status:</span> <span className="font-semibold">Active</span></div>
                    </div>
                  </div>
                  {/* SOCIAL */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-4 font-bold text-slate-800">
                      <Users className="w-5 h-5 text-purple-500" /> Social Presence
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between"><span>Instagram:</span> <span className="font-semibold">{verificationData?.social?.instagram ? 'Verified' : 'Check'}</span></div>
                      <div className="flex justify-between"><span>Twitter:</span> <span className="font-semibold">{verificationData?.social?.twitter ? 'Verified' : 'Check'}</span></div>
                    </div>
                  </div>
                  {/* REPUTATION */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-4 font-bold text-slate-800">
                      <Star className="w-5 h-5 text-amber-500" /> Online Reputation
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between"><span>TrustPilot:</span> <span className="font-semibold">{verificationData?.trustPilot?.rating ? `${verificationData.trustPilot.rating}/5.0` : 'N/A'}</span></div>
                      <div className="flex justify-between"><span>Complaints:</span> <span className="font-semibold">{verificationData?.complaints || result?.complaints || 0}</span></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <Lock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h4 className="font-bold text-slate-800 mb-2">Report Locked</h4>
                  <p className="text-slate-500 text-sm mb-6">Unlock full access to see all security indicators.</p>
                  <button onClick={() => setShowPricingModal(true)} className="bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:scale-105 transition-all">
                    Unlock Now
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* EXPLOSIVE SEO CONTENT */}
        <article className="prose prose-slate max-w-none mb-20">
          <br />
          <h2 className="text-3xl font-black mb-6">{analysisContent.verdict_title || `Expert Verdict: Is ${brand} Truly Safe?`}</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            {analysisContent.verdict_text || `Our security researchers have thoroughly examined ${brand}'s infrastructure and consumer feedback loops. As of ${currentYear}, ${brand} shows a trust score of ${trustScore}/100. However, safety isn't just about the platform; it's about the domain you visit. Scammers frequently create "cloned" versions of ${brand} to steal login credentials and credit card data.`}
          </p>

          {/* Company Info Box */}
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-8">
            <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-4"><Globe className="w-5 h-5" /> About {brand}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
              <div><span className="font-semibold">Country:</span> {countryOfOrigin}</div>
              <div><span className="font-semibold">Domain:</span> {pageData?.domain || brandSlug}</div>
              <div><span className="font-semibold">Trust Score:</span> {trustScore}/100</div>
            </div>
            <p className="text-sm text-blue-700 mt-3">{companyHistory}</p>
            {recentIssues && <p className="text-sm text-blue-600 mt-2 italic">{recentIssues}</p>}
          </div>

          {/* Common Scams */}
          {commonScams && commonScams.length > 0 && (
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 mb-8">
              <h4 className="font-bold text-red-800 flex items-center gap-2 mb-4"><ShieldAlert className="w-5 h-5" /> Common {brand} Scams to Watch For</h4>
              <ul className="space-y-2 text-sm text-red-700">
                {commonScams.map((scam: string, i: number) => (
                  <li key={i} className="flex items-center gap-2"><XCircle className="w-4 h-4 flex-shrink-0" /> {scam}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
              <h4 className="font-bold text-emerald-800 flex items-center gap-2 mb-4"><ThumbsUp className="w-5 h-5" /> Why it's Safe</h4>
              <ul className="space-y-2 text-sm text-emerald-700">
                {whySafe.map((item: string, i: number) => (
                  <li key={i} className="flex items-center gap-2"><Check className="w-4 h-4" /> {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
              <h4 className="font-bold text-rose-800 flex items-center gap-2 mb-4"><ThumbsDown className="w-5 h-5" /> Potential Risks</h4>
              <ul className="space-y-2 text-sm text-rose-700">
                {risks.map((item: string, i: number) => (
                  <li key={i} className="flex items-center gap-2"><XIcon className="w-4 h-4" /> {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-black mb-4">Comparison: Fraudara vs. Manual Checking</h3>
          <div className="overflow-x-auto mb-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-4 font-bold border-b">Feature</th>
                  <th className="p-4 font-bold border-b">Manual Check</th>
                  <th className="p-4 font-bold border-b text-blue-600">Fraudara.pro</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {comparisonRows.map((row: any, i: number) => (
                  <tr key={i}>
                    <td className="p-4 border-b">{row.feature}</td>
                    <td className="p-4 border-b text-slate-500">{row.manual}</td>
                    <td className="p-4 border-b font-bold">{row.fraudara}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Long-tail keywords section for SEO */}
          {aiContent?.long_tail_keywords && (
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4">Related Safety Questions About {brand}</h3>
              <div className="flex flex-wrap gap-2">
                {aiContent.long_tail_keywords.map((kw: string, i: number) => (
                  <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-sm">{kw}</span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* PERSUASIVE CTA */}
        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-8 my-16 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldAlert className="w-48 h-48" /></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-4">{ctaHeading}</h3>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl leading-relaxed">
              {ctaText}
              <strong> Fraudara.pro</strong> is the #1 defense against online fraud.
            </p>
            <a href="https://fraudara.pro" className="bg-white text-indigo-900 font-bold px-8 py-4 rounded-xl hover:scale-105 transition-all inline-flex items-center gap-2 shadow-lg group">
              Scan any website now at Fraudara.pro
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* FAQ SECTION */}
        <section className="mb-20">
          <h2 className="text-3xl font-black mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((faq: any, i: number) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-indigo-900"><MessageCircle className="w-5 h-5 text-indigo-500" /> {faq.question}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* INTERNAL LINKS */}
        <section className="bg-slate-100 rounded-3xl p-8 mb-20 text-center">
          <h3 className="font-bold text-slate-800 mb-6">Check other popular platforms</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {["Amazon", "Shopee", "Instagram", "AliExpress", "Temu", "PayPal", "Mercado Livre"].filter(p => p.toLowerCase() !== brand.toLowerCase()).slice(0, 5).map(p => (
              <a key={p} href={`/check/${p.toLowerCase().replace(' ', '-')}`} className="bg-white px-5 py-2.5 rounded-full text-sm font-semibold text-slate-600 hover:text-blue-600 hover:shadow-md transition-all border border-slate-200">
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
                Digital entrepreneur and developer for over 11 years. Expert in AI, marketing, and copywriting.
                Created Fraudara to protect the world from online scams.
              </p>
              <div className="flex gap-4 mt-4">
                <a href="https://instagram.com/soupabloeduardo" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-600 transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="mailto:contactfraudara@gmail.com" className="text-slate-400 hover:text-blue-600 transition-colors"><Mail className="w-5 h-5" /></a>
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
          <p className="mb-4">&copy; 2026 Fraudara. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <a href="https://fraudara.pro/privacy" className="hover:text-white">Privacy</a>
            <a href="https://fraudara.pro/terms" className="hover:text-white">Terms</a>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setShowPricingModal(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full"><XIcon className="w-6 h-6" /></button>
            <div className="text-center mb-8">
              <Crown className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="text-3xl font-black text-gray-900 mb-2">Complete Protection</h3>
              <p className="text-gray-500">Millions choose Fraudara to stay safe online.</p>
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
            <button onClick={() => setShowUpgradeModal(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full"><XIcon className="w-6 h-6" /></button>
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><Gift className="w-8 h-8 text-orange-500" /></div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Free Checks Exhausted</h3>
            <p className="text-gray-500 text-sm mb-6">You've used all your free checks. Continue protected with unlimited access.</p>
            <div className="space-y-3">
              <button onClick={() => handleUpgrade('unlimited')} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl text-sm">Unlock Unlimited — $29.90</button>
              <button onClick={() => { setShowUpgradeModal(false); setShowPricingModal(true); }} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 rounded-xl text-sm">Premium — $12/mo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandAnalysis;
