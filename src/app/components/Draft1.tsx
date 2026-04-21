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

  const signalGradients = [
    "linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)",
    "linear-gradient(135deg, #334155 0%, #0f172a 100%)",
    "linear-gradient(135deg, #10b981 0%, #0f766e 100%)",
  ];

  const signals = useMemo(() => {
    const source = [...(roadmap2026.events ?? [])];
    const shuffled = source.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3).map((event, idx) => ({
      title: event.title,
      tag: event.theme === "상용화" ? "HOT" : event.theme === "PoC" ? "NEW" : "TREND",
      desc: event.insight?.highlight_text ?? event.insight?.description ?? "",
      linkurl: event.linkurl,
      gradient: signalGradients[idx % signalGradients.length],
    }));
  }, []);

  return (
    <section className="mb-0.5">
      <div className="mb-1.5 px-0.5">
        <h2 className="text-xs font-bold text-slate-900">
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
                className={`block rounded-xl p-2.5 h-[115px] flex flex-col justify-between text-white shadow-md ${
                  sig.linkurl ? "cursor-pointer active:scale-[0.98]" : "cursor-default opacity-90"
                } transition-transform`}
                style={{ backgroundImage: sig.gradient }}
              >
                <div className="flex flex-col items-start">
                  <span className="text-[6px] font-bold px-1.5 py-0.5 bg-white/20 rounded-sm backdrop-blur-sm mb-1.5">
                    {sig.tag}
                  </span>
                  <h3 className="text-[10px] font-bold leading-snug drop-shadow-sm">
                    {sig.title}
                  </h3>
                </div>
                <p className="text-[7px] text-white/90 line-clamp-3 leading-relaxed font-light mt-1">
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
// 3. Time Roadmap Section
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
              <button className="p-1 hover:bg-slate-100 rounded-md transition-colors">
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
                                ? "text-red-500"
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

              <button
                type="button"
                onClick={() => selectedDatasetEvent && onOpenDetail(selectedDatasetEvent)}
                disabled={!selectedDatasetEvent}
                className={`rounded-lg p-2.5 flex justify-between items-center border mt-2.5 w-full text-left ${
                  selectedDatasetEvent
                    ? "bg-[#f0f5ff] border-blue-100/50 cursor-pointer active:scale-[0.99]"
                    : "bg-slate-100 border-slate-200 cursor-not-allowed opacity-80"
                } transition-transform`}
              >
                <div className="text-blue-600 font-bold text-[8px] flex items-center gap-1">
                  <span className="text-[7px] font-semibold text-blue-500">
                    [{selectedDdayLabel}]
                  </span>{" "}
                  {selectedDatasetEvent?.title ?? dynamicDdayEventName}
                </div>
                <div className="bg-white text-blue-600 font-bold text-[6px] px-1.5 py-1 rounded-sm border border-blue-100 shadow-sm">
                  {selectedDatasetEvent
                    ? format(parseISO(selectedDatasetEvent.date), "MM.dd")
                    : dynamicDdayDate}
                </div>
              </button>

              <div className="mt-2 rounded-md bg-slate-50 px-2 py-1.5 text-[8px] text-slate-600">
                {" "}
                <span className="font-semibold">
                  {selected ? format(selected, "yyyy.MM.dd") : "없음"}
                </span>
                {selectedEvent && (
                  <span className="ml-1.5 text-blue-600 font-semibold">
                    · {selectedEvent.name}
                  </span>
                )}
              </div>

              {(loading || error) && (
                <div className="text-center text-[7px] text-slate-400 mt-2">
                  {loading
                    ? "Gemini 에이전트 데이터 동기화 중..."
                    : "에이전트 응답 실패로 템플릿 데이터를 사용합니다."}
                </div>
              )}

              <div className="text-center text-[7px] text-slate-400 mt-3 font-medium">
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
// 4. Global Pulse Section
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
          <img
            src={jensenHwang}
            alt="젠슨 황"
            className="w-6 h-6 rounded-full object-cover shadow-sm ring-1 ring-slate-50"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-1.5 text-[8px] font-bold text-slate-800">
            <span className="text-[10px]">🗣</span>
            <span>{talk?.speaker_name ?? "젠슨 황"}</span>
            <span className="text-[6px] font-semibold text-slate-400 bg-slate-100 px-1 py-px rounded-sm">
              {talk?.speaker_title ?? "NVIDIA CEO"}
            </span>
          </div>
          <div className="bg-slate-50 rounded-lg rounded-tl-sm p-2.5 border border-slate-100 text-slate-700 text-[8px] leading-[1.6] relative shadow-inner min-h-[55px] flex items-center">
            "{talk?.quote ??
              "AI는 전기를 넘어선 새로운 인프라가 될 것입니다. 모든 산업의 근본적인 재편이 이미 시작되었습니다. 우리는 지금 새로운 산업 혁명의 초입에 서 있습니다."}"
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

// ----------------------------------------------------------------------
// 5. Life Impact Section
// ----------------------------------------------------------------------
const LifeImpact = () => {
  const data = [
    { name: "업무 자동화율", value: 75, fill: "#94a3b8" },
    { name: "신규 직업창출", value: 35, fill: "#cbd5e1" },
    { name: "일상 편의성", value: 92, fill: "#3b82f6" },
  ];

  return (
    <SectionContainer title="삶의 임팩트 (트렌드 예측)">
      <div className="h-[160px] w-full mt-2.5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            id="life-impact-chart"
            accessibilityLayer={false}
            margin={{ top: 8, right: 0, left: -28, bottom: 12 }}
            barGap={0}
            barCategoryGap="30%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 7,
                fill: "#64748b",
                fontWeight: 600,
              }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 6, fill: "#cbd5e1" }}
            />
            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              contentStyle={{
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 4px -1px rgb(0 0 0 / 0.1)",
                padding: "6px 8px",
                fontSize: "7px",
                fontWeight: 600,
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

export const Draft1 = ({
  onOpenDetail,
  fullBleed = false,
}: {
  onOpenDetail: (event: RoadmapDatasetEvent) => void;
  fullBleed?: boolean;
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
        <CoreSignals />
        <TimeRoadmap onOpenDetail={onOpenDetail} />
        <GlobalPulse />
        <LifeImpact />
      </main>
      
      {/* Global & Third-Party CSS Overrides for Draft 1 */}
      <style>{`
        .draft1 {
          -webkit-text-size-adjust: 156%;
          text-size-adjust: 156%;
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
