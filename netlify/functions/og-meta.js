const SUPABASE_URL = "https://bcjbghqrdlzwxgfuuxss.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjamJnaHFyZGx6d3hnZnV1eHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE4MzExNTEsImV4cCI6MjAzNzQwNzE1MX0.mL3MmFGjkMiaCMNhL6f2MghYF9rRORSY-ZSb-YKp4tM";

const BOT_AGENTS = [
  'whatsapp', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
  'googlebot', 'slackbot', 'telegrambot', 'discordbot', 'applebot',
  'bingbot', 'duckduckbot', 'pinterest', 'vkshare', 'w3c_validator',
  'curl', 'wget', 'python-requests', 'axios'
];

function isBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_AGENTS.some(bot => ua.includes(bot));
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default async (req, context) => {
  const url = new URL(req.url);
  const match = url.pathname.match(/^\/auto\/(\d+)/);
  if (!match) {
    return new Response(null, { status: 404 });
  }

  const vehicleId = match[1];
  const userAgent = req.headers.get("user-agent") || "";

  // Browsers: stuur gewoon door naar de SPA (index.html)
  // Alleen voor bots: genereer server-side HTML met OG tags
  if (!isBot(userAgent)) {
    // Serve de normale SPA index.html
    const spaRes = await fetch(`${url.origin}/index.html`);
    const html = await spaRes.text();
    return new Response(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  // Bot: haal voertuigdata op
  let vehicle = null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/vehicles?id=eq.${vehicleId}&select=id,merk,model,uitvoering,verkoopprijs,bouwjaar_year,kmstand,og_image_url&is_active=eq.true`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    const data = await res.json();
    vehicle = data?.[0] ?? null;
  } catch (_) {}

  if (!vehicle) {
    // Fallback: generieke OG tags
    const html = buildHtml({
      title: "Smartlease.nl | Financial Lease",
      description: "Vind jouw ideale leaseauto bij Smartlease.nl. Ruim aanbod financial lease voertuigen.",
      imageUrl: "https://smartlease.nl/smart-lease-logo.gif",
      pageUrl: req.url,
    });
    return new Response(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  const title = `${vehicle.merk} ${vehicle.model}${vehicle.uitvoering ? " – " + vehicle.uitvoering : ""} | Smartlease.nl`;

  const r = 8.99 / 100 / 12;
  const months = 72;
  const maandprijs = vehicle.verkoopprijs
    ? Math.round(
        (vehicle.verkoopprijs * 0.85 * r * Math.pow(1 + r, months) -
          vehicle.verkoopprijs * 0.1 * r) /
          (Math.pow(1 + r, months) - 1)
      )
    : null;

  const description = [
    vehicle.bouwjaar_year && `Bouwjaar ${vehicle.bouwjaar_year}`,
    vehicle.kmstand && `${vehicle.kmstand.toLocaleString("nl-NL")} km`,
    maandprijs && `Vanaf €${maandprijs},- p/m`,
  ].filter(Boolean).join(" · ");

  const imageUrl = vehicle.og_image_url ||
    `${SUPABASE_URL}/storage/v1/object/public/vehicle-images/thumbnails/${vehicleId}.jpg`;

  const html = buildHtml({ title, description, imageUrl, pageUrl: req.url });

  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
};

function buildHtml({ title, description, imageUrl, pageUrl }) {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Smartlease.nl" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(imageUrl)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${escapeHtml(pageUrl)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(description)}</p>
</body>
</html>`;
}

export const config = {
  path: "/auto/:id/*",
  preferStatic: false,
};