import { useState } from 'react';
import {
  AlertTriangle, BarChart3, Brain, Check, ChevronRight, CircleDollarSign,
  CreditCard, Flag, GraduationCap, LockKeyhole, PiggyBank, Play, Shield,
  Sparkles, Target, TrendingDown, TrendingUp, Trophy, WalletCards
} from 'lucide-react';

const financeTabs = [
  ['overview', WalletCards, 'Overview'], ['shield', Shield, 'Shield'],
  ['grow', TrendingUp, 'Grow'], ['practice', Trophy, 'Practice'],
  ['guide', Brain, 'Guide'], ['goals', Target, 'Goals']
];

const transactions = [
  { seller: 'Netflix', amount: 15.99, category: 'Entertainment', status: 'approved' },
  { seller: 'SuperDealz-Shop.xyz', amount: 89.99, category: 'Shopping', status: 'blocked', reason: 'Unverified seller and high-risk domain pattern.' },
  { seller: 'LuckyWin Casino', amount: 200, category: 'Gambling', status: 'blocked', reason: 'Your category rule blocked this payment.' },
  { seller: 'Amazon', amount: 34.50, category: 'Shopping', status: 'approved' }
];

const trades = [
  { symbol: 'AAPL', side: 'BUY', state: 'Closed', pnl: 0.54, reason: 'Momentum remained positive while the position stayed inside the loss boundary.' },
  { symbol: 'MSFT', side: 'BUY', state: 'Closed', pnl: 0.37, reason: 'Entry near support reduced downside within the simulated portfolio.' },
  { symbol: 'TSLA', side: 'BUY', state: 'Open', pnl: null, reason: 'Demo position includes a predefined exit threshold.' },
  { symbol: 'NVDA', side: 'BUY', state: 'Rejected', pnl: null, reason: 'Rejected because the position could breach the maximum-loss rule.' }
];

const goals = [
  { name: 'Rent Buffer', current: 1152, target: 1200, color: '#4c95ff', protected: true },
  { name: 'Emergency Fund', current: 3200, target: 5000, color: '#20e87a', protected: true },
  { name: 'Summer Trip', current: 875, target: 1500, color: '#ff9d4d', protected: false },
  { name: 'New Laptop', current: 680, target: 1200, color: '#a777ff', protected: false }
];

function MoneyCard({ name, lastFour, balance, color, selected, onClick }) {
  return <button className={`money-card ${selected?'selected':''}`} onClick={onClick} style={{'--card-color':color}}><div><CreditCard/><span>VISA</span></div><b>{name}</b><small>•••• {lastFour}</small><strong>€{balance.toLocaleString()}</strong></button>;
}

function FinanceOverview({ setTab }) {
  return <div className="finance-page"><div className="finance-hero"><span><Sparkles/>NATACONNECT FINANCE ADVISOR</span><h1>Money decisions,<br/><em>with guardrails.</em></h1><p>Plan goals, test decisions, and protect spending with a private simulation built around clear limits.</p><button onClick={()=>setTab('guide')}>Ask the finance guide<ChevronRight/></button></div><div className="finance-stat-grid"><div><WalletCards/><span>Total demo balance</span><b>€14,800.80</b><small>Across 3 simulated cards</small></div><div><Shield/><span>Payments protected</span><b>4 rules</b><small>2 risky payments blocked</small></div><div><TrendingUp/><span>Practice portfolio</span><b className="positive">+23.5%</b><small>Simulated, not live trading</small></div><div><Target/><span>Goal progress</span><b>€5,907</b><small>Across 4 savings goals</small></div></div><p className="eyebrow finance-label">FINANCIAL TOOLKIT</p><div className="finance-actions"><button onClick={()=>setTab('shield')}><Shield/><div><b>Payment Shield</b><span>Rules and blocked transactions</span></div><ChevronRight/></button><button onClick={()=>setTab('grow')}><TrendingUp/><div><b>Bounded Growth</b><span>Explore risk-limited scenarios</span></div><ChevronRight/></button><button onClick={()=>setTab('practice')}><GraduationCap/><div><b>Practice Lab</b><span>Learn without real money</span></div><ChevronRight/></button><button onClick={()=>setTab('goals')}><PiggyBank/><div><b>Goal Planner</b><span>Track protected savings</span></div><ChevronRight/></button></div><div className="finance-disclaimer"><AlertTriangle/><p><b>Educational prototype</b><span>All balances, returns, trades, and recommendations are simulated. This is not financial advice.</span></p></div></div>;
}

