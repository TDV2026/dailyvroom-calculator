import { useState } from "react";
const CURRENCY={JP:{s:'¥',c:'JPY'},UK:{s:'£',c:'GBP'},DE:{s:'€',c:'EUR'},IT:{s:'€',c:'EUR'},FR:{s:'€',c:'EUR'},NL:{s:'€',c:'EUR'},SE:{s:'kr',c:'SEK'},CH:{s:'Fr',c:'CHF'},US:{s:'$',c:'USD'},AU:{s:'A$',c:'AUD'},CA:{s:'C$',c:'CAD'},ZA:{s:'R',c:'ZAR'}};
const DEST={US:{s:'$',c:'USD'},UK:{s:'£',c:'GBP'},DE:{s:'€',c:'EUR'},FR:{s:'€',c:'EUR'},AU:{s:'A$',c:'AUD'},CA:{s:'C$',c:'CAD'},NL:{s:'€',c:'EUR'},JP:{s:'¥',c:'JPY'}};
const CN={JP:'Japan',UK:'United Kingdom',DE:'Germany',IT:'Italy',FR:'France',US:'United States',AU:'Australia',CA:'Canada',NL:'Netherlands',SE:'Sweden',CH:'Switzerland',ZA:'South Africa'};
const MSGS=['Reading current tariff rates...','Calculating import duty...','Checking compliance rules...','Estimating shipping costs...',"Writing Sam's Take..."];
const CARS={'Alfa Romeo':['GTV','Spider','Montreal','Giulia','Brera','8C Competizione'],'Aston Martin':['DB5','DB6','DB7','DB9','DB11','Vantage','DBS','Vanquish'],'BMW':['2002','M3 E30','M3 E36','M3 E46','M3 E92','M5 E39','M5 E60','635 CSi','850i','Z8','Z3 M Roadster'],'Datsun/Nissan':['240Z','260Z','280Z','280ZX','300ZX Z31','300ZX Z32'],'Ferrari':['308 GTB','328','348','355','360 Modena','430','458','Testarossa','F40','F50','Enzo','812'],'Ford':['Mustang Boss 302','Mustang Mach 1','Mustang GT500','GT40','Sierra Cosworth','Escort Cosworth','Focus RS','GT'],'Honda':['NSX NA1','NSX NA2','S2000','Civic Type R EK9','Integra Type R DC2','Beat','S660'],'Jaguar':['E-Type S1','E-Type S2','E-Type S3','XJ-S','XK8','XKR','F-Type'],'Lamborghini':['Countach','Diablo','Murcielago','Gallardo','Huracan','Aventador'],'Land Rover':['Defender 90','Defender 110','Series II','Series III','Range Rover Classic','Range Rover P38'],'Lancia':['Stratos','037','Delta Integrale','Delta HF Turbo'],'Lotus':['Elan','Europa','Esprit','Elise S1','Elise S2','Exige','Evora'],'Mazda':['RX-7 FB','RX-7 FC','RX-7 FD','MX-5 NA','MX-5 NB','MX-5 NC','RX-8'],'Mercedes-Benz':['190E 2.3-16','190E 2.5-16 Evo','300SL Gullwing','300SL Roadster','560SL','R107 SL','W124 500E','CLK GTR','SLR McLaren'],'Mitsubishi':['Lancer Evo I','Lancer Evo II','Lancer Evo III','Lancer Evo IV','Lancer Evo V','Lancer Evo VI','Lancer Evo VII','Lancer Evo VIII','Lancer Evo IX','Lancer Evo X','GTO/3000GT'],'Nissan':['Skyline GT-R R32','Skyline GT-R R33','Skyline GT-R R34','Silvia S13','Silvia S14','Silvia S15','180SX','Fairlady Z Z32','Stagea 260RS'],'Porsche':['356 A','356 B','912','914','924','928 S','928 GTS','944','944 Turbo','944 S2','968','911 Carrera RS 2.7','911 930 Turbo','911 SC','911 3.2 Carrera','911 964 C2','911 964 C4','911 964 Turbo','911 964 RS','911 993 Carrera','911 993 Turbo','911 993 GT2','911 993 RS','911 996 Carrera','911 996 Turbo','911 996 GT2','911 996 GT3','911 996 GT3 RS','911 997 Carrera S','911 997 Turbo','911 997 Turbo S','911 997 GT2 RS','911 997 GT3','911 997 GT3 RS','911 991 Carrera S','911 991 Turbo S','911 991 GT3','911 991 GT3 RS','911 991 GT2 RS','911 991 R','911 992 Carrera S','911 992 Turbo S','911 992 GT3','Boxster 986','Boxster 987','Boxster 981','Cayman 987','Cayman 981','Cayman GT4','Cayman GT4 RS','959','Carrera GT','918 Spyder'],'Subaru':['Impreza WRX GC8','Impreza WRX STI GD','Legacy RS','SVX'],'Toyota':['2000GT','Supra A70','Supra A80','MR2 AW11','MR2 SW20','Celica GT-Four','Corolla AE86','Land Cruiser FJ40'],'Volkswagen':['Golf GTI Mk1','Golf GTI Mk2','Corrado VR6','Scirocco'],'Other / Not Listed':['Type model below']};

