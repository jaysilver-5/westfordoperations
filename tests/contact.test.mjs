import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

async function importTypeScript(path) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}

const { contactEmailHref, normalizeContactEmail } = await importTypeScript('../src/lib/contact.ts');
const { enquiryHref, parseEnquiryMode } = await importTypeScript('../src/lib/links.ts');

test('trial CTAs preserve service and audience and old review links still work', () => {
  const trial = new URL(enquiryHref('trial', 'orders', 'agency'), 'https://example.test');
  assert.equal(trial.searchParams.get('intent'), 'trial');
  assert.equal(trial.searchParams.get('service'), 'orders');
  assert.equal(trial.searchParams.get('audience'), 'agency');
  assert.equal(trial.hash, '#contact-form');
  const booking = new URL(enquiryHref('general', 'orders', 'agency'), 'https://example.test');
  assert.equal(booking.pathname, '/book');
  assert.equal(booking.searchParams.get('service'), 'orders');
  assert.equal(booking.searchParams.get('audience'), 'agency');
  assert.equal(parseEnquiryMode('review'), 'review');
  assert.equal(parseEnquiryMode('general'), 'general');
  assert.equal(parseEnquiryMode(), 'trial');
  assert.equal(parseEnquiryMode('unrecognised'), 'trial');
});

test('changing the configured recipient updates mail links without changing the message', () => {
  for (const email of ['hello@example.test', 'trials+agency@example.test']) {
    const link = new URL(contactEmailHref(email, 'trial', 'Name: Alex\nService: Orders'));
    assert.equal(link.pathname, email);
    assert.match(link.searchParams.get('subject'), /two-week free trial/);
    assert.equal(link.searchParams.get('body'), 'Name: Alex\nService: Orders');
  }
});

test('enquiry text cannot add recipients or extra mail headers', () => {
  const body = 'Orders & returns? 50% complete.\n&bcc=another@example.test\nUnicode: café';
  const link = new URL(contactEmailHref('hello@example.test', 'general', body));
  assert.equal(link.searchParams.get('body'), body);
  assert.equal(link.searchParams.has('bcc'), false);
  assert.deepEqual([...link.searchParams.keys()], ['subject', 'body']);
});

test('missing or malformed contact addresses never produce a broken mail link', () => {
  for (const email of ['', 'not-an-email', 'hello@example.test?bcc=other@example.test', 'hello@example.test\nBcc: other@example.test']) {
    assert.equal(normalizeContactEmail(email), '');
    assert.equal(contactEmailHref(email), null);
  }
  assert.equal(normalizeContactEmail(' hello@example.test '), 'hello@example.test');
});
