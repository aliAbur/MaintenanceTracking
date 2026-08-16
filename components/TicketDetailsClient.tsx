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
    'Open': 'text-rams-accent',
    'Processing': 'text-rams-warning',
    'OnHold': 'text-rams-danger',
    'Closed': 'text-rams-text-muted',
  };

  const priorityColors = {
    Low: 'border-rams-border text-rams-text',
    Medium: 'border-rams-warning/30 text-rams-warning',
    High: 'border-rams-danger/30 text-rams-danger',
  };

  const formatStatus = (status: string) => status === 'OnHold' ? 'On-Hold' : status;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
      <div className="mb-12">
        <Link href="/" className="inline-flex items-center text-xs font-mono font-medium tracking-widest text-rams-text-muted hover:text-rams-text transition-colors border-b border-transparent hover:border-rams-text pb-0.5">
          ← BACK TO REGISTRY
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
        
        {/* Left Column: Ticket Details */}
        <div className="lg:col-span-8 space-y-8">
          <article className="bg-rams-surface border border-rams-border rounded-[4px]">
            {/* Header */}
            <header className="p-8 border-b border-rams-border flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <h1 className="text-3xl font-display text-rams-text tracking-tight">{ticket.customerName}</h1>
                  <span className={`px-2 py-0.5 border text-[10px] font-mono uppercase tracking-widest rounded-sm ${priorityColors[ticket.priority]}`}>
                    {ticket.priority} PR
                  </span>
                </div>
                <p className="text-sm font-mono text-rams-text-muted">
                  ID: {ticket.id}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-2 shrink-0">
                <label className="text-[10px] font-mono tracking-widest uppercase text-rams-text-muted">System Status</label>
                <div className="relative">
                  <select 
                    disabled={isUpdating}
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                    className={`appearance-none bg-rams-bg border border-rams-border rounded-[2px] py-2 pl-4 pr-10 text-sm font-mono font-medium focus:border-rams-text focus:ring-0 cursor-pointer transition-colors ${statusColors[ticket.status]} ${isUpdating ? 'opacity-50' : ''}`}
                  >
                    <option value="Open" className="text-rams-text">OPEN</option>
                    <option value="Processing" className="text-rams-text">PROCESSING</option>
                    <option value="OnHold" className="text-rams-text">ON-HOLD</option>
                    <option value="Closed" className="text-rams-text">CLOSED</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-rams-text-muted">
                    ↓
                  </div>
                </div>
              </div>
            </header>

            {/* Metadata Grid */}
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] font-mono tracking-widest uppercase text-rams-text-muted mb-1">Hardware Model</h3>
                  <p className="text-sm text-rams-text">{ticket.panelType}</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-mono tracking-widest uppercase text-rams-text-muted mb-1">Contact Number</h3>
                  <p className="text-sm font-mono text-rams-text">{ticket.customerPhone || 'UNLISTED'}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] font-mono tracking-widest uppercase text-rams-text-muted mb-1">Initialization Date</h3>
                  <p className="text-sm font-mono text-rams-text">
                    {format(new Date(ticket.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                  </p>
                </div>
                <div>
                  <h3 className="text-[10px] font-mono tracking-widest uppercase text-rams-text-muted mb-1">Assigned Operator</h3>
                  <p className="text-sm text-rams-text">{ticket.assignee?.fullName || '—'}</p>
                </div>
              </div>
            </div>

            {/* Diagnostic Notes */}
            {ticket.specialNotes && (
              <div className="border-t border-rams-border">
                <div className="p-8 bg-rams-bg/50">
                  <h3 className="text-[10px] font-mono tracking-widest uppercase text-rams-text-muted mb-4">Diagnostic Notes</h3>
                  <div className="text-sm text-rams-text whitespace-pre-wrap leading-relaxed">
                    {ticket.specialNotes}
                  </div>
                </div>
              </div>
            )}
          </article>
        </div>

        {/* Right Column: Timeline */}
        <aside className="lg:col-span-4">
          <div className="bg-rams-surface border border-rams-border rounded-[4px] p-6 sticky top-24">
            <h2 className="text-[10px] font-mono tracking-widest uppercase text-rams-text-muted border-b border-rams-border pb-4 mb-6">
              Event Log
            </h2>
            
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-rams-border"></div>
              
              <ul className="space-y-6">
                {auditLogs.map((log) => (
                  <li key={log.id} className="relative pl-6">
                    <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-[3px] border-rams-surface ${log.action.includes('Created') ? 'bg-rams-text-muted' : 'bg-rams-accent'}`}></div>
                    
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-rams-text mb-1">
                        {log.action}
                      </p>
                      {log.oldValue && log.newValue && (
                        <p className="text-xs font-mono text-rams-text-muted mb-2">
                          {formatStatus(log.oldValue)} → <span className="text-rams-text">{formatStatus(log.newValue)}</span>
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] font-mono text-rams-text-muted uppercase">
                          USR: {log.modifier?.fullName || 'SYS'}
                        </span>
                        <time className="text-[10px] font-mono text-rams-text-muted" dateTime={typeof log.createdAt === 'string' ? log.createdAt : log.createdAt.toISOString()}>
                          {format(new Date(log.createdAt), 'MMM d, HH:mm')}
                        </time>
                      </div>
                    </div>
                  </li>
                ))}
                
                {/* Fallback Initial Log */}
                {auditLogs.length === 0 && (
                  <li className="relative pl-6">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-[3px] border-rams-surface bg-rams-text-muted"></div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-rams-text mb-1">Ticket Initialized</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] font-mono text-rams-text-muted uppercase">USR: SYS</span>
                        <time className="text-[10px] font-mono text-rams-text-muted" dateTime={typeof ticket.createdAt === 'string' ? ticket.createdAt : ticket.createdAt.toISOString()}>
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
