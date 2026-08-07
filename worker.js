/**
 * Cloudflare Worker: DeepSeek API Proxy + PMF Telemetry
 *
 * 功能:
 * - 代理 DeepSeek chat completions
 * - CORS 白名单
 * - 每 IP 每天 30 次限流
 * - PMF 事件日志(KV 汇总,不含 PII)
 * - GET /stats?token=... 查询汇总
 *
 * 部署: npx wrangler deploy
 * 密钥: DEEPSEEK_API_KEY, STATS_TOKEN(用于查询埋点)
 */

const ALLOWED_ORIGINS = [
  'https://www.jayzzhang.online',
  'https://jayzzhang.online',
  'https://jay-z-zhang.github.io',
];

const VALID_KINDS = new Set(['polish', 'rewrite', 'import', 'unknown']);

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) || /^http:\/\/localhost(:\d+)?$/.test(origin || '');
  return {
    'Access-Control-Allow-Origin': allow ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 12);
}

async function logEvent(env, ctx, {kind, tokens, ip, day, status}) {
  if (!env.RATE_LIMIT) return;
  const ipHash = await sha256Hex(ip + '|' + day);
  const dayKey = `stats:${day}`;
  const uidKey = `stats-uid:${day}`;
  ctx.waitUntil((async () => {
    try {
      const raw = await env.RATE_LIMIT.get(dayKey);
      const s = raw ? JSON.parse(raw) : { calls: 0, tokens: 0, byKind: {}, errors: 0 };
      s.calls += 1;
      s.tokens += tokens || 0;
      s.byKind[kind] = (s.byKind[kind] || 0) + 1;
      if (status >= 400) s.errors += 1;
      await env.RATE_LIMIT.put(dayKey, JSON.stringify(s), { expirationTtl: 60 * 24 * 3600 });
      // 记录当日唯一 IP hash(去重后即 UID)
      const uidRaw = await env.RATE_LIMIT.get(uidKey);
      const uids = uidRaw ? JSON.parse(uidRaw) : [];
      if (!uids.includes(ipHash)) {
        uids.push(ipHash);
        await env.RATE_LIMIT.put(uidKey, JSON.stringify(uids), { expirationTtl: 60 * 24 * 3600 });
      }
    } catch (e) {}
  })());
}

async function handleStats(env, url) {
  const token = url.searchParams.get('token');
  if (!env.STATS_TOKEN || token !== env.STATS_TOKEN) {
    return new Response('unauthorized', { status: 401 });
  }
  const days = Math.min(parseInt(url.searchParams.get('days') || '14'), 60);
  const now = new Date();
  const rows = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(now.getTime() - i * 86400000);
    const day = d.toISOString().slice(0, 10);
    const [statsRaw, uidsRaw] = await Promise.all([
      env.RATE_LIMIT.get(`stats:${day}`),
      env.RATE_LIMIT.get(`stats-uid:${day}`),
    ]);
    const s = statsRaw ? JSON.parse(statsRaw) : { calls: 0, tokens: 0, byKind: {}, errors: 0 };
    const uids = uidsRaw ? JSON.parse(uidsRaw) : [];
    rows.push({ day, calls: s.calls, tokens: s.tokens, users: uids.length, byKind: s.byKind, errors: s.errors });
  }
  return new Response(JSON.stringify({ days: rows }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

/* ── Newsletter subscription (Coming Soon phase) ── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function handleSubscribe(request, env, ctx, headers) {
  if (!env.RATE_LIMIT) return new Response('storage unavailable', { status: 500, headers });
  let body;
  try { body = await request.json(); } catch { return jsonErr(headers, 400, 'bad json'); }
  const email = (body.email || '').trim().toLowerCase();
  const source = String(body.source || 'homepage').slice(0, 40);
  if (!EMAIL_RE.test(email) || email.length > 200) return jsonErr(headers, 400, '邮箱格式不正确');

  // 反滥用: 每 IP 每小时最多 5 次订阅动作
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const hourKey = `sub-rate:${ip}:${new Date().toISOString().slice(0, 13)}`;
  const c = parseInt(await env.RATE_LIMIT.get(hourKey) || '0');
  if (c >= 5) return jsonErr(headers, 429, '操作过于频繁,请稍后再试');
  ctx.waitUntil(env.RATE_LIMIT.put(hourKey, String(c + 1), { expirationTtl: 3600 }));

  const emailHash = await sha256Hex(email);
  const key = `sub:${emailHash}`;
  const exists = await env.RATE_LIMIT.get(key);
  if (exists) {
    // 幂等 —— 已订阅返回同样的成功状态,但 total 不增
    const total = parseInt(await env.RATE_LIMIT.get('sub-count') || '0');
    return new Response(JSON.stringify({ ok: true, already: true, total }), {
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }
  const record = { email, source, ts: new Date().toISOString() };
  await env.RATE_LIMIT.put(key, JSON.stringify(record));
  const total = parseInt(await env.RATE_LIMIT.get('sub-count') || '0') + 1;
  await env.RATE_LIMIT.put('sub-count', String(total));
  return new Response(JSON.stringify({ ok: true, already: false, total }), {
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}

async function handleSubscribers(env, url) {
  const token = url.searchParams.get('token');
  if (!env.STATS_TOKEN || token !== env.STATS_TOKEN) {
    return new Response('unauthorized', { status: 401 });
  }
  const total = parseInt(await env.RATE_LIMIT.get('sub-count') || '0');
  // 列出全部订阅(小规模使用可行,大量应该分页)
  const list = await env.RATE_LIMIT.list({ prefix: 'sub:', limit: 1000 });
  const items = [];
  for (const k of list.keys) {
    const raw = await env.RATE_LIMIT.get(k.name);
    if (raw) {
      try { items.push(JSON.parse(raw)); } catch {}
    }
  }
  items.sort((a, b) => (a.ts || '').localeCompare(b.ts || ''));
  return new Response(JSON.stringify({ total, subscribers: items }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function jsonErr(headers, status, msg) {
  return new Response(JSON.stringify({ ok: false, error: msg }), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin);
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    // GET /stats?token=xxx&days=14 — PMF 数据查询接口
    if (request.method === 'GET' && url.pathname === '/stats') {
      return handleStats(env, url);
    }
    // GET /subscribers?token=xxx — 列出所有订阅者
    if (request.method === 'GET' && url.pathname === '/subscribers') {
      return handleSubscribers(env, url);
    }

    // POST /subscribe — 收集 email
    if (request.method === 'POST' && url.pathname === '/subscribe') {
      return handleSubscribe(request, env, ctx, headers);
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers });
    }

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
      const rawKind = typeof body.x_kind === 'string' ? body.x_kind : 'unknown';
      const kind = VALID_KINDS.has(rawKind) ? rawKind : 'unknown';
      delete body.x_kind; // 不转发给 DeepSeek

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
      const tokens = data.usage?.total_tokens || 0;

      await logEvent(env, ctx, {
        kind, tokens, ip, day: today, status: deepseekResponse.status,
      });

      return new Response(JSON.stringify(data), {
        status: deepseekResponse.status,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      await logEvent(env, ctx, {
        kind: 'unknown', tokens: 0, ip, day: today, status: 500,
      });
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
  },
};
