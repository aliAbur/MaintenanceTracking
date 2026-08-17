'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTicket } from '../lib/actions';
import Link from 'next/link';

import { UserProfile, Ticket } from '@prisma/client';
import { updateTicketInfo } from '../lib/actions';

export default function TicketForm({ users, initialData }: { users: UserProfile[], initialData?: Ticket }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      if (isEditing) {
        await updateTicketInfo(initialData.id, formData);
        router.push(`/ticket/${initialData.id}`);
      } else {
        await createTicket(formData);
        router.push('/');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} ticket`);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClasses = "w-full h-12 px-4 bg-surface-container-highest border border-outline-variant rounded-t-md border-b-2 border-b-outline focus:border-b-primary focus:bg-surface-container-lowest focus:outline-none transition-colors text-on-surface placeholder:text-outline";

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="mb-6 flex items-center">
        <Link href={isEditing ? `/ticket/${initialData.id}` : "/"} className="inline-flex items-center gap-1 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors bg-surface hover:bg-surface-container-highest px-3 py-1.5 rounded-full">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </Link>
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="px-8 py-6 border-b border-outline-variant/50 bg-surface-container-lowest">
          <h1 className="text-2xl font-bold text-on-surface">{isEditing ? 'Edit Ticket' : 'New Request Entry'}</h1>
          <p className="text-sm text-on-surface-variant mt-1">{isEditing ? 'Update hardware maintenance ticket information.' : 'Initialize a new hardware maintenance ticket.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="p-4 bg-error-container text-sm font-semibold text-on-error-container rounded-lg flex items-start gap-3">
              <span className="material-symbols-outlined mt-0.5">error</span>
              <div>{error}</div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="relative">
              <label htmlFor="customerName" className="block text-xs font-semibold text-on-surface-variant mb-1">Client Organization *</label>
              <input
                required
                type="text"
                id="customerName"
                name="customerName"
                defaultValue={initialData?.customerName}
                className={inputClasses}
                placeholder="e.g. Acme Corp"
              />
            </div>
            <div className="relative">
              <label htmlFor="customerPhone" className="block text-xs font-semibold text-on-surface-variant mb-1">Contact Number</label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                defaultValue={initialData?.customerPhone || ''}
                className={inputClasses}
                placeholder="+1 (000) 000-0000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="relative">
              <label htmlFor="panelType" className="block text-xs font-semibold text-on-surface-variant mb-1">Hardware Model *</label>
              <input
                required
                type="text"
                id="panelType"
                name="panelType"
                defaultValue={initialData?.panelType}
                className={inputClasses}
                placeholder="Device ID / Model Name"
              />
            </div>
            <div className="relative">
              <label htmlFor="priority" className="block text-xs font-semibold text-on-surface-variant mb-1">System Priority *</label>
              <select
                required
                id="priority"
                name="priority"
                defaultValue={initialData?.priority || 'Low'}
                className={`${inputClasses} cursor-pointer appearance-none`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 bottom-3 text-outline pointer-events-none">expand_more</span>
            </div>
          </div>

          <div className="relative">
            <label htmlFor="assignedTo" className="block text-xs font-semibold text-on-surface-variant mb-1">Assign Operator (Optional)</label>
            <select
              id="assignedTo"
              name="assignedTo"
              defaultValue={initialData?.assignedTo || ''}
              className={`${inputClasses} cursor-pointer appearance-none`}
            >
              <option value="">— Unassigned —</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.fullName || user.email} ({user.role})
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 bottom-3 text-outline pointer-events-none">expand_more</span>
          </div>

          <div className="relative">
            <label htmlFor="specialNotes" className="block text-xs font-semibold text-on-surface-variant mb-1">Diagnostic Notes</label>
            <textarea
              id="specialNotes"
              name="specialNotes"
              rows={4}
              defaultValue={initialData?.specialNotes || ''}
              className={`${inputClasses} h-auto py-3 resize-y`}
              placeholder="Describe symptoms, error codes, and deployment environment."
            ></textarea>
          </div>

          <div className="pt-6 border-t border-outline-variant flex justify-end gap-3">
            <Link 
              href={isEditing ? `/ticket/${initialData?.id}` : "/"}
              className="px-6 py-2.5 text-sm font-semibold text-primary rounded-full hover:bg-primary/10 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-semibold text-on-primary bg-primary rounded-full hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  {isEditing ? 'Updating...' : 'Processing...'}
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  {isEditing ? 'Save Changes' : 'Submit Record'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
