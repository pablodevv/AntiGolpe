// netlify/functions/verificar-ultra.js
import tls from "tls";
import { parse } from "tldts";
import * as cheerio from "cheerio";

// ---------- Helpers ----------
function normalizeQuery(q){ return String(q||"").trim(); }
function extractHostFromQuery(raw){
  const q = normalizeQuery(raw);
  try { if(q.startsWith("http://")||q.startsWith("https://")) return new URL(q).hostname; } catch{}
  if(q.includes(".")) { try{ return new URL("https://"+q.replace(/\s+/g,"")).hostname; } catch{} }
  return null;
}
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
function nowISO(){ return new Date().toISOString(); }

async function fetchJSON(url, opts={}, retries=3){
  for(let i=0;i<=retries;i++){
    try{ const resp = await fetch(url, opts); if(!resp.ok) throw new Error(`HTTP ${resp.status}`); return await resp.json(); }
    catch(e){ if(i===retries) throw e; await sleep(500+Math.random()*500); }
  }
}
async function fetchText(url, opts={}, retries=3){
  for(let i=0;i<=retries;i++){
    try{ const resp = await fetch(url, opts); if(!resp.ok) throw new Error(`HTTP ${resp.status}`); return await resp.text(); }
    catch(e){ if(i===retries) throw e; await sleep(500+Math.random()*500); }
  }
}

// ---------- WHOIS ----------
async function getWhois(host){
  const key = process.env.WHOIS_API_KEY;
  if(!key||!host) return null;
  const url = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${key}&domainName=${encodeURIComponent(host)}&outputFormat=JSON`;
  try{
    const data = await fetchJSON(url);
    return data;
  }catch(e){
    console.log("WHOIS error:", e);
    return null;
  }
}

// ---------- SSL / TLS ----------
async function getSSLCertificate(host){
  return new Promise(resolve=>{
    const socket = tls.connect({host,port:443,servername:host,rejectUnauthorized:false,timeout:8000},()=>{
      try{
        const cert=socket.getPeerCertificate(true);
        socket.end();
        if(!cert||Object.keys(cert).length===0) return resolve({present:false});
        const validFrom = cert.valid_from ? new Date(cert.valid_from) : null;
        const validTo = cert.valid_to ? new Date(cert.valid_to) : null;
        const now = new Date();
        const validNow = validFrom && validTo && now>=validFrom && now<=validTo;
        resolve({
          present:true,
          validNow,
          validFrom:cert.valid_from||null,
          validTo:cert.valid_to||null,
          issuer:cert.issuer||{},
          subject:cert.subject||{},
          subjectCN:cert.subject?.CN||null,
          altNames:cert.subjectaltname||null,
          raw:cert
        });
      }catch(e){ resolve({present:false,error:String(e)}); }
    });
    socket.on("error",err=>resolve({present:false,error:String(err)}));
    socket.on("timeout",()=>{ try{socket.destroy();}catch{} resolve({present:false,error:"TLS timeout"}); });
  });
}

// ---------- Google Top10 + conteúdo ----------
async function searchWebTop10(query){
  const googleKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;
  if(!googleKey||!cx) throw new Error("Defina GOOGLE_API_KEY + GOOGLE_CX");
  const url=`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${googleKey}&cx=${cx}&num=10`;
  const data=await fetchJSON(url);
  const items=data.items||[];
  const results=[];
  for(const r of items){
    const obj={title:r.title,link:r.link,snippet:r.snippet||"",source:"google"};
    try{
      const html=await fetchText(r.link,{headers:{"User-Agent":"Mozilla/5.0"}});
      const $=cheerio.load(html);
      obj.pageText=$("body").text().replace(/\s+/g," ").trim().substring(0,5000);
      obj.hasForms=$("form").length>0;
      obj.hasLogin=$("input[type=password]").length>0;
      obj.externalMentions=[];
      $("a[href]").each((_,a)=>{
        const href=$(a).attr("href");
        if(href && (href.includes("instagram.com")||href.includes("twitter.com")||href.includes("reddit.com")||href.includes("linkedin.com")))
          obj.externalMentions.push(href);
      });
    }catch(e){ obj.pageError=String(e); }
    results.push(obj);
  }
  return results;
}

// ---------- Busca inteligente de domínio ----------
async function findDomainFromBrand(brandName){
  try{
    const searchQuery = `${brandName} site oficial`;
    const googleKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CX;
    if(!googleKey||!cx) return null;
    
    const url=`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(searchQuery)}&key=${googleKey}&cx=${cx}&num=5`;
    const data=await fetchJSON(url);
    const items=data.items||[];
    
    for(const item of items){
      try{
        const domain = new URL(item.link).hostname;
        const brandLower = brandName.toLowerCase().replace(/\s+/g,"");
        const domainLower = domain.toLowerCase();
        
        // Verifica se o domínio contém a marca
        if(domainLower.includes(brandLower) || item.title.toLowerCase().includes("oficial")){
          return domain;
        }
      }catch{}
    }
    return null;
  }catch{
    return null;
  }
}

// ---------- Reclame Aqui ULTRA avançado ----------
async function getReclameAquiUltraAdvanced(query){
  const variations = [
    query.toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]/g,""),
    query.toLowerCase().replace(/\s+/g,"").replace(/[^\w]/g,""),
    query.toLowerCase().replace(/[^\w\s]/g,"").replace(/\s+/g,"-"),
    query.toLowerCase()
  ];
  
  // Tenta múltiplas variações do slug
  for(const slug of variations){
    const directUrl = `https://www.reclameaqui.com.br/empresa/${slug}/`;
    try{
      const html = await fetchText(directUrl,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}});
      const result = parseRAHtmlUltra(html, directUrl);
      if(result.found) return result;
    }catch{}
  }
  
  // Busca por nome
  const searchUrls = [
    `https://www.reclameaqui.com.br/busca/?q=${encodeURIComponent(query)}`,
    `https://www.reclameaqui.com.br/busca/?q=${encodeURIComponent(query + " empresa")}`,
    `https://www.reclameaqui.com.br/busca/?q=${encodeURIComponent(query.split(" ")[0])}`
  ];
  
  for(const searchUrl of searchUrls){
    try{
      const html = await fetchText(searchUrl,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}});
      const $ = cheerio.load(html);
      
      let companyLink = null;
      $("a[href*='/empresa/']").each((_,a)=>{
        const href=$(a).attr("href")||"";
        if(/^\/empresa\/[^/]+\/?$/.test(href)){ 
          companyLink="https://www.reclameaqui.com.br"+href; 
          return false; 
        }
      });
      
      if(companyLink){
        const compHtml = await fetchText(companyLink,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}});
        const result = parseRAHtmlUltra(compHtml, companyLink);
        if(result.found) return result;
      }
    }catch{}
  }
  
  return {found:false,score:null,totalComplaints:null,last30d:null,companyLink:null,verified:false,reputation:null,responseRate:null};
}

