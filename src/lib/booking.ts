/**
 * Only allow public HTTPS scheduling pages from supported providers.
 * A booking link is public; never put calendar credentials here.
 */
export function normalizeBookingUrl(input: string | undefined): string | null {
  if (!input?.trim()) return null;
  try {
    const url = new URL(input.trim());
    const hosts = new Set(['calendly.com', 'www.calendly.com', 'cal.com', 'app.cal.com']);
    if (url.protocol !== 'https:' || !hosts.has(url.hostname.toLowerCase()) || url.username || url.password || url.hash || url.pathname === '/') return null;
    return url.toString();
  } catch {
    return null;
  }
}
