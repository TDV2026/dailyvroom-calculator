import { useEffect, useRef } from 'react';

const API_BASE = import.meta.env.BASE_URL;

const STYLES = `
.tdv-ic *{box-sizing:border-box;margin:0;padding:0;}
.tdv-ic{background:#FAFAF8;color:#111111;font-family:'Inter',sans-serif;font-weight:400;min-height:100vh;overflow-y:auto;height:auto;-webkit-font-smoothing:antialiased;}
.tdv-ic .mast{padding:16px 32px;display:flex;align-items:center;justify-content:space-between;background:#111111;}
.tdv-ic .mast-name{font-family:'Archivo',sans-serif;font-size:20px;font-weight:800;letter-spacing:-0.01em;text-transform:uppercase;color:#FFFFFF;}
.tdv-ic .mast-name em{font-style:normal;color:#E63312;}
.tdv-ic .mast-tag{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#FFFFFF;border:2px solid #E63312;padding:4px 10px;}
.tdv-ic .mast-tariff{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.75);}
.tdv-ic .hero{max-width:600px;margin:0 auto;padding:56px 24px 44px;text-align:center;}
.tdv-ic .hero-label{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#E63312;margin-bottom:18px;}
.tdv-ic .hero h1{font-family:'Archivo',sans-serif;font-size:clamp(30px,4.5vw,50px);font-weight:900;line-height:1.05;letter-spacing:-0.02em;text-transform:uppercase;margin-bottom:16px;color:#111111;}
.tdv-ic .hero h1 em{font-style:normal;color:#E63312;}
.tdv-ic .hero-sub{font-size:15px;line-height:1.6;color:#3A3A3A;max-width:460px;margin:0 auto;}
.tdv-ic .nav-tabs{display:flex;gap:0;border-bottom:2px solid #111111;max-width:680px;margin:0 auto;padding:0 24px;}
.tdv-ic .nav-tab{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#55595E;padding:13px 20px;border:none;background:none;cursor:pointer;border-bottom:3px solid transparent;margin-bottom:-2px;transition:all 0.15s;text-decoration:none;display:inline-block;}
.tdv-ic .nav-tab:hover{color:#111111;}
.tdv-ic .nav-tab.active{color:#111111;border-bottom-color:#E63312;}
.tdv-ic .hrule{max-width:680px;margin:0 auto;height:1px;background:#D9D9D4;}
.tdv-ic .wrap{max-width:680px;margin:0 auto;padding:0 24px 600px;}
.tdv-ic .form-section{padding:28px 0 0;}
.tdv-ic .form-label{font-family:'Archivo',sans-serif;font-size:13px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#111111;margin-bottom:14px;display:flex;align-items:center;gap:10px;}
.tdv-ic .form-label::after{content:'';flex:1;height:2px;background:#111111;}
.tdv-ic .g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.tdv-ic .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;}
.tdv-ic .mt{margin-top:12px;}
.tdv-ic .fi{display:flex;flex-direction:column;gap:6px;}
.tdv-ic .fi label{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#55595E;}
.tdv-ic .fi select,.tdv-ic .fi input{background:#FFFFFF;border:2px solid #111111;border-radius:0;color:#111111;font-family:'Inter',sans-serif;font-size:16px;font-weight:400;padding:11px 12px;outline:none;width:100%;-webkit-appearance:none;appearance:none;transition:border-color 0.15s;min-height:44px;}
.tdv-ic .fi select:focus,.tdv-ic .fi input:focus{border-color:#E63312;}
.tdv-ic .fi input::placeholder{color:#8A8E93;}
.tdv-ic .fi-hint{font-family:'IBM Plex Mono',monospace;font-size:11px;color:#55595E;letter-spacing:0.02em;}
.tdv-ic .prw{position:relative;}
.tdv-ic .prs{position:absolute;left:10px;top:50%;transform:translateY(-50%);font-family:'IBM Plex Mono',monospace;font-size:12px;color:#55595E;pointer-events:none;white-space:nowrap;}
.tdv-ic .prw input{padding-left:36px!important;}
.tdv-ic .errtxt{font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:500;color:#B21E00;padding:11px;background:rgba(230,51,18,0.08);border-left:3px solid #E63312;margin-top:8px;}
.tdv-ic .calc-btn{width:100%;margin-top:20px;padding:15px;background:#E63312;color:#FFFFFF;border:none;font-family:'Archivo',sans-serif;font-size:14px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;transition:background 0.15s;min-height:48px;clip-path:polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%);}
.tdv-ic .calc-btn:hover{background:#C52A0D;}
.tdv-ic .ldw{padding:52px 0;text-align:center;}
.tdv-ic .ldlbl{font-family:'Archivo',sans-serif;font-size:18px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#111111;}
.tdv-ic .ldbar{width:180px;height:3px;background:#D9D9D4;margin:18px auto 0;position:relative;overflow:hidden;}
.tdv-ic .ldbar::after{content:'';position:absolute;top:0;left:-100%;width:100%;height:3px;background:#E63312;animation:tdvldsweep 1.6s ease-in-out infinite;}
@keyframes tdvldsweep{0%{left:-100%}100%{left:100%}}
.tdv-ic .res-route{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#E63312;padding:28px 0 6px;}
.tdv-ic .res-title{font-family:'Archivo',sans-serif;font-size:clamp(18px,2.4vw,24px);font-weight:800;letter-spacing:-0.01em;color:#111111;padding-bottom:20px;border-bottom:2px solid #111111;}
.tdv-ic .crow{display:flex;justify-content:space-between;align-items:flex-start;padding:13px 0;border-bottom:1px solid #D9D9D4;gap:16px;position:relative;padding-left:12px;}
.tdv-ic .crow::before{content:'';position:absolute;left:0;top:13px;bottom:13px;width:3px;background:#E63312;}
.tdv-ic .clbl{font-size:15px;font-weight:600;color:#111111;flex:1;line-height:1.3;}
.tdv-ic .csub{display:block;font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:400;color:#55595E;margin-top:3px;}
.tdv-ic .cval{font-family:'IBM Plex Mono',monospace;font-size:15px;font-weight:500;font-variant-numeric:tabular-nums;color:#111111;white-space:nowrap;}
.tdv-ic .savrow{display:flex;justify-content:space-between;align-items:flex-start;padding:13px 0;border-bottom:1px solid #D9D9D4;gap:16px;position:relative;padding-left:12px;}
.tdv-ic .savrow::before{content:'';position:absolute;left:0;top:13px;bottom:13px;width:3px;background:#1E7A46;}
.tdv-ic .savrow .clbl{font-size:15px;font-weight:600;color:#1E7A46;flex:1;}
.tdv-ic .savrow .cval{font-family:'IBM Plex Mono',monospace;font-size:15px;font-weight:500;font-variant-numeric:tabular-nums;color:#1E7A46;white-space:nowrap;}
.tdv-ic .totrow{display:flex;justify-content:space-between;align-items:center;padding:18px 20px;background:#111111;margin-top:6px;gap:16px;clip-path:polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%);}
.tdv-ic .tot-lbl{font-family:'Archivo',sans-serif;font-size:15px;font-weight:800;letter-spacing:0.04em;text-transform:uppercase;color:#FFFFFF;}
.tdv-ic .tot-val{font-family:'IBM Plex Mono',monospace;font-size:24px;font-weight:600;font-variant-numeric:tabular-nums;color:#E63312;}
.tdv-ic .stax-wrap{border-top:2px solid #111111;padding:18px 0;}
.tdv-ic .stax-label{font-family:'Archivo',sans-serif;font-size:13px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#111111;margin-bottom:12px;}
.tdv-ic .stax-sel{width:100%;background:#FFFFFF;border:2px solid #111111;border-radius:0;font-family:'Inter',sans-serif;font-size:16px;padding:11px 12px;color:#111111;outline:none;-webkit-appearance:none;appearance:none;max-height:200px;min-height:44px;}
.tdv-ic .stax-sel:focus{border-color:#E63312;}
.tdv-ic .srow{display:flex;justify-content:space-between;align-items:baseline;padding:10px 0;border-bottom:1px solid #D9D9D4;font-size:14px;gap:12px;color:#3A3A3A;}
.tdv-ic .sval{font-family:'IBM Plex Mono',monospace;font-size:14px;font-weight:500;font-variant-numeric:tabular-nums;color:#111111;white-space:nowrap;}
.tdv-ic .sval em{font-style:normal;font-size:11px;color:#55595E;margin-left:4px;}
.tdv-ic .stot{display:flex;justify-content:space-between;align-items:baseline;padding:14px 0 4px;font-size:15px;gap:12px;}
.tdv-ic .stot span:first-child{font-family:'Archivo',sans-serif;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;color:#111111;}
.tdv-ic .stot-val{font-family:'IBM Plex Mono',monospace;font-size:19px;font-weight:600;font-variant-numeric:tabular-nums;color:#E63312;}
.tdv-ic .take-wrap{border-top:3px solid #E63312;margin-top:4px;padding-top:24px;}
.tdv-ic .take-kicker{font-family:'Archivo',sans-serif;font-size:13px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#E63312;margin-bottom:16px;}
.tdv-ic .sig-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:20px;}
.tdv-ic .sig{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;font-family:'Archivo',sans-serif;font-size:12px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;border-radius:0;}
.tdv-ic .sig.exceptional{background:#C7EFD6;color:#14532D;border:2px solid #1E7A46;}
.tdv-ic .sig.green{background:#D3F0DC;color:#14532D;border:2px solid #1E7A46;}
.tdv-ic .sig.good{background:#DDEEE2;color:#14532D;border:2px solid #2E7D50;}
.tdv-ic .sig.amber{background:#FCE9BE;color:#6B4E00;border:2px solid #B8860B;}
.tdv-ic .sig.caution{background:#FBDFC2;color:#7A3E00;border:2px solid #C56A1E;}
.tdv-ic .sig.red{background:#FBD5CE;color:#7A1200;border:2px solid #E63312;}
.tdv-ic .sig.avoid{background:#F7C4BB;color:#5E0F00;border:2px solid #B21E00;}
.tdv-ic .sigdot{width:7px;height:7px;border-radius:0;background:currentColor;display:inline-block;}
.tdv-ic .storybadge{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;font-family:'Archivo',sans-serif;font-size:12px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;background:#FCE9BE;color:#6B4E00;border:2px solid #B8860B;}
.tdv-ic .storybadge svg{width:12px;height:12px;}
.tdv-ic .verdict{font-family:'Inter',sans-serif;font-size:15px;font-weight:400;line-height:1.65;color:#3A3A3A;text-transform:none;}
.tdv-ic .verdict p{margin-bottom:12px;}
.tdv-ic .verdict p:last-child{margin-bottom:0;}
.tdv-ic .intent-wrap{padding:20px 0 24px;border-top:1px solid #D9D9D4;}
.tdv-ic .intent-q{font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#111111;margin-bottom:12px;}
.tdv-ic .intent-btns{display:flex;gap:10px;}
.tdv-ic .intent-btn{background:#FFFFFF;border:2px solid #111111;color:#111111;padding:9px 20px;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;transition:all 0.15s;min-height:44px;}
.tdv-ic .intent-btn:hover{background:#E63312;border-color:#E63312;color:#FFFFFF;}
.tdv-ic .intent-btn-soft{border-color:#55595E;color:#55595E;}
.tdv-ic .intent-btn-soft:hover{background:#111111;border-color:#111111;color:#FFFFFF;}
.tdv-ic .intent-confirm{font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:500;color:#1E7A46;padding-top:10px;}
.tdv-ic .btnr{background:#111111;border:2px solid #111111;color:#FFFFFF;padding:10px 18px;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;margin-top:16px;min-height:44px;transition:all 0.15s;}
.tdv-ic .btnr:hover{background:#E63312;border-color:#E63312;}
.tdv-ic .pgft{max-width:680px;margin:0 auto;padding:20px 24px 32px;background:#111111;display:flex;justify-content:space-between;}
.tdv-ic .pgft p{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:400;color:rgba(255,255,255,0.6);}
.tdv-ic .pgft a{color:rgba(255,255,255,0.6);text-decoration:none;}
.tdv-ic .delta-line{display:flex;justify-content:space-between;align-items:baseline;padding:10px 0 18px;border-bottom:1px solid #D9D9D4;gap:16px;}
.tdv-ic .delta-lbl{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#55595E;}
.tdv-ic .delta-val{font-family:'IBM Plex Mono',monospace;font-size:14px;font-weight:500;font-variant-numeric:tabular-nums;color:#111111;}
.tdv-ic .context-line{font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:400;color:#3A3A3A;padding:12px 0 0;line-height:1.6;}
.tdv-ic .context-line span{color:#B8860B;font-weight:600;}
.tdv-ic .breakdown-toggle{background:#FFFFFF;border:2px solid #111111;color:#111111;padding:11px 14px;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;width:100%;margin:16px 0 0;transition:all 0.15s;min-height:44px;}
.tdv-ic .breakdown-toggle:hover{background:#111111;color:#FFFFFF;}
.tdv-ic .share-btn{background:#E63312;border:2px solid #E63312;color:#FFFFFF;padding:10px 16px;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;transition:all 0.15s;white-space:nowrap;min-height:44px;}
.tdv-ic .share-btn:hover{background:#C52A0D;border-color:#C52A0D;}
.tdv-ic .share-confirm{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:500;color:#1E7A46;opacity:0;transition:opacity 0.3s;}
.tdv-ic .share-confirm.show{opacity:1;}
.tdv-ic .sub-wrap{border-top:2px solid #111111;border-bottom:2px solid #111111;margin:28px 0;padding:24px 0;}
.tdv-ic .sub-inner{display:flex;gap:24px;align-items:flex-start;}
.tdv-ic .sub-left{flex:1;}
.tdv-ic .sub-text{font-size:15px;line-height:1.6;color:#3A3A3A;}
.tdv-ic .sub-right{display:flex;flex-direction:column;gap:8px;min-width:220px;}
.tdv-ic .sub-input{background:#FFFFFF;border:2px solid #111111;border-radius:0;color:#111111;font-family:'Inter',sans-serif;font-size:16px;padding:11px 12px;outline:none;width:100%;min-height:44px;}
.tdv-ic .sub-input:focus{border-color:#E63312;}
.tdv-ic .sub-input::placeholder{color:#8A8E93;}
.tdv-ic .sub-btn{background:#E63312;color:#FFFFFF;border:none;font-family:'Archivo',sans-serif;font-size:13px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;padding:12px;cursor:pointer;width:100%;min-height:44px;transition:background 0.15s;clip-path:polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%);}
.tdv-ic .sub-btn:hover{background:#C52A0D;}
.tdv-ic .sub-confirm{font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:500;color:#1E7A46;min-height:16px;}
.tdv-ic .share-sheet{display:none;width:100%;margin-top:12px;padding-top:12px;border-top:1px solid #D9D9D4;}
.tdv-ic .share-sheet-row{display:flex;align-items:center;gap:8px;margin-bottom:10px;}
.tdv-ic .share-link-input{flex:1;background:#FFFFFF;border:2px solid #111111;border-radius:0;color:#111111;font-family:'IBM Plex Mono',monospace;font-size:12px;padding:10px;outline:none;min-height:44px;}
.tdv-ic .share-copy-btn{background:#111111;border:2px solid #111111;color:#FFFFFF;padding:10px 14px;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;white-space:nowrap;min-height:44px;transition:all 0.15s;}
.tdv-ic .share-copy-btn:hover{background:#E63312;border-color:#E63312;}
.tdv-ic .share-channels{display:flex;gap:8px;}
.tdv-ic .share-channel-btn{flex:1;background:#FFFFFF;border:2px solid #111111;color:#111111;padding:10px;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;min-height:44px;transition:all 0.15s;}
.tdv-ic .share-channel-btn:hover{background:#111111;color:#FFFFFF;}
@media(max-width:560px){.tdv-ic .g2,.tdv-ic .g3{grid-template-columns:1fr;}.tdv-ic .mast{padding:14px 16px;}.tdv-ic .mast-tag{display:none;}.tdv-ic .wrap,.tdv-ic .pgft{padding-left:16px;padding-right:16px;}.tdv-ic .hero{padding:36px 16px 32px;}.tdv-ic .hero h1{font-size:30px;}.tdv-ic .crow,.tdv-ic .savrow{flex-wrap:wrap;gap:4px;}.tdv-ic .cval{white-space:normal;text-align:right;width:100%;}.tdv-ic .savrow .cval{width:100%;text-align:right;}.tdv-ic .totrow{flex-wrap:wrap;gap:6px;}.tdv-ic .tot-lbl{width:100%;}.tdv-ic .tot-val{font-size:28px;}.tdv-ic .pgft{flex-direction:column;gap:6px;}.tdv-ic .stot{flex-wrap:wrap;}.tdv-ic .srow{flex-wrap:wrap;gap:4px;}.tdv-ic .sval{width:100%;text-align:right;}.tdv-ic .sub-inner{flex-direction:column;}.tdv-ic .sub-right{min-width:0;width:100%;}.tdv-ic .share-channels{flex-wrap:wrap;}}
`;

