'use client';

import { useEffect, useId, useRef } from 'react';
import Script from 'next/script';

type CalNamespace = ((...args: unknown[]) => void) & { q?: unknown[][] };
type CalApi = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  q?: unknown[][];
  ns?: Record<string, CalNamespace>;
};
type BookingWindow = Window & {
  Cal?: CalApi;
  Calendly?: {
    initInlineWidget: (options: {
      url: string;
      parentElement: HTMLElement;
      resize?: boolean;
    }) => void;
  };
};

// The official Cal.com JavaScript bootstrap. It loads its inline booking SDK once,
// queues configuration while loading, and avoids exposing an API token to the browser.
function getCalApi(): CalApi {
  const host = window as BookingWindow;
  if (host.Cal) return host.Cal;

  const cal: CalApi = (...args: unknown[]) => {
    const current = host.Cal!;
    if (!current.loaded) {
      current.ns = {};
      current.q = current.q || [];
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://app.cal.com/embed/embed.js';
      document.head.appendChild(script);
      current.loaded = true;
    }
    if (args[0] === 'init' && typeof args[1] === 'string') {
      const name = args[1];
      if (!current.ns![name]) {
        const namespace: CalNamespace = (...namespaceArgs: unknown[]) => {
          namespace.q!.push(namespaceArgs);
        };
        namespace.q = [];
        current.ns![name] = namespace;
      }
      current.ns![name].q!.push(args);
      current.q!.push(['initNamespace', name]);
      return;
    }
    current.q!.push(args);
  };
  host.Cal = cal;
  return cal;
}

function CalInlineBooking({ url }: { url: string }) {
  const element = useRef<HTMLDivElement>(null);
  const reactId = useId();
  useEffect(() => {
    const target = element.current;
    if (!target) return;
    // Deferring setup avoids initializing twice under React Strict Mode's
    // development-only effect mount/cleanup cycle.
    const timer = window.setTimeout(() => {
      if (!target.isConnected) return;
      const namespace = 'westford_' + reactId.replace(/[^a-z0-9]/gi, '');
      const calLink = new URL(url).pathname.replace(/^\\/+|\\/+$/g, '');
      const cal = getCalApi();
      cal('init', namespace, { origin: 'https://app.cal.com' });
      cal.ns?.[namespace]?.('inline', {
        elementOrSelector: target,
        calLink,
        config: { layout: 'month_view' },
      });
      cal.ns?.[namespace]?.('ui', {
        theme: 'light',
        layout: 'month_view',
        cssVarsPerTheme: { light: { 'cal-brand': '#376e67' } },
      });
    }, 0);
    return () => {
      window.clearTimeout(timer);
      target.replaceChildren();
    };
  }, [url, reactId]);

  return <div ref={element} className="min-h-[720px] w-full bg-white sm:min-h-[760px]" aria-label="Available meeting dates and times" />;
}

function CalendlyInlineBooking({ url }: { url: string }) {
  const element = useRef<HTMLDivElement>(null);
  const initialize = () => {
    const target = element.current;
    const calendly = (window as BookingWindow).Calendly;
    if (!target || !calendly || target.dataset.initialized === 'yes') return;
    target.dataset.initialized = 'yes';
    calendly.initInlineWidget({ url, parentElement: target, resize: true });
  };

  return <>
    <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" onReady={initialize} />
    <div ref={element} className="min-h-[740px] w-full bg-white sm:min-h-[780px]" aria-label="Available meeting dates and times" />
  </>;
}

/** Both providers show live availability and confirm bookings entirely inline. */
export function BookingEmbed({ url }: { url: string }) {
  return url.includes('calendly.com/')
    ? <CalendlyInlineBooking url={url} />
    : <CalInlineBooking url={url} />;
}
