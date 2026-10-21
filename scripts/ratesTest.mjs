// F-35: api/calculate.js no longer fetches a tariff table from raw.githubusercontent.com, and injects exchange rates only.
// The real handler, every outside call stubbed (nothing leaves the machine). Run: node scripts/ratesTest.mjs
import path from "node:path"; import fs from "node:fs";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
Object.assign(process.env, { ANTHROPIC_API_KEY: "stub", SUPABASE_URL: "https://db.stub", SUPABASE_ANON_KEY: "anon" });
const seen = []; let sentToClaude = null;
globalThis.fetch = async (url, opts = {}) => {
  const u = String(url); seen.push(u);
  const J = (v, s = 200) => new Response(JSON.stringify(v), { status: s });
  if (/raw\.githubusercontent/.test(u)) return J({ error: "Not Found" }, 404);   // what production gets today: the file is not at the root of main
  if (u.includes("frankfurter")) return J({ date: "2026-10-21", rates: { GBP: 0.79, EUR: 0.92, JPY: 150, AUD: 1.5, CAD: 1.37, SEK: 10.8, CHF: 0.9, ZAR: 18.5 } });
  if (u.includes("api.anthropic.com")) { sentToClaude = JSON.parse(opts.body); return J({ content: [{ type: "text", text: "{}" }] }); }
  return J({});
};
const handler = (await import(path.join(ROOT, "api", "calculate.js"))).default;
let pass = 0, fail = 0; const ok = (c, m) => { if (c) pass++; else { fail++; console.log("FAIL", m); } };
const r = { code: 0, body: null, status(c) { this.code = c; return this; }, json(o) { this.body = o; return this; } };
await handler({ method: "POST", headers: { origin: "https://thedailyvroom.com", "x-forwarded-for": "198.51.100.1" }, body: { messages: [{ role: "user", content: "Car import for The Daily Vroom. 1995 Acura NSX" }] } }, r);
const text = sentToClaude && sentToClaude.messages[0].content;
ok(r.code === 200 && text, "a calculation reaches Claude");
ok(!seen.some(u => /raw\.githubusercontent|rates\.json|github/.test(u)), "no request to raw.githubusercontent.com or GitHub");
ok(/Exchange rates as of 2026-10-21/.test(text) && /1 JPY = 0\.0067 USD/.test(text) && /1 GBP = 1\.2658 USD/.test(text), "the live exchange rates are still injected");
ok(!/Tariff rates as of|Tariff data unavailable|best knowledge|27\.5% total|Section 232 still applies/.test(text), "no tariff table and no 'use your best knowledge' line is appended");
ok(text.startsWith("Car import for The Daily Vroom. 1995 Acura NSX"), "the page's own prompt comes first, unchanged");
ok(/exchange rates/.test(text) && !/Use these exact rates\. Do not use any other rates or figures\./.test(text), "the closing line speaks only of exchange rates (it no longer forbids the page prompt's own duty and freight figures)");
const src = fs.readFileSync(path.join(ROOT, "api", "calculate.js"), "utf8").split("\n").filter(l => !/^\s*\/\//.test(l)).join("\n");   // code only, comments out
ok(!/raw\.githubusercontent/.test(src) && !/tariffs\./.test(src), "the source has no raw fetch and no tariffs reference");
const gi = fs.readFileSync(path.join(ROOT, ".gitignore"), "utf8");
ok(/^\.env$/m.test(gi) && /^\.env\.\*$/m.test(gi) && /^\.vercel$/m.test(gi) && /^node_modules\/$/m.test(gi) && /^\*\.pem$/m.test(gi), ".gitignore covers .env, .env.*, .vercel, node_modules and key files");
console.log(`ratesTest: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
