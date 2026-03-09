import type { Context, Config } from "@netlify/edge-functions";

const SUPABASE_URL = "https://bcjbghqrdlzwxgfuuxss.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjamJnaHFyZGx6d3hnZnV1eHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE4MzExNTEsImV4cCI6MjAzNzQwNzE1MX0.mL3MmFGjkMiaCMNhL6f2MghYF9rRORSY-ZSb-YKp4tM";

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const match = url.pathname.match(/^\/auto\/(\d+)/);
  if (!match) return context.next();

  const vehicleId = match[1];

  // Haal voertuigdata parallel op met de HTML
  const [vehicleRes, htmlRes] = await Promise.all([
    fetch(
      `${SUPABASE_URL}/rest/v1/vehicles?id=eq.${vehicleId}&select=id,merk,model,uitvoering,verkoopprijs,bouwjaar_year,kmstand,og_image_url&is_active=eq.true`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    ),
    // Haal index.html op via rewrite naar de root - bypast de redirect chain
    context.rewrite("/index.html"),
  ]);

  let html = await htmlRes.text();
  
  let vehicle: any = null;
  try {
    const data = await vehicleRes.json();
    vehicle = data?.[0] ?? null;
  } catch (_) {}

  if (!vehicle) {
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

  const e = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Verwijder alle bestaande og: en twitter: tags
  html = html.replace(/<meta\s[^>]*(property="og:[^"]*"|name="twitter:[^"]*")[^>]*\/?>/gi, "");

  // Injecteer nieuwe OG tags direct na <head>
  const injection = `
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Smartlease.nl" />
    <meta property="og:title" content="${e(title)}" />
    <meta property="og:description" content="${e(description)}" />
    <meta property="og:image" content="${e(imageUrl)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${e(req.url)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${e(title)}" />
    <meta name="twitter:description" content="${e(description)}" />
    <meta name="twitter:image" content="${e(imageUrl)}" />`;

  html = html.replace("<head>", `<head>${injection}`);

  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
};

export const config: Config = {
  path: "/auto/*",
};