/**
 * Cloudflare Worker: DeepSeek API Proxy + PMF Telemetry
 *
 * 功能:
 * - 代理 DeepSeek chat completions
 * - CORS 白名单
 * - 每 IP 每天 30 次限流
 * - GET/POST /t 全站曝光与产品事件（路径、事件名、来源域名，不含 PII）
 * - GET /stats?token=... 查询 AI 用量 + 流量埋点
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
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

/* 常量时字符串比较,防 timing attack */
function _tokenEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function handleStats(env, request, url, headers) {
  const auth = request.headers.get('Authorization') || '';
  const bearer = auth.replace(/^Bearer\s+/i, '').trim();
  const token = url.searchParams.get('token') || bearer;
  if (!env.STATS_TOKEN || !_tokenEqual(token, env.STATS_TOKEN)) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }
  const days = Math.min(parseInt(url.searchParams.get('days') || '14'), 60);
  const now = new Date();
  const rows = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(now.getTime() - i * 86400000);
    const day = d.toISOString().slice(0, 10);
    const [statsRaw, uidsRaw, tRaw] = await Promise.all([
      env.RATE_LIMIT.get(`stats:${day}`),
      env.RATE_LIMIT.get(`stats-uid:${day}`),
      env.RATE_LIMIT.get(`t:${day}`),
    ]);
    const s = statsRaw ? JSON.parse(statsRaw) : { calls: 0, tokens: 0, byKind: {}, errors: 0 };
    const uids = uidsRaw ? JSON.parse(uidsRaw) : [];
    const traffic = tRaw ? JSON.parse(tRaw) : { pv: 0, uv: 0, pages: {}, events: {}, referrers: {} };
    rows.push({
      day,
      calls: s.calls,
      tokens: s.tokens,
      users: uids.length,
      byKind: s.byKind,
      errors: s.errors,
      traffic,
    });
  }
  return new Response(JSON.stringify({ days: rows }, null, 2), {
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
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
  // 注:并发订阅可能让 sub-count 少算(读→写非原子)。低流量阶段可接受。
  // /subscribers 端点已改为用 sub: 前缀 list 实时计数,作为权威值。
  const total = parseInt(await env.RATE_LIMIT.get('sub-count') || '0') + 1;
  await env.RATE_LIMIT.put('sub-count', String(total));
  return new Response(JSON.stringify({ ok: true, already: false, total }), {
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}

async function handleSubscribers(env, request, url) {
  const auth = request.headers.get('Authorization') || '';
  const bearer = auth.replace(/^Bearer\s+/i, '').trim();
  const token = url.searchParams.get('token') || bearer;
  if (!env.STATS_TOKEN || !_tokenEqual(token, env.STATS_TOKEN)) {
    return new Response('unauthorized', { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }
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
  // list.keys.length 是权威值(sub-count 可能因并发漂移)
  const total = items.length;
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

/* ── 全站曝光 + 简历事件埋点（不含 PII）── */
const TRACK_EVENTS = new Set([
  'page_view',
  'resume_export_pdf',
  'resume_download_html',
  'resume_share',
  'resume_ai_polish_open',
  'resume_ai_polish_run',
  'resume_ai_rewrite_open',
  'resume_ai_rewrite_run',
  'resume_import_open',
  'resume_import_run',
  'resume_fill_demo',
  'resume_reset',
  'resume_template',
  'resume_lang',
  'resume_onboard',
]);
const TRACK_PROP_EVENTS = new Set(['resume_template', 'resume_lang', 'resume_onboard']);

function sanitizePath(p) {
  if (typeof p !== 'string') return '/';
  try { p = decodeURIComponent(p); } catch (e) {}
  p = p.split('?')[0].split('#')[0];
  if (!p.startsWith('/')) p = '/';
  return p.slice(0, 120);
}

async function logTrack(env, { e, p, r, v, ip, day }) {
  if (!env.RATE_LIMIT) return;
  const ipHash = await sha256Hex(ip + '|t|' + day);
  const dayKey = `t:${day}`;
  const uidKey = `t-uid:${day}`;
  try {
    const raw = await env.RATE_LIMIT.get(dayKey);
    const s = raw ? JSON.parse(raw) : { pv: 0, uv: 0, pages: {}, events: {}, referrers: {} };
    if (e === 'page_view') {
      s.pv += 1;
      s.pages[p] = (s.pages[p] || 0) + 1;
      if (r) s.referrers[r] = (s.referrers[r] || 0) + 1;
      const uidRaw = await env.RATE_LIMIT.get(uidKey);
      const uids = uidRaw ? JSON.parse(uidRaw) : [];
      if (!uids.includes(ipHash)) {
        uids.push(ipHash);
        s.uv = uids.length;
        await env.RATE_LIMIT.put(uidKey, JSON.stringify(uids), { expirationTtl: 60 * 24 * 3600 });
      } else {
        s.uv = uids.length;
      }
    }
    s.events[e] = (s.events[e] || 0) + 1;
    if (v) {
      s.events[e + ':' + v] = (s.events[e + ':' + v] || 0) + 1;
    }
    await env.RATE_LIMIT.put(dayKey, JSON.stringify(s), { expirationTtl: 60 * 24 * 3600 });
  } catch (err) {}
}

async function handleTrack(request, env, ctx, headers) {
  if (!env.RATE_LIMIT) return new Response('ok', { status: 204, headers });
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const hourKey = `t-rate:${ip}:${new Date().toISOString().slice(0, 13)}`;
  const c = parseInt(await env.RATE_LIMIT.get(hourKey) || '0');
  if (c >= 120) return new Response('ok', { status: 204, headers });
  ctx.waitUntil(env.RATE_LIMIT.put(hourKey, String(c + 1), { expirationTtl: 3600 }));

  let e = '', p = '', r = '', v = '';
  if (request.method === 'GET') {
    const url = new URL(request.url);
    e = url.searchParams.get('e') || '';
    p = url.searchParams.get('p') || '';
    r = url.searchParams.get('r') || '';
    v = url.searchParams.get('v') || '';
  } else {
    let body = {};
    try { body = JSON.parse(await request.text() || '{}'); } catch (err) { body = {}; }
    e = body.e || '';
    p = body.p || '';
    r = body.r || '';
    v = body.v || '';
  }
  if (!TRACK_EVENTS.has(e)) return new Response('ok', { status: 204, headers });
  p = sanitizePath(p);
  r = String(r || '').replace(/^https?:\/\//, '').split('/')[0].slice(0, 80);
  v = TRACK_PROP_EVENTS.has(e) ? String(v).replace(/[^\w\-\u4e00-\u9fff]/g, '').slice(0, 32) : '';

  const day = new Date().toISOString().slice(0, 10);
  ctx.waitUntil(logTrack(env, { e, p, r, v, ip, day }));
  return new Response('ok', { status: 204, headers });
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin);
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    if (url.pathname === '/t' && (request.method === 'GET' || request.method === 'POST')) {
      return handleTrack(request, env, ctx, headers);
    }

    // GET /stats?token=xxx&days=14 — PMF 数据查询接口
    if (request.method === 'GET' && url.pathname === '/stats') {
      return handleStats(env, request, url, headers);
    }
    // GET /subscribers?token=xxx — 列出所有订阅者
    if (request.method === 'GET' && url.pathname === '/subscribers') {
      return handleSubscribers(env, request, url);
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
