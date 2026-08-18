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
        
        {/* TopNavBar */}
        <header className="bg-surface text-primary border-b border-outline-variant shadow-sm flex justify-between items-center w-full px-6 h-16 shrink-0 z-50">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-primary tracking-tight">PanelService</Link>
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href="/ticket/new" 
              className="hidden sm:flex bg-primary-container text-on-primary-container font-semibold text-xs px-4 py-2 rounded-lg items-center gap-1 hover:bg-primary-container/90 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add New Maintenance
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </div>
              <span className="font-semibold text-sm text-on-surface hidden sm:inline-block">Admin</span>
            </div>
          </div>
        </header>

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
