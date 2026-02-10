export type ConferenceCategory = "All" | "Frontend" | "Backend" | "AI" | "DevOps";

export interface Conference {
  id: string;
  title: string;
  organizer: string;
  location: string;
  mode: "Online" | "Offline" | "Hybrid";
  category: Exclude<ConferenceCategory, "All">;
  date: string;
  startTime: string;
  endTime: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  highlights: string;
}

export interface ItInsightArticle {
  id: string;
  title: string;
  source: string;
  category: Exclude<ConferenceCategory, "All">;
  publishedAt: string;
  readingTimeMinutes: number;
}

// Figma 데이터 구조 예시 타입
export interface FigmaTextStyle {
  name: string;
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: number;
}

export interface FigmaColorToken {
  name: string;
  hex: string;
}

