import tls from "tls";
import { parse } from "tldts";
import * as cheerio from "cheerio";

const backendTranslations = {
  pt: {
    safeSite: "✅ SITE TOTALMENTE SEGURO",
    suspiciousSite: "⚠️ CUIDADO - SITE SUSPEITO", 
    dangerSite: "🚨 NÃO COMPRE AQUI - ALTO RISCO",
    partialVerification: "⚠️ VERIFICAÇÃO PARCIAL",
    safeMessage: "Site confiável! Pode comprar com segurança.",
    suspiciousMessage: "Cuidado! Detectamos sinais suspeitos. Recomendamos verificar diretamente com a empresa antes de comprar.",
    dangerMessage: "ALERTA MÁXIMO! Múltiplos sinais de risco detectados. NÃO recomendamos este site.",
    partialMessage: "Não foi possível concluir toda a análise. Recomendamos cautela e verificação adicional.",
    errorMessage: "Por favor, informe um site ou marca para verificar"
  },
  en: {
    safeSite: "✅ COMPLETELY SAFE SITE",
    suspiciousSite: "⚠️ CAUTION - SUSPICIOUS SITE",
    dangerSite: "🚨 DON'T BUY HERE - HIGH RISK",
    partialVerification: "⚠️ PARTIAL VERIFICATION",
    safeMessage: "Trustworthy site! You can shop safely.",
    suspiciousMessage: "Caution! We detected suspicious signs. We recommend verifying directly with the company before buying.",
    dangerMessage: "MAXIMUM ALERT! Multiple risk signals detected. We DO NOT recommend this site.",
    partialMessage: "Could not complete all analysis. We recommend caution and additional verification.",
    errorMessage: "Please provide a website or brand to verify"
  },
  es: {
    safeSite: "✅ SITIO COMPLETAMENTE SEGURO",
    suspiciousSite: "⚠️ CUIDADO - SITIO SOSPECHOSO",
    dangerSite: "🚨 NO COMPRES AQUÍ - ALTO RIESGO",
    partialVerification: "⚠️ VERIFICACIÓN PARCIAL",
    safeMessage: "¡Sitio confiable! Puedes comprar con seguridad.",
    suspiciousMessage: "¡Cuidado! Detectamos señales sospechosas. Recomendamos verificar directamente con la empresa antes de comprar.",
    dangerMessage: "¡ALERTA MÁXIMA! Múltiples señales de riesgo detectadas. NO recomendamos este sitio.",
    partialMessage: "No se pudo completar todo el análisis. Recomendamos precaución y verificación adicional.",
    errorMessage: "Por favor, proporciona un sitio web o marca para verificar"
  },
  zh: {
    safeSite: "✅ 完全安全的网站",
    suspiciousSite: "⚠️ 小心 - 可疑网站",
    dangerSite: "🚨 不要在这里购买 - 高风险",
    partialVerification: "⚠️ 部分验证",
    safeMessage: "可信的网站！您可以安全购物。",
    suspiciousMessage: "小心！我们检测到可疑信号。我们建议在购买前直接与公司核实。",
    dangerMessage: "最高警报！检测到多个风险信号。我们不推荐这个网站。",
    partialMessage: "无法完成所有分析。我们建议谨慎并进行额外验证。",
    errorMessage: "请提供要验证的网站或品牌"
  },
  fr: {
    safeSite: "✅ SITE COMPLÈTEMENT SÛR",
    suspiciousSite: "⚠️ ATTENTION - SITE SUSPECT",
    dangerSite: "🚨 N'ACHETEZ PAS ICI - HAUT RISQUE",
    partialVerification: "⚠️ VÉRIFICATION PARTIELLE",
    safeMessage: "Site fiable ! Vous pouvez acheter en toute sécurité.",
    suspiciousMessage: "Attention ! Nous avons détecté des signaux suspects. Nous recommandons de vérifier directement avec l'entreprise avant d'acheter.",
    dangerMessage: "ALERTE MAXIMALE ! Plusieurs signaux de risque détectés. Nous ne recommandons PAS ce site.",
    partialMessage: "Impossible de terminer toute l'analyse. Nous recommandons la prudence et une vérification supplémentaire.",
    errorMessage: "Veuillez fournir un site web ou une marque à vérifier"
  },
  de: {
    safeSite: "✅ VÖLLIG SICHERE WEBSITE",
    suspiciousSite: "⚠️ VORSICHT - VERDÄCHTIGE WEBSITE",
    dangerSite: "🚨 KAUFEN SIE HIER NICHT - HOHES RISIKO",
    partialVerification: "⚠️ TEILWEISE ÜBERPRÜFUNG",
    safeMessage: "Vertrauenswürdige Website! Sie können sicher einkaufen.",
    suspiciousMessage: "Vorsicht! Wir haben verdächtige Signale entdeckt. Wir empfehlen, vor dem Kauf direkt mit dem Unternehmen zu verifizieren.",
    dangerMessage: "MAXIMALE WARNUNG! Mehrere Risikosignale entdeckt. Wir empfehlen diese Website NICHT.",
    partialMessage: "Konnte nicht alle Analysen abschließen. Wir empfehlen Vorsicht und zusätzliche Überprüfung.",
    errorMessage: "Bitte geben Sie eine Website oder Marke zur Überprüfung an"
  },
  ar: {
    safeSite: "✅ موقع آمن تماماً",
    suspiciousSite: "⚠️ حذار - موقع مشبوه",
    dangerSite: "🚨 لا تشتري هنا - خطر عالي",
    partialVerification: "⚠️ التحقق الجزئي",
    safeMessage: "موقع موثوق! يمكنك التسوق بأمان.",
    suspiciousMessage: "حذار! اكتشفنا إشارات مشبوهة. نوصي بالتحقق مباشرة مع الشركة قبل الشراء.",
    dangerMessage: "تنبيه أقصى! تم اكتشاف إشارات خطر متعددة. نحن لا نوصي بهذا الموقع.",
    partialMessage: "لم نتمكن من إكمال جميع التحليلات. نوصي بالحذر والتحقق الإضافي.",
    errorMessage: "يرجى تقديم موقع ويب أو علامة تجارية للتحقق"
  },
  ja: {
    safeSite: "✅ 完全に安全なサイト",
    suspiciousSite: "⚠️ 注意 - 疑わしいサイト",
    dangerSite: "🚨 ここで購入しないでください - 高リスク",
    partialVerification: "⚠️ 部分検証",
    safeMessage: "信頼できるサイトです！安全に買い物できます。",
    suspiciousMessage: "注意！疑わしい信号を検出しました。購入前に会社と直接確認することをお勧めします。",
    dangerMessage: "最大警告！複数のリスク信号を検出しました。このサイトは推奨しません。",
    partialMessage: "すべての分析を完了できませんでした。注意と追加の検証をお勧めします。",
    errorMessage: "確認するウェブサイトまたはブランドを提供してください"
  },
  ru: {
    safeSite: "✅ ПОЛНОСТЬЮ БЕЗОПАСНЫЙ САЙТ",
    suspiciousSite: "⚠️ ОСТОРОЖНО - ПОДОЗРИТЕЛЬНЫЙ САЙТ",
    dangerSite: "🚨 НЕ ПОКУПАЙТЕ ЗДЕСЬ - ВЫСОКИЙ РИСК",
    partialVerification: "⚠️ ЧАСТИЧНАЯ ПРОВЕРКА",
    safeMessage: "Надежный сайт! Вы можете безопасно делать покупки.",
    suspiciousMessage: "Осторожно! Мы обнаружили подозрительные сигналы. Рекомендуем проверить напрямую с компанией перед покупкой.",
    dangerMessage: "МАКСИМАЛЬНОЕ ПРЕДУПРЕЖДЕНИЕ! Обнаружены множественные сигналы риска. Мы НЕ рекомендуем этот сайт.",
    partialMessage: "Не удалось завершить весь анализ. Рекомендуем осторожность и дополнительную проверку.",
    errorMessage: "Пожалуйста, предоставьте веб-сайт или бренд для проверки"
  },
  hi: {
    safeSite: "✅ पूर्णतः सुरक्षित साइट",
    suspiciousSite: "⚠️ सावधान - संदिग्ध साइट",
    dangerSite: "🚨 यहाँ न खरीदें - उच्च जोखिम",
    partialVerification: "⚠️ आंशिक सत्यापन",
    safeMessage: "भरोसेमंद साइट! आप सुरक्षित रूप से खरीदारी कर सकते हैं।",
    suspiciousMessage: "सावधान! हमने संदिग्ध संकेत पाए हैं। हम खरीदने से पहले कंपनी से सीधे सत्यापन की सिफारिश करते हैं।",
    dangerMessage: "अधिकतम अलर्ट! कई जोखिम संकेत मिले हैं। हम इस साइट की सिफारिश नहीं करते।",
    partialMessage: "सभी विश्लेषण पूरा नहीं कर सके। हम सावधानी और अतिरिक्त सत्यापन की सिफारिश करते हैं।",
    errorMessage: "कृपया सत्यापन के लिए एक वेबसाइट या ब्रांड प्रदान करें"
  },
  it: {
    safeSite: "✅ SITO COMPLETAMENTE SICURO",
    suspiciousSite: "⚠️ ATTENZIONE - SITO SOSPETTO",
    dangerSite: "🚨 NON COMPRARE QUI - ALTO RISCHIO",
    partialVerification: "⚠️ VERIFICA PARZIALE",
    safeMessage: "Sito affidabile! Puoi acquistare in sicurezza.",
    suspiciousMessage: "Attenzione! Abbiamo rilevato segnali sospetti. Raccomandiamo di verificare direttamente con l'azienda prima di acquistare.",
    dangerMessage: "ALLERTA MASSIMA! Rilevati segnali di rischio multipli. NON raccomandiamo questo sito.",
    partialMessage: "Impossibile completare tutta l'analisi. Raccomandiamo cautela e verifica aggiuntiva.",
    errorMessage: "Si prega di fornire un sito web o un marchio da verificare"
  },
    ko: {
    safeSite: "✅ 완전 안전한 사이트",
    suspiciousSite: "⚠️ 주의 - 의심스러운 사이트", 
    dangerSite: "🚨 여기서 구매하지 마세요 - 고위험",
    partialVerification: "⚠️ 부분 검증",
    safeMessage: "신뢰할 수 있는 사이트입니다! 안심하고 쇼핑하세요.",
    suspiciousMessage: "주의! 의심스러운 징후가 감지되었습니다. 구매 전 해당 업체에 직접 확인하는 것을 권장합니다.",
    dangerMessage: "최고 경고! 다수의 위험 신호가 감지되었습니다. 이 사이트를 권장하지 않습니다.",
    partialMessage: "모든 분석을 완료할 수 없었습니다. 주의를 기울이고 추가 확인을 권장합니다.",
    errorMessage: "확인할 사이트 또는 브랜드 이름을 입력해 주세요"
  }
};