function parseRAHtmlUltra(html, companyLink){
  const $ = cheerio.load(html);
  const bodyText = $("body").text();
  
  // Score com múltiplos seletores
  let score = null;
  const scoreSelectors = [
    ".score .number", "[data-testid='company-score']", ".company-score",
    "*[class*='score'] *[class*='number']", ".rating-score", ".company-rating"
  ];
  
  for(const selector of scoreSelectors){
    const scoreText = $(selector).first().text().trim();
    if(scoreText && /^\d+(\.\d+)?$/.test(scoreText)){
      score = scoreText;
      break;
    }
  }
  
  // Reclamações com regex robusta
  const complaintsMatch = bodyText.match(/(\d{1,3}(?:\.\d{3})*)\s*reclamações?/i);
  const last30dMatch = bodyText.match(/(\d{1,3}(?:\.\d{3})*)\s*nos?\s*últimos?\s*30\s*dias?/i);
  
  // Verificação se é empresa verificada
  const verified = bodyText.includes("Selo RA Verificada") || bodyText.includes("empresa verificada");
  
  // Reputação
  let reputation = null;
  if(bodyText.includes("Não recomendada")) reputation = "Não recomendada";
  else if(bodyText.includes("Regular")) reputation = "Regular";
  else if(bodyText.includes("Boa")) reputation = "Boa";
  else if(bodyText.includes("Ótima")) reputation = "Ótima";
  
  // Taxa de resposta
  const responseMatch = bodyText.match(/Respondeu\s+(\d+)%/i);
  const responseRate = responseMatch ? parseInt(responseMatch[1]) : null;
  
  const toNumber = s => s ? Number(String(s).replace(/\./g,"").replace(",", ".")) : null;
  
  return {
    found: true,
    score: toNumber(score),
    totalComplaints: complaintsMatch ? toNumber(complaintsMatch[1]) : null,
    last30d: last30dMatch ? toNumber(last30dMatch[1]) : null,
    companyLink,
    verified,
    reputation,
    responseRate
  };
}

