import type { EnquiryMode } from './links';

export const SERVICE_OPTIONS = [
  ['unsure', 'Help me choose a starting point'],
  ['store', 'Store & catalogue'],
  ['orders', 'Orders & fulfilment administration'],
  ['support', 'Customer support'],
  ['marketplaces', 'Marketplaces & multichannel'],
  ['marketing', 'Marketing operations'],
  ['technical', 'Technical store support'],
] as const;

export type EnquiryFields = {
  name: string; email: string; company: string; audience: string; service: string;
  challenge: string; website: string; platform: string; workload: string; remember: boolean;
};
export type EnquirySubmission = EnquiryFields & { intent: EnquiryMode; requestId: string };

export function parseEnquiry(value: unknown): EnquirySubmission | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const fields: Record<string, string> = {};
  const limits = { name: 100, email: 254, company: 200, audience: 20, service: 30, challenge: 2000, website: 300, platform: 200, workload: 200, requestId: 36, intent: 10 };
  for (const [key, max] of Object.entries(limits)) {
    if (typeof input[key] !== 'string' || input[key].length > max) return null;
    fields[key] = input[key].trim();
  }
  if (!fields.name || !fields.company || !fields.challenge) return null;
  if (!/^[^\s@<>,;:"\r\n]+@[^\s@<>,;:"\r\n]+\.[^\s@<>,;:"\r\n]+$/.test(fields.email)) return null;
  if (!['agency', 'brand', 'other', 'unspecified'].includes(fields.audience)) return null;
  if (!SERVICE_OPTIONS.some(([key]) => key === fields.service)) return null;
  if (!['trial', 'review', 'general'].includes(fields.intent)) return null;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(fields.requestId)) return null;
  if (input.websiteConfirm !== '') return null;
  return { ...fields, remember: false } as EnquirySubmission;
}

export function enquiryText(fields: EnquiryFields, label: string): string {
  const audiences: Record<string, string> = { agency: 'E-commerce agency', brand: 'E-commerce brand', other: 'Other business' };
  const service = SERVICE_OPTIONS.find(([key]) => key === fields.service)?.[1] ?? 'Not selected';
  return [
    'WESTFORD OPERATIONS — ENQUIRY', '', `Type: ${label}`,
    `Name: ${fields.name.trim()}`, `Work email: ${fields.email.trim()}`, `Company: ${fields.company.trim()}`,
    ...(fields.audience === 'unspecified' ? [] : [`Business: ${audiences[fields.audience] ?? 'Not specified'}`]),
    ...(fields.service === 'unsure' ? [] : [`Area of support: ${service}`]),
    '', 'Current challenge:', fields.challenge.trim(),
    ...(fields.website ? ['', `Website: ${fields.website.trim()}`] : []),
    ...(fields.platform ? [`Platform: ${fields.platform.trim()}`] : []),
    ...(fields.workload ? [`Approximate workload: ${fields.workload.trim()}`] : []),
  ].join('\n');
}


const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

/** A readable inbox notification with escaped user input and a plain-text alternative. */
export function enquiryHtml(fields: EnquiryFields, label: string): string {
  const audienceNames: Record<string, string> = { agency: 'E-commerce agency', brand: 'E-commerce brand', other: 'Other business' };
  const rows: [string, string][] = [
    ['Name', fields.name],
    ['Email', fields.email],
    ['Company', fields.company],
    ...(fields.audience && fields.audience !== 'unspecified'
      ? [['Business', audienceNames[fields.audience] || 'Other business'] as [string, string]]
      : []),
    ...(fields.service && fields.service !== 'unsure'
      ? [['Support area', SERVICE_OPTIONS.find(([key]) => key === fields.service)?.[1] || 'General operations'] as [string, string]]
      : []),
    ...(fields.website ? [['Website', fields.website] as [string, string]] : []),
    ...(fields.platform ? [['Platform', fields.platform] as [string, string]] : []),
    ...(fields.workload ? [['Workload', fields.workload] as [string, string]] : []),
  ];
  const details = rows.map(([key, value]) =>
    `<tr><td style="padding:12px 18px 12px 0;border-bottom:1px solid #e7eae5;vertical-align:top;color:#5c6c70;font-size:13px;white-space:nowrap;">${escapeHtml(key)}</td><td style="padding:12px 0;border-bottom:1px solid #e7eae5;vertical-align:top;color:#17343d;font-size:14px;line-height:1.6;">${escapeHtml(value)}</td></tr>`
  ).join('');
  const challenge = escapeHtml(fields.challenge).replace(/\r?\n/g, '<br>');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:28px 14px;background:#f8f7f3;font-family:Arial,sans-serif;color:#17343d;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;margin:0 auto;background:#fffefa;border:1px solid #dce2dc;">
<tr><td style="padding:28px 32px;background:#17343d;color:#ffffff;">
  <p style="margin:0 0 11px;color:#dce7d7;font-size:11px;font-weight:700;letter-spacing:2px;">WESTFORD OPERATIONS</p>
  <h1 style="margin:0;font-weight:500;font-size:25px;line-height:1.25;">${escapeHtml(label)}</h1>
</td></tr>
<tr><td style="padding:30px 32px;">
  <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:1.2px;color:#376e67;">NEW WEBSITE ENQUIRY</p>
  <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#5c6c70;">A visitor has submitted a request through the Westford website. Reply to this message to contact them directly.</p>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-top:1px solid #e7eae5;">${details}</table>
  <p style="margin:28px 0 10px;font-size:12px;font-weight:700;letter-spacing:1px;color:#376e67;">WHAT THEY NEED HELP WITH</p>
  <div style="padding:18px;background:#f1f4ef;font-size:14px;line-height:1.8;overflow-wrap:anywhere;">${challenge}</div>
</td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid #e7eae5;color:#667872;font-size:12px;line-height:1.6;">Sent from the Westford Operations enquiry form.</td></tr>
</table></body></html>`;
}

// A bounded, best-effort per-instance throttle; hosting-level rules can add global limits.
export function createEnquiryThrottle() {
  const attempts = new Map<string, { count: number; expires: number }>();
  return (client: string, now = Date.now()) => {
    for (const [key, entry] of attempts) if (entry.expires <= now) attempts.delete(key);
    const entry = attempts.get(client);
    if (entry && entry.count >= 5) return false;
    if (entry) entry.count += 1;
    else {
      if (attempts.size >= 1024) attempts.delete(attempts.keys().next().value!);
      attempts.set(client, { count: 1, expires: now + 10 * 60 * 1000 });
    }
    return true;
  };
}
