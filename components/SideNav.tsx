'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutUser } from '../lib/auth-actions';

export default function SideNav({ user }: { user?: any }) {
  const pathname = usePathname();

  const getLinkClass = (path: string, exact = false) => {
    const isActive = exact ? pathname === path : pathname.startsWith(path);
    return isActive
      ? "bg-secondary-container text-on-secondary-container rounded-lg font-bold flex items-center gap-3 px-4 py-2.5 transition-all duration-200"
      : "text-on-surface-variant hover:bg-surface-container-high rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200";
  };

  return (
    <nav className="bg-surface-container-low text-on-surface-variant w-64 hidden lg:flex flex-col border-r border-outline-variant p-4 gap-2 shrink-0 z-40">
      <div className="flex items-center gap-3 mb-6 px-2 pt-2">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm">
          <span className="material-symbols-outlined text-[24px]">dashboard</span>
        </div>
        <div>
          <div className="text-lg font-bold text-on-surface leading-tight tracking-tight">PanelService</div>
        </div>
      </div>
      
      {user?.role !== 'Observer' && (
        <Link 
          href="/ticket/new"
          className="bg-primary text-on-primary font-semibold text-sm px-4 py-2.5 rounded-lg flex items-center justify-center gap-1 hover:bg-primary/90 transition-colors w-full mb-4"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create Ticket
        </Link>
      )}

      <div className="flex-1 flex flex-col gap-1">
        <Link href="/" className={getLinkClass('/', true)}>
          <span className="material-symbols-outlined text-[20px]">dashboard</span>
          <span>Tickets</span>
        </Link>
        <a href="#" className="text-on-surface-variant hover:bg-surface-container-high rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200">
          <span className="material-symbols-outlined text-[20px]">assessment</span>
          <span>Reports</span>
        </a>
        {user?.role === 'Admin' && (
          <Link href="/users" className={getLinkClass('/users')}>
            <span className="material-symbols-outlined text-[20px]">group</span>
            <span>Users</span>
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-1 mt-auto pt-4 border-t border-outline-variant">
        {user && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-sm shrink-0">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-on-surface truncate">{user.fullName || 'Unknown User'}</div>
              <div className="text-xs text-on-surface-variant truncate">{user.email}</div>
            </div>
          </div>
        )}
        <form action={logoutUser}>
          <button type="submit" className="w-full text-on-surface-variant hover:bg-error-container hover:text-on-error-container rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Logout</span>
          </button>
        </form>
      </div>
    </nav>
  );
}
