import TicketForm from '../../../../components/TicketForm';
import { prisma } from '../../../../lib/prisma';
import { getSession } from '../../../../lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function NewTicketPage() {
  const session = await getSession();
  const role = session?.user?.role || 'Admin';

  if (role === 'Observer') {
    redirect('/?error=unauthorized');
  }

  const users = await prisma.userProfile.findMany({
    orderBy: { fullName: 'asc' }
  });

  const canAssign = role === 'Admin';

  return <TicketForm users={users} canAssign={canAssign} />;
}
