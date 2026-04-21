import React, { useState } from "react";
import { Draft1 } from "./components/Draft1";
import { Draft2 } from "./components/Draft2";
import { Draft3 } from "./components/Draft3";

import { LayoutTemplate, MonitorSmartphone, Sparkles, Moon, Sun } from "lucide-react";
import type { RoadmapDatasetEvent } from "./types/time-roadmap";

export default function App() {
  //TODO 시안 보이게끔
  const SHOW_DRAFT_SELECTOR = false;
  const [activeDraft, setActiveDraft] = useState<1 | 2 | 3>(1);
  const [selectedRoadmapEvent, setSelectedRoadmapEvent] =
    useState<RoadmapDatasetEvent | null>(null);
  const [detailMode, setDetailMode] = useState<1 | 2>(1);

  const openDraft3Detail = (event: RoadmapDatasetEvent, mode: 1 | 2) => {
    setSelectedRoadmapEvent(event);
    setDetailMode(mode);
    setActiveDraft(3);
  };

  const isDarkMode = activeDraft === 3 ? detailMode === 2 : activeDraft === 2;

  const handleFloatingLight = () => {
    if (activeDraft === 3) {
      setDetailMode(1);
      return;
    }
    setActiveDraft(1);
  };

  const handleFloatingDark = () => {
    if (activeDraft === 3) {
      setDetailMode(2);
      return;
    }
    setActiveDraft(2);
  };

  return (
    <div className={`w-full min-h-screen flex flex-col font-sans ${SHOW_DRAFT_SELECTOR ? "bg-slate-200" : "bg-transparent"}`}>
      {/* Fixed Header for Toggle */}
      {SHOW_DRAFT_SELECTOR && (
        <div className="w-full h-12 bg-white border-b border-slate-300 flex justify-center items-center shadow-sm sticky top-0 z-[100]">
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 gap-0.5">
          <button
            onClick={() => setActiveDraft(1)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
              activeDraft === 1
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <LayoutTemplate size={12} />
            시안 1 (기존)
          </button>
          <button
            onClick={() => setActiveDraft(2)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
              activeDraft === 2
                ? "bg-slate-800 text-cyan-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <MonitorSmartphone size={12} />
            시안 2 (네온)
          </button>
          <button
            onClick={() => setActiveDraft(3)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
              activeDraft === 3
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Sparkles size={12} />
            시안 3 (신규)
          </button>
        </div>
        </div>
      )}

      {/* Render Active Draft */}
      <div
        className={`w-full flex-1 transition-opacity duration-300 ${
          SHOW_DRAFT_SELECTOR ? "px-3 md:px-6 lg:px-8 py-4" : "p-0"
        } ${
          activeDraft === 1 ? "draft1" : activeDraft === 2 ? "draft2" : "draft3"
        }`}
      >
        {activeDraft === 1 && (
          <Draft1
            onOpenDetail={(event) => openDraft3Detail(event, 1)}
            fullBleed={!SHOW_DRAFT_SELECTOR}
          />
        )}
        {activeDraft === 2 && (
          <Draft2
            onOpenDetail={(event) => openDraft3Detail(event, 2)}
            fullBleed={!SHOW_DRAFT_SELECTOR}
          />
        )}
        {activeDraft === 3 && (
          <Draft3
            selectedEvent={selectedRoadmapEvent}
            isDarkMode={detailMode === 2}
            onBack={() => setActiveDraft(detailMode)}
            fullBleed={!SHOW_DRAFT_SELECTOR}
          />
        )}
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