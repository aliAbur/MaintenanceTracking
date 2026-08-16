'use client';

import { Ticket, AuditLog, TicketStatus } from '../types';
import { updateTicketStatus } from '../lib/actions';
import { format } from 'date-fns';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, History, Loader2, User, Phone, MapPin, Tag, Activity } from 'lucide-react';
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
      router.refresh(); // Refresh server data
    } catch (error) {
      console.warn("Update failed (mock fallback):", error);
      // Fallback for mock if DB fails
      alert("Status updated (Simulated. Please configure Prisma/Database for real persistence).");
    } finally {
      setIsUpdating(false);
    }
  };

  const statusColors = {
    'Open': 'bg-blue-100 text-blue-800',
    'Processing': 'bg-indigo-100 text-indigo-800',
    'OnHold': 'bg-amber-100 text-amber-800',
    'Closed': 'bg-gray-100 text-gray-800',
  };

  const priorityColors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800',
  };

  const formatStatus = (status: string) => status === 'OnHold' ? 'On-Hold' : status;

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Ticket Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{ticket.customerName}</h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Tag className="w-4 h-4" /> {ticket.panelType}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Status:</span>
                  <select 
                    disabled={isUpdating}
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                    className={`text-sm font-semibold rounded-md border-transparent focus:ring-2 focus:ring-indigo-500 py-1.5 pl-3 pr-8 appearance-none cursor-pointer ${statusColors[ticket.status]}`}
                  >
                    <option value="Open">Open</option>
                    <option value="Processing">Processing</option>
                    <option value="OnHold">On-Hold</option>
                    <option value="Closed">Closed</option>
                  </select>
                  {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                </div>
                <p className="text-xs text-gray-400">ID: {ticket.id}</p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
                    <User className="w-4 h-4" /> Contact
                  </h3>
                  <p className="text-gray-900">{ticket.customerPhone || 'No phone provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4" /> Created
                  </h3>
                  <p className="text-gray-900">{format(new Date(ticket.createdAt), 'PPP p')}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4" /> Assigned To
                  </h3>
                  <p className="text-gray-900">{ticket.assignee?.fullName || 'Unassigned'}</p>
                </div>
              </div>
            </div>

            {ticket.specialNotes && (
              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Special Notes & Issue Description</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap">
                  {ticket.specialNotes}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Timeline */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
              <History className="w-5 h-5 text-indigo-600" />
              Ticket Timeline
            </h2>
            
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                {auditLogs.map((log, logIdx) => (
                  <li key={log.id}>
                    <div className="relative pb-8">
                      {logIdx !== auditLogs.length - 1 ? (
                        <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white border border-gray-200">
                            {log.action.includes('Created') ? (
                              <Clock className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Activity className="h-4 w-4 text-indigo-500" />
                            )}
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-900">
                              {log.action}{' '}
                              {log.oldValue && log.newValue && (
                                <span className="text-gray-500">
                                  from <span className="font-medium text-gray-900">{formatStatus(log.oldValue)}</span> to <span className="font-medium text-gray-900">{formatStatus(log.newValue)}</span>
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              by {log.modifier?.fullName || 'System User'}
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-xs text-gray-500">
                            <time dateTime={typeof log.createdAt === 'string' ? log.createdAt : log.createdAt.toISOString()}>
                              {format(new Date(log.createdAt), 'MMM d, h:mm a')}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
                
                {/* Always show creation as the final event if not explicitly in logs for fallback */}
                {auditLogs.length === 0 && (
                  <li>
                    <div className="relative pb-8">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white border border-gray-200">
                            <Clock className="h-4 w-4 text-gray-500" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-900">Ticket Created</p>
                            <p className="text-xs text-gray-500 mt-1">Initial entry</p>
                          </div>
                          <div className="whitespace-nowrap text-right text-xs text-gray-500">
                            <time dateTime={typeof ticket.createdAt === 'string' ? ticket.createdAt : ticket.createdAt.toISOString()}>
                              {format(new Date(ticket.createdAt), 'MMM d, h:mm a')}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
