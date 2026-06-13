import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle, ArrowLeft, BarChart3, Check, ChevronRight, CircleDollarSign,
  Eye, FileImage, Flag, Globe2, Home, Link2, LockKeyhole, Mail, Menu,
  MessageSquare, Phone, Plus, QrCode, Radar, ScanLine, Shield, ShieldCheck,
  Siren, Sparkles, TrendingUp, Upload, UserRound, Users, WalletCards, X
} from 'lucide-react';

const NAV = [
  ['home', Home, 'Home'], ['scan', ScanLine, 'Scan'], ['trust', ShieldCheck, 'Trust'],
  ['protect', LockKeyhole, 'Protect'], ['community', Users, 'Community'], ['emergency', Siren, 'Emergency']
];

const demoThreats = [
  { type: 'Phishing SMS', source: 'NatWest account suspended', time: '2m ago' },
  { type: 'Fake Store', source: 'bestdeals4u-discount.shop', time: '8m ago' },
  { type: 'Crypto scam', source: 'Guaranteed returns campaign', time: '14m ago' }
];

function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial; } catch { return initial; }
  });
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);
  return [value, setValue];
}

function Brand() {
  return <div className="brand"><span className="brand-mark"><Shield size={20} /></span><b>Sentinel<span>AI</span></b></div>;
}

function PageTitle({ icon: Icon, title, subtitle, tone = 'blue' }) {
  return <div className="page-title"><span className={`title-icon ${tone}`}><Icon size={22}/></span><div><h1>{title}</h1><p>{subtitle}</p></div></div>;
}

function Gauge({ value, label, color, suffix='/100' }) {
  return <div className="gauge-wrap"><div className="gauge" style={{'--value': value, '--color': color}}><div><b>{value}</b><small>{suffix}</small></div></div><span>{label}</span></div>;
}

function Shell({ page, setPage, children }) {
  return <div className="app-shell"><main><header><Brand/><span className="protected"><Check size={12}/> Protected</span></header>{children}</main><nav>{NAV.map(([id, Icon, label]) => <button key={id} className={page===id?'active':''} onClick={() => setPage(id)}><Icon size={20}/><span>{label}</span></button>)}</nav></div>;
}

function Dashboard({ setPage, scanCount }) {
  return <section className="screen fade-in"><p className="eyebrow">YOUR SECURITY DASHBOARD</p><div className="panel gauges"><Gauge value={82} label="Security Score" color="#20e87a"/><Gauge value={34} label="Financial Risk" color="#ff335f"/><Gauge value={58} label="ID Exposure" color="#ffd51e"/></div><div className="mini-stats"><div><ShieldCheck/><b>13</b><span>Threats Blocked</span></div><div><Radar/><b>{48 + scanCount}</b><span>Total Scans</span></div><div><Eye/><b>3</b><span>Active Alerts</span></div></div><p className="eyebrow section-label">QUICK ACTIONS</p><div className="quick-grid"><button className="quick blue" onClick={()=>setPage('scan')}><ScanLine/><div><b>Scan URL</b><span>Check a link</span></div><ChevronRight/></button><button className="quick green" onClick={()=>setPage('trust')}><TrendingUp/><div><b>Trust Score</b><span>Verify broker</span></div><ChevronRight/></button><button className="quick purple" onClick={()=>setPage('protect')}><LockKeyhole/><div><b>Protect</b><span>Identity check</span></div><ChevronRight/></button><button className="quick red" onClick={()=>setPage('emergency')}><AlertTriangle/><div><b>Emergency</b><span>I was scammed</span></div><ChevronRight/></button></div><div className="section-heading"><p className="eyebrow">LIVE THREAT FEED</p><button>View all <ChevronRight size={13}/></button></div><div className="feed">{demoThreats.slice(0,2).map(t=><div key={t.source}><i/><p><b>{t.type}</b><span>{t.source}</span></p><time>{t.time}</time></div>)}</div></section>;
}

const scanTypes = [
  ['url', Link2, 'URL'], ['sms', MessageSquare, 'SMS'], ['email', Mail, 'Email'],
  ['qr', QrCode, 'QR Code'], ['image', FileImage, 'Screenshot'], ['chat', MessageSquare, 'Chat / WhatsApp']
];

function analyzeText(text) {
  const value = text.toLowerCase();
  const triggers = ['urgent','verify','suspended','crypto','guaranteed','password','click','wallet','winner','investment','bank','returns','.xyz','.top'];
  const hits = triggers.filter(x=>value.includes(x));
  const score = Math.min(96, 18 + hits.length * 14 + (value.includes('http') ? 12 : 0));
  return { score, hits: hits.length, risky: score >= 45 };
}

