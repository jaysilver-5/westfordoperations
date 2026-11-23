import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const content = JSON.parse(readFileSync(join(root, 'src/data/content.json'), 'utf8'));
const routes = ['home', 'services', 'agencies', 'brands', 'about', 'contact'];

test('all six original pages are represented', () => {
  for (const route of routes) assert.ok(content[route]?.hero?.title, `missing hero for ${route}`);
});

test('dedicated App Router files exist for every destination', () => {
  const routeDirs = ['services', 'agencies', 'brands', 'about', 'contact', 'book'];
  assert.ok(existsSync(join(root, 'src/app/page.tsx')));
  for (const route of routeDirs) assert.ok(existsSync(join(root, 'src/app', route, 'page.tsx')));
});

test('service links target real unique sections', () => {
  const scopes = content.services.scopes;
  assert.equal(scopes.length, 6);
  assert.equal(new Set(scopes.map(s => s.id)).size, scopes.length);
  for (const s of scopes) {
    assert.equal(s.id, `scope-${s.key}`);
    assert.ok(s.title && s.description && s.tasks.length >= 3 && s.condition);
  }
  for (const item of content.home.services.items) assert.ok(scopes.some(s => s.key === item.key));
});

test('FAQ, copy and content are preserved for public routes', () => {
  assert.equal(content.home.process.items.length, 5);
  for (const r of ['services','agencies','brands','contact']) {
    assert.ok(content[r].faq.items.length >= 3);
    for (const faq of content[r].faq.items) assert.ok(faq.q && faq.a);
  }
  assert.equal(content.about.principles.items.length, 4);
});

test('source logo and hero photograph are bundled', () => {
  for (const asset of ['westford-logo.webp', 'westford-workspace.webp']) {
    assert.ok(existsSync(join(root, 'public/images', asset)), `missing asset ${asset}`);
  }
});

test('contact experience stays open-ended and meeting booking never falls back to email', () => {
  const form = readFileSync(join(root, 'src/components/contact-form.tsx'), 'utf8');
  const booking = readFileSync(join(root, 'src/app/book/page.tsx'), 'utf8');
  const footer = readFileSync(join(root, 'src/components/footer.tsx'), 'utf8');
  assert.match(form, /name="challenge"/);
  assert.doesNotMatch(form, /SERVICE_OPTIONS\.map/);
  assert.doesNotMatch(form, /localStorage/);
  assert.ok(booking.includes('<BookingEmbed url={bookingUrl} />'));
  assert.ok(booking.indexOf('<BookingEmbed') < booking.indexOf('We’ll talk about your day-to-day operations'));
  const embed = readFileSync(join(root, 'src/components/booking-embed.tsx'), 'utf8');
  assert.ok(embed.includes('https://app.cal.com/embed/embed.js'));
  assert.ok(embed.includes('https://assets.calendly.com/assets/external/widget.js'));
  assert.doesNotMatch(embed, /API_KEY|Bearer /);
  assert.doesNotMatch(booking, /mailto:|Email to arrange a call|contactEmailHref/);
  assert.doesNotMatch(footer, /Draft storage/);
});

test('Talk to us opens the direct meeting booking flow', () => {
  const navigation = readFileSync(join(root, 'src/components/navigation.tsx'), 'utf8');
  const booking = readFileSync(join(root, 'src/app/book/page.tsx'), 'utf8');
  assert.ok(navigation.includes('href="/book"'));
  assert.match(navigation, /Talk to us/);
  assert.ok(booking.includes('<BookingEmbed url={bookingUrl} />'));
  assert.ok(booking.indexOf('<BookingEmbed') < booking.indexOf('We’ll talk about your day-to-day operations'));
  assert.doesNotMatch(booking, /mailto:|Email to arrange a call/);
});

test('calendar-first booking stays visually before supporting copy', () => {
  const booking = readFileSync(join(root, 'src/app/book/page.tsx'), 'utf8');
  const firstCalendar = booking.indexOf('<BookingEmbed');
  const secondaryContent = booking.indexOf('Looking for a free trial instead?');
  assert.ok(firstCalendar > 0);
  assert.ok(secondaryContent > firstCalendar);
  assert.doesNotMatch(booking, /A useful first conversation|What happens next|<aside/);
});

test('editorial service list still provides the full interactive service scopes', () => {
  const cards = readFileSync(join(root, 'src/components/service-cards.tsx'), 'utf8');
  const hero = readFileSync(join(root, 'src/app/page.tsx'), 'utf8');
  assert.match(cards, /aria-haspopup="dialog"/);
  assert.match(cards, /onClick=\{\(\) => setSelected\(card\.key\)\}/);
  assert.match(cards, /<dialog ref=\{dialogRef\}/);
  assert.ok(hero.includes('Try Westford free for 2 weeks'));
  assert.ok(hero.includes('href="/book"'));
});

test('website email delivery cannot silently target an imaginary default mailbox', () => {
  const site = readFileSync(join(root, 'src/lib/site.ts'), 'utf8');
  const api = readFileSync(join(root, 'src/app/api/enquiry/route.ts'), 'utf8');
  assert.doesNotMatch(site, /\?\? 'hello@westfordoperations\.com'/);
  assert.ok(api.includes('process.env.CONTACT_TO_EMAIL'));
  assert.ok(api.includes('process.env.CONTACT_FROM_EMAIL'));
  assert.ok(api.includes('process.env.RESEND_API_KEY'));
  assert.ok(api.includes('enquiryHtml(details'));
});
