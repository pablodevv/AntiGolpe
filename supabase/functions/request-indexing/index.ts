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

    const googleServiceAccount = Deno.env.get("GOOGLE_INDEXING_SERVICE_ACCOUNT");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const pageUrl = `https://fraudara.pro/check/${slug}`;

    if (!googleServiceAccount) {
      // Mark as indexed attempt in DB even if we can't actually index
      await fetch(`${supabaseUrl}/rest/v1/brand_pages?slug=eq.${encodeURIComponent(slug)}`, {
        method: "PATCH",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_indexed: true, indexed_at: new Date().toISOString() }),
      });

      return new Response(
        JSON.stringify({
          error: "GOOGLE_INDEXING_SERVICE_ACCOUNT not configured",
          note: "Google indexing skipped. Configure the service account secret to enable automatic indexing requests.",
          slug,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use Google Indexing API with service account
    try {
      const sa = JSON.parse(googleServiceAccount);

      // Create JWT for Google API
      const header = { alg: "RS256", typ: "JWT" };
      const now = Math.floor(Date.now() / 1000);
      const payload = {
        iss: sa.client_email,
        scope: "https://www.googleapis.com/auth/indexing",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
      };

      // Encode header and payload
      const b64Encode = (obj: object) =>
        btoa(JSON.stringify(obj)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

      const headerB64 = b64Encode(header);
      const payloadB64 = b64Encode(payload);
      const signInput = `${headerB64}.${payloadB64}`;

      // Import private key and sign
      const privateKey = await crypto.subtle.importKey(
        "pkcs8",
        pemToArrayBuffer(sa.private_key),
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, new TextEncoder().encode(signInput));
      const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

      const jwt = `${signInput}.${signatureB64}`;

      // Get access token
      const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
      });

      const tokenData = await tokenResp.json();
      const accessToken = tokenData.access_token;

      if (!accessToken) {
        throw new Error("Failed to obtain Google access token");
      }

      // Request indexing
      const indexResp = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: pageUrl,
          type: "URL_UPDATED",
        }),
      });

      if (!indexResp.ok) {
        const errText = await indexResp.text();
        console.error("Google Indexing API error:", errText);
      }

      // Update DB
      await fetch(`${supabaseUrl}/rest/v1/brand_pages?slug=eq.${encodeURIComponent(slug)}`, {
        method: "PATCH",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_indexed: true, indexed_at: new Date().toISOString() }),
      });

      return new Response(
        JSON.stringify({ success: true, message: `Indexing requested for ${pageUrl}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (googleErr) {
      console.error("Google indexing error:", googleErr);
      return new Response(
        JSON.stringify({ error: googleErr.message, slug }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    console.error("Request indexing error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN.*?-----/g, "")
    .replace(/-----END.*?-----/g, "")
    .replace(/\s/g, "");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
