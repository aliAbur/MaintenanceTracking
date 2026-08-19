import UserForm from '../../../../components/UserForm';
import { getSession } from '../../../../lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function NewUserPage() {
  const session = await getSession();
  if (session?.user?.role !== 'Admin') {
    redirect('/?error=unauthorized');
  }

  return <UserForm />;
}
