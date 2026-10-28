import type { Metadata } from 'next';
import { Fraunces, JetBrains_Mono } from 'next/font/google';
import Grain from '@/components/Grain';
import TopoBackground from '@/components/TopoBackground';
import UIProvider from '@/components/providers/UIProvider';
import { profile, siteMeta } from '@/data/portfolioData';
import './globals.css';

const display = Fraunces({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-fraunces', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

// Rendered from the site's own fonts and palette; regenerate if the headline changes.
const ogImage = { url: siteMeta.ogImage, width: 1200, height: 630, alt: `${profile.name}: ${profile.headline}` };

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: siteMeta.title,
  description: siteMeta.description,
  keywords: siteMeta.keywords,
  authors: [{ name: profile.name }],
  openGraph: {
    type: 'website',
    url: siteMeta.url,
    title: siteMeta.title,
    description: siteMeta.description,
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMeta.title,
    description: siteMeta.description,
    images: [ogImage],
  },
};

// Runs before first paint so dark-mode visitors never see a light flash.
const themeScript = `(() => {
  let dark = false;
  try {
    const saved = localStorage.getItem('theme');
    dark = saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {}
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-canvas font-mono text-ink antialiased selection:bg-ink selection:text-canvas">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas"
        >
          Skip to main content
        </a>
        <TopoBackground />
        <UIProvider>{children}</UIProvider>
        <Grain />
      </body>
    </html>
  );
}
