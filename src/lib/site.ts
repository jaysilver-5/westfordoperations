import { normalizeContactEmail } from './contact';

// Public business address, shared by the footer, contact page and enquiry emails.
// Set this in .env.local or your hosting project's environment variables, then rebuild.
export const contactEmail = normalizeContactEmail(process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'hello@westfordoperations.com');
