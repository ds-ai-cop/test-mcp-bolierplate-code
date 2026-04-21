import React from "react";
import { ChevronLeft, Share2, Bookmark, BarChart3, TrendingUp, Lightbulb } from "lucide-react";
import { differenceInCalendarDays, format, parseISO, startOfDay } from "date-fns";
import type { RoadmapDatasetEvent } from "../types/time-roadmap";

export const Draft3 = ({
  selectedEvent,
  onBack,
  isDarkMode = false,
  fullBleed = false,
}: {
  selectedEvent?: RoadmapDatasetEvent | null;
  onBack?: () => void;
  isDarkMode?: boolean;
  fullBleed?: boolean;
}) => {
  const fallbackEvent: RoadmapDatasetEvent = {
    id: "fallback",
    title: "컨퍼런스를 선택해 주세요",
    date: format(new Date(), "yyyy-MM-dd"),
    category: "Conference",
    theme: "PoC",
    trends: [],
    leader_talk: {
      speaker_name: "리더",
      speaker_title: "연사",
      quote: "시안 1 또는 시안 2에서 날짜를 선택한 뒤 파란 박스를 눌러 상세를 확인하세요.",
    },
    insight: {
      highlight_title: "데이터를 선택하면 상세가 표시됩니다.",
      highlight_text: "타임 로드맵에서 이벤트를 먼저 선택해 주세요.",
      description:
        "선택된 이벤트를 기반으로 인사이트, 트렌드, 리더스 톡을 동적으로 렌더링합니다.",
    },
  };
  const event = selectedEvent ?? fallbackEvent;
  const eventDate = parseISO(event.date);
  const ddayDiff = differenceInCalendarDays(startOfDay(eventDate), startOfDay(new Date()));
  const ddayLabel = ddayDiff <= 0 ? "D-Day" : `D-${ddayDiff}`;

  return (
    <div
      className={`w-full flex flex-col relative overflow-hidden font-sans ${
        fullBleed
          ? "min-h-screen max-w-none mx-0 rounded-none border-0 shadow-none"
          : "max-w-6xl mx-auto min-h-[calc(100vh-5rem)] shadow-[0_0_20px_rgba(0,0,0,0.05)] border rounded-xl"
      } ${
        isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-100"
      }`}
    >
      {/* 1. Header (wf-header) */}
      <header
        className={`sticky top-0 w-full backdrop-blur-md px-3 py-3 flex justify-between items-center z-50 border-b ${
          isDarkMode
            ? "bg-slate-950/90 border-slate-800"
            : "bg-white/90 border-slate-100"
        }`}
      >
        <button
          onClick={onBack}
          className={`p-1 rounded-full transition-colors ${
            isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"
          }`}
        >
          <ChevronLeft size={14} className={isDarkMode ? "text-slate-100" : "text-slate-800"} />
        </button>
        <span className={`text-[11px] font-bold ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
          행사 상세 정보
        </span>
        <div className="flex gap-1">
          <button className={`p-1 rounded-full transition-colors ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}>
            <Share2 size={12} className={isDarkMode ? "text-slate-300" : "text-slate-600"} />
          </button>
          <button className={`p-1 rounded-full transition-colors ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}>
            <Bookmark size={12} className={isDarkMode ? "text-slate-300" : "text-slate-600"} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-8">
        {/* 2. Hero / Event Image (wf-box bg-gray-200) */}
        <div className="relative w-full h-[150px] bg-slate-200 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1762968269894-1d7e1ce8894e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29uZmVyZW5jZSUyMGtleW5vdGV8ZW58MXx8fHwxNzc1MTA3MDk4fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Apple WWDC 2026"
            className="w-full h-full object-cover opacity-90"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

          {/* Texts */}
          <div className="absolute bottom-3 left-3 flex flex-col items-start gap-1.5">
            <div className="bg-red-500 text-white rounded-full px-2 py-0.5 text-[8px] font-bold shadow-sm">
              {ddayLabel}
            </div>
            <h1 className="text-[16px] font-extrabold text-white tracking-tight leading-none drop-shadow-md">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Padding Container for Contents */}
        <div className="px-5 pt-5 flex flex-col gap-5">
          {/* 3. Insight & Impact Section (wf-box bg-blue-50 border-blue-300) */}
          <section
            className={`rounded-lg p-2.5 shadow-sm border ${
              isDarkMode ? "bg-slate-900 border-slate-700" : "bg-blue-50 border-blue-100"
            }`}
          >
            <h2 className={`font-bold text-[10px] mb-2 flex items-center gap-1 ${isDarkMode ? "text-cyan-300" : "text-blue-900"}`}>
              <Lightbulb size={10} className={isDarkMode ? "text-cyan-400" : "text-blue-600"} />
              나를 위한 인사이트 & 임팩트
            </h2>

            {/* Dark block for stat */}
            <div className="w-full bg-slate-900 text-white rounded-md p-2.5 mb-2 shadow-sm relative overflow-hidden">
              <div className="absolute -right-3 -top-3 opacity-10">
                <BarChart3 size={40} />
              </div>
              <div className="text-[7px] text-indigo-200 font-semibold uppercase tracking-wider mb-1">
                {event.insight.highlight_title}
              </div>
              <div className="text-[9px] font-medium leading-relaxed pr-6">
                {event.insight.highlight_text}
              </div>
            </div>

            {/* Detailed text block */}
            <div
              className={`p-2.5 rounded-md border shadow-sm text-[8px] leading-relaxed space-y-2 ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-slate-200"
                  : "bg-white border-blue-100 text-slate-700"
              }`}
            >
              <p>
                {event.insight.description}
              </p>
            </div>
          </section>

          {/* 4. Theme / Progress Bar */}
          <section className={`rounded-lg p-2.5 shadow-sm border ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-100"}`}>
            <div className={`text-[8px] font-bold mb-2 ${isDarkMode ? "text-slate-300" : "text-slate-500"}`}>
              (Theme)
            </div>
            <div className="w-full flex justify-between items-center px-2 relative">
              {/* Background Line */}
              <div className="absolute top-[5px] left-6 right-6 h-[1px] bg-slate-200 -z-10"></div>
              
              {/* Steps */}
              <div className="flex flex-col items-center gap-1 px-1">
                <div className={`w-2.5 h-2.5 rounded-full ${event.theme === "R&D" ? "bg-blue-500" : "bg-slate-300"}`}></div>
                <span className={`text-[7px] ${event.theme === "R&D" ? "font-bold text-blue-600" : "font-semibold text-slate-500"}`}>R&D</span>
              </div>
              
              <div className="flex flex-col items-center gap-1 px-1">
                <div className={`w-2.5 h-2.5 rounded-full ${event.theme === "PoC" ? "bg-blue-500" : "bg-slate-200"}`}></div>
                <span className={`text-[7px] ${event.theme === "PoC" ? "font-bold text-blue-600" : "font-medium text-slate-400"}`}>PoC</span>
              </div>
              
              <div className="flex flex-col items-center gap-1 px-1">
                <div className={`w-2.5 h-2.5 rounded-full ${event.theme === "상용화" ? "bg-blue-500" : "bg-slate-200"}`}></div>
                <span className={`text-[7px] ${event.theme === "상용화" ? "font-bold text-blue-600" : "font-medium text-slate-400"}`}>상용화</span>
              </div>
            </div>
          </section>

          {/* 5. Giant's Movement & Future Blueprint */}
          <section className={`rounded-lg p-2.5 shadow-sm border ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-100"}`}>
            <h3 className={`font-bold text-[10px] pb-1.5 mb-2 flex items-center gap-1 border-b ${isDarkMode ? "text-slate-100 border-slate-700" : "text-slate-900 border-slate-100"}`}>
              <TrendingUp size={10} className={isDarkMode ? "text-cyan-400" : "text-slate-600"} />
              거인의 움직임 & 미래설계도
            </h3>
            <ul className={`text-[9px] flex flex-col gap-1.5 pl-1 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
              {event.trends.map((trend) => (
                <li key={`${trend.type}-${trend.title}`} className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-indigo-500 shrink-0"></div>
                  <span className="font-bold text-indigo-600">[{trend.type}]</span>
                  <span className="truncate">{trend.title}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 6. Global Pulse Section */}
          <section className={`rounded-lg p-2.5 shadow-sm border ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-blue-100"}`}>
            <h3 className={`font-bold text-[10px] mb-2.5 ${isDarkMode ? "text-cyan-300" : "text-blue-900"}`}>
              글로벌 펄스 (리더스 톡 & 논문)
            </h3>
            
            <div className={`p-2 rounded-md border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50/50 border-slate-100"}`}>
              <div className="flex items-center mb-2">
                <img
                  src="https://images.unsplash.com/photo-1741675121621-df90e3195f9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbGUlMjBidXNpbmVzcyUyMGNlbyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NTEwNzA5OHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Jensen Huang"
                  className="w-6 h-6 rounded-full object-cover mr-1.5 border border-slate-200 shadow-sm"
                />
                <div className="flex flex-col">
                  <div className={`text-[9px] font-bold leading-tight ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
                    {event.leader_talk.speaker_name}
                  </div>
                  <div className={`text-[7px] font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {event.leader_talk.speaker_title}
                  </div>
                </div>
              </div>
              <div className={`text-[9px] leading-relaxed font-medium pl-1 border-l-2 border-indigo-400 relative ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                <span className="absolute -top-1 -left-1 text-[12px] text-indigo-300 opacity-50 font-serif">"</span>
                {event.leader_talk.quote}
                <span className="absolute -bottom-2 -right-0 text-[12px] text-indigo-300 opacity-50 font-serif">"</span>
              </div>
            </div>
          </section>
        </div>
      </main>
      <style>{`
        .draft3 {
          -webkit-text-size-adjust: 156%;
          text-size-adjust: 156%;
        }
      `}</style>
    </div>
  );
};