const CONFIG = {
  timeouts: {
    ssl: 5000,
    whois: 8000, 
    google: 10000,
    reclameaqui: 15000,
    trustpilot: 8000,
    general: 12000
  },
  retries: {
    api: 2,
    scraping: 3,
    ssl: 1
  },
  delays: {
    betweenRetries: 1000,
    betweenRequests: 500
  }
};

function normalizeQuery(q) { 
  return String(q || "").trim(); 
}

function extractHostFromQuery(raw) {
  const q = normalizeQuery(raw);
  try {
    if (q.startsWith("http://") || q.startsWith("https://")) {
      return new URL(q).hostname;
    }
  } catch {}
  
  if (q.includes(".")) {
    try {
      return new URL("https://" + q.replace(/\s+/g, "")).hostname;
    } catch {}
  }
  return null;
}

function sleep(ms) { 
  return new Promise(r => setTimeout(r, ms)); 
}

function nowISO() { 
  return new Date().toISOString(); 
}

function timeoutPromise(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`Timeout após ${ms}ms`)), ms)
    )
  ]);
}

async function fetchWithRetry(url, options = {}, retries = CONFIG.retries.api, timeout = CONFIG.timeouts.general) {
  const fetchOptions = {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "no-cache",
      ...options.headers
    },
    ...options
  };

  for (let i = 0; i <= retries; i++) {
    try {
      console.log(`[FETCH] Tentativa ${i + 1}/${retries + 1} para ${url}`);
      
      const response = await timeoutPromise(
        fetch(url, fetchOptions),
        timeout
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      console.log(`[FETCH] Erro na tentativa ${i + 1}: ${error.message}`);
      
      if (i === retries) {
        throw new Error(`Falha após ${retries + 1} tentativas: ${error.message}`);
      }
      
      await sleep(CONFIG.delays.betweenRetries * (i + 1));
    }
  }
}