function Scanner({ onScan }) {
  const [type,setType]=useState('url'); const [input,setInput]=useState(''); const [result,setResult]=useState(null); const [loading,setLoading]=useState(false);
  const scan=()=>{ if(!input.trim()) return; setLoading(true); setResult(null); setTimeout(()=>{setResult(analyzeText(input));setLoading(false);onScan();},850); };
  const examples={url:'https://secure-wallet-verify.xyz/login',sms:'URGENT: Your bank account is suspended. Click to verify now.',email:'Guaranteed crypto returns. Send funds to unlock your investment.',chat:'You won! Share your password to claim the prize.'};
  return <section className="screen fade-in"><PageTitle icon={ScanLine} title="AI Threat Scanner" subtitle="Scan URLs, SMS, Emails, QR Codes & more"/><div className="type-grid">{scanTypes.map(([id,Icon,label])=><button key={id} className={type===id?'selected':''} onClick={()=>{setType(id);setResult(null)}}><Icon/><span>{label}</span></button>)}</div><div className="panel form-panel">{type==='image'||type==='qr'?<button className="upload" onClick={()=>{setInput('Suspicious uploaded content: urgent payment request');}}><Upload/><b>Choose a {type==='qr'?'QR code':'screenshot'}</b><span>PNG, JPG or WEBP</span></button>:<><label>{type==='url'?'URL Content':type==='sms'?'Message Content':type==='email'?'Email Content':'Chat Content'}</label><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={`Paste suspicious ${type} content here...`}/></>}<div className="demos"><span>Quick demo:</span><button onClick={()=>setInput(examples[type]||examples.sms)}>Bank alert</button><button onClick={()=>setInput('This investment guarantees 100% weekly returns at crypto-double-returns.top')}>Investment</button><button onClick={()=>setInput('https://github.com/openai')}>Safe URL</button></div><button className="primary" onClick={scan} disabled={!input||loading}>{loading?<><span className="spinner"/>Analyzing threat...</>:<><Sparkles/>Scan Now</>}</button></div>{result&&<div className={`result ${result.risky?'danger':'safe'}`}><div className="result-icon">{result.risky?<AlertTriangle/>:<ShieldCheck/>}</div><div><p>{result.risky?'High-risk content detected':'No major threats detected'}</p><b>{result.score}% risk score</b><span>{result.risky?`${result.hits} suspicious patterns matched. Do not click links or send money.`:'The content appears low risk. Stay cautious with personal information.'}</span></div></div>}<div className="panel detect"><p className="eyebrow">WHAT WE DETECT</p>{['Phishing & Credential Theft','Investment & Crypto Scams','Fake Stores & Delivery Scams','Psychological Manipulation Tactics','Brand Spoofing & Domain Fraud'].map((x,i)=><div key={x}><i style={{background:['#ff3566','#ff9b42','#ffd22e','#9e62ff','#4b93ff'][i]}}/>{x}</div>)}</div></section>;
}

function Trust() {
  const [url,setUrl]=useState(''); const [loading,setLoading]=useState(false); const [result,setResult]=useState(null);
  const check=()=>{if(!url)return;setLoading(true);setTimeout(()=>{const bad=/crypto|double|returns|forex|invest|\.top|\.xyz/i.test(url);setResult(bad);setLoading(false)},900)};
  return <section className="screen fade-in"><PageTitle icon={ShieldCheck} title="Trust Score" subtitle="Verify any broker, platform or crypto project" tone="green"/><div className="panel form-panel"><label>BROKER URL OR PLATFORM NAME</label><input value={url} onChange={e=>setUrl(e.target.value)} placeholder="company.com or platform name"/><div className="demos"><span>Try a demo:</span><button onClick={()=>setUrl('crypto-double-returns.top/invest')}>Fake Forex</button><button onClick={()=>setUrl('coinbase.com')}>Regulated Broker</button></div><button className="primary" onClick={check} disabled={!url||loading}>{loading?<><span className="spinner"/>Analyzing platform...</>:<><ShieldCheck/>Analyze Trust</>}</button></div>{result!==null&&<><div className="panel trust-gauges"><p className="eyebrow">TRUST ANALYSIS</p><div><Gauge value={result?5:91} label="Trust Score" color={result?'#ff335f':'#20e87a'}/><Gauge value={result?5:88} label="Regulation" color={result?'#ff335f':'#20e87a'}/><Gauge value={result?95:9} label="Domain Risk" color={result?'#20e87a':'#ff335f'}/></div></div><div className={`panel indicators ${result?'':'positive'}`}><p className="eyebrow">{result?'SCAM INDICATORS DETECTED':'TRUST SIGNALS FOUND'}</p>{(result?['Unregulated high-risk domain TLD','Excessive use of investment return language','No regulatory information found','Suspicious domain structure','Promises to multiply investment']:['Established domain structure','No high-pressure language detected','Secure connection pattern','Low-risk public reputation']).map(x=><div key={x}>{result?<AlertTriangle/>:<Check/>}{x}</div>)}</div></>}</section>;
}

