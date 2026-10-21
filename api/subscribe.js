// GUARD (Oct 21 2026, F-34): this route used to subscribe any string with an @ in it, with no limit, so a script
// could sign up lists of strangers (each gets our welcome email). Now:
//  - a hidden honeypot field (website) that people never see or fill: a request that fills it is answered as a
//    success and nothing is sent to Beehiiv, so a bot learns nothing;
//  - the email is checked on the server (one plain address, at most 254 characters, a real looking domain);
//  - a per-address limit held in this instance's memory (weak on serverless: each instance counts on its own; the
//    durable limit is the Vercel Firewall rule on /api/).
// Not here yet (Sam later): Turnstile (new keys) and the Beehiiv double opt-in (a Beehiiv setting).
const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,24}$/;
const LIMITS = [[60e3, 3], [3600e3, 10], [86400e3, 20]];   // signups per address: a minute, an hour, a day
const hits = new Map();
function validEmail(email) {
  return typeof email === 'string' && email.length <= 254 && EMAIL_RE.test(email) && !email.includes('..');
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
export const _testing = { validEmail, overLimit, hits };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  if (body.website) return res.status(200).json({ success: true });
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (!validEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  if (overLimit(clientAddress(req))) {
    return res.status(429).json({ error: 'Too many signups from here. Please try again later.' });
  }

  if (!process.env.BEEHIIV_API_KEY) {
    return res.status(500).json({ error: 'BEEHIIV_API_KEY not configured' });
  }

  try {
    const response = await fetch(
      'https://api.beehiiv.com/v2/publications/pub_43609e6b-5dfc-4d3f-ad77-48488b02df50/subscriptions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: 'import-calculator',
          utm_medium: 'web',
        }),
      }
    );
    const data = await response.json();
    if (response.ok) return res.status(200).json({ success: true });
    return res.status(400).json({ error: data });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
