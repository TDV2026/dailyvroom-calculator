export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const isStaging = (process.env.RUNBUGGY_ENV || 'staging') === 'staging';
  const BASE_URL = isStaging
    ? 'https://ng-staging.runbuggy.com/staging/api'
    : 'https://apps.runbuggy.com/v2/api';

  const BEARER = process.env.RUNBUGGY_BEARER_TOKEN;
  if (!BEARER) {
    return res.status(500).json({ error: 'RunBuggy token not configured' });
  }

  try {
    const { action, payload } = req.body;

    if (action === 'quote') {
      const { pickupAddress, dropoffAddress, year, make, model, isOperational, isOverSized, enclosureType } = payload;
      const fareObj = { name: 'Platinum' };
      if (enclosureType === 'ENCLOSED') fareObj.options = ['Enclosed'];

      const body = {
        type: 'BASIC',
        fare: fareObj,
        vehicleTransferOrders: [{
          directions: {
            pickup: { address: pickupAddress, type: 'personal' },
            dropoff: { address: dropoffAddress, type: 'personal' },
          },
          vehicle: { year: parseInt(year), make, model, isOperational: isOperational !== false, isOverSized: isOverSized === true },
        }],
      };

      const rbRes = await fetch(`${BASE_URL}/orders/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${BEARER}` },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(29000),
      });

      const rbData = await rbRes.json();
      if (!rbRes.ok) {
        return res.status(rbRes.status).json({ error: rbData.message || 'Quote failed', details: rbData });
      }

      const quote = rbData.quotes?.[0] || rbData;
      const fare = Math.round(parseFloat(quote.fare || quote.totalFare || 0));
      const distanceMiles = parseFloat(quote.distanceInMiles || 0);

      let supabaseRowId = null;
      if (enclosureType === 'OPEN' && process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
        try {
          const sbRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/shipping_quotes`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: process.env.SUPABASE_ANON_KEY,
              Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
              Prefer: 'return=representation',
            },
            body: JSON.stringify({ origin: pickupAddress, dest: dropoffAddress, year: String(year), make, model, open_fare: fare, enclosed_fare: null, distance_miles: distanceMiles, converted_to_booking: false }),
          });
          const sbData = await sbRes.json();
          supabaseRowId = sbData[0]?.id || null;
        } catch { /* non-critical */ }
      }

      return res.status(200).json({ fare, distanceMiles, raw: rbData, _supabase_row_id: supabaseRowId });
    }

    if (action === 'update_quote') {
      const { row_id, enclosed_fare } = payload;
      if (row_id && process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
        try {
          await fetch(`${process.env.SUPABASE_URL}/rest/v1/shipping_quotes?id=eq.${row_id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              apikey: process.env.SUPABASE_ANON_KEY,
              Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
              Prefer: 'return=minimal',
            },
            body: JSON.stringify({ enclosed_fare }),
          });
        } catch { /* non-critical */ }
      }
      return res.status(200).json({ success: true });
    }

    if (action === 'book') {
      const { pickupAddress, dropoffAddress, year, make, model, isOperational, isOverSized, enclosureType, customerName, customerEmail, customerPhone, customerNotes, vehicleValue, supabaseRowId } = payload;
      const fareObj = { name: 'Platinum' };
      if (enclosureType === 'ENCLOSED') fareObj.options = ['Enclosed'];

      const notesStr = `Primary Contact: ${customerName} | Phone: ${customerPhone} | Email: ${customerEmail}${customerNotes ? ' | Notes: ' + customerNotes : ''}`;
      const contact = { name: customerName, phone: customerPhone || '', email: customerEmail, notify: true };

      const body = {
        type: 'BASIC',
        status: 'COMPLETE_DRAFT',
        fare: fareObj,
        notes: notesStr,
        labels: { value: String(Math.round(vehicleValue || 0)) },
        vehicleTransferOrders: [{
          directions: {
            pickup: { address: pickupAddress, type: 'personal', contact },
            dropoff: { address: dropoffAddress, type: 'personal', contact },
          },
          vehicle: { year: parseInt(year), make, model, isOperational: isOperational !== false, isOverSized: isOverSized === true },
        }],
        payer: { id: process.env.RUNBUGGY_COMPANY_ID, name: 'The Daily Vroom', type: 'SHIPPER' },
      };

      const rbRes = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${BEARER}` },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(29000),
      });

      const rbData = await rbRes.json();
      if (!rbRes.ok) {
        return res.status(rbRes.status).json({ error: rbData.message || 'Booking failed', details: rbData });
      }

      const orderId = rbData.id || rbData.orderId || rbData.orderNumber;
      const trackingUrl = rbData.trackingUrl || (orderId ? `https://app.runbuggy.com/track/${orderId}` : null);

      if (supabaseRowId && process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
        try {
          await fetch(`${process.env.SUPABASE_URL}/rest/v1/shipping_quotes?id=eq.${supabaseRowId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              apikey: process.env.SUPABASE_ANON_KEY,
              Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
              Prefer: 'return=minimal',
            },
            body: JSON.stringify({ converted_to_booking: true }),
          });
        } catch { /* non-critical */ }
      }

      return res.status(200).json({ success: true, orderId, trackingUrl, raw: rbData });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
