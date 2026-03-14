import type { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  const imageUrl = event.queryStringParameters?.url;
  if (!imageUrl) return { statusCode: 400, body: "Missing url" };

  try {
    // Netlify function fetcht van onze VPS, VPS fetcht van nederlandmobiel.nl
    const vpsUrl = `http://94.204.65.192/img-proxy.php?url=${encodeURIComponent(imageUrl)}`;
    
    const response = await fetch(vpsUrl, {
      headers: {
        "Host": "smartlease.nl",
      },
    });

    if (!response.ok) return { statusCode: 502, body: `VPS error: ${response.status}` };

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
      body: base64,
      isBase64Encoded: true,
    };
  } catch (e) {
    return { statusCode: 500, body: `Error: ${e}` };
  }
};

export { handler };