async function fetchJSON(url, options = {}, retries = CONFIG.retries.api, timeout = CONFIG.timeouts.general) {
  try {
    const response = await fetchWithRetry(url, options, retries, timeout);
    return await response.json();
  } catch (error) {
    console.log(`[FETCH_JSON] Erro: ${error.message}`);
    throw error;
  }
}

async function fetchText(url, options = {}, retries = CONFIG.retries.scraping, timeout = CONFIG.timeouts.general) {
  try {
    const response = await fetchWithRetry(url, options, retries, timeout);
    return await response.text();
  } catch (error) {
    console.log(`[FETCH_TEXT] Erro: ${error.message}`);
    throw error;
  }
}

async function findDomainFromBrand(brandName) {
  try {
    console.log(`[DOMAIN_SEARCH] Procurando domínio para: ${brandName}`);
    
    const knownBrands = {
      "mercado livre": "mercadolivre.com.br",
      "mercadolivre": "mercadolivre.com.br", 
      "magazine luiza": "magazineluiza.com.br",
      "magalu": "magazineluiza.com.br",
      "amazon": "amazon.com.br",
      "americanas": "americanas.com.br",
      "casas bahia": "casasbahia.com.br",
      "extra": "extra.com.br",
      "submarino": "submarino.com.br",
      "shoptime": "shoptime.com.br",
      "netshoes": "netshoes.com.br",
      "centauro": "centauro.com.br",
      "riachuelo": "riachuelo.com.br",
      "renner": "lojasrenner.com.br",
      "carrefour": "carrefour.com.br",
      "walmart": "walmart.com.br",
      "blaze": "blaze.com",
      "bet365": "bet365.com",
      "instagram": "instagram.com",
      "facebook": "facebook.com",
      "whatsapp": "whatsapp.com",
      "google": "google.com",
      "youtube": "youtube.com",
      "netflix": "netflix.com",
      "spotify": "spotify.com",
      "apple": "apple.com",
      "microsoft": "microsoft.com",
      "samsung": "samsung.com"
    };
    
    const brandLower = brandName.toLowerCase().trim();
    
    for (const [brand, domain] of Object.entries(knownBrands)) {
      if (brandLower.includes(brand) || brand.includes(brandLower)) {
        console.log(`[DOMAIN_SEARCH] Encontrado domínio conhecido: ${domain}`);
        return domain;
      }
    }
    
    const googleKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CX;
    
    if (googleKey && cx) {
      try {
        const searchQuery = `${brandName} site oficial`;
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(searchQuery)}&key=${googleKey}&cx=${cx}&num=5`;
        
        const data = await fetchJSON(url, {}, 1, CONFIG.timeouts.google);
        const items = data.items || [];
        
        for (const item of items) {
          try {
            const domain = new URL(item.link).hostname;
            const brandWords = brandName.toLowerCase().split(/\s+/);
            const domainLower = domain.toLowerCase();
            
            if (brandWords.some(word => domainLower.includes(word)) || item.title.toLowerCase().includes("oficial")) {
              console.log(`[DOMAIN_SEARCH] Encontrado via Google: ${domain}`);
              return domain;
            }
          } catch {}
        }
      } catch (error) {
        console.log(`[DOMAIN_SEARCH] Erro no Google: ${error.message}`);
      }
    }
    
    console.log(`[DOMAIN_SEARCH] Nenhum domínio encontrado para: ${brandName}`);
    return null;
  } catch (error) {
    console.log(`[DOMAIN_SEARCH] Erro geral: ${error.message}`);
    return null;
  }
}

async function getWhoisSafe(host) {
  if (!host) return null;
  
  try {
    console.log(`[WHOIS] Consultando ${host}`);
    
    const key = process.env.WHOIS_API_KEY;
    if (!key) {
      console.log("[WHOIS] API key não configurada");
      return null;
    }
    
    const url = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${key}&domainName=${encodeURIComponent(host)}&outputFormat=JSON`;
    const data = await fetchJSON(url, {}, 1, CONFIG.timeouts.whois);
    
    console.log(`[WHOIS] Sucesso para ${host}`);
    return data;
  } catch (error) {
    console.log(`[WHOIS] Erro para ${host}: ${error.message}`);
    return null;
  }
}

async function getSSLSafe(host) {
  if (!host) return null;
  
  return new Promise((resolve) => {
    console.log(`[SSL] Verificando ${host}`);
    
    const timeout = setTimeout(() => {
      console.log(`[SSL] Timeout para ${host}`);
      resolve({ present: false, error: "SSL timeout" });
    }, CONFIG.timeouts.ssl);
    
    try {
      const socket = tls.connect({
        host,
        port: 443,
        servername: host,
        rejectUnauthorized: false,
        timeout: CONFIG.timeouts.ssl
      }, () => {
        try {
          clearTimeout(timeout);
          const cert = socket.getPeerCertificate(true);
          socket.end();
          
          if (!cert || Object.keys(cert).length === 0) {
            console.log(`[SSL] Certificado vazio para ${host}`);
            return resolve({ present: false });
          }
          
          const validFrom = cert.valid_from ? new Date(cert.valid_from) : null;
          const validTo = cert.valid_to ? new Date(cert.valid_to) : null;
          const now = new Date();
          const validNow = validFrom && validTo && now >= validFrom && now <= validTo;
          
          console.log(`[SSL] Sucesso para ${host} - Válido: ${validNow}`);
          
          resolve({
            present: true,
            validNow,
            validFrom: cert.valid_from || null,
            validTo: cert.valid_to || null,
            issuer: cert.issuer || {},
            subject: cert.subject || {},
            subjectCN: cert.subject?.CN || null,
            altNames: cert.subjectaltname || null
          });
        } catch (e) {
          clearTimeout(timeout);
          console.log(`[SSL] Erro processando certificado ${host}: ${e.message}`);
          resolve({ present: false, error: String(e) });
        }
      });
      
      socket.on("error", (err) => {
        clearTimeout(timeout);
        console.log(`[SSL] Erro conexão ${host}: ${err.message}`);
        resolve({ present: false, error: String(err) });
      });
      
      socket.on("timeout", () => {
        clearTimeout(timeout);
        try { socket.destroy(); } catch {}
        console.log(`[SSL] Timeout socket ${host}`);
        resolve({ present: false, error: "Socket timeout" });
      });
      
    } catch (error) {
      clearTimeout(timeout);
      console.log(`[SSL] Erro geral ${host}: ${error.message}`);
      resolve({ present: false, error: String(error) });
    }
  });
}

async function searchGoogleSafe(query) {
  try {
    console.log(`[GOOGLE] Buscando: ${query}`);
    
    const googleKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CX;
    
    if (!googleKey || !cx) {
      console.log("[GOOGLE] API não configurada, retornando mock");
      return [{
        title: `Resultado para ${query}`,
        link: "https://example.com",
        snippet: "Resultado de exemplo para demonstração",
        source: "google_mock",
        pageText: "Conteúdo de exemplo",
        hasForms: false,
        hasLogin: false,
        externalMentions: []
      }];
    }
    
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${googleKey}&cx=${cx}&num=10`;
    const data = await fetchJSON(url, {}, 1, CONFIG.timeouts.google);
    const items = data.items || [];
    
    const results = [];
    
    for (const item of items.slice(0, 5)) { 
      const result = {
        title: item.title,
        link: item.link,
        snippet: item.snippet || "",
        source: "google"
      };
      
      try {
        console.log(`[GOOGLE] Analisando ${item.link}`);
        const html = await fetchText(item.link, {}, 1, 8000); 
        const $ = cheerio.load(html);
        
        result.pageText = $("body").text().replace(/\s+/g, " ").trim().substring(0, 3000);
        result.hasForms = $("form").length > 0;
        result.hasLogin = $("input[type=password]").length > 0;
        result.externalMentions = [];
        
        $("a[href]").each((_, a) => {
          const href = $(a).attr("href");
          if (href && (href.includes("instagram.com") || href.includes("twitter.com") || href.includes("reddit.com") || href.includes("linkedin.com"))) {
            result.externalMentions.push(href);
          }
        });
        
        console.log(`[GOOGLE] Sucesso analisando ${item.link}`);
      } catch (e) {
        console.log(`[GOOGLE] Erro analisando ${item.link}: ${e.message}`);
        result.pageError = String(e);
        result.pageText = "";
        result.hasForms = false;
        result.hasLogin = false;
        result.externalMentions = [];
      }
      
      results.push(result);
    }
    
    console.log(`[GOOGLE] Sucesso: ${results.length} resultados`);
    return results;
  } catch (error) {
    console.log(`[GOOGLE] Erro geral: ${error.message}`);
    return [{
      title: `Busca por ${query}`,
      link: "https://example.com",
      snippet: "Erro na busca, usando dados de exemplo",
      source: "google_error",
      pageText: "Conteúdo não disponível",
      hasForms: false,
      hasLogin: false,
      externalMentions: [],
      pageError: error.message
    }];
  }
}

async function getReclameAquiMegaRobusto(query) {
  try {
    console.log(`[RECLAME_AQUI] Iniciando busca para: ${query}`);
    
    const variations = [
      query.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
      query.toLowerCase().replace(/\s+/g, "").replace(/[^\w]/g, ""),
      query.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, "-"),
      query.toLowerCase().replace(/\./g, "-").replace(/\s+/g, "-"),
      query.split(".")[0]?.toLowerCase().replace(/[^\w]/g, "")
    ].filter(v => v && v.length > 2);
    
    const uniqueVariations = [...new Set(variations)];
    
    console.log(`[RECLAME_AQUI] Testando ${uniqueVariations.length} variações: ${uniqueVariations.join(", ")}`);
    
    for (const slug of uniqueVariations) {
      if (!slug) continue;
      
      try {
        console.log(`[RECLAME_AQUI] Testando slug: ${slug}`);
        
        const directUrl = `https://www.reclameaqui.com.br/empresa/${slug}/`;
        const html = await fetchText(directUrl, {}, 1, CONFIG.timeouts.reclameaqui);
        
        if (html.includes("Página não encontrada") || html.includes("404") || html.length < 1000) {
          console.log(`[RECLAME_AQUI] Slug ${slug} não encontrado`);
          continue;
        }
        
        console.log(`[RECLAME_AQUI] Empresa encontrada com slug: ${slug}`);
        const result = parseReclameAquiUltra(html, directUrl);
        
        if (result.found) {
          console.log(`[RECLAME_AQUI] Sucesso para ${slug}: Score ${result.score}, Reclamações ${result.totalComplaints}`);
          return result;
        }
      } catch (error) {
        console.log(`[RECLAME_AQUI] Erro com slug ${slug}: ${error.message}`);
        continue;
      }
      
      await sleep(CONFIG.delays.betweenRequests);
    }
    
    console.log(`[RECLAME_AQUI] Tentando busca por nome: ${query}`);
    
    const searchUrls = [
      `https://www.reclameaqui.com.br/busca/?q=${encodeURIComponent(query)}`,
      `https://www.reclameaqui.com.br/busca/?q=${encodeURIComponent(query.split(" ")[0])}`
    ];
    
    for (const searchUrl of searchUrls) {
      try {
        console.log(`[RECLAME_AQUI] Buscando em: ${searchUrl}`);
        
        const html = await fetchText(searchUrl, {}, 1, CONFIG.timeouts.reclameaqui);
        const $ = cheerio.load(html);
        
        let companyLink = null;
        $("a[href*='/empresa/']").each((_, a) => {
          const href = $(a).attr("href") || "";
          if (/^\/empresa\/[^/]+\/?$/.test(href)) {
            companyLink = "https://www.reclameaqui.com.br" + href;
            return false;
          }
        });
        
        if (companyLink) {
          console.log(`[RECLAME_AQUI] Link da empresa encontrado: ${companyLink}`);
          
          const compHtml = await fetchText(companyLink, {}, 1, CONFIG.timeouts.reclameaqui);
          const result = parseReclameAquiUltra(compHtml, companyLink);
          
          if (result.found) {
            console.log(`[RECLAME_AQUI] Sucesso via busca: Score ${result.score}, Reclamações ${result.totalComplaints}`);
            return result;
          }
        }
      } catch (error) {
        console.log(`[RECLAME_AQUI] Erro na busca: ${error.message}`);
        continue;
      }
      
      await sleep(CONFIG.delays.betweenRequests);
    }
    
    console.log(`[RECLAME_AQUI] Empresa não encontrada: ${query}`);
    return {
      found: false,
      score: null,
      totalComplaints: null,
      last30d: null,
      companyLink: null,
      verified: false,
      reputation: null,
      responseRate: null
    };
  } catch (error) {
    console.log(`[RECLAME_AQUI] Erro geral: ${error.message}`);
    return {
      found: false,
      error: String(error),
      score: null,
      totalComplaints: null,
      last30d: null,
      companyLink: null,
      verified: false,
      reputation: null,
      responseRate: null
    };
  }
}

