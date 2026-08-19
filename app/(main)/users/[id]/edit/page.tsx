import UserForm from '../../../../../components/UserForm';
import { prisma } from '../../../../../lib/prisma';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const { getSession } = await import('../../../../../lib/auth');
  const session = await getSession();
  if (session?.user?.role !== 'Admin') {
    const { redirect } = await import('next/navigation');
    redirect('/?error=unauthorized');
  }
  
  const user = await prisma.userProfile.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!user) {
    notFound();
  }

  return <UserForm initialData={user} />;
}
