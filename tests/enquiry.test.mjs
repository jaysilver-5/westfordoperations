import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import * as crypto from 'node:crypto';
import ts from 'typescript';

const compile = (path, module = ts.ModuleKind.ESNext) => ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), { compilerOptions: { module, target: ts.ScriptTarget.ES2020 } }).outputText;
const enquiry = await import(`data:text/javascript;base64,${Buffer.from(compile('../src/lib/enquiry.ts')).toString('base64')}`);
const contact = await import(`data:text/javascript;base64,${Buffer.from(compile('../src/lib/contact.ts')).toString('base64')}`);
const valid = () => ({ name: 'Alex Example', email: 'alex@example.test', company: 'Example Store', audience: 'agency', service: 'orders', challenge: 'Order follow-ups & returns.', website: '', platform: '', workload: '', intent: 'trial', requestId: crypto.randomUUID(), websiteConfirm: '' });

function route({ apiKey = 'test-only-key', provider = async () => Response.json({ id: 'test-message-id' }) } = {}) {
  const module = { exports: {} };
  const deps = { 'node:crypto': crypto, '@/lib/site': { contactEmail: 'hello@westfordoperations.com' }, '@/lib/contact': contact, '@/lib/enquiry': enquiry };
  runInNewContext(compile('../src/app/api/enquiry/route.ts', ts.ModuleKind.CommonJS), {
    module, exports: module.exports, require: (name) => { if (!deps[name]) throw new Error(`Unexpected dependency ${name}`); return deps[name]; },
    Response, URL, AbortSignal, fetch: provider, process: { env: { RESEND_API_KEY: apiKey } }, console: { error() {} },
  });
  return module.exports.POST;
}
const request = (body = valid(), origin = 'https://westford.example') => new Request('https://westford.example/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin, 'x-forwarded-for': '192.0.2.1' }, body: JSON.stringify(body) });

test('server validation accepts the full trial enquiry and rejects malformed or spam inputs', () => {
  assert.equal(enquiry.parseEnquiry(valid()).intent, 'trial');
  for (const changes of [{ email: 'invalid' }, { email: 'alex@example.test\nBcc:other@example.test' }, { company: '' }, { challenge: 'x'.repeat(2001) }, { intent: 'unknown' }, { audience: 'invalid' }, { service: 'invalid' }, { requestId: 'bad-id' }, { websiteConfirm: 'spam' }]) {
    assert.equal(enquiry.parseEnquiry({ ...valid(), ...changes }), null);
  }
});

test('throttle limits repeated requests per client and expires after ten minutes', () => {
  const allow = enquiry.createEnquiryThrottle();
  for (let i = 0; i < 5; i++) assert.equal(allow('client-a', 100), true);
  assert.equal(allow('client-a', 101), false);
  assert.equal(allow('client-b', 101), true);
  assert.equal(allow('client-a', 600101), true);
});

test('API sends to the configured inbox, preserves context and sets the visitor as reply-to', async () => {
  let sent;
  const submission = { ...valid(), to: 'attacker@example.test' };
  const post = route({ provider: async (url, options) => { sent = { url, options, email: JSON.parse(options.body) }; return Response.json({ id: 'test-message-id' }); } });
  const response = await post(request(submission));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(sent.url, 'https://api.resend.com/emails');
  assert.deepEqual(sent.email.to, ['hello@westfordoperations.com']);
  assert.equal(sent.email.reply_to, submission.email);
  assert.match(sent.email.text, /E-commerce agency/);
  assert.match(sent.email.text, /Orders & fulfilment administration/);
  assert.match(sent.email.subject, /Two-week free trial/);
  assert.equal(sent.options.headers['Idempotency-Key'], `westford-enquiry/${submission.requestId}`);
});

test('missing credentials and provider failures never report a submitted request', async () => {
  let called = false;
  const missing = await route({ apiKey: '', provider: async () => { called = true; } })(request());
  assert.equal(missing.status, 503);
  assert.equal(called, false);
  assert.ok(!(await missing.json()).ok);
  for (const provider of [async () => Response.json({ message: 'private provider error' }, { status: 401 }), async () => { throw new Error('network failure'); }, async () => Response.json({})]) {
    const response = await route({ provider })(request());
    assert.equal(response.status, 502);
    const result = await response.json();
    assert.ok(!result.ok);
    assert.doesNotMatch(result.error, /private provider error/);
  }
});

test('cross-origin and incomplete requests are rejected before calling the provider', async () => {
  let called = false;
  const post = route({ provider: async () => { called = true; } });
  assert.equal((await post(request(valid(), 'https://other.example'))).status, 403);
  assert.equal((await post(request({}))).status, 400);
  assert.equal(called, false);
});
