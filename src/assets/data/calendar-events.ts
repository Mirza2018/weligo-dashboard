export type CalendarEvent = {
  id: string;
  title: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  /** Start hour 0-23 */
  startHour: number;
  /** End hour 0-23 (exclusive) */
  endHour: number;
  color: "yellow" | "green" | "blue" | "pink" | "violet";
};

function isoOffset(daysFromMonday: number, weekStart: Date): string {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + daysFromMonday);
  return d.toISOString().slice(0, 10);
}

// Generate events relative to the current week so they're visible today.
function getMonday(d: Date) {
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  const m = new Date(d);
  m.setDate(d.getDate() + diff);
  m.setHours(0, 0, 0, 0);
  return m;
}

const monday = getMonday(new Date());

export const initialCalendarEvents: CalendarEvent[] = [
  {
    id: "ev-1",
    title: "Tutoring · Nina",
    date: isoOffset(1, monday),
    startHour: 10,
    endHour: 12,
    color: "yellow",
  },
  {
    id: "ev-2",
    title: "Childcare · Simon",
    date: isoOffset(3, monday),
    startHour: 10,
    endHour: 12,
    color: "green",
  },
  {
    id: "ev-3",
    title: "Tutoring · Anna",
    date: isoOffset(2, monday),
    startHour: 14,
    endHour: 16,
    color: "blue",
  },
];

export const eventColors: Record<CalendarEvent["color"], string> = {
  yellow: "bg-yellow-200 border-yellow-300 text-yellow-900",
  green: "bg-emerald-200 border-emerald-300 text-emerald-900",
  blue: "bg-sky-200 border-sky-300 text-sky-900",
  pink: "bg-pink-200 border-pink-300 text-pink-900",
  violet: "bg-violet-200 border-violet-300 text-violet-900",
};
