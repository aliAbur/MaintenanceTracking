import { getTicketById, getAuditLogsForTicket } from '../../../../lib/actions';
import TicketDetailsClient from '../../../../components/TicketDetailsClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const ticket = await getTicketById(resolvedParams.id);
  if (!ticket) {
    notFound();
  }

  const auditLogs = await getAuditLogsForTicket(resolvedParams.id);

  return <TicketDetailsClient ticket={ticket} auditLogs={auditLogs || []} />;
}
