import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SRM Next.js App',
  description: 'Next.js app in the SRM monorepo'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
