const RULES = [
  { id: 'urgency', category: 'Pressure tactic', weight: 14, level: 'medium', pattern: /urgent|immediately|act now|final warning|within \d+ (minutes?|hours?)/i, evidence: 'Uses urgency to reduce the time you have to think.' },
  { id: 'credential', category: 'Credential theft', weight: 24, level: 'critical', pattern: /password|passcode|pin|login|sign in|verify (?:your )?account|security code|one[- ]time code|otp/i, evidence: 'Requests or references sensitive account credentials.' },
  { id: 'payment', category: 'Payment request', weight: 20, level: 'high', pattern: /send (?:money|funds|payment)|bank transfer|wire transfer|gift card|processing fee|release fee|pay (?:now|today)/i, evidence: 'Contains a direct or disguised request for money.' },
  { id: 'crypto', category: 'Crypto transfer', weight: 18, level: 'high', pattern: /crypto|bitcoin|ethereum|usdt|wallet address|seed phrase/i, evidence: 'References hard-to-reverse cryptocurrency payments.' },
  { id: 'returns', category: 'Unrealistic returns', weight: 26, level: 'critical', pattern: /guaranteed (?:profit|returns?)|risk[- ]free|double your|\d+% (?:daily|weekly|return)|passive income/i, evidence: 'Promises returns that legitimate investments cannot guarantee.' },
  { id: 'prize', category: 'Unexpected reward', weight: 18, level: 'high', pattern: /you(?:'ve| have)? won|winner|claim (?:your )?prize|lottery|giveaway/i, evidence: 'Offers an unexpected prize to trigger impulsive action.' },
  { id: 'threat', category: 'Fear or authority', weight: 18, level: 'high', pattern: /account (?:is )?(?:suspended|locked|closed)|police|tax authority|arrest|legal action|fraud department/i, evidence: 'Uses fear or authority to pressure the recipient.' },
  { id: 'secrecy', category: 'Isolation tactic', weight: 16, level: 'high', pattern: /do not tell|keep this secret|don't contact|stay on the line|ignore anyone/i, evidence: 'Attempts to isolate you from trusted advice.' },
  { id: 'remote', category: 'Device takeover', weight: 26, level: 'critical', pattern: /anydesk|teamviewer|remote access|screen share|install this app/i, evidence: 'Requests remote access that could expose the whole device.' },
  { id: 'link', category: 'Suspicious link', weight: 8, level: 'medium', pattern: /https?:\/\/|www\.|bit\.ly|tinyurl/i, evidence: 'Includes a link that should be verified independently.' },
  { id: 'tld', category: 'High-risk domain', weight: 18, level: 'high', pattern: /\.(?:xyz|top|click|live|buzz|shop|vip|rest)(?:\b|\/)/i, evidence: 'Uses a domain ending frequently seen in disposable scam campaigns.' },
  { id: 'brand-domain', category: 'Brand impersonation', weight: 18, level: 'high', pattern: /(?:paypal|microsoft|apple|amazon|natwest|barclays|coinbase|binance)[-_](?:secure|verify|support|login)/i, evidence: 'Combines a known brand with trust-building words in the address.' },
];

const SAFE_DOMAINS = new Set(['github.com', 'google.com', 'microsoft.com', 'apple.com', 'amazon.com', 'coinbase.com', 'gov.uk']);

function extractHost(text) {
  const candidate = text.match(/(?:https?:\/\/)?(?:www\.)?([a-z0-9-]+(?:\.[a-z0-9-]+)+)/i)?.[1];
  return candidate?.toLowerCase() || '';
}

function domainSignals(text) {
  const host = extractHost(text);
  if (!host) return [];
  const signals = [];
  if (/\d{1,3}(?:\.\d{1,3}){3}/.test(host)) signals.push({ id: 'ip-host', category: 'Raw IP address', weight: 24, level: 'critical', evidence: 'The link uses a numeric IP instead of a recognizable domain.' });
  if ((host.match(/-/g) || []).length >= 2) signals.push({ id: 'hyphens', category: 'Lookalike domain', weight: 12, level: 'medium', evidence: 'The domain uses multiple hyphens, a common impersonation pattern.' });
  if (host.length > 38) signals.push({ id: 'long-domain', category: 'Obscured destination', weight: 10, level: 'medium', evidence: 'The unusually long domain may be designed to hide its true owner.' });
  if (SAFE_DOMAINS.has(host) || [...SAFE_DOMAINS].some(d => host.endsWith(`.${d}`))) signals.push({ id: 'known-domain', category: 'Recognizable domain', weight: -24, level: 'positive', evidence: 'The destination matches a recognized first-party domain.' });
  return signals;
}

export function analyzeThreat(text, channel = 'url') {
  const normalized = text.trim();
  const matches = RULES.filter(rule => rule.pattern.test(normalized)).map(({ pattern, ...rule }) => rule);
  const allSignals = [...matches, ...domainSignals(normalized)];
  const raw = allSignals.reduce((sum, item) => sum + item.weight, 5) + (channel === 'url' && extractHost(normalized) ? 4 : 0);
  const score = Math.max(2, Math.min(99, raw));
  const level = score >= 70 ? 'critical' : score >= 45 ? 'high' : score >= 25 ? 'caution' : 'low';
  const actions = level === 'critical' || level === 'high'
    ? ['Do not click, reply, pay, or share a security code.', 'Verify the request using the official app or a number you already trust.', 'Block the sender and preserve a screenshot as evidence.']
    : level === 'caution'
      ? ['Verify the sender through a separate channel.', 'Open the official website yourself instead of using the supplied link.']
      : ['No strong scam pattern was found.', 'Still avoid sharing credentials or payment details unexpectedly.'];
  return {
    score, level, signals: allSignals.filter(s => s.weight > 0), positive: allSignals.filter(s => s.weight < 0), actions,
    verdict: level === 'critical' ? 'Likely scam' : level === 'high' ? 'High risk' : level === 'caution' ? 'Use caution' : 'Low risk',
    summary: allSignals.filter(s => s.weight > 0).length
      ? `${allSignals.filter(s => s.weight > 0).length} explainable risk signals were found.`
      : 'No high-confidence scam pattern was found in this content.'
  };
}

export function analyzePlatform(input) {
  const host = extractHost(input) || input.toLowerCase().replace(/\s/g, '');
  const threat = analyzeThreat(input, 'url');
  const indicators = [...threat.signals];
  if (/forex|broker|trade|invest|capital|wealth/.test(host)) indicators.push({ id: 'finance-name', category: 'Financial positioning', weight: 8, level: 'medium', evidence: 'The name presents itself as a financial or investment service.' });
  if (!host.includes('.')) indicators.push({ id: 'no-domain', category: 'Unverifiable destination', weight: 18, level: 'high', evidence: 'No complete domain was supplied for independent verification.' });
  const domainRisk = Math.min(98, Math.max(4, indicators.reduce((n, x) => n + Math.max(0, x.weight), 4)));
  const trust = Math.max(2, 100 - domainRisk);
  return { host, trust, domainRisk, regulation: trust > 75 ? 78 : trust > 50 ? 42 : 8, indicators, safe: trust >= 70 };
}

export const DEMOS = {
  bank: 'URGENT: Your NatWest account is suspended. Verify your password now at https://natwest-secure-verify.xyz/login or it will be closed.',
  investment: 'Guaranteed 100% weekly returns. Send USDT today to double your investment. Keep this opportunity secret.',
  safe: 'https://github.com/openai'
};