// ---------- Redes sociais avançado ----------
async function analyzeSocialMediaUltra(results){
  const socialSummary={instagram:null,twitter:null,reddit:null,linkedin:null,mentions:0,sentiment:"neutral"};
  let positiveSignals = 0;
  let negativeSignals = 0;
  
  for(const r of results){
    if(!r.externalMentions) continue;
    r.externalMentions.forEach(link=>{
      if(link.includes("instagram.com")&&!socialSummary.instagram) socialSummary.instagram=link;
      if(link.includes("twitter.com")&&!socialSummary.twitter) socialSummary.twitter=link;
      if(link.includes("reddit.com")&&!socialSummary.reddit) socialSummary.reddit=link;
      if(link.includes("linkedin.com")&&!socialSummary.linkedin) socialSummary.linkedin=link;
      socialSummary.mentions++;
    });
    
    // Análise de sentimento básica
    const text = `${r.title} ${r.snippet} ${r.pageText||""}`.toLowerCase();
    const positiveWords = ["bom","ótimo","excelente","recomendo","confiável","seguro","oficial"];
    const negativeWords = ["golpe","fraude","ruim","péssimo","não recomendo","cuidado","suspeito","problema"];
    
    positiveWords.forEach(word=>{if(text.includes(word))positiveSignals++;});
    negativeWords.forEach(word=>{if(text.includes(word))negativeSignals++;});
  }
  
  if(positiveSignals > negativeSignals) socialSummary.sentiment = "positive";
  else if(negativeSignals > positiveSignals) socialSummary.sentiment = "negative";
  
  return socialSummary;
}

// ---------- Heurísticas ----------
function domainPenalty(host,brandGuess){
  let penalty=0;
  if(!host) return 0;
  const p=parse(host);
  const root=p.domain||host;
  const tld=p.publicSuffix||"";
  const SUS_TLDS=["xyz","top","click","shop","link","ru","kim","cn","monster","live","tk","ml","ga","cf"];
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
  if(score>=80) return {status:"safe",title:"✅ SITE TOTALMENTE SEGURO"};
  if(score>=50) return {status:"suspicious",title:"⚠️ CUIDADO - SITE SUSPEITO"};
  return {status:"danger",title:"🚨 NÃO COMPRE AQUI - GOLPE POSSÍVEL"};
}

function analyzeSerpSignalsUltra(results,brandOrHost){
  let negHits=0,posHits=0;
  const NEG_WORDS=["golpe","fraude","scam","phishing","cartão clonado","não entrega","reclame aqui","não recomendo","cuidado","suspeito","problema","ruim","péssimo"];
  const POS_WORDS=["site oficial","oficial","contato","sobre","linkedin","instagram","confiável","recomendo","bom","ótimo","excelente","seguro"];
  
  for(const r of results){
    const text=`${r.title} ${r.snippet} ${r.link} ${r.pageText||""}`.toLowerCase();
    NEG_WORDS.forEach(w=>{if(text.includes(w))negHits++;});
    POS_WORDS.forEach(w=>{if(text.includes(w))posHits++;});
  }
  
  const first=results[0];
  if(first){
    const t=`${first.title} ${first.link}`.toLowerCase(); 
    if(t.includes("oficial")||(brandOrHost&&t.includes(brandOrHost.toLowerCase()))) posHits+=3;
  }
  
  return {negHits,posHits};
}

// ---------- TrustPilot / Reviews externas ----------
async function fetchTrustPilotReviews(domain){
  const url = `https://www.trustpilot.com/review/${domain}`;
  try{
    const html = await fetchText(url,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}});
    const $ = cheerio.load(html);
    
    // Múltiplos seletores para rating
    let rating = null;
    const ratingSelectors = [
      "[data-rating]", "*[class*='rating']", "*[class*='score']", ".star-rating"
    ];
    
    for(const selector of ratingSelectors){
      const elem = $(selector).first();
      const ratingText = elem.attr("data-rating") || elem.text().trim();
      const ratingNum = parseFloat(ratingText);
      if(!isNaN(ratingNum) && ratingNum >= 1 && ratingNum <= 5){
        rating = ratingNum;
        break;
      }
    }
    
    // Busca contagem de reviews
    const bodyText = $("body").text();
    const reviewMatch = bodyText.match(/(\d{1,3}(?:[,\.]\d{3})*)\s*reviews?/i);
    const reviewCount = reviewMatch ? parseInt(reviewMatch[1].replace(/[,\.]/g,"")) : null;
    
    return {found:!!rating,rating,reviewCount,url};
  }catch(e){
    console.log("TrustPilot error:", e);
    return {found:false,rating:null,reviewCount:null,url};
  }
}

