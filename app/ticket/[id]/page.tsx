import { getTicketById, getAuditLogsForTicket } from '../../../lib/actions';
import TicketDetailsClient from '../../../components/TicketDetailsClient';
import { MOCK_TICKETS, MOCK_LOGS } from '../../../lib/mock';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let ticket = MOCK_TICKETS.find(t => t.id === resolvedParams.id);
  let auditLogs = MOCK_LOGS.filter(l => l.ticket_id === resolvedParams.id);

  try {
    const dbTicket = await getTicketById(resolvedParams.id);
    if (dbTicket) {
      ticket = dbTicket;
      const dbLogs = await getAuditLogsForTicket(resolvedParams.id);
      auditLogs = dbLogs || [];
    }
  } catch (error) {
    console.log("Supabase error or not configured, using mock fallback if available.");
  }

  if (!ticket) {
    notFound();
  }

  return <TicketDetailsClient ticket={ticket} auditLogs={auditLogs} />;
}
