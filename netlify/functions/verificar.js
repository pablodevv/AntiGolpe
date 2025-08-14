import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function handler(event) {
  try {
    const { query } = JSON.parse(event.body);

    if (!query) {
      return { statusCode: 400, body: JSON.stringify({ error: "Falta o termo de busca" }) };
    }

    // 1. Buscar no Google (usando SerpAPI ou Google Custom Search API)
    const googleApiKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CX; // ID do mecanismo de pesquisa
    const googleUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${googleApiKey}&cx=${cx}`;

    const googleResp = await fetch(googleUrl);
    const googleData = await googleResp.json();

    // Extrair os primeiros 10 resultados
    const resultados = (googleData.items || []).map(r => ({
      titulo: r.title,
      link: r.link,
      snippet: r.snippet
    }));

    // 2. WHOIS e SSL
    const whoisKey = process.env.WHOIS_API_KEY;
    const whoisUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${whoisKey}&domainName=${query}&outputFormat=JSON`;
    const whoisResp = await fetch(whoisUrl);
    const whoisData = await whoisResp.json();

    // 3. Reclame Aqui (exemplo simples — sem API oficial)
    let reclameAqData = { score: null, complaints: null };
    try {
      const raUrl = `https://www.reclameaqui.com.br/busca/?q=${encodeURIComponent(query)}`;
      const raResp = await fetch(raUrl);
      const html = await raResp.text();
      const $ = cheerio.load(html);

      // Extrair algo do HTML
      const score = $(".score .number").first().text().trim();
      const complaints = $(".total-complaints").first().text().trim();

      reclameAqData = { score, complaints };
    } catch (err) {
      console.log("Erro ao buscar Reclame Aqui:", err);
    }

    // 4. Análise simples (mock inicial)
    let status = "safe";
    let trustScore = 90;
    let complaintsCount = parseInt(reclameAqData.complaints) || 0;
    let message = "Nenhum problema grave detectado.";

    if (complaintsCount > 20 || trustScore < 50) {
      status = "danger";
      message = "Muitos relatos de golpe ou problemas graves.";
    } else if (complaintsCount > 5) {
      status = "suspicious";
      message = "Reclamações recentes encontradas, tenha cautela.";
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        status,
        title: status === "safe" ? "✅ SITE SEGURO" :
               status === "suspicious" ? "⚠️ SITE SUSPEITO" :
               "🚨 GOLPE CONFIRMADO",
        message,
        complaints: complaintsCount,
        trustScore,
        verificationTime: "2.1s",
        googleResults: resultados,
        whois: whoisData,
        reclameAqui: reclameAqData
      })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Erro interno" }) };
  }
}
