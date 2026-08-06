# 部署 Cloudflare Worker 代理 DeepSeek API

## 为什么需要 Worker 代理？

直接把 API Key 放在前端代码里 = 任何人都能拿到你的 key 偷用你的余额。
Worker 代理把 key 存在 Cloudflare 服务端，前端只调用你的 Worker URL，key 永远不暴露。

---

## 部署步骤

### 1. 安装 Wrangler（Cloudflare CLI）

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

浏览器会打开 Cloudflare 授权页面，点击允许。

### 3. 部署 Worker

```bash
wrangler deploy
```

会输出一个 URL，类似：`https://deepseek-proxy.xxx.workers.dev`

**记下这个 URL！**

### 4. 设置 API Key（加密存储，不写入代码）

```bash
wrangler secret put DEEPSEEK_API_KEY
```

粘贴你的 DeepSeek API Key：`sk-24f3c3707606420797941b1490529477`

### 5. 验证 Worker

```bash
curl https://deepseek-proxy.xxx.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"你好"}],"max_tokens":50}'
```

返回 JSON 表示成功。

### 6. 在简历生成器中配置

打开 `https://www.jayzzhang.online/apps/resume-builder/`

- 展开左侧"AI 修改建议"
- **API Key 留空**
- **Worker 代理地址** 填入：`https://deepseek-proxy.xxx.workers.dev`
- 点击"获取 AI 建议"测试

---

## 费用

Cloudflare Workers 免费额度：**每天 10 万次请求**，博客流量完全够用。

---

## 安全架构

```
用户浏览器 → Cloudflare Worker（key 在环境变量） → DeepSeek API
              ↑
         用户永远看不到 key
```

- ✅ API Key 存在 Cloudflare 加密存储
- ✅ 前端代码里没有 key
- ✅ 请求从 Cloudflare 边缘节点发出，延迟低
- ✅ 可以加 Rate Limiting 防止滥用

---

## 可选：添加 Rate Limiting

在 worker.js 中加入简单限流（基于 IP）：

```javascript
// 在 fetch handler 顶部加入
const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
const rateLimitKey = `rate:${ip}`;
const current = await env.RATE_LIMIT.get(rateLimitKey);
if (current && parseInt(current) > 10) {
  return new Response('Rate limit exceeded', { status: 429 });
}
await env.RATE_LIMIT.put(rateLimitKey, (parseInt(current || 0) + 1).toString(), { expirationTtl: 60 });
```

需要在 Cloudflare Dashboard 创建 KV Namespace `RATE_LIMIT` 并绑定到 Worker。
