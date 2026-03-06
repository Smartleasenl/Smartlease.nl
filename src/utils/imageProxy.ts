// src/utils/imageProxy.ts
// Proxiet afbeeldingen via Contabo server (vast IP, gewhitelisted bij nederlandmobiel.nl)
const CONTABO_IMG_PROXY = 'http://185.205.246.13/img-proxy.php';

/**
 * Genereert een proxy URL op basis van external_id via Contabo PHP proxy
 * Gebruikt door VehicleCard als primaire afbeelding
 */
export function proxyThumb(externalId: string | number, size: number = 320, n: number = 1): string {
  if (!externalId) return '';
  return `${CONTABO_IMG_PROXY}?id=${externalId}&s=${size}&n=${n}`;
}

/**
 * Genereert een grote proxy URL op basis van external_id via Contabo PHP proxy
 * Gebruikt door VehicleDetailPage voor de grote afbeeldingen
 */
export function proxyLargeImage(externalId: string | number, n: number = 1): string {
  if (!externalId) return '';
  return `${CONTABO_IMG_PROXY}?id=${externalId}&s=640&n=${n}`;
}

/**
 * Converteert een nederlandmobiel.nl afbeelding URL naar een Contabo proxy URL
 */
export function getProxiedImageUrl(originalUrl: string | null | undefined): string {
  if (!originalUrl) return '';
  if (originalUrl.includes('img-proxy')) return originalUrl;
  const match = originalUrl.match(/nederlandmobiel\.nl\/auto\/(\d+)\/(\d+)\/(\d+)/);
  if (match) {
    const [, id, size, number] = match;
    return `${CONTABO_IMG_PROXY}?id=${id}&s=${size}&n=${number}`;
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