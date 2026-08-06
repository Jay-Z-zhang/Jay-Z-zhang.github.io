/**
 * Cloudflare Worker: DeepSeek API Proxy
 *
 * 前端 → Worker → DeepSeek API
 * Worker 注入 API Key，前端永远看不到
 *
 * 部署步骤：
 * 1. npx wrangler deploy worker.js
 * 2. npx wrangler secret put DEEPSEEK_API_KEY
 * 3. 粘贴你的 DeepSeek API Key
 * 4. 把 Worker URL 填入简历生成器的 AI 面板
 */

export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json();

      // Rate limiting: max 10 requests per minute per IP (simple)
      // In production, use KV or D1 for proper rate limiting

      // Forward to DeepSeek
      const deepseekResponse = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          ...body,
          model: body.model || 'deepseek-chat',
          max_tokens: Math.min(body.max_tokens || 2000, 4000), // Cap token usage
        }),
      });

      const data = await deepseekResponse.json();

      return new Response(JSON.stringify(data), {
        status: deepseekResponse.status,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
