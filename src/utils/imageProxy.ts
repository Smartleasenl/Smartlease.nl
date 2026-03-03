const PROXY_BASE = 'https://smartlease.nl/img.php';

export const proxyImage = (url: string | null | undefined): string => {
  if (!url) return '/placeholder-car.svg';
  return `${PROXY_BASE}?url=${encodeURIComponent(url)}`;
};

export const proxyThumb = (externalId: string | null | undefined): string => {
  if (!externalId) return '/placeholder-car.svg';
  return `${PROXY_BASE}?id=${externalId}&s=640&n=1`;
};

export const proxyLargeImage = (externalId: string, photoNumber: number): string => {
  return `${PROXY_BASE}?id=${externalId}&s=1280&n=${photoNumber}`;
};