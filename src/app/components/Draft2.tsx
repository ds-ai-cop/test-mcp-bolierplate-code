import React, { useMemo } from "react";
import { MoreVertical } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  differenceInCalendarDays,
  format,
  isSameDay,
  parseISO,
  startOfDay,
} from "date-fns";
import { ko } from "date-fns/locale/ko";
import { GeminiTimeRoadmapConnector } from "./agent/GeminiTimeRoadmapConnector";
import { EventQuickBriefing } from "./EventQuickBriefing";
import { MonthlyEventTimeline } from "./MonthlyEventTimeline";
import roadmap2026 from "../data/2026.json";
import type { RoadmapDatasetEvent } from "../types/time-roadmap";

// ----------------------------------------------------------------------
// Section Container Helper (Draft 2 - Dark/Neon theme)
// ----------------------------------------------------------------------
const SectionContainer = ({
  title,
  children,
  headerRight,
}: {
  title: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}) => (
  <section className="bg-slate-900 rounded-[10px] shadow-lg border border-slate-700/60 p-3.5 overflow-hidden backdrop-blur-sm">
    <div className="flex justify-between items-center mb-3.5">
      <h2 className="text-xs font-bold text-slate-100 tracking-wider">
        {title}
      </h2>
      {headerRight && (
        <div className="text-slate-500 flex items-center">
          {headerRight}
        </div>
      )}
    </div>
    {children}
  </section>
);

