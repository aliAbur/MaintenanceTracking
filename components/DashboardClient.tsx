'use client';

import { useState, useMemo } from 'react';
import { Ticket } from '../types';
import { Link } from 'next-view-transitions';
import CustomSelect from './CustomSelect';

interface DashboardClientProps {
  initialTickets: Ticket[];
}

export default function DashboardClient({ initialTickets }: DashboardClientProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showClosed, setShowClosed] = useState(false);
  const [sortOption, setSortOption] = useState<string>('createdAt_desc');

  // Filter and sort tickets
  const filteredTickets = useMemo(() => {
    return tickets
      .filter(t => {
        const matchesSearch = 
          t.id.toLowerCase().includes(search.toLowerCase()) ||
          t.customerName.toLowerCase().includes(search.toLowerCase()) || 
          (t.customerPhone && t.customerPhone.includes(search));
        
        const matchesStatus = statusFilter === 'All' ? true : t.status === statusFilter;
        const matchesClosed = showClosed ? true : t.status !== 'Closed';

        return matchesSearch && matchesStatus && matchesClosed;
      })
      .sort((a, b) => {
        if (sortOption === 'createdAt_desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortOption === 'createdAt_asc') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortOption === 'updatedAt_desc') {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        } else if (sortOption === 'status') {
          const statusOrder = { 'Open': 1, 'Processing': 2, 'OnHold': 3, 'Closed': 4 };
          if (statusOrder[a.status] === statusOrder[b.status]) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return statusOrder[a.status] - statusOrder[b.status];
        } else if (sortOption === 'assignment_asc') {
          const aName = a.assignee?.fullName || 'ZZZZZ';
          const bName = b.assignee?.fullName || 'ZZZZZ';
          return aName.localeCompare(bName);
        } else if (sortOption === 'assignment_desc') {
          const aName = a.assignee?.fullName || '';
          const bName = b.assignee?.fullName || '';
          return bName.localeCompare(aName);
        } else if (sortOption === 'client_asc') {
          return a.customerName.localeCompare(b.customerName);
        } else if (sortOption === 'client_desc') {
          return b.customerName.localeCompare(a.customerName);
        }
        return 0;
      });
  }, [tickets, search, statusFilter, showClosed, sortOption]);

  const formatStatus = (status: string) => status === 'OnHold' ? 'On-Hold' : status;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface p-4 rounded-xl shadow-sm border border-outline-variant/30">
        <div className="flex-1 w-full relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            type="text"
            placeholder="Search Ticket ID, Customer Name, or Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all text-on-surface placeholder:text-outline"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="w-40 h-10">
            <CustomSelect
              options={[
                { value: 'All', label: 'All Statuses' },
                { value: 'Open', label: 'Open' },
                { value: 'Processing', label: 'Processing' },
                { value: 'OnHold', label: 'On-Hold' },
                { value: 'Closed', label: 'Closed' }
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-full h-full bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus-within:border-primary-container focus-within:ring-2 focus-within:ring-primary-container/20 px-3 text-on-surface"
            />
          </div>
          
          <div className="w-48 h-10">
            <CustomSelect
              icon="sort"
              options={[
                { value: 'createdAt_desc', label: 'Newest First' },
                { value: 'createdAt_asc', label: 'Oldest First' },
                { value: 'updatedAt_desc', label: 'Recently Updated' },
                { value: 'status', label: 'Status' },
                { value: 'client_asc', label: 'Client (A-Z)' },
                { value: 'client_desc', label: 'Client (Z-A)' },
                { value: 'assignment_asc', label: 'Operator (A-Z)' },
                { value: 'assignment_desc', label: 'Operator (Z-A)' }
              ]}
              value={sortOption}
              onChange={setSortOption}
              className="w-full h-full bg-surface-container-lowest border border-outline-variant rounded-lg font-semibold text-sm focus-within:border-primary-container focus-within:ring-2 focus-within:ring-primary-container/20 px-3 text-on-surface"
            />
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer ml-auto md:ml-2">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={showClosed}
                onChange={(e) => setShowClosed(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-surface-variant peer-checked:bg-primary-container rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-container/20 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:bg-outline peer-checked:after:bg-on-primary-container after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
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
                    <span className="font-mono text-sm text-secondary">#{ticket.id.startsWith('NITM') ? ticket.id : ticket.id.substring(0, 8)}</span>
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
              onClick={() => {setSearch(''); setStatusFilter('All'); setShowClosed(true); setSortOption('createdAt_desc');}}
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
