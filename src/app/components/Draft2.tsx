import React, { useMemo, useState } from "react";
import { MoreVertical } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
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
import roadmap2026 from "../data/2026.json";
import type { RoadmapDatasetEvent } from "../types/time-roadmap";

const jensenHwang = new URL("../../imports/IMG_0012.png", import.meta.url).href;

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
const CoreSignals = () => {
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
    const source = [...(roadmap2026.events ?? [])];
    const shuffled = source.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3).map((event, idx) => ({
      title: event.title,
      tag: event.theme === "상용화" ? "HOT" : event.theme === "PoC" ? "NEW" : "TREND",
      desc: event.insight?.highlight_text ?? event.insight?.description ?? "",
      linkurl: event.linkurl,
      ...signalStyles[idx % signalStyles.length],
    }));
  }, []);

  return (
    <section className="mb-0.5">
      <div className="mb-1.5 px-0.5">
        <h2 className="text-xs font-bold text-slate-100 tracking-wider">
          오늘의 핵심 시그널
        </h2>
      </div>
      <div className="mx-[-2px]">
        <Slider {...settings}>
          {signals.map((sig, idx) => (
            <div key={idx} className="px-0.5 pb-3">
              <a
                href={sig.linkurl || undefined}
                target={sig.linkurl ? "_blank" : undefined}
                rel={sig.linkurl ? "noopener noreferrer" : undefined}
                className={`${sig.bg} border ${sig.border} rounded-xl p-2.5 h-[115px] flex flex-col justify-between text-slate-200 shadow-[0_0_15px_rgba(0,0,0,0.5)] ${
                  sig.linkurl ? "cursor-pointer active:scale-[0.98]" : "cursor-default opacity-90"
                } transition-transform relative overflow-hidden block`}
              >
                {/* Glow effect in background */}
                <div className={`absolute -top-10 -right-10 w-24 h-24 ${sig.bg.replace('800', '700')} blur-2xl opacity-50 rounded-full`}></div>
                
                <div className="flex flex-col items-start relative z-10">
                  <span className={`text-[6px] font-bold px-1.5 py-0.5 ${sig.accent} bg-slate-900/80 rounded-sm border border-slate-700/50 mb-1.5`}>
                    {sig.tag}
                  </span>
                  <h3 className="text-[10px] font-bold leading-snug text-white">
                    {sig.title}
                  </h3>
                </div>
                <p className="text-[7px] text-slate-400 line-clamp-3 leading-relaxed font-light mt-1 relative z-10">
                  {sig.desc}
                </p>
              </a>
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
}: {
  onOpenDetail: (event: RoadmapDatasetEvent) => void;
}) => {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [viewedMonth, setViewedMonth] = useState<Date>(new Date());

  return (
    <GeminiTimeRoadmapConnector targetYear={viewedMonth.getFullYear()}>
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
        const ddayDiff = ddayBaseEvent
          ? differenceInCalendarDays(ddayBaseEvent.dateObj, today)
          : null;
        const dynamicDdayLabel =
          ddayDiff === null ? data.ddayLabel : ddayDiff === 0 ? "D-Day" : `D-${ddayDiff}`;
        const dynamicDdayEventName = ddayBaseEvent?.name ?? data.ddayEventName;
        const dynamicDdayDate = ddayBaseEvent
          ? format(ddayBaseEvent.dateObj, "MM.dd")
          : data.ddayDate;
        const selectedEvent = selected
          ? events.find((event) => isSameDay(event.dateObj, selected))
          : undefined;
        const selectedDatasetEvent = selectedEvent
          ? roadmap2026.events.find(
              (event) =>
                event.title === selectedEvent.name &&
                event.date === selectedEvent.date,
            )
          : undefined;
        const selectedDdayLabel = selectedDatasetEvent
          ? (() => {
              const diff = differenceInCalendarDays(
                parseISO(selectedDatasetEvent.date),
                today,
              );
              return diff === 0 ? "D-Day" : `D-${diff}`;
            })()
          : dynamicDdayLabel;

        return (
          <SectionContainer
            title="타임 로드맵 (이달의 컨퍼런스)"
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
                  selected={selected}
                  onSelect={setSelected}
                  month={viewedMonth}
                  onMonthChange={setViewedMonth}
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

                      return (
                        <div className="relative flex items-center justify-center w-full h-full">
                          <span
                            className={
                              isSun && !props.activeModifiers.selected
                                ? "text-rose-500"
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

              <button
                type="button"
                onClick={() => selectedDatasetEvent && onOpenDetail(selectedDatasetEvent)}
                disabled={!selectedDatasetEvent}
                className={`rounded-lg p-2.5 flex justify-between items-center border mt-2.5 w-full text-left ${
                  selectedDatasetEvent
                    ? "bg-cyan-950/40 border-cyan-900/60 cursor-pointer active:scale-[0.99]"
                    : "bg-slate-800 border-slate-700 cursor-not-allowed opacity-80"
                } transition-transform`}
              >
                <div className="text-cyan-400 font-bold text-[8px] flex items-center gap-1">
                  <span className="text-[7px] font-semibold text-cyan-300">
                    [{selectedDdayLabel}]
                  </span>{" "}
                  {selectedDatasetEvent?.title ?? dynamicDdayEventName}
                </div>
                <div className="bg-slate-900 text-cyan-400 font-bold text-[6px] px-1.5 py-1 rounded-sm border border-cyan-800 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                  {selectedDatasetEvent
                    ? format(parseISO(selectedDatasetEvent.date), "MM.dd")
                    : dynamicDdayDate}
                </div>
              </button>

              <div className="mt-2 rounded-md bg-slate-800 px-2 py-1.5 text-[8px] text-slate-300">
                {" "}
                <span className="font-semibold">
                  {selected ? format(selected, "yyyy.MM.dd") : "없음"}
                </span>
                {selectedEvent && (
                  <span className="ml-1.5 text-cyan-300 font-semibold">
                    · {selectedEvent.name}
                  </span>
                )}
              </div>

              {(loading || error) && (
                <div className="text-center text-[7px] text-slate-500 mt-2">
                  {loading
                    ? "Gemini 에이전트 데이터 동기화 중..."
                    : "에이전트 응답 실패로 템플릿 데이터를 사용합니다."}
                </div>
              )}

              <div className="text-center text-[7px] text-slate-500 mt-3 font-medium">
                이외의 일정은 캘린더에서 확인 가능합니다.
              </div>
            </div>
          </SectionContainer>
        );
      }}
    </GeminiTimeRoadmapConnector>
  );
};

// ----------------------------------------------------------------------
// 4. Global Pulse Section (Draft 2)
// ----------------------------------------------------------------------
const GlobalPulse = () => {
  const talk = useMemo(() => {
    const source = roadmap2026.events ?? [];
    if (source.length === 0) return undefined;
    const randomEvent = source[Math.floor(Math.random() * source.length)];
    return randomEvent.leader_talk;
  }, []);

  return (
    <SectionContainer title="글로벌 펄스 (리더스 톡)">
      <div className="flex gap-2 items-start mt-2.5">
        <div className="relative shrink-0 pt-0.5">
          <div className="w-6 h-6 rounded-full p-[1px] bg-gradient-to-tr from-cyan-500 to-fuchsia-500">
            <img
              src={jensenHwang}
              alt="젠슨 황"
              className="w-full h-full rounded-full object-cover border-[1px] border-slate-900"
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-1.5 text-[8px] font-bold text-slate-200">
            <span className="text-[10px]">🗣</span>
            <span>{talk?.speaker_name ?? "젠슨 황"}</span>
            <span className="text-[6px] font-semibold text-slate-400 bg-slate-800 px-1 py-px rounded-sm border border-slate-700">
              {talk?.speaker_title ?? "NVIDIA CEO"}
            </span>
          </div>
          <div className="bg-slate-800/80 rounded-lg rounded-tl-sm p-2.5 border border-slate-700 text-slate-300 text-[8px] leading-[1.6] relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] min-h-[55px] flex items-center">
            "{talk?.quote ??
              "AI는 전기를 넘어선 새로운 인프라가 될 것입니다. 모든 산업의 근본적인 재편이 이미 시작되었습니다. 우리는 지금 새로운 산업 혁명의 초입에 서 있습니다."}"
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

// ----------------------------------------------------------------------
// 5. Life Impact Section (Draft 2)
// ----------------------------------------------------------------------
const LifeImpact = () => {
  const data = [
    { name: "업무 자동화율", value: 75, fill: "#0ea5e9" }, // sky-500
    { name: "신규 직업창출", value: 35, fill: "#8b5cf6" }, // violet-500
    { name: "일상 편의성", value: 92, fill: "#06b6d4" },   // cyan-500
  ];

  return (
    <SectionContainer title="삶의 임팩트 (트렌드 예측)">
      <div className="h-[160px] w-full mt-2.5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            id="life-impact-chart-2"
            accessibilityLayer={false}
            margin={{ top: 8, right: 0, left: -28, bottom: 12 }}
            barGap={0}
            barCategoryGap="30%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#334155"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 7,
                fill: "#94a3b8",
                fontWeight: 600,
              }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 6, fill: "#64748b" }}
            />
            <Tooltip
              cursor={{ fill: "#1e293b" }}
              contentStyle={{
                backgroundColor: "#0f172a",
                borderRadius: "6px",
                border: "1px solid #334155",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.5)",
                padding: "6px 8px",
                fontSize: "7px",
                fontWeight: 600,
                color: "#f8fafc"
              }}
              formatter={(value: number) => [
                `${value}%`,
                "파급력 지수",
              ]}
            />
            <Bar
              dataKey="value"
              radius={[3, 3, 0, 0]}
              barSize={24}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionContainer>
  );
};

export const Draft2 = ({
  onOpenDetail,
  fullBleed = false,
}: {
  onOpenDetail: (event: RoadmapDatasetEvent) => void;
  fullBleed?: boolean;
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
        <CoreSignals />
        <TimeRoadmap onOpenDetail={onOpenDetail} />
        <GlobalPulse />
        <LifeImpact />
      </main>
      
      {/* Global & Third-Party CSS Overrides for Draft 2 */}
      <style>{`
        .draft2 {
          -webkit-text-size-adjust: 156%;
          text-size-adjust: 156%;
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