const STATE_TAX: Record<string, number> = {'AL':0.02,'AK':0.00,'AZ':0.056,'AR':0.065,'CA':0.0725,'CO':0.029,'CT':0.0635,'DE':0.00,'FL':0.06,'GA':0.04,'HI':0.04,'ID':0.06,'IL':0.0625,'IN':0.07,'IA':0.06,'KS':0.065,'KY':0.06,'LA':0.0445,'ME':0.055,'MD':0.06,'MA':0.0625,'MI':0.06,'MN':0.06875,'MS':0.07,'MO':0.04225,'MT':0.00,'NE':0.055,'NV':0.0685,'NH':0.00,'NJ':0.06625,'NM':0.05125,'NY':0.04,'NC':0.0475,'ND':0.05,'OH':0.0575,'OK':0.045,'OR':0.00,'PA':0.06,'RI':0.07,'SC':0.05,'SD':0.04,'TN':0.07,'TX':0.0625,'UT':0.0485,'VT':0.06,'VA':0.043,'WA':0.065,'WV':0.06,'WI':0.05,'WY':0.04};
const STATE_NAMES: Record<string, string> = {'AL':'Alabama','AK':'Alaska','AZ':'Arizona','AR':'Arkansas','CA':'California','CO':'Colorado','CT':'Connecticut','DE':'Delaware','FL':'Florida','GA':'Georgia','HI':'Hawaii','ID':'Idaho','IL':'Illinois','IN':'Indiana','IA':'Iowa','KS':'Kansas','KY':'Kentucky','LA':'Louisiana','ME':'Maine','MD':'Maryland','MA':'Massachusetts','MI':'Michigan','MN':'Minnesota','MS':'Mississippi','MO':'Missouri','MT':'Montana','NE':'Nebraska','NV':'Nevada','NH':'New Hampshire','NJ':'New Jersey','NM':'New Mexico','NY':'New York','NC':'North Carolina','ND':'North Dakota','OH':'Ohio','OK':'Oklahoma','OR':'Oregon','PA':'Pennsylvania','RI':'Rhode Island','SC':'South Carolina','SD':'South Dakota','TN':'Tennessee','TX':'Texas','UT':'Utah','VT':'Vermont','VA':'Virginia','WA':'Washington','WV':'West Virginia','WI':'Wisconsin','WY':'Wyoming'};
const CURRENCY: Record<string, {s:string;c:string}> = {AE:{s:'Dhs',c:'AED'},JP:{s:'\u00a5',c:'JPY'},UK:{s:'\u00a3',c:'GBP'},DE:{s:'\u20ac',c:'EUR'},IT:{s:'\u20ac',c:'EUR'},FR:{s:'\u20ac',c:'EUR'},BE:{s:'\u20ac',c:'EUR'},NL:{s:'\u20ac',c:'EUR'},PT:{s:'\u20ac',c:'EUR'},IE:{s:'\u20ac',c:'EUR'},SE:{s:'kr',c:'SEK'},CH:{s:'Fr',c:'CHF'},US:{s:'$',c:'USD'},AU:{s:'A$',c:'AUD'},CA:{s:'C$',c:'CAD'},ZA:{s:'R',c:'ZAR'}};
const DEST: Record<string, {s:string;c:string}> = {AE:{s:'Dhs',c:'AED'},US:{s:'$',c:'USD'},UK:{s:'\u00a3',c:'GBP'},DE:{s:'\u20ac',c:'EUR'},FR:{s:'\u20ac',c:'EUR'},IT:{s:'\u20ac',c:'EUR'},BE:{s:'\u20ac',c:'EUR'},AU:{s:'A$',c:'AUD'},CA:{s:'C$',c:'CAD'},NL:{s:'\u20ac',c:'EUR'},PT:{s:'\u20ac',c:'EUR'},IE:{s:'\u20ac',c:'EUR'},JP:{s:'\u00a5',c:'JPY'},SE:{s:'kr',c:'SEK'},CH:{s:'Fr',c:'CHF'},ZA:{s:'R',c:'ZAR'}};
const CN: Record<string, string> = {AE:'UAE / Dubai',JP:'Japan',UK:'United Kingdom',DE:'Germany',IT:'Italy',FR:'France',BE:'Belgium',US:'United States',AU:'Australia',CA:'Canada',NL:'Netherlands',PT:'Portugal',IE:'Ireland',SE:'Sweden',CH:'Switzerland',ZA:'South Africa'};