const css=`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Mono:wght@400&family=DM+Sans:wght@300;400&display=swap');.vr{--ch:#1c1c1c;--cm:#242424;--cl:#2e2e2e;--bd:rgba(242,237,230,0.08);--ow:#f0ebe3;--dm:#b8b2a8;--mu:rgba(240,235,227,0.28);--tr:#c4603a;--th:#d4714b;}.vr *{box-sizing:border-box;margin:0;padding:0;}.vr{background:var(--ch);color:var(--ow);font-family:'DM Sans',sans-serif;font-weight:300;min-height:100vh;}.rl{height:2px;background:linear-gradient(90deg,transparent,var(--tr) 30%,var(--tr) 70%,transparent);}.hd{padding:18px 32px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--bd);}.wm{font-family:'Playfair Display',serif;font-size:17px;font-weight:400;}.wm em{font-style:italic;color:var(--tr);}.pl{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:var(--dm);border:1px solid var(--bd);padding:5px 11px;border-radius:1px;}.hero{max-width:560px;margin:0 auto;padding:52px 20px 40px;text-align:center;}.kk{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:var(--tr);margin-bottom:16px;}.hero h1{font-family:'Playfair Display',serif;font-size:clamp(26px,4vw,40px);font-weight:400;line-height:1.2;margin-bottom:14px;}.hero h1 em{font-style:italic;color:var(--tr);}.hs{font-size:13px;line-height:1.75;color:var(--dm);max-width:420px;margin:0 auto;}.dv{max-width:660px;margin:0 auto;height:1px;background:var(--bd);}.sh{max-width:660px;margin:0 auto;padding:0 20px 60px;}.pn{background:var(--cm);border:1px solid var(--bd);border-radius:2px;margin-top:2px;}.ph{padding:18px 28px 0;}.pb{padding:22px 28px 28px;}.lb{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:var(--tr);padding-bottom:14px;border-bottom:1px solid rgba(196,96,58,0.2);}.sp{height:1px;background:var(--bd);margin:0 28px;}.g2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;}.mt{margin-top:16px;}.fi{display:flex;flex-direction:column;gap:6px;}.fi label{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:var(--dm);}.fi select,.fi input{background:var(--cl);border:1px solid rgba(242,237,230,0.1);border-radius:2px;color:var(--ow);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:300;padding:10px 12px;outline:none;transition:border-color 0.18s;width:100%;-webkit-appearance:none;appearance:none;}.fi select:focus,.fi input:focus{border-color:var(--tr);}.fi input::placeholder{color:rgba(184,178,168,0.28);}.ht{font-family:'DM Mono',monospace;font-size:9px;color:var(--mu);margin-top:-2px;}.pw{position:relative;}.ps{position:absolute;left:11px;top:50%;transform:translateY(-50%);font-family:'DM Mono',monospace;font-size:12px;color:var(--dm);pointer-events:none;}.pw input{padding-left:22px!important;}.bg{width:100%;margin-top:20px;padding:13px;background:var(--tr);color:var(--ow);border:none;border-radius:2px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;cursor:pointer;transition:background 0.18s;}.bg:hover{background:var(--th);}.er{font-family:'DM Mono',monospace;font-size:9px;color:#c47878;padding-top:8px;line-height:1.5;}.lw{padding:48px 28px;text-align:center;}.ds{display:flex;justify-content:center;gap:6px;margin-bottom:18px;}.ds span{width:7px;height:7px;border-radius:50%;background:var(--tr);animation:dt 1.3s infinite ease-in-out;}.ds span:nth-child(2){animation-delay:0.18s;}.ds span:nth-child(3){animation-delay:0.36s;}@keyframes dt{0%,80%,100%{opacity:0.2;transform:scale(0.75)}40%{opacity:1;transform:scale(1)}}.ll{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:var(--dm);}.cr{display:flex;justify-content:space-between;align-items:flex-start;padding:11px 0;border-bottom:1px solid rgba(242,237,230,0.042);gap:12px;}.cr:last-child{border-bottom:none;}.cl{font-size:13px;color:var(--dm);font-weight:300;flex:1;}.cs{display:block;font-family:'DM Mono',monospace;font-size:9px;color:var(--mu);margin-top:2px;}.cv{font-family:'DM Mono',monospace;font-size:13px;color:var(--ow);white-space:nowrap;}.totrow{margin-top:4px;padding-top:14px;border-top:1px solid rgba(242,237,230,0.12);border-bottom:none!important;}.totrow .cl{font-family:'Playfair Display',serif;font-size:16px;font-style:italic;color:var(--ow);}.totrow .cv{font-size:19px;color:var(--tr);}.sp2{background:var(--cm);border:1px solid rgba(196,96,58,0.22);border-left:3px solid var(--tr);border-radius:2px;margin-top:2px;}.sh2{padding:16px 28px 0;}.sb{padding:20px 28px 26px;}.sl{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:var(--tr);padding-bottom:12px;border-bottom:1px solid rgba(196,96,58,0.15);}.sg{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:1px;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:16px;}.sg.green{background:rgba(78,128,96,0.15);color:#6aaa84;border:1px solid rgba(78,128,96,0.28);}.sg.amber{background:rgba(184,144,42,0.15);color:#c4a24a;border:1px solid rgba(184,144,42,0.28);}.sg.red{background:rgba(180,70,70,0.15);color:#c47878;border:1px solid rgba(180,70,70,0.28);}.sd{width:5px;height:5px;border-radius:50%;background:currentColor;}.vd{font-size:13px;line-height:1.82;color:var(--ow);font-weight:300;}.vd p{margin-bottom:10px;}.vd p:last-child{margin-bottom:0;}.fs{background:var(--cm);border:1px solid var(--bd);border-radius:2px;margin-top:2px;padding:14px 28px;display:flex;align-items:center;justify-content:space-between;gap:14px;}.fn{font-family:'DM Mono',monospace;font-size:9px;color:var(--mu);line-height:1.6;flex:1;}.br{background:none;border:1px solid var(--bd);color:var(--dm);padding:6px 16px;border-radius:2px;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:border-color 0.18s,color 0.18s;}.br:hover{border-color:var(--tr);color:var(--tr);}.pf{max-width:660px;margin:0 auto;padding:20px 20px 32px;border-top:1px solid var(--bd);display:flex;justify-content:space-between;}.pf p{font-family:'DM Mono',monospace;font-size:9px;color:rgba(184,178,168,0.28);}@media(max-width:520px){.hd{padding:14px 16px;}.hero{padding:36px 16px 28px;}.sh{padding:0 12px 48px;}.ph,.pb,.sh2,.sb{padding-left:16px;padding-right:16px;}.sp{margin:0 16px;}.g2,.g3{grid-template-columns:1fr;}.fs{flex-direction:column;align-items:flex-start;}}`;