const initialRules=[['Warn for payments above €500','transaction'],['Warn for crypto websites','url'],['Warn for new domains (< 30 days)','domain'],['Warn for foreign transactions','transaction'],['Warn for gambling sites','url']];
function Protect() {
  const [tab,setTab]=useState('personal'); const [rules,setRules]=useStoredState('sentinel-rules',initialRules.map((x,i)=>({...x,id:i,on:i!==3}))); const [identity,setIdentity]=useState(''); const [checked,setChecked]=useState(false);
  const toggle=id=>setRules(rules.map(r=>r.id===id?{...r,on:!r.on}:r));
  return <section className="screen fade-in"><PageTitle icon={LockKeyhole} title="Protect" subtitle="Identity Shield · Rules Engine · Transaction Simulator" tone="purple"/><div className="tabs">{['identity','personal','transaction'].map(x=><button key={x} onClick={()=>setTab(x)} className={tab===x?'active':''}>{x==='identity'?<UserRound/>:x==='personal'?<Shield/>:<WalletCards/>}{x[0].toUpperCase()+x.slice(1)}</button>)}</div>{tab==='personal'&&<div className="panel rules"><div className="section-heading"><div><h3>Your Security Rules</h3><span>AI applies these automatically on every scan</span></div><button className="icon-btn"><Plus/></button></div>{rules.map(r=><div className="rule" key={r.id}><button className={`switch ${r.on?'on':''}`} onClick={()=>toggle(r.id)}><i/></button><b>{r[0]}</b><span>{r[1]}</span></div>)}</div>}{tab==='identity'&&<div className="panel form-panel"><h3>Check Your Digital Exposure</h3><p className="muted">Search locally for common breach-risk patterns.</p><input value={identity} onChange={e=>setIdentity(e.target.value)} placeholder="your@email.com"/><button className="primary" onClick={()=>setChecked(true)} disabled={!identity}><Radar/>Check Exposure</button>{checked&&<div className="inline-note"><ShieldCheck/>No live breach lookup is performed. Enable an API later for real breach data.</div>}</div>}{tab==='transaction'&&<TransactionSim/>}</section>;
}