type ModelDef = [string, number, number];
const CAR_MODELS: Record<string, ModelDef[]> = {
'Acura':[['NSX NA1',1990,2005],['NSX NC1',2016,2022],['Integra Type R DC5',2001,2006],['RSX Type S',2002,2006],['TL Type S',2007,2008],['TSX',2003,2008],['Legend Coupe',1987,1995]],
'Alfa Romeo':[['Spider 105',1966,1993],['GTV 105',1963,1977],['GTV6',1980,1987],['Spider 916',1994,2005],['GTV 916',1994,2005],['147 GTA',2002,2010],['156 GTA',2002,2005],['166 2.5 V6',1998,2007],['Brera',2005,2011],['8C Competizione',2007,2010],['4C',2013,2020],['Giulia Quadrifoglio',2016,2026],['Stelvio Quadrifoglio',2017,2026]],
'Alfa Romeo Pre-War':[['6C 1500',1925,1933],['6C 1750',1927,1933],['6C 2300',1934,1939],['8C 2300',1931,1934],['8C 2900',1935,1939],['P3',1932,1936]],
'Aston Martin':[['DB4',1958,1963],['DB5',1963,1965],['DB6',1965,1970],['DB7',1994,2004],['DB9',2004,2016],['DB11',2016,2023],['DB12',2023,2026],['DBS',2007,2012],['DBS Superleggera',2018,2023],['Vanquish',2001,2018],['Vantage V8',1977,1989],['Vantage AMR',2017,2023],['Vantage 2024',2024,2026],['DBX707',2022,2026],['Rapide',2010,2020],['One-77',2009,2012],['Valkyrie',2021,2026]],
'Atlas':[['Motorette',1896,1911]],
'Auburn':[['851 Speedster',1935,1936],['852 Speedster',1936,1937]],
'Audi':[['Quattro Coupe',1980,1991],['S2',1990,1995],['RS2 Avant',1994,1995],['S4 B5',1997,2002],['RS4 B5 Avant',1999,2001],['RS4 B7',2005,2008],['RS6 C5',2002,2004],['RS6 C6',2008,2010],['TT 8N',1998,2006],['TT 8J',2006,2014],['TT RS 8J',2009,2014],['R8 V8',2007,2015],['R8 V10',2009,2023],['RS3 8V',2015,2020],['RS3 8Y',2021,2026],['RS5 B8',2010,2017],['RS5 B9',2017,2026],['RS7 C8',2020,2026],['e-tron GT',2021,2026],['Q5 TDI',2008,2026],['A6 TDI',2004,2026],['A4 TDI B6',2000,2005],['A4 TDI B7',2004,2008],['A4 TDI B8',2007,2012],['S6 C7',2012,2018],['Allroad 2.7T',2000,2005]],
'Austin-Healey':[['100',1953,1956],['100-6',1956,1959],['3000 Mk1',1959,1961],['3000 Mk2',1961,1962],['3000 Mk3',1963,1967],['Sprite Mk1',1958,1961],['Sprite Mk2',1961,1964],['Sprite Mk3',1964,1966],['Sprite Mk4',1966,1971]],
'Bentley':[['Mulsanne',2010,2020],['Continental GT V8',2011,2026],['Continental GT W12',2003,2026],['Continental GTC V8',2012,2026],['Continental GTC W12',2011,2026],['Flying Spur V8',2013,2026],['Flying Spur W12',2003,2026],['Bentayga W12',2016,2022],['Bentayga V8',2018,2026],['Bentayga EWB',2022,2026],['Mulliner Bacalar',2021,2021],['Batur',2023,2024]],
'Bentley Pre-War':[['3 Litre',1921,1929],['4.5 Litre',1926,1931],['6.5 Litre',1926,1930],['8 Litre',1930,1931],['Speed Six',1928,1930],['3.5 Litre',1933,1937],['4.25 Litre',1936,1939],['Mk V',1939,1941]],
'BMW':[['2002',1968,1976],['2002 Turbo',1973,1974],['M1',1978,1981],['635 CSi',1978,1989],['M635 CSi',1984,1989],['850i',1989,1999],['850CSi',1992,1996],['M3 E30',1986,1991],['M3 E36',1992,1999],['M3 E46',2000,2006],['M3 E90',2007,2013],['M3 E92',2007,2013],['M3 G80',2021,2026],['M3 CS',2023,2026],['M5 E28',1984,1988],['M5 E34',1991,1995],['M5 E39',1998,2003],['M5 E60',2004,2010],['M5 F10',2011,2016],['M5 G90',2024,2026],['M8',2019,2026],['XM',2023,2026],['Z3 M Roadster',1997,2002],['Z4 M',2006,2008],['Z8',2000,2003],['1 Series M',2011,2012],['M2 F87',2016,2021],['M2 G87',2022,2026],['M4 F82',2014,2020],['M4 G82',2021,2026],['525d E39',1996,2003],['530d E39',1998,2003],['530d E60',2003,2010],['X5 3.0d E53',2001,2006],['X5 M E70',2009,2013],['320d E46',1998,2005],['330d E46',2003,2005],['330d E90',2005,2012],['325i E30',1985,1992],['M3 E30 Touring',1987,1991]],
'Bugatti Pre-War':[['Type 35',1924,1931],['Type 37',1926,1930],['Type 40',1926,1930],['Type 41 Royale',1927,1933],['Type 43',1927,1931],['Type 44',1926,1930],['Type 50',1930,1934],['Type 51',1931,1935],['Type 55',1931,1935],['Type 57',1934,1940]],
'Cadillac':[['CTS-V Coupe',2011,2015],['CTS-V Sedan',2009,2015],['CT5-V Blackwing',2022,2026],['CT4-V Blackwing',2022,2026],['Escalade',2000,2026],['DeVille',1949,2005],['Eldorado',1953,1978],['Fleetwood',1975,1996],['Seville',1975,1979]],
'Cadillac Pre-War':[['V16',1930,1940],['V12',1931,1937],['Series 60',1936,1942],['Series 75',1936,1942]],
'Caterham':[['Seven 270',2014,2026],['Seven 310',2016,2026],['Seven 360',2014,2026],['Seven 420',2014,2026],['Seven 485',2014,2026],['Seven 620R',2013,2026],['Seven CSR',2005,2013],['Seven Supersport',2008,2026]],
'Chevrolet':[['Corvette C1',1953,1962],['Corvette C2',1963,1967],['Corvette C3',1968,1982],['Corvette C4',1984,1996],['Corvette C5',1997,2004],['Corvette C6',2005,2013],['Corvette C7',2014,2019],['Corvette C8',2020,2026],['Corvette Z06 C8',2023,2026],['Corvette E-Ray',2024,2026],['Camaro Z28',1967,2002],['Camaro ZL1',2012,2025],['Camaro SS',1967,2025],['K10 Pickup',1960,1987],['K10 Suburban',1960,1991],['K20 Pickup',1960,1987],['K5 Blazer',1969,1994],['C10 Pickup',1960,1987],['C30 Pickup',1960,1987],['El Camino',1959,1987],['Monte Carlo SS',1970,1988],['Nova SS',1966,1979],['Impala SS',1961,1969],['Chevelle SS',1964,1977],['Bel Air',1950,1981]],
'Cord':[['L-29',1929,1932],['810',1935,1937],['812',1937,1937]],
'Datsun/Nissan':[['240Z',1969,1973],['260Z',1974,1975],['280Z',1975,1978],['280ZX',1978,1983],['300ZX Z31',1983,1989],['300ZX Z32',1989,2000]],
'Delage':[['D8',1929,1940],['D6',1930,1940]],
'Delahaye':[['135',1935,1954],['175',1948,1951]],
'Dodge':[['Viper RT/10',1992,2002],['Viper GTS',1996,2002],['Viper ACR',2008,2017],['Challenger Hellcat',2015,2025],['Charger Hellcat',2015,2025],['Demon',2018,2018]],
'Duesenberg':[['Model A',1921,1926],['Model J',1928,1937],['Model SJ',1932,1937]],
'Ferrari':[['250 GTO',1962,1964],['275 GTB',1964,1968],['308 GTB',1975,1985],['308 GTS',1977,1985],['328',1985,1989],['348',1989,1995],['355',1994,1999],['360 Modena',1999,2005],['360 Challenge Stradale',2003,2005],['430',2004,2009],['430 Scuderia',2007,2009],['458',2009,2015],['458 Speciale',2013,2015],['488',2015,2019],['488 Pista',2018,2020],['F8',2019,2023],['SF90',2020,2026],['296',2021,2026],['12Cilindri',2024,2026],['Roma',2020,2026],['Purosangue',2023,2026],['Testarossa',1984,1996],['512 BB',1976,1984],['456',1992,2003],['550 Maranello',1996,2001],['575M',2002,2006],['599',2006,2012],['612',2004,2011],['F40',1987,1992],['F50',1995,1997],['Enzo',2002,2004],['LaFerrari',2013,2016],['812',2017,2022]],
'Fiat':[['500',1957,1975],['500 Abarth',2007,2022],['124 Spider',1966,1985],['124 Spider 2016',2016,2020],['Dino',1966,1972],['131 Abarth',1976,1981],['Punto GT',1993,1999],['Coupe Turbo',1994,2000],['Barchetta',1995,2005],['Multipla',1998,2010]],
'Ford':[['GT40',1964,1969],['GT',2005,2006],['GT 2nd Gen',2017,2022],['Mustang Boss 302',1969,1970],['Mustang Mach 1',1969,2004],['Mustang GT500',1967,2026],['Mustang Dark Horse',2024,2026],['Mustang Bullitt',1968,2020],['Sierra Cosworth',1985,1992],['Escort Cosworth',1992,1996],['Focus RS Mk2',2009,2010],['Focus RS Mk3',2015,2018],['Puma ST',2019,2026],['Fiesta ST',2013,2025],['Ranger Raptor',2019,2026],['Bronco',2021,2026],['F100',1948,1983],['F150 Raptor',2010,2026],['F150 Lightning Heritage',2023,2026]],
'Ford Pre-War':[['Model T',1908,1927],['Model A',1927,1931],['Model B',1932,1934],['V8',1932,1942]],
'Frazer Nash':[['Chain Gang',1924,1939],['Le Mans Replica',1948,1953]],
'Hispano-Suiza':[['H6',1919,1933],['J12',1931,1938],['K6',1934,1937]],
'Honda':[['NSX NA1',1990,2005],['NSX NA2',1997,2005],['NSX NC1',2016,2022],['NSX Type S',2021,2022],['S2000',1999,2009],['Civic Type R EK9',1997,2000],['Civic Type R EP3',2001,2005],['Civic Type R FD2',2007,2011],['Civic Type R FK2',2015,2017],['Civic Type R FK8',2017,2021],['Civic Type R FL5',2023,2026],['Integra Type R DC2',1995,2001],['Integra Type R DC5',2001,2006],['Beat',1991,1996],['S660',2015,2022],['Legend',1985,2021],['Prelude',1978,2001],['Acty Van',1977,2021],['Life Step Van',1997,2003],['Element',2003,2011]],
'Infiniti':[['G35 Coupe',2003,2007],['G37 Coupe',2008,2013],['G35 Sedan',2003,2006],['Q60 Red Sport',2017,2022],['FX35',2003,2008],['FX45',2003,2008],['FX50',2008,2013],['Q45',1989,2006],['M45',2003,2010]],
'Isotta Fraschini':[['Tipo 8',1919,1924],['Tipo 8A',1924,1931]],
'Isuzu':[['VehiCROSS',1997,2001],['Trooper',1981,2002],['Bighorn',1981,2002],['Wizard',1993,1998],['Faster',1972,2002]],
'Jaguar':[['E-Type S1',1961,1968],['E-Type S2',1968,1971],['E-Type S3',1971,1975],['XJ-S',1975,1996],['XK8',1996,2006],['XKR',1998,2014],['XKR-S',2011,2014],['F-Type',2013,2024],['F-Type SVR',2016,2024],['XE SV Project 8',2018,2019],['F-Pace SVR',2017,2026],['XJ220',1992,1994],['C-X75',2013,2014]],
'Jeep':[['Wrangler YJ',1987,1995],['Wrangler TJ',1997,2006],['Wrangler JK',2007,2018],['Wrangler JL',2018,2026],['Wrangler Rubicon 392',2021,2026],['Grand Cherokee Trackhawk',2018,2021],['Grand Wagoneer',1963,1991],['CJ-5',1954,1983],['CJ-7',1976,1986]],
'Koenigsegg':[['CC8S',2002,2004],['CCR',2004,2006],['CCX',2006,2010],['CCXR',2007,2010],['Agera',2011,2014],['Agera R',2011,2014],['Agera RS',2015,2018],['One:1',2014,2014],['Regera',2016,2020],['Jesko',2020,2026],['Jesko Absolut',2020,2026],['Gemera',2022,2026],['CC850',2022,2026]],
'Lagonda':[['Rapier',1934,1935],['LG6',1937,1940],['V12',1937,1940]],
'Lamborghini':[['Miura',1966,1973],['Countach',1974,1990],['Diablo',1990,2001],['Diablo SV',1995,2001],['Murcielago',2001,2010],['Murcielago LP670',2009,2010],['Gallardo',2003,2013],['Gallardo Superleggera',2007,2010],['Huracan',2014,2024],['Huracan Performante',2017,2022],['Aventador',2011,2022],['Aventador SVJ',2018,2022],['Urus',2018,2026],['Revuelto',2023,2026],['Temerario',2025,2026]],
'Lancia':[['Stratos',1972,1978],['037',1982,1983],['Delta Integrale 8v',1987,1989],['Delta Integrale 16v',1989,1994],['Delta HF Turbo',1983,1987],['Fulvia',1963,1976]],
'Land Rover':[['Series I',1948,1958],['Series II',1958,1971],['Series III',1971,1985],['Defender 90',1983,2016],['Defender 110',1983,2016],['Defender 130',1983,2016],['Defender 90 L663',2020,2026],['Defender 110 L663',2020,2026],['Range Rover Classic',1970,1996],['Range Rover P38',1994,2002],['Range Rover L322',2002,2012],['Range Rover Sport',2005,2026],['Range Rover L460',2022,2026],['Discovery 1',1989,1998],['Discovery 2',1998,2004],['Discovery 3',2004,2009],['Discovery 4',2009,2016],['Freelander 1',1997,2006]],
'Lexus':[['LFA',2010,2012],['LC500',2017,2026],['LC500h',2017,2026],['LX470',1998,2007],['LX570',2007,2021],['LX600',2022,2026],['SC300',1991,2000],['SC400',1991,2000],['SC430',2001,2010],['IS300',2000,2005],['IS-F',2008,2014],['GS-F',2016,2020],['RC-F',2015,2024],['RC-F Track Edition',2020,2022],['GS300',1993,2005],['LS400',1989,2000],['LS430',2001,2006],['LS460',2006,2012]],
'Lincoln Pre-War':[['Model L',1920,1930],['Model K',1930,1942],['Zephyr',1936,1942],['Continental',1939,1942]],
'Lotus':[['Elan',1962,1975],['Europa',1966,1975],['Esprit S1',1976,1978],['Esprit Turbo',1980,1987],['Esprit V8',1996,2004],['Elise S1',1996,2000],['Elise S2',2001,2011],['Elise S3',2011,2021],['Exige S1',2000,2002],['Exige S2',2004,2012],['Exige V6',2012,2021],['Evora',2009,2021],['Emira',2022,2026],['Eletre',2023,2026]],
'Maserati':[['Ghibli 310',1966,1973],['Bora',1971,1978],['Merak',1972,1983],['Khamsin',1974,1982],['Quattroporte II',1994,2001],['Quattroporte V',2003,2012],['Quattroporte VI',2013,2022],['GranTurismo',2007,2019],['GranTurismo 2023',2022,2026],['GranCabrio',2010,2019],['GranCabrio 2023',2023,2026],['3200 GT',1998,2002],['Coupe',2001,2007],['Spyder',2001,2007],['MC12',2004,2005],['GranSport',2004,2007],['MC20',2021,2026],['Grecale',2022,2026]],
'Mazda':[['Cosmo',1967,1972],['RX-7 SA',1978,1985],['RX-7 FB',1978,1985],['RX-7 FC',1986,1992],['RX-7 FD',1992,2002],['RX-8',2003,2012],['MX-5 NA',1989,1997],['MX-5 NB',1998,2005],['MX-5 NC',2005,2015],['MX-5 ND',2015,2026],['Mazdaspeed 3',2007,2013],['Cosmo LP',1975,1981]],
'McLaren':[['F1',1992,1998],['P1',2013,2015],['675LT',2015,2017],['720S',2017,2023],['765LT',2020,2022],['Senna',2018,2019],['Speedtail',2020,2021],['Artura',2021,2026],['750S',2023,2026],['W1',2024,2026],['600LT',2018,2020],['570S',2015,2021]],
'Mercedes-Benz':[['G240 W460',1979,1994],['G300 W460',1979,1994],['G350 W460 Diesel',1990,1994],['G300 W463',1989,2026],['G320 W463',1993,2006],['G350 W463 Diesel',2008,2018],['G500 W463',1993,2018],['G55 AMG W463',1999,2012],['G63 AMG W463',2012,2018],['190SL',1955,1963],['300SL Gullwing',1954,1957],['300SL Roadster',1957,1963],['190E 2.3-16',1984,1988],['190E 2.5-16 Evo',1990,1993],['R107 SL',1971,1989],['SL500 R129',1989,2001],['SL600 R129',1992,2001],['SL73 AMG R129',1999,2001],['SLC180 R172',2016,2020],['SLC200 R172',2016,2020],['SLC300 R172',2016,2020],['SLC43 AMG R172',2016,2020],['SL500 R230',2001,2012],['SL63 AMG R230',2006,2012],['W124 500E',1991,1995],['W124 300D',1985,1995],['W124 300TD Wagon',1985,1996],['W124 E300 Diesel',1993,1996],['W210 E300 Diesel',1995,2002],['W210 E320 CDI',1999,2002],['W211 E320 CDI',2002,2009],['W211 E280 CDI',2005,2009],['E350 W212',2009,2016],['E550 W212',2009,2013],['E63 AMG W212',2009,2016],['W124 E220',1992,1996],['W201 190E',1982,1993],['W126 560SEC',1981,1991],['W140 S600',1991,1998],['C36 AMG',1994,1997],['C63 AMG W204',2008,2015],['CLS55 AMG',2004,2006],['CLS63 AMG',2006,2011],['S63 AMG W221',2007,2013],['S65 AMG W221',2007,2013],['CLK GTR',1997,1998],['SLR McLaren',2003,2010],['SLS AMG',2010,2014],['AMG GT',2014,2026],['AMG GT Black Series',2020,2023],['GT 63 AMG',2019,2026],['G63 AMG',2012,2026],['G300 CDI',2000,2012],['G350 CDI',2009,2018],['E63 AMG',2006,2026],['C63 AMG W206',2023,2026],['SL 63 AMG R232',2022,2026],['W123 300D',1976,1985],['W123 300TD',1977,1986],['W116 450SEL 6.9',1975,1980]],
'Mercedes-Benz Pre-War':[['SSK',1928,1932],['500K',1934,1936],['540K',1936,1940],['770 Grosser',1930,1943],['170',1931,1942],['260D',1936,1940]],
'MG':[['MGA',1955,1962],['MGB',1962,1980],['MGB GT',1965,1980],['MGC',1967,1969],['Midget',1961,1979],['RV8',1992,1995]],
'Mitsubishi':[['Starion',1982,1990],['GTO/3000GT',1990,2001],['Lancer Evo I',1992,1994],['Lancer Evo II',1994,1995],['Lancer Evo III',1995,1996],['Lancer Evo IV',1996,1998],['Lancer Evo V',1998,1999],['Lancer Evo VI Tommi Makinen',1999,2001],['Lancer Evo VII',2001,2003],['Lancer Evo VIII',2003,2005],['Lancer Evo IX',2005,2007],['Lancer Evo X',2007,2016],['Delica L300',1979,1994],['Delica Space Gear',1994,2007],['Pajero',1982,2021]],
'Morgan':[['4/4',1936,2026],['Plus 4',1950,2026],['Plus 8',1968,2004],['Aero 8',2000,2010],['Plus Six',2019,2026],['3 Wheeler',2011,2021]],
'Nissan':[['Skyline GT-R R32',1989,1994],['Skyline GT-R R33',1995,1998],['Skyline GT-R R34',1999,2002],['Skyline R31 GTS-R',1987,1990],['GT-R R35',2007,2025],['GT-R Nismo',2014,2024],['400Z',2022,2026],['Silvia S13',1988,1994],['Silvia S14',1993,1999],['Silvia S15',1999,2002],['180SX',1989,1998],['Fairlady Z Z31',1983,1989],['Fairlady Z Z32',1989,2000],['370Z',2009,2021],['Stagea 260RS',1996,2001],['Pulsar GTI-R',1990,1994],['Pao',1989,1992],['Figaro',1991,1991],['S-Cargo',1989,1992],['Be-1',1987,1988],['Rasheen',1994,2000],['Cube Z10',1998,2002],['Cube Z11',2002,2008],['Caravan E24',1985,2001],['Safari Y60',1987,1997],['Safari Y61',1997,2007],['President',1965,2002]],
'Packard Pre-War':[['Twin Six',1916,1923],['Eight',1923,1942],['Super Eight',1933,1942],['Twelve',1932,1939]],
'Pagani':[['Zonda C12',1999,2002],['Zonda F',2005,2008],['Zonda R',2009,2012],['Zonda Cinque',2009,2010],['Huayra',2011,2018],['Huayra BC',2016,2018],['Huayra R',2021,2023],['Utopia',2022,2026]],
'Peugeot':[['205 GTI',1984,1994],['205 T16',1984,1985],['306 GTI-6',1996,2002],['306 Rallye',1994,1997],['307 WRC',2004,2004],['406 Coupe',1997,2004],['504 Coupe',1969,1983],['504 Cabriolet',1969,1983],['205 Diesel',1983,1998],['405 Mi16',1987,1997]],
'Pontiac':[['Firebird Trans Am',1969,2002],['GTO 1969',1969,1969],['GTO Judge',1969,1971],['Bonneville',1957,2005]],
'Porsche':[['356 A',1955,1959],['356 B',1959,1963],['356 C',1963,1965],['912',1965,1969],['914',1969,1976],['924',1976,1988],['924 Carrera GT',1980,1981],['928 S',1979,1986],['928 GT',1989,1992],['928 GTS',1991,1995],['944',1982,1991],['944 Turbo',1985,1991],['944 S2',1989,1991],['968',1991,1995],['968 Club Sport',1993,1995],['911 T',1967,1973],['911 S',1966,1977],['911 E',1968,1973],['911 Carrera RS 2.7',1972,1974],['911 930 Turbo 3.0',1975,1977],['911 930 Turbo 3.3',1978,1989],['911 SC',1978,1983],['911 3.2 Carrera',1983,1989],['911 964 C2',1989,1994],['911 964 C4',1989,1994],['911 964 Turbo',1991,1994],['911 964 RS',1991,1994],['911 993 Carrera',1994,1998],['911 993 Carrera S',1997,1998],['911 993 Turbo',1995,1998],['911 993 GT2',1995,1998],['911 993 RS',1995,1998],['911 996 Carrera',1997,2005],['911 996 Carrera 4S',2001,2005],['911 996 Turbo',2000,2005],['911 996 GT2',2001,2005],['911 996 GT3',1999,2005],['911 996 GT3 RS',2003,2005],['911 997 Carrera S',2004,2012],['911 997 Carrera 4S',2005,2012],['911 997 Turbo',2006,2013],['911 997 Turbo S',2010,2013],['911 997 GT2 RS',2010,2012],['911 997 GT3',2006,2012],['911 997 GT3 RS',2006,2012],['911 991 Carrera S',2011,2019],['911 991 Turbo S',2013,2019],['911 991 GT3',2013,2019],['911 991 GT3 RS',2015,2019],['911 991 GT2 RS',2017,2019],['911 991 R',2016,2017],['911 991 Speedster',2019,2019],['911 992 Carrera S',2019,2026],['911 992 Turbo S',2020,2026],['911 992 GT3',2021,2026],['911 992 GT3 RS',2022,2026],['911 992 Sport Classic',2022,2023],['911 992 S/T',2023,2026],['911 992 Dakar',2022,2026],['Boxster 986',1996,2004],['Boxster 987',2004,2012],['Boxster 981',2012,2016],['Boxster 982',2016,2026],['Cayman 987',2005,2012],['Cayman 981',2012,2016],['Cayman GT4 981',2015,2016],['Cayman GT4 RS',2021,2026],['Taycan Turbo S',2020,2026],['Taycan GT',2024,2026],['Cayenne Turbo GT',2022,2026],['Cayenne GTS',2003,2026],['Cayenne GTS Coupe',2019,2026],['Cayenne Turbo',2002,2026],['Cayenne S',2002,2026],['Cayenne E-Hybrid',2014,2026],['959',1986,1988],['Carrera GT',2004,2006],['918 Spyder',2013,2015]],
'Ram':[['1500 TRX',2021,2024],['1500 Classic',2019,2026],['2500 Power Wagon',2005,2026]],
'Renault':[['Alpine A110',1961,1977],['Alpine A110 2017',2017,2026],['Clio V6',2001,2005],['Clio Williams',1993,1996],['Megane RS 225',2004,2009],['Megane RS 265',2010,2012],['Megane RS 275',2013,2016],['Megane RS Trophy',2017,2021],['5 Turbo',1980,1986],['R8 Gordini',1964,1971],['Laguna V6',1993,2001]],
'Rolls-Royce':[['Silver Shadow',1965,1980],['Silver Shadow II',1977,1980],['Silver Spirit',1980,1998],['Silver Spur',1980,1994],['Corniche',1971,1995],['Camargue',1975,1986],['Silver Seraph',1998,2002],['Phantom IV',1950,1956],['Phantom V',1959,1968],['Phantom VI',1968,1991],['Phantom VII',2003,2016],['Phantom VIII',2017,2026],['Ghost I',2009,2020],['Ghost II',2020,2026],['Wraith',2013,2023],['Dawn',2015,2023],['Cullinan',2018,2026],['Spectre',2023,2026]],
'Rolls-Royce Pre-War':[['Silver Ghost',1906,1926],['Phantom I',1925,1929],['Phantom II',1929,1936],['Phantom III',1936,1939],['20hp',1922,1929],['20/25',1929,1936],['25/30',1936,1938],['Wraith',1938,1939]],
'RUF':[['CTR Yellowbird',1987,1992],['CTR2',1995,1998],['CTR3',2007,2012],['RGT',2000,2006],['RT12',2004,2010],['CTR Anniversary',2017,2022],['SCR',2018,2022],['GTR',1991,1996],['Turbo R',1991,1998],['3400S',1994,2001]],
'SAAB':[['900 Turbo',1978,1994],['900 SPG',1984,1991],['9000 Aero',1991,1998],['9-3 Viggen',1999,2002],['9-3 Aero',2002,2011],['9-5 Aero',1997,2011],['9-5 SportCombi',2005,2011],['9-2X Aero',2005,2006],['Sonett III',1970,1974]],
'Shelby':[['Cobra 260',1962,1963],['Cobra 289',1963,1965],['Cobra 427',1965,1967],['GT350',1965,1970],['GT500',1967,1970],['GT350 2011',2011,2014],['GT500 2013',2013,2014],['GT350R',2015,2020],['GT500 2020',2020,2023],['Daytona Coupe',1964,1965]],
'Subaru':[['Impreza WRX GC8',1992,2000],['Impreza WRX STI GD',2000,2007],['Impreza WRX STI GR',2007,2014],['Legacy RS',1989,1994],['Legacy B4',1998,2009],['SVX',1991,1997],['BRZ',2012,2026],['WRX STI VA',2014,2021],['WRX VB',2022,2026],['WRX S4',2021,2026],['Forester STI',2004,2013],['Sambar',1961,2012]],
'Suzuki':[['Cappuccino',1991,1998],['Jimny SJ',1981,1998],['Jimny JB',1998,2018],['Jimny JB74',2018,2026],['Alto Works',1987,2021],['Carry Van',1979,2026],['Every Van',1982,2026],['Hustler',2014,2026],['Swift Sport',2005,2026]],
'Talbot-Lago':[['T150',1935,1940],['T26',1946,1955]],
'Toyota':[['2000GT',1967,1970],['Supra A60',1981,1986],['Supra A70',1986,1993],['Supra A80',1993,2002],['Supra A90',2019,2026],['MR2 AW11',1984,1989],['MR2 SW20',1989,1999],['MR2 ZZW30',1999,2007],['Celica GT-Four ST165',1985,1989],['Celica GT-Four ST185',1989,1993],['Celica GT-Four ST205',1993,1999],['Corolla AE86',1983,1987],['Land Cruiser FJ40',1960,1984],['Land Cruiser FJ55',1967,1987],['Land Cruiser 80',1989,1997],['Land Cruiser 100',1998,2007],['Land Cruiser 200',2007,2021],['Land Cruiser 300',2021,2026],['Land Cruiser 70',1984,2026],['Hilux',1968,2026],['HiAce',1967,2026],['Hiace Super GL',2004,2026],['GR Yaris',2020,2026],['GR86',2021,2026],['GR Corolla',2022,2026],['Century',1967,2026],['Alphard',2002,2026],['Vellfire',2008,2026],['RAV4 Euro Spec',2000,2018],['Prado',1990,2026]],
'Triumph':[['TR2',1953,1955],['TR3',1955,1962],['TR4',1961,1965],['TR4A',1965,1968],['TR5',1967,1968],['TR6',1969,1976],['TR7',1975,1981],['TR8',1979,1981],['Spitfire',1962,1980],['GT6',1966,1973],['Stag',1970,1977]],
'TVR':[['Griffith',1963,1965],['Chimaera',1992,2003],['Cerbera',1994,2003],['Tuscan',1999,2006],['Tamora',2001,2006],['Sagaris',2004,2006],['T350',2002,2006]],
'Unknown/Other':[['Unknown/Other',1885,2026]],
'Veteran/Edwardian':[['Veteran Car pre-1905',1885,1904],['Edwardian Car 1905-1918',1905,1918],['Vintage Car 1919-1930',1919,1930],['Pre-War Classic 1931-1945',1931,1945]],
'Volkswagen':[['Golf GTI Mk1',1976,1983],['Golf GTI Mk2',1983,1992],['Golf GTI Mk3',1991,1997],['Golf R32 Mk4',2002,2004],['Golf R Mk6',2010,2013],['Golf R Mk7',2013,2019],['Golf R Mk8',2020,2026],['Golf GTI Mk8',2020,2026],['Golf TDI Mk4',1997,2004],['Golf TDI Mk5',2003,2009],['Golf TDI Mk6',2008,2013],['Corrado G60',1988,1995],['Corrado VR6',1991,1995],['Scirocco',1974,1992],['Phaeton W12',2002,2016],['Touareg V10 TDI',2002,2010],['Passat W8',2001,2004],['Polo GTI',1995,2026],['T3 Westfalia',1979,1991],['T4',1990,2003],['T5',2003,2015],['T6',2015,2026]],
'Volvo':[['P1800',1961,1973],['242 Turbo',1981,1984],['850 T5-R',1994,1997],['850 R Estate',1995,1997],['C70 T5',1997,2005],['S60R',2003,2009],['V70R',1997,2007],['XC70',1997,2016],['740 Turbo',1984,1992],['940 Turbo',1990,1998],['Amazon',1956,1970]]
};

