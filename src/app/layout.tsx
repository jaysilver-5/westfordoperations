import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Header } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { AnimationSettings } from '@/components/animations';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Westford Operations', template: '%s' },
  description: 'Managed e-commerce operations for agencies and growing brands.',
  applicationName: 'Westford Operations',
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  openGraph: {
    type: 'website',
    siteName: 'Westford Operations',
    title: 'Westford Operations | Keep your stores moving',
    description: 'Managed e-commerce operations for agencies and growing brands.',
    images: [{ url: '/images/westford-workspace.webp', width: 2172, height: 724, alt: 'A quiet, sunlit workspace' }],
  },
  icons: { icon: '/favicon.png' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#f8f7f3' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en">
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;650;700;750;800&display=swap" rel="stylesheet" />
    </head>
    <body>
      <a href="#main-content" className="sr-only fixed left-3 top-3 z-[100] rounded-lg bg-ink px-5 py-3 text-white focus:not-sr-only">Skip to content</a>
      <AnimationSettings>
        <Header />
        {children}
        <Footer />
      </AnimationSettings>
    </body>
  </html>;
}
