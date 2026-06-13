import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzePlatform, analyzeThreat, DEMOS } from '../src/engine.js';

test('bank impersonation is high risk', () => {
  const result = analyzeThreat(DEMOS.bank, 'sms');
  assert.ok(result.score >= 70);
  assert.equal(result.verdict, 'Likely scam');
  assert.ok(result.signals.some(signal => signal.id === 'credential'));
});

test('investment scam exposes returns and crypto signals', () => {
  const result = analyzeThreat(DEMOS.investment, 'chat');
  assert.ok(result.signals.some(signal => signal.id === 'returns'));
  assert.ok(result.signals.some(signal => signal.id === 'crypto'));
});

test('recognized domain remains low risk', () => {
  const result = analyzeThreat(DEMOS.safe, 'url');
  assert.ok(result.score < 25);
  assert.equal(result.verdict, 'Low risk');
});

test('suspicious broker scores lower trust', () => {
  const suspicious = analyzePlatform('crypto-double-returns.top/invest');
  const known = analyzePlatform('coinbase.com');
  assert.ok(suspicious.trust < known.trust);
});
