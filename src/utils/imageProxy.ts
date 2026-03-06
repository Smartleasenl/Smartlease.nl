// src/utils/imageProxy.ts
// Proxiet afbeeldingen via smartlease.nl/public/img.php (VPS gewhitelisted bij nederlandmobiel.nl)

const VPS_IMG_PROXY = 'https://smartlease.nl/public/img.php';

/**
 * Genereert een proxy URL op basis van external_id
 * Gebruikt door VehicleCard als primaire afbeelding
 */
export function proxyThumb(externalId: string | number, size: number = 320, n: number = 1): string {
  if (!externalId) return '';
  return `${VPS_IMG_PROXY}?id=${externalId}&s=${size}&n=${n}`;
}

/**
 * Genereert een grote proxy URL op basis van external_id
 * Gebruikt door VehicleDetailPage voor de grote afbeeldingen
 */
export function proxyLargeImage(externalId: string | number, n: number = 1): string {
  if (!externalId) return '';
  return `${VPS_IMG_PROXY}?id=${externalId}&s=640&n=${n}`;
}

/**
 * Converteert een nederlandmobiel.nl afbeelding URL naar een VPS proxy URL
 */
export function getProxiedImageUrl(originalUrl: string | null | undefined): string {
  if (!originalUrl) return '';
  if (originalUrl.includes('img.php')) return originalUrl;
  // Legacy img-proxy.php URLs ook supporten
  if (originalUrl.includes('img-proxy')) {
    return originalUrl.replace(
      /https?:\/\/\d+\.\d+\.\d+\.\d+\/img-proxy\.php/,
      VPS_IMG_PROXY
    );
  }
  const match = originalUrl.match(/nederlandmobiel\.nl\/auto\/(\d+)\/(\d+)\/(\d+)/);
  if (match) {
    const [, id, size, number] = match;
    return `${VPS_IMG_PROXY}?id=${id}&s=${size}&n=${number}`;
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
  if (size !== 320 && proxied.includes('img.php')) {
    return proxied.replace(/s=\d+/, `s=${size}`);
  }
  return proxied;
}

/**
 * OG image URL voor social sharing (1280px via VPS proxy)
 */
export function getOgImageUrl(externalId: string | number): string {
  if (!externalId) return 'https://smartlease.nl/smart-lease-logo.gif';
  return `${VPS_IMG_PROXY}?id=${externalId}&s=1280&n=1`;
}