function parseReclameAquiUltra(html, companyLink) {
  try {
    const $ = cheerio.load(html);
    const bodyText = $("body").text();
    
    console.log(`[RECLAME_AQUI_PARSE] Parseando página: ${companyLink}`);
    
    let score = null;
    const scoreSelectors = [
      ".score .number",
      "[data-testid='company-score']", 
      ".company-score",
      "*[class*='score'] *[class*='number']",
      ".rating-score",
      ".company-rating",
      "[class*='Score']",
      "*[data-score]"
    ];
    
    for (const selector of scoreSelectors) {
      try {
        const scoreText = $(selector).first().text().trim();
        if (scoreText && /^\d+(\.\d+)?$/.test(scoreText)) {
          score = scoreText;
          console.log(`[RECLAME_AQUI_PARSE] Score encontrado: ${score} (seletor: ${selector})`);
          break;
        }
      } catch {}
    }
    
    if (!score) {
      const scoreMatch = bodyText.match(/(?:nota|score|avaliação):\s*(\d+(?:\.\d+)?)/i);
      if (scoreMatch) {
        score = scoreMatch[1];
        console.log(`[RECLAME_AQUI_PARSE] Score encontrado no texto: ${score}`);
      }
    }
    
    const complaintsPatterns = [
      /(\d{1,3}(?:\.\d{3})*)\s*reclamações?/gi,
      /(\d{1,3}(?:,\d{3})*)\s*reclamações?/gi,
      /reclamações?[:\s]*(\d{1,3}(?:\.\d{3})*)/gi,
      /total[:\s]*(\d{1,3}(?:\.\d{3})*)/gi
    ];
    
    let totalComplaints = null;
    for (const pattern of complaintsPatterns) {
      const match = bodyText.match(pattern);
      if (match) {
        totalComplaints = match[1] || match[0].match(/\d{1,3}(?:[\.\,]\d{3})*/)[0];
        console.log(`[RECLAME_AQUI_PARSE] Total reclamações encontrado: ${totalComplaints}`);
        break;
      }
    }
    
    const last30dPatterns = [
      /(\d{1,3}(?:\.\d{3})*)\s*nos?\s*últimos?\s*30\s*dias?/gi,
      /últimos?\s*30\s*dias?[:\s]*(\d{1,3}(?:\.\d{3})*)/gi,
      /30\s*dias?[:\s]*(\d+)/gi
    ];
    
    let last30d = null;
    for (const pattern of last30dPatterns) {
      const match = bodyText.match(pattern);
      if (match) {
        last30d = match[1] || match[0].match(/\d+/)[0];
        console.log(`[RECLAME_AQUI_PARSE] Últimos 30 dias encontrado: ${last30d}`);
        break;
      }
    }
    
    const verified = bodyText.includes("Selo RA Verificada") || 
                     bodyText.includes("empresa verificada") ||
                     bodyText.includes("verificado");
    
    console.log(`[RECLAME_AQUI_PARSE] Empresa verificada: ${verified}`);
    
    let reputation = null;
    const reputationKeywords = ["Não recomendada", "Regular", "Boa", "Ótima"];
    for (const keyword of reputationKeywords) {
      if (bodyText.includes(keyword)) {
        reputation = keyword;
        console.log(`[RECLAME_AQUI_PARSE] Reputação encontrada: ${reputation}`);
        break;
      }
    }
    
    const responseMatch = bodyText.match(/[Rr]espondeu\s+(\d+)%/);
    const responseRate = responseMatch ? parseInt(responseMatch[1]) : null;
    
    if (responseRate) {
      console.log(`[RECLAME_AQUI_PARSE] Taxa de resposta: ${responseRate}%`);
    }
    
    const toNumber = s => {
      if (!s) return null;
      return Number(String(s).replace(/[\.\,]/g, "").replace(",", "."));
    };
    
    const result = {
      found: true,
      score: toNumber(score),
      totalComplaints: toNumber(totalComplaints),
      last30d: toNumber(last30d),
      companyLink,
      verified,
      reputation,
      responseRate
    };
    
    console.log(`[RECLAME_AQUI_PARSE] Resultado final:`, result);
    return result;
  } catch (error) {
    console.log(`[RECLAME_AQUI_PARSE] Erro: ${error.message}`);
    return {
      found: false,
      error: String(error)
    };
  }
}

