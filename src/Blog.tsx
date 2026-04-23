import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import {
  Shield, Search, CheckCircle, AlertTriangle, XCircle,
  Loader2, Crown, FileText, Globe, ArrowRight, Star,
  MessageCircle, Instagram, Mail as MailIcon, ShieldAlert,
  ThumbsUp, ThumbsDown, Clock, ChevronRight, User, Calendar,
  Share2, Bookmark, Heart
} from 'lucide-react';

/**
 * Blog.tsx - Fraudara.pro Official Blog
 * Optimized for SEO and High Conversion.
 * 100% Fidelity to Fraudara Design System.
 */

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: React.ReactNode;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  seoTitle: string;
  seoDesc: string;
  faqs: { q: string; a: string }[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'is-temu-a-scam-shocking-truth-2026',
    title: 'Is Temu a Scam? Shocking Truth (2026)',
    excerpt: 'Is Temu safe for your credit card? We analyzed their security protocols, shipping times, and hidden risks. Read before you buy.',
    category: 'Safety Analysis',
    author: 'Pablo Eduardo',
    date: '2026-04-20',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800',
    seoTitle: 'Is Temu Legit or a Scam? (2026) – Expert Safety Review',
    seoDesc: 'Thinking about shopping on Temu? Discover if Temu is safe, how they handle your data, and why you should use a verification tool like Fraudara.',
    content: (
      <>
        <p className="text-lg leading-relaxed mb-6">
          You've seen the ads. "Shop like a billionaire." But behind the ultra-low prices of <strong>Temu</strong>, a growing concern lingers among millions of shoppers: <em>Is my data safe?</em> In 2026, the digital landscape is more dangerous than ever, and understanding the platform you trust with your credit card is non-negotiable.
        </p>
        <h2 className="text-2xl font-black mb-4">The Reality of Temu Security</h2>
        <p className="mb-6">
          Temu is not a "scam" in the traditional sense—you will likely receive your products. However, the <strong>real risk</strong> lies in how the app handles your biometric data and payment information. Security researchers have flagged aggressive data collection practices that exceed what is necessary for an e-commerce app.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8 rounded-r-2xl">
          <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" /> Pro Tip: Verify the Domain
          </h4>
          <p className="text-blue-800 text-sm">
            Always ensure you are on the official Temu.com. Phishing clones are on the rise. Use <a href="https://fraudara.pro" className="font-bold underline">Fraudara.pro</a> to verify any link before clicking.
          </p>
        </div>
        <h2 className="text-2xl font-black mb-4">Factors of Risk to Consider</h2>
        <ul className="list-disc pl-6 mb-8 space-y-3">
          <li><strong>Aggressive Permissions:</strong> The app requests access to contacts, location, and even system logs.</li>
          <li><strong>Third-Party Sellers:</strong> Not all sellers on Temu are vetted equally. Some may ship low-quality or counterfeit goods.</li>
          <li><strong>Data Privacy:</strong> Being owned by PDD Holdings, data storage locations have been a point of international debate.</li>
        </ul>
        <h2 className="text-2xl font-black mb-4">Expert Verdict</h2>
        <p className="mb-6">
          Temu is safe for casual shopping if you take precautions. <strong>Never</strong> provide your main credit card; use a virtual one. Better yet, before every purchase, run the seller's URL through an AI verification tool.
        </p>
      </>
    ),
    faqs: [
      { q: "Is Temu safe for credit cards?", a: "While Temu uses encryption, we recommend using virtual cards or PayPal to add an extra layer of protection." },
      { q: "Does Temu sell your data?", a: "Like most large retailers, Temu collects data for advertising. The concern is the depth of data they access on your device." }
    ]
  },
  {
    id: '2',
    slug: 'how-to-detect-fake-websites-instantly',
    title: 'How to Detect Fake Websites Instantly (Expert Guide)',
    excerpt: 'Don’t be the next victim. Learn the 5 red flags that scammers use to clone famous brands like Amazon and Shopee.',
    category: 'Education',
    author: 'Pablo Eduardo',
    date: '2026-04-18',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
    seoTitle: 'How to Spot a Fake Website – 2026 Scam Detection Guide',
    seoDesc: 'Learn the professional methods to identify phishing sites and fake online stores. Protect yourself from digital fraud today.',
    content: (
      <>
        <p className="text-lg leading-relaxed mb-6">
          In 2026, AI-generated phishing sites are so convincing that even tech-savvy users fall for them. These sites clone the look of <strong>Amazon</strong> or <strong>Apple</strong> perfectly. So, how do you stay safe?
        </p>
        <h2 className="text-2xl font-black mb-4">1. The URL Deep-Dive</h2>
        <p className="mb-6">
          Look for "look-alike" domains. Scammers use <code>arnazon.com</code> instead of <code>amazon.com</code>. The difference is a single character, but the consequence is your entire bank account.
        </p>
        <div className="bg-slate-900 text-white p-8 rounded-3xl my-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Shield className="w-32 h-32" /></div>
          <h3 className="text-2xl font-black mb-4 relative z-10">Stop Guessing. Start Verifying.</h3>
          <p className="text-blue-100 mb-6 relative z-10">
            Why risk your money on a "hunch"? Fraudara.pro uses real-time AI to scan SSL certificates, WHOIS history, and social reputation in seconds.
          </p>
          <a href="https://fraudara.pro" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl inline-flex items-center gap-2 transition-all">
            Verify a Site Now <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <h2 className="text-2xl font-black mb-4">2. Check the SSL Issuer</h2>
        <p className="mb-6">
          A padlock icon isn't enough anymore. Free SSL certificates (like Let's Encrypt) are used by 90% of scammers. Check if the certificate is a "High Assurance" one issued to a real company.
        </p>
      </>
    ),
    faqs: [
      { q: "Is a padlock icon a guarantee of safety?", a: "No. It only means the connection is encrypted, not that the owner of the site is legitimate." },
      { q: "What should I do if I entered my info on a fake site?", a: "Contact your bank immediately, freeze your cards, and change your passwords." }
    ]
  },
  {
    id: '3',
    slug: '10-most-dangerous-websites-right-now-2026',
    title: '10 Most Dangerous Websites Right Now (2026 List)',
    excerpt: 'Our AI flagged these high-risk domains this week. If you have visited any of these, your data might be compromised.',
    category: 'Lists',
    author: 'Pablo Eduardo',
    date: '2026-04-21',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    seoTitle: 'Dangerous Websites List 2026 – Fraudara Scam Alert',
    seoDesc: 'Stay updated with the latest high-risk domains and phishing sites flagged by Fraudara AI. Don’t click before checking this list.',
    content: (
      <>
        <p className="text-lg leading-relaxed mb-6">
          The Fraudara AI engine scans over 100,000 new domains daily. This week, we've seen a massive surge in "Gift Card" scams and "Unpaid Tax" phishing portals.
        </p>
        <h2 className="text-2xl font-black mb-6">Top High-Risk Categories</h2>
        <div className="space-y-4 mb-8">
          {[
            { title: "Fake Government Portals", risk: "High", desc: "Sites mimicking tax offices to steal social security numbers." },
            { title: "Counterfeit Luxury Stores", risk: "Extreme", desc: "Clones of Rolex and Louis Vuitton offering 90% discounts." },
            { title: "Crypto 'Double Your Money' Sites", risk: "Extreme", desc: "Classic Ponzi schemes updated for 2026." }
          ].map((item, i) => (
            <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
              <div>
                <h4 className="font-bold text-slate-900">{item.title}</h4>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.risk === 'Extreme' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                {item.risk} Risk
              </span>
            </div>
          ))}
        </div>
        <p className="text-center font-medium text-slate-600 italic">
          Want to see the full list of blocked domains? <a href="https://fraudara.pro/premium" className="text-blue-600 underline">Upgrade to Premium</a>.
        </p>
      </>
    ),
    faqs: [
      { q: "How does Fraudara flag dangerous sites?", a: "We use machine learning to analyze domain age, server location, SSL metadata, and user reports in real-time." }
    ]
  }
];

