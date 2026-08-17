import NewTicketForm from '../../../components/NewTicketForm';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export default async function NewTicketPage() {
  const users = await prisma.userProfile.findMany({
    orderBy: { fullName: 'asc' }
  });

  return <NewTicketForm users={users} />;
}