function safeParseJSON(raw) {
  const a=raw.indexOf('{'),b=raw.lastIndexOf('}');
  if(a===-1||b===-1) throw new Error('No JSON object found');
  let s=raw.slice(a,b+1),out='',inStr=false,esc=false;
  for(let i=0;i<s.length;i++){
    const ch=s[i],code=s.charCodeAt(i);
    if(esc){out+=ch;esc=false;continue;}
    if(ch==='\\'){esc=true;out+=ch;continue;}
    if(ch==='"'){inStr=!inStr;out+=ch;continue;}
    if(inStr&&code<32){
      if(code===10)out+='\\n';
      else if(code===13)out+='\\r';
      else if(code===9)out+='\\t';
      continue;
    }
    out+=ch;
  }
  return JSON.parse(out);
}

export default function App() {
  const [origin,setOrigin]=useState('');
  const [dest,setDest]=useState('');
  const [year,setYear]=useState('');
  const [make,setMake]=useState('');
  const [model,setModel]=useState('');
  const [price,setPrice]=useState('');
  const [st,setSt]=useState('form');
  const [lmsg,setLmsg]=useState(MSGS[0]);
  const [err,setErr]=useState('');
  const [res,setRes]=useState(null);

  const makes=Object.keys(CARS).sort();
  const mods=make&&CARS[make]?CARS[make]:[];
  const years=Array.from({length:2024-1960+1},(_,i)=>2024-i);
  const oC=CURRENCY[origin]||{s:'$',c:'USD'};
  const dC=DEST[dest]||{s:'$',c:'USD'};
  const ok=()=>origin&&dest&&year&&make&&model.trim()&&price&&origin!==dest;

  const run=async()=>{
    if(!ok()){setErr('Please fill in all fields. Origin and destination must be different.');return;}
    setErr('');setSt('loading');
    let mi=0;
    const iv=setInterval(()=>{mi=(mi+1)%MSGS.length;setLmsg(MSGS[mi]);},1800);
    const age=2026-parseInt(year);
    const prompt=`Car import calculation for The Daily Vroom.
Car: ${year} ${make} ${model} (${age} years old in 2026)
Route: ${CN[origin]} to ${CN[dest]}
Purchase price: ${oC.s}${parseFloat(price).toLocaleString()} ${oC.c}

Calculate all costs in ${dC.c}. Include only what applies.

Key rules: If car built before 2001 going to US, 25-year rule applies, no EPA or DOT compliance needed, flag this prominently and show the saving. If car built in 2002 going to US, advise storing in origin country for 12 months to qualify, calculate the saving. If RHD car going to US, California does not allow RHD registration, suggest Florida Texas Oregon or Montana instead. If Japan origin, flag that shaaken certificate and export deregistration documents are essential.

Include these costs where applicable: purchase price converted at early 2026 exchange rate, source country exit costs, import duty at correct 2026 rates, VAT or consumption tax, ocean freight RoRo estimate, transit marine insurance at 1 percent of value, port handling and customs broker, final mile delivery port to door, compliance and registration, any required modifications for road use.

Sam's Take: 3 paragraphs Daily Vroom editorial voice, name the car, lead with the most financially important insight, give concrete strategic advice, clear verdict.

Return a single JSON object and nothing else. Use escaped newlines in sams_take.

Format: {"dest_currency_symbol":"${dC.s}","dest_currency_code":"${dC.c}","line_items":[{"label":"Purchase Price","sublabel":"note","value":32000}],"total":40000,"signal":"PROCEED WITH CAUTION","signal_level":"amber","sams_take":"para one\\n\\npara two\\n\\npara three"}`;

    try{
      const controller=new AbortController();
      const timeout=setTimeout(()=>controller.abort(),30000);
      const r=await fetch('https://api.anthropic.com/v1/messages',{signal:controller.signal,
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          model:'claude-sonnet-4-5',
          max_tokens:2000,
          system:'You are a car import cost calculator. Return ONLY a valid JSON object. No markdown, no text before or after. Never use literal newline characters inside JSON string values, always use \\n instead.',
          messages:[{role:'user',content:prompt}]
        })
      });
      clearInterval(iv);
      clearTimeout(timeout);
      if(!r.ok){const t=await r.text();throw new Error('HTTP '+r.status+': '+t.slice(0,150));}
      const d=await r.json();
      const raw=(d.content||[]).map(b=>b.text||'').join('').trim();
      const parsed=safeParseJSON(raw);
      setRes(parsed);setSt('results');
    }catch(e){
      clearInterval(iv);
      setErr('Error: '+(e.message||'Unknown'));
      setSt('form');
    }
  };

  const reset=()=>{setSt('form');setRes(null);setErr('');};
  const sym=res?.dest_currency_symbol||dC.s;
  const slv=(res?.signal_level||'amber').toLowerCase();
  const sc=slv==='green'?'green':slv==='red'?'red':'amber';
  const paras=(res?.sams_take||'').split('\n\n').filter(p=>p.trim());

  return(
    <div className="vr">
      <style>{css}</style>
      <div className="rl"/>
      <header className="hd">
        <div className="wm">The Daily <em>Vroom</em></div>
        <div className="pl">Import Calculator — Beta</div>
      </header>
      <section className="hero">
        <div className="kk">Free Intelligence Tool</div>
        <h1>What does that car <em>actually</em> cost you?</h1>
        <p className="hs">We don't tell you what a car is worth. We tell you what it costs to get it home — duties, VAT, shipping, compliance, all of it.</p>
      </section>
      <div className="dv"/>
      <div className="sh">
        {st==='form'&&(
          <div className="pn">
            <div className="ph"><div className="lb">01 — The Route</div></div>
            <div className="pb">
              <div className="g2">
                <div className="fi"><label>Buying From</label>
                  <select value={origin} onChange={e=>setOrigin(e.target.value)}>
                    <option value="">Select origin</option>
                    {['JP','UK','DE','IT','FR','US','AU','CA','NL','SE','CH','ZA'].map(c=><option key={c} value={c}>{CN[c]}</option>)}
                  </select>
                </div>
                <div className="fi"><label>Importing To</label>
                  <select value={dest} onChange={e=>setDest(e.target.value)}>
                    <option value="">Select destination</option>
                    {['US','UK','DE','FR','AU','CA','NL','JP'].map(c=><option key={c} value={c}>{CN[c]}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="sp"/>
            <div className="ph"><div className="lb" style={{marginTop:'18px'}}>02 — The Car</div></div>
            <div className="pb">
              <div className="g3">
                <div className="fi"><label>Year</label>
                  <select value={year} onChange={e=>setYear(e.target.value)}>
                    <option value="">Year</option>
                    {years.map(y=><option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="fi"><label>Make</label>
                  <select value={make} onChange={e=>{setMake(e.target.value);setModel('');}}>
                    <option value="">Make</option>
                    {makes.map(m=><option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="fi"><label>Model</label>
                  {make==='Other / Not Listed'
                    ?<input type="text" placeholder="Type model" value={model} onChange={e=>setModel(e.target.value)}/>
                    :<select value={model} onChange={e=>setModel(e.target.value)} disabled={!make}>
                      <option value="">{make?'Select model':'Make first'}</option>
                      {mods.map(m=><option key={m} value={m}>{m}</option>)}
                    </select>
                  }
                </div>
              </div>
              <div className="fi mt"><label>Purchase Price</label>
                <div className="pw">
                  <span className="ps">{oC.s}</span>
                  <input type="number" placeholder="35000" value={price} onChange={e=>setPrice(e.target.value)} min="0"/>
                </div>
                <span className="ht">In the seller's local currency</span>
              </div>
              {err&&<div className="er">{err}</div>}
              <button className="bg" onClick={run}>Calculate Total Landed Cost</button>
            </div>
          </div>
        )}
        {st==='loading'&&(
          <div className="pn">
            <div className="lw">
              <div className="ds"><span/><span/><span/></div>
              <div className="ll">{lmsg}</div>
            </div>
          </div>
        )}
        {st==='results'&&res&&(<>
          <div className="pn">
            <div className="ph"><div className="lb">{year} {make} {model} — {CN[origin]} → {CN[dest]}</div></div>
            <div className="pb">
              {(res.line_items||[]).map((item,i)=>(
                <div key={i} className="cr">
                  <div className="cl">{item.label}{item.sublabel&&<small className="cs">{item.sublabel}</small>}</div>
                  <div className="cv">{sym}{Number(item.value).toLocaleString()}</div>
                </div>
              ))}
              <div className="cr totrow">
                <div className="cl">Total Landed Cost</div>
                <div className="cv">{sym}{Number(res.total).toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div className="sp2">
            <div className="sh2"><div className="sl">Sam's Take</div></div>
            <div className="sb">
              <div className={`sg ${sc}`}><span className="sd"/>{res.signal||'PROCEED WITH CAUTION'}</div>
              <div className="vd">{paras.map((p,i)=><p key={i}>{p}</p>)}</div>
            </div>
          </div>
          <div className="fs">
            <p className="fn">Estimates based on published tariff rates as of early 2026. Verify with a licensed importer before committing funds.</p>
            <button className="br" onClick={reset}>New Calculation</button>
          </div>
        </>)}
      </div>
      <footer className="pf">
        <p>© The Daily Vroom — thedailyvroom.com</p>
        <p>Powered by live tariff intelligence</p>
      </footer>
    </div>
  );
}
