import { getTicketById, getAuditLogsForTicket } from '../../../../lib/actions';
import TicketDetailsClient from '../../../../components/TicketDetailsClient';
import { notFound } from 'next/navigation';
import { getSession } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getSession();
  
  const ticket = await getTicketById(resolvedParams.id);
  if (!ticket) {
    notFound();
  }

  const auditLogs = await getAuditLogsForTicket(resolvedParams.id);

  return <TicketDetailsClient ticket={ticket} auditLogs={auditLogs || []} user={session?.user} />;
}
