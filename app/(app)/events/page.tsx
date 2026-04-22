import EventCard from '@/components/events/EventCard';
import { CalendarDays } from 'lucide-react';

interface TicketCategory {
  id: number;
  name: string;
  price: number;
  benefits: string | null;
  capacity: number | null;
  reserved: number;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string | null;
  location: string | null;
  capacity: number | null;
  flyerUrl: string | null;
  ticketCategories: TicketCategory[];
  reservationsCount: number;
}

async function getEvents(): Promise<Event[]> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const res = await fetch(`${base}/api/events`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.events ?? [];
  } catch {
    return [];
  }
}

function groupByMonth(events: Event[]): Map<string, Event[]> {
  const map = new Map<string, Event[]>();
  for (const ev of events) {
    const key = new Date(ev.date).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
    const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
    if (!map.has(capitalized)) map.set(capitalized, []);
    map.get(capitalized)!.push(ev);
  }
  return map;
}

export default async function EventsPage() {
  const events = await getEvents();

  const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const grouped = groupByMonth(sorted);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Eventos</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Calendario de actividades de la comunidad</p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No hay eventos próximos</p>
          <p className="text-sm mt-1">Volvé pronto para ver nuevas actividades.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Array.from(grouped.entries()).map(([month, monthEvents]) => (
            <section key={month}>
              <div className="flex items-center gap-3 mb-4">
                <CalendarDays className="w-4 h-4 text-green-600 dark:text-green-400" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{month}</h2>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {monthEvents.map((ev) => (
                  <EventCard
                    key={ev.id}
                    id={ev.id}
                    title={ev.title}
                    date={ev.date}
                    time={ev.time}
                    location={ev.location}
                    capacity={ev.capacity}
                    flyerUrl={ev.flyerUrl}
                    ticketCategories={ev.ticketCategories}
                    reservationsCount={ev.reservationsCount}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
