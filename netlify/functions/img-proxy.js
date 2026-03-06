// netlify/functions/img-proxy.js
exports.handler = async (event) => {
  const { id, s = '320', n = '1' } = event.queryStringParameters || {};
  if (!id) return { statusCode: 400, body: 'Missing id' };
  if (!/^\d+$/.test(id)) return { statusCode: 400, body: 'Invalid id' };

  // Roept VPS aan (gewhitelisted IP bij nederlandmobiel.nl)
  const imageUrl = `http://185.205.246.13/public/img.php?id=${id}&s=${s}&n=${n}`;

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return { statusCode: response.status, body: 'Image not found' };

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
      },
      body: base64,
      isBase64Encoded: true,
    };
  } catch (err) {
    return { statusCode: 500, body: 'Proxy error' };
  }
};