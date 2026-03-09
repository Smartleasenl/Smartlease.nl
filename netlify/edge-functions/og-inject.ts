import type { Context, Config } from "@netlify/edge-functions";

const SUPABASE_URL = "https://bcjbghqrdlzwxgfuuxss.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjamJnaHFyZGx6d3hnZnV1eHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE4MzExNTEsImV4cCI6MjAzNzQwNzE1MX0.mL3MmFGjkMiaCMNhL6f2MghYF9rRORSY-ZSb-YKp4tM";

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  
  // Extract vehicle ID from path: /auto/3851/bmw-...
  const match = url.pathname.match(/^\/auto\/(\d+)/);
  if (!match) return context.next();
  
  const vehicleId = match[1];

  // Fetch vehicle data from Supabase
  let vehicle: any = null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/vehicles?id=eq.${vehicleId}&select=merk,model,uitvoering,verkoopprijs,bouwjaar_year,kmstand,og_image_url,small_picture&is_active=eq.true`,
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

  // Get the original HTML response
  const response = await context.next();
  const html = await response.text();

  if (!vehicle) return new Response(html, response);

  // Build OG values
  const title = `${vehicle.merk} ${vehicle.model}${vehicle.uitvoering ? " – " + vehicle.uitvoering : ""} | Smartlease.nl`;
  const maandprijs = vehicle.verkoopprijs
    ? Math.round(
        ((vehicle.verkoopprijs * 0.85 * (8.99 / 100 / 12) * Math.pow(1 + 8.99 / 100 / 12, 72) -
          vehicle.verkoopprijs * 0.10 * (8.99 / 100 / 12)) /
          (Math.pow(1 + 8.99 / 100 / 12, 72) - 1))
      )
    : null;
  const description = [
    vehicle.bouwjaar_year && `Bouwjaar ${vehicle.bouwjaar_year}`,
    vehicle.kmstand && `${vehicle.kmstand.toLocaleString("nl-NL")} km`,
    maandprijs && `Vanaf €${maandprijs},- p/m`,
  ]
    .filter(Boolean)
    .join(" · ");

  // Use og_image_url (Supabase Storage) or fall back to og-image edge function
  const imageUrl =
    vehicle.og_image_url ||
    `${SUPABASE_URL}/functions/v1/og-image?id=${vehicle.id ?? vehicleId}&s=1280&n=1`;

  // Inject OG tags by replacing placeholder tags in the HTML
  const ogTags = `
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(imageUrl)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${escapeHtml(req.url)}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`;

  // Replace existing og tags or inject before </head>
  let newHtml = html
    .replace(/<meta property="og:title"[^>]*>/g, "")
    .replace(/<meta property="og:description"[^>]*>/g, "")
    .replace(/<meta property="og:image"[^>]*>/g, "")
    .replace(/<meta property="og:image:width"[^>]*>/g, "")
    .replace(/<meta property="og:image:height"[^>]*>/g, "")
    .replace(/<meta property="og:url"[^>]*>/g, "")
    .replace(/<meta property="og:type"[^>]*>/g, "")
    .replace(/<meta name="twitter:card"[^>]*>/g, "")
    .replace(/<meta name="twitter:image"[^>]*>/g, "")
    .replace("</head>", `${ogTags}\n  </head>`);

  return new Response(newHtml, {
    status: response.status,
    headers: response.headers,
  });
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export const config: Config = {
  path: "/auto/*",
};