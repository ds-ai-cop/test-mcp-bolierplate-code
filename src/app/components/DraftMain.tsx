import React from "react";
import { Draft1 } from "./Draft1";
import { Draft2 } from "./Draft2";
import type { RoadmapDatasetEvent } from "../types/time-roadmap";

type DraftMainProps = {
  mode: "light" | "dark";
  onOpenDetail: (event: RoadmapDatasetEvent) => void;
  fullBleed?: boolean;
};

export function DraftMain({ mode, onOpenDetail, fullBleed = false }: DraftMainProps) {
  if (mode === "dark") {
    return <Draft2 onOpenDetail={onOpenDetail} fullBleed={fullBleed} />;
  }

  return <Draft1 onOpenDetail={onOpenDetail} fullBleed={fullBleed} />;
}
