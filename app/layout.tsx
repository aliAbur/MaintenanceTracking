import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

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
    <html lang="en">
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
          <nav className="bg-surface-container-low text-on-surface-variant w-64 hidden lg:flex flex-col border-r border-outline-variant p-4 gap-2 shrink-0 z-40">
            <div className="flex items-center gap-3 mb-6 px-2 pt-2">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined text-[24px]">shield_person</span>
              </div>
              <div>
                <div className="text-base font-bold text-primary leading-tight">PanelService</div>
                <div className="text-xs text-on-surface-variant">Maintenance Admin</div>
              </div>
            </div>
            
            <Link 
              href="/ticket/new"
              className="bg-primary text-on-primary font-semibold text-sm px-4 py-2.5 rounded-lg flex items-center justify-center gap-1 hover:bg-primary/90 transition-colors w-full mb-4"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create Ticket
            </Link>

            <div className="flex-1 flex flex-col gap-1">
              <Link href="/" className="bg-secondary-container text-on-secondary-container rounded-lg font-bold flex items-center gap-3 px-4 py-2.5 transition-all duration-200">
                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                <span>Tickets</span>
              </Link>
              <a href="#" className="text-on-surface-variant hover:bg-surface-container-high rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200">
                <span className="material-symbols-outlined text-[20px]">assessment</span>
                <span>Reports</span>
              </a>
              <Link href="/users" className="text-on-surface-variant hover:bg-surface-container-high rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200">
                <span className="material-symbols-outlined text-[20px]">group</span>
                <span>Users</span>
              </Link>
            </div>

            <div className="flex flex-col gap-1 mt-auto pt-4 border-t border-outline-variant">
              <a href="#" className="text-on-surface-variant hover:bg-surface-container-high rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200">
                <span className="material-symbols-outlined text-[20px]">settings</span>
                <span>Settings</span>
              </a>
              <a href="#" className="text-on-surface-variant hover:bg-surface-container-high rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200">
                <span className="material-symbols-outlined text-[20px]">help</span>
                <span>Support</span>
              </a>
            </div>
          </nav>

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
