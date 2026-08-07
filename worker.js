/**
 * Cloudflare Worker: DeepSeek API Proxy with Rate Limiting
 *
 * 限流：每 IP 每天最多 30 次请求
 * 部署：npx wrangler deploy
 * 密钥：npx wrangler secret put DEEPSEEK_API_KEY
 */

const ALLOWED_ORIGINS = [
  'https://www.jayzzhang.online',
  'https://jayzzhang.online',
  'https://jay-z-zhang.github.io',
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) || /^http:\/\/localhost(:\d+)?$/.test(origin || '');
  return {
    'Access-Control-Allow-Origin': allow ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers });
    }

    // ── 限流：每 IP 每天最多 30 次请求 ──
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const today = new Date().toISOString().slice(0, 10);
    const rateKey = `usage:${today}:${ip}`;
    const count = parseInt(await env.RATE_LIMIT.get(rateKey) || '0');

    if (count >= 30) {
      return new Response(JSON.stringify({
        error: { message: '今日 AI 调用次数已达上限（30次），明天再来吧' }
      }), {
        status: 429,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    await env.RATE_LIMIT.put(rateKey, (count + 1).toString(), {
      expirationTtl: 86400
    });

    try {
      const body = await request.json();

      const deepseekResponse = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          ...body,
          model: body.model || 'deepseek-chat',
          max_tokens: Math.min(body.max_tokens || 2000, 4000),
        }),
      });

      const data = await deepseekResponse.json();

      return new Response(JSON.stringify(data), {
        status: deepseekResponse.status,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
  },
};