const YEARS: number[] = [];
for (let y = 2026; y >= 1885; y--) YEARS.push(y);

export default function ImportCalculator() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const $ = (id: string) => root.querySelector<HTMLElement>('#' + id);
    const VERCEL_URL = window.location.origin;
    const esc = (v: unknown) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

    // ---- populate makes ----
    const makes = Object.keys(CAR_MODELS).sort();
    const mSel = $('make') as HTMLSelectElement | null;
    if (mSel) {
      makes.forEach((m) => {
        const o = document.createElement('option');
        o.value = m;
        o.textContent = m;
        mSel.appendChild(o);
      });
    }

    // ---- helpers ----
    function updateCurrency() {
      const originEl = $('origin') as HTMLSelectElement | null;
      const c = CURRENCY[originEl?.value || ''];
      if (c) {
        const sel = $('currOverride') as HTMLSelectElement | null;
        if (sel) sel.value = c.c;
      }
    }
    function overrideCurrency() {}
    function checkYearModel() {
      const year = parseInt(($('year') as HTMLSelectElement).value);
      const make = ($('make') as HTMLSelectElement).value;
      const modelEl = $('model') as HTMLSelectElement | null;
      const model = modelEl ? modelEl.value : '';
      const e = $('errMsg')!;
      if (!year || !make || !model) return;
      const models = CAR_MODELS[make] || [];
      const match = models.find((m) => m[0] === model);
      if (match && (year < match[1] || year > match[2])) {
        e.textContent = model + ' was produced ' + match[1] + '\u2013' + match[2] + '. This year/model combination may not be accurate.';
        e.style.display = 'block';
      } else if (e.textContent && e.textContent.includes('produced')) {
        e.style.display = 'none';
      }
    }
    function checkSameCountry() {
      const o = ($('origin') as HTMLSelectElement).value;
      const d = ($('dest') as HTMLSelectElement).value;
      const e = $('errMsg')!;
      if (o && d && o === d) {
        e.textContent = 'Origin and destination must be different countries.';
        e.style.display = 'block';
      } else if (e.textContent && e.textContent.includes('different countries')) {
        e.style.display = 'none';
      }
    }
    function updateModels() {
      const make = ($('make') as HTMLSelectElement).value;
      const year = parseInt(($('year') as HTMLSelectElement).value) || 0;
      const mf = $('modelField')!;
      const allMods = CAR_MODELS[make] || [];
      const filtered = year ? allMods.filter((m) => year >= m[1] && year <= m[2]) : allMods;
      const mods = filtered.length > 0 ? filtered : allMods;
      mf.innerHTML =
        '<label style="font-family:IBM Plex Mono,monospace;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#55595E;">Model</label><select id="model" style="background:#FFFFFF;border:2px solid #111111;border-radius:0;color:#111111;font-family:Inter,sans-serif;font-size:16px;font-weight:400;padding:11px 12px;outline:none;width:100%;min-height:44px;-webkit-appearance:none;appearance:none;"><option value="">' +
        (filtered.length > 0 ? 'Select (' + filtered.length + ' match)' : 'Select model') +
        '</option></select>';
      const sel = $('model') as HTMLSelectElement;
      mods.forEach((m) => {
        const o = document.createElement('option');
        o.value = m[0];
        o.textContent = m[0] + (year && (year < m[1] || year > m[2]) ? ' (' + m[1] + '-' + m[2] + ')' : '');
        sel.appendChild(o);
      });
      addListener(sel, 'change', checkYearModel);
    }

    // ---- wire form event handlers ----
    const originEl = $('origin') as HTMLSelectElement;
    const destEl = $('dest') as HTMLSelectElement;
    const yearEl = $('year') as HTMLSelectElement;
    const makeEl = $('make') as HTMLSelectElement;
    const currOverrideEl = $('currOverride') as HTMLSelectElement;

    const onOriginChange = () => { updateCurrency(); checkSameCountry(); };
    const onDestChange = () => { checkSameCountry(); };
    const onYearChange = () => { if ((($('make') as HTMLSelectElement).value)) updateModels(); checkYearModel(); };
    const onMakeChange = () => { updateModels(); };
    const onCurrOverride = () => { overrideCurrency(); };

    // ---- track every attached listener for symmetric cleanup ----
    const listeners: Array<[EventTarget, string, EventListenerOrEventListenerObject]> = [];
    const addListener = (el: EventTarget | null, type: string, handler: EventListenerOrEventListenerObject) => {
      if (!el) return;
      el.addEventListener(type, handler);
      listeners.push([el, type, handler]);
    };

    addListener(originEl, 'change', onOriginChange);
    addListener(destEl, 'change', onDestChange);
    addListener(yearEl, 'change', onYearChange);
    addListener(makeEl, 'change', onMakeChange);
    addListener(currOverrideEl, 'change', onCurrOverride);

    // ---- window-scoped state ----
    const w = window as any;

    function safeParseJSON(raw: string) {
      const a = raw.indexOf('{'), b = raw.lastIndexOf('}');
      if (a === -1 || b === -1) throw new Error('No JSON found');
      const s = raw.slice(a, b + 1);
      let out = '', inStr = false, esc = false;
      for (let i = 0; i < s.length; i++) {
        const ch = s[i], code = s.charCodeAt(i);
        if (esc) { out += ch; esc = false; continue; }
        if (ch === '\\') { esc = true; out += ch; continue; }
        if (ch === '"') { inStr = !inStr; out += ch; continue; }
        if (inStr && code < 32) {
          if (code === 10) out += '\\n';
          else if (code === 13) out += '\\r';
          else if (code === 9) out += '\\t';
          continue;
        }
        out += ch;
      }
      return JSON.parse(out);
    }

    async function calculate() {
      const origin = ($('origin') as HTMLSelectElement).value;
      const dest = ($('dest') as HTMLSelectElement).value;
      const year = ($('year') as HTMLSelectElement).value;
      const make = ($('make') as HTMLSelectElement).value;
      const modelEl = $('model') as HTMLSelectElement | null;
      const model = modelEl ? modelEl.value : '';
      const price = ($('price') as HTMLInputElement).value;
      const isModified = ($('isModified') as HTMLInputElement).checked;
      const errEl = $('errMsg')!;
      if (!origin || !dest || !year || !make || !model || !price) { errEl.textContent = 'Please fill in all fields.'; errEl.style.display = 'block'; return; }
      if (origin === dest) { errEl.textContent = 'Origin and destination must be different countries.'; errEl.style.display = 'block'; return; }
      errEl.style.display = 'none';
      $('formPanel')!.style.display = 'none';
      $('loadingPanel')!.style.display = 'block';
      $('resultsPanel')!.style.display = 'none';
      const selCurr = $('currOverride') as HTMLSelectElement | null;
      const selCurrCode = selCurr ? selCurr.value : '';
      const CURR_MAP: Record<string, {s:string;c:string}> = {'GBP':{s:'\u00a3',c:'GBP'},'EUR':{s:'\u20ac',c:'EUR'},'USD':{s:'$',c:'USD'},'JPY':{s:'\u00a5',c:'JPY'},'AUD':{s:'A$',c:'AUD'},'CAD':{s:'C$',c:'CAD'},'SEK':{s:'kr',c:'SEK'},'CHF':{s:'Fr',c:'CHF'},'ZAR':{s:'R',c:'ZAR'},'AED':{s:'Dhs',c:'AED'}};
      const oC = selCurrCode && CURR_MAP[selCurrCode] ? CURR_MAP[selCurrCode] : (CURRENCY[origin] || { s: '$', c: 'USD' });
      const dC = DEST[dest] || { s: '$', c: 'USD' };
      const age = 2026 - parseInt(year);
      const qualifiesNow = parseInt(year) <= (2026 - 25);
      const qualifyYear = parseInt(year) + 25;
      const yearsToExempt = qualifyYear - 2026;
      const nearMiss = !qualifiesNow && yearsToExempt >= 0 && yearsToExempt <= 3;
      const monthsToExempt = nearMiss ? Math.round(yearsToExempt * 12) : 0;
      const prompt = `Car import for The Daily Vroom. Car: ${year} ${make} ${model} (${age} yrs old in 2026). Route: ${CN[origin]} to ${CN[dest]}. Price: ${oC.s}${parseFloat(price).toLocaleString()} ${oC.c}.${origin === 'AE' && selCurrCode === 'AED' ? ' Pre-converted USD value: $' + Math.round(parseFloat(price) / 3.6725).toLocaleString() + ' (AED fixed peg: 1 USD = 3.6725 AED). Use this USD figure for the purchase price line item.' : ''}\n\nRULES:\n1. Flag year/model mismatches in The Daily Vroom Take.\n2. Round ALL values to nearest whole dollar. No cents, no decimals. NEVER round to nearest thousand. $141,576 is correct. $142,000 is wrong.2b. For the Purchase Price sublabel always use this exact format: "[Year] [Make] [Model], converted at live ECB rate" — never show intermediate USD conversion steps or exchange rate numbers in the sublabel.\n3. No markdown in tdv_take - plain sentences only, no asterisks, no bold.\n3b. ALWAYS use the destination currency symbol ${dC.s} before numbers in tdv_take. NEVER write currency codes like GBP, USD, EUR, AUD after numbers.\n4. NEVER show source country VAT as a line item. Omit completely.\n5. 25-YEAR RULE - US DESTINATION ONLY:\n   - ONLY applies when destination is United States.\n   - For US destination this ${year} car: ${qualifiesNow ? 'QUALIFIES for 25-year rule. No EPA/DOT compliance needed. Section 232 auto tariff (25%) is exempt for vehicles 25+ years old. However reciprocal tariffs still apply regardless of vehicle age. Apply these rates by origin: UK=10% total (2.5% MFN + 7.5% reciprocal, UK-US deal). Use sublabel: 10% of CIF (UK-US trade deal rate, applies regardless of vehicle age). Germany/France/Italy/Netherlands/Sweden/Ireland/Belgium=15% total (2.5% MFN + 12.5% reciprocal, EU-US framework). Use sublabel: 15% of CIF (EU reciprocal tariff, applies regardless of vehicle age). Japan=15% total. Use sublabel: 15% of CIF (Japan reciprocal tariff, applies regardless of vehicle age). Australia/Switzerland/South Africa/UAE=27.5% total. Use sublabel: 27.5% of CIF (2.5% MFN + 25% reciprocal tariff). Canada=USMCA near 0%. Apply the correct rate for origin ${origin}. For compliance line item use label "Title and registration" with sublabel "State DMV processing" — do NOT say EPA/DOT for 25-year exempt vehicles. In tdv_take, NEVER mention EPA, DOT, NHTSA or compliance paperwork for 25-year exempt vehicles. This is an absolute rule — do not reference compliance in any form for 25+ year old vehicles importing to US.' : nearMiss ? 'will qualify in ' + qualifyYear + ' (' + monthsToExempt + ' months away)' : 'does NOT qualify. Apply these CURRENT 2026 Section 232 rates by origin: UK=10% total (2.5% MFN + 7.5% Section 232 automotive tariff, UK-US deal). Use sublabel: 10% of CIF (UK-US trade deal rate). Germany/France/Italy/Netherlands/Sweden/Ireland/Belgium/Portugal=15% total (EU-US framework deal). Use sublabel: 15% of CIF (EU-US Turnberry Agreement rate — under review, July 2026 deadline).Japan=15% total (US-Japan framework deal). Use sublabel: 15% of CIF (Japan standard rate). Australia/Switzerland/South Africa/UAE=27.5% total (2.5% MFN + 25% Section 232 automotive tariff, no trade deal). Use sublabel: 27.5% of CIF (2.5% MFN + 25% Section 232 automotive tariff). Canada=USMCA-compliant near 0%, non-USMCA 27.5%. Apply the correct rate for origin ${origin}.'}\n   ${dest === 'US' && nearMiss ? `*** DUTY RATE FOR THIS NEAR-MISS CAR ***
This car does NOT yet qualify for the 25-year rule. Apply the correct 2026 Section 232 rate for origin ${origin}: UK=10% of CIF (UK-US trade deal rate). Germany/France/Italy/Netherlands/Sweden/Ireland/Belgium/Portugal=15% of CIF (EU-US Turnberry Agreement rate). Japan=15% of CIF. Australia/Switzerland/South Africa/UAE=27.5% of CIF. Do NOT use 2.5% — that only applies to cars that already qualify.

*** STORAGE STRATEGY NET MATH ***
Duty saving by waiting = the import duty line item value (call this DUTY_SAVING).

Storage cost = $200/month x ${monthsToExempt} months = $${monthsToExempt * 200}.
NET = DUTY_SAVING minus $${monthsToExempt * 200}.
IF NET > 0: show duty as real line item, add green saving line, set storage_play true, tdv_take must state the net saving and recommend waiting.
IF NET <= 0: do NOT show saving line, set storage_play false, tdv_take must say waiting does not pencil out — storage costs $${monthsToExempt * 200} but only saves $[DUTY_SAVING] in duty. Import now.` : ''}\n5d. CHICKEN TAX - US DESTINATION ONLY: If the vehicle is a pickup truck (Hilux, Land Cruiser pickup, Ranger, any vehicle classified as a light truck/pickup), import duty to the US is 25% of CIF regardless of vehicle age. The 25-year rule removes safety/emissions compliance only — it does NOT reduce the 25% Chicken Tax on trucks. Flag clearly in tdv_take and import duty sublabel: "25% light truck tariff (Chicken Tax) — applies regardless of vehicle age."\n5b. EPA/DOT: For sub-25-year cars importing to US that do NOT qualify for the 25-year exemption: EPA/DOT compliance line item must include sublabel noting "May require EPA/DOT compliance conversion ($15,000-$30,000 depending on spec and pathway) — not included here." Flag this clearly in tdv_take. NEVER mention EPA/DOT for UK, EU, Ireland, Belgium, Australia, Canada, Japan, UAE, or 25-year exempt vehicles.\n5c. US-MARKET CARS: If modern post-2005 car with US market variant, note compliance may already be met.\n6. COST ACCURACY - label uncertain fees as "Estimated" in sublabel:\n   - FOB: ONLY include for US, Japan, Australia, Canada, South Africa, UAE origins. $100-500. Label "Estimated". Do NOT include FOB for UK or European origins (Germany, France, Italy, Netherlands, Sweden, Switzerland, Ireland, Belgium).\n   - RoRo freight UK/EU to US: $1,800-2,400. UK/EU to UAE (Jebel Ali): $1,400-1,900. Japan to US West Coast: $1,200-1,800. Japan to UAE: $800-1,200. Japan to Australia: $800-1,400. Japan to EU (Sweden, Germany, Netherlands, France, Italy, Belgium, Ireland): $1,400-1,800. AU to US: $2,000-2,800. AU to UAE: $900-1,400. US to UK: $1,800-2,400. US to UAE: $1,800-2,400.\n   - Port and broker: US $900-1,200. UK $400-700. AU $600-900. EU $400-700. UAE Dhs2,000-4,000 (~$550-1,100). Label "Estimated".\n   - Final mile: $400-700. Label "Estimated".\n   - Marine insurance: exactly 1% of purchase price (vehicle value).\n   - Compliance: $500-1,200. UK="IVA test and DVLA registration". AU="ADR compliance and state registration". JP="Shaken inspection — only include for cars importing TO Japan, not FROM Japan". UAE="ESMA registration and RTA plate" (~$300, both LHD and RHD accepted). NEVER "DOT/EPA" for non-US destinations or 25-year exempt vehicles.\n7. RHD RULE: Do NOT assume RHD from UK origin. European marques are LHD. Flag RHD for British marques (Aston Martin, Jaguar, Land Rover, Rolls-Royce, TVR) or Japanese cars. If RHD to US: no California, recommend FL/TX/OR/MT. UAE accepts both LHD and RHD with no restriction.\n7b. CRITICAL DUTY CALCULATION ORDER:\nStep 1: CIF = purchase price + FOB + RoRo freight + marine insurance\nStep 2: Import duty = CIF x applicable rate (NEVER purchase price alone)\nStep 3: VAT/GST where applicable = (CIF + duty) x VAT rate\nNEVER apply duty to purchase price only. Always use full CIF. CRITICAL TOTAL RULE: The final total is the arithmetic sum of exactly the line items shown — nothing more. If marine insurance appears as a line item at value X, it must NOT be added again anywhere. The total must equal: sum of all visible line item values. Cross-check your total against the sum of your line items before outputting.\nANTIQUE VEHICLE RULE: If the vehicle is 100 years old or older (manufactured in 1926 or earlier for 2026), flag in tdv_take that it may qualify as an antique under HTSUS 9706 rather than standard vehicle classification. This can materially affect duty rates. Add a sublabel note on the import duty line: "Vehicle may qualify as antique under HTSUS 9706 — verify classification with broker before assuming standard vehicle duty applies." Do not change the duty calculation, just add the flag.\n\nINTRA-EU RULE: When both origin AND destination are EU member states (Germany, France, Italy, Netherlands, Sweden, Belgium, Ireland, Portugal), there is NO import duty — free movement of goods applies within the EU single market. Show import duty as €0 with sublabel: EU single market — no import duty between member states.\n7c. DUTY SUBLABELS FOR NON-US DESTINATIONS: When destination is NOT the US, show the destination country's own import duty rate and name it correctly. Example: importing to Italy = 'EU import duty 6.5% of CIF'. Do NOT reference US tariff frameworks for non-US destinations.\nUK HISTORIC VEHICLE RULE: When destination is UK and the car is 30 years old or older, apply 0% import duty (HMRC historic vehicle classification) instead of the standard 6.5%. Use sublabel: UK historic vehicle — 0% duty (HMRC classification, verify original condition). If car is under 30 years old importing to UK, apply standard 6.5% duty. UK VAT: 5% for vehicles 30+ years old in original condition (verify with HMRC). 20% for vehicles under 30 years old or substantially modified. Applied to full CIF plus duty.\n7d. VAT/GST CALCULATION:\n   - UAE: 5% import duty on CIF value, then 5% VAT on (CIF + duty). AED pegged to USD at 3.6725. No luxury car tax.\n   - UK VAT: vehicles under 30 years old = 20% on full CIF plus duty. Vehicles 30 years old or older = 5% VAT on full CIF plus duty IF in original condition with no substantial modifications (HMRC historic vehicle classification, Heading 9705). Use sublabel: UK historic vehicle rate — 5% VAT (verify original condition with HMRC). If substantially modified, standard 20% VAT applies.\n   - Australia GST 10%: applied to CIF + duty. LCT 33% ONLY if total dutiable value EXCEEDS A$76,950.\n    - EU VAT: applied to CIF + duty. Sweden VAT 25%. Ireland VAT 23%. Belgium VAT 21%. France VAT 20%. Italy VAT 22%. Germany VAT 19%. Netherlands VAT 21%. Apply the correct rate for the specific destination country — do not guess.\n   - US: no federal VAT.\n8. SIGNAL: Use exactly one of these seven signal_level values: exceptional, green, good, amber, caution, red, avoid. Criteria: EXCEPTIONAL (exceptional) = import fees under 12% AND genuine value advantage — 25-year rule just kicked in, car unavailable domestically, weak currency window. STRONG BUY (green) = fees 12-20%, route works well, clear upside to importing this specific car. GOOD VALUE (good) = fees 20-28%, worth pursuing if car checks out on condition. VIABLE WITH CAVEATS (amber) = fees 28-35%, one specific issue could change the picture. PROCEED WITH CAUTION (caution) = fees 35-45%, high costs or structural problem with route or car. THINK TWICE (red) = fees 45-60%, math is hard to justify unless you specifically want this car. AVOID (avoid) = fees over 60%, OR modern car with 27.5% tariff plus compliance required plus no domestic advantage — walk away. Modern car under 10yrs from AU/ZA/CH/AE to US = caution or avoid depending on total cost. UK/EU/JP origin with 10-15% rate = good or amber. 25-year exempt car to US with low fees = exceptional or green. Never output just the colour name.\n9. Do not describe car era loosely. NEVER double-count purchase price. NEVER include CIF Value, CIF Total, subtotals, or Total Landed Cost as a line item — not even as a reference row. Line items are individual cost components only: purchase price, FOB, freight, insurance, duty, VAT, port/broker, final mile, compliance.\n10. 10. End with one documentation sentence: key docs + licensed customs broker essential.
11. MODIFIED VEHICLE FLAG: ${isModified ? 'This vehicle has been significantly modified from stock. In the tdv_take, flag that modified vehicles can face customs valuation challenges, potential reclassification by CBP, and that a broker experienced with modified exotics is essential before committing. This is a meaningful risk and should be the second sentence of the take.' : ''}\n\nCalculate in ${dC.c} using LIVE rates from injected data above. AED EXCEPTION: AED is not on ECB - it is permanently pegged at 3.6725 per USD. Use the pre-converted USD value shown above for all AED calculations.\n\nThe Daily Vroom Take: EXACTLY 2 sentences, 40 words max. Do NOT explain the calculation mechanics. Focus on decision impact only. If signal_level is red or THINK TWICE: open with 'This only makes sense if you specifically want this car.' Then exactly one sentence on the single biggest cost risk — pick either the tariff cost OR the compliance cost, whichever is larger. Never mention both. No broker line. Max 35 words total for the entire take. If signal_level is amber or VIABLE WITH CAVEATS: sentence 1 = opportunity only, no costs. Sentence 2 = pick the LARGEST single cost number and mention that one figure only. HARD RULE: if you mention EPA/DOT you may not mention tariff. If you mention tariff you may not mention EPA/DOT. One cost. One sentence. Max 35 words total. If signal_level is green or STRONG BUY: open with the opportunity or value case for this specific car. Be direct and enthusiastic. One sentence on any key caveat to verify. Never use the 'This only makes sense' opener for green signals. CRITICAL: For any vehicle 25 years or older importing to US, the tdv_take MUST NOT contain the words EPA, DOT, NHTSA, compliance, homologation, or any reference to import regulations being avoided or waived. Only mention price, condition, tariff verification, and broker. Zero exceptions.\n\nJSON only: {"dest_currency_symbol":"${dC.s}","dest_currency_code":"${dC.c}","line_items":[{"label":"Purchase Price","sublabel":"converted at live ECB rate","value":0}],"total":0,"signal":"VIABLE WITH CAVEATS","signal_level":"amber","storage_play":false,"tdv_take":"."}`;
      try {
        const r = await fetch(`${API_BASE}api/calculate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'claude-haiku-4-5', max_tokens: 2500, system: 'You are a car import cost calculator. Return ONLY a valid JSON object. No markdown, no text before or after. Never use literal newlines inside JSON string values, use \\n instead.', messages: [{ role: 'user', content: prompt }], log: { origin, dest, make, model, year, price_local: parseFloat(price), currency: oC.c } }) });
        if (!r.ok) { const t = await r.text(); throw new Error('HTTP ' + r.status + ': ' + t.slice(0, 200)); }
        const d = await r.json();
        const raw = (d.content || []).map((b: any) => b.text || '').join('').trim();
        const parsed = safeParseJSON(raw);
        parsed._supabase_row_id = d._supabase_row_id || null;
        renderResults(parsed, year, make, model, origin, dest, dC.s);
      } catch (e: any) {
        $('loadingPanel')!.style.display = 'none';
        $('formPanel')!.style.display = 'block';
        errEl.textContent = e.message && e.message.includes('529') ? 'A lot of people are running numbers right now, please give it a second and try again.' : (e.message || 'Unknown error');
        errEl.style.display = 'block';
      }
    }

    function renderResults(r: any, year: string, make: string, model: string, origin: string, dest: string, sym: string) {
      sym = r.dest_currency_symbol || sym;
      const total = Math.round(Number(r.total));
      const purchaseItem = (r.line_items || []).find((i: any) => i.label === 'Purchase Price' || i.label.toLowerCase().includes('purchase'));
      const purchaseVal = purchaseItem ? Math.round(Number(purchaseItem.value)) : 0;
      const delta = total - (purchaseVal || total * 0.7);
      const deltaPercent = purchaseVal > 0 ? Math.round((delta / purchaseVal) * 100) : 0;
      const carAge = 2026 - parseInt(year);
      const qualifiesNow = parseInt(year) <= (2026 - 25);
      const apiLevel = (r.signal_level || 'amber').toLowerCase();
      let sigLevel: string, sigLabel: string;
      if (deltaPercent < 12) { sigLevel = 'exceptional'; sigLabel = 'EXCEPTIONAL VALUE'; }
      else if (deltaPercent < 20) { sigLevel = 'green'; sigLabel = 'STRONG BUY'; }
      else if (deltaPercent < 28) { sigLevel = 'good'; sigLabel = 'GOOD VALUE'; }
      else if (deltaPercent < 35) { sigLevel = 'amber'; sigLabel = 'VIABLE WITH CAVEATS'; }
      else if (deltaPercent < 45) { sigLevel = 'caution'; sigLabel = 'PROCEED WITH CAUTION'; }
      else if (deltaPercent < 60) { sigLevel = 'red'; sigLabel = 'THINK TWICE'; }
      else { sigLevel = 'avoid'; sigLabel = 'AVOID'; }
      if (apiLevel === 'avoid') { sigLevel = 'avoid'; sigLabel = 'AVOID'; }
      else if (apiLevel === 'red' && sigLevel !== 'avoid') { sigLevel = 'red'; sigLabel = 'THINK TWICE'; }
      else if (apiLevel === 'caution' && !['avoid', 'red'].includes(sigLevel)) { sigLevel = 'caution'; sigLabel = 'PROCEED WITH CAUTION'; }
      else if (apiLevel === 'exceptional' && sigLevel === 'exceptional') { sigLevel = 'exceptional'; sigLabel = 'EXCEPTIONAL VALUE'; }
      else if (apiLevel === 'green' && sigLevel === 'exceptional') { sigLevel = 'exceptional'; sigLabel = 'EXCEPTIONAL VALUE'; }
      if (dest === 'US' && qualifiesNow && !['avoid', 'red', 'caution'].includes(sigLevel)) {
        if (deltaPercent < 12) { sigLevel = 'exceptional'; sigLabel = 'EXCEPTIONAL VALUE'; }
        else { sigLevel = 'green'; sigLabel = 'STRONG BUY'; }
      }
      if (dest === 'US' && carAge < 25 && ['exceptional', 'green'].includes(sigLevel)) { sigLevel = 'good'; sigLabel = 'GOOD VALUE'; }
      if (total < 15000 && sigLevel === 'avoid' && apiLevel !== 'avoid') { sigLevel = 'red'; sigLabel = 'THINK TWICE'; }
      if (dest === 'US' && carAge < 3 && (origin === 'AU' || origin === 'ZA' || origin === 'CH' || origin === 'AE') && sigLevel !== 'exceptional') { sigLevel = 'avoid'; sigLabel = 'AVOID'; }
      const storageFlag = r.storage_play === true && dest === 'US';
      const isMobile = window.innerWidth <= 560;
      $('resHead')!.textContent = year + ' ' + make + ' ' + model + ' \u2014 ' + CN[origin] + ' \u2192 ' + CN[dest];
      $('adjustHint')!.style.display = 'block';
      const table = $('costTable')!;
      table.innerHTML = '';
      const filteredItems = (r.line_items || []).filter((item: any) => !item.label.toLowerCase().includes('cif') && !item.label.toLowerCase().includes('subtotal') && !item.label.toLowerCase().includes('total landed'));
      filteredItems.forEach((item: any, i: number) => {
        const val = Math.round(Number(item.value));
        const isSaving = val < 0;
        const row = document.createElement('div');
        row.className = (isSaving ? 'savrow' : 'crow') + ' breakdown-row';
        if (isMobile) row.style.display = 'none';
        const isNotIncluded = val === 0 && item.sublabel && item.sublabel.toLowerCase().includes('not included');
        const displayVal = isNotIncluded ? '\u2014' : isSaving ? '\u2212 ' + sym + Math.abs(val).toLocaleString() : sym + val.toLocaleString();
        const valAttr = isNotIncluded ? 0 : Math.abs(val);
        row.innerHTML = '<div class="clbl">' + esc(item.label) + (item.sublabel ? '<span class="csub">' + esc(item.sublabel) + '</span>' : '') + '</div><div class="cval" id="cv_' + i + '">' + esc(displayVal) + '</div>';
        row.dataset.val = String(isSaving ? -valAttr : valAttr);
        row.dataset.active = 'true';
        row.style.cursor = 'pointer';
        row.title = 'Tap to remove from total';
        row.onclick = function (this: HTMLElement) {
          const active = this.dataset.active === 'true';
          const v = parseFloat(this.dataset.val || '0') || 0;
          const cvEl = this.querySelector('.cval') as HTMLElement;
          if (active) { this.dataset.active = 'false'; this.style.opacity = '0.3'; cvEl.textContent = '\u2014'; adjustTotal(-v); }
          else { this.dataset.active = 'true'; this.style.opacity = '1'; cvEl.textContent = isSaving ? '\u2212 ' + sym + Math.abs(v).toLocaleString() : sym + Math.abs(v).toLocaleString(); adjustTotal(v); }
        };
        table.appendChild(row);
      });
      const tot = document.createElement('div');
      tot.className = 'totrow';
      tot.innerHTML = '<span class="tot-lbl">Total Landed Cost</span><span class="tot-val">' + esc(sym) + esc(total.toLocaleString()) + '</span>';
      table.appendChild(tot);
      const deltaEl = $('deltaLine')!;
      const deltaValEl = $('deltaVal')!;
      if (purchaseVal > 0) {
        const sign = delta >= 0 ? '+' : '';
        deltaValEl.textContent = sign + sym + delta.toLocaleString() + ' in fees (' + sign + deltaPercent + '%)';
        deltaEl.style.display = 'flex';
        $('shareBlock')!.style.display = 'block';
      }
      const ctxEl = $('contextLine')!;
      let ctxText = 'Typical imports add 20\u201330% on top of purchase price. Shared container shipping may be available on some routes at lower cost than RoRo \u2014 check with your shipping agent for availability and pricing.';
      if (deltaPercent > 30 && sigLevel !== 'green' && dest !== 'UK' && dest !== 'IE' && dest !== 'BE') ctxText += ' <span>This is above the typical range.</span>';
      else if (deltaPercent < 20 && !(dest === 'US' && carAge < 25) && purchaseVal < 100000) ctxText += ' <span>This is relatively low.</span>';
      ctxEl.innerHTML = ctxText;
      ctxEl.style.display = 'block';
      const toggleBtn = $('breakdownToggle')!;
      toggleBtn.style.display = 'block';
      toggleBtn.textContent = isMobile ? 'View full cost breakdown' : 'Hide cost breakdown';
      toggleBtn.dataset.open = isMobile ? 'false' : 'true';
      const sigHtml = '<div class="sig ' + esc(sigLevel) + '"><span class="sigdot"></span>' + esc(sigLabel) + '</div>' + (storageFlag ? '<div class="storybadge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="1"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>Storage Play</div>' : '');
      $('sigTag')!.innerHTML = sigHtml;
      const paras = (r.tdv_take || '').split('\n\n').filter((p: string) => p.trim());
      $('verdictText')!.innerHTML = paras.map((p: string) => '<p>' + esc(p) + '</p>').join('');
      const staxPanel = $('stateTaxPanel')!;
      const staxSel = $('stateSel') as HTMLSelectElement;
      const staxResult = $('stateTaxResult')!;
      if (dest === 'US') {
        staxPanel.style.display = 'block';
        staxPanel.dataset.total = String(total);
        staxPanel.dataset.sym = sym;
        if (staxSel.options.length <= 1) {
          Object.keys(STATE_NAMES).sort((a, b) => STATE_NAMES[a].localeCompare(STATE_NAMES[b])).forEach((code) => {
            const o = document.createElement('option');
            o.value = code;
            o.textContent = STATE_NAMES[code] + (STATE_TAX[code] === 0 ? ' (no sales tax)' : ' (' + Math.round(STATE_TAX[code] * 1000) / 10 + '%)');
            staxSel.appendChild(o);
          });
        }
        staxSel.onchange = function (this: HTMLSelectElement) {
          const code = this.value; if (!code) { staxResult.innerHTML = ''; return; }
          const rate = STATE_TAX[code]; const t = parseInt(staxPanel.dataset.total || '0'); const s = staxPanel.dataset.sym;
          const tax = Math.round(t * rate); const grand = t + tax + 250;
          staxResult.innerHTML = '<div class="srow"><span>Sales tax \u2014 ' + esc(STATE_NAMES[code]) + (rate === 0 ? ' (none)' : ' (' + Math.round(rate * 1000) / 10 + '% state base)') + '</span><span class="sval">' + esc(s) + (rate === 0 ? '0' : esc(tax.toLocaleString())) + (rate > 0 ? ' <em>+ local</em>' : '') + '</span></div><div class="srow"><span>Title &amp; registration</span><span class="sval">' + esc(s) + '250 <em>est.</em></span></div><div class="stot"><span>All-in total</span><span class="stot-val">' + esc(s) + esc(grand.toLocaleString()) + '</span></div>';
        };
      } else { staxPanel.style.display = 'none'; }
      w._lastCalc = { year, make, model, origin, dest, sym, purchaseVal, total, delta, deltaPercent, sigLabel, originName: CN[origin] || origin, destName: CN[dest] || dest, rowId: r._supabase_row_id || null };
      w._lastOutputs = r;
      const originCurrency = CURRENCY[origin] ? CURRENCY[origin].c : 'USD';
      const destCurrency = DEST[dest] ? DEST[dest].c : 'USD';
      const sameCurrency = originCurrency === destCurrency;
      if (r._supabase_row_id) { fetch(`${API_BASE}api/calculate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ log: { row_id: r._supabase_row_id, total_landed: total, delta_percent: sameCurrency ? deltaPercent : null } }) }).catch(() => {}); }
      $('intentWrap')!.style.display = 'block';
      $('intentConfirm')!.style.display = 'none';
      $('intentBtns')!.style.display = 'flex';
      $('loadingPanel')!.style.display = 'none';
      $('resultsPanel')!.style.display = 'block';
    }

    function adjustTotal(delta: number) {
      const totEl = root!.querySelector('.tot-val') as HTMLElement | null;
      if (!totEl) return;
      const current = parseInt((totEl.textContent || '').replace(/[^0-9]/g, ''));
      const sym = w._lastCalc ? w._lastCalc.sym : '$';
      totEl.textContent = sym + (current + delta).toLocaleString();
    }

    function logIntent(val: string) {
      $('intentConfirm')!.style.display = 'block';
      $('intentBtns')!.style.display = 'none';
      const c = w._lastCalc;
      if (c && c.rowId) { fetch(`${API_BASE}api/calculate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ log: { row_id: c.rowId, intent: val } }) }).catch(() => {}); }
    }

    function generateShareCard(c: any) {
      const canvas = document.createElement('canvas');
      canvas.width = 1200; canvas.height = 630;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#FAFAF8'; ctx.fillRect(0, 0, 1200, 630);
      ctx.fillStyle = '#E63312'; ctx.fillRect(0, 0, 1200, 8);
      const sign = c.delta >= 0 ? '+' : '';
      ctx.font = '900 64px Archivo,Arial,sans-serif'; ctx.fillStyle = '#111111';
      ctx.fillText((c.year + ' ' + c.make + ' ' + c.model).toUpperCase(), 60, 120);
      ctx.font = '500 24px IBM Plex Mono,monospace'; ctx.fillStyle = '#3A3A3A';
      ctx.fillText((c.originName || c.origin) + ' to ' + (c.destName || c.dest), 60, 165);
      ctx.strokeStyle = '#111111'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(60, 210); ctx.lineTo(1140, 210); ctx.stroke();
      ctx.font = '900 80px Archivo,Arial,sans-serif'; ctx.fillStyle = '#E63312';
      ctx.fillText('Importing this adds ' + sign + c.sym + c.delta.toLocaleString(), 60, 340);
      ctx.font = '500 32px IBM Plex Mono,monospace'; ctx.fillStyle = '#111111';
      ctx.fillText(c.sym + (c.purchaseVal || 0).toLocaleString() + ' listed   \u2192   ' + c.sym + c.total.toLocaleString() + ' landed', 60, 430);
      ctx.font = '400 24px Inter,Arial,sans-serif'; ctx.fillStyle = '#55595E';
      ctx.fillText("Most buyers don't factor this in", 60, 475);
      ctx.strokeStyle = '#D9D9D4'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(60, 490); ctx.lineTo(1140, 490); ctx.stroke();
      ctx.font = '500 20px IBM Plex Mono,monospace'; ctx.fillStyle = '#55595E';
      ctx.fillText('Run your own numbers at thedailyvroom.com/import-calculator', 60, 540);
      const ts = 'The Daily Vroom';
      const tw = ctx.measureText(ts).width;
      ctx.fillText(ts, 1140 - tw, 540);
      return canvas;
    }

    async function handleShare() {
      const c = w._lastCalc;
      if (!c) return;
      const conf = $('shareConfirmInline')!;
      const sheet = $('shareSheet')!;
      conf.textContent = 'Saving...';
      conf.classList.add('show');
      const inputs = { origin: c.origin, dest: c.dest, year: c.year, make: c.make, model: c.model };
      const outputs = w._lastOutputs;
      try {
        const r = await fetch(`${API_BASE}api/share`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ inputs, outputs }) });
        const d = await r.json();
        const url = window.location.origin + API_BASE + 'import-calculator/?c=' + d.token;
        w._shareUrl = url;
        ($('shareLinkInput') as HTMLInputElement).value = url;
        sheet.style.display = 'block';
        conf.textContent = '';
        conf.classList.remove('show');
        await (document as any).fonts.ready;
        const canvas = generateShareCard(c);
        const existing = $('shareCardPreview');
        if (existing) existing.remove();
        const wrapper = document.createElement('div');
        wrapper.id = 'shareCardPreview';
        wrapper.style.cssText = 'margin-top:12px;max-height:400px;overflow:hidden;';
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        img.style.cssText = 'width:100%;height:auto;border:2px solid #111111;display:block;';
        const dlBtn = document.createElement('button');
        dlBtn.textContent = 'Download Card';
        dlBtn.style.cssText = 'margin-top:8px;background:#FFFFFF;border:2px solid #111111;color:#111111;padding:11px 16px;font-family:IBM Plex Mono,monospace;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;width:100%;min-height:44px;';
        dlBtn.onclick = function () {
          const a = document.createElement('a');
          a.download = 'tdv-import-calc-' + c.make.toLowerCase().replace(/\s/g, '-') + '-' + c.year + '.png';
          a.href = canvas.toDataURL('image/png');
          a.click();
        };
        const xBtn = document.createElement('button');
        xBtn.textContent = 'Share on X';
        xBtn.style.cssText = 'margin-top:6px;background:#E63312;border:2px solid #E63312;color:#FFFFFF;padding:11px 16px;font-family:IBM Plex Mono,monospace;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;width:100%;min-height:44px;';
        xBtn.onclick = function () {
          const sign = c.delta >= 0 ? '+' : '';
          const tweet = 'This ' + c.year + ' ' + c.make + ' ' + c.model + ' is listed at ' + c.sym + (c.purchaseVal || 0).toLocaleString() + ' in ' + (c.originName || c.origin) + '. Landing it in ' + (c.destName || c.dest) + '? ' + c.sym + c.total.toLocaleString() + " all-in. That's " + sign + c.sym + c.delta.toLocaleString() + " in import costs you don't see on the listing.\n\n" + url;
          window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweet), '_blank');
        };
        wrapper.appendChild(img);
        wrapper.appendChild(dlBtn);
        wrapper.appendChild(xBtn);
        $('shareBlock')!.appendChild(wrapper);
      } catch (e) {
        conf.textContent = 'Could not generate link.';
        setTimeout(() => conf.classList.remove('show'), 3000);
      }
    }

    function copyShareLink() {
      const input = $('shareLinkInput') as HTMLInputElement;
      const conf = $('shareConfirmInline')!;
      input.select();
      try { navigator.clipboard.writeText(input.value).catch(() => document.execCommand('copy')); }
      catch (e) { document.execCommand('copy'); }
      conf.textContent = 'Copied!';
      conf.classList.add('show');
      setTimeout(() => conf.classList.remove('show'), 2500);
    }

    function toggleBreakdown() {
      const rows = root!.querySelectorAll<HTMLElement>('.breakdown-row');
      const btn = $('breakdownToggle')!;
      const isOpen = btn.dataset.open === 'true';
      rows.forEach((rw) => (rw.style.display = isOpen ? 'none' : ''));
      btn.textContent = isOpen ? 'View full cost breakdown' : 'Hide cost breakdown';
      btn.dataset.open = isOpen ? 'false' : 'true';
    }

    function subscribeEmail() {
      const email = ($('subEmail') as HTMLInputElement).value.trim();
      const conf = $('subConfirm')!;
      if (!email || !email.includes('@')) { conf.textContent = 'Please enter a valid email.'; conf.style.color = '#B21E00'; return; }
      conf.textContent = 'Subscribing...';
      conf.style.color = '#55595E';
      fetch(`${API_BASE}api/subscribe`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
        .then((r) => r.json())
        .then((d) => {
          if (d.success) { conf.textContent = "You're in. Welcome to TDV."; conf.style.color = '#1E7A46'; ($('subEmail') as HTMLInputElement).value = ''; }
          else { conf.textContent = 'Something went wrong. Try again.'; conf.style.color = '#B21E00'; }
        })
        .catch(() => { conf.textContent = 'Something went wrong. Try again.'; conf.style.color = '#B21E00'; });
    }

    function notifyParentResize() {
      const h = document.documentElement.scrollHeight;
      window.parent.postMessage({ source: 'tdv-calculator', calculator: 'import', iframeHeight: h }, '*');
    }
    const resizeInterval = window.setInterval(notifyParentResize, 300);

    function resetCalc() {
      $('resultsPanel')!.style.display = 'none';
      $('formPanel')!.style.display = 'block';
      $('errMsg')!.style.display = 'none';
      $('stateTaxResult')!.innerHTML = '';
      ($('stateSel') as HTMLSelectElement).value = '';
      $('deltaLine')!.style.display = 'none';
      $('contextLine')!.style.display = 'none';
      $('breakdownToggle')!.style.display = 'none';
      $('shareBlock')!.style.display = 'none';
      $('shareSheet')!.style.display = 'none';
      ($('shareLinkInput') as HTMLInputElement).value = '';
      $('intentWrap')!.style.display = 'none';
      $('adjustHint')!.style.display = 'none';
      w._shareUrl = null;
      const h = $('sharedHeader');
      window.scrollTo(0, 0);
      window.parent.postMessage({ scrollToTop: true }, '*');
      if (h) h.remove();
    }

    // ---- shared calc loader ----
    function showSharedHeader(inputs: any, outputs: any) {
      const existing = $('sharedHeader');
      if (existing) existing.remove();
      const sym = outputs.dest_currency_symbol || '$';
      const div = document.createElement('div');
      div.id = 'sharedHeader';
      div.style.cssText = 'background:#FFFFFF;border:2px solid #111111;border-left:4px solid #E63312;padding:16px 20px;margin-bottom:8px;';
      div.innerHTML = `<div style="font-family:'Archivo',sans-serif;font-size:12px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#E63312;margin-bottom:8px;">Shared Calculation</div><div style="font-family:'Archivo',sans-serif;font-size:18px;font-weight:800;letter-spacing:-0.01em;color:#111111;margin-bottom:4px;">${esc(inputs.year)} ${esc(inputs.make)} ${esc(inputs.model)}</div><div style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:#3A3A3A;margin-bottom:10px;">${esc(inputs.origin)} \u2192 ${esc(inputs.dest)} &nbsp;&middot;&nbsp; Estimated landed cost: ${esc(sym)}${esc(Number(outputs.total).toLocaleString())}</div><div style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:#55595E;margin-bottom:12px;">Shared via The Daily Vroom Import Calculator</div><button data-tdv-reset="1" style="background:#111111;border:2px solid #111111;color:#FFFFFF;padding:10px 16px;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;min-height:44px;">Run your own calculation</button>`;
      const btn = div.querySelector('[data-tdv-reset]') as HTMLElement | null;
      if (btn) btn.onclick = resetCalc;
      const wrap = root!.querySelector('.wrap')!;
      wrap.insertBefore(div, $('formPanel'));
    }

    async function loadSharedCalc() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('c');
      if (!token) return;
      $('formPanel')!.style.display = 'none';
      $('loadingPanel')!.style.display = 'block';
      try {
        const r = await fetch(`${API_BASE}api/share?token=` + token);
        if (!r.ok) throw new Error('not found');
        const d = await r.json();
        const { inputs, outputs } = d;
        showSharedHeader(inputs, outputs);
        renderResults(outputs, inputs.year, inputs.make, inputs.model, inputs.origin, inputs.dest, outputs.dest_currency_symbol);
      } catch (e) {
        $('loadingPanel')!.style.display = 'none';
        $('formPanel')!.style.display = 'block';
        $('errMsg')!.textContent = 'This shared link is invalid or has expired.';
        $('errMsg')!.style.display = 'block';
      }
    }

    // ---- wire click handlers to buttons ----
    const clickHandlers: Array<[string, () => void]> = [
      ['calcBtn', calculate],
      ['shareBtnEl', handleShare],
      ['copyBtnEl', copyShareLink],
      ['breakdownToggle', toggleBreakdown],
      ['resetBtnEl', resetCalc],
      ['subBtnEl', subscribeEmail],
    ];
    clickHandlers.forEach(([id, fn]) => {
      addListener($(id), 'click', fn);
    });
    addListener($('intentYesBtn'), 'click', () => logIntent('yes'));
    addListener($('intentExploringBtn'), 'click', () => logIntent('exploring'));

    // expose reference to VERCEL_URL to avoid unused warning (parity with original)
    void VERCEL_URL;

    // ---- kick off shared-calc load on mount ----
    loadSharedCalc();

    return () => {
      window.clearInterval(resizeInterval);
      listeners.forEach(([el, type, handler]) => el.removeEventListener(type, handler));
      listeners.length = 0;
    };
  }, []);

  return (
    <div className="tdv-ic" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <header className="mast">
        <div className="mast-name">The Daily <em>Vroom</em></div>
        <div className="mast-tag">Import Calculator Beta</div>
        <div className="mast-tariff" id="tariffDate">Tariff rates: May 2026</div>
      </header>
      <nav className="nav-tabs">
        <span className="nav-tab active">Import Calculator</span>
        <a href={API_BASE + 'shipping-calculator'} className="nav-tab">Domestic Shipping</a>
      </nav>
      <section className="hero">
        <div className="hero-label">Know Before You Buy</div>
        <h1>What does that car <em>actually</em> cost you?</h1>
        <p className="hero-sub">We calculate the real number. Duties, freight, compliance and fees using live exchange rates and current tariff rules.</p>
      </section>
      <div className="hrule"></div>
      <div className="wrap">
        <div id="formPanel">
          <div className="form-section">
            <div className="form-label">The Route</div>
            <div className="g2">
              <div className="fi"><label>Buying From</label>
                <select id="origin" defaultValue="">
                  <option value="">Select country</option>
                  <option value="JP">Japan</option>
                  <option value="UK">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="IT">Italy</option>
                  <option value="FR">France</option>
                  <option value="BE">Belgium</option>
                  <option value="US">United States</option>
                  <option value="AU">Australia</option>
                  <option value="CA">Canada</option>
                  <option value="NL">Netherlands</option>
                  <option value="PT">Portugal</option>
                  <option value="SE">Sweden</option>
                  <option value="IE">Ireland</option>
                  <option value="CH">Switzerland</option>
                  <option value="ZA">South Africa</option>
                  <option value="AE">UAE / Dubai</option>
                </select>
              </div>
              <div className="fi"><label>Importing To</label>
                <select id="dest" defaultValue="">
                  <option value="">Select country</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="IT">Italy</option>
                  <option value="BE">Belgium</option>
                  <option value="AU">Australia</option>
                  <option value="CA">Canada</option>
                  <option value="NL">Netherlands</option>
                  <option value="PT">Portugal</option>
                  <option value="IE">Ireland</option>
                  <option value="JP">Japan</option>
                  <option value="SE">Sweden</option>
                  <option value="CH">Switzerland</option>
                  <option value="ZA">South Africa</option>
                  <option value="AE">UAE / Dubai</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-section">
            <div className="form-label">The Car</div>
            <div className="g3">
              <div className="fi"><label>Year</label>
                <select id="year" defaultValue="">
                  <option value="">Select year</option>
                  {YEARS.map((y) => (<option key={y} value={y}>{y}</option>))}
                </select>
              </div>
              <div className="fi"><label>Make</label><select id="make" defaultValue=""><option value="">Make</option></select></div>
              <div className="fi" id="modelField"><label>Model</label><select id="model" defaultValue=""><option value="">Make first</option></select></div>
            </div>
            <div className="fi mt">
              <label>Purchase Price</label>
              <div className="prw" style={{ display: 'flex', gap: 0 }}>
                <select id="currOverride" defaultValue="USD" style={{ background: '#FFFFFF', border: '2px solid #111111', borderRight: 'none', borderRadius: 0, color: '#111111', fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, fontWeight: 500, padding: '11px 8px', outline: 'none', WebkitAppearance: 'none', appearance: 'none', width: 88, flexShrink: 0, minHeight: 44 }}>
                  <option value="GBP">£ GBP</option>
                  <option value="EUR">€ EUR</option>
                  <option value="USD">$ USD</option>
                  <option value="JPY">¥ JPY</option>
                  <option value="AUD">A$ AUD</option>
                  <option value="CAD">C$ CAD</option>
                  <option value="SEK">kr SEK</option>
                  <option value="CHF">Fr CHF</option>
                  <option value="ZAR">R ZAR</option>
                  <option value="AED">Dhs AED</option>
                </select>
                <input type="number" id="price" placeholder="35000" min="0" style={{ background: '#FFFFFF', border: '2px solid #111111', borderRadius: 0, color: '#111111', fontFamily: "'IBM Plex Mono',monospace", fontSize: 16, fontWeight: 500, padding: '11px 12px', outline: 'none', width: '100%', minHeight: 44, WebkitAppearance: 'none', appearance: 'none' }} />
              </div>
              <span className="fi-hint">Currency auto-set from origin — override if listing is in a different currency</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 }}>
            <input type="checkbox" id="isModified" style={{ width: 18, height: 18, flexShrink: 0, accentColor: '#E63312', cursor: 'pointer', position: 'relative', zIndex: 10 }} />
            <label htmlFor="isModified" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#55595E', cursor: 'pointer' }}>This vehicle has been significantly modified</label>
          </div>
          <div id="errMsg" className="errtxt" style={{ display: 'none' }}></div>
          <button className="calc-btn" id="calcBtn">Calculate Total Landed Cost</button>
        </div>
        <div id="loadingPanel" style={{ display: 'none' }}>
          <div className="ldw">
            <div className="ldlbl">Calculating your landed cost&#8230;</div>
            <div className="ldbar"></div>
          </div>
        </div>
        <div id="resultsPanel" style={{ display: 'none' }}>
          <div className="res-route">Cost Breakdown</div>
          <div className="res-title" id="resHead"></div>
          <div id="adjustHint" style={{ display: 'none', fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#111111', padding: '12px 0 4px' }}><strong>Tap any cost to remove it from your total</strong></div>
          <div id="costTable"></div>
          <div id="deltaLine" className="delta-line" style={{ display: 'none' }}>
            <span className="delta-lbl">Total import cost</span>
            <span className="delta-val" id="deltaVal"></span>
          </div>
          <div id="contextLine" className="context-line" style={{ display: 'none' }}></div>
          <div id="shareBlock" style={{ display: 'none', padding: '16px 0 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <span className="share-confirm" id="shareConfirmInline"></span>
              <button className="share-btn" id="shareBtnEl">Share Breakdown</button>
            </div>
            <div className="share-sheet" id="shareSheet">
              <div className="share-sheet-row">
                <input className="share-link-input" id="shareLinkInput" type="text" readOnly placeholder="Generating link..." />
                <button className="share-copy-btn" id="copyBtnEl">Copy</button>
              </div>
            </div>
          </div>
          <button className="breakdown-toggle" id="breakdownToggle" style={{ display: 'none' }}>View full cost breakdown</button>
          <div id="stateTaxPanel" className="stax-wrap" style={{ display: 'none' }}>
            <div className="stax-label">At Registration — US State Sales Tax</div>
            <select id="stateSel" className="stax-sel" defaultValue=""><option value="">Select your state to see all-in total</option></select>
            <div id="stateTaxResult"></div>
          </div>
          <div className="take-wrap">
            <div className="take-kicker">The Daily Vroom Take</div>
            <div className="sig-row" id="sigTag"></div>
            <div className="verdict" id="verdictText"></div>
          </div>
          <div className="intent-wrap" id="intentWrap" style={{ display: 'none' }}>
            <div className="intent-q">Seriously considering this import?</div>
            <div className="intent-btns" id="intentBtns">
              <button className="intent-btn" id="intentYesBtn">Yes</button>
              <button className="intent-btn intent-btn-soft" id="intentExploringBtn">Just exploring</button>
            </div>
            <div className="intent-confirm" id="intentConfirm" style={{ display: 'none' }}>Got it, helpful to know.</div>
          </div>
          <div className="sub-wrap">
            <div className="sub-inner">
              <div className="sub-left">
                <div className="take-kicker" style={{ marginBottom: 8 }}>The Daily Vroom Newsletter</div>
                <p className="sub-text">The daily read for car people. Market trends, auction results, import intelligence and the deals worth knowing about.</p>
              </div>
              <div className="sub-right">
                <input type="email" id="subEmail" className="sub-input" placeholder="your@email.com" />
                <button className="sub-btn" id="subBtnEl">Subscribe Free</button>
                <div className="sub-confirm" id="subConfirm"></div>
              </div>
            </div>
          </div>
          <button className="btnr" id="resetBtnEl">New Calculation</button>
        </div>
      </div>
      <footer className="pgft">
        <p>&copy; TDV — thedailyvroom.com</p>
        <p><a href="mailto:news@thedailyvroom.com" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Questions? news@thedailyvroom.com</a></p>
      </footer>
      <div style={{ textAlign: 'center', padding: 16, fontSize: 11, fontFamily: "'IBM Plex Mono',monospace", color: '#55595E' }}>Built by <a href="https://feridanis.com" target="_blank" rel="noreferrer" style={{ color: '#111111' }}>Feridanis</a></div>
    </div>
  );
}
