# Westford Operations: Next.js website

A responsive Next.js website for Westford Operations, an e-commerce operations service. The design uses restrained editorial typography, readable layouts, and clear paths for service enquiries or direct meeting bookings.

## Stack

- Next.js App Router + React + TypeScript
- Tailwind CSS v4, including a defined Westford design-token palette
- Motion (`motion/react`) for entrance/scroll reveals and mobile navigation transitions
- Lucide icons; Next.js Image for optimized visual assets
- Server-rendered page content; client components only where interactivity is needed

## Getting started

Requires Node.js 20.9+ (Node 22 LTS recommended).

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

```bash
npm run typecheck
npm run build
npm start
```

For deployment: push to GitHub, import the repo into Vercel (framework: Next.js), and deploy. No database is required for the current draft-only version. When using your own domain, set `NEXT_PUBLIC_SITE_URL` to its full `https://...` URL for absolute Open Graph metadata.

## Routes

| Route | Content |
| --- | --- |
| `/` | Editorial hero, six services, working process, agency support and a short trial CTA |
| `/services` | Service directory, detailed scopes, included vs specialist work, FAQs |
| `/agencies` | Agency delivery, white-label positioning, workflow and FAQs |
| `/brands` | Brand support, workflows and FAQs |
| `/about` | Company positioning, principles, audiences |
| `/contact` | Concise free trial and review enquiry form, email delivery |
| `/book` | Branded appointment card linking to a live Cal.com or Calendly booking page |

The header and footer navigate to **real Next.js routes**, not JavaScript-switched hidden pages. Service cards open an accessible native modal, with a link to a full service scope and a prefilled enquiry route. Contact CTAs pass intent, service and audience through URL parameters.

## Meeting bookings

The **Talk to us** navigation action opens the Westford-designed appointment card at `/book`. The page no longer loads a third-party booking widget inside the site. Visitors see the meeting details first, then select **Choose a time** to open the real scheduling page in a new tab.

The booking link defaults to **https://cal.com/westford**. A profile may show one or more public event types before the visitor chooses a time. To go directly to a particular event type, you can override the URL on Vercel with a published event URL:

```dotenv
BOOKING_URL=https://cal.com/westford/intro-call
```

`BOOKING_URL` is optional. The legacy `NEXT_PUBLIC_BOOKING_URL` override also works. A URL validator allows only HTTPS Cal.com or Calendly booking links, preventing arbitrary redirects.

**Booking is handled by Cal.com or Calendly.** The provider owns real availability, time zone conversion, confirmations and calendar invitations. The website does not collect proposed times, send a mailto request, or invent slots. No Cal.com API token or embedded SDK is required. Make sure your booking profile has at least one published event and a connected calendar. Live invitations must be tested on the provider after event setup.

Existing `/contact?intent=general` links redirect to `/book`. Free-trial and free-review enquiries continue to use the separate form and Resend email delivery.

## Animation approach

- Staggered hero entrance on page load
- Scroll-triggered reveal for headings, list items and cards (one play per section)
- Low-amplitude hover lift on service cards and buttons
- Mobile menu reveal with an accessible menu toggle
- Animated scroll progress under the sticky header
- Native FAQ expansion with a short answer fade
- Restrained ambient glow behind the hero

`prefers-reduced-motion` is respected both by Motion and by the CSS overrides. No animation blocks use of page content.

## Responsive implementation

Designed mobile-first, including small screens (~320px), tablet, desktop and large monitors. Real routes, source content, form fields, accessible focus states, touch-friendly targets, heading hierarchy, `details`-based FAQs and native `<dialog>` overlays are included.

## Business email and trial requests

The streamlined free-trial and free-review form asks for a message, name, email and optional business name. It sends its data to `POST /api/enquiry`. The server validates the request, blocks obvious spam, and uses the **Resend HTTPS email API** to notify the configured Westford inbox. Both a clean HTML email and a plain-text version are sent, with the visitor's email set as Reply-To. A successful response means Resend **accepted** the message; final inbox delivery must be checked separately.

### Activate delivery on Vercel

Westford can keep **Zoho Mail for receiving email**. Resend is only the sender of automated website enquiry notifications. To avoid disturbing Zoho's existing root-domain MX and SPF records, use a sending-only subdomain (for example `send.westfordoperations.com`) and add exactly the domain-verification DNS records supplied by Resend. Do not replace or duplicate Zoho's MX or root SPF records.

1. Create a Resend account, verify your chosen sending domain, and create a sending API key.
2. In the Vercel project, add the following **server-only** environment variables to Production:

```dotenv
RESEND_API_KEY=...               # private; set in Vercel only, never commit
CONTACT_FROM_EMAIL=forms@send.westfordoperations.com   # example: must match verified sender domain
CONTACT_TO_EMAIL=your-real-mailbox@westfordoperations.com # replace with your actual active Zoho inbox
```

3. Optionally set `NEXT_PUBLIC_CONTACT_EMAIL` to an actual existing public mailbox if it should appear in the footer. It is deliberately **not** used as the notification recipient or as an automatic fallback.
4. Redeploy so the environment variables are available to the app. Submit one trial request and one free-review request. Check that each appears in Resend's email activity, then confirm reception in your Zoho inbox (and spam folder). Reply to a notification to verify it addresses the visitor, not the sending service.

**Important:** Until all three required server-only variables exist and the sending domain is verified, enquiry submissions intentionally report an error; the website never claims success based on a guessed address. No API keys, email passwords or tokens belong in the source code or public environment variables. `CONTACT_TO_EMAIL` must be the exact mailbox that you own.

The endpoint uses per-instance throttling, a honeypot, origin and payload checks, and idempotent request IDs. For heavily distributed production traffic, add a host-level or shared rate limit.

## Project organization

```text
src/
  app/
    layout.tsx           # Shared shell, metadata, navigation/footer
    globals.css          # Tailwind import, theme tokens, reusable primitives
    page.tsx             # Home
    services/page.tsx
    agencies/page.tsx
    brands/page.tsx
    about/page.tsx
    contact/page.tsx
    book/page.tsx
  components/
    animations.tsx       # Shared reduced-motion-aware reveals
    navigation.tsx       # Sticky responsive header and mobile nav
    footer.tsx           # Shared footer and navigation
    ui.tsx               # Buttons, headings, FAQs, CTAs, steps
    service-cards.tsx    # Service grid with scope dialogs
    audience-page.tsx    # Reusable agencies/brands page layout
    contact-form.tsx     # Short, open-ended enquiry form
  data/content.json      # Original HTML copy, extracted faithfully
  lib/links.ts           # Typed, prefilled contact and booking URL helper
  lib/booking.ts         # Trusted scheduling-provider link validation
public/
  favicon.png
  images/
    westford-logo.webp
    westford-workspace.webp
```

`extract_source.py` is an optional one-time provenance script (run `python extract_source.py /path/to/your-preview.html` with Beautiful Soup installed) that created the checked-in content JSON; it does not run in the app. The reference HTML is not needed at runtime.

## Typography / images

The logo and hero image were extracted from the user-supplied HTML. Instead of shipping embedded font binaries, the UI uses Google Fonts' openly distributed **Manrope** and **Instrument Serif** with system fallbacks. This keeps the project lighter while preserving the modern sans + editorial serif direction.

## Verification

Run `npm run typecheck`, `npm test` and `npm run build`. Tests cover content/routes, trial context, configurable recipients, email encoding, server validation, spam checks, throttling, reply-to handling, and failure responses. Transport is stubbed only in unit tests; live email delivery requires the real mail service configuration and a verified receiving inbox.