function analyzeSentimentUltra(results) {
  const social = {
    instagram: null,
    twitter: null,
    reddit: null,
    linkedin: null,
    mentions: 0,
    sentiment: "neutral"
  };
  
  let positiveSignals = 0;
  let negativeSignals = 0;
  
  const positiveWords = ["bom", "ótimo", "excelente", "recomendo", "confiável", "seguro", "oficial", "qualidade", "satisfeito", "aprovado"];
  const negativeWords = ["golpe", "fraude", "ruim", "péssimo", "não recomendo", "cuidado", "suspeito", "problema", "reclamação", "insatisfeito"];
  
  for (const r of results) {
    if (r.externalMentions) {
      r.externalMentions.forEach(link => {
        if (link.includes("instagram.com") && !social.instagram) social.instagram = link;
        if (link.includes("twitter.com") && !social.twitter) social.twitter = link;
        if (link.includes("reddit.com") && !social.reddit) social.reddit = link;
        if (link.includes("linkedin.com") && !social.linkedin) social.linkedin = link;
        social.mentions++;
      });
    }
    
    const text = `${r.title} ${r.snippet} ${r.pageText || ""}`.toLowerCase();
    
    positiveWords.forEach(word => {
      if (text.includes(word)) positiveSignals++;
    });
    
    negativeWords.forEach(word => {
      if (text.includes(word)) negativeSignals++;
    });
  }
  
  if (positiveSignals > negativeSignals * 1.5) {
    social.sentiment = "positive";
  } else if (negativeSignals > positiveSignals * 1.5) {
    social.sentiment = "negative";
  }
  
  console.log(`[SENTIMENT] Positivo: ${positiveSignals}, Negativo: ${negativeSignals}, Sentimento: ${social.sentiment}`);
  
  return social;
}

