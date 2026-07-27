export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://thedailyvroom.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; } const origin = req.headers['origin'] || '';
const referer = req.headers['referer'] || '';
const allowed = ['https://dailyvroom-calculator.vercel.app', 'https://thedailyvroom.com'];
const isAllowed = allowed.some(domain => origin.includes(domain) || referer.includes(domain));
if (!isAllowed) { res.status(403).json({ error: 'Forbidden' }); return; }

  try {
    const FALLBACK_RATES = {
      GBP: 1.27, EUR: 1.08, JPY: 0.0067, AUD: 0.63,
      CAD: 0.74, SEK: 0.092, CHF: 1.11, ZAR: 0.054
    };
    let rates = FALLBACK_RATES;
    let ratesDate = 'static fallback';
    try {
      const fxRes = await fetch(
        'https://api.frankfurter.app/latest?from=USD&to=GBP,EUR,JPY,AUD,CAD,SEK,CHF,ZAR',
        { signal: AbortSignal.timeout(3000) }
      );
      if (fxRes.ok) {
        const fxData = await fxRes.json();
        const raw = fxData.rates;
        rates = {
          GBP: Math.round((1/raw.GBP)*10000)/10000,
          EUR: Math.round((1/raw.EUR)*10000)/10000,
          JPY: Math.round((1/raw.JPY)*10000)/10000,
          AUD: Math.round((1/raw.AUD)*10000)/10000,
          CAD: Math.round((1/raw.CAD)*10000)/10000,
          SEK: Math.round((1/raw.SEK)*10000)/10000,
          CHF: Math.round((1/raw.CHF)*10000)/10000,
          ZAR: Math.round((1/raw.ZAR)*10000)/10000,
        };
        ratesDate = fxData.date;
      }
    } catch(e) { /* use fallback */ }

    let tariffs = null;
    let tariffsDate = 'unknown';
    try {
      const tRes = await fetch(
        'https://raw.githubusercontent.com/TDV2026/dailyvroom-calculator/main/rates.json',
        { signal: AbortSignal.timeout(3000) }
      );
      if (tRes.ok) {
        tariffs = await tRes.json();
        tariffsDate = tariffs.updated || 'unknown';
      }
    } catch(e) { /* use Claude's built-in knowledge */ }

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

${tariffs ? `Tariff rates as of ${tariffsDate}:
US import duty (non-exempt): ${tariffs.import_duty.US.base*100}% base + ${tariffs.import_duty.US.section_232*100}% Section 232 = ${tariffs.import_duty.US.total_non_exempt*100}% total
US 25-year rule: waives EPA/DOT only, Section 232 still applies
UK duty from non-EU: ${tariffs.import_duty.UK.from_non_eu*100}%
UK duty from EU: ${tariffs.import_duty.UK.from_eu*100}%
EU duty from outside EU: ${tariffs.import_duty.DE.from_outside_eu*100}%
Australia duty: ${tariffs.import_duty.AU.base*100}% + ${tariffs.import_duty.AU.gst*100}% GST + ${tariffs.import_duty.AU.lct_rate*100}% LCT above AUD ${tariffs.import_duty.AU.lct_threshold_aud.toLocaleString()}
Canada duty from non-USMCA: ${tariffs.import_duty.CA.from_other*100}%
Japan duty: ${tariffs.import_duty.JP.base*100}% + ${tariffs.import_duty.JP.consumption_tax*100}% consumption tax
UK VAT: ${tariffs.vat_and_sales_tax.UK.vat*100}%
Germany VAT: ${tariffs.vat_and_sales_tax.DE.vat*100}%
France VAT: ${tariffs.vat_and_sales_tax.FR.vat*100}%
Netherlands VAT: ${tariffs.vat_and_sales_tax.NL.vat*100}%
Australia GST: ${tariffs.vat_and_sales_tax.AU.gst*100}%
Canada GST: ${tariffs.vat_and_sales_tax.CA.gst*100}%
Japan consumption tax: ${tariffs.vat_and_sales_tax.JP.consumption_tax*100}%
RoRo freight UK/EU to US: $${tariffs.roro_freight_usd.UK_to_US.min}-${tariffs.roro_freight_usd.UK_to_US.max}
RoRo freight Japan to US West Coast: $${tariffs.roro_freight_usd.JP_to_US_west.min}-${tariffs.roro_freight_usd.JP_to_US_west.max}
RoRo freight Australia to US: $${tariffs.roro_freight_usd.AU_to_US.min}-${tariffs.roro_freight_usd.AU_to_US.max}
Port and broker: $${tariffs.port_and_broker_usd.min}-${tariffs.port_and_broker_usd.max}
Final mile: $${tariffs.final_mile_usd.min}-${tariffs.final_mile_usd.max}
Marine insurance: ${tariffs.marine_insurance_rate*100}% of vehicle value
` : 'Tariff data unavailable - use your best knowledge of current rates.'}

Use these exact rates. Do not use any other rates or figures.`;

    const { log, model, max_tokens, messages, system } = req.body;

    // Log-only request (intent or result update) — skip Anthropic call
    if (log && !messages) {
      if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
        try {
          const { row_id, total_landed, delta_percent } = log;
          const intentVal = log.Intent || log.intent;
          console.log('Update request:', { row_id, intentVal, total_landed, delta_percent });
          if (row_id) {
            const updateData = {};
            if (intentVal) updateData.Intent = intentVal;
            if (total_landed !== undefined) updateData.total_landed = total_landed;
            if (delta_percent !== undefined) updateData.delta_percent = delta_percent;
            if (Object.keys(updateData).length > 0) {
              const sbRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/calculations?id=eq.${row_id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': process.env.SUPABASE_ANON_KEY,
                  'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
                  'Prefer': 'return=minimal'
                },
                body: JSON.stringify(updateData)
              });
              console.log('Supabase PATCH status:', sbRes.status);
            }
          }
        } catch(logErr) {
          console.error('Supabase update error:', logErr);
        }
      }
      res.status(200).json({ success: true });
      return;
    }

    const enrichedMessages = (messages || []).map(msg => {
      if (msg.role === 'user') {
        return { ...msg, content: msg.content + rateContext };
      }
      return msg;
    });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model, max_tokens, messages: enrichedMessages, system })
    });

    const data = await response.json();

    // Log to Supabase and capture row ID
    if (log && process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      try {
        const sbRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/calculations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(log)
        });
        const sbData = await sbRes.json();
        const rowId = sbData[0]?.id;
        if (rowId) {
          data._supabase_row_id = rowId;
        }
      } catch(logErr) {
        console.error('Supabase log error:', logErr);
      }
    }

    res.status(response.status).json(data);

  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