// ---------- Extra heurísticas ULTRA ----------
function applyExtraHeuristicsUltra(score,sslInfo,whois,ra,social,trustPilot){
  let extraScore=score;
  
  // Penalidade TLD suspeito
  if(sslInfo?.subjectCN?.match(/\.(xyz|top|click|tk|ml|ga|cf)$/)) extraScore-=10;
  
  // Penalidade social negativa
  if(social.sentiment === "negative") extraScore-=15;
  else if(social.sentiment === "positive") extraScore+=10;
  
  if(social.reddit && social.mentions>0) extraScore-=Math.min(social.mentions*2,10);
  
  // WHOIS idade domínio
  try{
    const created=whois?.WhoisRecord?.registryData?.createdDate || 
                  whois?.WhoisRecord?.createdDateNormalized || 
                  whois?.WhoisRecord?.createdDate;
    if(created){
      const ageDays=Math.max(0,(Date.now()-new Date(created).getTime())/(1000*60*60*24));
      if(ageDays<15) extraScore-=25;
      else if(ageDays<60) extraScore-=15;
      else if(ageDays>365) extraScore+=5; // Domínio antigo é bom sinal
    }
  }catch{}
  
  // Reclame Aqui penalidades/bônus
  if(ra?.found){
    if(!ra.verified) extraScore-=10; // Empresa não verificada
    if(ra.reputation === "Não recomendada") extraScore-=20;
    else if(ra.reputation === "Ótima") extraScore+=10;
    
    if(ra.responseRate !== null){
      if(ra.responseRate < 50) extraScore-=15;
      else if(ra.responseRate > 80) extraScore+=5;
    }
    
    if(ra.last30d>50) extraScore-=20;
    if(ra.score && ra.score<5) extraScore-=15;
  }
  
  // TrustPilot boost/penalidade
  if(trustPilot?.found){
    if(trustPilot.rating>=4) extraScore+=8;
    else if(trustPilot.rating<=2) extraScore-=12;
    
    if(trustPilot.reviewCount>100) extraScore+=5; // Muitas reviews é bom sinal
  }
  
  return Math.max(0,Math.min(100,Math.round(extraScore)));
}

// ---------- Gerador de mensagem inteligente ----------
function generateIntelligentMessage(cls, ra, social, sslInfo, whois, trustPilot){
  let message = "";
  const issues = [];
  const positives = [];
  
  if(cls.status === "safe"){
    if(ra?.found && ra.verified) positives.push("empresa verificada no Reclame Aqui");
    if(sslInfo?.present && sslInfo.validNow) positives.push("certificado SSL válido");
    if(social.sentiment === "positive") positives.push("menções positivas online");
    if(trustPilot?.found && trustPilot.rating >= 4) positives.push(`avaliação ${trustPilot.rating}/5 no TrustPilot`);
    
    message = positives.length > 0 
      ? `Site confiável com ${positives.join(", ")}. Pode comprar com segurança.`
      : "Nenhum problema grave detectado. Site aparenta ser seguro.";
  }
  else if(cls.status === "suspicious"){
    if(ra?.found && ra.last30d > 5) issues.push(`${ra.last30d} reclamações nos últimos 30 dias`);
    if(ra?.found && !ra.verified) issues.push("empresa não verificada no Reclame Aqui");
    if(!sslInfo?.present) issues.push("sem certificado SSL");
    if(social.sentiment === "negative") issues.push("menções negativas online");
    
    message = issues.length > 0
      ? `Sinais de alerta: ${issues.join(", ")}. Recomendamos cautela antes de comprar.`
      : "Encontramos sinais mistos. Recomendamos verificar diretamente com a empresa.";
  }
  else { // danger
    if(ra?.found && ra.last30d > 30) issues.push(`${ra.last30d} reclamações recentes`);
    if(ra?.found && ra.reputation === "Não recomendada") issues.push("reputação 'não recomendada'");
    if(!sslInfo?.present) issues.push("sem proteção SSL");
    if(social.sentiment === "negative") issues.push("múltiplas menções negativas");
    
    message = issues.length > 0
      ? `ALERTA MÁXIMO: ${issues.join(", ")}. Evite comprar neste site.`
      : "Múltiplos sinais de golpe detectados. NÃO recomendamos este site.";
  }
  
  return message;
}

