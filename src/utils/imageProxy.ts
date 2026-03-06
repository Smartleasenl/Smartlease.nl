// src/utils/imageProxy.ts
// Proxiet afbeeldingen via Supabase Edge Function (vast IP, werkt met nederlandmobiel.nl firewall)

const SUPABASE_IMG_PROXY = 'https://bcjbghqrdlzwxgfuuxss.supabase.co/functions/v1/img-proxy';

/**
 * Genereert een proxy URL op basis van external_id via Supabase Edge Function
 * Gebruikt door VehicleCard als primaire afbeelding
 */
export function proxyThumb(externalId: string | number, size: number = 320, n: number = 1): string {
  if (!externalId) return '';
  return `${SUPABASE_IMG_PROXY}?id=${externalId}&s=${size}&n=${n}`;
}

/**
 * Genereert een grote proxy URL op basis van external_id via Supabase Edge Function
 * Gebruikt door VehicleDetailPage voor de grote afbeeldingen
 */
export function proxyLargeImage(externalId: string | number, n: number = 1): string {
  if (!externalId) return '';
  return `${SUPABASE_IMG_PROXY}?id=${externalId}&s=640&n=${n}`;
}

/**
 * Converteert een nederlandmobiel.nl afbeelding URL naar een Supabase proxy URL
 */
export function getProxiedImageUrl(originalUrl: string | null | undefined): string {
  if (!originalUrl) return '';
  if (originalUrl.includes('img-proxy')) return originalUrl;
  const match = originalUrl.match(/nederlandmobiel\.nl\/auto\/(\d+)\/(\d+)\/(\d+)/);
  if (match) {
    const [, id, size, number] = match;
    return `${SUPABASE_IMG_PROXY}?id=${id}&s=${size}&n=${number}`;
  }
  return originalUrl;
}

/**
 * Geeft proxy URL terug met optionele size aanpassing
 */
export function getVehicleImageUrl(
  smallPicture: string | null | undefined,
  size: number = 320
): string {
  if (!smallPicture) return '';
  const proxied = getProxiedImageUrl(smallPicture);
  if (size !== 320 && proxied.includes('img-proxy')) {
    return proxied.replace('s=320', `s=${size}`);
  }
  return proxied;
}