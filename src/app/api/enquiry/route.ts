import { createHash } from 'node:crypto';
import { enquiryLabels, normalizeContactEmail } from '@/lib/contact';
import { createEnquiryThrottle, enquiryText, parseEnquiry } from '@/lib/enquiry';

export const runtime = 'nodejs';
const allowEnquiry = createEnquiryThrottle();
const unavailable = 'We couldn’t send your request right now. Please try again shortly.';
const json = (body: object, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Please submit your request from our website.' }, 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json({ error: 'Please use the enquiry form.' }, 415);
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const client = createHash('sha256').update(ip).digest('hex');
  if (!allowEnquiry(client)) return json({ error: 'You’ve made several requests. Please wait a few minutes before trying again.' }, 429);

  let payload: unknown;
  try {
    const body = await request.text();
    if (body.length > 12000) return json({ error: 'Please shorten your request and try again.' }, 413);
    payload = JSON.parse(body);
  } catch {
    return json({ error: 'Please check the form and try again.' }, 400);
  }
  const details = parseEnquiry(payload);
  if (!details) return json({ error: 'Please check your contact details and complete the required fields.' }, 400);

  // Never silently send to a guessed mailbox. A real recipient and a verified
  // sending address must both be configured as server-only environment variables.
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const sender = normalizeContactEmail(process.env.CONTACT_FROM_EMAIL);
  const recipient = normalizeContactEmail(process.env.CONTACT_TO_EMAIL);
  if (!apiKey || !sender || !recipient) {
    console.error('Enquiry delivery is not configured', {
      missingKey: !apiKey,
      invalidSender: !sender,
      invalidRecipient: !recipient,
    });
    return json({ error: unavailable }, 503);
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `westford-enquiry/${details.requestId}` },
      body: JSON.stringify({
        from: `Westford Operations <${sender}>`, to: [recipient], reply_to: details.email,
        subject: `${enquiryLabels[details.intent]} — ${details.company.replace(/[\r\n]/g, ' ')}`,
        text: enquiryText(details, enquiryLabels[details.intent]),
      }),
      signal: AbortSignal.timeout(15000),
    });
    const result = await response.json().catch(() => null) as { id?: unknown } | null;
    if (!response.ok || typeof result?.id !== 'string' || !result.id) {
      console.error('Enquiry email rejected by provider', { status: response.status });
      return json({ error: unavailable }, 502);
    }
    return json({ ok: true });
  } catch {
    console.error('Enquiry email provider unavailable');
    return json({ error: unavailable }, 502);
  }
}
