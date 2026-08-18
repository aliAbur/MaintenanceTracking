import TicketForm from '../../../../components/TicketForm';
import { prisma } from '../../../../lib/prisma';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  const [users, ticket] = await Promise.all([
    prisma.userProfile.findMany({ orderBy: { fullName: 'asc' } }),
    prisma.ticket.findUnique({ where: { id: resolvedParams.id } })
  ]);

  if (!ticket) {
    notFound();
  }

  return <TicketForm users={users} initialData={ticket} />;
}
