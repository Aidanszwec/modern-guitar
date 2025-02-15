import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LayoutClient from './layout-client';

export const metadata: Metadata = {
  title: 'Modern Guitar',
  description: 'Your guitar learning journey starts here',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=0.75, maximum-scale=2, viewport-fit=cover" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
