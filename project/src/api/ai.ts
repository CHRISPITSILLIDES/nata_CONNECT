export interface NataAIConfig {
  provider: string;
  endpoint: string;
  apiKey: string;
  model: string;
}

export function loadNataAIConfig(): NataAIConfig {
  try {
    return JSON.parse(localStorage.getItem('nataAIConfig') || '{}');
  } catch {
    return { provider: '', endpoint: '', apiKey: '', model: '' };
  }
}

function localReply(question: string) {
  const text = question.toLowerCase();
  if (/budget|spend|expense/.test(text)) return "Start with a weekly spending cap you can actually keep. Review your three largest purchases, choose one category to reduce by 10%, and move that amount to savings today.";
  if (/save|goal|emergency/.test(text)) return "The good news is that consistency matters more than the first amount. Set an automatic transfer for payday, even if it is small. Your next action: choose one goal and schedule its first contribution.";
  if (/invest|stock|crypto|bitcoin/.test(text)) return "Treat investing as a long-term habit, not a quick win. Keep emergency cash separate and use a diversified approach before speculative assets. Your next action: decide the maximum monthly amount you can leave invested for five years.";
  if (/scam|safe|fraud|link/.test(text)) return "Do not rely on one signal. Check the exact domain, independent reviews, payment method, and whether the offer creates urgency. Your next action: paste the domain into Shield and verify it independently before paying.";
  return "I can help with budgeting, saving goals, suspicious payments, and investing practice. Pick the decision that feels most urgent, give me the amount and deadline, and I will turn it into one practical next step.";
}

export async function askNataGuide(messages: Array<{ role: string; content: string }>, systemPrompt: string) {
  const config = loadNataAIConfig();
  const lastMessage = messages[messages.length - 1]?.content || '';
  if (!config.endpoint || (!config.apiKey && config.provider !== 'ollama')) return localReply(lastMessage);

  try {
    if (config.provider === 'anthropic') {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': config.apiKey, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: config.model, max_tokens: 400, system: systemPrompt, messages: messages.map(item => ({ role: item.role === 'guide' ? 'assistant' : 'user', content: item.content })) }),
      });
      if (!response.ok) throw new Error('AI request failed');
      const data = await response.json();
      return data.content?.[0]?.text || localReply(lastMessage);
    }

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(config.apiKey ? { authorization: `Bearer ${config.apiKey}` } : {}) },
      body: JSON.stringify({ model: config.model, stream: false, messages: [{ role: 'system', content: systemPrompt }, ...messages.map(item => ({ role: item.role === 'guide' ? 'assistant' : 'user', content: item.content }))] }),
    });
    if (!response.ok) throw new Error('AI request failed');
    const data = await response.json();
    return data.message?.content || data.choices?.[0]?.message?.content || localReply(lastMessage);
  } catch {
    return localReply(lastMessage);
  }
}
