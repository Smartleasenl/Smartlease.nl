// src/utils/imageProxy.ts

/**
 * Genereert een proxy URL op basis van external_id
 * Gebruikt door VehicleCard als primaire afbeelding
 * /img-proxy?id={external_id}&s=320&n=1
 */
export function proxyThumb(externalId: string | number, size: number = 320, n: number = 1): string {
  if (!externalId) return '';
  return `/img-proxy?id=${externalId}&s=${size}&n=${n}`;
}

/**
 * Converteert een nederlandmobiel.nl afbeelding URL naar een proxy URL
 * zodat CORS problemen worden omzeild.
 *
 * Input:  https://images.nederlandmobiel.nl/auto/21940556/320/1.jpg?...
 * Output: /img-proxy?id=21940556&s=320&n=1
 */
export function getProxiedImageUrl(originalUrl: string | null | undefined): string {
  if (!originalUrl) return '';

  // Als het al een proxy URL is, geef terug
  if (originalUrl.includes('/img-proxy')) return originalUrl;

  // Probeer het ID te extraheren uit nederlandmobiel.nl URL
  // Formaat: https://images.nederlandmobiel.nl/auto/{id}/{size}/{number}.jpg
  const match = originalUrl.match(/nederlandmobiel\.nl\/auto\/(\d+)\/(\d+)\/(\d+)/);
  if (match) {
    const [, id, size, number] = match;
    return `/img-proxy?id=${id}&s=${size}&n=${number}`;
  }

  // Fallback: geef originele URL terug
  return originalUrl;
}

/**
 * Genereert een grote proxy URL op basis van external_id
 * Gebruikt door VehicleDetailPage voor de grote afbeeldingen (640px)
 */
export function proxyLargeImage(externalId: string | number, n: number = 1): string {
  if (!externalId) return '';
  return `/img-proxy?id=${externalId}&s=640&n=${n}`;
}

/**
 * Geeft een fallback afbeelding URL terug als de originele niet beschikbaar is
 */
export function getVehicleImageUrl(
  smallPicture: string | null | undefined,
  size: number = 320
): string {
  if (!smallPicture) return '';

  // Vervang size in de URL als nodig
  const proxied = getProxiedImageUrl(smallPicture);

  // Als size anders is dan 320, pas aan
  if (size !== 320 && proxied.includes('img-proxy')) {
    return proxied.replace('s=320', `s=${size}`);
  }

  return proxied;
}