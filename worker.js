/**
 * Cloudflare Worker: DeepSeek API Proxy with Rate Limiting
 *
 * 限流：每天最多 30 次请求
 * 部署：npx wrangler deploy
 * 密钥：npx wrangler secret put DEEPSEEK_API_KEY
 */

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    // ── 限流：每天最多 30 次请求 ──
    const today = new Date().toISOString().slice(0, 10);
    const rateKey = `usage:${today}`;
    let count = parseInt(await env.RATE_LIMIT.get(rateKey) || '0');

    if (count >= 30) {
      return new Response(JSON.stringify({
        error: { message: '今日 AI 调用次数已达上限（30次），明天再来吧' }
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await env.RATE_LIMIT.put(rateKey, (count + 1).toString(), {
      expirationTtl: 86400 // 24 小时后自动过期
    });
    // ── 限流结束 ──

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
          model: body.model || 'deepseek-v4-flash',
          max_tokens: Math.min(body.max_tokens || 2000, 4000),
        }),
      });

      const data = await deepseekResponse.json();

      return new Response(JSON.stringify(data), {
        status: deepseekResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
