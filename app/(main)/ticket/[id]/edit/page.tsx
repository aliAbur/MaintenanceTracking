import TicketForm from '../../../../../components/TicketForm';
import { prisma } from '../../../../../lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '../../../../../lib/auth';

export const dynamic = 'force-dynamic';

export default async function EditTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getSession();

  const [users, ticket] = await Promise.all([
    prisma.userProfile.findMany({ orderBy: { fullName: 'asc' } }),
    prisma.ticket.findUnique({ where: { id: resolvedParams.id } })
  ]);

  if (!ticket) {
    notFound();
  }

  const role = session?.user?.role || 'Admin';
  const userId = session?.user?.id;

  if (role === 'Observer') {
    redirect(`/ticket/${ticket.id}?error=unauthorized`);
  }

  const isOwner = ticket.createdBy === userId || ticket.assignedTo === userId;
  const canEditDetails = role === 'Admin' || (role === 'Employee' && isOwner);
  const canAssign = role === 'Admin';

  return <TicketForm users={users} initialData={ticket} canEditDetails={canEditDetails} canAssign={canAssign} />;
}
