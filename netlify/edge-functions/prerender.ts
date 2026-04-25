// netlify/edge-functions/prerender.ts
// Coloque este arquivo em: netlify/edge-functions/prerender.ts

import { Context } from "https://edge.netlify.com";

// ============================================================
// LISTA COMPLETA DE BOTS - Google, Bing, redes sociais, etc.
// ============================================================
const BOT_AGENTS = [
  // Search engines
  "googlebot",
  "google-inspectiontool",
  "adsbot-google",
  "mediapartners-google",
  "bingbot",
  "msnbot",
  "slurp",           // Yahoo
  "duckduckbot",
  "baiduspider",
  "yandexbot",
  "sogou",
  "exabot",
  "facebot",
  "ia_archiver",     // Alexa
  "applebot",
  "semrushbot",
  "ahrefsbot",
  "mj12bot",
  "dotbot",
  "rogerbot",
  // Social media / preview
  "facebookexternalhit",
  "facebookcatalog",
  "twitterbot",
  "linkedinbot",
  "whatsapp",
  "telegrambot",
  "skypeuripreview",
  "slackbot",
  "discordbot",
  "pinterest",
  "vkshare",
  "w3c_validator",
  // Generic
  "crawler",
  "spider",
  "prerender",
  "headlesschrome",
  "phantomjs",
  "wget",
  "curl",
  "python-requests",
  "go-http-client",
  "java/",
  "libwww-perl",
  "scrapy",
];

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_AGENTS.some((bot) => ua.includes(bot));
}

