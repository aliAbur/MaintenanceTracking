'use client';

import { useState, useMemo } from 'react';
import { Ticket } from '../types';
import Link from 'next/link';
import { format } from 'date-fns';

interface DashboardClientProps {
  initialTickets: Ticket[];
}

export default function DashboardClient({ initialTickets }: DashboardClientProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showClosed, setShowClosed] = useState(false);

  // Filter and sort tickets
  const filteredTickets = useMemo(() => {
    return tickets
      .filter(t => {
        const matchesSearch = 
          t.customerName.toLowerCase().includes(search.toLowerCase()) || 
          (t.customerPhone && t.customerPhone.includes(search));
        
        const matchesStatus = statusFilter === 'All' ? true : t.status === statusFilter;
        const matchesClosed = showClosed ? true : t.status !== 'Closed';

        return matchesSearch && matchesStatus && matchesClosed;
      })
      .sort((a, b) => a.customerName.localeCompare(b.customerName));
  }, [tickets, search, statusFilter, showClosed]);

  const priorityColors = {
    Low: 'bg-rams-surface text-rams-text border-rams-border',
    Medium: 'bg-rams-warning/10 text-rams-warning border-rams-warning/20',
    High: 'bg-rams-danger/10 text-rams-danger border-rams-danger/20',
  };

  const formatStatus = (status: string) => status === 'OnHold' ? 'On-Hold' : status;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-rams-border pb-6">
        <div>
          <h1 className="text-3xl font-display text-rams-text tracking-tight">System Registry</h1>
          <p className="text-sm text-rams-text-muted mt-2 font-mono">Index of active maintenance requests.</p>
        </div>
        <Link 
          href="/ticket/new" 
          className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-mono font-medium tracking-widest text-rams-surface bg-rams-text hover:bg-rams-accent transition-colors rounded-[2px]"
        >
          [+] NEW RECORD
        </Link>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center p-4 bg-rams-surface border border-rams-border rounded-[4px]">
        <input
          type="text"
          placeholder="Query by customer name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[280px] bg-rams-bg border-rams-border rounded-[2px] text-sm font-mono placeholder:text-rams-text-muted focus:border-rams-text focus:ring-0"
        />
        <div className="w-px h-8 bg-rams-border hidden md:block"></div>
        <div className="flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto bg-rams-bg border-rams-border rounded-[2px] text-sm font-mono focus:border-rams-text focus:ring-0 cursor-pointer"
          >
            <option value="All">All States</option>
            <option value="Open">Open</option>
            <option value="Processing">Processing</option>
            <option value="OnHold">On-Hold</option>
            <option value="Closed">Closed</option>
          </select>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-rams-text-muted hover:text-rams-text transition-colors shrink-0">
            <input
              type="checkbox"
              checked={showClosed}
              onChange={(e) => setShowClosed(e.target.checked)}
              className="rounded-sm border-rams-border text-rams-text focus:ring-rams-text focus:ring-offset-0 w-4 h-4 cursor-pointer bg-rams-bg"
            />
            SHOW CLOSED
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <Link href={`/ticket/${ticket.id}`} key={ticket.id} className="group block">
              <article className="bg-rams-surface border border-rams-border p-6 rounded-[4px] h-full flex flex-col relative transition-all duration-300 hover:border-rams-text hover:shadow-rams">
                
                {/* Top Metdata */}
                <div className="flex justify-between items-start mb-6 border-b border-rams-border pb-4">
                  <div>
                    <h3 className="text-lg font-display text-rams-text mb-1 group-hover:text-rams-accent transition-colors">{ticket.customerName}</h3>
                    <p className="text-xs font-mono text-rams-text-muted">{ticket.customerPhone || 'UNLISTED'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-mono tracking-widest text-rams-text-muted uppercase">Status</span>
                    <span className="text-xs font-mono font-medium text-rams-text">
                      {formatStatus(ticket.status)}
                    </span>
                  </div>
                </div>
                
                {/* Body Content */}
                <div className="space-y-4 flex-1">
                  <div>
                    <p className="text-[10px] font-mono text-rams-text-muted uppercase tracking-widest mb-1">Hardware</p>
                    <p className="text-sm text-rams-text">{ticket.panelType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-rams-text-muted uppercase tracking-widest mb-1">Operator</p>
                    <p className="text-sm text-rams-text">
                      {ticket.assignee?.fullName || '—'}
                    </p>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="mt-8 pt-4 border-t border-rams-border flex items-center justify-between">
                  <span className={`px-2 py-0.5 border text-[10px] font-mono uppercase tracking-widest rounded-sm ${priorityColors[ticket.priority]}`}>
                    {ticket.priority} PR
                  </span>
                  <time className="text-[10px] font-mono text-rams-text-muted">
                    {format(new Date(ticket.createdAt), 'yyyy-MM-dd')}
                  </time>
                </div>
              </article>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-rams-surface border border-rams-border rounded-[4px]">
            <p className="text-sm font-mono text-rams-text-muted uppercase tracking-widest">0 Records Found</p>
            <button 
              onClick={() => {setSearch(''); setStatusFilter('All'); setShowClosed(true);}}
              className="mt-4 text-xs font-mono font-medium text-rams-text border-b border-rams-text pb-0.5 hover:text-rams-accent hover:border-rams-accent transition-colors"
            >
              RESET PARAMETERS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
