import {
  differenceInCalendarDays,
  format,
  isSameDay,
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

export function getNearestFutureEvent(
  from: Date = startOfDay(new Date()),
): RoadmapDatasetEvent | undefined {
  return (roadmap2026.events as RoadmapDatasetEvent[])
    .filter(
      (event) => differenceInCalendarDays(parseISO(event.date), from) >= 0,
    )
    .sort((a, b) => a.date.localeCompare(b.date))[0];
}

export function getInitialLandingState(): {
  calendarSelected: Date;
  calendarMonth: Date;
  focusEvent: RoadmapDatasetEvent | null;
} {
  const today = startOfDay(new Date());
  const currentMonthEvents = getMonthlyEvents(today);

  if (currentMonthEvents.length > 0) {
    return {
      calendarSelected: today,
      calendarMonth: today,
      focusEvent: getDefaultMonthlyEvent(today) ?? null,
    };
  }

  const nearestFuture = getNearestFutureEvent(today);
  if (nearestFuture) {
    const eventDate = parseISO(nearestFuture.date);
    return {
      calendarSelected: eventDate,
      calendarMonth: eventDate,
      focusEvent: nearestFuture,
    };
  }

  return {
    calendarSelected: today,
    calendarMonth: today,
    focusEvent: null,
  };
}

/** Skip timeline highlight when selected day has no events (incl. today on current month). */
export function shouldClearTimelineHighlight({
  calendarMonth,
  calendarSelected,
  hasUserPickedDate,
  selectedDatasetEventsCount,
  isSelectedInViewedMonth,
}: {
  calendarMonth: Date;
  calendarSelected: Date | undefined;
  hasUserPickedDate: boolean;
  selectedDatasetEventsCount: number;
  isSelectedInViewedMonth: boolean;
}): boolean {
  if (!isSelectedInViewedMonth || calendarSelected == null) return false;
  if (selectedDatasetEventsCount > 0) return false;
  if (hasUserPickedDate) return true;

  return (
    isCurrentMonth(calendarMonth) &&
    isSameDay(calendarSelected, startOfDay(new Date()))
  );
}
