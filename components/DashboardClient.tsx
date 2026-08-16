'use client';

import { useState, useMemo } from 'react';
import { Ticket } from '../types';
import Link from 'next/link';
import { Search, Plus, Filter, AlertCircle } from 'lucide-react';
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
    Low: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    High: 'bg-red-100 text-red-800 border-red-200',
  };

  const statusColors = {
    'Open': 'bg-blue-50 text-blue-700 ring-blue-600/20',
    'Processing': 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
    'OnHold': 'bg-amber-50 text-amber-700 ring-amber-600/20',
    'Closed': 'bg-gray-50 text-gray-600 ring-gray-500/10',
  };

  const formatStatus = (status: string) => status === 'OnHold' ? 'On-Hold' : status;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Tickets</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track panel maintenance requests.</p>
        </div>
        <Link 
          href="/ticket/new" 
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Ticket
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white min-w-[140px] cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Processing">Processing</option>
                <option value="OnHold">On-Hold</option>
                <option value="Closed">Closed</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={showClosed}
                onChange={(e) => setShowClosed(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
              />
              Show Closed
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <Link href={`/ticket/${ticket.id}`} key={ticket.id} className="group block">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-indigo-300 transition-all duration-200 h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{ticket.customerName}</h3>
                    <p className="text-sm text-gray-500">{ticket.customerPhone || 'No phone provided'}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${statusColors[ticket.status]}`}>
                    {formatStatus(ticket.status)}
                  </span>
                </div>
                
                <div className="space-y-3 flex-1">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Panel Type</p>
                    <p className="text-sm text-gray-900 mt-0.5">{ticket.panelType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Assignee</p>
                    <p className="text-sm text-gray-900 mt-0.5 flex items-center gap-2">
                      {ticket.assignee?.fullName || 'Unassigned'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${priorityColors[ticket.priority]}`}>
                    {ticket.priority} Priority
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-white rounded-xl border border-dashed border-gray-300">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No tickets found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm">
              We couldn't find any tickets matching your current filters. Try adjusting your search or create a new ticket.
            </p>
            <button 
              onClick={() => {setSearch(''); setStatusFilter('All'); setShowClosed(true);}}
              className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