async function getTrustPilotSafe(domain) {
  if (!domain) return { found: false };
  
  try {
    console.log(`[TRUSTPILOT] Verificando ${domain}`);
    
    const url = `https://www.trustpilot.com/review/${domain}`;
    const html = await fetchText(url, {}, 1, CONFIG.timeouts.trustpilot);
    
    const $ = cheerio.load(html);
    
    let rating = null;
    const ratingSelectors = [
      "[data-rating]",
      "*[class*='rating']",
      "*[class*='score']",
      ".star-rating",
      "*[aria-label*='star']"
    ];
    
    for (const selector of ratingSelectors) {
      try {
        const elem = $(selector).first();
        const ratingText = elem.attr("data-rating") || elem.text().trim();
        const ratingNum = parseFloat(ratingText);
        if (!isNaN(ratingNum) && ratingNum >= 1 && ratingNum <= 5) {
          rating = ratingNum;
          break;
        }
      } catch {}
    }
    
    const bodyText = $("body").text();
    const reviewMatch = bodyText.match(/(\d{1,3}(?:[,\.]\d{3})*)\s*reviews?/i);
    const reviewCount = reviewMatch ? parseInt(reviewMatch[1].replace(/[,\.]/g, "")) : null;
    
    console.log(`[TRUSTPILOT] ${domain} - Rating: ${rating}, Reviews: ${reviewCount}`);
    
    return {
      found: !!rating,
      rating,
      reviewCount,
      url
    };
  } catch (error) {
    console.log(`[TRUSTPILOT] Erro para ${domain}: ${error.message}`);
    return { found: false, error: String(error) };
  }
}

