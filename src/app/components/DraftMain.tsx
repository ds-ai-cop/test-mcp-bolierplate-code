import React, { useState } from "react";
import { Draft1 } from "./Draft1";
import { Draft2 } from "./Draft2";
import type { RoadmapDatasetEvent } from "../types/time-roadmap";

type DraftMainProps = {
  mode: "light" | "dark";
  onOpenDetail: (event: RoadmapDatasetEvent) => void;
  fullBleed?: boolean;
};

export function DraftMain({ mode, onOpenDetail, fullBleed = false }: DraftMainProps) {
  const [calendarSelected, setCalendarSelected] = useState<Date | undefined>(
    () => new Date(),
  );
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => new Date());
  const [focusEvent, setFocusEvent] = useState<RoadmapDatasetEvent | null>(null);

  const shared = {
    onOpenDetail,
    fullBleed,
    calendarSelected,
    onCalendarSelectedChange: setCalendarSelected,
    calendarMonth,
    onCalendarMonthChange: setCalendarMonth,
    focusEvent,
    onFocusEventChange: setFocusEvent,
  };

  if (mode === "dark") {
    return <Draft2 {...shared} />;
  }

  return <Draft1 {...shared} />;
}