function TransactionSim(){const [amount,setAmount]=useState('');const [foreign,setForeign]=useState(false);const risk=(+amount>500?35:5)+(foreign?35:0);return <div className="panel form-panel"><h3>Transaction Simulator</h3><label>PAYMENT AMOUNT (€)</label><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00"/><button className={`check-row ${foreign?'checked':''}`} onClick={()=>setForeign(!foreign)}><i>{foreign&&<Check/>}</i>Foreign transaction</button>{amount&&<div className={`inline-note ${risk>40?'warn':''}`}>{risk>40?<AlertTriangle/>:<ShieldCheck/>}{risk>40?'This transaction matches active warning rules.':'No active rule was triggered.'}</div>}</div>}

function Community(){const [tab,setTab]=useState('overview');const [reports,setReports]=useStoredState('sentinel-reports',[]);const [form,setForm]=useState({type:'Phishing',source:'',desc:''});const submit=()=>{if(!form.source)return;setReports([{...form,id:Date.now()},...reports]);setForm({...form,source:'',desc:''});setTab('reports')};return <section className="screen fade-in"><PageTitle icon={Users} title="Community Intel" subtitle="Crowdsourced threat intelligence · Live scam database" tone="purple"/><div className="tabs three"><button className={tab==='overview'?'active':''} onClick={()=>setTab('overview')}><Globe2/>Overview</button><button className={tab==='reports'?'active':''} onClick={()=>setTab('reports')}><Flag/>Reports</button><button className={tab==='submit'?'active':''} onClick={()=>setTab('submit')}><Plus/>Submit</button></div>{tab==='overview'&&<><div className="community-stats"><div><Flag/><p><b>12,847</b><span>Threats Reported</span></p><small>+124 today</small></div><div><Users/><p><b>8,291</b><span>Active Members</span></p><small>+43 today</small></div><div><TrendingUp/><p><b>€4.2M</b><span>Scams Prevented</span></p><small>Saved this month</small></div></div><div className="panel hotspots"><p className="eyebrow">GLOBAL SCAM HOTSPOTS</p>{[['United Kingdom',3241,100],['United States',2876,82],['India',1943,59],['Nigeria',1621,48],['Germany',987,30]].map(x=><div key={x[0]}><span>{x[0]}</span><i><em style={{width:x[2]+'%'}}/></i><small>{x[1].toLocaleString()}</small></div>)}</div></>}{tab==='reports'&&<div className="feed reports">{[...reports,...demoThreats].map((r,i)=><div key={r.id||i}><i/><p><b>{r.type}</b><span>{r.source}</span></p><time>{r.id?'just now':r.time}</time></div>)}</div>}{tab==='submit'&&<div className="panel form-panel"><h3>Report a Scam</h3><p className="muted">Help protect others by submitting threat intelligence.</p><label>SCAM TYPE</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Phishing</option><option>Investment scam</option><option>Fake store</option><option>Impersonation</option></select><label>URL / SENDER / MESSAGE</label><input value={form.source} onChange={e=>setForm({...form,source:e.target.value})} placeholder="https://scam-site.xyz or +44..."/><label>DESCRIPTION</label><textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} placeholder="Describe what happened..."/><button className="primary" onClick={submit} disabled={!form.source}><Flag/>Submit Report</button></div>}</section>}

function Emergency(){const [flow,setFlow]=useState(false);const [step,setStep]=useState(1);const [loss,setLoss]=useState('');if(flow)return <section className="screen fade-in"><button className="back" onClick={()=>setFlow(false)}><ArrowLeft/>Back</button><PageTitle icon={Siren} title="Recovery Plan" subtitle={`Step ${step} of 3 · Act quickly and keep evidence`} tone="red"/><div className="panel recovery"><div className="stepper">{[1,2,3].map(n=><i key={n} className={step>=n?'active':''}>{step>n?<Check/>:n}</i>)}</div>{step===1&&<><h2>Stop the money movement</h2><p>Contact your bank or card provider immediately. Ask them to freeze the payment and secure your account.</p><label>ESTIMATED AMOUNT LOST (€)</label><input value={loss} onChange={e=>setLoss(e.target.value)} placeholder="0"/></>}{step===2&&<><h2>Secure your accounts</h2>{['Change banking and email passwords','Enable two-factor authentication','Sign out unknown devices'].map(x=><div className="task" key={x}><Check/>{x}</div>)}</>}{step===3&&<><h2>Save evidence and report</h2><p>Keep screenshots, transaction IDs, phone numbers and messages. Report the incident to your national fraud service and police.</p><div className="inline-note warn"><Flag/>Your recovery checklist is ready.</div></>}<button className="primary emergency-btn" onClick={()=>setStep(Math.min(3,step+1))}>{step===3?'Plan Complete':'Continue'}<ChevronRight/></button></div></section>;return <section className="screen fade-in"><PageTitle icon={Siren} title="Emergency Mode" subtitle="Immediate fraud response. We'll guide you step by step." tone="red"/><button className="panic" onClick={()=>setFlow(true)}><span><AlertTriangle/></span><b>I THINK I WAS SCAMMED</b><small>Tap to start emergency recovery flow</small></button><div className="panel contacts"><p className="eyebrow">EMERGENCY CONTACTS</p><a href="tel:03001232040"><Flag/>Action Fraud (UK)<b>0300 123 2040</b></a><a href="tel:08001116768"><CircleDollarSign/>FCA (Financial Scams)<b>0800 111 6768</b></a><a href="tel:101"><Siren/>Cyber Crime Reporting<b>101 (Police)</b></a></div></section>}

export default function App(){const [page,setPage]=useState('home');const [scanCount,setScanCount]=useStoredState('sentinel-scans',0);const content=useMemo(()=>({home:<Dashboard setPage={setPage} scanCount={scanCount}/>,scan:<Scanner onScan={()=>setScanCount(scanCount+1)}/>,trust:<Trust/>,protect:<Protect/>,community:<Community/>,emergency:<Emergency/>}),[page,scanCount]);return <Shell page={page} setPage={setPage}>{content[page]}</Shell>}
