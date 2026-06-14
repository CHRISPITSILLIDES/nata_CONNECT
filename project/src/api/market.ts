const demoQuotes: Record<string, { c: number; h: number; l: number; dp: number }> = {
  AAPL: { c: 198.4, h: 201.1, l: 196.8, dp: 0.8 },
  MSFT: { c: 449.2, h: 452.7, l: 445.3, dp: 0.4 },
  GOOGL: { c: 176.3, h: 178.1, l: 174.9, dp: -0.3 },
  TSLA: { c: 214.6, h: 219.8, l: 210.2, dp: 1.2 },
  NVDA: { c: 142.7, h: 145.2, l: 140.1, dp: 1.7 },
  AMZN: { c: 186.9, h: 188.5, l: 184.4, dp: 0.6 },
  META: { c: 521.4, h: 526.8, l: 516.7, dp: -0.2 },
  BTC: { c: 67350, h: 68920, l: 66110, dp: 1.9 },
};

function loadConfig() {
  try {
    return JSON.parse(localStorage.getItem('nataMarketConfig') || '{}');
  } catch {
    return {};
  }
}

async function getQuote(symbol: string) {
  const config = loadConfig();
  if (config.apiKey && config.endpoint) {
    const response = await fetch(`${String(config.endpoint).replace(/\/$/, '')}/quote?symbol=${encodeURIComponent(symbol)}&token=${encodeURIComponent(config.apiKey)}`);
    if (!response.ok) throw new Error('Market provider request failed');
    return { ...(await response.json()), symbol };
  }
  return { ...(demoQuotes[symbol] || { c: 100, h: 102, l: 98, dp: 0 }), symbol };
}

export const marketAPI = {
  getQuote,
  async getMultipleQuotes(symbols: string[]) {
    return Promise.all(symbols.map(getQuote));
  },
  async getCrypto(symbol: string) {
    return getQuote(symbol);
  },
};
