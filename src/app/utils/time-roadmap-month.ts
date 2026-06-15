import {
  differenceInCalendarDays,
  format,
  parseISO,
  startOfDay,
} from "date-fns";
import roadmap2026 from "../data/2026.json";
import type { RoadmapDatasetEvent } from "../types/time-roadmap";

export function getMonthlyEvents(month: Date): RoadmapDatasetEvent[] {
  const monthKey = format(month, "yyyy-MM");
  return (roadmap2026.events as RoadmapDatasetEvent[])
    .filter((event) => event.date.startsWith(monthKey))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getFirstMonthlyEvent(
  month: Date,
): RoadmapDatasetEvent | undefined {
  return getMonthlyEvents(month)[0];
}

export function isCurrentMonth(month: Date): boolean {
  const today = new Date();
  return format(month, "yyyy-MM") === format(today, "yyyy-MM");
}

/** Current month: nearest upcoming event (or last event if all passed). Other months: first event. */
export function getDefaultMonthlyEvent(
  month: Date,
  from: Date = startOfDay(new Date()),
): RoadmapDatasetEvent | undefined {
  const monthly = getMonthlyEvents(month);
  if (monthly.length === 0) return undefined;

  if (!isCurrentMonth(month)) {
    return monthly[0];
  }

  const upcoming = monthly.filter(
    (event) => differenceInCalendarDays(parseISO(event.date), from) >= 0,
  );
  if (upcoming.length > 0) return upcoming[0];

  return monthly[monthly.length - 1];
}