const Blog: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [isUnlocked, setIsUnlocked] = useState(() => localStorage.getItem('fraudara_premium') === 'true');
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const currentPost = slug ? BLOG_POSTS.find(p => p.slug === slug) : null;

  if (slug && !currentPost) {
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-10">
      <Helmet>
        <title>Post Not Found – Fraudara</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div>
        <h1 className="text-3xl font-black mb-4">Post not found</h1>
        <p className="text-slate-500 mb-6">This article does not exist or was removed.</p>
        <Link to="/blog" className="text-blue-600 font-bold underline">
          Go back to blog
        </Link>
      </div>
    </div>
  );
}
  

  // --- BLOG HOME RENDER ---
  if (!slug) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Helmet>
  <title>Fraudara Blog – Online Safety, Scam Detection & Cybersecurity (2026)</title>
  <meta name="description" content="Learn how to detect scams, verify websites, and stay safe online. Expert guides, real cases, and AI-powered insights from Fraudara." />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

  <link rel="canonical" href="https://fraudara.pro/blog" />

  {/* Open Graph */}
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Fraudara Blog – Online Safety & Scam Detection" />
  <meta property="og:description" content="Expert insights on scam detection, fake websites, and online security." />
  <meta property="og:url" content="https://fraudara.pro/blog" />
  <meta property="og:image" content="https://fraudara.pro/og-image.png" />

  {/* Twitter */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Fraudara Blog – Online Safety & Scam Detection" />
  <meta name="twitter:description" content="Stay ahead of scammers with expert cybersecurity insights." />
  <meta name="twitter:image" content="https://fraudara.pro/og-image.png" />

  {/* Extra SEO */}
  <meta name="author" content="Fraudara" />
  <meta name="theme-color" content="#0f172a" />

<script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://fraudara.pro/#organization",
      "name": "Fraudara",
      "url": "https://fraudara.pro",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fraudara.pro/Fraudara_Logo1.png"
      },
      "sameAs": [
        "https://instagram.com/fraudara"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://fraudara.pro/#website",
      "url": "https://fraudara.pro",
      "name": "Fraudara",
      "publisher": {
        "@id": "https://fraudara.pro/#organization"
      }
    },
    {
      "@type": "Blog",
      "@id": "https://fraudara.pro/blog#blog",
      "url": "https://fraudara.pro/blog",
      "name": "Fraudara Blog",
      "description": "Online safety, scam detection and cybersecurity insights.",
      "publisher": {
        "@id": "https://fraudara.pro/#organization"
      },
      "inLanguage": "en"
    },
    {
      "@type": "ItemList",
      "name": "Fraudara Blog Articles",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url": "https://fraudara.pro/blog/is-temu-a-scam-shocking-truth-2026"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "url": "https://fraudara.pro/blog/how-to-detect-fake-websites-instantly"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "url": "https://fraudara.pro/blog/10-most-dangerous-websites-right-now-2026"
        }
      ]
    }
  ]
})}
</script>

