const MAX_STRING_LENGTH = 2000;
const MAX_KEYS = 100;
const MAX_DEPTH = 4;
const HTML_CHARS = /[<>]/;

function generateToken() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 6; i++) token += chars[Math.floor(Math.random() * chars.length)];
  return token;
}

function supabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}

function validatePayload(value, depth = 0) {
  if (depth > MAX_DEPTH) return 'payload too deeply nested';
  if (value === null) return null;
  const t = typeof value;
  if (t === 'number') return Number.isFinite(value) ? null : 'invalid number';
  if (t === 'boolean') return null;
  if (t === 'string') {
    if (value.length > MAX_STRING_LENGTH) return 'string too long';
    if (HTML_CHARS.test(value)) return 'invalid characters in string';
    return null;
  }
  if (Array.isArray(value)) {
    if (value.length > MAX_KEYS) return 'array too large';
    for (const item of value) {
      const err = validatePayload(item, depth + 1);
      if (err) return err;
    }
    return null;
  }
  if (t === 'object') {
    const entries = Object.entries(value);
    if (entries.length > MAX_KEYS) return 'object too large';
    for (const [key, v] of entries) {
      if (key.length > 200 || HTML_CHARS.test(key)) return 'invalid key';
      const err = validatePayload(v, depth + 1);
      if (err) return err;
    }
    return null;
  }
  return 'unsupported value type';
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = req.query.token;
    if (!token) return res.status(400).json({ error: 'No token' });
    if (!supabaseConfigured()) return res.status(500).json({ error: 'Supabase not configured' });

    try {
      const sbRes = await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/shared_calculations?token=eq.${encodeURIComponent(token)}&select=*`,
        { headers: { apikey: process.env.SUPABASE_ANON_KEY, Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}` } }
      );
      const data = await sbRes.json();
      if (!data || data.length === 0) return res.status(404).json({ error: 'Not found' });
      const row = data[0];
      await fetch(`${process.env.SUPABASE_URL}/rest/v1/shared_calculations?id=eq.${row.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ open_count: (row.open_count || 0) + 1, last_opened: new Date().toISOString() }),
      });
      return res.status(200).json({ inputs: row.inputs, outputs: row.outputs });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'POST') {
    const { inputs, outputs } = req.body;
    if (!inputs || !outputs) return res.status(400).json({ error: 'Missing data' });
    if (typeof inputs !== 'object' || Array.isArray(inputs) || typeof outputs !== 'object' || Array.isArray(outputs)) {
      return res.status(400).json({ error: 'Invalid data' });
    }
    for (const [label, payload] of [['inputs', inputs], ['outputs', outputs]]) {
      const err = validatePayload(payload);
      if (err) return res.status(400).json({ error: `Invalid ${label}: ${err}` });
    }
    if (!supabaseConfigured()) return res.status(500).json({ error: 'Supabase not configured' });

    try {
      const token = generateToken();
      const sbRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/shared_calculations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify({ token, inputs, outputs }),
      });
      const data = await sbRes.json();
      return res.status(200).json({ token: data[0].token });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
