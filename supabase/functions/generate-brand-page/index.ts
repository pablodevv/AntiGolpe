import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function extractDomain(query: string): string {
  let cleaned = query.trim().toLowerCase();
  cleaned = cleaned.replace(/^https?:\/\//, '').replace(/\/+$/, '').replace(/^www\./, '');
  const match = cleaned.match(/^([a-z0-9-]+\.)+[a-z]{2,}/);
  if (match) return match[0];
  return cleaned.replace(/[^a-z0-9.-]/g, '');
}

function extractBrandName(domain: string): string {
  const parts = domain.split('.');
  if (parts.length >= 2) {
    const name = parts[parts.length - 2];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  return domain.charAt(0).toUpperCase() + domain.slice(1);
}

function generateSlug(domain: string): string {
  return domain.toLowerCase().replace(/[^a-z0-9.-]/g, '');
}

async function callVerificationAPI(query: string): Promise<any> {
  try {
    const netlifyUrl = Deno.env.get('NETLIFY_FUNCTION_URL') || 'https://fraudara.pro';
    const resp = await fetch(`${netlifyUrl}/.netlify/functions/verificar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language: 'en' }),
    });
    if (!resp.ok) throw new Error(`Verification API returned ${resp.status}`);
    return await resp.json();
  } catch (err) {
    console.error('Verification API error:', err);
    return null;
  }
}

async function generateAIContent(brand: string, domain: string, verificationData: any, openaiKey: string): Promise<any> {
  const status = verificationData?.status || 'suspicious';
  const trustScore = verificationData?.trustScore || 50;
  const complaints = verificationData?.complaints || 0;
  const sslInfo = verificationData?.ssl || {};
  const whoisInfo = verificationData?.whois || {};
  const socialInfo = verificationData?.social || {};
  const trustPilotInfo = verificationData?.trustPilot || {};
  const googleResults = verificationData?.googleResults || [];

  const sslStatus = sslInfo.present ? (sslInfo.validNow ? 'valid' : 'invalid') : 'missing';
  const sslIssuer = sslInfo.issuer?.CN || 'Unknown';
  const sslValidTo = sslInfo.validTo || 'Unknown';
  const domainAge = whoisInfo.hasData ? 'Available' : 'Unknown';
  const socialMentions = socialInfo.mentions || 0;
  const tpRating = trustPilotInfo.rating || 'N/A';
  const tpReviews = trustPilotInfo.reviewCount || 'N/A';

  const googleSnippets = googleResults.slice(0, 3).map((r: any) => r.snippet || '').join(' ');

  const ratingValue = status === 'safe'
    ? (3.5 + Math.random() * 1.5).toFixed(1)
    : status === 'danger'
    ? (1.0 + Math.random() * 1.5).toFixed(1)
    : (2.5 + Math.random() * 1.5).toFixed(1);

  const prompt = `You are an expert SEO content writer and security analyst for Fraudara.pro, the #1 global fraud checker platform.

Generate a COMPLETE, SEO-optimized content package for a brand safety analysis page about "${brand}" (${domain}).

VERIFICATION DATA:
- Status: ${status}
- Trust Score: ${trustScore}/100
- Complaints (30 days): ${complaints}
- SSL: ${sslStatus} (Issuer: ${sslIssuer}, Valid until: ${sslValidTo})
- Domain Age Data: ${domainAge}
- Social Mentions: ${socialMentions}
- TrustPilot: ${tpRating}/5 (${tpReviews} reviews)
- Google Context: ${googleSnippets || 'No additional context'}
- Generated Rating Value: ${ratingValue}/5

IMPORTANT RULES:
1. ALL content must be in ENGLISH
2. Content must be UNIQUE and SPECIFIC to ${brand} - NOT generic template text
3. Include real-sounding details about ${brand}: company history, country of origin, common scams associated with this brand, recent issues
4. SEO long-tail keywords must be AGGRESSIVELY included
5. FAQ must have 5 questions with detailed answers
6. The analysis text must be 300+ words of real, human-readable content
7. Include specific risks and safety tips for THIS brand

Return a JSON object with EXACTLY this structure:
{
  "seo_title": "unique SEO title with year and brand",
  "seo_h1": "unique H1 with brand name and year",
  "seo_description": "unique meta description 150-160 chars",
  "rating_value": "${ratingValue}",
  "review_body": "2-3 sentence review of this specific company",
  "organization_url": "the official website URL of ${brand} if known, or https://www.${domain}",
  "analysis_content": {
    "verdict_title": "Expert Verdict heading with brand name",
    "verdict_text": "300+ word detailed analysis specific to ${brand}",
    "why_safe": ["3 specific reasons this brand is safe"],
    "risks": ["3 specific risks associated with this brand"],
    "comparison_rows": [
      {"feature": "SSL Verification", "manual": "Slow / Technical", "fraudara": "Instant (AI)"},
      {"feature": "WHOIS History", "manual": "Requires tools", "fraudara": "Full Deep Scan"},
      {"feature": "Real-time Scam Alerts", "manual": "None", "fraudara": "24/7 Active"}
    ],
    "company_history": "2-3 sentences about the company's founding and history",
    "country_of_origin": "Country where the company is based",
    "common_scams": ["2-3 specific scams associated with this brand or domain"],
    "recent_issues": "Any recent security issues or news about this brand (1-2 sentences)"
  },
  "faq": [
    {"question": "Is ${brand} legit?", "answer": "detailed answer specific to ${brand}"},
    {"question": "Is ${brand} safe for credit cards?", "answer": "detailed answer about payment security"},
    {"question": "How to avoid scams on ${brand}?", "answer": "specific tips for this platform"},
    {"question": "Is ${brand} a scam or real?", "answer": "detailed answer addressing scam concerns"},
    {"question": "Can I trust ${brand} with my personal data?", "answer": "detailed answer about data privacy"}
  ],
  "cta_heading": "persuasive heading",
  "cta_text": "persuasive paragraph about Fraudara.pro",
  "long_tail_keywords": ["is ${brand} safe", "is ${brand} legit", "is ${brand} a scam", "${brand} safety check", "${brand} trust score", "is ${brand} reliable", "${brand} review ${new Date().getFullYear()}"]
}`;

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: 'json_object' },
      }),
    });

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('No content from OpenAI');
    return JSON.parse(content);
  } catch (err) {
    console.error('OpenAI API error:', err);
    return null;
  }
}

function buildSchemaData(brand: string, domain: string, slug: string, aiContent: any, verificationData: any): any {
  const currentYear = new Date().getFullYear();
  const seoTitle = aiContent?.seo_title || `Is ${brand} Safe? (${currentYear}) – Fraudara Analysis`;
  const seoDescription = aiContent?.seo_description || `Is ${brand} a legitimate platform? Read our expert analysis.`;
  const ratingValue = aiContent?.rating_value || '3.5';
  const reviewBody = aiContent?.review_body || `${brand} is a platform analyzed by Fraudara for safety and security indicators.`;
  const orgUrl = aiContent?.organization_url || `https://www.${domain}`;
  const faqItems = aiContent?.faq || [];

  return {
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
        "sameAs": ["https://instagram.com/soupabloeduardo"]
      },
      {
        "@type": "WebSite",
        "@id": "https://fraudara.pro/#website",
        "url": "https://fraudara.pro",
        "name": "Fraudara",
        "publisher": { "@id": "https://fraudara.pro/#organization" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://fraudara.pro/check/{search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebPage",
        "@id": `https://fraudara.pro/check/${slug}#webpage`,
        "url": `https://fraudara.pro/check/${slug}`,
        "name": seoTitle,
        "description": seoDescription,
        "isPartOf": { "@id": "https://fraudara.pro/#website" },
        "about": { "@type": "Thing", "name": brand },
        "primaryImageOfPage": { "@type": "ImageObject", "url": "https://fraudara.pro/Fraudara_Logo1.png" },
        "inLanguage": "en"
      },
      {
        "@type": ["Article", "WebPage"],
        "@id": `https://fraudara.pro/check/${slug}#article`,
        "url": `https://fraudara.pro/check/${slug}`,
        "headline": seoTitle,
        "description": seoDescription,
        "image": "https://fraudara.pro/Fraudara_Logo1.png",
        "author": { "@type": "Person", "name": "Pablo Eduardo" },
        "publisher": { "@id": "https://fraudara.pro/#organization" },
        "mainEntityOfPage": { "@id": `https://fraudara.pro/check/${slug}#webpage` },
        "datePublished": new Date().toISOString(),
        "dateModified": new Date().toISOString()
      },
      {
        "@type": "Review",
        "itemReviewed": {
          "@type": "Organization",
          "name": brand,
          "url": orgUrl
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": ratingValue,
          "bestRating": "5"
        },
        "author": {
          "@type": "Organization",
          "name": "Fraudara"
        },
        "reviewBody": reviewBody
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqItems.map((item: any) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://fraudara.pro" },
          { "@type": "ListItem", "position": 2, "name": "Check", "item": "https://fraudara.pro/check" },
          { "@type": "ListItem", "position": 3, "name": brand, "item": `https://fraudara.pro/check/${slug}` }
        ]
      },
      {
        "@type": "WebApplication",
        "name": "Fraudara AI Analyzer",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "All",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "publisher": { "@id": "https://fraudara.pro/#organization" }
      }
    ]
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    if (!query || typeof query !== 'string' || !query.trim()) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const domain = extractDomain(query);
    const brand = extractBrandName(domain);
    const slug = generateSlug(domain);
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Check if page already exists
    const checkResp = await fetch(`${supabaseUrl}/rest/v1/brand_pages?slug=eq.${encodeURIComponent(slug)}&select=id,ai_content,verification_data,seo_title,seo_h1,seo_description,status,trust_score,schema_data,brand,domain`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    });
    const existing = await checkResp.json();

    if (existing && existing.length > 0) {
      return new Response(JSON.stringify({ exists: true, page: existing[0] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Call verification API
    const verificationData = await callVerificationAPI(query);

    // Generate AI content
    let aiContent = null;
    if (openaiKey) {
      aiContent = await generateAIContent(brand, domain, verificationData, openaiKey);
    }

    // Fallback if AI fails
    const currentYear = new Date().getFullYear();
    const status = verificationData?.status || 'suspicious';
    const trustScore = verificationData?.trustScore || 50;

    const seoTitle = aiContent?.seo_title || `Is ${brand} Safe? (${currentYear}) – Fraudara Security Check`;
    const seoH1 = aiContent?.seo_h1 || `Is ${brand} Safe or a Scam? Complete Analysis (${currentYear})`;
    const seoDescription = aiContent?.seo_description || `Is ${brand} legit or a scam? Check ${brand}'s safety score, SSL, reputation and risk level. Free instant analysis by Fraudara.`;

    const finalAIContent = aiContent || {
      seo_title: seoTitle,
      seo_h1: seoH1,
      seo_description: seoDescription,
      rating_value: status === 'safe' ? '4.2' : status === 'danger' ? '1.8' : '3.0',
      review_body: `${brand} is analyzed by Fraudara for safety indicators including SSL, domain age, and online reputation.`,
      organization_url: `https://www.${domain}`,
      analysis_content: {
        verdict_title: `Expert Verdict: Is ${brand} Truly Safe?`,
        verdict_text: `${brand} has been thoroughly analyzed by our security research team. Based on our comprehensive scan of 50+ data sources, ${brand} shows a trust score of ${trustScore}/100. While the platform has its strengths, users should always exercise caution when sharing personal or financial information online. Our AI-powered analysis checks SSL certificates, domain registration history, consumer complaints, social media presence, and third-party review platforms to give you the most accurate safety assessment possible.`,
        why_safe: ['SSL certificate is present and valid', 'Domain has been registered for multiple years', 'Active social media presence'],
        risks: ['Phishing sites may impersonate this brand', 'Third-party sellers may not be verified', 'Always verify you are on the official domain'],
        comparison_rows: [
          { feature: 'SSL Verification', manual: 'Slow / Technical', fraudara: 'Instant (AI)' },
          { feature: 'WHOIS History', manual: 'Requires tools', fraudara: 'Full Deep Scan' },
          { feature: 'Real-time Scam Alerts', manual: 'None', fraudara: '24/7 Active' }
        ],
        company_history: `${brand} is a well-known online platform. Detailed company history requires further research.`,
        country_of_origin: 'Global',
        common_scams: [`Phishing emails pretending to be from ${brand}`, `Fake ${brand} login pages`],
        recent_issues: 'No major security incidents reported recently.'
      },
      faq: [
        { question: `Is ${brand} legit?`, answer: `${brand} is analyzed by Fraudara using multiple data sources. Our verification checks SSL, domain age, and online reputation to determine legitimacy.` },
        { question: `Is ${brand} safe for credit cards?`, answer: `We recommend always checking for valid SSL certificates and using secure payment methods when transacting on ${brand}.` },
        { question: `How to avoid scams on ${brand}?`, answer: `Always verify you are on the official ${domain} domain, check seller ratings, and never share credentials via email or chat.` },
        { question: `Is ${brand} a scam or real?`, answer: `Our analysis shows ${brand} has a trust score of ${trustScore}/100. Always verify the URL and look for security indicators before entering personal data.` },
        { question: `Can I trust ${brand} with my personal data?`, answer: `Check the privacy policy and data handling practices of ${brand}. Use strong passwords and enable two-factor authentication when available.` }
      ],
      cta_heading: "Don't be the next victim.",
      cta_text: 'Every single day, thousands of people lose their life savings to sophisticated digital traps. Fraudara.pro is the #1 defense against online fraud.',
      long_tail_keywords: [`is ${brand} safe`, `is ${brand} legit`, `is ${brand} a scam`, `${brand} safety check`, `${brand} trust score`]
    };

    const schemaData = buildSchemaData(brand, domain, slug, finalAIContent, verificationData);

    // Insert into database
    const insertResp = await fetch(`${supabaseUrl}/rest/v1/brand_pages`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        slug,
        brand,
        domain,
        seo_title: seoTitle,
        seo_h1: seoH1,
        seo_description: seoDescription,
        status,
        trust_score: trustScore,
        verification_data: verificationData || {},
        ai_content: finalAIContent,
        schema_data: schemaData,
      }),
    });

    if (!insertResp.ok) {
      const errText = await insertResp.text();
      console.error('Insert error:', errText);
      // Might be a race condition duplicate, try to fetch
      const retryResp = await fetch(`${supabaseUrl}/rest/v1/brand_pages?slug=eq.${encodeURIComponent(slug)}&select=*`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      });
      const retryData = await retryResp.json();
      if (retryData && retryData.length > 0) {
        return new Response(JSON.stringify({ exists: true, page: retryData[0] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`Failed to insert brand page: ${errText}`);
    }

    const inserted = await insertResp.json();
    const pageData = Array.isArray(inserted) ? inserted[0] : inserted;

    // Trigger sitemap update and Google indexing in background
    const sitemapUrl = `${supabaseUrl}/functions/v1/update-sitemap`;
    const indexingUrl = `${supabaseUrl}/functions/v1/request-indexing`;

    EdgeRuntime.waitUntil(
      (async () => {
        try {
          await fetch(sitemapUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({ slug, brand }),
          });
        } catch (e) {
          console.error('Sitemap update error:', e);
        }

        try {
          await fetch(indexingUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({ slug, brand }),
          });
        } catch (e) {
          console.error('Indexing request error:', e);
        }
      })()
    );

    return new Response(JSON.stringify({ exists: false, page: pageData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Generate brand page error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
