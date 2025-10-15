import Providers from './providers';
import '@/index.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CanvaX',
  description: 'Create, verify, and mint authentic human-made art',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
