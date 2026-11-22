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
