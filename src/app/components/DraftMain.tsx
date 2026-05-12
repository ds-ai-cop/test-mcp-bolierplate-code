import React from "react";
import { Draft1 } from "./Draft1";
import { Draft2 } from "./Draft2";
import type { RoadmapDatasetEvent } from "../types/time-roadmap";

type DraftMainProps = {
  mode: "light" | "dark";
  onOpenDetail: (event: RoadmapDatasetEvent) => void;
  fullBleed?: boolean;
  calendarSelected: Date | undefined;
  onCalendarSelectedChange: (date: Date | undefined) => void;
  calendarMonth: Date;
  onCalendarMonthChange: (month: Date) => void;
  focusEvent: RoadmapDatasetEvent | null;
  onFocusEventChange: (event: RoadmapDatasetEvent | null) => void;
};

export function DraftMain({
  mode,
  onOpenDetail,
  fullBleed = false,
  calendarSelected,
  onCalendarSelectedChange,
  calendarMonth,
  onCalendarMonthChange,
  focusEvent,
  onFocusEventChange,
}: DraftMainProps) {
  const shared = {
    onOpenDetail,
    fullBleed,
    calendarSelected,
    onCalendarSelectedChange,
    calendarMonth,
    onCalendarMonthChange,
    focusEvent,
    onFocusEventChange,
  };

  if (mode === "dark") {
    return <Draft2 {...shared} />;
  }

  return <Draft1 {...shared} />;
}
