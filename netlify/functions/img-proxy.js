// netlify/functions/img-proxy.js
// Proxies images from nederlandmobiel.nl om CORS te omzeilen
// Gebruik: /img-proxy?id=21940556&s=640&n=1

exports.handler = async (event) => {
  const { id, s = '320', n = '1' } = event.queryStringParameters || {};

  if (!id) {
    return { statusCode: 400, body: 'Missing id parameter' };
  }

  // Valideer dat id alleen cijfers bevat
  if (!/^\d+$/.test(id)) {
    return { statusCode: 400, body: 'Invalid id' };
  }

  const imageUrl = `https://images.nederlandmobiel.nl/auto/${id}/${s}/${n}.jpg?download=true&platform=smartautolease`;

  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Smartlease/1.0)',
        'Referer': 'https://smartlease.nl/',
      },
    });

    if (!response.ok) {
      return { statusCode: response.status, body: 'Image not found' };
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // 24 uur cache
        'Access-Control-Allow-Origin': '*',
      },
      body: base64,
      isBase64Encoded: true,
    };
  } catch (err) {
    console.error('img-proxy error:', err);
    return { statusCode: 500, body: 'Proxy error' };
  }
};