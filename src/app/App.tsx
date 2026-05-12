import React, { useMemo, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import { DraftMain } from "./components/DraftMain";
import { Draft3 } from "./components/Draft3";

import { Moon, Sun } from "lucide-react";
import type { RoadmapDatasetEvent } from "./types/time-roadmap";
import roadmap2026 from "./data/2026.json";

const FULL_BLEED_MODE = true;

function DetailPage({
  mainMode,
  fullBleed,
  onBack,
}: {
  mainMode: 1 | 2;
  fullBleed: boolean;
  onBack: () => void;
}) {
  const { eventId } = useParams();
  const decodedId = eventId ? decodeURIComponent(eventId) : "";
  const event = useMemo(() => {
    return (roadmap2026.events as RoadmapDatasetEvent[]).find(
      (e) => e.id === decodedId,
    );
  }, [decodedId]);

  if (!event) {
    return <Navigate to="/" replace />;
  }

  return (
    <Draft3
      selectedEvent={event}
      isDarkMode={mainMode === 2}
      onBack={onBack}
      fullBleed={fullBleed}
    />
  );
}

export default function App() {
  const [mainMode, setMainMode] = useState<1 | 2>(1);
  const [calendarSelected, setCalendarSelected] = useState<Date | undefined>(
    () => new Date(),
  );
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => new Date());
  const [focusEvent, setFocusEvent] = useState<RoadmapDatasetEvent | null>(null);

  const isDarkMode = mainMode === 2;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDetailPath = pathname.startsWith("/event/");

  const handleFloatingLight = () => {
    setMainMode(1);
  };

  const handleFloatingDark = () => {
    setMainMode(2);
  };

  return (
    <div
      className={`w-full min-h-screen flex flex-col font-sans ${FULL_BLEED_MODE ? "bg-transparent" : "bg-slate-200"}`}
    >
      <div
        className={`w-full flex-1 transition-opacity duration-300 ${
          FULL_BLEED_MODE ? "p-0" : "px-3 md:px-6 lg:px-8 py-4"
        } ${isDetailPath ? "draft3" : mainMode === 2 ? "draft2" : "draft1"}`}
      >
        <Routes>
          <Route
            path="/"
            element={
              <DraftMain
                mode={mainMode === 2 ? "dark" : "light"}
                onOpenDetail={(ev) =>
                  navigate(`/event/${encodeURIComponent(ev.id)}`)
                }
                fullBleed={FULL_BLEED_MODE}
                calendarSelected={calendarSelected}
                onCalendarSelectedChange={setCalendarSelected}
                calendarMonth={calendarMonth}
                onCalendarMonthChange={setCalendarMonth}
                focusEvent={focusEvent}
                onFocusEventChange={setFocusEvent}
              />
            }
          />
          <Route
            path="/event/:eventId"
            element={
              <DetailPage
                mainMode={mainMode}
                fullBleed={FULL_BLEED_MODE}
                onBack={() => navigate("/")}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <div className="fixed right-4 bottom-4 z-[120]">
        <div className="flex items-center gap-1 rounded-full border border-slate-300 bg-white/95 backdrop-blur px-1.5 py-1 shadow-lg">
          <button
            type="button"
            onClick={handleFloatingLight}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold transition-colors ${
              !isDarkMode
                ? "bg-slate-100 text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Sun size={12} />
            라이트
          </button>
          <button
            type="button"
            onClick={handleFloatingDark}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold transition-colors ${
              isDarkMode
                ? "bg-slate-900 text-cyan-300"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Moon size={12} />
            다크
          </button>
        </div>
      </div>
    </div>
  );
}
