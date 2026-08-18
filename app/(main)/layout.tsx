import SideNav from '../../components/SideNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 overflow-hidden h-full">
      {/* SideNavBar (Desktop Only) */}
      <SideNav />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-surface-container-lowest relative p-4 md:p-6 lg:p-8">
        <div className="max-w-[1280px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
