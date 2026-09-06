import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600'],
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'LennGram',
    template: '%s · LennGram',
  },
  description: 'A handmade project portfolio by lenn0109.',
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    siteName: 'LennGram',
    url: siteUrl,
    title: 'LennGram',
    description: 'A handmade project portfolio by lenn0109.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LennGram',
    description: 'A handmade project portfolio by lenn0109.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="bg-bg text-text font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
