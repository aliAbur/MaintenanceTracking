import SideNav from '../../components/SideNav';
import { getSession } from '../../lib/auth';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      {/* SideNavBar (Desktop Only) */}
      <SideNav user={session?.user} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-surface-container-lowest relative p-4 md:p-6 lg:p-8">
        <div className="max-w-[1280px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
