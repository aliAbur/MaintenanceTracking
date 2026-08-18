import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import SideNav from '../components/SideNav';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

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
    <html lang="en" data-theme="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} bg-background text-on-surface font-sans antialiased h-screen flex flex-col overflow-hidden`}>
        
        <div className="flex flex-1 overflow-hidden">
          {/* SideNavBar (Desktop Only) */}
          <SideNav />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-surface-container-lowest relative p-4 md:p-6 lg:p-8">
            <div className="max-w-[1280px] mx-auto">
              {children}
            </div>
          </main>
        </div>
        
      </body>
    </html>
  );
}
