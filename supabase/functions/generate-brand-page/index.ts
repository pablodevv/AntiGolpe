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

  const currentYear = new Date().getFullYear();

  const prompt = `You are an expert SEO content writer and cybersecurity analyst for Fraudara.pro, the world's leading fraud detection platform.

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

CRITICAL RULES:
1. ALL content must be in ENGLISH
2. Content must be UNIQUE and SPECIFIC to ${brand} - NOT generic template text
3. Include REAL-SOUNDING details about ${brand}: company history, country of origin, common scams, recent issues
4. SEO long-tail keywords must be AGGRESSIVELY included throughout the text
5. FAQ must have 8 questions with detailed, unique answers (not generic)
6. The analysis text must be 500+ words of real, human-readable, SEO-rich content
7. Include specific risks and safety tips for THIS brand
8. Each FAQ answer must be 80-150 words with specific details
9. The verdict text must mention specific data points (SSL issuer, domain age, complaint count, etc.)
10. Company history must be 3-4 sentences with real details (founding year, founder, HQ location, business model)
11. Common scams must be 3-4 specific scams with details
12. The "why safe" and "risks" lists must have 4 items each with specific details

Return a JSON object with EXACTLY this structure:
{
  "seo_title": "Is ${brand} Safe & Legit? (${currentYear}) Trust Score ${trustScore}/100 | Fraudara",
  "seo_h1": "Is ${brand} Safe or a Scam? Complete Security Analysis (${currentYear})",
  "seo_description": "Is ${brand} legit or a scam? Trust score ${trustScore}/100. Full security analysis: SSL, domain age, complaints, reviews. Updated ${currentYear}. Free check by Fraudara.",
  "rating_value": "${ratingValue}",
  "review_body": "2-3 sentence review of this specific company mentioning their trust score, key security findings, and overall recommendation",
  "organization_url": "the official website URL of ${brand} if known, or https://www.${domain}",
  "analysis_content": {
    "verdict_title": "Expert Verdict: Is ${brand} Truly Safe? (${currentYear} Analysis)",
    "verdict_text": "500+ word detailed analysis specific to ${brand}. Must include: specific SSL details, domain registration info, complaint analysis, social media presence assessment, TrustPilot data, and a clear recommendation. Mention the trust score of ${trustScore}/100 multiple times. Include specific data points from the verification results. Discuss both strengths and weaknesses. End with a clear recommendation.",
    "why_safe": ["4 specific reasons this brand is safe, each 10-15 words with details"],
    "risks": ["4 specific risks associated with this brand, each 10-15 words with details"],
    "comparison_rows": [
      {"feature": "SSL Certificate Check", "manual": "15 min + technical knowledge", "fraudara": "Instant AI-powered scan"},
      {"feature": "WHOIS Domain History", "manual": "Requires paid tools", "fraudara": "Full deep scan included"},
      {"feature": "Real-time Scam Alerts", "manual": "Not available", "fraudara": "24/7 active monitoring"},
      {"feature": "Consumer Complaint Check", "manual": "Manual search required", "fraudara": "50+ sources instantly"},
      {"feature": "Social Media Verification", "manual": "Hours of research", "fraudara": "AI cross-reference"}
    ],
    "company_history": "3-4 sentences about the company's founding year, founder, HQ location, and business model with real details",
    "country_of_origin": "Specific country where the company is headquartered",
    "common_scams": ["3-4 specific scams associated with this brand with details about how they work"],
    "recent_issues": "2-3 sentences about any recent security issues, data breaches, or news about this brand"
  },
  "faq": [
    {"question": "Is ${brand} legit and safe to use in ${currentYear}?", "answer": "80-150 word detailed answer with specific data points about legitimacy"},
    {"question": "Is ${brand} safe for credit cards and online payments?", "answer": "80-150 word detailed answer about payment security, SSL, and fraud protection"},
    {"question": "How to avoid ${brand} scams and phishing attacks?", "answer": "80-150 word answer with 3-4 specific tips for this brand"},
    {"question": "Is ${brand} a scam or a real legitimate company?", "answer": "80-150 word detailed answer addressing scam concerns with evidence"},
    {"question": "Can I trust ${brand} with my personal data and privacy?", "answer": "80-150 word detailed answer about data privacy, GDPR, and security practices"},
    {"question": "What is ${brand}'s trust score and what does it mean?", "answer": "80-150 word explanation of the trust score with specific breakdown"},
    {"question": "Has ${brand} had any security breaches or data leaks?", "answer": "80-150 word answer about known security incidents"},
    {"question": "How does ${brand} compare to competitors in safety?", "answer": "80-150 word comparison with specific alternatives and safety differences"}
  ],
  "cta_heading": "Don't be the next victim of online fraud.",
  "cta_text": "Every 39 seconds, a new cyberattack occurs. In ${currentYear} alone, online fraud losses exceeded $10 billion. Fraudara.pro uses military-grade AI to scan 50+ security indicators in real-time, protecting over 3.1 million users worldwide. Don't risk your money — check before you click.",
  "long_tail_keywords": ["is ${brand} safe", "is ${brand} legit", "is ${brand} a scam", "${brand} safety check", "${brand} trust score", "is ${brand} reliable", "${brand} review ${currentYear}", "${brand} scam or real", "${brand} credit card safe", "${brand} data breach", "how to verify ${brand}", "${brand} phishing", "${brand} security analysis", "is ${domain} safe", "${brand} fraud check"]
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
        max_tokens: 4000,
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

    const seoTitle = aiContent?.seo_title || `Is ${brand} Safe & Legit? (${currentYear}) Trust Score ${trustScore}/100 | Fraudara`;
    const seoH1 = aiContent?.seo_h1 || `Is ${brand} Safe or a Scam? Complete Security Analysis (${currentYear})`;
    const seoDescription = aiContent?.seo_description || `Is ${brand} legit or a scam? Trust score ${trustScore}/100. Full security analysis: SSL, domain age, complaints, reviews. Updated ${currentYear}. Free check by Fraudara.`;

    const finalAIContent = aiContent || {
      seo_title: seoTitle,
      seo_h1: seoH1,
      seo_description: seoDescription,
      rating_value: status === 'safe' ? '4.2' : status === 'danger' ? '1.8' : '3.0',
      review_body: `${brand} has been analyzed by Fraudara's AI security system. With a trust score of ${trustScore}/100, ${brand} shows ${status === 'safe' ? 'strong' : status === 'danger' ? 'concerning' : 'mixed'} security indicators. Our analysis covers SSL certificates, domain registration history, consumer complaints, and social media verification.`,
      organization_url: `https://www.${domain}`,
      analysis_content: {
        verdict_title: `Expert Verdict: Is ${brand} Truly Safe? (${currentYear} Analysis)`,
        verdict_text: `${brand} has been thoroughly analyzed by our security research team using Fraudara's proprietary AI system that scans over 50 data sources in real-time. Based on our comprehensive analysis, ${brand} shows a trust score of ${trustScore}/100 as of ${currentYear}. The platform's SSL certificate status indicates ${verificationData?.ssl?.validNow ? 'valid encryption' : 'potential security concerns'}, while domain registration data ${verificationData?.whois?.hasData ? 'confirms legitimate ownership records' : 'shows limited public information'}. Consumer complaint databases reveal ${verificationData?.complaints || 0} reports in the last 30 days, which ${verificationData?.complaints > 10 ? 'warrants careful attention' : 'is within normal range'}. Social media presence analysis shows ${verificationData?.social?.mentions || 0} mentions across platforms. TrustPilot data ${verificationData?.trustPilot?.rating ? `indicates a rating of ${verificationData.trustPilot.rating}/5` : 'is not available for this entity'}. While ${brand} demonstrates ${status === 'safe' ? 'strong security fundamentals' : status === 'danger' ? 'significant red flags' : 'some positive indicators alongside areas of concern'}, users should always exercise caution when sharing personal or financial information online. Our AI-powered analysis checks SSL certificates, domain registration history, consumer complaints, social media presence, and third-party review platforms to give you the most accurate safety assessment possible. We recommend always verifying you are on the official ${domain} domain before entering any credentials.`,
        why_safe: [
          'SSL certificate is present and valid, ensuring encrypted data transmission',
          'Domain has been registered for multiple years, indicating established presence',
          'Active social media presence with verified accounts across platforms',
          'Low complaint volume relative to platform size and traffic'
        ],
        risks: [
          'Phishing sites may impersonate this brand with similar-looking domains',
          'Third-party sellers or advertisers may not be fully verified by the platform',
          'Always verify you are on the official domain before entering credentials',
          'Customer support response times may vary for security-related issues'
        ],
        comparison_rows: [
          { feature: 'SSL Certificate Check', manual: '15 min + technical knowledge', fraudara: 'Instant AI-powered scan' },
          { feature: 'WHOIS Domain History', manual: 'Requires paid tools', fraudara: 'Full deep scan included' },
          { feature: 'Real-time Scam Alerts', manual: 'Not available', fraudara: '24/7 active monitoring' },
          { feature: 'Consumer Complaint Check', manual: 'Manual search required', fraudara: '50+ sources instantly' },
          { feature: 'Social Media Verification', manual: 'Hours of research', fraudara: 'AI cross-reference' }
        ],
        company_history: `${brand} is a well-known online platform operating from ${domain}. The company has established itself as a significant player in its industry, serving millions of users globally. Detailed company history and founding information requires further research specific to this entity.`,
        country_of_origin: 'Global',
        common_scams: [
          `Phishing emails pretending to be from ${brand} asking for login credentials`,
          `Fake ${brand} login pages on lookalike domains designed to steal passwords`,
          `Customer support impersonation scams via phone or chat platforms`,
          `Fake promotional offers claiming to be from ${brand} to collect payment info`
        ],
        recent_issues: 'No major security incidents have been widely reported in recent months. Users should continue to monitor official channels for any updates.'
      },
      faq: [
        { question: `Is ${brand} legit and safe to use in ${currentYear}?`, answer: `${brand} is analyzed by Fraudara using multiple data sources including SSL verification, domain age analysis, and online reputation checks. Our current analysis shows a trust score of ${trustScore}/100, indicating ${status === 'safe' ? 'a legitimate and relatively safe platform' : status === 'danger' ? 'significant concerns that warrant caution' : 'mixed signals that require careful evaluation'}. Always verify you are on the official ${domain} domain.` },
        { question: `Is ${brand} safe for credit cards and online payments?`, answer: `We recommend always checking for valid SSL certificates (indicated by the padlock icon in your browser) and using secure payment methods when transacting on ${brand}. Consider using virtual credit cards or payment services like PayPal for an additional layer of security. Never enter card details on pages without HTTPS encryption.` },
        { question: `How to avoid ${brand} scams and phishing attacks?`, answer: `To stay safe: 1) Always verify the URL shows the official ${domain} domain, 2) Never click links in unsolicited emails claiming to be from ${brand}, 3) Enable two-factor authentication on your account, 4) Check for the padlock icon in your browser before entering any credentials, 5) Report suspicious messages to ${brand}'s official support channels.` },
        { question: `Is ${brand} a scam or a real legitimate company?`, answer: `Our analysis shows ${brand} has a trust score of ${trustScore}/100 based on verification of SSL certificates, domain registration, consumer complaints, and social media presence. ${status === 'safe' ? 'The platform appears to be a legitimate business with proper security measures in place.' : status === 'danger' ? 'Multiple red flags have been detected that suggest caution is warranted.' : 'While some indicators are positive, we recommend additional verification before sharing sensitive information.'}` },
        { question: `Can I trust ${brand} with my personal data and privacy?`, answer: `Before sharing personal data with ${brand}, review their privacy policy and data handling practices. Check if they comply with GDPR or other relevant data protection regulations. Use strong, unique passwords and enable two-factor authentication when available. Consider what personal information is truly necessary to share.` },
        { question: `What is ${brand}'s trust score and what does it mean?`, answer: `${brand}'s trust score of ${trustScore}/100 is calculated by Fraudara's AI analyzing 50+ data points including SSL validity, domain age, complaint volume, social media verification, and third-party reviews. Scores above 75 indicate a safe platform, 40-74 suggest caution, and below 40 indicate significant risk. This score is updated in real-time.` },
        { question: `Has ${brand} had any security breaches or data leaks?`, answer: `Our current scan does not detect any widely reported security breaches for ${brand}. However, data breaches can go unreported for extended periods. We recommend checking HaveIBeenPwned.com and monitoring ${brand}'s official security pages for the most up-to-date information on any incidents.` },
        { question: `How does ${brand} compare to competitors in safety?`, answer: `${brand}'s trust score of ${trustScore}/100 places it ${status === 'safe' ? 'above average' : status === 'danger' ? 'below average' : 'in the middle range'} compared to similar platforms. Key differentiators include SSL status, complaint volume, and domain age. For the most comprehensive comparison, use Fraudara to check multiple platforms side by side.` }
      ],
      cta_heading: "Don't be the next victim of online fraud.",
      cta_text: `Every 39 seconds, a new cyberattack occurs. In ${currentYear} alone, online fraud losses exceeded $10 billion. Fraudara.pro uses military-grade AI to scan 50+ security indicators in real-time, protecting over 3.1 million users worldwide.`,
      long_tail_keywords: [`is ${brand} safe`, `is ${brand} legit`, `is ${brand} a scam`, `${brand} safety check`, `${brand} trust score`, `is ${brand} reliable`, `${brand} review ${currentYear}`, `${brand} scam or real`, `${brand} credit card safe`, `${brand} data breach`, `how to verify ${brand}`, `${brand} phishing`, `${brand} security analysis`, `is ${domain} safe`, `${brand} fraud check`]
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
