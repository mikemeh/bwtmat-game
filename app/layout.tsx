import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BWTmat Game',
  description: 'Fast-thinking color-coded speed board game. Calculate your seed total before time runs out!',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#060a14',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#060a14] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
