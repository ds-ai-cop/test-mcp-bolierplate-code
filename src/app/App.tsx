import React, { useState } from "react";
import { DraftMain } from "./components/DraftMain";
import { Draft3 } from "./components/Draft3";

import { Moon, Sun } from "lucide-react";
import type { RoadmapDatasetEvent } from "./types/time-roadmap";

export default function App() {
  const FULL_BLEED_MODE = true;
  const [mainMode, setMainMode] = useState<1 | 2>(1);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRoadmapEvent, setSelectedRoadmapEvent] =
    useState<RoadmapDatasetEvent | null>(null);

  const openDraft3Detail = (event: RoadmapDatasetEvent, mode: 1 | 2) => {
    setSelectedRoadmapEvent(event);
    setMainMode(mode);
    setIsDetailOpen(true);
  };

  const isDarkMode = mainMode === 2;

  const handleFloatingLight = () => {
    setMainMode(1);
  };

  const handleFloatingDark = () => {
    setMainMode(2);
  };

  return (
    <div className={`w-full min-h-screen flex flex-col font-sans ${FULL_BLEED_MODE ? "bg-transparent" : "bg-slate-200"}`}>

      <div
        className={`w-full flex-1 transition-opacity duration-300 ${
          FULL_BLEED_MODE ? "p-0" : "px-3 md:px-6 lg:px-8 py-4"
        } ${isDetailOpen ? "draft3" : mainMode === 2 ? "draft2" : "draft1"}`}
      >
        {!isDetailOpen && (
          <DraftMain
            mode={mainMode === 2 ? "dark" : "light"}
            onOpenDetail={(event) => openDraft3Detail(event, mainMode)}
            fullBleed={FULL_BLEED_MODE}
          />
        )}
        {isDetailOpen && (
          <Draft3
            selectedEvent={selectedRoadmapEvent}
            isDarkMode={mainMode === 2}
            onBack={() => setIsDetailOpen(false)}
            fullBleed={FULL_BLEED_MODE}
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