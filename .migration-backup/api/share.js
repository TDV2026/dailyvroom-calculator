function generateToken() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 6; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://dailyvroom-calculator.vercel.app,https://thedailyvroom.com')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'GET') {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'No token' });
    try {
      const sbRes = await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/shared_calculations?token=eq.${token}&select=*`,
        { headers: { 'apikey': process.env.SUPABASE_ANON_KEY, 'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}` } }
      );
      const data = await sbRes.json();
      if (!data || data.length === 0) return res.status(404).json({ error: 'Not found' });
      const row = data[0];
      await fetch(`${process.env.SUPABASE_URL}/rest/v1/shared_calculations?id=eq.${row.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'apikey': process.env.SUPABASE_ANON_KEY, 'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ open_count: (row.open_count || 0) + 1, last_opened: new Date().toISOString() })
      });
      return res.status(200).json({ inputs: row.inputs, outputs: row.outputs });
    } catch(e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'POST') {
    const { inputs, outputs } = req.body;
    if (!inputs || !outputs) return res.status(400).json({ error: 'Missing data' });
    try {
      const token = generateToken();
      const sbRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/shared_calculations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': process.env.SUPABASE_ANON_KEY, 'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`, 'Prefer': 'return=representation' },
        body: JSON.stringify({ token, inputs, outputs })
      });
      const data = await sbRes.json();
      return res.status(200).json({ token: data[0].token });
    } catch(e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
