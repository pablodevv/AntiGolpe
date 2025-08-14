// netlify/functions/verificar.js
import tls from "tls";
import { parse } from "tldts";
import * as cheerio from "cheerio";

// ---------- Helpers ----------
function normalizeQuery(q) {
  return String(q || "").trim();
}

function extractHostFromQuery(raw) {
  const q = normalizeQuery(raw);

  // se veio URL completa
  try {
    if (q.startsWith("http://") || q.startsWith("https://")) {
      const u = new URL(q);
      return u.hostname;
    }
  } catch (_) {}

  // se parece domínio
  if (q.includes(".")) {
    try {
      const u = new URL("https://" + q.replace(/\s+/g, ""));
      return u.hostname;
    } catch (_) {}
  }

  // fallback: tratar como marca (sem host)
  return null;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJSON(url, opts = {}) {
  const resp = await fetch(url, opts);
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
  return resp.json();
}

async function fetchText(url, opts = {}) {
  const resp = await fetch(url, opts);
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
  return resp.text();
}

function nowISO() {
  return new Date().toISOString();
}

// SSL via socket TLS (pega o certificado apresentado pelo host)
async function getSSLCertificate(host) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      { host, port: 443, servername: host, rejectUnauthorized: false, timeout: 8000 },
      () => {
        try {
          const cert = socket.getPeerCertificate(true);
          socket.end();
          if (!cert || Object.keys(cert).length === 0) return resolve({ present: false });

          const validFrom = cert.valid_from ? new Date(cert.valid_from) : null;
          const validTo = cert.valid_to ? new Date(cert.valid_to) : null;
          const issuer = cert.issuer || {};
          const subject = cert.subject || {};

          const now = new Date();
          const validNow = validFrom && validTo && now >= validFrom && now <= validTo;

          resolve({
            present: true,
            validNow,
            validFrom: cert.valid_from || null,
            validTo: cert.valid_to || null,
            issuer,
            subject,
            subjectCN: subject.CN || null,
            altNames: cert.subjectaltname || null,
            raw: {
              issuer,
              subject,
              serialNumber: cert.serialNumber || null,
            },
          });
        } catch (e) {
          resolve({ present: false, error: String(e) });
        }
      }
    );
    socket.on("error", (err) => resolve({ present: false, error: String(err) }));
    socket.on("timeout", () => {
      try { socket.destroy(); } catch {}
      resolve({ present: false, error: "TLS timeout" });
    });
  });
}

// Google CSE ou SerpAPI (usa o que tiver configurado)
async function searchWebTop10(query) {
  const googleKey = process.env.GOOGLE_API_KEY;
  const googleCx = process.env.GOOGLE_CX;
  const serpKey = process.env.SERPAPI_KEY;

  if (googleKey && googleCx) {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      query
    )}&key=${googleKey}&cx=${googleCx}&num=10`;
    const data = await fetchJSON(url);
    const items = data.items || [];
    return items.map((r) => ({
      title: r.title,
      link: r.link,
      snippet: r.snippet || "",
      source: "google",
    }));
  }

  if (serpKey) {
    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(
      query
    )}&engine=google&num=10&api_key=${serpKey}`;
    const data = await fetchJSON(url);
    const items = (data.organic_results || []).slice(0, 10);
    return items.map((r) => ({
      title: r.title,
      link: r.link,
      snippet: r.snippet || "",
      source: "serpapi",
    }));
  }

  throw new Error(
    "Nenhuma fonte de busca configurada. Defina GOOGLE_API_KEY + GOOGLE_CX ou SERPAPI_KEY."
  );
}

// Heurísticas de TLD/domínio “suspeito”
function domainPenalty(host, brandGuess) {
  let penalty = 0;
  if (!host) return 0;

  const p = parse(host);
  const root = p.domain || host;
  const tld = p.publicSuffix || "";

  const SUS_TLDS = ["xyz", "top", "click", "shop", "link", "ru", "kim", "cn", "monster", "live"];
  if (SUS_TLDS.includes(tld)) penalty -= 15;

  if (brandGuess) {
    const b = brandGuess.toLowerCase();
    const h = root.toLowerCase();

    // marca muito “quebrada” no domínio (phishing comum)
    if (h.includes(b) === false) penalty -= 8;

    // hífens e palavras extras junto da marca
    const hyphenCount = (root.match(/-/g) || []).length;
    if (hyphenCount >= 2) penalty -= 6;

    // subdomínios longos tipo “pagamentos-seguro-123.oficial-...” podem ser suspeitos
    if ((p.subdomain || "").split(".").length >= 2) penalty -= 5;
  }

  return penalty;
}

