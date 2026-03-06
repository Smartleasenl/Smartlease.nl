// netlify/functions/img-proxy.js
exports.handler = async (event) => {
  const { id, s = '320', n = '1' } = event.queryStringParameters || {};
  if (!id) return { statusCode: 400, body: 'Missing id' };
  if (!/^\d+$/.test(id)) return { statusCode: 400, body: 'Invalid id' };

  // Via Supabase Edge Function (die roept de gewhitelisted VPS aan)
  const supabaseUrl = `https://bcjbghqrdlzwxgfuuxss.supabase.co/functions/v1/og-image?id=${id}&s=${s}&n=${n}`;
  const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjamJnaHFyZGx6d3hnZnV1eHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMTUzNDksImV4cCI6MjA4NzY5MTM0OX0.TboqxP8kTiJgouaO5zZJdvbki07HK6M0FPj6uo5uG-M';

  try {
    const response = await fetch(supabaseUrl, {
      headers: { 'Authorization': `Bearer ${ANON_KEY}` }
    });

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