function FinanceShield() {
  const cards=[['Main Debit','4821',4250.80,'#4c95ff'],['Travel Credit','7392',1800,'#ff9d4d'],['Savings','1056',8750,'#20e87a']];
  const [selected,setSelected]=useState(0); const [rules,setRules]=useState([['Ask before payments over €50',true],['Block unverified sellers',true],['No online shopping after 11 PM',true],['Block gambling transactions',true]]);
  return <div className="finance-page"><FinanceTitle icon={Shield} title="Payment Shield" subtitle="Protection rules before money leaves"/><div className="money-cards">{cards.map((c,i)=><MoneyCard key={c[0]} name={c[0]} lastFour={c[1]} balance={c[2]} color={c[3]} selected={selected===i} onClick={()=>setSelected(i)}/>)}</div><div className="finance-panel"><div className="finance-section-head"><div><h3>Active guardrails</h3><span>Stored locally for this demo</span></div><b>{rules.filter(r=>r[1]).length} on</b></div>{rules.map((r,i)=><button className="finance-rule" key={r[0]} onClick={()=>setRules(rules.map((x,n)=>n===i?[x[0],!x[1]]:x))}><LockKeyhole/><span>{r[0]}</span><i className={r[1]?'on':''}/></button>)}</div><div className="finance-panel"><div className="finance-section-head"><div><h3>Recent transactions</h3><span>Explainable simulated decisions</span></div></div>{transactions.map(t=><div className={`finance-tx ${t.status}`} key={t.seller}>{t.status==='approved'?<Check/>:<AlertTriangle/>}<p><b>{t.seller}</b><span>{t.category}{t.reason&&` · ${t.reason}`}</span></p><strong>€{t.amount.toFixed(2)}</strong></div>)}</div></div>;
}

function FinanceGrow() {
  const [running,setRunning]=useState(true);
  return <div className="finance-page"><FinanceTitle icon={TrendingUp} title="Bounded Growth" subtitle="Explore growth without hiding the downside"/><div className="portfolio-banner"><div><span>SIMULATED PORTFOLIO</span><b>€123.47</b><small>Started with €100.00</small></div><div className="portfolio-return">+23.5%</div></div><div className="risk-boundary"><Shield/><div><b>Maximum loss boundary: €20</b><span>No simulated decision may take the portfolio below €80.</span></div><button onClick={()=>setRunning(!running)}>{running?'Pause':'Resume'}</button></div><div className="finance-panel chart-panel"><div className="finance-section-head"><div><h3>Portfolio path</h3><span>Illustrative historical simulation</span></div><b className="positive">Active demo</b></div><svg viewBox="0 0 440 150" className="portfolio-chart"><defs><linearGradient id="financeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#20e87a" stopOpacity=".32"/><stop offset="1" stopColor="#20e87a" stopOpacity="0"/></linearGradient></defs><path d="M10 130 L45 128 L80 120 L115 124 L150 111 L185 106 L220 93 L255 84 L290 73 L325 54 L360 43 L395 25 L430 18 L430 140 L10 140Z" fill="url(#financeFill)"/><path d="M10 130 L45 128 L80 120 L115 124 L150 111 L185 106 L220 93 L255 84 L290 73 L325 54 L360 43 L395 25 L430 18" fill="none" stroke="#20e87a" strokeWidth="3"/><line x1="10" y1="139" x2="430" y2="139" stroke="#ff4e6d" strokeDasharray="7 5"/><text x="430" y="133" fill="#ff7189" fontSize="9" textAnchor="end">loss floor</text></svg></div><div className="finance-panel"><div className="finance-section-head"><div><h3>Decision log</h3><span>Every action includes a reason</span></div></div>{trades.map(t=><div className="trade-row" key={t.symbol}><span className={t.state==='Rejected'?'rejected':'buy'}>{t.state==='Rejected'?<TrendingDown/>:<TrendingUp/>}</span><p><b>{t.symbol} · {t.side}</b><small>{t.reason}</small></p><div><b className={t.pnl>0?'positive':''}>{t.pnl?`+€${t.pnl.toFixed(2)}`:t.state}</b></div></div>)}</div><div className="finance-disclaimer"><AlertTriangle/><p><b>No brokerage connection</b><span>This page demonstrates risk communication and decision guardrails; it does not place trades.</span></p></div></div>;
}