// Classificador final baseado em score
function classify(score) {
  if (score >= 80) return { status: "safe", title: "✅ SITE TOTALMENTE SEGURO" };
  if (score >= 50) return { status: "suspicious", title: "⚠️ CUIDADO - SITE SUSPEITO" };
  return { status: "danger", title: "🚨 NÃO COMPRE AQUI - GOLPE POSSÍVEL" };
}

// Busca e “parse” básico do Reclame Aqui
async function getReclameAquiSnapshot(query) {
  // 1) buscar
  const buscaUrl = `https://www.reclameaqui.com.br/busca/?q=${encodeURIComponent(query)}`;
  const html = await fetchText(buscaUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
  const $ = cheerio.load(html);

  // tentar pegar o primeiro card de empresa
  let companyLink = null;

  $("a").each((_, a) => {
    const href = $(a).attr("href") || "";
    // páginas de empresa geralmente seguem /empresa/<slug>/
    if (/^\/empresa\/[^/]+\/?$/.test(href)) {
      companyLink = "https://www.reclameaqui.com.br" + href;
      return false;
    }
  });

  if (!companyLink) {
    return { found: false, score: null, totalComplaints: null, last30d: null, companyLink: null };
  }

  // 2) página da empresa
  const compHtml = await fetchText(companyLink, { headers: { "User-Agent": "Mozilla/5.0" } });
  const $$ = cheerio.load(compHtml);

  // OBS: o RA muda HTML com frequência. Pegamos valores aproximados.
  // Tentar alguns seletores comuns:
  let score = null;
  let totalComplaints = null;
  let last30d = null;

  // “Índice RA”/nota:
  score =
    ($$(".score .number").first().text().trim() ||
      $$("[data-testid='company-index'] .number").first().text().trim() ||
      null) || null;

  // Total de reclamações:
  totalComplaints =
    ($$("*:contains('Reclamações')")
      .filter((_, el) => $$(el).text().match(/Reclamações/i))
      .first()
      .text()
      .match(/(\d[\d\.\,]*)/g) || [null])[0];

  // Reclamações nos últimos 30 dias:
  last30d =
    ($$("*:contains('últimos 30 dias')")
      .first()
      .text()
      .match(/(\d[\d\.\,]*)/g) || [null])[0];

  const toNumber = (s) =>
    s ? Number(String(s).replace(/\./g, "").replace(",", ".").replace(/[^\d\.]/g, "")) : null;

  return {
    found: true,
    score: score ? toNumber(score) : null,
    totalComplaints: totalComplaints ? toNumber(totalComplaints) : null,
    last30d: last30d ? toNumber(last30d) : null,
    companyLink,
  };
}

// WHOIS via WhoisXML (opcional)
async function getWhois(host) {
  const key = process.env.WHOIS_API_KEY;
  if (!key || !host) return null;

  const url = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${key}&domainName=${encodeURIComponent(
    host
  )}&outputFormat=JSON`;

  try {
    const data = await fetchJSON(url);
    return data;
  } catch (e) {
    return null;
  }
}

// Analisa os top 10 resultados procurando sinais de “golpe”
function analyzeSerpSignals(results, brandOrHost) {
  let negHits = 0;
  let posHits = 0;

  const NEG_WORDS = [
    "golpe",
    "fraude",
    "scam",
    "phishing",
    "cartão clonado",
    "não entrega",
    "reclame aqui",
  ];
  const POS_WORDS = ["site oficial", "oficial", "contato", "sobre", "linkedin", "instagram"];

  for (const r of results) {
    const text = `${r.title} ${r.snippet} ${r.link}`.toLowerCase();

    NEG_WORDS.forEach((w) => {
      if (text.includes(w)) negHits++;
    });
    POS_WORDS.forEach((w) => {
      if (text.includes(w)) posHits++;
    });
  }

  // oficial em #1 é um bom sinal
  const first = results[0];
  if (first) {
    const t = `${first.title} ${first.link}`.toLowerCase();
    if (t.includes("oficial") || (brandOrHost && t.includes(brandOrHost.toLowerCase()))) {
      posHits += 2;
    }
  }

  return { negHits, posHits };
}

// ---------- Handler ----------
export async function handler(event) {
  const t0 = Date.now();
  try {
    const { query } = JSON.parse(event.body || "{}");
    const q = normalizeQuery(query);
    if (!q) {
      return { statusCode: 400, body: JSON.stringify({ error: "Envie 'query'" }) };
    }

    const host = extractHostFromQuery(q);
    const brandGuess = host
      ? (parse(host).domainWithoutSuffix || host.split(".")[0] || q).toLowerCase()
      : q.split(/\s+/)[0].toLowerCase();

    // 1) SERP
    const serp = await searchWebTop10(q);

    // 2) SSL (se tiver host)
    let sslInfo = null;
    if (host) {
      sslInfo = await getSSLCertificate(host);
    }

    // 3) WHOIS (opcional)
    const whois = host ? await getWhois(host) : null;

    // 4) Reclame Aqui
    let ra = null;
    try {
      ra = await getReclameAquiSnapshot(host || q);
    } catch (e) {
      ra = { error: String(e), found: false };
    }

    // 5) Score heuristic
    let score = 90;

    // SSL
    if (host) {
      if (!sslInfo?.present) score -= 40;
      else if (sslInfo.present && !sslInfo.validNow) score -= 25;
    }

    // domínio/TLD
    score += domainPenalty(host, brandGuess);

    // WHOIS: domínio muito novo?
    try {
      const created =
        whois?.WhoisRecord?.registryData?.createdDate ||
        whois?.WhoisRecord?.createdDateNormalized ||
        whois?.WhoisRecord?.createdDate;

      if (created) {
        const createdAt = new Date(created);
        const ageDays = Math.max(0, (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
        if (ageDays < 30) score -= 25;
        else if (ageDays < 90) score -= 15;
      }
    } catch (_) {}

    // SERP sinais
    const serpSignals = analyzeSerpSignals(serp, brandGuess);
    score += serpSignals.posHits * 2;
    score -= serpSignals.negHits * 4;

    // Reclame Aqui (se achou empresa)
    if (ra?.found) {
      if (ra.score != null) {
        if (ra.score < 6) score -= 20;
        else if (ra.score < 8) score -= 10;
        else score += 5;
      }
      if (ra.last30d != null) {
        if (ra.last30d > 100) score -= 30;
        else if (ra.last30d > 30) score -= 15;
        else if (ra.last30d > 5) score -= 5;
      }
    }

    // clamp
    score = Math.max(0, Math.min(100, Math.round(score)));

    const cls = classify(score);

    // Mensagem final
    let message = "Nenhum problema grave detectado.";
    if (cls.status === "suspicious") {
      message =
        "Encontramos sinais mistos (reclamações recentes, menções negativas ou SSL/WHOIS pouco confiáveis). Recomendamos cautela.";
    } else if (cls.status === "danger") {
      message =
        "Vários sinais de alerta (reclamações/menções de golpe, domínio novo/suspeito ou SSL inválido). Evite comprar até verificar diretamente com a marca.";
    }

    const complaints =
      (ra?.last30d != null ? ra.last30d : ra?.totalComplaints != null ? ra.totalComplaints : 0) ||
      0;

    const verificationTime = ((Date.now() - t0) / 1000).toFixed(1) + "s";

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: cls.status,
        title: cls.title,
        message,
        complaints,
        trustScore: score,
        verificationTime,
        debug: {
          at: nowISO(),
          brandGuess,
          host,
          serpSignals,
        },
        ssl: sslInfo,
        whois: whois ? { hasData: true } : { hasData: false },
        reclameAqui: ra,
        googleResults: serp,
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro interno", detail: String(err) }),
    };
  }
}
