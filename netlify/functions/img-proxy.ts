import type { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  const imageUrl = event.queryStringParameters?.url;
  if (!imageUrl) {
    return { statusCode: 400, body: "Missing url parameter" };
  }

  try {
    const response = await fetch(decodeURIComponent(imageUrl), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Smartlease/1.0)",
        "Referer": "https://smartlease.nl/",
      },
    });

    if (!response.ok) {
      return { statusCode: 502, body: "Failed to fetch image" };
    }

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
    return { statusCode: 500, body: "Error" };
  }
};

export { handler };