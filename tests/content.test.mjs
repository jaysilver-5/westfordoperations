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

test('contact form stays open-ended and booking uses a real scheduling link', () => {
  const form = readFileSync(join(root, 'src/components/contact-form.tsx'), 'utf8');
  const booking = readFileSync(join(root, 'src/app/book/page.tsx'), 'utf8');
  const footer = readFileSync(join(root, 'src/components/footer.tsx'), 'utf8');

  assert.match(form, /name="challenge"/);
  assert.doesNotMatch(form, /SERVICE_OPTIONS\\.map|localStorage/);
  assert.ok(booking.includes('href={bookingUrl}'));
  assert.ok(booking.includes('target="_blank"'));
  assert.ok(booking.includes('https://cal.com/westford'));
  assert.doesNotMatch(booking, /BookingEmbed|<iframe|mailto:|Email to arrange a call/);
  assert.ok(!existsSync(join(root, 'src/components/booking-embed.tsx')));
  assert.doesNotMatch(footer, /Draft storage/);
});

test('Talk to us opens a Westford appointment card before Cal.com', () => {
  const navigation = readFileSync(join(root, 'src/components/navigation.tsx'), 'utf8');
  const booking = readFileSync(join(root, 'src/app/book/page.tsx'), 'utf8');
  assert.ok(navigation.includes('href="/book"'));
  assert.match(navigation, /Talk to us/);
  assert.ok(booking.includes('Introductory meeting'));
  assert.ok(booking.includes('Choose a time'));
  assert.ok(booking.includes('href={bookingUrl}'));
  assert.ok(booking.indexOf('Introductory meeting') < booking.indexOf('Choose a time <ArrowUpRight'));
  assert.ok(booking.includes('Only available appointment times are shown'));
});

test('home hero is centered with concise copy and its original two actions', () => {
  const hero = readFileSync(join(root, 'src/app/page.tsx'), 'utf8');
  assert.ok(hero.includes('mx-auto max-w-[840px] text-center'));
  assert.ok(hero.includes('mx-auto mt-5 max-w-[800px]'));
  assert.ok(hero.includes('items-center justify-center'));
  assert.ok(hero.includes('Start a free trial'));
  assert.ok(hero.includes('Talk to us'));
  assert.ok(hero.includes('src="/images/westford-workspace.webp"'));
  assert.ok(hero.indexOf('Keep your stores moving.') < hero.indexOf('src="/images/westford-workspace.webp"'));
});

test('editorial service list still provides the full interactive service scopes', () => {
  const cards = readFileSync(join(root, 'src/components/service-cards.tsx'), 'utf8');
  const hero = readFileSync(join(root, 'src/app/page.tsx'), 'utf8');
  assert.match(cards, /aria-haspopup="dialog"/);
  assert.match(cards, /onClick=\{\(\) => setSelected\(card\.key\)\}/);
  assert.match(cards, /<dialog ref=\{dialogRef\}/);
  assert.ok(hero.includes('Start a free trial'));
  assert.ok(hero.includes('We’ll handle the details.'));
  assert.ok(!hero.includes('id="everyday"'));
  assert.ok(!hero.includes('id="principles"'));
  assert.ok(!hero.includes('h.services.note'));
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

test('minimal contact form asks only for necessary details', () => {
  const form = readFileSync(join(root, 'src/components/contact-form.tsx'), 'utf8');
  const fields = ['challenge', 'name', 'email', 'company'];
  for (const name of fields) assert.ok(form.includes(`name="${name}"`));
  assert.ok(form.includes('Business name'));
  assert.ok(form.includes('(optional)'));
  assert.ok(!form.includes('name="website"'));
  assert.ok(!form.includes('name="audience"'));
  assert.ok(!form.includes('Select your business'));
  assert.ok(form.indexOf('name="challenge"') < form.indexOf('name="email"'));
});

test('no em dashes remain in public website source or email copy', () => {
  const files = [
    'src/app/page.tsx', 'src/components/contact-form.tsx', 'src/lib/enquiry.ts',
    'src/app/api/enquiry/route.ts', 'src/data/content.json', 'README.md',
  ];
  for (const file of files) {
    const source = readFileSync(join(root, file), 'utf8');
    assert.equal(source.includes(String.fromCharCode(8212)), false, `em dash in ${file}`);
  }
});

test('Westford profile link is the default booking destination', () => {
  const booking = readFileSync(join(root, 'src/app/book/page.tsx'), 'utf8');
  assert.ok(booking.includes('https://cal.com/westford'));
  assert.ok(booking.includes('normalizeBookingUrl'));
});
