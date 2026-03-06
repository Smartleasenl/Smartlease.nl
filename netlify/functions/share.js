// netlify/functions/share.js
// Route: /.netlify/functions/share?id=12345
// Of via netlify.toml redirect: /share/:id -> deze functie

const SUPABASE_URL = 'https://bcjbghqrdlzwxgfuuxss.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

exports.handler = async (event) => {
  const vehicleId = event.queryStringParameters?.id;

  // Proxy afbeelding via ons eigen domein
  if (event.queryStringParameters?.img) {
    const imgUrl = decodeURIComponent(event.queryStringParameters.img);
    try {
      const resp = await fetch(imgUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Smartlease/1.0)' }
      });
      const buffer = await resp.arrayBuffer();
      return {
        statusCode: 200,
        headers: {
          'Content-Type': resp.headers.get('Content-Type') || 'image/jpeg',
          'Cache-Control': 'public, max-age=86400',
        },
        body: Buffer.from(buffer).toString('base64'),
        isBase64Encoded: true,
      };
    } catch {
      return { statusCode: 500, body: 'Image error' };
    }
  }

  if (!vehicleId) {
    return { statusCode: 400, body: 'Missing id' };
  }

  // Voertuig ophalen uit Supabase
  let vehicle = null;
  try {
    const resp = await fetch(
      `${SUPABASE_URL}/rest/v1/vehicles?id=eq.${vehicleId}&select=id,merk,model,uitvoering,verkoopprijs,small_picture&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        }
      }
    );
    const data = await resp.json();
    vehicle = data?.[0];
  } catch (e) {
    console.error('Supabase fetch failed:', e);
  }

  if (!vehicle) {
    return {
      statusCode: 302,
      headers: { Location: 'https://smartlease.nl/aanbod' },
      body: '',
    };
  }

  const siteUrl = 'https://smartlease.nl';
  const title = `${vehicle.merk} ${vehicle.model}`;
  const price = vehicle.verkoopprijs
    ? new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(vehicle.verkoopprijs)
    : '';
  const description = price ? `${title} - ${price}P/M | Smartlease.nl` : `${title} | Smartlease.nl`;

  const slug = `${vehicle.merk}-${vehicle.model}`
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  const pageUrl = `${siteUrl}/auto/${vehicle.id}/${encodeURIComponent(slug)}`;

  // Afbeelding proxyen via ons eigen domein (zodat WhatsApp hem laadt)
  const shareBase = `${siteUrl}/.netlify/functions/share`;
  const imageUrl = vehicle.small_picture
    ? `${shareBase}?img=${encodeURIComponent(vehicle.small_picture)}`
    : '';

  const esc = (s) => s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const html = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <title>${esc(title)} - Smartlease.nl</title>

  <!-- Open Graph / WhatsApp -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Smartlease.nl" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(pageUrl)}" />
  ${imageUrl ? `<meta property="og:image" content="${esc(imageUrl)}" />
  <meta property="og:image:secure_url" content="${esc(imageUrl)}" />
  <meta property="og:image:width" content="320" />
  <meta property="og:image:height" content="240" />
  <meta property="og:image:type" content="image/jpeg" />` : ''}

  <!-- Twitter/X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  ${imageUrl ? `<meta name="twitter:image" content="${esc(imageUrl)}" />` : ''}

  <meta http-equiv="refresh" content="0;url=${esc(pageUrl)}" />
  <link rel="canonical" href="${esc(pageUrl)}" />
</head>
<body>
  <p>Doorsturen naar <a href="${esc(pageUrl)}">${esc(title)}</a>...</p>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
    body: html,
  };
};