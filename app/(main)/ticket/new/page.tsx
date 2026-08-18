import TicketForm from '../../../../components/TicketForm';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export default async function NewTicketPage() {
  const users = await prisma.userProfile.findMany({
    orderBy: { fullName: 'asc' }
  });

  return <TicketForm users={users} />;
}
