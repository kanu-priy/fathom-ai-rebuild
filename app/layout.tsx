import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fathom AI — Never Take Meeting Notes Again',
  description: 'AI-powered meeting notetaker with multi-speaker transcripts, instant summaries, action items, and shareable clips.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="bg-[#0b0f19] text-gray-100 antialiased h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