function FinancePractice() {
  const [choice,setChoice]=useState(null); const correct='wait';
  return <div className="finance-page"><FinanceTitle icon={Trophy} title="Practice Lab" subtitle="Build judgment without risking real money"/><div className="practice-score"><div><Trophy/><span>Skill score</span><b>72</b></div><div><BarChart3/><span>Practice balance</span><b>€10,450</b></div><div><Target/><span>Win rate</span><b>65%</b></div></div><div className="finance-panel scenario"><span className="scenario-tag">DECISION CHALLENGE</span><h2>A stock jumps 12% after an unverified social-media rumor.</h2><p>What is the safest next step for a beginner with a strict 2% risk boundary?</p><div>{[['buy','Buy immediately'],['wait','Wait for verified information'],['all','Invest the full practice balance']].map(([id,label])=><button key={id} className={choice===id?(id===correct?'correct':'wrong'):''} onClick={()=>setChoice(id)}>{choice===id&&(id===correct?<Check/>:<AlertTriangle/>)}{label}</button>)}</div>{choice&&<div className={`practice-feedback ${choice===correct?'good':'bad'}`}><Brain/><p><b>{choice===correct?'Good risk judgment':'High-risk decision'}</b><span>{choice===correct?'Waiting avoids chasing unverified hype and preserves your risk budget.':'This response ignores concentration, verification, or timing risk. The safer answer is to wait for reliable information.'}</span></p></div>}</div></div>;
}

function FinanceGuide() {
  const prompts=['Can I afford a €600 laptop?','How should I split €300 monthly savings?','Explain investment risk simply']; const [question,setQuestion]=useState(''); const [answer,setAnswer]=useState(null);
  const ask=()=>{if(!question)return;const q=question.toLowerCase();setAnswer(q.includes('laptop')?'Based on the demo budget, saving €150 for four months avoids touching the protected rent buffer. Compare the purchase against your emergency-fund target before committing.':q.includes('split')?'A simple educational split is: protect essentials first, build emergency savings second, and only then allocate money to longer-term growth. Your goals suggest €180 emergency fund, €75 near-term goal, and €45 flexible buffer.':'Risk is the chance that an outcome differs from what you expect. Good planning defines how much loss you can tolerate before considering potential return.');};
  return <div className="finance-page"><FinanceTitle icon={Brain} title="Finance Guide" subtitle="Clear education, not hidden certainty"/><div className="guide-intro"><Brain/><div><b>Ask about budgeting, goals, or risk</b><span>Answers use only the simulated profile shown in this app.</span></div></div><div className="finance-panel guide-box"><label>YOUR QUESTION</label><textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="What financial decision are you considering?"/><div className="prompt-chips">{prompts.map(p=><button key={p} onClick={()=>{setQuestion(p);setAnswer(null)}}>{p}</button>)}</div><button className="finance-primary" onClick={ask} disabled={!question}><Sparkles/>Explain my options</button></div>{answer&&<div className="guide-answer"><span><Brain/></span><div><small>EDUCATIONAL GUIDANCE</small><p>{answer}</p><em>Check important decisions with a qualified professional who understands your circumstances.</em></div></div>}</div>;
}

function FinanceGoals() { return <div className="finance-page"><FinanceTitle icon={Target} title="Goal Planner" subtitle="Turn priorities into protected progress"/><div className="goal-summary"><div><b>€5,907</b><span>Saved across goals</span></div><div><b>€8,900</b><span>Total target</span></div><div><b>2</b><span>Shield protected</span></div></div><div className="goal-grid">{goals.map(g=>{const pct=Math.round(g.current/g.target*100);return <div className="goal-card" key={g.name}><div><span style={{background:g.color+'22',color:g.color}}><PiggyBank/></span>{g.protected&&<em><Shield/>Protected</em>}</div><h3>{g.name}</h3><p><b>€{g.current.toLocaleString()}</b><span>of €{g.target.toLocaleString()}</span></p><i><u style={{width:pct+'%',background:g.color}}/></i><small>{pct}% complete</small></div>})}</div></div> }

function FinanceTitle({icon:Icon,title,subtitle}) { return <div className="finance-title"><span><Icon/></span><div><small>FINANCE ADVISOR</small><h1>{title}</h1><p>{subtitle}</p></div></div> }

export default function FinanceHub() { const [tab,setTab]=useState('overview'); const content={overview:<FinanceOverview setTab={setTab}/>,shield:<FinanceShield/>,grow:<FinanceGrow/>,practice:<FinancePractice/>,guide:<FinanceGuide/>,goals:<FinanceGoals/>}; return <div className="finance-hub">{content[tab]}<div className="finance-tabs">{financeTabs.map(([id,Icon,label])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}><Icon/><span>{label}</span></button>)}</div></div> }