function calculateUltraScore(host, brandGuess, ssl, whois, ra, social, serpResults, trustPilot) {
  console.log(`[SCORE] Iniciando cálculo para ${host || brandGuess}`);
  
  let score = 75; 
  const factors = [];
  
  
  if (host) {
    if (!ssl?.present) {
      score -= 25;
      factors.push("SSL ausente (-25)");
    } else if (ssl.present && !ssl.validNow) {
      score -= 15;
      factors.push("SSL inválido (-15)");
    } else {
      score += 5;
      factors.push("SSL válido (+5)");
    }
  }
  
  if (whois?.WhoisRecord) {
    try {
      const created = whois.WhoisRecord.registryData?.createdDate || 
                      whois.WhoisRecord.createdDateNormalized || 
                      whois.WhoisRecord.createdDate;
      
      if (created) {
        const ageDays = Math.max(0, (Date.now() - new Date(created).getTime()) / (1000 * 60 * 60 * 24));
        
        if (ageDays < 15) {
          score -= 30;
          factors.push(`Domínio muito novo: ${Math.round(ageDays)} dias (-30)`);
        } else if (ageDays < 90) {
          score -= 15;
          factors.push(`Domínio novo: ${Math.round(ageDays)} dias (-15)`);
        } else if (ageDays > 365) {
          score += 10;
          factors.push(`Domínio antigo: ${Math.round(ageDays / 365)} anos (+10)`);
        }
      }
    } catch (e) {
      console.log(`[SCORE] Erro analisando idade do domínio: ${e.message}`);
    }
  }
  
  if (ra?.found) {
    factors.push("Encontrado no Reclame Aqui");
    
    if (!ra.verified) {
      score -= 8;
      factors.push("Empresa não verificada (-8)");
    } else {
      score += 5;
      factors.push("Empresa verificada (+5)");
    }
    
    if (ra.reputation) {
      switch (ra.reputation) {
        case "Não recomendada":
          score -= 25;
          factors.push("Reputação: Não recomendada (-25)");
          break;
        case "Regular":
          score -= 10;
          factors.push("Reputação: Regular (-10)");
          break;
        case "Boa":
          score += 5;
          factors.push("Reputação: Boa (+5)");
          break;
        case "Ótima":
          score += 10;
          factors.push("Reputação: Ótima (+10)");
          break;
      }
    }
    
    if (ra.responseRate !== null) {
      if (ra.responseRate < 30) {
        score -= 20;
        factors.push(`Taxa de resposta muito baixa: ${ra.responseRate}% (-20)`);
      } else if (ra.responseRate < 70) {
        score -= 10;
        factors.push(`Taxa de resposta baixa: ${ra.responseRate}% (-10)`);
      } else if (ra.responseRate > 90) {
        score += 5;
        factors.push(`Taxa de resposta alta: ${ra.responseRate}% (+5)`);
      }
    }
    
    if (ra.score !== null) {
      if (ra.score < 5) {
        score -= 20;
        factors.push(`Score RA muito baixo: ${ra.score} (-20)`);
      } else if (ra.score < 7) {
        score -= 10;
        factors.push(`Score RA baixo: ${ra.score} (-10)`);
      } else if (ra.score >= 8) {
        score += 5;
        factors.push(`Score RA bom: ${ra.score} (+5)`);
      }
    }
    
    if (ra.last30d !== null) {
      if (ra.last30d > 100) {
        score -= 30;
        factors.push(`Muitas reclamações recentes: ${ra.last30d} (-30)`);
      } else if (ra.last30d > 50) {
        score -= 20;
        factors.push(`Reclamações recentes: ${ra.last30d} (-20)`);
      } else if (ra.last30d > 20) {
        score -= 10;
        factors.push(`Algumas reclamações recentes: ${ra.last30d} (-10)`);
      } else if (ra.last30d <= 5 && ra.last30d > 0) {
        score += 5;
        factors.push(`Poucas reclamações recentes: ${ra.last30d} (+5)`);
      }
    }
  }
  
  if (social) {
    switch (social.sentiment) {
      case "positive":
        score += 10;
        factors.push("Sentimento online positivo (+10)");
        break;
      case "negative":
        score -= 15;
        factors.push("Sentimento online negativo (-15)");
        break;
    }
    
    if (social.mentions > 10) {
      score += 5;
      factors.push(`Muitas menções sociais: ${social.mentions} (+5)`);
    }
  }
  
  if (trustPilot?.found) {
    if (trustPilot.rating >= 4) {
      score += 8;
      factors.push(`TrustPilot alto: ${trustPilot.rating}/5 (+8)`);
    } else if (trustPilot.rating <= 2) {
      score -= 15;
      factors.push(`TrustPilot baixo: ${trustPilot.rating}/5 (-15)`);
    }
    
    if (trustPilot.reviewCount > 100) {
      score += 3;
      factors.push(`Muitas reviews TrustPilot: ${trustPilot.reviewCount} (+3)`);
    }
  }
  
  if (serpResults && serpResults.length > 0) {
    let positiveHits = 0;
    let negativeHits = 0;
    
    const positiveWords = ["oficial", "confiável", "recomendo", "bom", "ótimo", "qualidade"];
    const negativeWords = ["golpe", "fraude", "suspeito", "cuidado", "problema", "reclamação"];
    
    for (const result of serpResults) {
      const text = `${result.title} ${result.snippet} ${result.pageText || ""}`.toLowerCase();
      
      positiveWords.forEach(word => {
        if (text.includes(word)) positiveHits++;
      });
      
      negativeWords.forEach(word => {
        if (text.includes(word)) negativeHits++;
      });
    }
    
    if (positiveHits > negativeHits) {
      const bonus = Math.min(positiveHits - negativeHits, 10);
      score += bonus;
      factors.push(`Menções positivas no Google: +${positiveHits} -${negativeHits} (+${bonus})`);
    } else if (negativeHits > positiveHits) {
      const penalty = Math.min(negativeHits - positiveHits, 15);
      score -= penalty;
      factors.push(`Menções negativas no Google: +${positiveHits} -${negativeHits} (-${penalty})`);
    }
  }
  
  if (host) {
    const tld = host.split(".").pop()?.toLowerCase();
    const suspiciousTlds = ["xyz", "top", "click", "tk", "ml", "ga", "cf", "live", "monster"];
    
    if (suspiciousTlds.includes(tld)) {
      score -= 20;
      factors.push(`TLD suspeito: .${tld} (-20)`);
    }
  }
  
  score = Math.max(0, Math.min(100, Math.round(score)));
  
  console.log(`[SCORE] Score final: ${score}%`);
  console.log(`[SCORE] Fatores:`, factors);
  
  return { score, factors };
}

function classifyResult(score, language = 'pt') {
  const t = backendTranslations[language] || backendTranslations.pt;
  
  if (score >= 75) {
    return {
      status: "safe",
      title: t.safeSite
    };
  } else if (score >= 50) {
    return {
      status: "suspicious", 
      title: t.suspiciousSite
    };
  } else {
    return {
      status: "danger",
      title: t.dangerSite
    };
  }
}

