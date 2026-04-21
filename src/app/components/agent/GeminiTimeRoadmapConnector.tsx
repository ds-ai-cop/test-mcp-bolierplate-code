import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { addYears, format } from "date-fns";
import roadmap2026 from "../../data/2026.json";
import {
  buildGeminiTimeRoadmapPrompt,
  TIME_ROADMAP_TEMPLATE,
} from "../../data/time-roadmap-template";
import type { RoadmapDataset, TimeRoadmapResponse } from "../../types/time-roadmap";

type GeminiTimeRoadmapConnectorProps = {
  targetYear: number;
  children: (state: {
    data: TimeRoadmapResponse;
    loading: boolean;
    error: string | null;
  }) => ReactNode;
};

// WARNING: 요청에 따라 키를 하드코딩했습니다. 실제 운영에서는 절대 권장되지 않습니다.
const GEMINI_API_KEY = ''
const GEMINI_MODEL = "gemini-2.0-flash";
const CACHE_TTL_MS = 1000 * 60 * 30; // 30분
//TODO 제미나이로 바꾸고 싶을떄
const USE_GEMINI_AGENT = false; // 필요 시 true로 변경

function isValidPayload(payload: unknown): payload is TimeRoadmapResponse {
  if (!payload || typeof payload !== "object") return false;
  const value = payload as Record<string, unknown>;
  return (
    typeof value.month === "string" &&
    typeof value.ddayEventName === "string" &&
    typeof value.ddayLabel === "string" &&
    typeof value.ddayDate === "string" &&
    Array.isArray(value.events)
  );
}

function isRoadmapDatasetPayload(payload: unknown): payload is RoadmapDataset {
  if (!payload || typeof payload !== "object") return false;
  const value = payload as Record<string, unknown>;
  return Array.isArray(value.featured_signals) && Array.isArray(value.events);
}

function mapJsonToRoadmapPayload(source: RoadmapDataset, targetYear: number): TimeRoadmapResponse {
  const events = (source.events ?? [])
    .filter((event) => typeof event.title === "string" && typeof event.date === "string")
    .filter((event) => event.date.startsWith(`${targetYear}-`))
    .map((event) => ({
      date: event.date,
      name: event.title,
      type: "normal" as const,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const firstEvent = events[0];

  return {
    month: firstEvent?.date.slice(0, 7) ?? `${targetYear}-01`,
    ddayEventName: firstEvent?.name ?? TIME_ROADMAP_TEMPLATE.ddayEventName,
    ddayLabel: TIME_ROADMAP_TEMPLATE.ddayLabel,
    ddayDate: firstEvent ? firstEvent.date.slice(5).replace("-", ".") : TIME_ROADMAP_TEMPLATE.ddayDate,
    events: events.length > 0 ? events : TIME_ROADMAP_TEMPLATE.events,
  };
}

export function GeminiTimeRoadmapConnector({
  targetYear,
  children,
}: GeminiTimeRoadmapConnectorProps) {
  const [data, setData] = useState<TimeRoadmapResponse>(
    mapJsonToRoadmapPayload(roadmap2026 as RoadmapDataset, targetYear)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const rangeStart = `${targetYear}-01-01`;
    const rangeEnd = `${targetYear}-12-31`;
    const cacheKey = `time-roadmap:${GEMINI_MODEL}:${rangeStart}:${rangeEnd}`;

    function getCachedData(): TimeRoadmapResponse | null {
      try {
        const raw = localStorage.getItem(cacheKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as {
          savedAt: number;
          data: unknown;
        };
        if (Date.now() - parsed.savedAt > CACHE_TTL_MS) return null;
        if (isValidPayload(parsed.data)) return parsed.data;
        return null;
      } catch {
        return null;
      }
    }

    function setCachedData(payload: TimeRoadmapResponse) {
      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ savedAt: Date.now(), data: payload }),
        );
      } catch {
        // ignore storage errors
      }
    }

    async function fetchWithRetry(url: string, init: RequestInit, retries = 2) {
      let attempt = 0;
      let lastResponse: Response | null = null;

      while (attempt <= retries) {
        const response = await fetch(url, init);
        lastResponse = response;
        if (response.status !== 429) return response;

        if (attempt === retries) break;
        const waitMs = Math.pow(2, attempt) * 1000 + Math.floor(Math.random() * 250);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
        attempt += 1;
      }

      return lastResponse as Response;
    }

    async function loadRoadmap() {
      if (!USE_GEMINI_AGENT) {
        setData(mapJsonToRoadmapPayload(roadmap2026 as RoadmapDataset, targetYear));
        setLoading(false);
        setError(null);
        return;
      }

      const cached = getCachedData();
      if (cached) {
        setData(cached);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (!GEMINI_API_KEY) {
          throw new Error("Gemini API key is not set in connector");
        }

        const res = await fetchWithRetry(
          `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
          {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: buildGeminiTimeRoadmapPrompt(
                      rangeStart,
                      rangeEnd,
                    ),
                  },
                ],
              },
            ],
          }),
          }
        );

        if (!res.ok) {
          throw new Error(`Gemini request failed: ${res.status}`);
        }

        const responseJson = await res.json();
        const text = responseJson?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof text !== "string") {
          throw new Error("Gemini response text is empty");
        }

        const normalized = text
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/, "")
          .trim();

        const payload: unknown = JSON.parse(normalized);
        if (!cancelled && isRoadmapDatasetPayload(payload)) {
          const mapped = mapJsonToRoadmapPayload(payload, targetYear);
          setData(mapped);
          setCachedData(mapped);
        } else if (!cancelled && isValidPayload(payload)) {
          setData(payload);
          setCachedData(payload);
        } else if (!cancelled) {
          throw new Error("Invalid roadmap payload from Gemini");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown agent error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRoadmap();

    return () => {
      cancelled = true;
    };
  }, [targetYear]);

  return children({ data, loading, error });
}

