import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Wrench } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Panel Maintenance Tracker',
  description: 'On-demand maintenance and service status tracking for interactive panels.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen text-gray-900`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-600">
              <Wrench className="w-6 h-6" />
              <span className="font-semibold text-lg tracking-tight">PanelService</span>
            </div>
            <div className="text-sm font-medium text-gray-500">
              {/* In a real app, show logged-in user here */}
              Logged in as Admin
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
