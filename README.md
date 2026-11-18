# Westford Operations — Next.js + Tailwind

A full six-page conversion of the supplied **Westford Operations Preview (2)(1).html** into a maintainable, responsive Next.js App Router application. The original editorial visual direction, approved copy, page structure, logo and hero image have been retained, with considered motion and mobile refinements.

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
| `/` | Hero, everyday workflow pain points, six services, five-step process, agency offering, controls, free-review CTA |
| `/services` | Service directory, detailed scopes, included vs specialist work, FAQs |
| `/agencies` | Agency delivery, white-label positioning, workflow and FAQs |
| `/brands` | Brand support, workflows and FAQs |
| `/about` | Company positioning, principles, audiences |
| `/contact` | Free review / general support choices, enquiry draft form, FAQs |

The header and footer navigate to **real Next.js routes**, not JavaScript-switched hidden pages. Service cards open an accessible native modal, with a link to a full service scope and a prefilled enquiry route. Contact CTAs pass intent, service and audience through URL parameters.

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

## IMPORTANT: enquiries are drafts only

**The supplied HTML was explicitly an interactive preview**. Its form did not transmit enquiries. This conversion preserves that behaviour to avoid implying that leads are being received when no backend or destination was provided.

The contact form:

1. Allows a free review or a general support enquiry.
2. Accepts context passed in the URL (`intent`, `service`, `audience`).
3. Validates required fields with native browser validation.
4. Optionally remembers an editable draft in the visitor's browser `localStorage`.
5. Generates a copyable/downloadable text summary.
6. Clearly states that nothing has been sent to Westford.

**Before a public launch**, replace the draft-only submit flow with a secure server-side delivery integration (e.g. an authenticated CRM webhook or transactional-email provider). Add spam/rate-limit protection, a privacy policy, an actual recipient/destination, and show verified submission success/error states. Do **not** display “sent” unless the server confirms delivery.

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
  components/
    animations.tsx       # Shared reduced-motion-aware reveals
    navigation.tsx       # Sticky responsive header and mobile nav
    footer.tsx           # Shared footer and draft-storage dialog
    ui.tsx               # Buttons, headings, FAQs, CTAs, steps
    service-cards.tsx    # Service grid with scope dialogs
    audience-page.tsx    # Reusable agencies/brands page layout
    contact-form.tsx     # Enquiry draft form and summary actions
  data/content.json      # Original HTML copy, extracted faithfully
  lib/links.ts           # Typed, prefilled contact URL helper
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

This project was authored in an environment with **no working access to the npm registry**. Dependency installation and a Next.js production build therefore could not be run here; run the three commands in Getting started on a machine with npm access. See any follow-up QA notes in the delivery message.
