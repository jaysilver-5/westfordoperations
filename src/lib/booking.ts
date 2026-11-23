/**
 * Only allow public HTTPS scheduling pages from supported providers.
 * A booking link is public; never put calendar credentials here.
 */
export function normalizeBookingUrl(input: string | undefined): string | null {
  if (!input?.trim()) return null;
  try {
    const url = new URL(input.trim());
    const hosts = new Set(['calendly.com', 'www.calendly.com', 'cal.com', 'app.cal.com']);
    if (url.protocol !== 'https:' || !hosts.has(url.hostname.toLowerCase()) || url.username || url.password || url.hash || url.port) return null;
    const segments = url.pathname.split('/').filter(Boolean);
    // Cal.com supports embedding a public profile as well as an individual event.
    // Calendly embeds must point to an actual event type, not a user profile.
    const isCal = ['cal.com', 'app.cal.com'].includes(url.hostname.toLowerCase());
    if (segments.length < (isCal ? 1 : 2)) return null;
    return url.toString();
  } catch {
    return null;
  }
}
