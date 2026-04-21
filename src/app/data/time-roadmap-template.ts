import roadmap2026 from "./2026.json";
import type { RoadmapDataset, TimeRoadmapResponse } from "../types/time-roadmap";

export const TIME_ROADMAP_TEMPLATE: TimeRoadmapResponse = {
  month: "2026-05",
  ddayEventName: "MS Build 2026",
  ddayLabel: "D-Day",
  ddayDate: "05.12",
  events: [
    { date: "2026-05-05", name: "Apple WWDC 2026", type: "normal" },
    { date: "2026-05-12", name: "MS Build 2026", type: "urgent" },
    { date: "2026-05-17", name: "구글 I/O 2026", type: "normal" },
  ],
};

export function buildGeminiTimeRoadmapPrompt(rangeStart: string, rangeEnd: string) {
  const datasetExample = roadmap2026 as RoadmapDataset;
  return `
아래 JSON 스키마를 정확히 지켜서 "연간 컨퍼런스 데이터셋"을 생성해 주세요.

대상 기간: ${rangeStart} ~ ${rangeEnd}

작업 지시:
1) 실제 공개된 컨퍼런스/행사 데이터를 수집해 대상 기간(1년) 일정으로 정리합니다.
2) IT/개발 분야 중심(예: AI, Web, Cloud, Mobile, Data, DevOps)으로 우선 선택합니다.
3) 날짜는 YYYY-MM-DD 형식으로 표준화합니다.
4) 대상 기간에 해당하는 이벤트만 events에 포함합니다.
5) 최소 12개 이상 이벤트를 포함해, 월별로 고르게 분포되도록 구성합니다.
6) 각 이벤트는 시안3 상세 화면에서 바로 렌더링할 수 있도록 insight/trends/leader_talk를 반드시 채웁니다.

요구사항:
- events: 상세 페이지 렌더링용 이벤트 배열(필수)
  - id, title, date, category, theme
  - insight
    - highlight_title, highlight_text, description
  - trends[]
    - type, title
  - leader_talk
    - speaker_name, speaker_title, quote
- featured_signals: 선택(옵션). 없으면 클라이언트가 events에서 상단 시그널을 자동 구성합니다.

응답은 아래 구조를 따라야 함:
{ "events": [...], "featured_signals": [...] }

추가 제약:
- id는 문자열로 유니크해야 합니다.
- date 기준 오름차순 정렬합니다.
- 한국어 설명을 유지합니다.
- "Frontend Dev Summit" 같은 프론트엔드 행사 최소 1개 포함합니다.

타임로드맵 연동 참고(내부 매핑용):
- 아래 필드는 앱에서 자동 계산되므로 응답에 포함하지 않아도 됩니다.
  - month, ddayEventName, ddayLabel, ddayDate
  - TimeRoadmapResponse
  - date: YYYY-MM-DD
  - name: 이벤트명
  - type: "normal" | "urgent"

반드시 JSON만 반환하세요. 설명 문장/마크다운/코드블록은 금지합니다.

스키마 예시:
${JSON.stringify(datasetExample, null, 2)}
`.trim();
}

