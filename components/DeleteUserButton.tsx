'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteUser } from '../lib/actions';

export default function DeleteUserButton({ userId, userEmail, currentEmail }: { userId: string, userEmail: string, currentEmail: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (userEmail === currentEmail || userEmail === 'system@panelservice.app') {
    return null; // Cannot delete yourself or the system user
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      startTransition(async () => {
        await deleteUser(userId);
        router.refresh();
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="text-error hover:text-error/80 transition-colors p-2 rounded-lg hover:bg-error-container/20 inline-block disabled:opacity-50"
      title="Delete User"
    >
      <span className="material-symbols-outlined text-[20px]">{isPending ? 'hourglass_empty' : 'delete'}</span>
    </button>
  );
}
