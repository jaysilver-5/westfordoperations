# Westford Operations — Next.js + Tailwind

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
| `/` | Hero, everyday workflow pain points, six services, five-step process, agency offering, controls, two-week trial offer |
| `/services` | Service directory, detailed scopes, included vs specialist work, FAQs |
| `/agencies` | Agency delivery, white-label positioning, workflow and FAQs |
| `/brands` | Brand support, workflows and FAQs |
| `/about` | Company positioning, principles, audiences |
| `/contact` | Concise free trial and review enquiry form, email delivery |
| `/book` | Branded meeting-scheduling page with live availability from a connected scheduling provider |

The header and footer navigate to **real Next.js routes**, not JavaScript-switched hidden pages. Service cards open an accessible native modal, with a link to a full service scope and a prefilled enquiry route. Contact CTAs pass intent, service and audience through URL parameters.

## Meeting bookings

The **Talk to us** button in the header and mobile menu goes directly to the scheduling page. The booking widget collects the attendee's details, lets them choose a confirmed available time, and (once configured) sends the invitation using the scheduling provider. No Westford enquiry email is required or sent to schedule meetings.


“Book a call”, “Talk to us”, and general-discussion CTAs open `/book`, where the live booking calendar is the first primary element, above supporting copy. Existing `/contact?intent=general` links redirect there and preserve service/audience context. Trial and free-review enquiries still use the contact form.

To enable actual bookings, create an introductory event with **Calendly** or **Cal.com**. Connect the host's real calendar, set availability and time zone, choose the meeting location (a video-call link or phone call), and enable automatic calendar invitations and booking confirmations. Make sure the event allows instant booking without manual approval. Then configure:

```dotenv
BOOKING_URL=https://cal.com/your-team/intro
```

You may use a Calendly event URL instead. The legacy `NEXT_PUBLIC_BOOKING_URL` setting also works; `BOOKING_URL` is preferred because it is read on the server. Only HTTPS scheduling URLs from those two providers are accepted. The official Cal.com or Calendly inline embedding SDK handles real-time availability, time-zone conversion, the confirmed booking, and sending the attendee a calendar invitation and meeting details. Neither embed needs an API token; an API token is needed only for a separately built custom scheduling integration. Visitors do **not** email Westford to request a call, and Westford never invents available time slots. When no valid event URL is configured, the booking section displays a clear unavailable state rather than an introductory information card. The site cannot create a scheduling provider account or calendar event on its own.

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

Set your public business address once:

```dotenv
NEXT_PUBLIC_CONTACT_EMAIL=your-address@your-domain.com
```

Use `.env.local` for local development, or add this variable to your existing hosting project's environment settings. Restart the dev server or rebuild/redeploy after changing it: `NEXT_PUBLIC_` values are included at build time. This is a public contact address, never an email password or API key.

The shared configuration in `src/lib/site.ts` supplies the footer, direct contact links and form delivery address. The proposed default is `hello@westfordoperations.com`; set `NEXT_PUBLIC_CONTACT_EMAIL` to the actual existing mailbox before launch. An explicitly empty or invalid address hides email links.

Visitors can request a two-week trial or free operations review using the concise enquiry form. Trial CTAs open `/contact?intent=trial#contact-form` and preserve any service and audience. Existing `review` and `general` links continue to work.

The contact form sends to `POST /api/enquiry`. The server validates fields and intent, rejects cross-origin and honeypot submissions, applies a bounded per-instance request throttle and sends a plain-text email through Resend. The recipient is configured on the server; a submitted email address is used only as `reply_to`. A request ID prevents duplicate provider sends when retrying the same request. No passwords or mail service keys enter the browser bundle.

Set `RESEND_API_KEY` as a **server-only secret** in `.env.local` / the hosting project and verify your sending domain in Resend. Optional server-only `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL` override the sending and receiving addresses; both default to the public contact address. The receiving mailbox must already exist with your email host. Creating or displaying an address in the site does not create an inbox or change mail DNS records.

Success appears only after the provider accepts the email and returns its message ID. Missing setup, provider failures and timeouts preserve the form and show a retry/direct-email alternative. The UI does not claim the email has arrived in an inbox or that a trial has been activated. Trial scope, workload and start date are agreed separately. The contact form does not store personal details in browser storage. The in-memory throttle is per server instance; configure hosting-level rate limits for distributed abuse protection.

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
    booking-embed.tsx    # Official inline Cal.com / Calendly integration
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
