// F-34: local test for the /api/subscribe guard. The real handler, Beehiiv stubbed in memory; nothing leaves the machine.
// Run: node scripts/subscribeGuardTest.mjs
import path from "node:path";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
process.env.BEEHIIV_API_KEY = "stub";
let sent = [];
globalThis.fetch = async (url, opts) => { sent.push(JSON.parse(opts.body).email); return new Response('{"data":{}}', { status: 201 }); };
const mod = await import(path.join(ROOT, "api", "subscribe.js"));
const handler = mod.default, T = mod._testing || null;
let pass = 0, fail = 0; const ok = (c, m) => { if (c) pass++; else { fail++; console.log("FAIL", m); } };
let ip = 1;
async function call(body, addr) {
  const r = { code: 0, body: null, status(c) { this.code = c; return this; }, json(o) { this.body = o; return this; } };
  try { await handler({ method: "POST", headers: { "x-forwarded-for": addr || `198.51.100.${ip++}` }, body }, r); } catch (e) { r.code = 500; }
  return r;
}
let r;
r = await call({ email: "reader@example.com" }); ok(r.code === 200 && sent.at(-1) === "reader@example.com", "a real address subscribes");
r = await call({ email: "  Reader.Name+cars@mail.example.co.uk " }); ok(r.code === 200 && sent.at(-1) === "Reader.Name+cars@mail.example.co.uk", "a plus address with spaces around it subscribes, trimmed");
r = await call({ email: "reader@example.com", website: "" }); ok(r.code === 200, "an empty honeypot is a person");
sent = [];
r = await call({ email: "reader@example.com", website: "http://spam.test" }); ok(r.code === 200 && r.body.success === true && sent.length === 0, "a filled honeypot looks like success and sends nothing");
for (const bad of ["@", "a@", "@b.com", "a@b", "a b@c.com", "a@b..com", "a..b@c.com", "a@b.c", "x".repeat(250) + "@b.com", "a@b.com,c@d.com", "a@b.com\nbcc:c@d.com", "<a@b.com>"]) {
  r = await call({ email: bad }); ok(r.code === 400, `refused: ${JSON.stringify(bad).slice(0, 40)}`);
}
for (const bad of [null, 42, ["a@b.com"], { x: 1 }]) { r = await call({ email: bad }); ok(r.code === 400, `refused non-string ${JSON.stringify(bad)}`); }
r = await call(undefined); ok(r.code === 400, "no body is refused, not a crash");
ok(sent.length === 0, "no refused request reached Beehiiv");
const codes = []; for (let i = 0; i < 5; i++) codes.push((await call({ email: `r${i}@example.com` }, "203.0.113.9")).code);
ok(codes.join() === "200,200,200,429,429", `3 a minute from one address, then 429 (${codes})`);
r = await call({ email: "other@example.com" }, "203.0.113.10"); ok(r.code === 200, "another address is not affected");
r = await handler({ method: "GET", headers: {} }, { code: 0, status(c) { this.code = c; return this; }, json() { return this; } }); 
console.log(`subscribeGuardTest: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