function generateSmartMessage(classification, ra, social, ssl, factors, language = 'pt') {
  const t = backendTranslations[language] || backendTranslations.pt;
  const issues = [];
  const positives = [];
  
  for (const factor of factors) {
    if (factor.includes("(-") || factor.includes("baixo") || factor.includes("não") || factor.includes("ausente")) {
      if (factor.includes("reclamações")) {
        issues.push("muitas reclamações recentes");
      } else if (factor.includes("SSL")) {
        issues.push("problemas de segurança SSL");
      } else if (factor.includes("reputação")) {
        issues.push("reputação ruim no Reclame Aqui");
      } else if (factor.includes("resposta")) {
        issues.push("baixa taxa de resposta a reclamações");
      } else if (factor.includes("negativo")) {
        issues.push("menções negativas online");
      }
    } else if (factor.includes("(+") || factor.includes("alto") || factor.includes("bom") || factor.includes("válido")) {
      if (factor.includes("SSL")) {
        positives.push("certificado SSL válido");
      } else if (factor.includes("verificada")) {
        positives.push("empresa verificada");
      } else if (factor.includes("reputação")) {
        positives.push("boa reputação");
      } else if (factor.includes("TrustPilot")) {
        positives.push("bem avaliado no TrustPilot");
      }
    }
  }
  
  let message = "";
  
  if (classification.status === "safe") {
    message = t.safeMessage;
  } else if (classification.status === "suspicious") {
    message = t.suspiciousMessage;
  } else { 
    message = t.dangerMessage;
  }
  
  return message;
}

export async function handler(event) {
  const startTime = Date.now();
  
  try {
    console.log(`[HANDLER] Iniciando verificação em ${nowISO()}`);
    
    const { query, language = 'pt' } = JSON.parse(event.body || "{}");
    const normalizedQuery = normalizeQuery(query);
    const t = backendTranslations[language] || backendTranslations.pt;
    
    if (!normalizedQuery) {
      console.log("[HANDLER] Query vazia");
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: t.errorMessage })
      };
    }
    
    console.log(`[HANDLER] Query recebida: "${normalizedQuery}", Idioma: ${language}`);
    
    let host = extractHostFromQuery(normalizedQuery);
    
    if (!host) {
      console.log(`[HANDLER] Host não extraído, buscando domínio da marca`);
      host = await findDomainFromBrand(normalizedQuery);
    }
    
    const brandGuess = host ? 
      (parse(host)?.domainWithoutSuffix || host.split(".")[0] || normalizedQuery).toLowerCase() : 
      normalizedQuery.split(/\s+/)[0].toLowerCase();
    
    console.log(`[HANDLER] Host: ${host}, Brand: ${brandGuess}`);
    
    console.log(`[HANDLER] Iniciando verificações paralelas`);
    
    const [googleResults, sslResult, whoisResult] = await Promise.allSettled([
      searchGoogleSafe(normalizedQuery),
      host ? getSSLSafe(host) : Promise.resolve(null),
      host ? getWhoisSafe(host) : Promise.resolve(null)
    ]);
    
    const serpResults = googleResults.status === 'fulfilled' ? googleResults.value : [];
    const sslData = sslResult.status === 'fulfilled' ? sslResult.value : null;
    const whoisData = whoisResult.status === 'fulfilled' ? whoisResult.value : null;
    
    console.log(`[HANDLER] Verificações paralelas concluídas`);
    
    console.log(`[HANDLER] Iniciando Reclame Aqui`);
    let raData = null;
    try {
      raData = await getReclameAquiMegaRobusto(host || normalizedQuery);
    } catch (error) {
      console.log(`[HANDLER] Erro no Reclame Aqui: ${error.message}`);
      raData = { found: false, error: String(error) };
    }
    
    console.log(`[HANDLER] Analisando sentimento`);
    const socialData = analyzeSentimentUltra(serpResults);
    
    console.log(`[HANDLER] Verificando TrustPilot`);
    let trustPilotData = null;
    if (host) {
      try {
        trustPilotData = await getTrustPilotSafe(host);
      } catch (error) {
        console.log(`[HANDLER] Erro no TrustPilot: ${error.message}`);
        trustPilotData = { found: false, error: String(error) };
      }
    }
    
    console.log(`[HANDLER] Calculando score`);
    const { score, factors } = calculateUltraScore(
      host, brandGuess, sslData, whoisData, raData, socialData, serpResults, trustPilotData
    );
    
    const classification = classifyResult(score, language);
    const message = generateSmartMessage(classification, raData, socialData, sslData, factors, language);
    
    const complaints = (raData?.last30d ?? raData?.totalComplaints ?? 0) || 0;
    const verificationTime = ((Date.now() - startTime) / 1000).toFixed(1) + "s";
    
    console.log(`[HANDLER] Verificação concluída: ${classification.status}, Score: ${score}%, Tempo: ${verificationTime}`);
    
    const response = {
      status: classification.status,
      title: classification.title,
      message,
      complaints,
      trustScore: score,
      verificationTime,
      debug: {
        timestamp: nowISO(),
        host,
        brandGuess,
        factors,
        processingTime: verificationTime,
        language
      },
      ssl: sslData,
      whois: whoisData ? { hasData: true } : { hasData: false },
      reclameAqui: raData,
      googleResults: serpResults.slice(0, 10), 
      social: socialData,
      trustPilot: trustPilotData
    };
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify(response)
    };
    
  } catch (error) {
    console.error(`[HANDLER] ERRO CRÍTICO:`, error);
    
    let language = 'pt';
    try {
      const body = JSON.parse(event.body || "{}");
      language = body.language || 'pt';
    } catch {}
    
    const t = backendTranslations[language] || backendTranslations.pt;
    
    const fallbackResponse = {
      status: "suspicious",
      title: t.partialVerification,
      message: t.partialMessage,
      complaints: 0,
      trustScore: 50,
      verificationTime: ((Date.now() - startTime) / 1000).toFixed(1) + "s",
      debug: {
        timestamp: nowISO(),
        error: String(error),
        fallback: true,
        language
      },
      ssl: null,
      whois: { hasData: false },
      reclameAqui: { found: false, error: "Erro na consulta" },
      googleResults: [],
      social: { mentions: 0, sentiment: "neutral" },
      trustPilot: { found: false }
    };
    
    return {
      statusCode: 200, 
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS", 
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify(fallbackResponse)
    };
  }
}

export async function options() {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    },
    body: ""
  };
}
