const FALLBACK_RATES = {
  GBP: 1.27, EUR: 1.08, JPY: 0.0067, AUD: 0.63,
  CAD: 0.74, SEK: 0.092, CHF: 1.11, ZAR: 0.054,
};

// GUARD (Oct 21 2026, F-33): this route used to forward the request's model, max_tokens, system and messages to
// Anthropic with our key and no limit, so anyone could use it as a free general Claude endpoint. Now:
//  - a kill switch: CALCULATE_OFF=1 in the environment answers 503 (needs a redeploy to take effect, see the notes);
//  - an origin check: only the calculator's own pages (DEFAULT_ORIGINS below, and this project's Vercel previews;
//    ALLOWED_ORIGINS adds more, comma separated) may call it; a request with no Origin is refused;
//  - the server fixes the model, max_tokens and the system prompt to exactly what the calculator page sends, and
//    accepts exactly one user message of at most 24,000 characters (the page's prompt is about 15,400);
//  - a per-address limit on calculations (requests that reach Claude) held in this instance's memory (weak on
//    serverless: each instance counts on its own; the durable limit is a Vercel Firewall rate-limit rule).
const CALC_MODEL = 'claude-haiku-4-5';
const CALC_MAX_TOKENS = 2500;
const CALC_SYSTEM = 'You are a car import cost calculator. Return ONLY a valid JSON object. No markdown, no text before or after. Never use literal newlines inside JSON string values, use \\n instead.';
const MAX_PROMPT_CHARS = 24000;
const MAX_BODY_CHARS = 40000;
const LIMITS = [[60e3, 6], [3600e3, 40], [86400e3, 150]];   // calculations per address: a minute, an hour, a day
const hits = new Map();
// The calculator's own pages (Sam, Oct 21 2026): its custom domain, its Vercel address and the two pages that embed it.
const DEFAULT_ORIGINS = ['https://calculator.thedailyvroom.com', 'https://dailyvroom-calculator.vercel.app', 'https://thedailyvroom.com', 'https://www.thedailyvroom.com'];
function allowedOrigin(origin) {
  const o = String(origin || '').toLowerCase();
  if (DEFAULT_ORIGINS.includes(o)) return true;
  if (/^https:\/\/dailyvroom-calculator(-[a-z0-9-]+)?\.vercel\.app$/.test(o)) return true;
  return String(process.env.ALLOWED_ORIGINS || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean).includes(o);
}
function clientAddress(req) {
  return String((req.headers && req.headers['x-forwarded-for']) || '').split(',')[0].trim() || (req.socket && req.socket.remoteAddress) || 'unknown';
}
function overLimit(addr, now = Date.now()) {
  const list = (hits.get(addr) || []).filter(t => now - t < 86400e3);
  const over = LIMITS.some(([win, max]) => list.filter(t => now - t < win).length >= max);
  if (!over) list.push(now);
  hits.set(addr, list);
  if (hits.size > 5000) { for (const k of hits.keys()) { hits.delete(k); if (hits.size <= 4000) break; } }
  return over;
}
export const _testing = { allowedOrigin, overLimit, hits, CALC_MODEL, CALC_MAX_TOKENS, CALC_SYSTEM };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (process.env.CALCULATE_OFF === '1') {
    return res.status(503).json({ error: 'The calculator is paused for a moment. Please try again later.' });
  }
  if (!allowedOrigin(req.headers && req.headers.origin)) {
    return res.status(403).json({ error: 'Not allowed' });
  }
  let bodyChars = 0;
  try { bodyChars = JSON.stringify(req.body || {}).length; } catch { bodyChars = MAX_BODY_CHARS + 1; }
  if (bodyChars > MAX_BODY_CHARS) return res.status(413).json({ error: 'Request too large' });
  // The limit counts only requests that reach Claude (the cost): the page's log-only updates (the result and the
  // intent, and opening a share link) do not count, so a visitor pricing a few cars never meets it.
  if (req.body && req.body.messages && overLimit(clientAddress(req))) {
    return res.status(429).json({ error: 'A lot of people are running numbers right now. Please try again in a minute.' });
  }

  try {
    // Live FX rates
    let rates = { ...FALLBACK_RATES };
    let ratesDate = 'static fallback';
    try {
      const fxRes = await fetch(
        'https://api.frankfurter.app/latest?from=USD&to=GBP,EUR,JPY,AUD,CAD,SEK,CHF,ZAR',
        { signal: AbortSignal.timeout(3000) }
      );
      if (fxRes.ok) {
        const fxData = await fxRes.json();
        rates = Object.fromEntries(
          Object.keys(FALLBACK_RATES).map(c => [c, Math.round((1 / fxData.rates[c]) * 10000) / 10000])
        );
        ratesDate = fxData.date;
      }
    } catch { /* use fallback */ }

    // NO TARIFF TABLE IS INJECTED (F-35, Oct 21 2026). This used to fetch rates.json from raw.githubusercontent.com. That
    // file is not at the root of main (only .migration-backup/rates.json, dated 2026-03-29), so the fetch has answered 404
    // since the move and never worked on a private repo. The calculation has run on the duty rules, freight, port, final mile and
    // insurance figures carried in the page's own prompt (index.html, the 2026 rules: the 25-year exemption, the UK 10%
    // and EU/Japan 15% trade-deal rates). The backup file CONTRADICTS those rules (27.5% on every origin, Section 232 on
    // 25-year cars) and the injected block says "use these exact rates", so bundling it would have made the answers
    // wrong. The page's prompt stays the one source; the exchange rates below are still live.

    const rateContext = `

LIVE DATA INJECTED BY SYSTEM - USE THESE EXACT FIGURES:

Exchange rates as of ${ratesDate} (European Central Bank):
1 GBP = ${rates.GBP} USD
1 EUR = ${rates.EUR} USD
1 JPY = ${rates.JPY} USD
1 AUD = ${rates.AUD} USD
1 CAD = ${rates.CAD} USD
1 SEK = ${rates.SEK} USD
1 CHF = ${rates.CHF} USD
1 ZAR = ${rates.ZAR} USD

Use these exchange rates for every currency conversion.`;

    // The client's model, max_tokens and system are ignored (F-33): the server uses its own, the calculator's values.
    const { log, messages } = req.body || {};

    // Log-only request (intent or result update) — skip Anthropic call
    if (log && !messages) {
      if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
        try {
          const { row_id, total_landed, delta_percent } = log;
          const intentVal = log.Intent || log.intent;
          if (row_id) {
            const updateData = {};
            if (intentVal) updateData.Intent = intentVal;
            if (total_landed !== undefined) updateData.total_landed = total_landed;
            if (delta_percent !== undefined) updateData.delta_percent = delta_percent;
            if (Object.keys(updateData).length > 0) {
              await fetch(`${process.env.SUPABASE_URL}/rest/v1/calculations?id=eq.${row_id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  apikey: process.env.SUPABASE_ANON_KEY,
                  Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
                  Prefer: 'return=minimal',
                },
                body: JSON.stringify(updateData),
              });
            }
          }
        } catch (err) { console.error('Supabase PATCH failed:', err.message); }
      }
      return res.status(200).json({ success: true });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
    }

    // Exactly one user message with string content, as the calculator page sends (F-33).
    if (!Array.isArray(messages) || messages.length !== 1 || !messages[0] || messages[0].role !== 'user'
        || typeof messages[0].content !== 'string' || !messages[0].content.trim() || messages[0].content.length > MAX_PROMPT_CHARS) {
      return res.status(400).json({ error: 'Bad request' });
    }
    const enrichedMessages = [{ role: 'user', content: messages[0].content + rateContext }];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ model: CALC_MODEL, max_tokens: CALC_MAX_TOKENS, messages: enrichedMessages, system: CALC_SYSTEM }),
    });

    const data = await response.json();

    // Log to Supabase
    if (log && process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      try {
        const sbRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/calculations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: process.env.SUPABASE_ANON_KEY,
            Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
            Prefer: 'return=representation',
          },
          body: JSON.stringify(log),
        });
        const sbData = await sbRes.json();
        if (!sbRes.ok) {
          data._supabase_error = { status: sbRes.status, body: sbData };
        } else {
          const rowId = sbData[0]?.id;
          if (rowId) data._supabase_row_id = rowId;
        }
      } catch (err) {
        data._supabase_error = { message: err.message };
      }
    }

    return res.status(response.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
