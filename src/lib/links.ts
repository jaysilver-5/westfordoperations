export type EnquiryMode = 'trial' | 'review' | 'general';
export type Audience = 'agency' | 'brand' | 'other';

export function enquiryHref(mode: EnquiryMode = 'trial', service?: string | null, audience?: string | null) {
  const params = new URLSearchParams({ intent: mode });
  if (service) params.set('service', service);
  if (audience) params.set('audience', audience);
  return `/contact?${params.toString()}#contact-form`;
}

export function parseEnquiryMode(value?: string): EnquiryMode {
  return value === 'general' || value === 'review' ? value : 'trial';
}