// ---------- Handler final ULTRA avançado ----------
export async function handler(event){
  const t0=Date.now();
  try{
    const { query }=JSON.parse(event.body||"{}");
    const q=normalizeQuery(query);
    if(!q) return {statusCode:400,body:JSON.stringify({error:"Envie 'query'"})};

    let host=extractHostFromQuery(q);
    
    // Se não conseguiu extrair host, tenta buscar domínio da marca
    if(!host){
      host = await findDomainFromBrand(q);
    }
    
    const brandGuess=host ? (parse(host).domainWithoutSuffix||host.split(".")[0]||q).toLowerCase() : q.split(/\s+/)[0].toLowerCase();

    // Executa todas as verificações em paralelo quando possível
    const [serp, sslInfo, whois] = await Promise.allSettled([
      searchWebTop10(q),
      host ? getSSLCertificate(host) : Promise.resolve(null),
      host ? getWhois(host) : Promise.resolve(null)
    ]);

    const serpResults = serp.status === 'fulfilled' ? serp.value : [];
    const sslData = sslInfo.status === 'fulfilled' ? sslInfo.value : null;
    const whoisData = whois.status === 'fulfilled' ? whois.value : null;

    // Reclame Aqui ULTRA
    let ra=null;
    try{ ra=await getReclameAquiUltraAdvanced(host||q); }catch(e){ ra={error:String(e),found:false}; }

    // Redes sociais ULTRA
    const social=await analyzeSocialMediaUltra(serpResults);

    // TrustPilot
    const trustPilot=host ? await fetchTrustPilotReviews(host) : null;

    // Score inicial
    let score=90;
    if(host){
      if(!sslData?.present) score-=40; 
      else if(sslData.present&&!sslData.validNow) score-=25;
    }
    score += domainPenalty(host,brandGuess);

    // WHOIS idade
    try{
      const created=whoisData?.WhoisRecord?.registryData?.createdDate || 
                    whoisData?.WhoisRecord?.createdDateNormalized || 
                    whoisData?.WhoisRecord?.createdDate;
      if(created){
        const ageDays=Math.max(0,(Date.now()-new Date(created).getTime())/(1000*60*60*24));
        if(ageDays<30) score-=25; 
        else if(ageDays<90) score-=15;
      }
    }catch{}

    // SERP signals ULTRA
    const serpSignals=analyzeSerpSignalsUltra(serpResults,brandGuess);
    score += serpSignals.posHits*3;
    score -= serpSignals.negHits*5;

    // Reclame Aqui
    if(ra?.found){
      if(ra.score!=null){
        if(ra.score<6) score-=20; 
        else if(ra.score<8) score-=10; 
        else score+=5;
      }
      if(ra.last30d!=null){
        if(ra.last30d>100) score-=30; 
        else if(ra.last30d>30) score-=15; 
        else if(ra.last30d>5) score-=5;
      }
    }

    // Redes sociais
    if(social.mentions>5) score+=5;
    if(social.sentiment === "negative") score-=10;
    else if(social.sentiment === "positive") score+=10;

    // Aplicar heurísticas extras ULTRA
    score = applyExtraHeuristicsUltra(score,sslData,whoisData,ra,social,trustPilot);

    // Classificação final
    const cls=classify(score);
    
    // Mensagem inteligente
    const message = generateIntelligentMessage(cls, ra, social, sslData, whoisData, trustPilot);

    const complaints=(ra?.last30d??ra?.totalComplaints??0)||0;
    const verificationTime=((Date.now()-t0)/1000).toFixed(1)+"s";

    return {statusCode:200,body:JSON.stringify({
      status:cls.status,
      title:cls.title,
      message,
      complaints,
      trustScore:score,
      verificationTime,
      debug:{at:nowISO(),brandGuess,host,serpSignals,social,trustPilot},
      ssl:sslData,
      whois:whoisData?{hasData:true}:{hasData:false},
      reclameAqui:ra,
      googleResults:serpResults,
      social,
      trustPilot
    })};

  }catch(err){ 
    console.error("Handler error:", err); 
    return {statusCode:500,body:JSON.stringify({error:"Erro interno",detail:String(err)})}; 
  }
}
