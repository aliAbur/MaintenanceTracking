import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: 'PanelService | Utility',
  description: 'Functional tracking for interactive panels.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} bg-rams-bg min-h-screen text-rams-text antialiased`}>
        <header className="bg-rams-surface border-b border-rams-border sticky top-0 z-10 h-14 flex items-center">
          <div className="w-full max-w-6xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-rams-accent rounded-sm"></div>
              <span className="font-display font-medium text-sm tracking-wide uppercase text-rams-text">
                PanelService
              </span>
            </div>
            <div className="text-xs font-mono tracking-widest text-rams-text-muted uppercase">
              Admin Access
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
