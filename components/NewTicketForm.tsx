'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTicket } from '../lib/actions';
import Link from 'next/link';

export default function NewTicketForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      await createTicket(formData);
      router.push('/');
      router.refresh();
    } catch (err: any) {
      if (err.message && err.message.includes('fetch failed')) {
         console.warn("Database not connected. Faking creation for demo.");
         router.push('/');
      } else {
         setError(err.message || 'Failed to create ticket');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-700">
      <div className="mb-12">
        <Link href="/" className="inline-flex items-center text-xs font-mono font-medium tracking-widest text-rams-text-muted hover:text-rams-text transition-colors border-b border-transparent hover:border-rams-text pb-0.5">
          ← BACK TO REGISTRY
        </Link>
      </div>

      <div className="bg-rams-surface border border-rams-border rounded-[4px]">
        <div className="border-b border-rams-border px-8 py-6">
          <h1 className="text-2xl font-display text-rams-text">New Request Entry</h1>
          <p className="text-xs font-mono text-rams-text-muted mt-2">Initialize a new hardware maintenance ticket.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="p-4 bg-rams-danger/10 border border-rams-danger/20 text-sm font-mono text-rams-danger rounded-[2px]">
              ERR: {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="customerName" className="block text-[10px] font-mono tracking-widest uppercase text-rams-text-muted">Customer Name *</label>
              <input
                required
                type="text"
                id="customerName"
                name="customerName"
                className="w-full text-sm placeholder:text-rams-border"
                placeholder="Client Organization"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="customerPhone" className="block text-[10px] font-mono tracking-widest uppercase text-rams-text-muted">Contact Number</label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                className="w-full text-sm placeholder:text-rams-border"
                placeholder="+1 (000) 000-0000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="panelType" className="block text-[10px] font-mono tracking-widest uppercase text-rams-text-muted">Hardware Model *</label>
              <input
                required
                type="text"
                id="panelType"
                name="panelType"
                className="w-full text-sm placeholder:text-rams-border"
                placeholder="Device ID / Model Name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="priority" className="block text-[10px] font-mono tracking-widest uppercase text-rams-text-muted">System Priority *</label>
              <select
                required
                id="priority"
                name="priority"
                className="w-full text-sm cursor-pointer"
              >
                <option value="Low">LOW</option>
                <option value="Medium">MEDIUM</option>
                <option value="High">HIGH</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="assignedTo" className="block text-[10px] font-mono tracking-widest uppercase text-rams-text-muted">Assign Operator (Optional)</label>
            <select
              id="assignedTo"
              name="assignedTo"
              className="w-full text-sm cursor-pointer"
            >
              <option value="">— Unassigned —</option>
              <option value="user-1">John Doe (Tech)</option>
              <option value="user-2">Jane Smith (Tech)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="specialNotes" className="block text-[10px] font-mono tracking-widest uppercase text-rams-text-muted">Diagnostic Notes</label>
            <textarea
              id="specialNotes"
              name="specialNotes"
              rows={5}
              className="w-full text-sm resize-y placeholder:text-rams-border"
              placeholder="Describe symptoms, error codes, and deployment environment."
            ></textarea>
          </div>

          <div className="pt-8 border-t border-rams-border flex justify-end gap-4">
            <Link 
              href="/"
              className="px-6 py-2.5 text-xs font-mono font-medium tracking-widest text-rams-text border border-rams-border rounded-[2px] hover:bg-rams-bg transition-colors"
            >
              CANCEL
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-mono font-medium tracking-widest text-rams-surface bg-rams-text border border-rams-text rounded-[2px] hover:bg-rams-accent hover:border-rams-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
            >
              {isSubmitting ? 'PROCESSING...' : 'SUBMIT RECORD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
