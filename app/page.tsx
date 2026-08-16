import { getTickets } from '../lib/actions';
import DashboardClient from '../components/DashboardClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const tickets = await getTickets(true); 

  return (
    <div>
      <DashboardClient initialTickets={tickets} />
    </div>
  );
}
