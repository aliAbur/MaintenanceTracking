'use client';

import { useTransition, useState } from 'react';
import { deleteUser } from '../lib/actions';
import { useTransitionRouter } from 'next-view-transitions';
import CustomConfirm from './CustomConfirm';
import toast from 'react-hot-toast';

export default function DeleteUserButton({ userId, userEmail, currentEmail }: { userId: string, userEmail: string, currentEmail: string }) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useTransitionRouter();

  if (userEmail === currentEmail || userEmail === 'system@panelservice.app') {
    return null; // Cannot delete yourself or the system user
  }

  const executeDelete = () => {
    setShowConfirm(false);
    startTransition(async () => {
      try {
        await deleteUser(userId);
        toast.success('User deleted successfully');
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete user');
      }
    });
  };

  return (
    <>
      <CustomConfirm
        isOpen={showConfirm}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        onConfirm={executeDelete}
        onCancel={() => setShowConfirm(false)}
      />
      <button 
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        className="w-10 h-10 rounded-full flex items-center justify-center text-error hover:bg-error-container hover:text-on-error-container transition-colors disabled:opacity-50"
        title="Delete User"
      >
        <span className="material-symbols-outlined text-[20px]">
          {isPending ? 'pending' : 'delete'}
        </span>
      </button>
    </>
  );
}
