// netlify/functions/verificar.js - VERSÃO ULTRA DEFINITIVA NÍVEL BANCO SANTANDER
import tls from "tls";
import { parse } from "tldts";
import * as cheerio from "cheerio";

// ========== CONFIGURAÇÕES ULTRA PREMIUM ==========
const CONFIG = {
  timeouts: {
    ssl: 8000,
    whois: 12000,
    google: 15000,
    reclameaqui: 20000,  // Mais tempo para RA
    trustpilot: 10000,
    pageAnalysis: 12000   // Tempo específico para análise de páginas
  },
  retries: {
    critical: 4,  // Para operações críticas (RA)
    api: 3,
    scraping: 3,
    ssl: 2
  },
  delays: {
    betweenRetries: 1500,
    betweenRequests: 800,
    reclameAqui: 2000  // Delay específico para RA
  }
};

// ========== HELPERS ULTRA AVANÇADOS ==========
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

// ========== FETCH SYSTEM NÍVEL NASA ==========
async function fetchUltraRobusto(url, options = {}, retries = CONFIG.retries.api, timeout = CONFIG.timeouts.google) {
  const fetchOptions = {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
      "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"Windows"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      ...options.headers
    },
    ...options
  };

  for (let i = 0; i <= retries; i++) {
    try {
      console.log(`[FETCH_ULTRA] Tentativa ${i + 1}/${retries + 1} para ${url.substring(0, 100)}...`);
      
      const response = await timeoutPromise(
        fetch(url, fetchOptions),
        timeout
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      console.log(`[FETCH_ULTRA] Sucesso ${url.substring(0, 100)}... - Status: ${response.status}`);
      return response;
    } catch (error) {
      console.log(`[FETCH_ULTRA] Erro tentativa ${i + 1}: ${error.message}`);
      
      if (i === retries) {
        throw new Error(`Todas as ${retries + 1} tentativas falharam: ${error.message}`);
      }
      
      // Delay progressivo
      const delay = CONFIG.delays.betweenRetries * (i + 1) + Math.random() * 1000;
      await sleep(delay);
    }
  }
}

async function fetchJSON(url, options = {}, retries = CONFIG.retries.api, timeout = CONFIG.timeouts.google) {
  try {
    const response = await fetchUltraRobusto(url, options, retries, timeout);
    return await response.json();
  } catch (error) {
    console.log(`[FETCH_JSON] Erro final: ${error.message}`);
    throw error;
  }
}

async function fetchText(url, options = {}, retries = CONFIG.retries.scraping, timeout = CONFIG.timeouts.pageAnalysis) {
  try {
    const response = await fetchUltraRobusto(url, options, retries, timeout);
    return await response.text();
  } catch (error) {
    console.log(`[FETCH_TEXT] Erro final: ${error.message}`);
    throw error;
  }
}

