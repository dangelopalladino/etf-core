import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'etf-core scratch — v1.5 visual harness',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
