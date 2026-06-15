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
// Section Container Helper
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
  <section className="bg-white rounded-[10px] shadow-sm border border-gray-100 p-3.5 overflow-hidden">
    <div className="flex justify-between items-center mb-3.5">
      <h2 className="text-xs font-bold text-slate-800 tracking-tight">
        {title}
      </h2>
      {headerRight && (
        <div className="text-slate-400 flex items-center">
          {headerRight}
        </div>
      )}
    </div>
    {children}
  </section>
);

// ----------------------------------------------------------------------
// 2. Core Signals Section
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

  const signalGradients = [
    "linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)",
    "linear-gradient(135deg, #334155 0%, #0f172a 100%)",
    "linear-gradient(135deg, #10b981 0%, #0f766e 100%)",
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
      gradient: signalGradients[idx % signalGradients.length],
    }));
  }, []);

  if (signals.length === 0) {
    return null;
  }

  return (
    <section className="mb-0.5">
      <div className="mb-1.5 px-0.5">
        <h2 className="text-xs font-bold text-slate-900">
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
                className="block rounded-xl p-2.5 h-[115px] flex flex-col justify-between text-white shadow-md cursor-pointer active:scale-[0.98] transition-transform w-full text-left"
                style={{ backgroundImage: sig.gradient }}
              >
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1 mb-1.5">
                    <span className="text-[6px] font-bold px-1.5 py-0.5 bg-white/20 rounded-sm backdrop-blur-sm">
                      {sig.tag}
                    </span>
                    <span className="text-[6px] font-bold px-1.5 py-0.5 bg-white/25 rounded-sm backdrop-blur-sm">
                      {sig.dday}
                    </span>
                  </div>
                  <h3 className="text-[10px] font-bold leading-snug drop-shadow-sm">
                    {sig.title}
                  </h3>
                </div>
                <p className="text-[7px] text-white/90 line-clamp-3 leading-relaxed font-light mt-1">
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
// 3. Time Roadmap Section
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
            title="타임 로드맵"
            headerRight={
              <button className="p-1 hover:bg-slate-100 rounded-md transition-colors">
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
                                ? "text-red-500"
                                : isSat && !props.activeModifiers.selected
                                  ? "text-blue-500"
                                  : ""
                            }
                          >
                            {date.getDate()}
                          </span>
                          {isEvent && (
                            <div className="absolute top-[1px] right-[8%] w-[5px] h-[5px] bg-red-500 rounded-full border border-white" />
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
                mode="light"
                onEventClick={(event) => {
                  onCalendarSelectedChange(parseISO(event.date));
                  onFocusEventChange?.(event);
                  onOpenDetail(event);
                }}
              />

              {(loading || error) && (
                <div className="text-center text-[7px] text-slate-400 mt-2">
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

export const Draft1 = ({
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
      className={`w-full bg-slate-50 flex flex-col relative overflow-hidden ${
        fullBleed
          ? "min-h-screen max-w-none mx-0 rounded-none border-0 shadow-none"
          : "max-w-6xl mx-auto min-h-[calc(100vh-5rem)] shadow-2xl border border-gray-200 rounded-xl"
      }`}
    >
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 h-[56px] flex items-center justify-center shadow-sm shrink-0">
        <div className="font-extrabold text-[12px] text-slate-800 tracking-tight">
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
        <EventQuickBriefing focusEvent={focusEvent} mode="light" />
      </main>
      
      {/* Global & Third-Party CSS Overrides for Draft 1 */}
      <style>{`
        .draft1 {
          -webkit-text-size-adjust: var(--app-text-scale);
          text-size-adjust: var(--app-text-scale);
        }
        .draft1 .slick-slider,
        .draft1 .slick-list,
        .draft1 .slick-track { background: transparent !important; }
        .draft1 .slick-slider,
        .draft1 .slick-list,
        .draft1 .slick-track { min-height: 115px; }
        .draft1 .slick-list { overflow: visible !important; }
        .draft1 .slick-slide > div {
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .draft1 .slick-dots { bottom: -6px !important; }
        .draft1 .slick-dots li { margin: 0 1px !important; width: 10px !important; height: 10px !important; }
        .draft1 .slick-dots li button { width: 10px !important; height: 10px !important; padding: 0 !important; }
        .draft1 .slick-dots li button:before { font-size: 4px !important; color: #cbd5e1 !important; opacity: 1 !important; line-height: 10px !important; width: 10px !important; height: 10px !important; }
        .draft1 .slick-dots li.slick-active button:before { color: #3b82f6 !important; }
        
        .draft1 .rdp { --rdp-cell-size: 24px; margin: 0; width: 100%; }
        .draft1 .rdp-months { justify-content: center; width: 100%; }
        .draft1 .rdp-month { width: 100%; }
        .draft1 .rdp-table { width: 100%; max-width: 100%; }
        .draft1 .rdp-head_cell { font-size: 7px; font-weight: 600; color: #64748b; padding-bottom: 6px; text-transform: uppercase; }
        .draft1 .rdp-head_cell:first-child { color: #ef4444; }
        .draft1 .rdp-head_cell:last-child { color: #3b82f6; }
        .draft1 .rdp-day { font-size: 8px; font-weight: 600; color: #334155; }
        .draft1 .rdp-day_selected { background-color: #3b82f6 !important; color: white !important; font-weight: bold; border-radius: 6px; }
        .draft1 .rdp-day_selected:hover { background-color: #2563eb !important; }
        .draft1 .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: #f1f5f9; border-radius: 6px; }
        .draft1 .rdp-caption { justify-content: space-between; padding: 0 2px 8px 2px; }
        .draft1 .rdp-caption_label { font-size: 9px; font-weight: 700; color: #1e293b; }
        .draft1 .rdp-nav { display: flex; gap: 3px; }
        .draft1 .rdp-nav_button { width: 22px; height: 22px; border-radius: 6px; background: #f8fafc; border: 1px solid #e2e8f0; color: #64748b; display: flex; align-items: center; justify-content: center; }
        .draft1 .rdp-nav_button:hover { background: #f1f5f9; }
        .draft1 .rdp-nav_icon { width: 12px; height: 12px; }

      `}</style>
    </div>
  );
};
