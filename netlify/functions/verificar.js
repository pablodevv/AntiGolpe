// netlify/functions/verificar.js
import tls from "tls";
import { parse } from "tldts";
import * as cheerio from "cheerio";

// ---------- Helpers ----------
function normalizeQuery(q) { return String(q || "").trim(); }

function extractHostFromQuery(raw) {
  const q = normalizeQuery(raw);
  try { if(q.startsWith("http://") || q.startsWith("https://")) return new URL(q).hostname; } catch {}
  if(q.includes(".")) {
    try { return new URL("https://" + q.replace(/\s+/g, "")).hostname; } catch {}
  }
  return null;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchJSON(url, opts = {}, retries = 3) {
  for(let i=0;i<=retries;i++){
    try{
      const resp = await fetch(url, opts);
      if(!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
      return await resp.json();
    }catch(e){
      if(i===retries) throw e;
      await sleep(500 + Math.random()*500);
    }
  }
}

async function fetchText(url, opts = {}, retries = 3){
  for(let i=0;i<=retries;i++){
    try{
      const resp = await fetch(url, opts);
      if(!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
      return await resp.text();
    }catch(e){
      if(i===retries) throw e;
      await sleep(500 + Math.random()*500);
    }
  }
}

function nowISO(){ return new Date().toISOString(); }

// ---------- SSL / TLS ----------
async function getSSLCertificate(host){
  return new Promise(resolve=>{
    const socket = tls.connect({ host, port:443, servername:host, rejectUnauthorized:false, timeout:8000 },
      ()=>{ try{
        const cert = socket.getPeerCertificate(true);
        socket.end();
        if(!cert || Object.keys(cert).length===0) return resolve({present:false});
        const validFrom = cert.valid_from ? new Date(cert.valid_from) : null;
        const validTo = cert.valid_to ? new Date(cert.valid_to) : null;
        const now = new Date();
        const validNow = validFrom && validTo && now >= validFrom && now <= validTo;
        resolve({
          present:true,
          validNow,
          validFrom: cert.valid_from||null,
          validTo: cert.valid_to||null,
          issuer: cert.issuer||{},
          subject: cert.subject||{},
          subjectCN: cert.subject?.CN||null,
          altNames: cert.subjectaltname||null,
          raw: cert
        });
      }catch(e){ resolve({present:false,error:String(e)}); } }
    );
    socket.on("error", err=>resolve({present:false,error:String(err)}));
    socket.on("timeout", ()=>{ try{ socket.destroy(); }catch{} resolve({present:false,error:"TLS timeout"}); });
  });
}

// ---------- Google Top10 + análise conteúdo ----------
async function searchWebTop10(query){
  const googleKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;
  if(!googleKey || !cx) throw new Error("Defina GOOGLE_API_KEY + GOOGLE_CX");
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${googleKey}&cx=${cx}&num=10`;
  const data = await fetchJSON(url);
  const items = data.items || [];
  const results = [];
  for(const r of items){
    const obj = { title: r.title, link: r.link, snippet: r.snippet||"", source:"google" };
    // Tenta buscar conteúdo da página para análise extra
    try{
      const html = await fetchText(r.link,{headers:{"User-Agent":"Mozilla/5.0"}});
      const $ = cheerio.load(html);
      obj.pageText = $("body").text().replace(/\s+/g," ").trim().substring(0,5000); // primeiros 5k chars
      obj.hasForms = $("form").length>0;
      obj.hasLogin = $("input[type=password]").length>0;
    }catch(e){
      obj.pageError = String(e);
    }
    results.push(obj);
  }
  return results;
}

// ---------- Reclame Aqui ----------
async function getReclameAquiSnapshot(query){
  const q = query.toLowerCase().replace(/\s+/g,"-");
  // tenta buscar empresa por slug direto
  const directLink = `https://www.reclameaqui.com.br/empresa/${q}/`;
  try{
    const html = await fetchText(directLink,{headers:{"User-Agent":"Mozilla/5.0"}});
    const $ = cheerio.load(html);
    const score = ($$(".score .number").first().text().trim()||null)||null;
    const totalComplaints = ($$("*:contains('Reclamações')").first().text().match(/(\d[\d\.\,]*)/g)||[null])[0];
    const last30d = ($$("*:contains('últimos 30 dias')").first().text().match(/(\d[\d\.\,]*)/g)||[null])[0];
    const toNumber = s=>s?Number(String(s).replace(/\./g,"").replace(",", ".")):null;
    return {found:true, score:toNumber(score), totalComplaints:toNumber(totalComplaints), last30d:toNumber(last30d), companyLink:directLink};
  }catch(e){
    // fallback: busca por nome genérico
    try{
      const buscaUrl = `https://www.reclameaqui.com.br/busca/?q=${encodeURIComponent(query)}`;
      const html = await fetchText(buscaUrl,{headers:{"User-Agent":"Mozilla/5.0"}});
      const $ = cheerio.load(html);
      let companyLink = null;
      $("a").each((_,a)=>{const href=$(a).attr("href")||""; if(/^\/empresa\/[^/]+\/?$/.test(href)){ companyLink="https://www.reclameaqui.com.br"+href; return false; }});
      if(!companyLink) return {found:false, score:null, totalComplaints:null, last30d:null, companyLink:null};
      const compHtml = await fetchText(companyLink,{headers:{"User-Agent":"Mozilla/5.0"}});
      const $$ = cheerio.load(compHtml);
      const score = ($$(".score .number").first().text().trim()||null)||null;
      const totalComplaints = ($$("*:contains('Reclamações')").first().text().match(/(\d[\d\.\,]*)/g)||[null])[0];
      const last30d = ($$("*:contains('últimos 30 dias')").first().text().match(/(\d[\d\.\,]*)/g)||[null])[0];
      const toNumber = s=>s?Number(String(s).replace(/\./g,"").replace(",", ".")):null;
      return {found:true, score:toNumber(score), totalComplaints:toNumber(totalComplaints), last30d:toNumber(last30d), companyLink};
    }catch(e2){ return {found:false,error:String(e2)}; }
  }
}

// ---------- WHOIS ----------
async function getWhois(host){
  const key = process.env.WHOIS_API_KEY;
  if(!key||!host) return null;
  const url = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${key}&domainName=${encodeURIComponent(host)}&outputFormat=JSON`;
  try{return await fetchJSON(url);}catch{return null;}
}

// ---------- Heurísticas avançadas ----------
function domainPenalty(host,brandGuess){
  let penalty=0;
  if(!host) return 0;
  const p=parse(host);
  const root=p.domain||host;
  const tld=p.publicSuffix||"";
  const SUS_TLDS=["xyz","top","click","shop","link","ru","kim","cn","monster","live"];
  if(SUS_TLDS.includes(tld)) penalty-=15;
  if(brandGuess){
    const b=brandGuess.toLowerCase();
    const h=root.toLowerCase();
    if(!h.includes(b)) penalty-=8;
    const hyphenCount=(root.match(/-/g)||[]).length;
    if(hyphenCount>=2) penalty-=6;
    if((p.subdomain||"").split(".").length>=2) penalty-=5;
  }
  return penalty;
}

function classify(score){
  if(score>=80) return {status:"safe", title:"✅ SITE TOTALMENTE SEGURO"};
  if(score>=50) return {status:"suspicious", title:"⚠️ CUIDADO - SITE SUSPEITO"};
  return {status:"danger", title:"🚨 NÃO COMPRE AQUI - GOLPE POSSÍVEL"};
}

// ---------- SERP Signals ----------
function analyzeSerpSignals(results,brandOrHost){
  let negHits=0,posHits=0;
  const NEG_WORDS=["golpe","fraude","scam","phishing","cartão clonado","não entrega","reclame aqui"];
  const POS_WORDS=["site oficial","oficial","contato","sobre","linkedin","instagram"];
  for(const r of results){
    const text=`${r.title} ${r.snippet} ${r.link} ${r.pageText||""}`.toLowerCase();
    NEG_WORDS.forEach(w=>{if(text.includes(w))negHits++;});
    POS_WORDS.forEach(w=>{if(text.includes(w))posHits++;});
  }
  const first=results[0];
  if(first){const t=`${first.title} ${first.link}`.toLowerCase(); if(t.includes("oficial")||(brandOrHost&&t.includes(brandOrHost.toLowerCase()))) posHits+=2;}
  return {negHits,posHits};
}

// ---------- Handler ----------
export async function handler(event){
  const t0=Date.now();
  try{
    const { query }=JSON.parse(event.body||"{}");
    const q = normalizeQuery(query);
    if(!q) return {statusCode:400,body:JSON.stringify({error:"Envie 'query'"})};
    const host=extractHostFromQuery(q);
    const brandGuess=host ? (parse(host).domainWithoutSuffix||host.split(".")[0]||q).toLowerCase() : q.split(/\s+/)[0].toLowerCase();

    const serp = await searchWebTop10(q);
    const sslInfo = host?await getSSLCertificate(host):null;
    const whois = host?await getWhois(host):null;
    let ra = null; try{ra=await getReclameAquiSnapshot(host||q);}catch(e){ra={error:String(e),found:false};}

    let score=90;
    if(host){if(!sslInfo?.present) score-=40; else if(sslInfo.present&&!sslInfo.validNow) score-=25;}
    score += domainPenalty(host,brandGuess);

    try{
      const created = whois?.WhoisRecord?.registryData?.createdDate||whois?.WhoisRecord?.createdDateNormalized||whois?.WhoisRecord?.createdDate;
      if(created){
        const ageDays=Math.max(0,(Date.now()-new Date(created).getTime())/(1000*60*60*24));
        if(ageDays<30) score-=25; else if(ageDays<90) score-=15;
      }
    }catch{}

    const serpSignals=analyzeSerpSignals(serp,brandGuess);
    score+=serpSignals.posHits*2;
    score-=serpSignals.negHits*4;

    if(ra?.found){
      if(ra.score!=null){if(ra.score<6) score-=20; else if(ra.score<8) score-=10; else score+=5;}
      if(ra.last30d!=null){if(ra.last30d>100) score-=30; else if(ra.last30d>30) score-=15; else if(ra.last30d>5) score-=5;}
    }

    score=Math.max(0,Math.min(100,Math.round(score)));
    const cls=classify(score);

    let message="Nenhum problema grave detectado.";
    if(cls.status==="suspicious") message="Encontramos sinais mistos (reclamações recentes, menções negativas ou SSL/WHOIS pouco confiáveis). Recomendamos cautela.";
    else if(cls.status==="danger") message="Vários sinais de alerta (reclamações/menções de golpe, domínio novo/suspeito ou SSL inválido). Evite comprar até verificar diretamente com a marca.";

    const complaints=(ra?.last30d??ra?.totalComplaints??0)||0;
    const verificationTime=((Date.now()-t0)/1000).toFixed(1)+"s";

    return {statusCode:200,body:JSON.stringify({
      status:cls.status,
      title:cls.title,
      message,
      complaints,
      trustScore:score,
      verificationTime,
      debug:{at:nowISO(),brandGuess,host,serpSignals},
      ssl:sslInfo,
      whois:whois?{hasData:true}:{hasData:false},
      reclameAqui:ra,
      googleResults:serp
    })};
  }catch(err){
    console.error(err);
    return {statusCode:500,body:JSON.stringify({error:"Erro interno",detail:String(err)})};
  }
}
// ---------- Reclame Aqui Avançado com fallback ----------
async function getReclameAquiAdvanced(query){
  const slugGuess = query.toLowerCase().replace(/\s+/g,"-");
  const linksToTry = [
    `https://www.reclameaqui.com.br/empresa/${slugGuess}/`,
    `https://www.reclameaqui.com.br/busca/?q=${encodeURIComponent(query)}`
  ];

  for(const url of linksToTry){
    try{
      const html = await fetchText(url,{headers:{"User-Agent":"Mozilla/5.0"}});
      const $ = cheerio.load(html);

      // Detecta se é página de empresa
      let companyLink = null;
      if(url.includes("/busca/")){
        $("a").each((_,a)=>{const href=$(a).attr("href")||""; if(/^\/empresa\/[^/]+\/?$/.test(href)){ companyLink="https://www.reclameaqui.com.br"+href; return false; }});
        if(!companyLink) continue;
        const compHtml = await fetchText(companyLink,{headers:{"User-Agent":"Mozilla/5.0"}});
        return parseRAHtml(compHtml, companyLink);
      } else {
        return parseRAHtml(html,url);
      }
    }catch(e){ continue; }
  }
  return {found:false, score:null, totalComplaints:null, last30d:null, companyLink:null};
}

function parseRAHtml(html, companyLink){
  const $ = cheerio.load(html);
  const score = ($$(".score .number").first().text().trim()||null)||null;
  const totalComplaints = ($$("*:contains('Reclamações')").first().text().match(/(\d[\d\.\,]*)/g)||[null])[0];
  const last30d = ($$("*:contains('últimos 30 dias')").first().text().match(/(\d[\d\.\,]*)/g)||[null])[0];
  const toNumber = s=>s?Number(String(s).replace(/\./g,"").replace(",", ".")):null;
  return {found:true, score:toNumber(score), totalComplaints:toNumber(totalComplaints), last30d:toNumber(last30d), companyLink};
}

// ---------- Redes Sociais / Menções externas ----------
async function analyzeSocialMedia(results){
  const socialSummary = {instagram:null, twitter:null, reddit:null, mentions:0};
  for(const r of results){
    if(!r.externalMentions) continue;
    r.externalMentions.forEach(link=>{
      if(link.includes("instagram.com")&&!socialSummary.instagram) socialSummary.instagram = link;
      if(link.includes("twitter.com")&&!socialSummary.twitter) socialSummary.twitter = link;
      if(link.includes("reddit.com")&&!socialSummary.reddit) socialSummary.reddit = link;
      socialSummary.mentions++;
    });
  }
  return socialSummary;
}

// ---------- Handler Avançado ----------
export async function handler(event){
  const t0=Date.now();
  try{
    const { query }=JSON.parse(event.body||"{}");
    const q=normalizeQuery(query);
    if(!q) return {statusCode:400, body:JSON.stringify({error:"Envie 'query'"})};

    const host=extractHostFromQuery(q);
    const brandGuess=host ? (parse(host).domainWithoutSuffix||host.split(".")[0]||q).toLowerCase() : q.split(/\s+/)[0].toLowerCase();

    // Google + conteúdo
    const serp=await searchWebTop10(q);

    // SSL
    const sslInfo=host?await getSSLCertificate(host):null;

    // WHOIS
    const whois=host?await getWhois(host):null;

    // Reclame Aqui avançado
    let ra=null;
    try{ ra=await getReclameAquiAdvanced(host||q); }catch(e){ ra={error:String(e),found:false}; }

    // Redes sociais e menções externas
    const social=await analyzeSocialMedia(serp);

    // Score inicial
    let score=90;
    if(host){if(!sslInfo?.present) score-=40; else if(sslInfo.present&&!sslInfo.validNow) score-=25;}
    score += domainPenalty(host,brandGuess);

    // WHOIS idade domínio
    try{
      const created=whois?.WhoisRecord?.registryData?.createdDate||whois?.WhoisRecord?.createdDateNormalized||whois?.WhoisRecord?.createdDate;
      if(created){
        const ageDays=Math.max(0,(Date.now()-new Date(created).getTime())/(1000*60*60*24));
        if(ageDays<30) score-=25; else if(ageDays<90) score-=15;
      }
    }catch{}

    // SERP signals
    const serpSignals=analyzeSerpSignals(serp,brandGuess);
    score+=serpSignals.posHits*2;
    score-=serpSignals.negHits*4;

    // Reclame Aqui
    if(ra?.found){
      if(ra.score!=null){if(ra.score<6) score-=20; else if(ra.score<8) score-=10; else score+=5;}
      if(ra.last30d!=null){if(ra.last30d>100) score-=30; else if(ra.last30d>30) score-=15; else if(ra.last30d>5) score-=5;}
    }

    // Redes sociais
    if(social.mentions>5) score+=5; // presença social é positiva
    if(social.reddit) score-=social.mentions; // menções negativas no Reddit podem diminuir

    score=Math.max(0,Math.min(100,Math.round(score)));
    const cls=classify(score);

    let message="Nenhum problema grave detectado.";
    if(cls.status==="suspicious") message="Encontramos sinais mistos (reclamações recentes, menções negativas ou SSL/WHOIS pouco confiáveis). Recomendamos cautela.";
    else if(cls.status==="danger") message="Vários sinais de alerta (reclamações/menções de golpe, domínio novo/suspeito ou SSL inválido). Evite comprar até verificar diretamente com a marca.";

    const complaints=(ra?.last30d??ra?.totalComplaints??0)||0;
    const verificationTime=((Date.now()-t0)/1000).toFixed(1)+"s";

    return {statusCode:200, body:JSON.stringify({
      status:cls.status,
      title:cls.title,
      message,
      complaints,
      trustScore:score,
      verificationTime,
      debug:{at:nowISO(),brandGuess,host,serpSignals,social},
      ssl:sslInfo,
      whois:whois?{hasData:true}:{hasData:false},
      reclameAqui:ra,
      googleResults:serp,
      social
    })};

  }catch(err){
    console.error(err);
    return {statusCode:500, body:JSON.stringify({error:"Erro interno", detail:String(err)})};
  }
}
