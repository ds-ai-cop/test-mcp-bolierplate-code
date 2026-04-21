export type RoadmapEventType = "normal" | "urgent";

export interface FeaturedSignal {
  id: string;
  tag: string;
  title: string;
  description: string;
}

export interface EventInsight {
  highlight_title: string;
  highlight_text: string;
  description: string;
}

export interface EventTrend {
  type: string;
  title: string;
}

export interface LeaderTalk {
  speaker_name: string;
  speaker_title: string;
  quote: string;
}

export interface RoadmapDatasetEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  linkurl?: string;
  category: string;
  theme: string;
  insight: EventInsight;
  trends: EventTrend[];
  leader_talk: LeaderTalk;
}

export interface RoadmapDataset {
  featured_signals?: FeaturedSignal[];
  events: RoadmapDatasetEvent[];
}

export interface TimeRoadmapEvent {
  date: string; // YYYY-MM-DD
  name: string;
  type: RoadmapEventType;
}

export interface TimeRoadmapResponse {
  month: string; // YYYY-MM
  ddayEventName: string;
  ddayLabel: string; // ex) D-3
  ddayDate: string; // MM.DD
  events: TimeRoadmapEvent[];
}