// ----------------------------------------------------------------------
// 2. Core Signals Section (Draft 2)
// ----------------------------------------------------------------------
const CoreSignals = ({
  onOpenDetail,
}: {
  onOpenDetail: (event: RoadmapDatasetEvent) => void;
}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const signalStyles = [
    { bg: "bg-slate-800", border: "border-cyan-500/50", accent: "text-cyan-400" },
    { bg: "bg-slate-800", border: "border-fuchsia-500/50", accent: "text-fuchsia-400" },
    { bg: "bg-slate-800", border: "border-emerald-500/50", accent: "text-emerald-400" },
  ];

  const signals = useMemo(() => {
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const monthlyEvents = (roadmap2026.events ?? []).filter((event) =>
      event.date.startsWith(currentMonthKey),
    );
    const source = [...monthlyEvents];
    const shuffled = source.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3).map((event, idx) => ({
      dday:
        (() => {
          const diff = differenceInCalendarDays(parseISO(event.date), startOfDay(new Date()));
          if (diff === 0) return "D-Day";
          if (diff > 0) return `D-${diff}`;
          return `D+${Math.abs(diff)}`;
        })(),
      title: event.title,
      tag: event.theme === "상용화" ? "HOT" : event.theme === "PoC" ? "NEW" : "TREND",
      desc: event.insight?.highlight_text ?? event.insight?.description ?? "",
      event,
      ...signalStyles[idx % signalStyles.length],
    }));
  }, []);

  if (signals.length === 0) {
    return null;
  }

  return (
    <section className="mb-0.5">
      <div className="mb-1.5 px-0.5">
        <h2 className="text-xs font-bold text-slate-100 tracking-wider">
          이달의 핵심 시그널
        </h2>
      </div>
      <div className="mx-[-2px]">
        <Slider {...settings}>
          {signals.map((sig, idx) => (
            <div key={idx} className="px-0.5 pb-3">
              <button
                type="button"
                onClick={() => onOpenDetail(sig.event)}
                className={`${sig.bg} border ${sig.border} rounded-xl p-2.5 h-[115px] flex flex-col justify-between text-slate-200 shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden block w-full text-left`}
              >
                {/* Glow effect in background */}
                <div className={`absolute -top-10 -right-10 w-24 h-24 ${sig.bg.replace('800', '700')} blur-2xl opacity-50 rounded-full`}></div>
                
                <div className="flex flex-col items-start relative z-10">
                  <div className="flex items-center gap-1 mb-1.5">
                    <span className={`text-[6px] font-bold px-1.5 py-0.5 ${sig.accent} bg-slate-900/80 rounded-sm border border-slate-700/50`}>
                      {sig.tag}
                    </span>
                    <span className="text-[6px] font-bold px-1.5 py-0.5 text-cyan-200 bg-slate-900/80 rounded-sm border border-slate-700/50">
                      {sig.dday}
                    </span>
                  </div>
                  <h3 className="text-[10px] font-bold leading-snug text-white">
                    {sig.title}
                  </h3>
                </div>
                <p className="text-[7px] text-slate-400 line-clamp-3 leading-relaxed font-light mt-1 relative z-10">
                  {sig.desc}
                </p>
              </button>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

// ----------------------------------------------------------------------
// 3. Time Roadmap Section (Draft 2)
// ----------------------------------------------------------------------
const TimeRoadmap = ({
  onOpenDetail,
  onFocusEventChange,
  calendarSelected,
  onCalendarSelectedChange,
  calendarMonth,
  onCalendarMonthChange,
}: {
  onOpenDetail: (event: RoadmapDatasetEvent) => void;
  onFocusEventChange?: (event: RoadmapDatasetEvent | null) => void;
  calendarSelected: Date | undefined;
  onCalendarSelectedChange: (date: Date | undefined) => void;
  calendarMonth: Date;
  onCalendarMonthChange: (month: Date) => void;
}) => {
  return (
    <GeminiTimeRoadmapConnector targetYear={calendarMonth.getFullYear()}>
      {({ data, loading, error }) => {
        const events = data.events.map((event) => ({
          ...event,
          dateObj: parseISO(event.date),
        }));
        const today = startOfDay(new Date());
        const upcomingEvents = events
          .filter((event) => differenceInCalendarDays(event.dateObj, today) >= 0)
          .sort(
            (a, b) =>
              differenceInCalendarDays(a.dateObj, today) -
              differenceInCalendarDays(b.dateObj, today),
          );
        const ddayBaseEvent =
          upcomingEvents[0] ??
          events
            .slice()
            .sort(
              (a, b) =>
                Math.abs(differenceInCalendarDays(a.dateObj, today)) -
                Math.abs(differenceInCalendarDays(b.dateObj, today)),
            )[0];
        const selectedEvents = calendarSelected
          ? events.filter((event) => isSameDay(event.dateObj, calendarSelected))
          : [];
        const selectedDatasetEvents = roadmap2026.events.filter((event) =>
          selectedEvents.some(
            (selectedEvent) =>
              event.title === selectedEvent.name &&
              event.date === selectedEvent.date,
          ),
        ) as RoadmapDatasetEvent[];
        const selectedDatasetEvent = selectedDatasetEvents[0];
        const ddayDatasetEvent = ddayBaseEvent
          ? roadmap2026.events.find(
              (event) =>
                event.title === ddayBaseEvent.name &&
                event.date === ddayBaseEvent.date,
            )
          : undefined;
        onFocusEventChange?.(selectedDatasetEvent ?? ddayDatasetEvent ?? null);

        const monthKey = format(calendarMonth, "yyyy-MM");
        const monthlyDatasetEvents = (roadmap2026.events as RoadmapDatasetEvent[])
          .filter((event) => event.date.startsWith(monthKey))
          .sort((a, b) => a.date.localeCompare(b.date));
        const selectedEventIds = new Set(
          selectedDatasetEvents.map((event) => event.id),
        );

        const highlightedEventId =
          selectedDatasetEvent?.id ?? ddayDatasetEvent?.id ?? null;

        return (
          <SectionContainer
            title="타임 로드맵 (이달의 일정)"
            headerRight={
              <button className="p-1 hover:bg-slate-800 text-slate-400 rounded-md transition-colors">
                <MoreVertical size={10} />
              </button>
            }
          >
            <div className="flex flex-col">
              <div className="mb-2.5">
                <DayPicker
                  mode="single"
                  selected={calendarSelected}
                  onSelect={onCalendarSelectedChange}
                  fixedWeeks
                  month={calendarMonth}
                  onMonthChange={onCalendarMonthChange}
                  locale={ko}
                  formatters={{
                    formatCaption: (month) => format(month, "yyyy.MM"),
                    formatWeekdayName: (day) =>
                      ["S", "M", "T", "W", "T", "F", "S"][day.getDay()],
                  }}
                  components={{
                    DayContent: (props) => {
                      const date = props.date;
                      const isEvent = events.some((e) =>
                        isSameDay(e.dateObj, date),
                      );
                      const isSun = date.getDay() === 0;
                      const isSat = date.getDay() === 6;

                      return (
                        <div className="relative flex items-center justify-center w-full h-full">
                          <span
                            className={
                              isSun && !props.activeModifiers.selected
                                ? "text-rose-500"
                                : isSat && !props.activeModifiers.selected
                                  ? "text-blue-400"
                                  : ""
                            }
                          >
                            {date.getDate()}
                          </span>
                          {isEvent && (
                            <div className="absolute top-[1px] right-[8%] w-[5px] h-[5px] bg-cyan-400 rounded-full shadow-[0_0_4px_#22d3ee]" />
                          )}
                        </div>
                      );
                    },
                  }}
                />
              </div>

              <MonthlyEventTimeline
                events={monthlyDatasetEvents}
                selectedEventIds={selectedEventIds}
                highlightedEventId={highlightedEventId}
                mode="dark"
                onEventClick={(event) => {
                  onCalendarSelectedChange(parseISO(event.date));
                  onFocusEventChange?.(event);
                  onOpenDetail(event);
                }}
              />

              {(loading || error) && (
                <div className="text-center text-[7px] text-slate-500 mt-2">
                  {loading
                    ? "Gemini 에이전트 데이터 동기화 중..."
                    : "에이전트 응답 실패로 템플릿 데이터를 사용합니다."}
                </div>
              )}

            </div>
          </SectionContainer>
        );
      }}
    </GeminiTimeRoadmapConnector>
  );
};

export const Draft2 = ({
  onOpenDetail,
  fullBleed = false,
  calendarSelected,
  onCalendarSelectedChange,
  calendarMonth,
  onCalendarMonthChange,
  focusEvent,
  onFocusEventChange,
}: {
  onOpenDetail: (event: RoadmapDatasetEvent) => void;
  fullBleed?: boolean;
  calendarSelected: Date | undefined;
  onCalendarSelectedChange: (date: Date | undefined) => void;
  calendarMonth: Date;
  onCalendarMonthChange: (month: Date) => void;
  focusEvent: RoadmapDatasetEvent | null;
  onFocusEventChange: (event: RoadmapDatasetEvent | null) => void;
}) => {
  return (
    <div
      className={`w-full bg-slate-950 flex flex-col relative overflow-hidden ${
        fullBleed
          ? "min-h-screen max-w-none mx-0 rounded-none border-0 shadow-none"
          : "max-w-6xl mx-auto min-h-[calc(100vh-5rem)] shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-slate-800 rounded-xl"
      }`}
    >
      <header className="sticky top-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 z-50 h-[56px] pt-[env(safe-area-inset-top)] flex items-center justify-center shadow-md shrink-0">
        <div className="font-extrabold text-[12px] text-cyan-300 bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
          Tech-Horizon
        </div>
      </header>
      <main className="flex-1 px-4 py-5 flex flex-col gap-6 pb-20">
        <CoreSignals onOpenDetail={onOpenDetail} />
        <TimeRoadmap
          onOpenDetail={onOpenDetail}
          onFocusEventChange={onFocusEventChange}
          calendarSelected={calendarSelected}
          onCalendarSelectedChange={onCalendarSelectedChange}
          calendarMonth={calendarMonth}
          onCalendarMonthChange={onCalendarMonthChange}
        />
        <EventQuickBriefing focusEvent={focusEvent} mode="dark" />
      </main>
      
      {/* Global & Third-Party CSS Overrides for Draft 2 */}
      <style>{`
        .draft2 {
          -webkit-text-size-adjust: var(--app-text-scale);
          text-size-adjust: var(--app-text-scale);
        }
        .draft2 .slick-slider,
        .draft2 .slick-list,
        .draft2 .slick-track { min-height: 115px; }
        .draft2 .slick-dots { bottom: -6px !important; }
        .draft2 .slick-dots li { margin: 0 1px !important; width: 10px !important; height: 10px !important; }
        .draft2 .slick-dots li button { width: 10px !important; height: 10px !important; padding: 0 !important; }
        .draft2 .slick-dots li button:before { font-size: 4px !important; color: #475569 !important; opacity: 1 !important; line-height: 10px !important; width: 10px !important; height: 10px !important; }
        .draft2 .slick-dots li.slick-active button:before { color: #22d3ee !important; }
        
        .draft2 .rdp { --rdp-cell-size: 24px; margin: 0; width: 100%; color: #e2e8f0; }
        .draft2 .rdp-months { justify-content: center; width: 100%; }
        .draft2 .rdp-month { width: 100%; }
        .draft2 .rdp-table { width: 100%; max-width: 100%; }
        .draft2 .rdp-head_cell { font-size: 7px; font-weight: 600; color: #94a3b8; padding-bottom: 6px; text-transform: uppercase; }
        .draft2 .rdp-head_cell:first-child { color: #f43f5e; }
        .draft2 .rdp-head_cell:last-child { color: #38bdf8; }
        .draft2 .rdp-day { font-size: 8px; font-weight: 600; color: #cbd5e1; }
        .draft2 .rdp-day_selected { background-color: #06b6d4 !important; color: #0f172a !important; font-weight: bold; border-radius: 6px; box-shadow: 0 0 10px rgba(6,182,212,0.5); }
        .draft2 .rdp-day_selected:hover { background-color: #0891b2 !important; }
        .draft2 .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: #1e293b; border-radius: 6px; }
        .draft2 .rdp-caption { justify-content: space-between; padding: 0 2px 8px 2px; }
        .draft2 .rdp-caption_label { font-size: 9px; font-weight: 700; color: #f8fafc; }
        .draft2 .rdp-nav { display: flex; gap: 3px; }
        .draft2 .rdp-nav_button { width: 22px; height: 22px; border-radius: 6px; background: #1e293b; border: 1px solid #334155; color: #94a3b8; display: flex; align-items: center; justify-content: center; }
        .draft2 .rdp-nav_button:hover { background: #334155; color: #f1f5f9; }
        .draft2 .rdp-nav_icon { width: 12px; height: 12px; }

      `}</style>
    </div>
  );
};
