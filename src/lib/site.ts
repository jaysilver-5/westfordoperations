import { normalizeContactEmail } from './contact';

// Only show an email address when the business explicitly configures it.
// This address is public contact information; it is not the server's delivery recipient.
export const contactEmail = normalizeContactEmail(process.env.NEXT_PUBLIC_CONTACT_EMAIL);
