import React, { useEffect, useMemo, useRef } from "react";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import type { RoadmapDatasetEvent } from "../types/time-roadmap";

type MonthlyEventTimelineProps = {
  events: RoadmapDatasetEvent[];
  selectedEventIds: Set<string>;
  highlightedEventId?: string | null;
  mode?: "light" | "dark";
  onEventClick: (event: RoadmapDatasetEvent) => void;
};

const DEFAULT_STYLE = {
  light: {
    dot: "#94a3b8",
    border: "#e2e8f0",
    title: "#334155",
    sub: "#64748b",
    bg: "#ffffff",
  },
  dark: {
    dot: "#64748b",
    border: "#334155",
    title: "#e2e8f0",
    sub: "#94a3b8",
    bg: "#0f172a",
  },
};

const SELECTED_STYLE = {
  light: {
    dot: "#4a86e8",
    border: "#4a86e8",
    title: "#2563eb",
    sub: "#3b82f6",
    bg: "#f0f5ff",
  },
  dark: {
    dot: "#4a86e8",
    border: "#4a86e8",
    title: "#60a5fa",
    sub: "#93c5fd",
    bg: "rgba(30, 58, 138, 0.25)",
  },
};

function calendarDiffToDdayLabel(diff: number): string {
  if (diff === 0) return "D-Day";
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

export function MonthlyEventTimeline({
  events,
  selectedEventIds,
  highlightedEventId,
  mode = "light",
  onEventClick,
}: MonthlyEventTimelineProps) {
  const isDark = mode === "dark";
  const defaultStyle = DEFAULT_STYLE[isDark ? "dark" : "light"];
  const selectedStyle = SELECTED_STYLE[isDark ? "dark" : "light"];
  const today = new Date();
  const itemRefs = useRef(new Map<string, HTMLDivElement>());

  const scrollTargetId = useMemo(() => {
    const selected = events.find((event) => selectedEventIds.has(event.id));
    if (selected) return selected.id;
    if (
      highlightedEventId &&
      events.some((event) => event.id === highlightedEventId)
    ) {
      return highlightedEventId;
    }
    return null;
  }, [events, selectedEventIds, highlightedEventId]);

  const scrollable = events.length > 1;

  useEffect(() => {
    if (!scrollTargetId || !scrollable) return;

    const frame = requestAnimationFrame(() => {
      itemRefs.current.get(scrollTargetId)?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [scrollTargetId, scrollable]);

  if (events.length === 0) {
    return (
      <div
        className={`mt-2 border-t pt-2 text-[8px] ${
          isDark ? "border-slate-700 text-slate-500" : "border-slate-100 text-slate-400"
        }`}
      >
        이번 달 등록된 컨퍼런스가 없습니다.
      </div>
    );
  }

  return (
    <div
      className={`mt-2 border-t pt-2 ${
        isDark ? "border-slate-700" : "border-slate-100"
      }`}
    >
      <div
        className={`relative ${
          scrollable ? "max-h-[168px] overflow-y-auto pr-0.5" : ""
        }`}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: isDark ? "#475569 transparent" : "#cbd5e1 transparent",
        }}
      >
        <div
          className="absolute left-[46px] top-2 bottom-2 w-px"
          style={{ backgroundColor: isDark ? "#334155" : "#e2e8f0" }}
        />

        <div className="flex flex-col gap-2.5">
          {events.map((event) => {
            const eventDate = parseISO(event.date);
            const isSelected =
              selectedEventIds.has(event.id) || event.id === highlightedEventId;
            const accent = isSelected ? selectedStyle : defaultStyle;
            const ddayLabel = calendarDiffToDdayLabel(
              differenceInCalendarDays(eventDate, today),
            );

            return (
              <div
                key={event.id}
                ref={(node) => {
                  if (node) itemRefs.current.set(event.id, node);
                  else itemRefs.current.delete(event.id);
                }}
                className="relative flex items-stretch gap-2"
              >
                <div
                  className={`w-[42px] shrink-0 pt-1.5 text-[7px] leading-tight ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  {format(eventDate, "dd일")}
                </div>

                <div className="relative z-10 flex w-3 shrink-0 justify-center pt-2">
                  <span
                    className={`h-2 w-2 rounded-full ring-2 ${
                      isDark ? "ring-slate-900" : "ring-white"
                    }`}
                    style={{
                      backgroundColor: accent.dot,
                      boxShadow: isSelected
                        ? "0 0 0 2px rgba(74, 134, 232, 0.2)"
                        : undefined,
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => onEventClick(event)}
                  className={`min-w-0 flex-1 rounded-lg px-2.5 py-2 text-left transition-transform active:scale-[0.99] ${
                    isSelected ? "border border-dashed" : "border"
                  }`}
                  style={{
                    backgroundColor: accent.bg,
                    borderColor: accent.border,
                  }}
                >
                  <div
                    className="text-[8px] font-bold leading-snug"
                    style={{ color: accent.title }}
                  >
                    {event.title}
                  </div>
                  <div
                    className="mt-0.5 text-[7px] leading-snug"
                    style={{ color: accent.sub }}
                  >
                    [{ddayLabel}] {event.category}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
