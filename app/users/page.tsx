import { prisma } from '../../lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const users = await prisma.userProfile.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-surface rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="px-6 py-6 border-b border-outline-variant/50 bg-surface-container-lowest flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">User Management</h1>
            <p className="text-sm text-on-surface-variant mt-1">Manage system operators and their access levels.</p>
          </div>
          <Link href="/users/new" className="hidden sm:flex bg-primary text-on-primary font-semibold text-sm px-4 py-2 rounded-lg items-center gap-1 hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Add User
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant/50">
                <th className="p-4 font-semibold text-sm uppercase tracking-wider">User</th>
                <th className="p-4 font-semibold text-sm uppercase tracking-wider">Role</th>
                <th className="p-4 font-semibold text-sm uppercase tracking-wider">Joined Date</th>
                <th className="p-4 font-semibold text-sm uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-surface-container-lowest transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-on-surface">{user.fullName || 'Unknown'}</div>
                        <div className="text-sm text-on-surface-variant">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-container text-on-primary-container">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-on-surface-variant font-mono">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/users/${user.id}/edit`} className="text-secondary hover:text-primary transition-colors p-2 rounded-lg hover:bg-surface-variant inline-block">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </Link>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-on-surface-variant">
                    No users found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
