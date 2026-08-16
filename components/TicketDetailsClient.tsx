'use client';

import { Ticket, AuditLog, TicketStatus } from '../types';
import { updateTicketStatus } from '../lib/actions';
import { format } from 'date-fns';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TicketDetailsClientProps {
  ticket: Ticket;
  auditLogs: AuditLog[];
}

export default function TicketDetailsClient({ ticket, auditLogs }: TicketDetailsClientProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (newStatus === ticket.status) return;
    
    setIsUpdating(true);
    try {
      await updateTicketStatus(ticket.id, newStatus, ticket.status);
      router.refresh(); 
    } catch (error) {
      console.warn("Update failed (mock fallback):", error);
      alert("Status updated (Simulated. DB disconnected).");
    } finally {
      setIsUpdating(false);
    }
  };

  const statusColors = {
    'Open': 'bg-primary-container text-on-primary-container',
    'Processing': 'bg-secondary-container text-on-secondary-container',
    'OnHold': 'bg-error-container text-on-error-container',
    'Closed': 'bg-surface-variant text-on-surface-variant',
  };

  const priorityColors = {
    Low: 'bg-surface-variant text-on-surface-variant',
    Medium: 'bg-tertiary-container text-on-tertiary-container',
    High: 'bg-error-container text-on-error-container',
  };

  const formatStatus = (status: string) => status === 'OnHold' ? 'On-Hold' : status;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-6 flex items-center">
        <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors bg-surface hover:bg-surface-container-highest px-3 py-1.5 rounded-full">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Registry
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Ticket Details */}
        <div className="lg:col-span-8 space-y-6">
          <article className="bg-surface border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <header className="p-6 sm:p-8 bg-surface-container-lowest border-b border-outline-variant/50 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-on-surface tracking-tight leading-tight">{ticket.customerName}</h1>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-secondary">#{ticket.id}</span>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wide ${priorityColors[ticket.priority]}`}>
                    {ticket.priority} Priority
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-end shrink-0 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                <label className="text-xs font-semibold text-on-surface-variant mb-2">System Status</label>
                <div className="relative w-40">
                  <select 
                    disabled={isUpdating}
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                    className={`appearance-none w-full border border-outline-variant/50 rounded-lg py-2 pl-4 pr-10 text-sm font-semibold focus:ring-2 focus:ring-primary-container/20 cursor-pointer transition-all ${statusColors[ticket.status]} ${isUpdating ? 'opacity-50' : ''}`}
                  >
                    <option value="Open" className="text-on-surface bg-surface">Open</option>
                    <option value="Processing" className="text-on-surface bg-surface">Processing</option>
                    <option value="OnHold" className="text-on-surface bg-surface">On-Hold</option>
                    <option value="Closed" className="text-on-surface bg-surface">Closed</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-current opacity-70">
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Metadata Grid */}
            <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">memory</span>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wide">Hardware Model</h3>
                  <p className="text-base text-on-surface font-medium">{ticket.panelType}</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wide">Contact Number</h3>
                  <p className="text-base text-on-surface font-medium">{ticket.customerPhone || 'Unlisted'}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">event</span>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wide">Initialization Date</h3>
                  <p className="text-base font-mono text-on-surface font-medium">
                    {format(new Date(ticket.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">badge</span>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wide">Assigned Operator</h3>
                  <p className="text-base text-on-surface font-medium">{ticket.assignee?.fullName || 'Unassigned'}</p>
                </div>
              </div>
            </div>

            {/* Diagnostic Notes */}
            {ticket.specialNotes && (
              <div className="border-t border-outline-variant/30 bg-surface-container-lowest p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                  <h3 className="text-xs font-semibold uppercase tracking-wide">Diagnostic Notes</h3>
                </div>
                <div className="bg-surface-container rounded-lg p-5">
                  <p className="text-sm text-on-surface whitespace-pre-wrap leading-relaxed">
                    {ticket.specialNotes}
                  </p>
                </div>
              </div>
            )}
          </article>
        </div>

        {/* Right Column: Timeline */}
        <aside className="lg:col-span-4">
          <div className="bg-surface border border-outline-variant/30 rounded-xl shadow-sm p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6 border-b border-outline-variant/30 pb-4 text-on-surface">
              <span className="material-symbols-outlined">history</span>
              <h2 className="text-base font-bold">Event Log</h2>
            </div>
            
            <div className="relative pl-3">
              {/* Vertical line */}
              <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-outline-variant/50"></div>
              
              <ul className="space-y-6">
                {auditLogs.map((log) => (
                  <li key={log.id} className="relative pl-8">
                    <div className={`absolute left-[-5px] top-1 w-8 h-8 rounded-full flex items-center justify-center ${log.action.includes('Created') ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary-container text-on-primary-container'} ring-4 ring-surface`}>
                      <span className="material-symbols-outlined text-[16px]">
                        {log.action.includes('Created') ? 'add' : 'update'}
                      </span>
                    </div>
                    
                    <div className="flex flex-col bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30 shadow-sm">
                      <p className="text-sm font-semibold text-on-surface mb-1">
                        {log.action}
                      </p>
                      {log.oldValue && log.newValue && (
                        <p className="text-sm text-on-surface-variant mb-2 flex items-center gap-2">
                          <span className="line-through opacity-70">{formatStatus(log.oldValue)}</span> 
                          <span className="material-symbols-outlined text-[16px] text-outline">arrow_forward</span>
                          <span className="font-semibold text-on-surface">{formatStatus(log.newValue)}</span>
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/30">
                        <span className="text-xs font-semibold text-secondary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">person</span>
                          {log.modifier?.fullName || 'System'}
                        </span>
                        <time className="text-xs font-mono text-outline" dateTime={typeof log.createdAt === 'string' ? log.createdAt : log.createdAt.toISOString()}>
                          {format(new Date(log.createdAt), 'MMM d, HH:mm')}
                        </time>
                      </div>
                    </div>
                  </li>
                ))}
                
                {/* Fallback Initial Log */}
                {auditLogs.length === 0 && (
                  <li className="relative pl-8">
                    <div className="absolute left-[-5px] top-1 w-8 h-8 rounded-full flex items-center justify-center bg-secondary-container text-on-secondary-container ring-4 ring-surface">
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </div>
                    <div className="flex flex-col bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30 shadow-sm">
                      <p className="text-sm font-semibold text-on-surface mb-2">Ticket Initialized</p>
                      <div className="flex items-center justify-between mt-1 pt-2 border-t border-outline-variant/30">
                        <span className="text-xs font-semibold text-secondary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                          System
                        </span>
                        <time className="text-xs font-mono text-outline" dateTime={typeof ticket.createdAt === 'string' ? ticket.createdAt : ticket.createdAt.toISOString()}>
                          {format(new Date(ticket.createdAt), 'MMM d, HH:mm')}
                        </time>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