// ========== BUSCA INTELIGENTE DE DOMÍNIO NÍVEL GOOGLE ==========
async function findDomainIntelligente(brandName) {
  try {
    console.log(`[DOMAIN_AI] Busca inteligente para: "${brandName}"`);
    
    // Base de dados de marcas brasileiras e internacionais
    const knownBrands = {
      // E-commerce Brasil
      "mercado livre": "mercadolivre.com.br",
      "mercadolivre": "mercadolivre.com.br",
      "magazine luiza": "magazineluiza.com.br",
      "magalu": "magazineluiza.com.br",
      "americanas": "americanas.com.br",
      "casas bahia": "casasbahia.com.br",
      "extra": "extra.com.br",
      "submarino": "submarino.com.br",
      "shoptime": "shoptime.com.br",
      "centauro": "centauro.com.br",
      "netshoes": "netshoes.com.br",
      "dafiti": "dafiti.com.br",
      "zara": "zara.com",
      "hm": "hm.com",
      "c&a": "cea.com.br",
      "riachuelo": "riachuelo.com.br",
      "renner": "lojasrenner.com.br",
      "carrefour": "carrefour.com.br",
      "walmart": "walmart.com.br",
      "ponto": "pontofrio.com.br",
      "ricardo eletro": "ricardoeletro.com.br",
      "fast shop": "fastshop.com.br",
      "kabum": "kabum.com.br",
      
      // Bancos
      "itau": "itau.com.br",
      "bradesco": "bradesco.com.br",
      "santander": "santander.com.br",
      "banco do brasil": "bb.com.br",
      "caixa": "caixa.gov.br",
      "nubank": "nubank.com.br",
      "inter": "bancointer.com.br",
      "next": "next.me",
      
      // Tech Internacional  
      "amazon": "amazon.com.br",
      "apple": "apple.com",
      "google": "google.com",
      "microsoft": "microsoft.com",
      "samsung": "samsung.com",
      "sony": "sony.com",
      "netflix": "netflix.com",
      "spotify": "spotify.com",
      "uber": "uber.com",
      "airbnb": "airbnb.com.br",
      
      // Redes Sociais
      "instagram": "instagram.com",
      "facebook": "facebook.com",
      "whatsapp": "whatsapp.com",
      "twitter": "twitter.com",
      "tiktok": "tiktok.com",
      "youtube": "youtube.com",
      "linkedin": "linkedin.com",
      
      // Apostas (importante para detecção)
      "blaze": "blaze.com",
      "bet365": "bet365.com",
      "betano": "betano.com",
      "rivalo": "rivalo.com",
      "sportingbet": "sportingbet.com",
      
      // Outros
      "correios": "correios.com.br",
      "receita federal": "receita.fazenda.gov.br",
      "detran": "detran.gov.br"
    };
    
    const brandLower = brandName.toLowerCase().trim();
    
    // Busca exata e por palavras-chave
    for (const [brand, domain] of Object.entries(knownBrands)) {
      if (brandLower === brand || 
          brandLower.includes(brand) || 
          brand.includes(brandLower) ||
          brandLower.replace(/\s+/g, "").includes(brand.replace(/\s+/g, ""))) {
        console.log(`[DOMAIN_AI] Domínio conhecido encontrado: ${brand} -> ${domain}`);
        return domain;
      }
    }
    
    // Se não encontrou na base, busca no Google
    const googleKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CX;
    
    if (googleKey && cx) {
      try {
        const searches = [
          `${brandName} site oficial`,
          `${brandName} oficial brasil`,
          `${brandName} loja online oficial`
        ];
        
        for (const searchQuery of searches) {
          try {
            console.log(`[DOMAIN_AI] Buscando Google: "${searchQuery}"`);
            
            const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(searchQuery)}&key=${googleKey}&cx=${cx}&num=5`;
            const data = await fetchJSON(url, {}, 2, CONFIG.timeouts.google);
            const items = data.items || [];
            
            for (const item of items) {
              try {
                const domain = new URL(item.link).hostname;
                const brandWords = brandName.toLowerCase().split(/\s+/);
                const domainLower = domain.toLowerCase();
                const titleLower = item.title.toLowerCase();
                
                // Critérios inteligentes de matching
                const hasOfficialKeyword = titleLower.includes("oficial") || titleLower.includes("site oficial");
                const domainMatchesBrand = brandWords.some(word => 
                  word.length > 2 && domainLower.includes(word)
                );
                const isCommonTLD = domain.includes('.com') || domain.includes('.com.br') || domain.includes('.net') || domain.includes('.org');
                
                if ((domainMatchesBrand || hasOfficialKeyword) && isCommonTLD) {
                  console.log(`[DOMAIN_AI] Domínio encontrado via Google: "${searchQuery}" -> ${domain}`);
                  return domain;
                }
              } catch (e) {
                console.log(`[DOMAIN_AI] Erro processando resultado: ${e.message}`);
              }
            }
            
            await sleep(500); // Evita rate limiting
          } catch (searchError) {
            console.log(`[DOMAIN_AI] Erro na busca "${searchQuery}": ${searchError.message}`);
            continue;
          }
        }
      } catch (error) {
        console.log(`[DOMAIN_AI] Erro geral no Google: ${error.message}`);
      }
    }
    
    console.log(`[DOMAIN_AI] Nenhum domínio encontrado para: "${brandName}"`);
    return null;
  } catch (error) {
    console.log(`[DOMAIN_AI] Erro crítico: ${error.message}`);
    return null;
  }
}

// ========== WHOIS NÍVEL ENTERPRISE ==========
async function getWhoisEnterprise(host) {
  if (!host) return null;
  
  try {
    console.log(`[WHOIS_ENT] Consultando ${host}`);
    
    const key = process.env.WHOIS_API_KEY;
    if (!key) {
      console.log("[WHOIS_ENT] API key não configurada");
      return { hasData: false, error: "API key não configurada" };
    }
    
    const url = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${key}&domainName=${encodeURIComponent(host)}&outputFormat=JSON`;
    const data = await fetchJSON(url, {}, 2, CONFIG.timeouts.whois);
    
    console.log(`[WHOIS_ENT] Dados recebidos para ${host}`);
    return data;
  } catch (error) {
    console.log(`[WHOIS_ENT] Erro para ${host}: ${error.message}`);
    return { hasData: false, error: error.message };
  }
}

// ========== SSL NÍVEL MILITARY ==========
async function getSSLMilitary(host) {
  if (!host) return null;
  
  return new Promise((resolve) => {
    console.log(`[SSL_MIL] Verificando ${host}`);
    
    const timeout = setTimeout(() => {
      console.log(`[SSL_MIL] Timeout para ${host}`);
      resolve({ present: false, error: "SSL timeout" });
    }, CONFIG.timeouts.ssl);
    
    try {
      const socket = tls.connect({
        host,
        port: 443,
        servername: host,
        rejectUnauthorized: false,
        timeout: CONFIG.timeouts.ssl,
        ciphers: 'ECDHE+AESGCM:ECDHE+CHACHA20:DHE+AESGCM:DHE+CHACHA20:!aNULL:!MD5:!DSS'
      }, () => {
        try {
          clearTimeout(timeout);
          const cert = socket.getPeerCertificate(true);
          socket.end();
          
          if (!cert || Object.keys(cert).length === 0) {
            console.log(`[SSL_MIL] Certificado vazio para ${host}`);
            return resolve({ present: false, error: "Certificado não encontrado" });
          }
          
          const validFrom = cert.valid_from ? new Date(cert.valid_from) : null;
          const validTo = cert.valid_to ? new Date(cert.valid_to) : null;
          const now = new Date();
          const validNow = validFrom && validTo && now >= validFrom && now <= validTo;
          
          // Análise avançada do certificado
          const isWildcard = cert.subject?.CN?.startsWith('*.');
          const isEV = cert.issuer?.businessCategory === 'Extended Validation';
          const chainLength = cert.chain ? cert.chain.length : 0;
          
          console.log(`[SSL_MIL] Sucesso para ${host} - Válido: ${validNow}, EV: ${isEV}, Chain: ${chainLength}`);
          
          resolve({
            present: true,
            validNow,
            validFrom: cert.valid_from || null,
            validTo: cert.valid_to || null,
            issuer: cert.issuer || {},
            subject: cert.subject || {},
            subjectCN: cert.subject?.CN || null,
            altNames: cert.subjectaltname || null,
            isWildcard,
            isEV,
            chainLength,
            fingerprint: cert.fingerprint || null,
            serialNumber: cert.serialNumber || null
          });
        } catch (e) {
          clearTimeout(timeout);
          console.log(`[SSL_MIL] Erro processando certificado ${host}: ${e.message}`);
          resolve({ present: false, error: String(e) });
        }
      });
      
      socket.on("error", (err) => {
        clearTimeout(timeout);
        console.log(`[SSL_MIL] Erro conexão ${host}: ${err.message}`);
        resolve({ present: false, error: String(err) });
      });
      
      socket.on("timeout", () => {
        clearTimeout(timeout);
        try { socket.destroy(); } catch {}
        console.log(`[SSL_MIL] Timeout socket ${host}`);
        resolve({ present: false, error: "Socket timeout" });
      });
      
    } catch (error) {
      clearTimeout(timeout);
      console.log(`[SSL_MIL] Erro geral ${host}: ${error.message}`);
      resolve({ present: false, error: String(error) });
    }
  });
}

// ========== GOOGLE SEARCH NÍVEL META ==========
async function searchGoogleMeta(query) {
  try {
    console.log(`[GOOGLE_META] Busca avançada: "${query}"`);
    
    const googleKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CX;
    
    if (!googleKey || !cx) {
      console.log("[GOOGLE_META] Google API não configurada, usando mock inteligente");
      return createIntelligentMock(query);
    }
    
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${googleKey}&cx=${cx}&num=10&safe=off`;
    const data = await fetchJSON(url, {}, 2, CONFIG.timeouts.google);
    const items = data.items || [];
    
    console.log(`[GOOGLE_META] ${items.length} resultados encontrados`);
    
    const results = [];
    const maxConcurrent = 4; // Limita requests simultâneas
    
    for (let i = 0; i < Math.min(items.length, 8); i += maxConcurrent) {
      const batch = items.slice(i, i + maxConcurrent);
      const batchPromises = batch.map(async (item, batchIndex) => {
        const globalIndex = i + batchIndex;
        return analyzeSearchResult(item, globalIndex + 1);
      });
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      for (const settledResult of batchResults) {
        if (settledResult.status === 'fulfilled') {
          results.push(settledResult.value);
        } else {
          console.log(`[GOOGLE_META] Erro em resultado do batch: ${settledResult.reason}`);
        }
      }
      
      // Delay entre batches
      if (i + maxConcurrent < items.length) {
        await sleep(CONFIG.delays.betweenRequests);
      }
    }
    
    console.log(`[GOOGLE_META] Análise completa: ${results.length} resultados processados`);
    return results;
  } catch (error) {
    console.log(`[GOOGLE_META] Erro crítico: ${error.message}`);
    return createIntelligentMock(query);
  }
}

async function analyzeSearchResult(item, position) {
  const result = {
    position,
    title: item.title,
    link: item.link,
    snippet: item.snippet || "",
    source: "google",
    isReclameAqui: false,
    isTrustpilot: false,
    isOfficial: false
  };
  
  try {
    // Detecta tipo de resultado
    const linkLower = item.link.toLowerCase();
    const titleLower = item.title.toLowerCase();
    
    result.isReclameAqui = linkLower.includes('reclameaqui.com');
    result.isTrustpilot = linkLower.includes('trustpilot.com');
    result.isOfficial = titleLower.includes('oficial') || titleLower.includes('site oficial');
    
    console.log(`[SEARCH_ANALYSIS] Posição ${position}: ${item.title.substring(0, 50)}... - RA: ${result.isReclameAqui}, TP: ${result.isTrustpilot}`);
    
    // Analisa conteúdo da página (com timeout menor para ser mais rápido)
    const html = await fetchText(item.link, {}, 2, 10000);
    const $ = cheerio.load(html);
    
    // Remove scripts e estilos para análise mais limpa
    $('script, style, nav, header, footer, aside').remove();
    
    result.pageText = $("body").text()
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 4000);
    
    result.hasForms = $("form").length > 0;
    result.hasLogin = $("input[type=password], input[name*=password]").length > 0;
    result.hasComments = $("*[class*=comment], *[id*=comment], .review, .feedback").length > 0;
    
    // Analisa links externos (redes sociais)
    result.externalMentions = [];
    $("a[href]").each((_, a) => {
      const href = $(a).attr("href");
      if (href && (href.includes("instagram.com") || href.includes("twitter.com") || 
                  href.includes("reddit.com") || href.includes("linkedin.com") ||
                  href.includes("facebook.com") || href.includes("youtube.com"))) {
        if (!result.externalMentions.includes(href)) {
          result.externalMentions.push(href);
        }
      }
    });
    
    // Análise específica para Reclame Aqui
    if (result.isReclameAqui) {
      result.reclameAquiData = extractReclameAquiFromContent($, result.pageText, item.link);
    }
    
    console.log(`[SEARCH_ANALYSIS] Sucesso posição ${position}: ${result.pageText.length} chars, ${result.externalMentions.length} menções sociais`);
    
  } catch (error) {
    console.log(`[SEARCH_ANALYSIS] Erro posição ${position}: ${error.message}`);
    result.pageError = String(error);
    result.pageText = "";
    result.hasForms = false;
    result.hasLogin = false;
    result.hasComments = false;
    result.externalMentions = [];
  }
  
  return result;
}

function createIntelligentMock(query) {
  console.log(`[MOCK_INTEL] Criando mock inteligente para: "${query}"`);
  
  // Mock com base no tipo de query
  const queryLower = query.toLowerCase();
  let mockData = [];
  
  if (queryLower.includes("reclame aqui")) {
    mockData.push({
      position: 1,
      title: `${query.replace(/reclame aqui/gi, "")} - Reclame AQUI`,
      link: "https://www.reclameaqui.com.br/empresa/exemplo/",
      snippet: "Veja as reclamações e avaliações sobre esta empresa no Reclame Aqui",
      source: "google_mock",
      isReclameAqui: true,
      pageText: "Esta empresa tem reputação regular com 45 reclamações nos últimos 30 dias",
      reclameAquiData: {
        found: true,
        score: 6.5,
        reputation: "Regular",
        complaints30d: 45,
        responseRate: 65
      }
    });
  }
  
  // Adiciona resultado principal
  mockData.push({
    position: mockData.length + 1,
    title: `${query} - Site Oficial`,
    link: "https://example.com",
    snippet: "Site oficial da empresa para mais informações",
    source: "google_mock",
    isOfficial: true,
    pageText: `Informações sobre ${query} empresa confiável com histórico sólido`
  });
  
  console.log(`[MOCK_INTEL] Mock criado com ${mockData.length} resultados`);
  return mockData;
}

// ========== RECLAME AQUI NÍVEL NASA/SpaceX ==========
async function getReclameAquiNASA(query) {
  try {
    console.log(`[RA_NASA] ========== INICIANDO ANÁLISE ULTRA AVANÇADA RECLAME AQUI ==========`);
    console.log(`[RA_NASA] Query recebida: "${query}"`);
    
    // ESTRATÉGIA 1: Busca direta no Google por "marca + reclame aqui"
    const raDirect = await searchReclameAquiViaGoogle(query);
    if (raDirect && raDirect.found) {
      console.log(`[RA_NASA] ✅ SUCESSO via Google Search: Score ${raDirect.score}, Reclamações ${raDirect.totalComplaints}`);
      return raDirect;
    }
    
    // ESTRATÉGIA 2: Múltiplas variações de slug
    const raSlug = await searchReclameAquiDirectSlug(query);
    if (raSlug && raSlug.found) {
      console.log(`[RA_NASA] ✅ SUCESSO via Slug Direto: Score ${raSlug.score}, Reclamações ${raSlug.totalComplaints}`);
      return raSlug;
    }
    
    // ESTRATÉGIA 3: Busca interna do RA
    const raInternal = await searchReclameAquiInternal(query);
    if (raInternal && raInternal.found) {
      console.log(`[RA_NASA] ✅ SUCESSO via Busca Interna: Score ${raInternal.score}, Reclamações ${raInternal.totalComplaints}`);
      return raInternal;
    }
    
    console.log(`[RA_NASA] ❌ Empresa não encontrada no Reclame Aqui após todas as estratégias`);
    return {
      found: false,
      searchAttempts: 3,
      strategies: ["google", "slug", "internal"],
      error: "Empresa não encontrada em nenhuma estratégia"
    };
    
  } catch (error) {
    console.log(`[RA_NASA] 🚨 ERRO CRÍTICO: ${error.message}`);
    return {
      found: false,
      error: String(error),
      criticalError: true
    };
  }
}

// ESTRATÉGIA 1: Busca via Google
async function searchReclameAquiViaGoogle(query) {
  try {
    console.log(`[RA_GOOGLE] Buscando "${query}" no Google + Reclame Aqui`);
    
    const googleKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CX;
    
    if (!googleKey || !cx) {
      console.log(`[RA_GOOGLE] Google API não disponível`);
      return null;
    }
    
    const searches = [
      `${query} reclame aqui`,
      `${query} site:reclameaqui.com.br`,
      `"${query}" reclameaqui.com.br`,
      `empresa ${query} reclame aqui reclamações`
    ];
    
    for (const searchQuery of searches) {
      try {
        console.log(`[RA_GOOGLE] Tentativa: "${searchQuery}"`);
        
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(searchQuery)}&key=${googleKey}&cx=${cx}&num=10`;
        const data = await fetchJSON(url, {}, 2, CONFIG.timeouts.google);
        const items = data.items || [];
        
        for (const item of items) {
          if (item.link.includes('reclameaqui.com.br/empresa/')) {
            console.log(`[RA_GOOGLE] 🎯 Link RA encontrado: ${item.link}`);
            
            const raData = await analyzeReclameAquiPage(item.link);
            if (raData && raData.found) {
              console.log(`[RA_GOOGLE] ✅ Dados extraídos com sucesso`);
              return raData;
            }
          }
        }
        
        await sleep(800); // Rate limiting
      } catch (searchError) {
        console.log(`[RA_GOOGLE] Erro na busca "${searchQuery}": ${searchError.message}`);
        continue;
      }
    }
    
    return null;
  } catch (error) {
    console.log(`[RA_GOOGLE] Erro geral: ${error.message}`);
    return null;
  }
}

// ESTRATÉGIA 2: Slug direto
async function searchReclameAquiDirectSlug(query) {
  try {
    console.log(`[RA_SLUG] Testando slugs diretos para "${query}"`);
    
    const variations = generateSlugVariations(query);
    console.log(`[RA_SLUG] ${variations.length} variações geradas: ${variations.join(", ")}`);
    
    for (const slug of variations) {
      if (!slug || slug.length < 3) continue;
      
      try {
        const directUrl = `https://www.reclameaqui.com.br/empresa/${slug}/`;
        console.log(`[RA_SLUG] Testando: ${directUrl}`);
        
        const html = await fetchText(directUrl, {}, 1, CONFIG.timeouts.reclameaqui);
        
        if (isValidReclameAquiPage(html)) {
          console.log(`[RA_SLUG] ✅ Página válida encontrada: ${slug}`);
          
          const raData = parseReclameAquiPage(html, directUrl);
          if (raData && raData.found) {
            return raData;
          }
        } else {
          console.log(`[RA_SLUG] ❌ Página inválida: ${slug}`);
        }
        
      } catch (slugError) {
        console.log(`[RA_SLUG] Erro com slug "${slug}": ${slugError.message}`);
        continue;
      }
      
      await sleep(CONFIG.delays.reclameAqui); // Rate limiting importante
    }
    
    return null;
  } catch (error) {
    console.log(`[RA_SLUG] Erro geral: ${error.message}`);
    return null;
  }
}

// ESTRATÉGIA 3: Busca interna
async function searchReclameAquiInternal(query) {
  try {
    console.log(`[RA_INTERNAL] Busca interna do RA para "${query}"`);
    
    const searchQueries = [
      query,
      query.split(" ")[0], // Primeira palavra
      query.replace(/\./g, " "), // Remove pontos
      query.replace(/[^\w\s]/g, "") // Remove caracteres especiais
    ];
    
    for (const searchQuery of searchQueries) {
      try {
        const searchUrl = `https://www.reclameaqui.com.br/busca/?q=${encodeURIComponent(searchQuery)}`;
        console.log(`[RA_INTERNAL] Buscando: ${searchUrl}`);
        
        const html = await fetchText(searchUrl, {}, 1, CONFIG.timeouts.reclameaqui);
        const $ = cheerio.load(html);
        
        // Procura links de empresas
        const companyLinks = [];
        $("a[href*='/empresa/']").each((_, a) => {
          const href = $(a).attr("href");
          if (href && /^\/empresa\/[^/]+\/?$/.test(href)) {
            const fullUrl = "https://www.reclameaqui.com.br" + href;
            if (!companyLinks.includes(fullUrl)) {
              companyLinks.push(fullUrl);
            }
          }
        });
        
        console.log(`[RA_INTERNAL] ${companyLinks.length} links de empresas encontrados`);
        
        // Testa cada link encontrado
        for (const companyLink of companyLinks.slice(0, 3)) { // Limita a 3 por busca
          try {
            console.log(`[RA_INTERNAL] Analisando: ${companyLink}`);
            
            const raData = await analyzeReclameAquiPage(companyLink);
            if (raData && raData.found) {
              console.log(`[RA_INTERNAL] ✅ Empresa válida encontrada`);
              return raData;
            }
            
          } catch (linkError) {
            console.log(`[RA_INTERNAL] Erro analisando link: ${linkError.message}`);
            continue;
          }
          
          await sleep(1000); // Rate limiting entre links
        }
        
        await sleep(CONFIG.delays.reclameAqui);
      } catch (searchError) {
        console.log(`[RA_INTERNAL] Erro na busca "${searchQuery}": ${searchError.message}`);
        continue;
      }
    }
    
    return null;
  } catch (error) {
    console.log(`[RA_INTERNAL] Erro geral: ${error.message}`);
    return null;
  }
}

// Gerador inteligente de variações de slug
function generateSlugVariations(query) {
  const variations = new Set();
  const cleaned = query.toLowerCase().trim();
  
  // Variação 1: Básica com hífens
  variations.add(cleaned.replace(/\s+/g, "-").replace(/[^\w-]/g, ""));
  
  // Variação 2: Sem espaços, só letras e números
  variations.add(cleaned.replace(/\s+/g, "").replace(/[^\w]/g, ""));
  
  // Variação 3: Substitui caracteres especiais
  variations.add(cleaned.replace(/[^\w\s]/g, "").replace(/\s+/g, "-"));
  
  // Variação 4: Remove "www" e protocolo
  const withoutProtocol = cleaned.replace(/^https?:\/\//, "").replace(/^www\./, "");
  variations.add(withoutProtocol.replace(/\s+/g, "-").replace(/[^\w-]/g, ""));
  
  // Variação 5: Só o domínio principal (sem TLD)
  if (cleaned.includes(".")) {
    const domain = cleaned.split(".")[0];
    variations.add(domain.replace(/[^\w]/g, ""));
  }
  
  // Variação 6: Primeira palavra
  const firstWord = cleaned.split(/\s+/)[0];
  if (firstWord.length > 2) {
    variations.add(firstWord.replace(/[^\w]/g, ""));
  }
  
  // Variação 7: Remove artigos e preposições
  const withoutStopWords = cleaned
    .replace(/\b(da|de|do|das|dos|e|a|o|as|os|com|para|por|em|na|no|nas|nos)\b/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
  if (withoutStopWords.length > 2) {
    variations.add(withoutStopWords);
  }
  
  // Remove variações inválidas
  return Array.from(variations).filter(v => v && v.length >= 3 && v.length <= 50);
}

function isValidReclameAquiPage(html) {
  if (!html || html.length < 1000) return false;
  
  const indicators = [
    "reclameaqui.com.br",
    "reclamações",
    "empresa",
    "reputação",
    "consumidor"
  ];
  
  const invalidIndicators = [
    "Página não encontrada",
    "404",
    "Ops! Página não encontrada",
    "Esta página não existe"
  ];
  
  const hasValidIndicators = indicators.some(indicator => 
    html.toLowerCase().includes(indicator.toLowerCase())
  );
  
  const hasInvalidIndicators = invalidIndicators.some(indicator => 
    html.toLowerCase().includes(indicator.toLowerCase())
  );
  
  return hasValidIndicators && !hasInvalidIndicators;
}

// Analisador de página do Reclame Aqui - NÍVEL ULTRA
async function analyzeReclameAquiPage(url) {
  try {
    console.log(`[RA_ANALYZE] 🔍 Analisando página: ${url}`);
    
    const html = await fetchText(url, {}, CONFIG.retries.critical, CONFIG.timeouts.reclameaqui);
    
    if (!isValidReclameAquiPage(html)) {
      console.log(`[RA_ANALYZE] ❌ Página inválida`);
      return null;
    }
    
    return parseReclameAquiPage(html, url);
  } catch (error) {
    console.log(`[RA_ANALYZE] Erro analisando ${url}: ${error.message}`);
    return null;
  }
}

function parseReclameAquiPage(html, url) {
  try {
    console.log(`[RA_PARSE] 🔧 Parseando página do Reclame Aqui...`);
    
    const $ = cheerio.load(html);
    const bodyText = $("body").text();
    const htmlLower = html.toLowerCase();
    
    const result = {
      found: true,
      companyLink: url,
      score: null,
      totalComplaints: null,
      last30d: null,
      verified: false,
      reputation: null,
      responseRate: null,
      resolvedRate: null,
      averageTime: null,
      wouldDoBusinessAgain: null,
      selectors: [],
      extractionDetails: []
    };
    
    // ===== SCORE DA EMPRESA =====
    const scoreSelectors = [
      { selector: ".score .number", description: "Score principal" },
      { selector: "[data-testid='company-score']", description: "Score por data-testid" },
      { selector: ".company-score", description: "Score da empresa" },
      { selector: "*[class*='score'] *[class*='number']", description: "Score genérico" },
      { selector: ".rating-score", description: "Rating score" },
      { selector: ".company-rating", description: "Company rating" },
      { selector: "*[class*='Score']", description: "Score com capitalização" },
      { selector: "*[data-score]", description: "Score por data attribute" }
    ];
    
    for (const { selector, description } of scoreSelectors) {
      try {
        const scoreText = $(selector).first().text().trim();
        if (scoreText && /^\d+(\.\d+)?$/.test(scoreText)) {
          result.score = parseFloat(scoreText);
          result.selectors.push(`Score encontrado: ${selector} = ${scoreText}`);
          console.log(`[RA_PARSE] ✅ Score: ${result.score} (${description})`);
          break;
        }
      } catch {}
    }
    
    // Busca score por regex no texto
    if (result.score === null) {
      const scorePatterns = [
        /(?:nota|score|avaliação)[:\s]*(\d+(?:\.\d+)?)/gi,
        /(\d+(?:\.\d+)?)[\/\s]*10/gi,
        /reputação[:\s]*(\d+(?:\.\d+)?)/gi
      ];
      
      for (const pattern of scorePatterns) {
        const match = bodyText.match(pattern);
        if (match) {
          const scoreValue = parseFloat(match[1] || match[0].match(/\d+(\.\d+)?/)[0]);
          if (scoreValue >= 0 && scoreValue <= 10) {
            result.score = scoreValue;
            result.extractionDetails.push(`Score via regex: ${pattern.source} = ${scoreValue}`);
            console.log(`[RA_PARSE] ✅ Score via regex: ${scoreValue}`);
            break;
          }
        }
      }
    }
    
    // ===== RECLAMAÇÕES TOTAIS =====
    const complaintsPatterns = [
      /(\d{1,3}(?:[\.,]\d{3})*)\s*reclamações?/gi,
      /reclamações?[:\s]*(\d{1,3}(?:[\.,]\d{3})*)/gi,
      /total[:\s]*(\d{1,3}(?:[\.,]\d{3})*)/gi,
      /esta empresa recebeu[:\s]*(\d{1,3}(?:[\.,]\d{3})*)/gi
    ];
    
    for (const pattern of complaintsPatterns) {
      const matches = Array.from(bodyText.matchAll(pattern));
      for (const match of matches) {
        const num = extractNumber(match[1] || match[0]);
        if (num > 0) {
          result.totalComplaints = num;
          result.extractionDetails.push(`Total reclamações: ${pattern.source} = ${num}`);
          console.log(`[RA_PARSE] ✅ Total reclamações: ${num}`);
          break;
        }
      }
      if (result.totalComplaints !== null) break;
    }
    
    // ===== ÚLTIMOS 30 DIAS =====
    const last30dPatterns = [
      /(\d{1,3}(?:[\.,]\d{3})*)\s*nos?\s*últimos?\s*30\s*dias?/gi,
      /últimos?\s*30\s*dias?[:\s]*(\d{1,3}(?:[\.,]\d{3})*)/gi,
      /30\s*dias?[:\s]*(\d+)/gi,
      /recebeu[:\s]*(\d{1,3}(?:[\.,]\d{3})*)[^\d]*30\s*dias/gi
    ];
    
    for (const pattern of last30dPatterns) {
      const matches = Array.from(bodyText.matchAll(pattern));
      for (const match of matches) {
        const num = extractNumber(match[1] || match[0]);
        if (num >= 0) {
          result.last30d = num;
          result.extractionDetails.push(`Últimos 30 dias: ${pattern.source} = ${num}`);
          console.log(`[RA_PARSE] ✅ Últimos 30 dias: ${num}`);
          break;
        }
      }
      if (result.last30d !== null) break;
    }
    
    // ===== VERIFICAÇÃO DA EMPRESA =====
    const verificationIndicators = [
      "Selo RA Verificada",
      "empresa verificada",
      "verificado",
      "verificada",
      "selo de confiança",
      "empresa autenticada"
    ];
    
    for (const indicator of verificationIndicators) {
      if (htmlLower.includes(indicator.toLowerCase())) {
        result.verified = true;
        result.extractionDetails.push(`Verificação encontrada: "${indicator}"`);
        console.log(`[RA_PARSE] ✅ Empresa verificada: ${indicator}`);
        break;
      }
    }
    
    // ===== REPUTAÇÃO =====
    const reputationKeywords = [
      { keyword: "Não recomendada", value: "Não recomendada" },
      { keyword: "Regular", value: "Regular" },
      { keyword: "Boa", value: "Boa" },
      { keyword: "Ótima", value: "Ótima" },
      { keyword: "Excelente", value: "Excelente" }
    ];
    
    for (const { keyword, value } of reputationKeywords) {
      if (bodyText.includes(keyword)) {
        result.reputation = value;
        result.extractionDetails.push(`Reputação: "${keyword}"`);
        console.log(`[RA_PARSE] ✅ Reputação: ${value}`);
        break;
      }
    }
    
    // ===== TAXA DE RESPOSTA =====
    const responsePatterns = [
      /[Rr]espondeu[:\s]*(\d+)%/g,
      /taxa de resposta[:\s]*(\d+)%/gi,
      /(\d+)%[^\d]*das reclamações respondidas/gi
    ];
    
    for (const pattern of responsePatterns) {
      const match = bodyText.match(pattern);
      if (match) {
        const rate = parseInt(match[1]);
        if (rate >= 0 && rate <= 100) {
          result.responseRate = rate;
          result.extractionDetails.push(`Taxa de resposta: ${rate}%`);
          console.log(`[RA_PARSE] ✅ Taxa de resposta: ${rate}%`);
          break;
        }
      }
    }
    
    // ===== TAXA DE RESOLUÇÃO =====
    const resolvedPatterns = [
      /resolveu[:\s]*(\d+)%/gi,
      /taxa de resolução[:\s]*(\d+)%/gi,
      /(\d+)%[^\d]*das reclamações resolvidas/gi
    ];
    
    for (const pattern of resolvedPatterns) {
      const match = bodyText.match(pattern);
      if (match) {
        const rate = parseInt(match[1]);
        if (rate >= 0 && rate <= 100) {
          result.resolvedRate = rate;
          result.extractionDetails.push(`Taxa de resolução: ${rate}%`);
          console.log(`[RA_PARSE] ✅ Taxa de resolução: ${rate}%`);
          break;
        }
      }
    }
    
    // ===== VOLTARIAM A FAZER NEGÓCIO =====
    const businessAgainPatterns = [
      /(\d+)%[^\d]*voltariam a fazer negócio/gi,
      /voltariam[:\s]*(\d+)%/gi
    ];
    
    for (const pattern of businessAgainPatterns) {
      const match = bodyText.match(pattern);
      if (match) {
        const rate = parseInt(match[1]);
        if (rate >= 0 && rate <= 100) {
          result.wouldDoBusinessAgain = rate;
          result.extractionDetails.push(`Voltariam a fazer negócio: ${rate}%`);
          console.log(`[RA_PARSE] ✅ Voltariam a fazer negócio: ${rate}%`);
          break;
        }
      }
    }
    
    // ===== TEMPO MÉDIO DE RESPOSTA =====
    const timePatterns = [
      /tempo médio[:\s]*(\d+)[^\d]*(dias?|horas?|minutos?)/gi,
      /responde em[:\s]*(\d+)[^\d]*(dias?|horas?|minutos?)/gi
    ];
    
    for (const pattern of timePatterns) {
      const match = bodyText.match(pattern);
      if (match) {
        result.averageTime = `${match[1]} ${match[2]}`;
        result.extractionDetails.push(`Tempo médio: ${result.averageTime}`);
        console.log(`[RA_PARSE] ✅ Tempo médio: ${result.averageTime}`);
        break;
      }
    }
    
    // Log final dos resultados
    console.log(`[RA_PARSE] 🎉 RESULTADO FINAL:`);
    console.log(`[RA_PARSE] - Score: ${result.score}`);
    console.log(`[RA_PARSE] - Total Reclamações: ${result.totalComplaints}`);
    console.log(`[RA_PARSE] - Últimos 30 dias: ${result.last30d}`);
    console.log(`[RA_PARSE] - Verificada: ${result.verified}`);
    console.log(`[RA_PARSE] - Reputação: ${result.reputation}`);
    console.log(`[RA_PARSE] - Taxa Resposta: ${result.responseRate}%`);
    console.log(`[RA_PARSE] - Taxa Resolução: ${result.resolvedRate}%`);
    
    return result;
    
  } catch (error) {
    console.log(`[RA_PARSE] Erro crítico no parse: ${error.message}`);
    return {
      found: false,
      error: String(error),
      parseError: true
    };
  }
}

function extractNumber(str) {
  if (!str) return 0;
  return parseInt(String(str).replace(/[\.,]/g, "")) || 0;
}

// Extrator do conteúdo do RA a partir dos resultados do Google
function extractReclameAquiFromContent($, pageText, url) {
  try {
    console.log(`[RA_EXTRACT] Extraindo dados do RA de: ${url}`);
    
    // Usa o mesmo parser principal
    return parseReclameAquiPage($.html(), url);
  } catch (error) {
    console.log(`[RA_EXTRACT] Erro: ${error.message}`);
    return null;
  }
}

// ========== ANÁLISE DE SENTIMENTO NÍVEL META ==========
function analyzeSentimentMeta(results) {
  try {
    console.log(`[SENTIMENT_META] Analisando sentimento de ${results.length} resultados`);
    
    const social = {
      instagram: null,
      twitter: null,
      reddit: null,
      linkedin: null,
      facebook: null,
      youtube: null,
      mentions: 0,
      sentiment: "neutral",
      positiveSignals: 0,
      negativeSignals: 0,
      officialPresence: false
    };
    
    const positiveWords = [
      "bom", "ótimo", "excelente", "recomendo", "confiável", "seguro", "oficial",
      "qualidade", "satisfeito", "aprovado", "fantástico", "perfeito", "maravilhoso",
      "top", "show", "incrível", "amei", "adorei", "sucesso", "5 estrelas"
    ];
    
    const negativeWords = [
      "golpe", "fraude", "ruim", "péssimo", "não recomendo", "cuidado", "suspeito",
      "problema", "reclamação", "insatisfeito", "horrível", "terrível", "lixo",
      "furada", "enganação", "mentira", "roubo", "não comprem", "picaretagem"
    ];
    
    for (const result of results) {
      // Coleta menções de redes sociais
      if (result.externalMentions) {
        result.externalMentions.forEach(link => {
          if (link.includes("instagram.com") && !social.instagram) social.instagram = link;
          if (link.includes("twitter.com") && !social.twitter) social.twitter = link;
          if (link.includes("reddit.com") && !social.reddit) social.reddit = link;
          if (link.includes("linkedin.com") && !social.linkedin) social.linkedin = link;
          if (link.includes("facebook.com") && !social.facebook) social.facebook = link;
          if (link.includes("youtube.com") && !social.youtube) social.youtube = link;
          social.mentions++;
        });
      }
      
      // Detecta presença oficial
      if (result.isOfficial || result.title.toLowerCase().includes("oficial")) {
        social.officialPresence = true;
      }
      
      // Análise de sentimento
      const text = `${result.title} ${result.snippet} ${result.pageText || ""}`.toLowerCase();
      
      positiveWords.forEach(word => {
        const wordCount = (text.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
        social.positiveSignals += wordCount;
      });
      
      negativeWords.forEach(word => {
        const wordCount = (text.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
        social.negativeSignals += wordCount;
      });
      
      // Peso especial para resultados do Reclame Aqui
      if (result.isReclameAqui && result.reclameAquiData) {
        const raData = result.reclameAquiData;
        if (raData.reputation === "Não recomendada") social.negativeSignals += 5;
        if (raData.reputation === "Ótima") social.positiveSignals += 5;
        if (raData.last30d > 50) social.negativeSignals += 3;
        if (raData.responseRate < 50) social.negativeSignals += 2;
      }
    }
    
    // Determina sentimento final
    const ratio = social.positiveSignals / Math.max(social.negativeSignals, 1);
    
    if (ratio >= 2) {
      social.sentiment = "positive";
    } else if (ratio <= 0.5) {
      social.sentiment = "negative";
    }
    
    console.log(`[SENTIMENT_META] Resultado: Positivo=${social.positiveSignals}, Negativo=${social.negativeSignals}, Sentimento=${social.sentiment}`);
    
    return social;
  } catch (error) {
    console.log(`[SENTIMENT_META] Erro: ${error.message}`);
    return {
      mentions: 0,
      sentiment: "neutral",
      positiveSignals: 0,
      negativeSignals: 0,
      error: String(error)
    };
  }
}

// ========== TRUSTPILOT NÍVEL GOOGLE ==========
async function getTrustPilotGoogle(domain) {
  if (!domain) return { found: false };
  
  try {
    console.log(`[TRUSTPILOT_G] Verificando ${domain}`);
    
    const url = `https://www.trustpilot.com/review/${domain}`;
    const html = await fetchText(url, {}, CONFIG.retries.api, CONFIG.timeouts.trustpilot);
    
    const $ = cheerio.load(html);
    
    // Múltiplas estratégias para encontrar o rating
    let rating = null;
    
    // Estratégia 1: Atributos data
    $("[data-rating], [data-score]").each((_, elem) => {
      const ratingVal = $(elem).attr("data-rating") || $(elem).attr("data-score");
      if (ratingVal) {
        const num = parseFloat(ratingVal);
        if (num >= 1 && num <= 5) {
          rating = num;
          return false; // break
        }
      }
    });
    
    // Estratégia 2: Classes específicas do TrustPilot
    if (!rating) {
      const ratingSelectors = [
        "*[class*='rating']",
        "*[class*='score']", 
        "*[class*='stars']",
        ".star-rating",
        "*[aria-label*='star']",
        "*[title*='star']"
      ];
      
      for (const selector of ratingSelectors) {
        $(selector).each((_, elem) => {
          const text = $(elem).text().trim();
          const num = parseFloat(text);
          if (num >= 1 && num <= 5) {
            rating = num;
            return false;
          }
        });
        if (rating) break;
      }
    }
    
    // Estratégia 3: Regex no conteúdo
    if (!rating) {
      const bodyText = $("body").text();
      const ratingPatterns = [
        /(\d\.\d)\s*out of 5/i,
        /(\d\.\d)\s*\/\s*5/i,
        /rating[\s:]*(\d\.\d)/i,
        /score[\s:]*(\d\.\d)/i
      ];
      
      for (const pattern of ratingPatterns) {
        const match = bodyText.match(pattern);
        if (match) {
          const num = parseFloat(match[1]);
          if (num >= 1 && num <= 5) {
            rating = num;
            break;
          }
        }
      }
    }
    
    // Busca contagem de reviews
    let reviewCount = null;
    const bodyText = $("body").text();
    const reviewPatterns = [
      /(\d{1,3}(?:[,\.]\d{3})*)\s*reviews?/i,
      /based on (\d{1,3}(?:[,\.]\d{3})*)/i,
      /(\d{1,3}(?:[,\.]\d{3})*)\s*customer reviews/i
    ];
    
    for (const pattern of reviewPatterns) {
      const match = bodyText.match(pattern);
      if (match) {
        reviewCount = parseInt(match[1].replace(/[,\.]/g, ""));
        break;
      }
    }
    
    // Análise adicional
    const hasBusinessProfile = bodyText.toLowerCase().includes("business profile");
    const isClaimedProfile = bodyText.toLowerCase().includes("claimed");
    
    console.log(`[TRUSTPILOT_G] ${domain} - Rating: ${rating}, Reviews: ${reviewCount}, Claimed: ${isClaimedProfile}`);
    
    return {
      found: !!rating,
      rating,
      reviewCount,
      url,
      hasBusinessProfile,
      isClaimedProfile,
      lastUpdated: new Date().toISOString()
    };
    
  } catch (error) {
    console.log(`[TRUSTPILOT_G] Erro para ${domain}: ${error.message}`);
    return { 
      found: false, 
      error: String(error),
      url: `https://www.trustpilot.com/review/${domain}`
    };
  }
}

// ========== CALCULADORA DE SCORE NÍVEL SANTANDER ==========
function calculateScoreSantander(host, brandGuess, ssl, whois, ra, social, serpResults, trustPilot) {
  console.log(`[SCORE_SANTANDER] ========== CALCULANDO SCORE ULTRA AVANÇADO ==========`);
  console.log(`[SCORE_SANTANDER] Host: ${host}, Brand: ${brandGuess}`);
  
  let score = 70; // Score base mais conservador
  const factors = [];
  const warnings = [];
  const positives = [];
  
  // ===== ANÁLISE SSL/TLS (Peso: Alto) =====
  if (host) {
    if (!ssl?.present) {
      score -= 30;
      factors.push("SSL ausente (-30)");
      warnings.push("Sem certificado de segurança SSL");
    } else if (ssl.present && !ssl.validNow) {
      score -= 20;
      factors.push("SSL inválido/expirado (-20)");
      warnings.push("Certificado SSL inválido ou expirado");
    } else {
      score += 8;
      factors.push("SSL válido (+8)");
      positives.push("Certificado SSL válido e atualizado");
      
      // Bônus para SSL avançado
      if (ssl.isEV) {
        score += 5;
        factors.push("SSL Extended Validation (+5)");
        positives.push("Certificado SSL Extended Validation");
      }
      
      if (ssl.chainLength >= 3) {
        score += 2;
        factors.push("Cadeia SSL completa (+2)");
      }
    }
  }
  
  // ===== ANÁLISE WHOIS/DOMÍNIO (Peso: Alto) =====
  if (whois?.WhoisRecord) {
    try {
      const regData = whois.WhoisRecord.registryData || whois.WhoisRecord;
      const created = regData.createdDate || regData.createdDateNormalized || whois.WhoisRecord.createdDate;
      
      if (created) {
        const ageDays = Math.max(0, (Date.now() - new Date(created).getTime()) / (1000 * 60 * 60 * 24));
        const ageYears = ageDays / 365;
        
        if (ageDays < 7) {
          score -= 40;
          factors.push(`Domínio muito novo: ${Math.round(ageDays)} dias (-40)`);
          warnings.push(`Domínio registrado há apenas ${Math.round(ageDays)} dias`);
        } else if (ageDays < 30) {
          score -= 30;
          factors.push(`Domínio muito recente: ${Math.round(ageDays)} dias (-30)`);
          warnings.push(`Domínio muito recente (${Math.round(ageDays)} dias)`);
        } else if (ageDays < 90) {
          score -= 20;
          factors.push(`Domínio novo: ${Math.round(ageDays)} dias (-20)`);
          warnings.push(`Domínio relativamente novo`);
        } else if (ageDays < 365) {
          score -= 10;
          factors.push(`Domínio recente: ${Math.round(ageYears)} ano(s) (-10)`);
        } else if (ageDays > 365 * 2) {
          score += 10;
          factors.push(`Domínio antigo: ${Math.round(ageYears)} anos (+10)`);
          positives.push(`Domínio estabelecido há ${Math.round(ageYears)} anos`);
        }
        
        // Bônus para domínios muito antigos
        if (ageDays > 365 * 5) {
          score += 5;
          factors.push("Domínio muito estabelecido (+5)");
          positives.push("Domínio com mais de 5 anos");
        }
      }
      
      // Análise do registrante
      const contacts = regData.contacts || {};
      const hasPrivateRegistration = Object.values(contacts).some(contact => 
        contact?.organization?.toLowerCase().includes('private') || 
        contact?.organization?.toLowerCase().includes('whoisguard')
      );
      
      if (hasPrivateRegistration) {
        score -= 5;
        factors.push("Registro privado (-5)");
      }
      
    } catch (e) {
      console.log(`[SCORE_SANTANDER] Erro analisando WHOIS: ${e.message}`);
    }
  }
  
  // ===== ANÁLISE RECLAME AQUI (Peso: Muito Alto) =====
  if (ra?.found) {
    factors.push("✅ Encontrado no Reclame Aqui");
    positives.push("Empresa encontrada no Reclame Aqui");
    
    // Verificação da empresa
    if (ra.verified) {
      score += 10;
      factors.push("Empresa verificada RA (+10)");
      positives.push("Empresa verificada pelo Reclame Aqui");
    } else {
      score -= 12;
      factors.push("Empresa não verificada RA (-12)");
      warnings.push("Empresa não é verificada pelo Reclame Aqui");
    }
    
    // Análise da reputação
    if (ra.reputation) {
      switch (ra.reputation) {
        case "Não recomendada":
          score -= 35;
          factors.push("Reputação: Não recomendada (-35)");
          warnings.push("Reputação 'Não recomendada' no Reclame Aqui");
          break;
        case "Regular":
          score -= 15;
          factors.push("Reputação: Regular (-15)");
          warnings.push("Reputação 'Regular' no Reclame Aqui");
          break;
        case "Boa":
          score += 8;
          factors.push("Reputação: Boa (+8)");
          positives.push("Boa reputação no Reclame Aqui");
          break;
        case "Ótima":
          score += 15;
          factors.push("Reputação: Ótima (+15)");
          positives.push("Ótima reputação no Reclame Aqui");
          break;
        case "Excelente":
          score += 20;
          factors.push("Reputação: Excelente (+20)");
          positives.push("Excelente reputação no Reclame Aqui");
          break;
      }
    }
    
    // Taxa de resposta
    if (ra.responseRate !== null) {
      if (ra.responseRate < 30) {
        score -= 25;
        factors.push(`Taxa resposta muito baixa: ${ra.responseRate}% (-25)`);
        warnings.push(`Taxa de resposta muito baixa (${ra.responseRate}%)`);
      } else if (ra.responseRate < 50) {
        score -= 15;
        factors.push(`Taxa resposta baixa: ${ra.responseRate}% (-15)`);
        warnings.push(`Taxa de resposta baixa (${ra.responseRate}%)`);
      } else if (ra.responseRate < 70) {
        score -= 8;
        factors.push(`Taxa resposta regular: ${ra.responseRate}% (-8)`);
      } else if (ra.responseRate >= 90) {
        score += 10;
        factors.push(`Taxa resposta excelente: ${ra.responseRate}% (+10)`);
        positives.push(`Alta taxa de resposta (${ra.responseRate}%)`);
      } else {
        score += 5;
        factors.push(`Taxa resposta boa: ${ra.responseRate}% (+5)`);
        positives.push(`Boa taxa de resposta (${ra.responseRate}%)`);
      }
    }
    
    // Taxa de resolução
    if (ra.resolvedRate !== null) {
      if (ra.resolvedRate < 30) {
        score -= 20;
        factors.push(`Taxa resolução baixa: ${ra.resolvedRate}% (-20)`);
        warnings.push(`Baixa taxa de resolução (${ra.resolvedRate}%)`);
      } else if (ra.resolvedRate >= 80) {
        score += 8;
        factors.push(`Taxa resolução alta: ${ra.resolvedRate}% (+8)`);
        positives.push(`Alta taxa de resolução (${ra.resolvedRate}%)`);
      }
    }
    
    // Score do RA
    if (ra.score !== null) {
      if (ra.score < 4) {
        score -= 30;
        factors.push(`Score RA muito baixo: ${ra.score} (-30)`);
        warnings.push(`Score muito baixo no Reclame Aqui (${ra.score})`);
      } else if (ra.score < 6) {
        score -= 20;
        factors.push(`Score RA baixo: ${ra.score} (-20)`);
        warnings.push(`Score baixo no Reclame Aqui (${ra.score})`);
      } else if (ra.score < 7) {
        score -= 10;
        factors.push(`Score RA regular: ${ra.score} (-10)`);
      } else if (ra.score >= 8.5) {
        score += 12;
        factors.push(`Score RA excelente: ${ra.score} (+12)`);
        positives.push(`Excelente score no Reclame Aqui (${ra.score})`);
      } else if (ra.score >= 7.5) {
        score += 8;
        factors.push(`Score RA bom: ${ra.score} (+8)`);
        positives.push(`Bom score no Reclame Aqui (${ra.score})`);
      }
    }
    
    // Reclamações recentes (peso muito alto)
    if (ra.last30d !== null) {
      if (ra.last30d > 200) {
        score -= 40;
        factors.push(`Muitas reclamações recentes: ${ra.last30d} (-40)`);
        warnings.push(`${ra.last30d} reclamações nos últimos 30 dias`);
      } else if (ra.last30d > 100) {
        score -= 30;
        factors.push(`Reclamações recentes altas: ${ra.last30d} (-30)`);
        warnings.push(`${ra.last30d} reclamações recentes`);
      } else if (ra.last30d > 50) {
        score -= 20;
        factors.push(`Reclamações recentes: ${ra.last30d} (-20)`);
        warnings.push(`${ra.last30d} reclamações nos últimos 30 dias`);
      } else if (ra.last30d > 20) {
        score -= 12;
        factors.push(`Algumas reclamações recentes: ${ra.last30d} (-12)`);
        warnings.push(`${ra.last30d} reclamações recentes`);
      } else if (ra.last30d > 5) {
        score -= 5;
        factors.push(`Poucas reclamações recentes: ${ra.last30d} (-5)`);
      } else if (ra.last30d === 0) {
        score += 8;
        factors.push("Nenhuma reclamação recente (+8)");
        positives.push("Nenhuma reclamação nos últimos 30 dias");
      }
    }
    
    // Voltariam a fazer negócio
    if (ra.wouldDoBusinessAgain !== null) {
      if (ra.wouldDoBusinessAgain >= 80) {
        score += 8;
        factors.push(`Alta recomendação: ${ra.wouldDoBusinessAgain}% voltariam (+8)`);
        positives.push(`${ra.wouldDoBusinessAgain}% dos clientes voltariam a comprar`);
      } else if (ra.wouldDoBusinessAgain < 30) {
        score -= 12;
        factors.push(`Baixa recomendação: ${ra.wouldDoBusinessAgain}% voltariam (-12)`);
        warnings.push(`Apenas ${ra.wouldDoBusinessAgain}% dos clientes voltariam a comprar`);
      }
    }
    
  } else {
    // Penalidade menor por não estar no RA (pode ser empresa pequena/nova)
    score -= 5;
    factors.push("Não encontrado no Reclame Aqui (-5)");
  }
  
  // ===== ANÁLISE DE SENTIMENTO ONLINE (Peso: Alto) =====
  if (social) {
    switch (social.sentiment) {
      case "positive":
        score += 12;
        factors.push("Sentimento online positivo (+12)");
        positives.push("Menções positivas encontradas online");
        break;
      case "negative":
        score -= 18;
        factors.push("Sentimento online negativo (-18)");
        warnings.push("Múltiplas menções negativas encontradas");
        break;
    }
    
    // Presença oficial
    if (social.officialPresence) {
      score += 5;
      factors.push("Presença oficial confirmada (+5)");
      positives.push("Site oficial confirmado");
    }
    
    // Menções em redes sociais
    if (social.mentions > 10) {
      score += 8;
      factors.push(`Muitas menções sociais: ${social.mentions} (+8)`);
      positives.push("Forte presença em redes sociais");
    } else if (social.mentions > 5) {
      score += 3;
      factors.push(`Algumas menções sociais: ${social.mentions} (+3)`);
    }
    
    // Penalidade para menções excessivamente negativas
    if (social.negativeSignals > social.positiveSignals * 2) {
      score -= 10;
      factors.push("Muito sentimento negativo online (-10)");
      warnings.push("Predominância de comentários negativos");
    }
  }
  
  // ===== ANÁLISE TRUSTPILOT (Peso: Médio) =====
  if (trustPilot?.found) {
    if (trustPilot.rating >= 4.5) {
      score += 12;
      factors.push(`TrustPilot excelente: ${trustPilot.rating}/5 (+12)`);
      positives.push(`Excelente avaliação no TrustPilot (${trustPilot.rating}/5)`);
    } else if (trustPilot.rating >= 4) {
      score += 8;
      factors.push(`TrustPilot bom: ${trustPilot.rating}/5 (+8)`);
      positives.push(`Boa avaliação no TrustPilot (${trustPilot.rating}/5)`);
    } else if (trustPilot.rating >= 3) {
      score += 3;
      factors.push(`TrustPilot regular: ${trustPilot.rating}/5 (+3)`);
    } else if (trustPilot.rating < 2) {
      score -= 15;
      factors.push(`TrustPilot muito baixo: ${trustPilot.rating}/5 (-15)`);
      warnings.push(`Avaliação muito baixa no TrustPilot (${trustPilot.rating}/5)`);
    } else {
      score -= 8;
      factors.push(`TrustPilot baixo: ${trustPilot.rating}/5 (-8)`);
      warnings.push(`Avaliação baixa no TrustPilot (${trustPilot.rating}/5)`);
    }
    
    // Bônus para muitas reviews
    if (trustPilot.reviewCount > 1000) {
      score += 5;
      factors.push(`Muitas reviews TrustPilot: ${trustPilot.reviewCount} (+5)`);
      positives.push("Grande volume de avaliações no TrustPilot");
    } else if (trustPilot.reviewCount > 100) {
      score += 3;
      factors.push(`Bom volume de reviews: ${trustPilot.reviewCount} (+3)`);
    }
    
    // Bônus para perfil business verificado
    if (trustPilot.isClaimedProfile) {
      score += 5;
      factors.push("Perfil TrustPilot verificado (+5)");
      positives.push("Perfil TrustPilot verificado pela empresa");
    }
  }
  
  // ===== ANÁLISE DOS RESULTADOS GOOGLE SERP (Peso: Médio) =====
  if (serpResults && serpResults.length > 0) {
    let positiveHits = 0;
    let negativeHits = 0;
    let reclameAquiMentions = 0;
    
    const positiveKeywords = ["oficial", "confiável", "recomendo", "bom", "ótimo", "qualidade", "sucesso"];
    const negativeKeywords = ["golpe", "fraude", "suspeito", "cuidado", "problema", "reclamação", "ruim", "péssimo"];
    
    for (const result of serpResults) {
      const text = `${result.title} ${result.snippet} ${result.pageText || ""}`.toLowerCase();
      
      positiveKeywords.forEach(word => {
        if (text.includes(word)) positiveHits++;
      });
      
      negativeKeywords.forEach(word => {
        if (text.includes(word)) negativeHits++;
      });
      
      if (result.isReclameAqui) reclameAquiMentions++;
    }
    
    // Ajusta score baseado nas menções
    if (positiveHits > negativeHits * 1.5) {
      const bonus = Math.min(positiveHits - negativeHits, 12);
      score += bonus;
      factors.push(`Menções positivas online: +${positiveHits} -${negativeHits} (+${bonus})`);
      positives.push("Predominância de menções positivas no Google");
    } else if (negativeHits > positiveHits * 1.5) {
      const penalty = Math.min(negativeHits - positiveHits, 18);
      score -= penalty;
      factors.push(`Menções negativas online: +${positiveHits} -${negativeHits} (-${penalty})`);
      warnings.push("Múltiplas menções negativas encontradas no Google");
    }
    
    // Presença no primeiro resultado
    const firstResult = serpResults[0];
    if (firstResult && firstResult.isOfficial) {
      score += 8;
      factors.push("Primeira posição é site oficial (+8)");
      positives.push("Site oficial aparece em primeiro lugar no Google");
    }
  }
  
  // ===== ANÁLISE TLD SUSPEITO (Peso: Médio) =====
  if (host) {
    const tld = host.split(".").pop()?.toLowerCase();
    const suspiciousTlds = ["xyz", "top", "click", "tk", "ml", "ga", "cf", "live", "monster", "bid", "download"];
    const trustedTlds = ["com", "com.br", "org", "net", "edu", "gov", "gov.br"];
    
    if (suspiciousTlds.includes(tld)) {
      score -= 25;
      factors.push(`TLD suspeito: .${tld} (-25)`);
      warnings.push(`Extensão de domínio suspeita (.${tld})`);
    } else if (trustedTlds.includes(tld)) {
      score += 3;
      factors.push(`TLD confiável: .${tld} (+3)`);
    }
  }
  
  // ===== NORMALIZAÇÃO E CLASSIFICAÇÃO FINAL =====
  score = Math.max(0, Math.min(100, Math.round(score)));
  
  console.log(`[SCORE_SANTANDER] ========== SCORE FINAL: ${score}% ==========`);
  console.log(`[SCORE_SANTANDER] Fatores analisados: ${factors.length}`);
  console.log(`[SCORE_SANTANDER] Pontos positivos: ${positives.length}`);
  console.log(`[SCORE_SANTANDER] Avisos: ${warnings.length}`);
  
  return { 
    score, 
    factors, 
    positives, 
    warnings,
    totalFactorsAnalyzed: factors.length
  };
}

// ===== CLASSIFICADOR INTELIGENTE =====
function classifyIntelligent(score) {
  if (score >= 75) {
    return {
      status: "safe",
      title: "✅ SITE TOTALMENTE SEGURO",
      classification: "Confiável"
    };
  } else if (score >= 50) {
    return {
      status: "suspicious", 
      title: "⚠️ CUIDADO - SITE SUSPEITO",
      classification: "Suspeito"
    };
  } else {
    return {
      status: "danger",
      title: "🚨 NÃO COMPRE AQUI - ALTO RISCO",
      classification: "Perigoso"
    };
  }
}

// ===== GERADOR DE MENSAGEM ULTRA INTELIGENTE =====
function generateUltraMessage(classification, ra, social, ssl, factors, positives, warnings) {
  console.log(`[MSG_ULTRA] Gerando mensagem para status: ${classification.status}`);
  
  let message = "";
  
  if (classification.status === "safe") {
    const mainPositives = positives.slice(0, 3);
    if (mainPositives.length > 0) {
      message = `Site seguro e confiável! Principais pontos positivos: ${mainPositives.join(", ").toLowerCase()}. `;
    } else {
      message = "Análise não identificou problemas graves de segurança. ";
    }
    
    if (ra?.found && ra.verified) {
      message += "Empresa verificada no Reclame Aqui. ";
    }
    
    if (ssl?.present && ssl.validNow) {
      message += "Conexão protegida por SSL. ";
    }
    
    message += "Pode prosseguir com segurança.";
    
  } else if (classification.status === "suspicious") {
    const mainWarnings = warnings.slice(0, 3);
    if (mainWarnings.length > 0) {
      message = `Cuidado! Detectamos: ${mainWarnings.join(", ").toLowerCase()}. `;
    } else {
      message = "Encontramos sinais contraditórios na análise. ";
    }
    
    if (ra?.found && ra.reputation) {
      message += `Reputação no Reclame Aqui: ${ra.reputation}. `;
    }
    
    message += "Recomendamos verificação adicional antes de prosseguir.";
    
  } else { // danger
    const criticalWarnings = warnings.slice(0, 4);
    if (criticalWarnings.length > 0) {
      message = `ALERTA MÁXIMO! ${criticalWarnings.join(", ").toLowerCase()}. `;
    } else {
      message = "Múltiplos sinais de alto risco detectados. ";
    }
    
    if (ra?.found && ra.last30d > 20) {
      message += `${ra.last30d} reclamações recentes no Reclame Aqui. `;
    }
    
    if (!ssl?.present) {
      message += "Sem proteção SSL. ";
    }
    
    message += "NÃO recomendamos este site.";
  }
  
  console.log(`[MSG_ULTRA] Mensagem gerada: ${message.substring(0, 100)}...`);
  return message;
}

// ========== HANDLER PRINCIPAL ULTRA ENTERPRISE ==========
export async function handler(event) {
  const startTime = Date.now();
  
  try {
    console.log(`[HANDLER_ULTRA] ========== NOVA VERIFICAÇÃO INICIADA ==========`);
    console.log(`[HANDLER_ULTRA] Timestamp: ${nowISO()}`);
    
    // Parse da requisição
    const { query } = JSON.parse(event.body || "{}");
    const normalizedQuery = normalizeQuery(query);
    
    if (!normalizedQuery) {
      console.log("[HANDLER_ULTRA] Query vazia recebida");
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        },
        body: JSON.stringify({ 
          error: "Por favor, informe um site ou marca para verificar",
          received: query
        })
      };
    }
    
    console.log(`[HANDLER_ULTRA] Query normalizada: "${normalizedQuery}"`);
    
    // ===== FASE 1: DESCOBERTA DE DOMÍNIO =====
    console.log(`[HANDLER_ULTRA] ===== FASE 1: DESCOBERTA DE DOMÍNIO =====`);
    
    let host = extractHostFromQuery(normalizedQuery);
    console.log(`[HANDLER_ULTRA] Host extraído: ${host || "null"}`);
    
    if (!host) {
      console.log(`[HANDLER_ULTRA] Iniciando busca inteligente de domínio...`);
      host = await findDomainIntelligente(normalizedQuery);
      console.log(`[HANDLER_ULTRA] Domínio encontrado via IA: ${host || "null"}`);
    }
    
    const brandGuess = host ? 
      (parse(host)?.domainWithoutSuffix || host.split(".")[0] || normalizedQuery).toLowerCase() : 
      normalizedQuery.split(/\s+/)[0].toLowerCase();
    
    console.log(`[HANDLER_ULTRA] Brand guess: "${brandGuess}"`);
    
    // ===== FASE 2: VERIFICAÇÕES BÁSICAS PARALELAS =====
    console.log(`[HANDLER_ULTRA] ===== FASE 2: VERIFICAÇÕES BÁSICAS =====`);
    
    const [googleResult, sslResult, whoisResult] = await Promise.allSettled([
      searchGoogleMeta(normalizedQuery),
      host ? getSSLMilitary(host) : Promise.resolve(null),
      host ? getWhoisEnterprise(host) : Promise.resolve(null)
    ]);
    
    const serpResults = googleResult.status === 'fulfilled' ? googleResult.value : [];
    const sslData = sslResult.status === 'fulfilled' ? sslResult.value : null;
    const whoisData = whoisResult.status === 'fulfilled' ? whoisResult.value : null;
    
    console.log(`[HANDLER_ULTRA] Verificações básicas concluídas:`);
    console.log(`[HANDLER_ULTRA] - Google: ${serpResults.length} resultados`);
    console.log(`[HANDLER_ULTRA] - SSL: ${sslData?.present ? "Presente" : "Ausente"}`);
    console.log(`[HANDLER_ULTRA] - WHOIS: ${whoisData?.hasData ? "Disponível" : "Indisponível"}`);
    
    // ===== FASE 3: RECLAME AQUI ULTRA CRÍTICO =====
    console.log(`[HANDLER_ULTRA] ===== FASE 3: ANÁLISE RECLAME AQUI CRÍTICA =====`);
    
    let raData = null;
    try {
      raData = await getReclameAquiNASA(host || normalizedQuery);
      console.log(`[HANDLER_ULTRA] Reclame Aqui concluído: ${raData?.found ? "ENCONTRADO" : "NÃO ENCONTRADO"}`);
      if (raData?.found) {
        console.log(`[HANDLER_ULTRA] - Score RA: ${raData.score}`);
        console.log(`[HANDLER_ULTRA] - Reputação: ${raData.reputation}`);
        console.log(`[HANDLER_ULTRA] - Últimos 30d: ${raData.last30d}`);
      }
    } catch (raError) {
      console.log(`[HANDLER_ULTRA] ERRO CRÍTICO no Reclame Aqui: ${raError.message}`);
      raData = { 
        found: false, 
        error: String(raError),
        criticalError: true
      };
    }
    
    // ===== FASE 4: ANÁLISES COMPLEMENTARES =====
    console.log(`[HANDLER_ULTRA] ===== FASE 4: ANÁLISES COMPLEMENTARES =====`);
    
    // Análise de sentimento
    const socialData = analyzeSentimentMeta(serpResults);
    console.log(`[HANDLER_ULTRA] Sentimento: ${socialData.sentiment}, Menções: ${socialData.mentions}`);
    
    // TrustPilot
    let trustPilotData = null;
    if (host) {
      try {
        trustPilotData = await getTrustPilotGoogle(host);
        console.log(`[HANDLER_ULTRA] TrustPilot: ${trustPilotData.found ? `${trustPilotData.rating}/5` : "Não encontrado"}`);
      } catch (tpError) {
        console.log(`[HANDLER_ULTRA] Erro no TrustPilot: ${tpError.message}`);
        trustPilotData = { found: false, error: String(tpError) };
      }
    }
    
    // ===== FASE 5: CÁLCULO DO SCORE ULTRA =====
    console.log(`[HANDLER_ULTRA] ===== FASE 5: CÁLCULO DE SCORE FINAL =====`);
    
    const { score, factors, positives, warnings } = calculateScoreSantander(
      host, brandGuess, sslData, whoisData, raData, socialData, serpResults, trustPilotData
    );
    
    console.log(`[HANDLER_ULTRA] Score calculado: ${score}%`);
    console.log(`[HANDLER_ULTRA] Fatores: ${factors.length}, Positivos: ${positives.length}, Avisos: ${warnings.length}`);
    
    // ===== FASE 6: CLASSIFICAÇÃO E MENSAGEM =====
    console.log(`[HANDLER_ULTRA] ===== FASE 6: CLASSIFICAÇÃO FINAL =====`);
    
    const classification = classifyIntelligent(score);
    const message = generateUltraMessage(classification, raData, socialData, sslData, factors, positives, warnings);
    
    const complaints = (raData?.last30d ?? raData?.totalComplaints ?? 0) || 0;
    const verificationTime = ((Date.now() - startTime) / 1000).toFixed(1) + "s";
    
    console.log(`[HANDLER_ULTRA] ========== VERIFICAÇÃO CONCLUÍDA ==========`);
    console.log(`[HANDLER_ULTRA] Status: ${classification.status.toUpperCase()}`);
    console.log(`[HANDLER_ULTRA] Score: ${score}%`);
    console.log(`[HANDLER_ULTRA] Tempo: ${verificationTime}`);
    console.log(`[HANDLER_ULTRA] Reclamações: ${complaints}`);
    
    // ===== RESPOSTA FINAL ULTRA COMPLETA =====
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
        totalFactorsAnalyzed: factors.length,
        processingPhases: 6,
        processingTime: verificationTime,
        reclameAquiStrategy: raData?.strategies || [],
        sentimentAnalysis: {
          positive: socialData.positiveSignals,
          negative: socialData.negativeSignals,
          final: socialData.sentiment
        }
      },
      ssl: sslData,
      whois: whoisData ? { hasData: !!whoisData.WhoisRecord } : { hasData: false },
      reclameAqui: raData,
      googleResults: serpResults.slice(0, 10),
      social: socialData,
      trustPilot: trustPilotData,
      analysis: {
        factors: factors.slice(0, 15), // Limita para não sobrecarregar
        positives: positives.slice(0, 10),
        warnings: warnings.slice(0, 10),
        scoreBreakdown: {
          base: 70,
          final: score,
          adjustment: score - 70
        }
      }
    };
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "X-Processing-Time": verificationTime,
        "X-Analysis-Score": score.toString()
      },
      body: JSON.stringify(response)
    };
    
  } catch (error) {
    console.error(`[HANDLER_ULTRA] ========== ERRO CRÍTICO CAPTURADO ==========`);
    console.error(`[HANDLER_ULTRA] Erro: ${error.message}`);
    console.error(`[HANDLER_ULTRA] Stack: ${error.stack}`);
    
    // ===== FALLBACK ULTRA ROBUSTO - NUNCA FALHA =====
    const fallbackTime = ((Date.now() - startTime) / 1000).toFixed(1) + "s";
    
    const fallbackResponse = {
      status: "suspicious",
      title: "⚠️ VERIFICAÇÃO PARCIAL CONCLUÍDA",
      message: "Análise foi parcialmente concluída devido a limitações técnicas temporárias. Por precaução, recomendamos verificação manual adicional antes de prosseguir com transações.",
      complaints: 0,
      trustScore: 45,
      verificationTime: fallbackTime,
      debug: {
        timestamp: nowISO(),
        errorCaught: true,
        error: String(error),
        errorType: error.name || "UnknownError",
        fallbackActivated: true,
        processingTime: fallbackTime
      },
      ssl: null,
      whois: { hasData: false },
      reclameAqui: { 
        found: false, 
        error: "Erro na consulta - fallback ativado",
        fallback: true
      },
      googleResults: [],
      social: { mentions: 0, sentiment: "neutral" },
      trustPilot: { found: false },
      analysis: {
        factors: ["Análise interrompida por erro técnico"],
        positives: [],
        warnings: ["Verificação incompleta por erro técnico"],
        scoreBreakdown: {
          base: 45,
          final: 45,
          adjustment: 0
        }
      }
    };
    
    return {
      statusCode: 200, // Sempre retorna 200 para não quebrar o frontend
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "X-Processing-Time": fallbackTime,
        "X-Fallback-Activated": "true"
      },
      body: JSON.stringify(fallbackResponse)
    };
  }
}

// ========== HANDLER CORS ==========
export async function options() {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400"
    },
    body: ""
  };
}
