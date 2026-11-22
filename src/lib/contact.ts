import type { EnquiryMode } from './links';

export const enquiryLabels: Record<EnquiryMode, string> = {
  trial: 'Two-week free trial',
  review: 'Free operations review',
  general: 'Discuss operational support',
};

export function normalizeContactEmail(value: string | undefined): string {
  const email = value?.trim() ?? '';
  return /^[a-z0-9._+-]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(email) ? email : '';
}

export function contactEmailHref(email: string, intent: EnquiryMode = 'general', body?: string): string | null {
  const recipient = normalizeContactEmail(email);
  if (!recipient) return null;
  const subject = intent === 'trial' ? 'Let’s start my two-week free trial' : enquiryLabels[intent];
  const message = body ?? (intent === 'trial'
    ? 'Hi Westford,\n\nI’d like to try Westford free for two weeks.\n\nMy business:\nMy website:\nThe workflow I need help with:\n\nThanks!'
    : 'Hi Westford,\n\nI’d like to talk about support for my store operations.\n\n');
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}
