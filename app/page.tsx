import { getTickets } from '../lib/actions';
import DashboardClient from '../components/DashboardClient';
import { MOCK_TICKETS } from '../lib/mock';

// Force dynamic rendering since we are fetching data
export const dynamic = 'force-dynamic';

export default async function Home() {
  let initialTickets = MOCK_TICKETS;
  let usingMock = true;

  try {
    // Attempt to fetch from DB. This will fail if Supabase is not configured yet.
    // We pass true to fetch all tickets (including closed), because the client handles filtering.
    const dbTickets = await getTickets(true); 
    if (dbTickets && dbTickets.length > 0) {
      initialTickets = dbTickets;
      usingMock = false;
    }
  } catch (error) {
    console.log("Supabase not configured or error fetching, falling back to mock data.");
  }

  return (
    <div>
      {usingMock && (
        <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 text-sm flex items-center justify-between">
          <span>
            <strong>Note:</strong> You are currently viewing mock data. To view real data, configure your Supabase URL and Anon Key in your environment variables, and run the provided SQL schema.
          </span>
        </div>
      )}
      <DashboardClient initialTickets={initialTickets} />
    </div>
  );
}
