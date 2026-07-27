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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    const response = await fetch('https://api.beehiiv.com/v2/publications/pub_43609e6b-5dfc-4d3f-ad77-48488b02df50/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`
      },
      body: JSON.stringify({
        email,
        reactivate_existing: false,
        send_welcome_email: true,
        utm_source: 'import-calculator',
        utm_medium: 'web'
      })
    });

    const data = await response.json();
    if (response.ok) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: data });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
