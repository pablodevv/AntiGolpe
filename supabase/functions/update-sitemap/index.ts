import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { slug, brand } = await req.json();
    if (!slug) {
      return new Response(JSON.stringify({ error: "Slug is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const githubToken = Deno.env.get("GITHUB_TOKEN");
    const githubRepo = Deno.env.get("GITHUB_REPO") || "pabloeduardo/fraudara";
    const githubBranch = Deno.env.get("GITHUB_BRANCH") || "main";

    if (!githubToken) {
      return new Response(
        JSON.stringify({ error: "GITHUB_TOKEN not configured", note: "Sitemap update skipped. Configure GITHUB_TOKEN secret to enable automatic sitemap updates." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sitemapPath = "public/sitemap.xml";
    const apiUrl = `https://api.github.com/repos/${githubRepo}/contents/${sitemapPath}`;
    const headers = {
      Authorization: `token ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "Fraudara-Bot",
    };

    // Get current sitemap
    const getResp = await fetch(`${apiUrl}?ref=${githubBranch}`, { headers });
    if (!getResp.ok) {
      throw new Error(`Failed to fetch sitemap: ${getResp.status}`);
    }
    const fileData = await getResp.json();
    const sha = fileData.sha;
    const currentContent = atob(fileData.content);

    const newUrl = `https://fraudara.pro/check/${slug}`;
    if (currentContent.includes(newUrl)) {
      return new Response(
        JSON.stringify({ message: "URL already in sitemap", slug }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const today = new Date().toISOString().split("T")[0];
    const newEntry = `
  <url>
    <loc>${newUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

    const updatedContent = currentContent.replace("</urlset>", `${newEntry}\n\n</urlset>`);

    const updateResp = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `feat: add /check/${slug} to sitemap`,
        content: btoa(updatedContent),
        sha,
        branch: githubBranch,
      }),
    });

    if (!updateResp.ok) {
      const errText = await updateResp.text();
      throw new Error(`Failed to update sitemap: ${errText}`);
    }

    // Also update the DB to mark sitemap as updated
    const supabaseUrl = Deno.env.get("SUPA_URL")!;
    const supabaseKey = Deno.env.get("SUPA_SERVICE_ROLE_KEY")!;
    await fetch(`${supabaseUrl}/rest/v1/brand_pages?slug=eq.${encodeURIComponent(slug)}`, {
      method: "PATCH",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sitemap_updated: true }),
    });

    return new Response(
      JSON.stringify({ success: true, message: `Sitemap updated with /check/${slug}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Sitemap update error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