</Helmet>

        {/* HEADER */}
        <header className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-20 text-center">
          <div className="max-w-7xl mx-auto px-4">
            <Link to="/" className="inline-flex items-center gap-3 mb-12">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg bg-blue-600">
                <img src="/Fraudara_Logo1.png" alt="Fraudara" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-black tracking-tight">Fraudara</span>
            </Link>
            <h1 className="text-4xl md:text-6xl font-black mb-6">The Fraudara Blog</h1>
            <p className="text-xl text-blue-100/80 max-w-2xl mx-auto font-medium">
              Your daily dose of digital security. Learn how to shop safe and avoid the most sophisticated scams of {currentYear}.
            </p>
          </div>
        </header>

        {/* FEATURED POSTS */}
        <main className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {BLOG_POSTS.map(post => (
              <Link to={`/blog/${post.slug}`} key={post.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100 flex flex-col">
                <div className="aspect-video overflow-hidden relative">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">{post.category}</div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}

</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-black mb-4 group-hover:text-blue-600 transition-colors leading-tight">{post.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-3">{post.excerpt}</p>
                  <div className="mt-auto flex items-center text-blue-600 font-bold text-sm gap-1 group-hover:gap-2 transition-all">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>

        
        <footer className="bg-slate-900 text-slate-500 py-12 text-center text-sm">
          <p>© {currentYear} Fraudara Blog. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  // --- SINGLE POST RENDER ---
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
  <Helmet>
  <title>{currentPost.seoTitle}</title>
  <meta name="description" content={currentPost.seoDesc} />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

  <link rel="canonical" href={`https://fraudara.pro/blog/${currentPost.slug}`} />

  {/* Open Graph */}
  <meta property="og:type" content="article" />
  <meta property="og:title" content={currentPost.seoTitle} />
  <meta property="og:description" content={currentPost.seoDesc} />
  <meta property="og:image" content={currentPost.image} />
  <meta property="og:url" content={`https://fraudara.pro/blog/${currentPost.slug}`} />

  {/* Twitter */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={currentPost.seoTitle} />
  <meta name="twitter:description" content={currentPost.seoDesc} />
  <meta name="twitter:image" content={currentPost.image} />

  {/* Extra SEO */}
  <meta name="author" content={currentPost.author} />
  <meta name="theme-color" content="#0f172a" />

  <script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://fraudara.pro/#organization",
      "name": "Fraudara",
      "url": "https://fraudara.pro",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fraudara.pro/Fraudara_Logo1.png"
      },
      "sameAs": [
        "https://instagram.com/fraudara"
      ]
    },
    {
      "@type": "Person",
      "@id": "https://fraudara.pro/#author",
      "name": currentPost.author,
      "url": "https://fraudara.pro",
      "sameAs": [
        "https://instagram.com/soupabloeduardo"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://fraudara.pro/#website",
      "url": "https://fraudara.pro",
      "name": "Fraudara",
      "publisher": {
        "@id": "https://fraudara.pro/#organization"
      }
    },
    {
      "@type": "WebPage",
      "@id": `https://fraudara.pro/blog/${currentPost.slug}#webpage`,
      "url": `https://fraudara.pro/blog/${currentPost.slug}`,
      "name": currentPost.seoTitle,
      "description": currentPost.seoDesc,
      "primaryImageOfPage": {
  "@type": "ImageObject",
  "url": currentPost.image
},
      "isPartOf": {
        "@id": "https://fraudara.pro/#website"
      },
      "inLanguage": "en"
    },
    {
  "@type": "BlogPosting",
  "@id": `https://fraudara.pro/blog/${currentPost.slug}#article`,
  "headline": currentPost.title,
  "description": currentPost.seoDesc,
  "image": {
    "@type": "ImageObject",
    "url": currentPost.image
  },
  "author": {
    "@id": "https://fraudara.pro/#author"
  },
  "publisher": {
    "@id": "https://fraudara.pro/#organization"
  },
  "mainEntityOfPage": {
    "@id": `https://fraudara.pro/blog/${currentPost.slug}#webpage`
  },
  "articleSection": currentPost.category,
  "keywords": currentPost.category + ", scam detection, online safety, website security",

  "dateCreated": new Date(currentPost.date).toISOString(),
  "datePublished": new Date(currentPost.date).toISOString(),
  "dateModified": new Date(currentPost.date).toISOString(),
  
    

  "inLanguage": "en"
},
    {
      "@type": "FAQPage",
       "@id": `https://fraudara.pro/blog/${currentPost.slug}#faq`,
      "mainEntity": currentPost.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://fraudara.pro"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://fraudara.pro/blog"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": currentPost.title,
          "item": `https://fraudara.pro/blog/${currentPost.slug}`
        }
      ]
    }
  ]
})}
</script>


