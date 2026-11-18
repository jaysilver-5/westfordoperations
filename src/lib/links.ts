export type EnquiryMode = 'review' | 'general';
export type Audience = 'agency' | 'brand' | 'other';

export function enquiryHref(mode: EnquiryMode = 'review', service?: string | null, audience?: string | null) {
  const params = new URLSearchParams({ intent: mode });
  if (service) params.set('service', service);
  if (audience) params.set('audience', audience);
  return `/contact?${params.toString()}#contact-form`;
}