function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ============================================================
// HANDLER PRINCIPAL
// ============================================================
export default async function handler(req: Request, context: Context) {
  const userAgent = req.headers.get("user-agent") || "";
  const url = new URL(req.url);

  // Só intercepta /check/* e só para bots
  if (!url.pathname.startsWith("/check/") || !isBot(userAgent)) {
    return context.next();
  }

  const slug = url.pathname.replace("/check/", "").replace(/\/$/, "");
  if (!slug) return context.next();

  // ---- Variáveis de ambiente (as mesmas do seu .env / Netlify UI) ----
  const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL");
  const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_ANON_KEY");

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("[prerender] Missing Supabase env vars");
    return context.next();
  }

  try {
    // ---- Busca do Supabase ----
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/brand_pages?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("[prerender] Supabase error:", response.status);
      return context.next();
    }

    const data = await response.json();
    const page = data?.[0];

    // Página não existe no banco → serve o SPA normal (React vai lidar)
    if (!page) {
      return context.next();
    }

    // ============================================================
    // EXTRAI TODOS OS DADOS — idêntico ao BrandAnalysis.tsx
    // ============================================================
    const brand = page.brand || slug;
    const currentYear = new Date().getFullYear();

    const seoTitle =
      page.seo_title ||
      `Is ${brand} Safe? (${currentYear}) – Fraudara Analysis & Security Check`;
    const seoH1 =
      page.seo_h1 ||
      `Is ${brand} Safe or a Scam? The Shocking Truth (${currentYear})`;
    const seoDescription =
      page.seo_description ||
      `Is ${brand} a legitimate platform? Read our expert analysis on ${brand}'s safety, security indicators, and potential risks in ${currentYear}. Protect your money with Fraudara.`;

    const pageStatus = page.status || "suspicious";
    const trustScore = page.trust_score || 50;
    const domain = page.domain || slug;

    const aiContent = page.ai_content || {};
    const schemaData = page.schema_data;
    const verificationData = page.verification_data || {};
    const analysisContent = aiContent.analysis_content || {};

    // FAQ — idêntico ao BrandAnalysis.tsx
    const faqItems: { question: string; answer: string }[] = aiContent.faq || [
      {
        question: `Is ${brand} legit?`,
        answer: `${brand} is analyzed by Fraudara using multiple data sources. Our verification checks SSL, domain age, and online reputation to determine legitimacy.`,
      },
      {
        question: `Is ${brand} safe for credit cards?`,
        answer: `We recommend always checking for valid SSL certificates and using secure payment methods when transacting on ${brand}.`,
      },
      {
        question: `How to avoid scams on ${brand}?`,
        answer: `Always verify you are on the official domain, check seller ratings, and never share credentials via email or chat.`,
      },
      {
        question: `Is ${brand} a scam or real?`,
        answer: `Our analysis shows ${brand} has a trust score of ${trustScore}/100. Always verify the URL and look for security indicators.`,
      },
      {
        question: `Can I trust ${brand} with my personal data?`,
        answer: `Check the privacy policy and data handling practices. Use strong passwords and enable two-factor authentication when available.`,
      },
    ];

    // Conteúdo de análise — idêntico ao BrandAnalysis.tsx
    const verdictTitle =
      analysisContent.verdict_title ||
      `Expert Verdict: Is ${brand} Truly Safe?`;
    const verdictText =
      analysisContent.verdict_text ||
      `Our security researchers have thoroughly examined ${brand}'s infrastructure and consumer feedback loops. As of ${currentYear}, ${brand} shows a trust score of ${trustScore}/100. However, safety isn't just about the platform; it's about the domain you visit. Scammers frequently create "cloned" versions of ${brand} to steal login credentials and credit card data.`;

    const companyHistory =
      analysisContent.company_history || `${brand} is a well-known online platform.`;
    const countryOfOrigin = analysisContent.country_of_origin || "Global";
    const recentIssues =
      analysisContent.recent_issues ||
      "No major security incidents reported recently.";

    const whySafe: string[] = analysisContent.why_safe || [
      "SSL certificate is present and valid",
      "Domain has been registered for multiple years",
      "Active social media presence",
    ];
    const risks: string[] = analysisContent.risks || [
      "Phishing sites may impersonate this brand",
      "Third-party sellers may not be verified",
      "Always verify you are on the official domain",
    ];
    const commonScams: string[] = analysisContent.common_scams || [
      `Phishing emails pretending to be from ${brand}`,
      `Fake ${brand} login pages`,
    ];
    const comparisonRows: { feature: string; manual: string; fraudara: string }[] =
      analysisContent.comparison_rows || [
        {
          feature: "SSL Verification",
          manual: "Slow / Technical",
          fraudara: "Instant (AI)",
        },
        {
          feature: "WHOIS History",
          manual: "Requires tools",
          fraudara: "Full Deep Scan",
        },
        {
          feature: "Real-time Scam Alerts",
          manual: "None",
          fraudara: "24/7 Active",
        },
      ];

    const longTailKeywords: string[] = aiContent.long_tail_keywords || [];

    const ctaHeading = aiContent.cta_heading || "Don't be the next victim.";
    const ctaText =
      aiContent.cta_text ||
      "Every single day, thousands of people lose their life savings to sophisticated digital traps.";

    // Status badge text — idêntico ao BrandAnalysis.tsx
    const statusBadgeText =
      pageStatus === "safe"
        ? "Verified Safe"
        : pageStatus === "suspicious"
        ? "Suspicious"
        : "Danger";

    const statusResultTitle =
      pageStatus === "safe"
        ? `${brand} is Safe`
        : pageStatus === "danger"
        ? `${brand} is Dangerous`
        : `${brand} - Use Caution`;

    // SSL / WHOIS / Social / Reputation — do verificationData
    const sslValid =
      verificationData?.ssl?.validNow || verificationData?.ssl?.present
        ? "Yes"
        : "Unknown";
    const sslIssuer = verificationData?.ssl?.issuer?.CN || "N/A";
    const sslExpiration = verificationData?.ssl?.validTo || "N/A";
    const whoisOwner = verificationData?.whois?.hasData ? "Available" : "Protected";
    const socialInstagram = verificationData?.social?.instagram ? "Verified" : "Check";
    const socialTwitter = verificationData?.social?.twitter ? "Verified" : "Check";
    const trustPilotRating = verificationData?.trustPilot?.rating
      ? `${verificationData.trustPilot.rating}/5.0`
      : "N/A";
    const complaints = verificationData?.complaints || 0;

    // ============================================================
    // SCHEMA.ORG — idêntico ao Helmet do BrandAnalysis.tsx
    // ============================================================
    const schemaJson =
      schemaData ||
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://fraudara.pro/#organization",
            name: "Fraudara",
            url: "https://fraudara.pro",
            logo: {
              "@type": "ImageObject",
              url: "https://fraudara.pro/Fraudara_Logo1.png",
            },
            sameAs: ["https://instagram.com/soupabloeduardo"],
          },
          {
            "@type": "WebPage",
            url: `https://fraudara.pro/check/${slug}`,
            name: seoTitle,
            description: seoDescription,
            inLanguage: "en",
          },
          {
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          },
        ],
      };

    // ============================================================
    // INTERNAL LINKS — idêntico ao BrandAnalysis.tsx
    // ============================================================
    const internalBrands = [
      "Amazon",
      "Shopee",
      "Instagram",
      "AliExpress",
      "Temu",
      "PayPal",
      "Mercado Livre",
    ]
      .filter((p) => p.toLowerCase() !== brand.toLowerCase())
      .slice(0, 5);

    // ============================================================
    // MONTA O HTML COMPLETO
    // ============================================================
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- PRIMARY SEO -->
  <title>${escapeHtml(seoTitle)}</title>
  <meta name="description" content="${escapeHtml(seoDescription)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://fraudara.pro/check/${slug}" />

  <!-- OPEN GRAPH (Facebook, WhatsApp, LinkedIn, Discord, Slack) -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(seoTitle)}" />
  <meta property="og:description" content="${escapeHtml(seoDescription)}" />
  <meta property="og:url" content="https://fraudara.pro/check/${slug}" />
  <meta property="og:image" content="https://fraudara.pro/safe-og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Fraudara" />
  <meta property="og:locale" content="en_US" />

  <!-- TWITTER CARD -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(seoTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(seoDescription)}" />
  <meta name="twitter:image" content="https://fraudara.pro/safe-og.png" />
  <meta name="twitter:site" content="@fraudara" />

  <!-- WHATSAPP / TELEGRAM extra -->
  <meta property="og:image:alt" content="${escapeHtml(`${brand} safety analysis - Fraudara`)}" />

  <!-- FAVICON -->
  <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
  <link rel="icon" href="/favicon.ico" type="image/x-icon" />
  <link rel="apple-touch-icon" href="/Fraudara_Logo1.png" />

  <!-- SCHEMA.ORG STRUCTURED DATA -->
  <script type="application/ld+json">${JSON.stringify(schemaJson)}</script>

  <!-- BreadcrumbList Schema -->
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://fraudara.pro",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `Is ${brand} Safe?`,
        item: `https://fraudara.pro/check/${slug}`,
      },
    ],
  })}</script>

  <!-- Article Schema -->
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: seoH1,
    description: seoDescription,
    url: `https://fraudara.pro/check/${slug}`,
    image: "https://fraudara.pro/safe-og.png",
    author: {
      "@type": "Person",
      name: "Pablo Eduardo",
      url: "https://instagram.com/soupabloeduardo",
    },
    publisher: {
      "@type": "Organization",
      name: "Fraudara",
      logo: {
        "@type": "ImageObject",
        url: "https://fraudara.pro/Fraudara_Logo1.png",
      },
    },
    dateModified: new Date().toISOString().split("T")[0],
    inLanguage: "en",
  })}</script>

  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 0; background: #f8fafc; color: #0f172a; }
    .container { max-width: 900px; margin: 0 auto; padding: 0 1rem; }
    h1 { font-size: 2rem; font-weight: 900; line-height: 1.2; }
    h2 { font-size: 1.5rem; font-weight: 800; }
    h3 { font-size: 1.2rem; font-weight: 700; }
    .badge { display: inline-block; padding: 0.25rem 1rem; border-radius: 999px; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .badge-safe { background: #d1fae5; color: #065f46; }
    .badge-suspicious { background: #fef3c7; color: #92400e; }
    .badge-danger { background: #fee2e2; color: #991b1b; }
    .card { background: #fff; border-radius: 1.5rem; padding: 2rem; margin-bottom: 1.5rem; border: 2px solid #e2e8f0; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    @media (max-width: 600px) { .grid-2 { grid-template-columns: 1fr; } }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.75rem 1rem; border-bottom: 1px solid #e2e8f0; text-align: left; }
    th { background: #f1f5f9; font-weight: 700; }
    .tag { background: #f1f5f9; color: #475569; padding: 0.3rem 0.75rem; border-radius: 999px; font-size: 0.8rem; display: inline-block; margin: 0.2rem; }
    .trust-bar-bg { background: #e2e8f0; border-radius: 999px; height: 1rem; max-width: 28rem; margin: 0 auto; }
    .trust-bar-fill-safe { background: #10b981; height: 100%; border-radius: 999px; }
    .trust-bar-fill-suspicious { background: #f59e0b; height: 100%; border-radius: 999px; }
    .trust-bar-fill-danger { background: #ef4444; height: 100%; border-radius: 999px; }
    .score-safe { color: #059669; }
    .score-suspicious { color: #d97706; }
    .score-danger { color: #dc2626; }
    ul.check-list { list-style: none; padding: 0; margin: 0; }
    ul.check-list li { padding: 0.25rem 0; font-size: 0.9rem; }
    .section-green { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 1rem; padding: 1.25rem; }
    .section-red { background: #fff1f2; border: 1px solid #fecaca; border-radius: 1rem; padding: 1.25rem; }
    .section-blue { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 1rem; padding: 1.25rem; }
    .section-orange { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 1rem; padding: 1.25rem; }
    header { background: #0f172a; color: #fff; padding: 2rem 1rem; }
    footer { background: #0f172a; color: #94a3b8; padding: 2rem 1rem; text-align: center; font-size: 0.85rem; }
    footer a { color: #94a3b8; margin: 0 0.75rem; }
    .faq-item { background: #fff; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 1.25rem; margin-bottom: 0.75rem; }
    .row-flex { display: flex; justify-content: space-between; padding: 0.2rem 0; font-size: 0.875rem; }
  </style>
</head>
<body>

<header>
  <div class="container">
    <p style="font-size:0.75rem;opacity:0.6;margin:0 0 0.5rem">
      <a href="/" style="color:#fff;text-decoration:none">← Home</a>
      &nbsp;/&nbsp; Security Analysis
    </p>
    <h1>${escapeHtml(seoH1)}</h1>
    <p style="color:#bfdbfe;margin-top:0.75rem;font-size:1rem;">
      Before you spend a dime, let our AI scan the security indicators. Real-time protection for ${currentYear}.
    </p>
  </div>
</header>

<main class="container" style="padding-top:2rem;padding-bottom:3rem;">

  <!-- RESULT CARD — idêntico ao card de resultado do BrandAnalysis -->
  <div class="card" style="text-align:center;margin-bottom:2rem;">
    <span class="badge badge-${escapeHtml(pageStatus)}">${escapeHtml(statusBadgeText)}</span>
    <h2 style="margin:1rem 0 0.5rem;">${escapeHtml(statusResultTitle)}</h2>
    <p style="color:#475569;margin-bottom:1.5rem;">
      Our AI has analyzed ${escapeHtml(brand)} across 50+ data sources. Here is the complete security report.
    </p>
    <div class="trust-bar-bg">
      <div class="trust-bar-fill-${escapeHtml(pageStatus)}" style="width:${trustScore}%"></div>
    </div>
    <p class="score-${escapeHtml(pageStatus)}" style="font-size:2rem;font-weight:900;margin:0.5rem 0 0;">
      ${trustScore}/100
    </p>
    <p style="color:#94a3b8;font-size:0.8rem;margin:0;">Trust Score Index</p>
  </div>

  <!-- SECURITY REPORT DETAILS — idêntico às 4 cards do BrandAnalysis -->
  <h2 style="margin-bottom:1rem;">Full Security Report</h2>
  <div class="grid-2" style="margin-bottom:2rem;">

    <!-- SSL -->
    <div class="card" style="padding:1.25rem;">
      <h3 style="margin:0 0 0.75rem;">SSL Certificate</h3>
      <div class="row-flex"><span>Valid:</span> <strong style="color:#059669;">${escapeHtml(sslValid)}</strong></div>
      <div class="row-flex"><span>Issuer:</span> <strong>${escapeHtml(sslIssuer)}</strong></div>
      <div class="row-flex"><span>Expiration:</span> <strong>${escapeHtml(sslExpiration)}</strong></div>
    </div>

    <!-- WHOIS / Domain -->
    <div class="card" style="padding:1.25rem;">
      <h3 style="margin:0 0 0.75rem;">Domain Information</h3>
      <div class="row-flex"><span>Domain:</span> <strong>${escapeHtml(domain)}</strong></div>
      <div class="row-flex"><span>Owner:</span> <strong>${escapeHtml(whoisOwner)}</strong></div>
      <div class="row-flex"><span>Status:</span> <strong>Active</strong></div>
    </div>

    <!-- Social -->
    <div class="card" style="padding:1.25rem;">
      <h3 style="margin:0 0 0.75rem;">Social Presence</h3>
      <div class="row-flex"><span>Instagram:</span> <strong>${escapeHtml(socialInstagram)}</strong></div>
      <div class="row-flex"><span>Twitter:</span> <strong>${escapeHtml(socialTwitter)}</strong></div>
    </div>

    <!-- Reputation -->
    <div class="card" style="padding:1.25rem;">
      <h3 style="margin:0 0 0.75rem;">Online Reputation</h3>
      <div class="row-flex"><span>TrustPilot:</span> <strong>${escapeHtml(trustPilotRating)}</strong></div>
      <div class="row-flex"><span>Complaints:</span> <strong>${complaints}</strong></div>
    </div>

  </div>

  <!-- EXPERT VERDICT — idêntico ao BrandAnalysis -->
  <h2 style="margin-bottom:0.75rem;">${escapeHtml(verdictTitle)}</h2>
  <p style="color:#475569;line-height:1.7;margin-bottom:1.5rem;font-size:1.05rem;">${escapeHtml(verdictText)}</p>

  <!-- ABOUT BOX — idêntico ao BrandAnalysis -->
  <div class="section-blue" style="margin-bottom:1.5rem;">
    <h3 style="color:#1e40af;margin:0 0 0.75rem;">About ${escapeHtml(brand)}</h3>
    <div class="grid-2" style="margin-bottom:0.5rem;">
      <div style="font-size:0.875rem;color:#1d4ed8;"><strong>Country:</strong> ${escapeHtml(countryOfOrigin)}</div>
      <div style="font-size:0.875rem;color:#1d4ed8;"><strong>Domain:</strong> ${escapeHtml(domain)}</div>
      <div style="font-size:0.875rem;color:#1d4ed8;"><strong>Trust Score:</strong> ${trustScore}/100</div>
    </div>
    <p style="font-size:0.875rem;color:#1d4ed8;margin:0.5rem 0 0;">${escapeHtml(companyHistory)}</p>
    ${recentIssues ? `<p style="font-size:0.875rem;color:#2563eb;font-style:italic;margin:0.5rem 0 0;">${escapeHtml(recentIssues)}</p>` : ""}
  </div>

  <!-- COMMON SCAMS — idêntico ao BrandAnalysis -->
  ${
    commonScams.length > 0
      ? `<div class="section-red" style="margin-bottom:1.5rem;">
    <h3 style="color:#991b1b;margin:0 0 0.75rem;">Common ${escapeHtml(brand)} Scams to Watch For</h3>
    <ul class="check-list">
      ${commonScams
        .map(
          (scam) =>
            `<li style="color:#b91c1c;">✗ ${escapeHtml(scam)}</li>`
        )
        .join("")}
    </ul>
  </div>`
      : ""
  }

  <!-- WHY SAFE / RISKS — idêntico ao BrandAnalysis -->
  <div class="grid-2" style="margin-bottom:2rem;">
    <div class="section-green">
      <h3 style="color:#065f46;margin:0 0 0.75rem;">Why it's Safe</h3>
      <ul class="check-list">
        ${whySafe.map((item) => `<li style="color:#047857;">✓ ${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
    <div class="section-red">
      <h3 style="color:#991b1b;margin:0 0 0.75rem;">Potential Risks</h3>
      <ul class="check-list">
        ${risks.map((item) => `<li style="color:#b91c1c;">✗ ${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
  </div>

  <!-- COMPARISON TABLE — idêntico ao BrandAnalysis -->
  <h2 style="margin-bottom:1rem;">Comparison: Fraudara vs. Manual Checking</h2>
  <div style="overflow-x:auto;margin-bottom:2rem;">
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Manual Check</th>
          <th style="color:#2563eb;">Fraudara.pro</th>
        </tr>
      </thead>
      <tbody>
        ${comparisonRows
          .map(
            (row) => `
        <tr>
          <td>${escapeHtml(row.feature)}</td>
          <td style="color:#94a3b8;">${escapeHtml(row.manual)}</td>
          <td><strong>${escapeHtml(row.fraudara)}</strong></td>
        </tr>`
          )
          .join("")}
      </tbody>
    </table>
  </div>

  <!-- LONG-TAIL KEYWORDS — idêntico ao BrandAnalysis (Related Safety Questions) -->
  ${
    longTailKeywords.length > 0
      ? `<div style="margin-bottom:2rem;">
    <h3 style="margin-bottom:0.75rem;">Related Safety Questions About ${escapeHtml(brand)}</h3>
    <div>
      ${longTailKeywords.map((kw) => `<span class="tag">${escapeHtml(kw)}</span>`).join("")}
    </div>
  </div>`
      : ""
  }

  <!-- CTA — idêntico ao BrandAnalysis -->
  <div style="background:linear-gradient(135deg,#312e81,#1e3a8a);border-radius:1.5rem;padding:2rem;margin:2rem 0;color:#fff;">
    <h2 style="color:#fff;margin:0 0 0.75rem;">${escapeHtml(ctaHeading)}</h2>
    <p style="color:#bfdbfe;margin:0 0 1.25rem;line-height:1.7;">${escapeHtml(ctaText)} <strong>Fraudara.pro</strong> is the #1 defense against online fraud.</p>
    <a href="https://fraudara.pro" style="background:#fff;color:#312e81;font-weight:700;padding:0.75rem 1.5rem;border-radius:0.75rem;text-decoration:none;display:inline-block;">
      Scan any website now at Fraudara.pro →
    </a>
  </div>

  <!-- FAQ SECTION — idêntico ao BrandAnalysis + FAQPage schema já está no head -->
  <h2 style="text-align:center;margin:2rem 0 1.25rem;">Frequently Asked Questions</h2>
  ${faqItems
    .map(
      (faq) => `
  <div class="faq-item">
    <h3 style="margin:0 0 0.5rem;color:#3730a3;">${escapeHtml(faq.question)}</h3>
    <p style="color:#475569;margin:0;line-height:1.6;">${escapeHtml(faq.answer)}</p>
  </div>`
    )
    .join("")}

  <!-- INTERNAL LINKS — idêntico ao BrandAnalysis -->
  <div style="background:#f1f5f9;border-radius:1.5rem;padding:2rem;margin:2rem 0;text-align:center;">
    <h3 style="margin:0 0 1rem;color:#1e293b;">Check other popular platforms</h3>
    <div>
      ${internalBrands
        .map(
          (p) =>
            `<a href="/check/${p.toLowerCase().replace(" ", "-")}"
              style="background:#fff;padding:0.5rem 1.25rem;border-radius:999px;font-size:0.875rem;font-weight:600;color:#475569;text-decoration:none;border:1px solid #e2e8f0;display:inline-block;margin:0.2rem;">
              Is ${escapeHtml(p)} safe?
            </a>`
        )
        .join("")}
      <a href="https://fraudara.pro/blog"
        style="background:#4f46e5;color:#fff;padding:0.5rem 1.25rem;border-radius:999px;font-size:0.875rem;font-weight:700;text-decoration:none;display:inline-block;margin:0.2rem;">
        Visit Blog
      </a>
    </div>
  </div>

  <!-- CREATOR SECTION — idêntico ao BrandAnalysis -->
  <div style="border-top:1px solid #e2e8f0;padding-top:2rem;display:flex;gap:1.5rem;align-items:flex-start;flex-wrap:wrap;">
    <img src="/creator1.png" alt="Pablo Eduardo" style="width:80px;height:80px;border-radius:1rem;object-fit:cover;" />
    <div>
      <p style="font-size:0.7rem;font-weight:700;color:#2563eb;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 0.25rem;">Founder &amp; CEO</p>
      <h3 style="margin:0 0 0.25rem;font-size:1.25rem;">Pablo Eduardo</h3>
      <p style="color:#64748b;font-size:0.875rem;margin:0;max-width:36rem;">
        Digital entrepreneur and developer for over 11 years. Expert in AI, marketing, and copywriting.
        Created Fraudara to protect the world from online scams.
      </p>
      <p style="margin:0.5rem 0 0;">
        <a href="https://instagram.com/soupabloeduardo" style="color:#94a3b8;margin-right:1rem;text-decoration:none;">Instagram</a>
        <a href="mailto:contactfraudara@gmail.com" style="color:#94a3b8;text-decoration:none;">Email</a>
      </p>
    </div>
  </div>

</main>

<footer>
  <div class="container">
    <p style="margin:0 0 0.75rem;">&copy; ${currentYear} Fraudara. All rights reserved.</p>
    <div>
      <a href="https://fraudara.pro/privacy">Privacy</a>
      <a href="https://fraudara.pro/terms">Terms</a>
    </div>
  </div>
</footer>

</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        // Cache: 1h no edge, 24h no CDN — bom equilíbrio entre frescor e performance
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600",
        "X-Prerendered-By": "fraudara-edge",
        "X-Robots-Tag": "index, follow",
      },
    });
  } catch (err) {
    console.error("[prerender] Unexpected error:", err);
    return context.next(); // fallback seguro → serve o SPA
  }
}

// Diz ao Netlify para rodar essa edge function em /check/*
export const config = {
  path: "/check/*",
};