</Helmet>

      {/* NAV */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/blog" className="flex items-center gap-2 font-bold text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Blog
          </Link>
          <Link to="/" className="flex items-center gap-2">
             <img src="/Fraudara_Logo1.png" alt="Fraudara" className="w-12 h-8" />
             <span className="font-black text-lg">Fraudara</span>
          </Link>
          <a href="https://fraudara.pro" className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg">Verify a Site</a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        {/* POST HEADER */}
        <div className="text-center mb-12">
          <div className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-4">{currentPost.category}</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-8">{currentPost.title}</h1>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-2"><User className="w-4 h-4" /> {currentPost.author}</div>
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(currentPost.date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}
</div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {currentPost.readTime}</div>
          </div>
        </div>

        <img src={currentPost.image} alt={currentPost.title} className="w-full aspect-video object-cover rounded-3xl mb-12 shadow-2xl" />

        {/* POST CONTENT */}
        <div className="prose prose-slate prose-lg max-w-none mb-20">
          {currentPost.content}
        </div>

        {/* DYNAMIC CTA BOX (PNL & PERSUASION) */}
        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-10 text-white shadow-2xl mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldAlert className="w-48 h-48" /></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-4">Don't be the next "Warning Story".</h3>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Every second, a new scam website is created. While you read this, someone just lost their savings. 
              <strong> Fraudara.pro</strong> is the only tool you need to stay invisible to hackers and scammers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://fraudara.pro" className="bg-white text-indigo-900 font-bold px-8 py-4 rounded-xl hover:scale-105 transition-all inline-flex items-center justify-center gap-2 shadow-lg group">
                Verify Any Site Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="https://fraudara.pro/is-site-safe/amazon" className="bg-blue-600/30 backdrop-blur-sm border border-white/20 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-600/50 transition-all inline-flex items-center justify-center">
                Check Amazon Safety
              </a>
            </div>
          </div>
        </div>

        {/* FAQ SECTION */}
        <section className="border-t border-slate-100 pt-16 mb-20">
          <h2 className="text-3xl font-black mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {currentPost.faqs.map((faq, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-indigo-900"><MessageCircle className="w-5 h-5 text-indigo-500" /> {faq.q}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CREATOR (SAME AS HOME.TSX) */}
        <div className="bg-slate-50 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <img src="/creator1.png" alt="Pablo Eduardo" className="w-24 h-24 rounded-2xl object-cover shadow-lg" />
          <div>
            <h4 className="font-black text-xl mb-1">Written by Pablo Eduardo</h4>
            <p className="text-slate-500 text-sm mb-4">CEO at Fraudara.pro & Cybersecurity Advocate. 11+ years protecting users from digital fraud.</p>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="https://instagram.com/soupabloeduardo" className="text-slate-400 hover:text-blue-600"><Instagram className="w-5 h-5" /></a>
              <a href="mailto:contactfraudara@gmail.com" className="text-slate-400 hover:text-blue-600"><MailIcon className="w-5 h-5" /></a>
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
          <p className="mb-4">© {currentYear} Fraudara Blog. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <a href="https://fraudara.pro/privacy" className="hover:text-white">Privacy</a>
            <a href="https://fraudara.pro/terms" className="hover:text-white">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
