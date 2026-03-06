export default async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const s = url.searchParams.get('s') || '320';
  const n = url.searchParams.get('n') || '1';

  if (!id || !/^\d+$/.test(id)) {
    return new Response('Invalid id', { status: 400 });
  }

  // VPS IP direct — gewhitelisted bij nederlandmobiel.nl
  // Apache op cPanel draait op poort 8443 (HTTPS) of 8080 (HTTP)
  const vpsUrl = `http://185.205.246.13:8080/public/img.php?id=${id}&s=${s}&n=${n}`;

  try {
    const response = await fetch(vpsUrl, {
      headers: { 'Host': 'smartlease.nl' },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok || !response.headers.get('content-type')?.includes('image/')) {
      return new Response('Image not found', { status: 404 });
    }

    const buffer = await response.arrayBuffer();
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err) {
    return new Response('Proxy error: ' + err.message, { status: 502 });
  }
};

export const config = {
  path: '/api/img-proxy',
};