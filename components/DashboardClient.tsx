'use client';

import { useState, useMemo } from 'react';
import { Ticket } from '../types';
import Link from 'next/link';

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

  const formatStatus = (status: string) => status === 'OnHold' ? 'On-Hold' : status;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface p-4 rounded-xl shadow-sm border border-outline-variant/30">
        <div className="flex-1 w-full relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            type="text"
            placeholder="Search Customer Name or Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all text-on-surface placeholder:text-outline"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 pl-3 pr-8 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all text-on-surface cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Processing">Processing</option>
            <option value="OnHold">On-Hold</option>
            <option value="Closed">Closed</option>
          </select>
          
          <button className="h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm font-semibold text-secondary hover:bg-surface-container-low transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">sort</span>
            Sort
          </button>
          
          <label className="flex items-center gap-2 cursor-pointer ml-auto md:ml-2">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={showClosed}
                onChange={(e) => setShowClosed(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-surface-variant rounded-full peer peer-checked:bg-primary-container peer-focus:ring-2 peer-focus:ring-primary-container/20 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
            </div>
            <span className="text-sm font-medium text-on-surface-variant">Show Closed</span>
          </label>
        </div>
      </div>

      {/* Bento Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => {
            
            // Derive semantic styling for Priority chip
            let priorityBg = 'bg-surface-variant text-on-surface-variant';
            if (ticket.priority === 'High') priorityBg = 'bg-error-container text-on-error-container';
            if (ticket.priority === 'Medium') priorityBg = 'bg-tertiary-container text-on-tertiary-container';

            // Derive semantic styling for Status chip
            let statusBg = 'bg-surface-variant text-on-surface-variant';
            if (ticket.status === 'Open') statusBg = 'bg-primary-container text-on-primary-container';
            if (ticket.status === 'Processing') statusBg = 'bg-secondary-container text-on-secondary-container';
            if (ticket.status === 'OnHold') statusBg = 'bg-error-container text-on-error-container';

            return (
              <Link href={`/ticket/${ticket.id}`} key={ticket.id} className="group block h-full">
                <div className="bg-surface h-full rounded-xl shadow-sm border border-outline-variant/30 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  
                  <div className="flex justify-between items-start z-10">
                    <span className="font-mono text-sm text-secondary">#{ticket.id.substring(0, 8)}</span>
                    <span className={`${priorityBg} text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide`}>
                      {ticket.priority} Priority
                    </span>
                  </div>
                  
                  <div className="z-10 flex-1">
                    <h3 className="text-lg font-semibold text-on-surface mb-1 group-hover:text-primary transition-colors line-clamp-1">{ticket.customerName}</h3>
                    <p className="text-sm text-on-surface-variant mb-0.5">Phone: {ticket.customerPhone || 'Unlisted'}</p>
                    <p className="text-sm text-on-surface-variant line-clamp-1">Hardware: {ticket.panelType}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-outline-variant/50 z-10">
                    <span className={`${statusBg} text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide`}>
                      {formatStatus(ticket.status)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-on-surface-variant">
                        {ticket.assignee ? ticket.assignee.fullName : 'Unassigned'}
                      </span>
                      {ticket.assignee ? (
                        <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-[16px]">person</span>
                        </div>
                      ) : (
                        <span className="material-symbols-outlined text-[20px] text-outline">person_off</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-surface border border-outline-variant/30 rounded-xl">
            <span className="material-symbols-outlined text-4xl text-outline mb-4">search_off</span>
            <p className="text-base font-semibold text-on-surface-variant">0 Records Found</p>
            <button 
              onClick={() => {setSearch(''); setStatusFilter('All'); setShowClosed(true);}}
              className="mt-4 text-sm font-semibold text-primary hover:text-primary-container transition-colors"
            >
              Reset Parameters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
