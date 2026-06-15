import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import roadmap2026 from "../data/2026.json";
import type { RoadmapDatasetEvent } from "../types/time-roadmap";

const jensenHwang = new URL("../../imports/IMG_0012.png", import.meta.url).href;

const DEFAULT_QUOTE =
  "AI는 전기를 넘어선 새로운 인프라가 될 것입니다. 모든 산업의 근본적인 재편이 이미 시작되었습니다. 우리는 지금 새로운 산업 혁명의 초입에 서 있습니다.";

type EventQuickBriefingProps = {
  focusEvent?: RoadmapDatasetEvent | null;
  mode?: "light" | "dark";
};

export function EventQuickBriefing({
  focusEvent,
  mode = "light",
}: EventQuickBriefingProps) {
  const isDark = mode === "dark";
  const talk = focusEvent?.leader_talk;

  const chartData = useMemo(() => {
    const impact = (roadmap2026.events ?? []).reduce(
      (acc, event: { life_impact?: Record<string, number> }) => {
        const lifeImpact = event.life_impact ?? {};
        return {
          automation: acc.automation + (lifeImpact.automation ?? 0),
          new_jobs: acc.new_jobs + (lifeImpact.new_jobs ?? 0),
          daily_convenience:
            acc.daily_convenience + (lifeImpact.daily_convenience ?? 0),
        };
      },
      { automation: 0, new_jobs: 0, daily_convenience: 0 },
    );
    const focusedImpact = (focusEvent as { life_impact?: Record<string, number> })
      ?.life_impact;
    const effective = focusedImpact
      ? {
          automation: focusedImpact.automation ?? impact.automation,
          new_jobs: focusedImpact.new_jobs ?? impact.new_jobs,
          daily_convenience:
            focusedImpact.daily_convenience ?? impact.daily_convenience,
        }
      : impact;

    return [
      {
        name: "업무 자동화율",
        value: effective.automation || 75,
        fill: isDark ? "#64748b" : "#a0abc0",
      },
      {
        name: "신규 직업창출",
        value: effective.new_jobs || 35,
        fill: isDark ? "#94a3b8" : "#d1d5db",
      },
      {
        name: "일상 편의성",
        value: effective.daily_convenience || 92,
        fill: isDark ? "#4a86e8" : "#4a86e8",
      },
    ];
  }, [focusEvent, isDark]);

  return (
    <section
      className={`rounded-[14px] border p-3.5 overflow-hidden shadow-sm ${
        isDark
          ? "bg-slate-900 border-slate-700/80 shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
          : "bg-white border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
      }`}
    >
      <h2
        className={`text-[11px] font-bold tracking-tight mb-3 ${
          isDark ? "text-slate-100" : "text-slate-900"
        }`}
      >
        이벤트 퀵 브리핑
      </h2>

      {/* Leader profile + quote */}
      <div className="flex gap-2 items-start">
        <img
          src={jensenHwang}
          alt={talk?.speaker_name ?? "연사"}
          className={`w-7 h-7 rounded-full object-cover shrink-0 ${
            isDark ? "ring-1 ring-slate-700" : "ring-1 ring-slate-100"
          }`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1 mb-2">
            <span
              className={`text-[9px] font-bold ${
                isDark ? "text-slate-100" : "text-slate-900"
              }`}
            >
              {talk?.speaker_name ?? "젠슨 황"}
            </span>
            <span
              className={`text-[7px] font-semibold px-1.5 py-0.5 rounded-full ${
                isDark
                  ? "bg-blue-950/60 text-blue-300 border border-blue-900/50"
                  : "bg-blue-50 text-[#4a86e8] border border-blue-100"
              }`}
            >
              {talk?.speaker_title ?? "NVIDIA CEO"}
            </span>
          </div>
          <div
            className={`rounded-[10px] px-2.5 py-2 text-[8px] leading-[1.65] ${
              isDark
                ? "bg-slate-800/90 text-slate-300 border border-slate-700/60"
                : "bg-[#f8f9fa] text-slate-700 border border-slate-100"
            }`}
          >
            &ldquo;{talk?.quote ?? DEFAULT_QUOTE}&rdquo;
          </div>
        </div>
      </div>

      <div
        className={`my-3 border-t ${
          isDark ? "border-slate-700/80" : "border-slate-100"
        }`}
      />

      {/* Trend impact chart */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-[3px] h-[10px] rounded-full bg-[#4a86e8] shrink-0" />
        <h3
          className={`text-[9px] font-bold ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          트렌드 파급력 예측
        </h3>
      </div>

      <div className="h-[150px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 4, left: -22, bottom: 4 }}
            barCategoryGap="28%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? "#334155" : "#e5e7eb"}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 7,
                fill: isDark ? "#94a3b8" : "#6b7280",
                fontWeight: 500,
              }}
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tick={{
                fontSize: 6,
                fill: isDark ? "#64748b" : "#9ca3af",
              }}
            />
            <Tooltip
              cursor={{ fill: isDark ? "#1e293b" : "#f8fafc" }}
              contentStyle={{
                borderRadius: "8px",
                border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
                backgroundColor: isDark ? "#0f172a" : "#fff",
                padding: "6px 8px",
                fontSize: "7px",
                fontWeight: 600,
                color: isDark ? "#e2e8f0" : "#1f2937",
              }}
              formatter={(value: number) => [`${value}%`, "파급력 지수"]}
            />
            <Bar dataKey="value" radius={[5, 5, 0, 0]} barSize={28}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
