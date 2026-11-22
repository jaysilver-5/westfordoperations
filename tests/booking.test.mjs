import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/booking.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { normalizeBookingUrl } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));

test('only configured HTTPS provider booking pages are embedded', () => {
  assert.equal(normalizeBookingUrl('https://calendly.com/westford/intro-call'), 'https://calendly.com/westford/intro-call');
  assert.equal(normalizeBookingUrl('https://cal.com/westford/intro'), 'https://cal.com/westford/intro');
  for (const value of [undefined, '', 'https://calendly.com/', 'https://calendly.com/westford', 'https://cal.com/westford', 'http://calendly.com/team/intro', 'https://calendly.com.evil.example/team/intro', 'javascript:alert(1)', 'https://user:pass@cal.com/intro', 'https://calendar.google.com/calendar/appointment']) {
    assert.equal(normalizeBookingUrl(value), null);
  }
});
